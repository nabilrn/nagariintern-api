const {
  Permintaan,
  Dokumen,
  Smk,
  Jurusan,
  Divisi,
  User,
  Siswa,
  UnitKerja,
} = require("../models/index");

const createPermintaanMagangSiswa = async (req, res) => {
  try {
    const {
      nama,
      nisn,
      alamat,
      noHp,
      smk,
      jurusan,
      unitKerja,
      tanggalMulai,
      tanggalSelesai,
    } = req.body;


    console.log(req.body);

    // Ambil ID pengguna yang sudah diverifikasi dari token
    const userId = req.userId;

    // Input validation
    if (
      !nama ||
      !nisn ||
      !alamat ||
      !noHp ||
      !smk ||
      !jurusan ||
      !unitKerja ||
      !tanggalMulai ||
      !tanggalSelesai
    ) {
      return res.status(400).json({
        error: "Semua field wajib diisi",
      });
    }


    if (
      !req.files ||
      !req.files.fileCv ||
      !req.files.fileTranskrip ||
      !req.files.fileKtp ||
      !req.files.fileSuratPengantar
    ) {
      return res.status(400).json({
        error:
          "Semua file wajib diunggah (CV, Transkrip, KTP, Surat Pengantar)",
      });
    }

    // Validate dates
    const startDate = new Date(tanggalMulai);
    const endDate = new Date(tanggalSelesai);
    if (startDate >= endDate) {
      return res.status(400).json({
        error: "Tanggal selesai harus lebih besar dari tanggal mulai",
      });
    }

    // Create or find institution record
    const [smkRecord] = await Smk.findOrCreate({
      where: { name: smk },
      defaults: { name: smk },

    });

    await Siswa.create({
      userId,
      name: nama,
      nisn: nisn,
      no_hp: noHp,
      alamat: alamat,
    });

    // Create or find department record
    const [jurusanRecord] = await Jurusan.findOrCreate({
      where: {
        name: jurusan,
      },
      defaults: {
        name: jurusan,
      },
    });

    // Create or find unit kerja record
    const [unitKerjaRecord] = await UnitKerja.findOrCreate({
      where: { name: unitKerja },
      defaults: { name: unitKerja },
    });

    // Create PermintaanMagang record
    const permintaanMagang = await Permintaan.create({

      userId,
      type: "siswa",
      smkId: smkRecord.id,
      jurusanId: jurusanRecord.id,
      tanggalMulai,
      tanggalSelesai,
      unitKerjaId: unitKerjaRecord.id,
      statusId: 1,
    });
    console.log(permintaanMagang.id, ">>>>>>>>>>>>>>>>>>>>>>>");

    // Prepare documents data
    const documents = [
      {
        permintaanId: permintaanMagang.id,
        tipeDokumenId: 1,
        url: req.files.fileCv[0].filename,
      },
      {
        permintaanId: permintaanMagang.id,
        tipeDokumenId: 3,
        url: req.files.fileTranskrip[0].filename,
      },
      {
        permintaanId: permintaanMagang.id,
        tipeDokumenId: 4,
        url: req.files.fileKtp[0].filename,
      },
      {
        permintaanId: permintaanMagang.id,
        tipeDokumenId: 2,
        url: req.files.fileSuratPengantar[0].filename,
      },
    ];

    // Save all documents
    await Dokumen.bulkCreate(documents);

    // Send success response
    res.status(201).json({
      message: "Permintaan magang berhasil dibuat",
      data: {
        id: permintaanMagang.id,
        nama,
        smk: smkRecord.name,
        jurusan: jurusanRecord.name,
        unitKerja: unitKerjaRecord.name,
        tanggalMulai,
        tanggalSelesai,
        status: permintaanMagang.status,
      },
    });
  } catch (error) {
    console.error("Create Permintaan Magang Error:", error);

    // Handle specific database errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data yang dimasukkan tidak valid",
        error: error.errors.map((e) => e.message),
      });
    }

    // Handle general errors
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat permintaan magang",
      error: error.message,
    });
  }
};

