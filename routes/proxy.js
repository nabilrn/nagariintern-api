const express = require('express');
const router = express.Router();
const axios = require('axios');

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

module.exports = router;