const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/sekolah', async (req, res) => {
  try {
    const npsn = req.query.npsn;
    const response = await axios.get(`https://api-sekolah-indonesia.vercel.app/sekolah?npsn=${npsn}`);
    console.log('Response:', response.data);
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