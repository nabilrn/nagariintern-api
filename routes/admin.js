const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/AuthMiddleWare');
const { getAllUnitKerja, editKuotaUnitKerja, getDiverifikasi } = require('../controllers/SuperAdminController');
const { uploadFields } = require('../middleware/fileUpload');

router.get('/unit-kerja', verifyToken, getAllUnitKerja);
router.put('/unit-kerja/:id', verifyToken, editKuotaUnitKerja);
router.get('/diverifikasi', verifyToken, getDiverifikasi);



module.exports = router;