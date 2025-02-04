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
    downloadSuratBalasan,
    rejectStatusPermintaanMagang,
    rejectedStatusPermintaanMagang
    
  } = require('../controllers/permintaanMagangController');
const { verifyToken } = require('../middleware/AuthMiddleWare');
const uploadFields = require('../middleware/fileUpload');
const { permintaanDiterima,detailUnivDiterima,detailSmkDiterima,univGenerateLetter, smkGenerateLetter ,sendSuratBalasan,sendSuratPengantar, detailUnivDiverifikasi, detailSmkDiverifikasi, generateSuratPengantarMhs, generateSuratPengantarSiswa,getJadwalPendaftaran,findOneJadwalPendaftaran, verifyEmailPegawai} = require('../controllers/SuperAdminController');
const { route } = require('./admin');

  
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
router.get('/intern/diterima/univ/:idUniv/:idProdi', detailUnivDiterima)
router.get('/intern/diverifikasi/univ/:idUniv/:idProdi/:unitKerjaId', detailUnivDiverifikasi)
router.post('/intern/diverifikasi/univ/:idUniv/:idProdi/:unitKerjaId', generateSuratPengantarMhs)
router.post('/intern/diverifikasi/smk/:idSmk/:unitKerjaId', generateSuratPengantarSiswa)

router.get('/intern/diterima/smk/:idSmk', detailSmkDiterima)
router.get('/intern/diverifikasi/smk/:idSmk/:unitKerjaId', detailSmkDiverifikasi)

router.post('/intern/diterima/univ/:idUniv/:idProdi', univGenerateLetter)
// router.post('/intern/diterima/smk/:idSmk', detailSmkDiverifikasi)

router.get('/my-intern', verifyToken,getMyPermintaanMagang);

// Endpoint untuk mendapatkan permintaan magang berdasarkan ID
router.get('/intern/:id', getPermintaanMagangById);

// // Endpoint untuk memperbarui status permintaan magang
router.patch('/intern/:id/approve', approveStatusPermintaanMagang);
router.post('/intern/diterima/smk/:idSmk', smkGenerateLetter)
router.patch('/intern/:id/reject', rejectedStatusPermintaanMagang);

router.post('/intern/send-surat-pernyataan', verifyToken, uploadFields, sendSuratPernyataan );
router.post('/my-intern/reject', verifyToken, rejectStatusPermintaanMagang);

router.post('/intern/send-surat-balasan', verifyToken, uploadFields, sendSuratBalasan);

router.get('/download-surat-balasan',verifyToken, downloadSuratBalasan);

router.post('/intern/send-surat-pengantar', verifyToken, uploadFields, sendSuratPengantar);

router.get('/jadwal-pendaftaran', verifyToken, getJadwalPendaftaran);
router.get('/jadwal-curent',verifyToken, findOneJadwalPendaftaran);
router.get('/verify-email-pegawai', verifyEmailPegawai);
module.exports = router;