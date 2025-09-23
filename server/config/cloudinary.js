// server/config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'crowdfund_platform',
    allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

// ✅ this is a multer instance with storage attached
const upload = multer({ storage });

module.exports = { cloudinary, upload };
