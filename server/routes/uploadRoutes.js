// server/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Send back the secure URL of the uploaded image
  res.status(200).json({ imageUrl: req.file.path });
});

module.exports = router;