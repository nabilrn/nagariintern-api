const express = require('express');
const router = express.Router();


const {
    createPermintaanMagangMahasiswa,
    createPermintaanMagangSiswa,
    getAllPermintaanMagang,
    getPermintaanMagangById,
    getMyPermintaanMagang,
    approveStatusPermintaanMagang,
    sendSuratPernyataan,
    
  } = require('../controllers/permintaanMagangController');
const { verifyToken } = require('../middleware/AuthMiddleWare');
const uploadFields = require('../middleware/fileUpload');
const { permintaanDiterima,detailUnivDiverifikasi,detailSmkDiverifikasi,univGenerateLetter, smkGenerateLetter ,sendSuratBalasan} = require('../controllers/SuperAdminController');

  
// Basic route
router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Endpoint untuk membuat permintaan magang
router.post('/intern/mahasiswa', verifyToken, uploadFields, createPermintaanMagangMahasiswa);

router.post('/intern/siswa', verifyToken, uploadFields, createPermintaanMagangSiswa);

// Endpoint untuk mendapatkan semua permintaan magang
router.get('/intern', verifyToken, getAllPermintaanMagang);

router.get('/intern/diterima', verifyToken, permintaanDiterima)
router.get('/intern/diterima/univ/:idUniv/:idProdi', detailUnivDiverifikasi)
router.get('/intern/diterima/smk/:idSmk', detailSmkDiverifikasi)

router.post('/intern/diterima/univ/:idUniv/:idProdi', univGenerateLetter)
// router.post('/intern/diterima/smk/:idSmk', detailSmkDiverifikasi)

router.get('/my-intern', verifyToken,getMyPermintaanMagang);

// Endpoint untuk mendapatkan permintaan magang berdasarkan ID
router.get('/intern/:id', getPermintaanMagangById);

// // Endpoint untuk memperbarui status permintaan magang
router.patch('/intern/:id/approve', approveStatusPermintaanMagang);
router.post('/intern/diterima/smk/:idSmk', smkGenerateLetter)
router.patch('/intern/:id/reject', approveStatusPermintaanMagang);

router.post('/intern/send-surat-balasan/:idPermintaan', verifyToken, uploadFields, sendSuratBalasan);
router.post('/intern/send-surat-pernyataan', verifyToken, uploadFields, sendSuratPernyataan );

// // Endpoint untuk menghapus permintaan magang
// router.delete('intern/:id', deletePermintaanMagang);
module.exports = router;