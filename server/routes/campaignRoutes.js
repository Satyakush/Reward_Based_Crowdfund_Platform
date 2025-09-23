const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary'); // ✅ use upload here too

const { 
    createCampaign, 
    getCampaigns, 
    getCampaignById, 
    pledgeToCampaign,
    deleteCampaign,
    updateCampaign,
    getMyCampaigns
} = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCampaigns)
    .post(protect, upload.single('image'), createCampaign);

router.route('/mycampaigns').get(protect, getMyCampaigns);

router.route('/:id')
    .get(getCampaignById)
    .delete(protect, deleteCampaign)
    .put(protect, upload.single('image'), updateCampaign);

router.route('/:id/pledge').post(protect, pledgeToCampaign);

module.exports = router;
