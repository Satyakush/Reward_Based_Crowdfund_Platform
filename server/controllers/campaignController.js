// server/controllers/campaignController.js

const Campaign = require('../models/Campaign');
const mongoose = require('mongoose');
const { cloudinary } = require('../config/cloudinary'); 

// @desc    Create a new campaign
const createCampaign = async (req, res, next) => {
    const { title, story, goalAmount, endDate, rewards } = req.body;
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
    }
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "campaigns",
        });
        const campaign = new Campaign({
            creator: req.user.id,
            title, story, goalAmount, endDate, rewards,
            imageUrl: result.secure_url,
        });
        const createdCampaign = await campaign.save();
        res.status(201).json(createdCampaign);
    } catch (error) { next(error); }
};

// @desc    Get all campaigns
const getCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find({}).populate({
            path: 'creator',
            select: 'name'
        });
        res.json(campaigns);
    } catch (error) { next(error); }
};

// @desc    Get a single campaign by ID
const getCampaignById = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid campaign ID' });
    }
    try {
        const campaign = await Campaign.findById(req.params.id).populate({
            path: 'creator',
            select: '_id name'
        });
        if (campaign) {
            res.json(campaign);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) { next(error); }
};

// --- Your other functions (pledge, delete, etc.) remain the same ---
// (The code below is from your repo and should already be in this file)

const pledgeToCampaign = async (req, res, next) => { /* ...your existing code... */ };
const getMyCampaigns = async (req, res, next) => { /* ...your existing code... */ };
const updateCampaign = async (req, res, next) => { /* ...your existing code... */ };
const deleteCampaign = async (req, res, next) => { /* ...your existing code... */ };


module.exports = {
    createCampaign,
    getCampaigns,
    getCampaignById,
    pledgeToCampaign,
    getMyCampaigns,
    updateCampaign,
    deleteCampaign,
};