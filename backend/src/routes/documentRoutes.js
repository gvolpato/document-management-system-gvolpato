const express = require('express');
const multer = require('multer');

const documentController = require('../controllers/documentController');
const { STORAGE_DIR } = require('../repositories/documentRepository');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}-${safeName}`);
  },
});

const upload = multer({
  storage,
});

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/documents', documentController.listDocuments);
router.get('/documents/:id/download', documentController.downloadDocument);

module.exports = router;
