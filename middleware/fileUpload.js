const multer = require('multer');
const path = require('path');

// Menentukan lokasi penyimpanan file dan nama file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder untuk menyimpan file (buat folder uploads)
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Mendapatkan ekstensi file
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + fileExtension; // Membuat nama file unik
    cb(null, filename);
  }
});

// Filter file yang diizinkan (contoh: hanya gambar atau pdf)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Jenis file tidak diizinkan!'), false);
  }
  cb(null, true);
};

// Mengatur multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batasi ukuran file maksimal 5MB
});

module.exports = upload;
