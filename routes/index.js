const express = require('express');
const router = express.Router();
const {
    createPermintaanMagang,
    getAllPermintaanMagang,
    getPermintaanMagangById,
    getMyPermintaanMagang,
    updateStatusPermintaanMagang,
    deletePermintaanMagang,
  } = require('../controllers/permintaanMagangController');
const { verifyToken } = require('../middleware/AuthMiddleWare');
const upload = require('../middleware/fileUpload');

  
// Basic route
router.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Endpoint untuk membuat permintaan magang
router.post('/intern', verifyToken, upload.single('fileLamaran'), createPermintaanMagang);

// Endpoint untuk mendapatkan semua permintaan magang
router.get('/intern', verifyToken, getAllPermintaanMagang);

router.get('/my-intern', verifyToken,getMyPermintaanMagang);
router.get('/my-intern/:id', verifyToken,getMyPermintaanMagang);

// Endpoint untuk mendapatkan permintaan magang berdasarkan ID
router.get('/intern/:id', getPermintaanMagangById);

// // Endpoint untuk memperbarui status permintaan magang
// router.patch('intern/:id', updateStatusPermintaanMagang);

// // Endpoint untuk menghapus permintaan magang
// router.delete('intern/:id', deletePermintaanMagang);
module.exports = router;