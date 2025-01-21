const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/AuthMiddleWare');
const { getAllUnitKerja, editKuotaUnitKerja, generateLetter } = require('../controllers/SuperAdminController');

router.get('/unit-kerja', verifyToken, getAllUnitKerja);
router.put('/unit-kerja/:id', verifyToken, editKuotaUnitKerja);

// Combined letter generation endpoint
router.post('/generate-letter/:type/:idInstitusi/:idProdi?', verifyToken, async (req, res) => {
  try {
    const { type, idInstitusi, idProdi } = req.params;
    let letterData;

    if (type === 'univ' && !idProdi) {
      return res.status(400).json({
        error: 'Program studi ID required for university letters'
      });
    }

    // Get letter data based on type
    if (type === 'univ') {
      letterData = await generateLetter({
        ...req.body,
        type: 'university',
        idUniv: idInstitusi,
        idProdi: idProdi
      });
    } else if (type === 'smk') {
      letterData = await generateLetter({
        ...req.body,
        type: 'smk',
        idSmk: idInstitusi
      });
    } else {
      return res.status(400).json({
        error: 'Invalid letter type'
      });
    }

    if (!letterData || letterData.length === 0) {
      throw new Error('Generated PDF is empty');
    }

    // Send PDF for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=surat_magang_${type}_${Date.now()}.pdf`);
    res.setHeader('Content-Length', letterData.length);
    res.send(letterData);

  } catch (error) {
    console.error('Letter generation failed:', error);
    res.status(500).json({
      error: 'Failed to generate PDF',
      details: error.message
    });
  }
});

module.exports = router;