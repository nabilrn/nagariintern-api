const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const {
  UnitKerja,
  Permintaan,
  PerguruanTinggi,
  Smk,
  Prodi,
  Jurusan,
  Users,
  Mahasiswa,
  Siswa,
  Dokumen,
  Jadwal
} = require("../models/index");
const sequelize = require("sequelize");
const libre = require('libreoffice-convert');
const util = require('util');
const convert = util.promisify(libre.convert);
const nodemailer = require("nodemailer");

const calculateAvailableQuota = async () => {
  const unitKerjas = await UnitKerja.findAll();
  const acceptedRequests = await Permintaan.findAll({
    where: {
      statusId: {
        [sequelize.Op.in]: [2, 3, 4]
      },
    },
    attributes: [
      'unitKerjaId',
      'type',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['unitKerjaId', 'type']
  });

  return unitKerjas.map(unit => {
    const mhsCount = acceptedRequests.find(r =>
      r.unitKerjaId === unit.id && r.type === 'mahasiswa'
    )?.get('count') || 0;

    const siswaCount = acceptedRequests.find(r =>
      r.unitKerjaId === unit.id && r.type === 'siswa'
    )?.get('count') || 0;

    return {
      ...unit.toJSON(),
      sisaKuotaMhs: unit.kuotaMhs - mhsCount,
      sisaKuotaSiswa: unit.kuotaSiswa - siswaCount
    };
  });
};

const getAllUnitKerja = async (req, res) => {
  try {
    const unitKerjaWithQuota = await calculateAvailableQuota();
    return res.status(200).json({
      unitKerja: unitKerjaWithQuota
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const editKuotaUnitKerja = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipe_cabang, kuotaMhs, kuotaSiswa, isCustomQuota } = req.body;
    
    const unitKerja = await UnitKerja.findByPk(id);
    if (!unitKerja) {
      return res.status(404).json({ error: "Unit kerja tidak ditemukan." });
    }

    let kuota = { kuotaMhs, kuotaSiswa };

    // If not using custom quota, apply preset values based on branch type
    if (!isCustomQuota && tipe_cabang) {
      if (!["pusat", "utama", "a", "b", "c", ""].includes(tipe_cabang.toLowerCase())) {
        return res.status(400).json({ error: "Tipe cabang tidak valid." });
      }

      switch (tipe_cabang.toLowerCase()) {
        case "pusat":
          kuota = { kuotaMhs: 0, kuotaSiswa: 16 };
          break;
        case "utama":
          kuota = { kuotaMhs: 0, kuotaSiswa: 25 };
          break;
        case "a":
          kuota = { kuotaMhs: 8, kuotaSiswa: 10 };
          break;
        case "b":
          kuota = { kuotaMhs: 3, kuotaSiswa: 8 };
          break;
        case "c":
          kuota = { kuotaMhs: 2, kuotaSiswa: 5 };
          break;
      }
      unitKerja.tipe_cabang = tipe_cabang;
    } 
    // If using custom quota, validate the input values
    else if (isCustomQuota) {
      if (kuotaMhs === undefined || kuotaSiswa === undefined) {
        return res.status(400).json({ error: "Kuota mahasiswa dan siswa harus diisi." });
      }
      if (kuotaMhs < 0 || kuotaSiswa < 0) {
        return res.status(400).json({ error: "Kuota tidak boleh bernilai negatif." });
      }
    }

    unitKerja.kuotaMhs = kuota.kuotaMhs;
    unitKerja.kuotaSiswa = kuota.kuotaSiswa;
    await unitKerja.save();

    const unitKerjaWithQuota = await calculateAvailableQuota();
    return res.status(200).json({
      message: "Unit kerja berhasil diperbarui.",
      unitKerja: unitKerjaWithQuota
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const permintaanDiterima = async (req, res) => {
  try {
    const universitiesData = await PerguruanTinggi.findAll({
      include: [
        {
          model: Permintaan,
          where: {
            type: "mahasiswa",
            statusId: 1,
            penempatan: {
              [sequelize.Op.not]: null
            }
          },
          include: [
            {
              model: Prodi,
              attributes: ["id", "name"],
            },
          ],
          required: true,
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "name",
        [sequelize.col("Permintaans.Prodi.id"), "prodi_id"],
        [sequelize.col("Permintaans.Prodi.name"), "prodi_name"],
        [
          sequelize.fn("COUNT", sequelize.col("Permintaans.id")),
          "total_diterima",
        ],
      ],
      group: [
        "PerguruanTinggi.id",
        "PerguruanTinggi.name",
        "Permintaans.Prodi.id",
        "Permintaans.Prodi.name",
      ],
      raw: true,
    });

    const schoolsData = await Smk.findAll({
      include: [
        {
          model: Permintaan,
          where: {
            type: "siswa",
            statusId: 1,
            penempatan: {
              [sequelize.Op.not]: null
            }
          },
          required: true,
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "name",
        [
          sequelize.fn("COUNT", sequelize.col("Permintaans.id")),
          "total_diterima",
        ],
      ],
      group: ["Smk.id", "Smk.name"],
      raw: true,
    });

    if (!universitiesData.length && !schoolsData.length) {
      return res.status(404).json({
        message: "Data tidak ditemukan"
      });
    }

    const formattedUniversitiesData = universitiesData.reduce((acc, curr) => {
      const existingUniv = acc.find(
        (univ) => univ.nama_institusi === curr.name
      );
      const prodiData = {
        id_prodi: curr.prodi_id,
        nama_prodi: curr.prodi_name,
        total_diterima: parseInt(curr.total_diterima),
      };
      if (existingUniv) {
        existingUniv.prodi.push(prodiData);
      } else {
        acc.push({
          id_univ: curr.id,
          nama_institusi: curr.name,
          prodi: [prodiData],
        });
      }
      return acc;
    }, []);

    return res.status(200).json({
      universities: formattedUniversitiesData,
      schools: schoolsData.map((school) => ({
        id_smk: school.id,
        nama_institusi: school.name,
        total_diterima: parseInt(school.total_diterima),
      })),
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
      error: error.message
    });
  }
};

const detailUnivDiterima = async (req, res) => {
  try {
    const { idUniv, idProdi } = req.params;
    const universitiesDetail = await Permintaan.findAll({
      where: {
        type: "mahasiswa",
        statusId: 1,
        ptId: idUniv,
        prodiId: idProdi,
        penempatan: {
          [sequelize.Op.not]: null
        }
      },
      include: [
        {
          model: Users,
          include: [
            {
              model: Mahasiswa,
              attributes: ["name", "nim", "no_hp", "alamat"],
              required: false,
            },
          ],
          attributes: ["email"],
          required: false,
        },
        {
          model: PerguruanTinggi,
          attributes: ["name"],
        },
        {
          model: Prodi,
          attributes: ["name"],
        },
        {
          model: UnitKerja,
          as: "UnitKerjaPenempatan",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "tanggalMulai", "tanggalSelesai", "createdAt"],
    });
    const formattedUniversities = universitiesDetail.map((item) => ({
      id: item.id,
      nama_peserta: item.User?.Mahasiswas?.[0]?.name ?? null,
      nim: item.User?.Mahasiswas?.[0]?.nim ?? null,
      email: item.User?.email ?? null,
      no_hp: item.User?.Mahasiswas?.[0]?.no_hp ?? null,
      alamat: item.User?.Mahasiswas?.[0]?.alamat ?? null,
      institusi: item.PerguruanTinggi?.name ?? null,
      program_studi: item.Prodi?.name ?? null,
      unit_kerja: item.UnitKerjaPenempatan?.name ?? null,
      tanggal_mulai: item.tanggalMulai,
      tanggal_selesai: item.tanggalSelesai,
      tanggal_daftar: item.createdAt,
    }));
    return res.status(200).json(formattedUniversities);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const detailSmkDiterima = async (req, res) => {
  try {
    const { idSmk } = req.params;
    const schoolsDetail = await Permintaan.findAll({
      where: {
        type: "siswa",
        statusId: 1,
        smkId: idSmk,
        penempatan: {
          [sequelize.Op.not]: null
        }
      },
      include: [
        {
          model: Users,
          include: [
            {
              model: Siswa,
              attributes: ["name", "nisn", "no_hp", "alamat"],
              required: false,
            },
          ],
          attributes: ["email"],
          required: false,
        },
        {
          model: Smk,
          attributes: ["name"],
        },
        {
          model: Jurusan,
          attributes: ["name"],
        },
        {
          model: UnitKerja,
          as: "UnitKerjaPenempatan",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "tanggalMulai", "tanggalSelesai", "createdAt"],
    });
    const formattedSchools = schoolsDetail.map((item) => ({
      id: item.id,
      nama_peserta: item.User?.Siswas?.[0]?.name ?? null,
      nisn: item.User?.Siswas?.[0]?.nisn ?? null,
      email: item.User?.email ?? null,
      no_hp: item.User?.Siswas?.[0]?.no_hp ?? null,
      alamat: item.User?.Siswas?.[0]?.alamat ?? null,
      institusi: item.Smk?.name ?? null,
      jurusan: item.Jurusan?.name ?? null,
      unit_kerja: item.UnitKerjaPenempatan?.name ?? null,
      tanggal_mulai: item.tanggalMulai,
      tanggal_selesai: item.tanggalSelesai,
      tanggal_daftar: item.createdAt,
    }));
    return res.status(200).json(formattedSchools);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const generateLetter = async (data) => {
  try {
    console.log("Generating letter with data:", JSON.stringify(data, null, 2));

    let templateFile;
    if (data.jml && data.terbilang) {
      templateFile = data.type === 'mahasiswa' ? "templatePengantarMhs.docx" : "templatePengantarSiswa.docx";
    } else {
      templateFile = data.type === 'mahasiswa' ? "templateMhs.docx" : "templateSiswa.docx";
    }
    console.log("Using template:", templateFile);
    const templatePath = path.resolve(__dirname, templateFile);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templateFile}`);
    }
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    if (!data.participants || data.participants.length === 0) {
      throw new Error("No participants data provided");
    }
    const now = new Date();
    const formatShortDate = (date) => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${month.toString().padStart(2, "0")}-${year}`;
    };
    const formatLongDate = (date) => {
      const day = date.getDate();
      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };
    const dataWithDates = {
      ...data,
      jml: data.jml || data.participants.length,
      tanggal_singkat: formatShortDate(now),
      tanggal_panjang: formatLongDate(now),
      students: data.participants.map((student, index) => ({
        no: index + 1,
        ...student,
      })),
    };
    console.log("Rendering template with data:", JSON.stringify(dataWithDates, null, 2));
    doc.render(dataWithDates);
    const docxBuf = doc.getZip().generate({ type: "nodebuffer" });
    console.log("DOCX generated successfully");
    console.log("Converting to PDF...");
    const pdfBuf = await convert(docxBuf, '.pdf', undefined);
    console.log("PDF conversion successful");
    return pdfBuf;
  } catch (error) {
    console.error("Detailed error in generateLetter:", {
      message: error.message,
      stack: error.stack,
      data: JSON.stringify(data, null, 2)
    });
    throw error;
  }
};

const univGenerateLetter = async (req, res) => {
  try {
    const { idUniv, idProdi } = req.params;
    const { nomorSurat, perihal, pejabat, institusi, prodi, perihal_detail } =
      req.body;
    console.log("prodi", prodi)
    console.log("req body", req.body)
    const universitiesDetail = await Permintaan.findAll({
      where: {
        type: "mahasiswa",
        statusId: 1,
        penempatan: {
          [sequelize.Op.not]: null
        },
        ptId: idUniv,
        prodiId: idProdi,
      },
      include: [
        {
          model: Users,
          include: [
            {
              model: Mahasiswa,
              attributes: ["name", "nim", "no_hp", "alamat"],
              required: false,
            },
          ],
          attributes: ["email"],
          required: false,
        },
        {
          model: PerguruanTinggi,
          attributes: ["name"],
        },
        {
          model: Prodi,
          attributes: ["name"],
        },
        {
          model: UnitKerja,
          as: "UnitKerjaPenempatan",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "tanggalMulai", "tanggalSelesai", "createdAt"],
    });
    const formatPeriod = (startDate, endDate) => {
      const formatDate = (date) => {
        const d = new Date(date);
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      };
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };
    const participants = universitiesDetail.map((item) => ({
      nama_mahasiswa: item.User?.Mahasiswas?.[0]?.name || "",
      nim: item.User?.Mahasiswas?.[0]?.nim || "",
      penempatan: item.UnitKerjaPenempatan?.name || "",
      periode: formatPeriod(item.tanggalMulai, item.tanggalSelesai),
    }));
    const data = {
      noSurat: nomorSurat,
      perihal: perihal,
      pejabat: pejabat,
      institusi: institusi,
      prodi: prodi,
      perihal_detail: perihal_detail,
      participants: participants,
      type: 'mahasiswa'  

    };
    const pdfBuffer = await generateLetter(data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=surat_magang.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};
const smkGenerateLetter = async (req, res) => {
  try {
    const { idSmk } = req.params;
    const { nomorSurat, perihal, pejabat, institusi, perihal_detail } = req.body;

    console.log("Fetching SMK details for ID:", idSmk);

    const smkDetail = await Permintaan.findAll({
      where: {
        type: "siswa",
        statusId: 1,
        penempatan: {
          [sequelize.Op.not]: null
        },
        smkId: idSmk,
      },
      include: [
        {
          model: Users,
          include: [
            {
              model: Siswa,
              attributes: ["name", "nisn", "no_hp", "alamat"],
              required: false,
            },
          ],
          attributes: ["email"],
          required: false,
        },
        {
          model: Smk,
          attributes: ["name"],
        },
        {
          model: Jurusan,
          attributes: ["name"],
        },
        {
          model: UnitKerja,
          as: "UnitKerjaPenempatan",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "tanggalMulai", "tanggalSelesai", "createdAt"],
    });

    if (!smkDetail || smkDetail.length === 0) {
      console.log("No SMK details found for ID:", idSmk);
      return res.status(404).json({
        status: "error",
        message: "No data found for the specified SMK"
      });
    }

    console.log("Found SMK details:", JSON.stringify(smkDetail, null, 2));

    const formatPeriod = (startDate, endDate) => {
      const formatDate = (date) => {
        const d = new Date(date);
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      };
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const participants = smkDetail.map((item) => ({
      nama_siswa: item.User?.Siswas?.[0]?.name || "",
      nisn: item.User?.Siswas?.[0]?.nisn || "",
      penempatan: item.UnitKerjaPenempatan?.name || "",
      periode: formatPeriod(item.tanggalMulai, item.tanggalSelesai),
    }));

    const data = {
      noSurat: nomorSurat,
      perihal: perihal,
      pejabat: pejabat,
      institusi: institusi,
      perihal_detail: perihal_detail,
      participants: participants,
      type: 'siswa'  // Add this
    };

    console.log("Generating letter with data:", JSON.stringify(data, null, 2));
    const pdfBuffer = await generateLetter(data);
    console.log("PDF generated successfully, size:", pdfBuffer.length);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=surat_magang.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Detailed error in smkGenerateLetter:", {
      message: error.message,
      stack: error.stack,
      params: req.params,
      body: req.body
    });

    return res.status(500).json({
      status: "error",
      message: "Gagal membuat surat",
      error: error.message
    });
  }
};

const generateSuratPengantarMhs = async (req, res) => {
  try {
    const { idUniv, idProdi, unitKerjaId } = req.params;
    const { nomorSurat, perihal, pejabat, terbilang, institusi, prodi, tmptMagang } = req.body;

    const universitiesDetail = await Permintaan.findAll({
      where: {
        type: "mahasiswa",
        statusId: {
          [sequelize.Op.in]: [2, 3]
        },
        penempatan: unitKerjaId, // Changed this line to use penempatan
        ptId: idUniv,
        prodiId: idProdi,
      },
      include: [
        {
          model: Users,
          include: [
            {
              model: Mahasiswa,
              attributes: ["name", "nim", "no_hp", "alamat"],
              required: false,
            },
          ],
          attributes: ["email"],
          required: false,
        },
        {
          model: PerguruanTinggi,
          attributes: ["name"],
        },
        {
          model: Prodi,
          attributes: ["name"],
        },
        {
          model: UnitKerja,
          as: "UnitKerjaPenempatan",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "tanggalMulai", "tanggalSelesai", "createdAt"],
    });

    const formatPeriod = (startDate, endDate) => {
      const formatDate = (date) => {
        const d = new Date(date);
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      };
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const participants = universitiesDetail.map((item) => ({
      nama_mahasiswa: item.User?.Mahasiswas?.[0]?.name || "",
      nim: item.User?.Mahasiswas?.[0]?.nim || "",
      penempatan: item.UnitKerjaPenempatan?.name || "",
      periode: formatPeriod(item.tanggalMulai, item.tanggalSelesai),
    }));

    const data = {
      noSurat: nomorSurat,
      perihal: perihal,
      pejabat: pejabat,
      terbilang: terbilang,
      institusi: institusi,
      prodi: prodi,
      tmptMagang: tmptMagang,
      jml: participants.length,
      participants: participants,
      type: 'mahasiswa'  // Add this



    };
    console.log("Data:", data);
    const pdfBuffer = await generateLetter(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=surat_pengantar.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};
const generateSuratPengantarSiswa = async (req, res) => {
  try {
    const { idSmk, unitKerjaId } = req.params;
    const { nomorSurat, perihal, pejabat, terbilang, institusi, tmptMagang } = req.body;

    const smkDetail = await Permintaan.findAll({
      where: {
        type: "siswa",
        statusId: {
          [sequelize.Op.in]: [2, 3]
        },
        penempatan: unitKerjaId,
        smkId: idSmk,

      },
      include: [
        {
          model: Users,
          include: [
            {
              model: Siswa,
              attributes: ["name", "nisn", "no_hp", "alamat"],
              required: false,
            },
          ],
          attributes: ["email"],
          required: false,
        },
        {
          model: Smk,
          attributes: ["name"],
        },
        {
          model: UnitKerja,
          as: "UnitKerjaPenempatan",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "tanggalMulai", "tanggalSelesai", "createdAt"],
    });

    const formatPeriod = (startDate, endDate) => {
      const formatDate = (date) => {
        const d = new Date(date);
        const months = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      };
      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    };

    const participants = smkDetail.map((item) => ({
      nama_siswa: item.User?.Siswas?.[0]?.name || "",
      nisn: item.User?.Siswas?.[0]?.nisn || "",
      penempatan: item.UnitKerjaPenempatan?.name || "",
      periode: formatPeriod(item.tanggalMulai, item.tanggalSelesai),
    }));

    const data = {
      noSurat: nomorSurat,
      perihal: perihal,
      pejabat: pejabat,
      terbilang: terbilang,
      institusi: institusi,
      tmptMagang: tmptMagang,
      jml: participants.length,
      participants: participants,
      type: 'siswa'  // Add this
    };
    console.log("Data:", data);
    const pdfBuffer = await generateLetter(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=surat_pengantar.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};

const sendSuratBalasan = async (req, res) => {
  try {
    const responseArray = JSON.parse(req.body.responseArray);

    if (!Array.isArray(responseArray)) {
      return res.status(400).json({
        status: "error",
        message: "responseArray harus berupa array"
      });
    }

    if (!req.files || !req.files.fileSuratBalasan) {
      return res.status(400).json({
        status: "error",
        message: "File surat balasan harus diunggah"
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    for (const response of responseArray) {
      const email = response.email;
      const filePath = req.files.fileSuratBalasan[0].path;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Surat Balasan',
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #4CAF50;">Surat Balasan</h2>
            <p>Dear Recipient,</p>
            <p>Berikut adalah surat balasan yang Anda minta. Silakan lihat lampiran untuk detail lebih lanjut.</p>
            <p>Terima kasih,</p>
            <p><strong>Tim Kami</strong></p>
            <p style="font-size: 12px; color: #777;">Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
          </div>
        `,
        attachments: [
          {
            filename: req.files.fileSuratBalasan[0].filename,
            path: filePath
          }
        ]
      };

      await transporter.sendMail(mailOptions);

      await Promise.all([
        Dokumen.create({
          permintaanId: response.id,
          tipeDokumenId: 5, // Assuming 5 is the ID for Surat Balasan
          url: filePath
        }),
        Permintaan.update({ statusId: 2 }, { where: { id: response.id } })
      ]);
    }

    res.status(200).json({
      status: "success",
      message: "Surat balasan berhasil dikirim ke semua email",
    });
  } catch (error) {
    console.error("Error in sendSuratBalasan:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const sendSuratPengantar = async (req, res) => {
  try {
    const responseArray = JSON.parse(req.body.responseArray);
    if (!Array.isArray(responseArray)) {
      return res.status(400).json({
        status: "error",
        message: "responseArray harus berupa array"
      });
    }
    if (!req.files || !req.files.SuratPengantar) {
      return res.status(400).json({
        status: "error",
        message: "File surat pengantar harus diunggah"
      });
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    for (const response of responseArray) {
      const email = response.email;
      const filePath = req.files.SuratPengantar[0].path;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Surat Pengantar',
        text: 'Berikut adalah surat pengantar anda.',
        attachments: [
          {
            filename: req.files.SuratPengantar[0].filename,
            path: filePath
          }
        ]
      };
      await transporter.sendMail(mailOptions);
      await Promise.all([
        Dokumen.create({
          permintaanId: response.id,
          tipeDokumenId: 10,
          url: filePath
        }),
        Permintaan.update({ statusId: 4 }, { where: { id: response.id } })
      ]);
    }
    res.status(200).json({
      status: "success",
      message: "Surat pengantar berhasil dikirim ke semua email",
    });
  } catch (error) {
    console.error("Error in sendSuratPengantar:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getDiverifikasi = async (req, res) => {
  try {
    const permintaanData = await Permintaan.findAll({
      where: {
        statusId: {
          [sequelize.Op.in]: [2, 3]
        },
        penempatan: {
          [sequelize.Op.not]: null
        }
      },
      include: [
        {
          model: Users,
          include: [
            {
              model: Mahasiswa,
              attributes: ["name", "nim", "no_hp", "alamat"],
              required: false,
            },
            {
              model: Siswa,
              attributes: ["name", "nisn", "no_hp", "alamat"],
              required: false,
            },
          ],
          attributes: ["email"],
        },
        {
          model: PerguruanTinggi,
          attributes: ["id", "name"],
        },
        {
          model: Prodi,
          attributes: ["id", "name"],
        },
        {
          model: Smk,
          attributes: ["id", "name"],
        },
        {
          model: UnitKerja,
          as: "UnitKerjaPenempatan",
          attributes: ["id", "name"],
        },
        {
          model: Dokumen,
          where: {
            tipeDokumenId: {
              [sequelize.Op.in]: [6, 7]
            }
          },
          required: false,
          attributes: ["url"]
        }
      ],
      attributes: ["id", "type", "tanggalMulai", "tanggalSelesai", "createdAt"],
      distinct: true,
    });

    const result = {
      mahasiswa: {
        institusi: "",
        prodi: "",
        totalPeserta: 0,
        unitKerja: "",
        dataMhs: []
      },
      siswa: {
        institusi: "",
        totalPeserta: 0,
        unitKerja: "",
        dataSiswa: []
      }
    };

    const processedNims = new Set();
    const processedNisns = new Set();

    permintaanData.forEach(data => {
      const cleanData = {
        ...data.dataValues,
        User: data.User ? {
          email: data.User.email,
          Mahasiswas: data.type === 'mahasiswa' ? data.User.Mahasiswas : undefined,
          Siswas: data.type === 'siswa' ? data.User.Siswas : undefined
        } : null,
        Dokumens: data.Dokumens ? data.Dokumens.map(dok => dok.url) : []
      };

      if (data.type === 'mahasiswa') {
        const nim = data.User?.Mahasiswas?.[0]?.nim;
        if (nim && !processedNims.has(nim)) {
          processedNims.add(nim);
          result.mahasiswa.institusi = data.PerguruanTinggi?.name || "";
          result.mahasiswa.prodi = data.Prodi?.name || "";
          result.mahasiswa.unitKerja = data.UnitKerjaPenempatan?.name || "";
          result.mahasiswa.totalPeserta++;
          result.mahasiswa.dataMhs.push({
            ...cleanData,
            institusiId: data.PerguruanTinggi?.id,
            prodiId: data.Prodi?.id,
            penempatanId: data.UnitKerjaPenempatan?.id
          });
        }
      } else {
        const nisn = data.User?.Siswas?.[0]?.nisn;
        if (nisn && !processedNisns.has(nisn)) {
          processedNisns.add(nisn);
          result.siswa.institusi = data.Smk?.name || "";
          result.siswa.unitKerja = data.UnitKerjaPenempatan?.name || "";
          result.siswa.totalPeserta++;
          result.siswa.dataSiswa.push({
            ...cleanData,
            institusiId: data.Smk?.id,
            penempatanId: data.UnitKerjaPenempatan?.id
          });
        }
      }
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};


const detailUnivDiverifikasi = async (req, res) => {
  try {
    const { idUniv, idProdi } = req.params;

    const universitiesDetail = await Permintaan.findAll({
      where: {
        type: "mahasiswa",
        statusId: {
          [sequelize.Op.in]: [2, 3]
        },
        ptId: idUniv,
        prodiId: idProdi,
        penempatan: {
          [sequelize.Op.not]: null
        }
      },
      include: [
        {
          model: Users,
          include: [
            {
              model: Mahasiswa,
              attributes: ["name", "nim", "no_hp", "alamat"],
              required: false,
            },
          ],
          attributes: ["email"],
          required: false,
        },
        {
          model: PerguruanTinggi,
          attributes: ["name"],
        },
        {
          model: Prodi,
          attributes: ["name"],
        },
        {
          model: UnitKerja,
          as: "UnitKerjaPenempatan",
          attributes: ["name"],
        },
        {
          model: Dokumen,
          where: {
            tipeDokumenId: {
              [sequelize.Op.in]: [6, 7]
            }
          },
          required: false,
          attributes: ["url"]
        }
      ],
      attributes: ["id", "tanggalMulai", "tanggalSelesai", "createdAt"],
    });

    const formattedUniversities = universitiesDetail.map((item) => ({
      id: item.id,
      nama_peserta: item.User?.Mahasiswas?.[0]?.name ?? null,
      nim: item.User?.Mahasiswas?.[0]?.nim ?? null,
      email: item.User?.email ?? null,
      no_hp: item.User?.Mahasiswas?.[0]?.no_hp ?? null,
      alamat: item.User?.Mahasiswas?.[0]?.alamat ?? null,
      institusi: item.PerguruanTinggi?.name ?? null,
      program_studi: item.Prodi?.name ?? null,
      unit_kerja: item.UnitKerjaPenempatan?.name ?? null,
      tanggal_mulai: item.tanggalMulai,
      tanggal_selesai: item.tanggalSelesai,
      tanggal_daftar: item.createdAt,
      dokumen_urls: item.Dokumens.map(dok => dok.url)
    }));

    return res.status(200).json(formattedUniversities);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const detailSmkDiverifikasi = async (req, res) => {
  try {
    const { idSmk } = req.params;

    const schoolsDetail = await Permintaan.findAll({
      where: {
        type: "siswa",
        statusId: {
          [sequelize.Op.in]: [2, 3]
        },
        smkId: idSmk,
        penempatan: {
          [sequelize.Op.not]: null
        }
      },
      include: [
        {
          model: Users,
          include: [
            {
              model: Siswa,
              attributes: ["name", "nisn", "no_hp", "alamat"],
              required: false,
            },
          ],
          attributes: ["email"],
          required: false,
        },
        {
          model: Smk,
          attributes: ["name"],
        },
        {
          model: Jurusan,
          attributes: ["name"],
        },
        {
          model: UnitKerja,
          as: "UnitKerjaPenempatan",
          attributes: ["name"],
        },
        {
          model: Dokumen,
          where: {
            tipeDokumenId: {
              [sequelize.Op.in]: [6, 7]
            }
          },
          required: false,
          attributes: ["url"]
        }
      ],
      attributes: ["id", "tanggalMulai", "tanggalSelesai", "createdAt"],
    });

    const formattedSchools = schoolsDetail.map((item) => ({
      id: item.id,
      nama_peserta: item.User?.Siswas?.[0]?.name ?? null,
      nisn: item.User?.Siswas?.[0]?.nisn ?? null,
      email: item.User?.email ?? null,
      no_hp: item.User?.Siswas?.[0]?.no_hp ?? null,
      alamat: item.User?.Siswas?.[0]?.alamat ?? null,
      institusi: item.Smk?.name ?? null,
      jurusan: item.Jurusan?.name ?? null,
      unit_kerja: item.UnitKerjaPenempatan?.name ?? null,
      tanggal_mulai: item.tanggalMulai,
      tanggal_selesai: item.tanggalSelesai,
      tanggal_daftar: item.createdAt,
      dokumen_urls: item.Dokumens.map(dok => dok.url)
    }));

    return res.status(200).json(formattedSchools);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

const estimateCost = async (req, res) => {
  try {
    const workingDayRate = 19000; // Cost per working day

    const participants = await Permintaan.findAll({
      where: {
        statusId: 4
      },
      attributes: ['id', 'tanggalMulai', 'tanggalSelesai'],
      include: [
        {
          model: Users,
          include: [
            {
              model: Mahasiswa,
              attributes: ['name'],
              required: false
            },
            {
              model: Siswa,
              attributes: ['name'],
              required: false
            }
          ]
        }
      ]
    });

    const estimations = participants.map(participant => {
      const startDate = new Date(participant.tanggalMulai);
      const endDate = new Date(participant.tanggalSelesai);

      // Calculate total days
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

      // Calculate working days (Mon-Fri only)
      let workingDays = 0;
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // 0 is Sunday, 6 is Saturday
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          workingDays++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Calculate total cost (only for working days)
      const totalCost = workingDays * workingDayRate;

      return {
        id: participant.id,
        name: participant.User?.Mahasiswas?.[0]?.name || participant.User?.Siswas?.[0]?.name,
        startDate: participant.tanggalMulai,
        endDate: participant.tanggalSelesai,
        totalDays,
        workingDays,
        totalCost
      };
    });

    return res.status(200).json({
      status: 'success',
      data: estimations
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
};

const createJadwalPendaftaran = async (req, res) => {
  try {
    const {nama, tanggalMulai, tanggalTutup } = req.body;
    const jadwalPendaftaran = await Jadwal.create({
      nama,
      tanggalMulai,
      tanggalTutup
    });
    return res.status(201).json({
      status: "success",
      data: jadwalPendaftaran
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message
    });
  }
}
module.exports = {
  createJadwalPendaftaran,
  getAllUnitKerja,
  editKuotaUnitKerja,
  permintaanDiterima,
  detailUnivDiterima,
  detailSmkDiterima,
  generateLetter,
  univGenerateLetter,
  smkGenerateLetter,
  sendSuratBalasan,
  getDiverifikasi,
  detailUnivDiverifikasi,
  detailSmkDiverifikasi,
  generateSuratPengantarMhs,
  generateSuratPengantarSiswa,
  sendSuratPengantar,
  estimateCost
};
