const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/AuthMiddleWare');
const { 
    getAllUnitKerja, 
    editKuotaUnitKerja, 
    getDiverifikasi , 
    estimateCost, 
    createJadwalPendaftaran, 
    editSchedule, 
    createAccountPegawaiCabang, 
    getAccountPegawai, 
    editPasswordPegawai, 
    dahsboardData
} = require('../controllers/SuperAdminController');
const { uploadFields } = require('../middleware/fileUpload');
const { cabangPermintaanMagang } = require('../controllers/permintaanMagangController');

router.get('/unit-kerja', verifyToken, getAllUnitKerja);
router.get('/diverifikasi', verifyToken, getDiverifikasi);
router.get('/estimate-cost', verifyToken, estimateCost);
router.get('/account-pegawai-cabang', verifyToken, getAccountPegawai);
router.get('/dashboard', verifyToken, dahsboardData);
router.get('/intern', verifyToken, cabangPermintaanMagang);

router.post('/jadwal-pendaftaran', verifyToken, createJadwalPendaftaran);
router.post('/create-account-pegawai-cabang', verifyToken, createAccountPegawaiCabang);

router.patch('/unit-kerja/:id', verifyToken, editKuotaUnitKerja);
router.patch('/edit-password-pegawai-cabang/:id', verifyToken, editPasswordPegawai);
router.patch('/jadwal-pendaftaran/:id', verifyToken, editSchedule);

module.exports = router;