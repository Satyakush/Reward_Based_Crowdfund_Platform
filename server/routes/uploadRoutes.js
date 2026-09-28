const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, (error) => {
    if (error) return next(error);
    if (!req.file?.path) return res.status(400).json({ message: 'No valid image was uploaded.' });
    res.status(200).json({ imageUrl: req.file.path });
  });
});

module.exports = router;