const createPermintaanMagangMahasiswa = async (req, res) => {
  try {
    const {
      nama,
      nim,
      alamat,
      noHp,
      perguruangTinggi,
      prodi,
      unitKerja,
      tanggalMulai,
      tanggalSelesai,
    } = req.body;

    console.log(req.body);

    // Ambil ID pengguna yang sudah diverifikasi dari token
    const userId = req.userId;

    // // Input validation
    // if (
    //   !nama ||
    //   !nisn ||
    //   !alamat ||
    //   !noHp ||
    //   !smk ||
    //   !jurusan ||
    //   !unitKerja ||
    //   !tanggalMulai ||
    //   !tanggalSelesai
    // ) {
    //   return res.status(400).json({
    //     error: "Semua field wajib diisi",
    //   });
    // }

    if (
      !req.files ||
      !req.files.fileCv ||
      !req.files.fileTranskrip ||
      !req.files.fileKtp ||
      !req.files.fileSuratPengantar
    ) {
      return res.status(400).json({
        error:
          "Semua file wajib diunggah (CV, Transkrip, KTP, Surat Pengantar)",
      });
    }

    // Validate dates
    const startDate = new Date(tanggalMulai);
    const endDate = new Date(tanggalSelesai);
    if (startDate >= endDate) {
      return res.status(400).json({
        error: "Tanggal selesai harus lebih besar dari tanggal mulai",
      });
    }

    // Create or find institution record
    const [smkRecord] = await Smk.findOrCreate({
      where: { name: smk },
      defaults: { name: smk },
    });

    await Siswa.create({
      userId,
      name: nama,
      nisn: nisn,
      no_hp: noHp,
      alamat: alamat,
    });

    // Create or find department record
    const [jurusanRecord] = await Jurusan.findOrCreate({
      where: {
        name: jurusan,
      },
      defaults: {
        name: jurusan,
      },
    });

    // Create or find unit kerja record
    const [unitKerjaRecord] = await UnitKerja.findOrCreate({
      where: { name: unitKerja },
      defaults: { name: unitKerja },
    });

    // Create PermintaanMagang record
    const permintaanMagang = await Permintaan.create({
      userId,
      type: "siswa",
      smkId: smkRecord.id,
      jurusanId: jurusanRecord.id,
      tanggalMulai,
      tanggalSelesai,
      unitKerjaId: unitKerjaRecord.id,
      statusId: 1,
    });
    console.log(permintaanMagang.id, ">>>>>>>>>>>>>>>>>>>>>>>");

    const documents = [
      {
        permintaanId: permintaanMagang.id,
        tipeDokumenId: 1,
        url: req.files.fileCv[0].filename,
      },
      {
        permintaanId: permintaanMagang.id,
        tipeDokumenId: 3,
        url: req.files.fileTranskrip[0].filename,
      },
      {
        permintaanId: permintaanMagang.id,
        tipeDokumenId: 4,
        url: req.files.fileKtp[0].filename,
      },
      {
        permintaanId: permintaanMagang.id,
        tipeDokumenId: 2,
        url: req.files.fileSuratPengantar[0].filename,
      },
    ];

    await Dokumen.bulkCreate(documents);

    // Send success response
    res.status(201).json({
      message: "Permintaan magang berhasil dibuat",
      data: {
        id: permintaanMagang.id,
        nama,
        smk: smkRecord.name,
        jurusan: jurusanRecord.name,
        unitKerja: unitKerjaRecord.name,
        tanggalMulai,
        tanggalSelesai,
        status: permintaanMagang.status,
      },
    });
  } catch (error) {
    console.error("Create Permintaan Magang Error:", error);

    // Handle specific database errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Data yang dimasukkan tidak valid",
        error: error.errors.map((e) => e.message),
      });
    }

    // Handle general errors
    res.status(500).json({
      message: "Terjadi kesalahan saat membuat permintaan magang",
      error: error.message,
    });
  }
};

const getMyPermintaanMagang = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(403).json({ error: "Pengguna tidak terverifikasi." });
    }

    const permintaanMagang = await PermintaanMagang.findOne({
      where: { userId },
      include: [
        { model: Institusi, attributes: ["name"] },
        { model: Jurusan, attributes: ["name"] },
        { model: Divisi, attributes: ["name"] },
        { model: Dokumen, attributes: ["tipeDokumen", "url"] },
      ],
    });

    if (!permintaanMagang) {
      return res
        .status(404)
        .json({ message: "Tidak ada permintaan magang untuk pengguna ini." });
    }

    res.status(200).json(permintaanMagang);
  } catch (error) {
    console.error("Error in getMyPermintaanMagang:", error.message || error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

const getAllPermintaanMagang = async (req, res) => {
  try {
    const permintaanMagang = await PermintaanMagang.findAll({
      include: [
        { model: User, as: "user", attributes: ["email", "nama"] },
        { model: Institusi, attributes: ["name"] },
        { model: Jurusan, attributes: ["name"] },
        { model: Divisi, attributes: ["name"] },
        { model: Dokumen, attributes: ["tipeDokumen", "url"] },
      ],
    });

    res.status(200).json(permintaanMagang);
  } catch (error) {
    console.error("Error in getAllPermintaanMagang:", error.message || error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

const getPermintaanMagangById = async (req, res) => {
  try {
    const { id } = req.params;

    const permintaanMagang = await PermintaanMagang.findByPk(id, {
      include: [
        { model: User, as: "user", attributes: ["email", "nama"] },
        { model: Institusi, attributes: ["name"] },
        { model: Jurusan, attributes: ["name"] },
        { model: Divisi, attributes: ["name"] },
        { model: Dokumen, attributes: ["tipeDokumen", "url"] },
      ],
    });

    if (!permintaanMagang) {
      return res
        .status(404)
        .json({ error: "Permintaan magang tidak ditemukan." });
    }

    res.status(200).json(permintaanMagang);
  } catch (error) {
    console.error("Error in getPermintaanMagangById:", error.message || error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

const approveStatusPermintaanMagang = async (req, res) => {
  try {
    const { id } = req.params;

    const permintaanMagang = await PermintaanMagang.findByPk(id);

    if (!permintaanMagang) {
      return res
        .status(404)
        .json({ error: "Permintaan magang tidak ditemukan." });
    }

    permintaanMagang.statusPermohonan = "disetujui";
    await permintaanMagang.save();

    res.status(200).json({
      message: "Status permintaan magang berhasil diperbarui.",
      permintaanMagang,
    });
  } catch (error) {
    console.error(
      "Error in updateStatusPermintaanMagang:",
      error.message || error
    );
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

const deletePermintaanMagang = async (req, res) => {
  try {
    const { id } = req.params;

    const permintaanMagang = await PermintaanMagang.findByPk(id);

    if (!permintaanMagang) {
      return res
        .status(404)
        .json({ error: "Permintaan magang tidak ditemukan." });
    }

    await permintaanMagang.destroy();

    res.status(200).json({ message: "Permintaan magang berhasil dihapus." });
  } catch (error) {
    console.error("Error in deletePermintaanMagang:", error.message || error);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

module.exports = {
  createPermintaanMagangSiswa,
  createPermintaanMagangMahasiswa,
  getAllPermintaanMagang,
  getPermintaanMagangById,
  approveStatusPermintaanMagang,
  deletePermintaanMagang,
  getMyPermintaanMagang,
};
