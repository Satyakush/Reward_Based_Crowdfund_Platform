const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); // ✅ destructure upload

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // ✅ CloudinaryStorage puts the Cloudinary URL in req.file.path
  res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;
