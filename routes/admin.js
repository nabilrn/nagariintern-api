const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/AuthMiddleWare');

const { getAllUnitKerja, editKuotaUnitKerja,generateLetter } = require('../controllers/SuperAdminController');


router.get('/unit-kerja', verifyToken, getAllUnitKerja);
router.put('/unit-kerja/:id', verifyToken, editKuotaUnitKerja);
router.post('/generate-letter', generateLetter);
module.exports = router;    