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
} = require("../models");
const sequelize = require("sequelize");

const getAllUnitKerja = async (req, res) => {
  try {
    const unitKerja = await UnitKerja.findAll();
    return res.status(200).json(unitKerja);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
const editKuotaUnitKerja = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipe_cabang } = req.body;

    const unitKerja = await UnitKerja.findByPk(id);

    if (!unitKerja) {
      return res.status(404).json({ error: "Unit kerja tidak ditemukan." });
    }

    // Validate tipe_cabang
    if (!['pusat', 'utama', 'a', 'b', 'c'].includes(tipe_cabang.toLowerCase())) {
      return res.status(400).json({ error: "Tipe cabang tidak valid." });
    }

    // Get default kuota based on tipe_cabang
    let kuota;
    switch (tipe_cabang.toLowerCase()) {
      case 'pusat':
        kuota = { kuotaMhs: 16, kuotaSiswa: 0 };
        break;
      case 'utama':
        kuota = { kuotaMhs: 25, kuotaSiswa: 0 };
        break;
      case 'a':
        kuota = { kuotaMhs: 10, kuotaSiswa: 8 };
        break;
      case 'b':
        kuota = { kuotaMhs: 8, kuotaSiswa: 3 };
        break;
      case 'c':
        kuota = { kuotaMhs: 5, kuotaSiswa: 2 };
        break;
    }

    // Update unit kerja with default kuota
    unitKerja.kuotaMhs = kuota.kuotaMhs;
    unitKerja.kuotaSiswa = kuota.kuotaSiswa;
    unitKerja.tipe_cabang = tipe_cabang;
    await unitKerja.save();

    return res.status(200).json({
      message: "Unit kerja berhasil diperbarui.",
      unitKerja,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const generateLetter = async (req, res) => {
  const {
    nomorSurat,
    perihal,
    pejabat,
    institusi,
    departemen,
    perihal_detail,
    selectedIds, // Array of selected request IDs
  } = req.body;
  // Load template
  const content = fs.readFileSync(
    path.resolve(__dirname, "template.docx"),
    "binary"
  );
  const zip = new PizZip(content);

  // Data contoh
  const data = {
    noSurat: "001/2024",
    pejabat: "Dekan Fakultas Teknik",
    institusi: "Universitas Negeri Padang",
    departemen: "Teknik Informatika",
    perihal: "Permohonan Magang Mahasiswa",
    students: [
      {
        nama_mahasiswa: "Budi Santoso",
        nim: "19104410001",
        penempatan: "Divisi IT",
        periode: "1 Jan - 31 Mar 2025",
      },
      {
        nama_mahasiswa: "Ani Widya",
        nim: "19104410002",
        penempatan: "Divisi Human Capital",
        periode: "1 Jan - 31 Mar 2025",
      },
      {
        nama_mahasiswa: "Charlie Putra",
        nim: "19104410003",
        penempatan: "Divisi Keuangan",
        periode: "1 Jan - 31 Mar 2025",
      },
    ],
  };

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });

  // Add row numbers to students
  const dataWithNumbers = {
    ...data,
    students: data.students.map((student, index) => ({
      no: index + 1,
      ...student,
    })),
  };

  // Render document
  doc.render(dataWithNumbers);

  // Generate buffer
  const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
  });

  // Save file
  const outputPath = `surat_magang_${Date.now()}.docx`;
  fs.writeFileSync(outputPath, buf);

  return outputPath;
};
const permintaanDiterima = async (req, res) => {
  try {
    // Get universities data with count of accepted requests per prodi
    const universitiesData = await PerguruanTinggi.findAll({
      include: [
        {
          model: Permintaan,
          where: {
            type: "mahasiswa",
            statusId: 2,
          },
          include: [
            {
              model: Prodi,
              attributes: ["id", "name"],
            },
          ],
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

    // Get vocational schools data with count of accepted requests
    const schoolsData = await Smk.findAll({
      include: [
        {
          model: Permintaan,
          where: {
            type: "siswa",
            statusId: 2,
          },
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

    // Restructure universities data to group by university
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
    return res.status(500).json({ error: error.message });
  }
};

const getDetailPermintaanDiterima = async (req, res) => {
  try {
    // Get detailed university students data
    const universitiesDetail = await Permintaan.findAll({
      where: {
        type: "mahasiswa",
        statusId: 2, // Status diterima
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

    // Get detailed vocational students data
    const schoolsDetail = await Permintaan.findAll({
      where: {
        type: "siswa",
        statusId: 2, // Status diterima
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

    const formattedUniversities = universitiesDetail.map((item) => ({
      id: item.id,
      nama_peserta: item.User?.Mahasiswas?.[0]?.name ?? null, // Changed to Mahasiswas
      nim: item.User?.Mahasiswas?.[0]?.nim ?? null, // Changed to Mahasiswas
      email: item.User?.email ?? null,
      no_hp: item.User?.Mahasiswas?.[0]?.no_hp ?? null, // Changed to Mahasiswas
      alamat: item.User?.Mahasiswas?.[0]?.alamat ?? null, // Changed to Mahasiswas
      institusi: item.PerguruanTinggi?.name ?? null,
      program_studi: item.Prodi?.name ?? null,
      unit_kerja: item.UnitKerjaPenempatan?.name ?? null,
      tanggal_mulai: item.tanggalMulai,
      tanggal_selesai: item.tanggalSelesai,
      tanggal_daftar: item.createdAt,
    }));

    // Format vocational students data
    const formattedSchools = schoolsDetail.map((item) => ({
      id: item.id,
      nama_peserta: item.User?.Siswas?.[0]?.name ?? null, // Changed to Siswas
      nisn: item.User?.Siswas?.[0]?.nisn ?? null, // Changed to Siswas
      email: item.User?.email ?? null,
      no_hp: item.User?.Siswas?.[0]?.no_hp ?? null, // Changed to Siswas
      alamat: item.User?.Siswas?.[0]?.alamat ?? null, // Changed to Siswas
      institusi: item.Smk?.name ?? null,
      jurusan: item.Jurusan?.name ?? null,
      unit_kerja: item.UnitKerjaPenempatan?.name ?? null,
      tanggal_mulai: item.tanggalMulai,
      tanggal_selesai: item.tanggalSelesai,
      tanggal_daftar: item.createdAt,
    }));

    return res.status(200).json({
      mahasiswa: formattedUniversities,
      siswa: formattedSchools,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const detailUnivDiverifikasi = async (req, res) => {
  try {
    const { idUniv, idProdi } = req.params;

    const universitiesDetail = await Permintaan.findAll({
      where: {
        type: "mahasiswa",
        statusId: 2,
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

    const formattedUniversities = universitiesDetail.map((item) => ({
      id: item.id,
      nama_peserta: item.User?.Mahasiswas?.[0]?.name ?? null, // Changed to Mahasiswas
      nim: item.User?.Mahasiswas?.[0]?.nim ?? null, // Changed to Mahasiswas
      email: item.User?.email ?? null,
      no_hp: item.User?.Mahasiswas?.[0]?.no_hp ?? null, // Changed to Mahasiswas
      alamat: item.User?.Mahasiswas?.[0]?.alamat ?? null, // Changed to Mahasiswas
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

const detailSmkDiverifikasi = async (req, res) => {
  try {
    const { idSmk } = req.params;

    const schoolsDetail = await Permintaan.findAll({
      where: {
        type: "siswa",
        statusId: 2, 
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

    // Format vocational students data
    const formattedSchools = schoolsDetail.map((item) => ({
      id: item.id,
      nama_peserta: item.User?.Siswas?.[0]?.name ?? null, // Changed to Siswas
      nisn: item.User?.Siswas?.[0]?.nisn ?? null, // Changed to Siswas
      email: item.User?.email ?? null,
      no_hp: item.User?.Siswas?.[0]?.no_hp ?? null, // Changed to Siswas
      alamat: item.User?.Siswas?.[0]?.alamat ?? null, // Changed to Siswas
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

module.exports = {
  getAllUnitKerja,
  editKuotaUnitKerja,
  permintaanDiterima,
  detailUnivDiverifikasi,
  detailSmkDiverifikasi,
  getDetailPermintaanDiterima,
  generateLetter,
};
