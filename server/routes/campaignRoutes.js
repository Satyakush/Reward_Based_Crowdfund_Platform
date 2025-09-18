// server/routes/campaignRoutes.js

const express = require('express');
const router = express.Router();
const { 
    createCampaign, 
    getCampaigns, 
    getCampaignById, 
    pledgeToCampaign // <-- Import new function
} = require('../controllers/campaignController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getCampaigns).post(protect, createCampaign);
router.route('/:id').get(getCampaignById);
router.route('/:id/pledge').post(protect, pledgeToCampaign); // <-- Add new route

module.exports = router;