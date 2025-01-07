const { PermintaanMagang, User } = require('../models');


const createPermintaanMagang = async (req, res) => {
    try {
      // Gunakan ID pengguna yang sudah diverifikasi dalam token
      const userId = req.userId;
  
      const { tipePemohon, institusi, jurusan, alamat } = req.body;
  
      // Pastikan fileLamaran diterima dari req.file (dengan multer)
      const fileLamaran = req.file ? req.file.filename : null;  // Ambil nama file yang disimpan oleh multer
  
      // Validasi input
      if (!tipePemohon || !institusi) {
        return res.status(400).json({ error: 'tipePemohon dan institusi diperlukan.' });
      }
  
      // Pastikan userId valid
      if (!userId) {
        return res.status(403).json({ error: 'Pengguna tidak terverifikasi.' });
      }
  
      // Membuat permintaan magang menggunakan userId yang sudah terverifikasi
      const permintaanMagang = await PermintaanMagang.create({
        userId,
        tipePemohon,
        institusi,
        jurusan,
        alamat,
        fileLamaran,  // Simpan nama file
      });
  
      res.status(201).json({ message: 'Permintaan magang berhasil dibuat.', permintaanMagang });
    } catch (error) {
      console.error('Error in createPermintaanMagang:', error.message || error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
  };

  const getMyPermintaanMagang = async (req, res) => {
    try {
      // Ambil ID pengguna yang sudah diverifikasi dari token
      const userId = req.userId;
  
      // Validasi jika userId tidak ada
      if (!userId) {
        return res.status(403).json({ error: 'Pengguna tidak terverifikasi.' });
      }
  
      // Ambil semua permintaan magang yang dimiliki oleh pengguna yang sedang login
      const permintaanMagang = await PermintaanMagang.findAll({
        where: { userId },  // Filter berdasarkan userId
      });
  
      // Jika tidak ada permintaan magang
      if (permintaanMagang.length === 0) {
        return res.status(404).json({ message: 'Tidak ada permintaan magang untuk pengguna ini.' });
      }
  
      // Kembalikan data permintaan magang
      res.status(200).json(permintaanMagang);
    } catch (error) {
      console.error('Error in getMyPermintaanMagang:', error.message || error);
      res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
    }
  };
  
const getAllPermintaanMagang = async (req, res) => {
  try {
    const permintaanMagang = await PermintaanMagang.findAll({
      include: [{ model: User, as: 'user', attributes: ['email', 'nama'] }],
    });

    res.status(200).json(permintaanMagang);
  } catch (error) {
    console.error('Error in getAllPermintaanMagang:', error.message || error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
};

const getPermintaanMagangById = async (req, res) => {
  try {
    const { id } = req.params;

    const permintaanMagang = await PermintaanMagang.findByPk(id, {
      include: [{ model: User, as: 'user', attributes: ['email', 'nama'] }],
    });

    if (!permintaanMagang) {
      return res.status(404).json({ error: 'Permintaan magang tidak ditemukan.' });
    }

    res.status(200).json(permintaanMagang);
  } catch (error) {
    console.error('Error in getPermintaanMagangById:', error.message || error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
};

const updateStatusPermintaanMagang = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusPermohonan } = req.body;

    if (!['menunggu', 'disetujui', 'ditolak'].includes(statusPermohonan)) {
      return res.status(400).json({ error: 'Status permohonan tidak valid.' });
    }

    const permintaanMagang = await PermintaanMagang.findByPk(id);

    if (!permintaanMagang) {
      return res.status(404).json({ error: 'Permintaan magang tidak ditemukan.' });
    }

    permintaanMagang.statusPermohonan = statusPermohonan;
    await permintaanMagang.save();

    res.status(200).json({ message: 'Status permintaan magang berhasil diperbarui.', permintaanMagang });
  } catch (error) {
    console.error('Error in updateStatusPermintaanMagang:', error.message || error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
};

const deletePermintaanMagang = async (req, res) => {
  try {
    const { id } = req.params;

    const permintaanMagang = await PermintaanMagang.findByPk(id);

    if (!permintaanMagang) {
      return res.status(404).json({ error: 'Permintaan magang tidak ditemukan.' });
    }

    await permintaanMagang.destroy();

    res.status(200).json({ message: 'Permintaan magang berhasil dihapus.' });
  } catch (error) {
    console.error('Error in deletePermintaanMagang:', error.message || error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = {
  createPermintaanMagang,
  getAllPermintaanMagang,
  getPermintaanMagangById,
  updateStatusPermintaanMagang,
  deletePermintaanMagang,
  getMyPermintaanMagang
};
