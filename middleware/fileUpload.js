const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const fieldname = file.fieldname;
    const fileExtension = path.extname(file.originalname);
    const filename = `${fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF yang diizinkan!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

const uploadFields = upload.fields([
  { name: 'fileCv', maxCount: 1 },
  { name: 'fileTranskrip', maxCount: 1 },
  { name: 'fileKtp', maxCount: 1 },
  { name: 'fileSuratPengantar', maxCount: 1 },
  { name: 'SuratPengantar', maxCount: 1 },
  { name: 'fileSuratBalasan', maxCount: 1 },
  { name: 'fileSuratPernyataanSiswa', maxCount: 1 },
  { name: 'fileSuratPernyataanWali', maxCount: 1 },
  { name: 'fileTabungan', maxCount: 1 },
  { name: 'fileRekap', maxCount: 1 },


]);

module.exports = uploadFields;
