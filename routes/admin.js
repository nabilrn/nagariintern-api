const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/AuthMiddleWare');
const { getAllUnitKerja, editKuotaUnitKerja, getDiverifikasi , estimateCost, createJadwalPendaftaran} = require('../controllers/SuperAdminController');
const { uploadFields } = require('../middleware/fileUpload');

router.get('/unit-kerja', verifyToken, getAllUnitKerja);
router.put('/unit-kerja/:id', verifyToken, editKuotaUnitKerja);
router.get('/diverifikasi', verifyToken, getDiverifikasi);
router.get('/estimate-cost', verifyToken, estimateCost);
router.post('/jadwal-pendaftaran', verifyToken, createJadwalPendaftaran);



module.exports = router;