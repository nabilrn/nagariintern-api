const {
  PermintaanMagang,
  Dokumen,
  Institusi,
  Jurusan,
  Divisi,
  User,
} = require("../models/index");

const createPermintaanMagang = async (req, res) => {
  try {
    const {
      userId,
      tipePemohon,
      institusi,
      jurusan,
      alamat,
      noHp,
      tanggalMulai,
      tanggalSelesai,
      divisi,
    } = req.body;

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

    const [institusiRecord] = await Institusi.findOrCreate({
      where: { name: institusi },
      defaults: { name: institusi },
    });

    const [jurusanRecord] = await Jurusan.findOrCreate({
      where: { name: jurusan, institusiId: institusiRecord.id },
      defaults: { name: jurusan, institusiId: institusiRecord.id },
    });

    const [divisiRecord] = await Divisi.findOrCreate({
      where: { name: divisi },
      defaults: { name: divisi },
    });

    const permintaanMagang = await PermintaanMagang.create({
      userId,
      tipePemohon,
      institusiId: institusiRecord.id,
      jurusanId: jurusanRecord.id,
      alamat,
      noHp,
      tanggalMulai,
      tanggalSelesai,
      divisiId: divisiRecord.id,
      statusPermohonan: "menunggu",
      statusPersetujuanPSDM: "menunggu",
      statusPersetujuanPimpinan: "menunggu",
    });

    const documents = [
      {
        permintaanMagangId: permintaanMagang.id,
        tipeDokumen: 'cv',
        url: req.files.fileCv[0].filename
      },
      {
        permintaanMagangId: permintaanMagang.id,
        tipeDokumen: 'transkip nilai',
        url: req.files.fileTranskrip[0].filename
      },
      {
        permintaanMagangId: permintaanMagang.id,
        tipeDokumen: 'ktp',
        url: req.files.fileKtp[0].filename
      },
      {
        permintaanMagangId: permintaanMagang.id,
        tipeDokumen: 'suratPengantar',
        url: req.files.fileSuratPengantar[0].filename
      }
    ];

    await Dokumen.bulkCreate(documents);

    res.status(201).json({
      message: "Permintaan magang berhasil dibuat",
      data: permintaanMagang,
    });
  } catch (error) {
    console.error(error);
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

    res
      .status(200)
      .json({
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
}

module.exports = {
  createPermintaanMagang,
  getAllPermintaanMagang,
  getPermintaanMagangById,   
  approveStatusPermintaanMagang,
  deletePermintaanMagang,
  getMyPermintaanMagang,
};
