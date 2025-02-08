const express = require('express');
const router = express.Router();
const path = require('path');
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
    dahsboardData,
    getSelesai,
    getDetailSelesai,
    getMulaiMagang,
    editWaktuSelesaiPesertaMagang
} = require('../controllers/SuperAdminController');
const { uploadFields } = require('../middleware/fileUpload');
const { cabangPermintaanMagang } = require('../controllers/permintaanMagangController');

router.get('/unit-kerja', verifyToken, getAllUnitKerja);
router.get('/diverifikasi', verifyToken, getDiverifikasi);
router.get('/estimate-cost', verifyToken, estimateCost);
router.get('/account-pegawai-cabang', verifyToken, getAccountPegawai);
router.get('/dashboard', verifyToken, dahsboardData);
router.get('/intern', verifyToken, cabangPermintaanMagang);
router.get('/intern/done', verifyToken, getSelesai);
router.get('/intern/done/:id', verifyToken, getDetailSelesai);
router.get('/intern/start', verifyToken, getMulaiMagang);
router.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    res.sendFile(filePath);
});

router.post('/jadwal-pendaftaran', verifyToken, createJadwalPendaftaran);
router.post('/create-account-pegawai-cabang', verifyToken, createAccountPegawaiCabang);

router.patch('/unit-kerja/:id', verifyToken, editKuotaUnitKerja);
router.patch('/edit-password-pegawai-cabang/:id', verifyToken, editPasswordPegawai);
router.patch('/jadwal-pendaftaran/:id', verifyToken, editSchedule);
router.patch('/intern/ongoing/:id', verifyToken, editWaktuSelesaiPesertaMagang);

module.exports = router;