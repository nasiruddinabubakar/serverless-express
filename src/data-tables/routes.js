const { Router } = require('express');
const multer = require('multer');
const ctrl = require('./controller');
const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept CSV files with various MIME types
    if (file.mimetype === 'text/csv' || 
        file.mimetype === 'application/csv' ||
        file.mimetype === 'text/plain' ||
        file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Instantiate the controller

router.get('/', ctrl.getAllCustomDataTypes);
router.get('/:id', ctrl.getCustomDataTypeById);
router.post('/', ctrl.createCustomDataType);
router.put('/:id', ctrl.updateCustomDataType);
router.delete('/:id', ctrl.deleteCustomDataType);

// CSV upload route
router.post('/:id/upload-csv', upload.single('csvFile'), ctrl.uploadCsvData);

// Get CSV data rows
router.get('/:id/rows', ctrl.getValuesByCustomDataTypeId);

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: { msg: 'File too large. Maximum size is 10MB.' }
      });
    }
  }
  
  if (error.message === 'Only CSV files are allowed') {
    return res.status(400).json({
      success: false,
      error: { msg: error.message }
    });
  }
  
  next(error);
});

module.exports = router;
