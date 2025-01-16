const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Op } = require('sequelize');
const { Institusi } = require("../models/index");

router.get('/sekolah', async (req, res) => {
  try {
    const schoolName = req.query.sekolah;
    if (!schoolName) {
      return res.status(400).json({ error: 'Nama sekolah harus diisi' });
    }

    const response = await axios.get(`https://api-sekolah-indonesia.vercel.app/sekolah/s?sekolah=${encodeURIComponent(schoolName)}`);
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Terjadi kesalahan saat mengambil data sekolah',
      details: error.message 
    });
  }
});

router.get('/universitas', async (req, res) => {
  try {
    const { name, page = 1, per_page = 5 } = req.query; // Tambahkan default nilai page dan per_page
    console.log(name);

    if (!name) {
      return res.status(400).json({ error: 'Nama universitas harus diisi' });
    }

    // Hitung offset dan limit untuk pagination
    const limit = parseInt(per_page); // Jumlah data per halaman
    const offset = (parseInt(page) - 1) * limit; // Menghitung data awal berdasarkan halaman

    const { count, rows: institusi } = await Institusi.findAndCountAll({
      where: {
        name: { [Op.like]: `%${name}%` }
      },
      limit: limit,
      offset: offset,
    });

    if (institusi.length === 0) {
      return res.status(404).json({ message: 'Universitas tidak ditemukan' });
    }

    res.json({
      status: 'success',
      dataUniversitas: institusi,
      total_data: count, // Total semua data yang cocok
      page: parseInt(page), // Halaman saat ini
      per_page: limit, // Jumlah data per halaman
    });
  } catch (error) {
    console.error('Error fetching universitas:', error.message);
    res.status(500).json({ 
      error: 'Terjadi kesalahan saat mengambil data universitas',
      details: error.message 
    });
  }
});


module.exports = router;