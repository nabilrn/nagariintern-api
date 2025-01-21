const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    // Create unique filename with original field name to identify file type
    const fieldname = file.fieldname; // Gets the field name from the form
    const fileExtension = path.extname(file.originalname);
    const filename = `${fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
    cb(null, filename);
  }
});

// Update file filter to only allow PDFs as per client requirements
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF yang diizinkan!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Define which fields to expect for file uploads
const uploadFields = upload.fields([
  { name: 'fileCv', maxCount: 1 },
  { name: 'fileTranskrip', maxCount: 1 },
  { name: 'fileKtp', maxCount: 1 },
  { name: 'fileSuratPengantar', maxCount: 1 }
]);

module.exports = uploadFields;
