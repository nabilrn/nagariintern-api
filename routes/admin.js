const express = require('express');
const router = express.Router();
const path = require('path');
const { verifyToken } = require('../middleware/AuthMiddleWare');
const { 
    getAllUnitKerja, 
    editKuotaUnitKerja, 
    getDiverifikasi , 
    createJadwalPendaftaran, 
    editSchedule, 
    createAccountPegawaiCabang, 
    getAccountPegawai, 
    editPasswordPegawai, 
    dahsboardData,
    getSelesai,
    getDetailSelesai,
    getMulaiMagang,
    editWaktuSelesaiPesertaMagang,
    createAbsensi,
    getAbsensi,
    getDetailAbsensi,
    updateAbsensi,
    generateAbsensi,
    getRekapAbsensi

} = require('../controllers/SuperAdminController');
const { cabangPermintaanMagang } = require('../controllers/permintaanMagangController');

router.get('/unit-kerja', verifyToken, getAllUnitKerja);
router.get('/diverifikasi', verifyToken, getDiverifikasi);
router.get('/account-pegawai-cabang', verifyToken, getAccountPegawai);
router.get('/dashboard', verifyToken, dahsboardData);
router.get('/intern', verifyToken, cabangPermintaanMagang);
router.get('/intern/done', verifyToken, getSelesai);
router.get('/intern/done/:id', verifyToken, getDetailSelesai);
router.get('/absensi/rekap', verifyToken, getRekapAbsensi);
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

router.post('/absensi', verifyToken, createAbsensi);
router.get('/absensi', verifyToken, getAbsensi)
router.get('/absensi/:bulan/:tahun',verifyToken, getDetailAbsensi)
router.patch('/absensi/:id', verifyToken, updateAbsensi);
router.post('/absensi/:bulan/:tahun/print',verifyToken, generateAbsensi)


module.exports = router;
