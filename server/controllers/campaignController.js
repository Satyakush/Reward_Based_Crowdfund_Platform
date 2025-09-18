// server/controllers/campaignController.js

const Campaign = require('../models/Campaign');
const mongoose = require('mongoose');

// @desc    Create a new campaign
const createCampaign = async (req, res, next) => {
    const { title, story, goalAmount, endDate, rewards } = req.body;
    if (!title || !story || !goalAmount || !endDate) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }
    try {
        const campaign = new Campaign({ creator: req.user.id, title, story, goalAmount, endDate, rewards });
        const createdCampaign = await campaign.save();
        res.status(201).json(createdCampaign);
    } catch (error) { next(error); }
};

// @desc    Get all campaigns
const getCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find({}).populate('creator', 'name');
        res.json(campaigns);
    } catch (error) { next(error); }
};

// @desc    Get a single campaign by ID
const getCampaignById = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid campaign ID' });
    }
    try {
        const campaign = await Campaign.findById(req.params.id).populate('creator', 'name');
        if (campaign) {
            res.json(campaign);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) { next(error); }
};

// @desc    Pledge to a campaign
const pledgeToCampaign = async (req, res, next) => {
    const { pledgeAmount } = req.body;
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (campaign) {
            campaign.amountRaised += Number(pledgeAmount);
            const updatedCampaign = await campaign.save();
            const populatedCampaign = await Campaign.findById(updatedCampaign._id).populate('creator', 'name');
            res.json(populatedCampaign);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error) { next(error); }
};

// @desc    Get campaigns for logged-in user
const getMyCampaigns = async (req, res, next) => {
    try {
        const campaigns = await Campaign.find({ creator: req.user.id });
        res.json(campaigns);
    } catch (error) { next(error); }
};

// @desc    Update a campaign
const updateCampaign = async (req, res, next) => {
    const { title, story, goalAmount, endDate } = req.body;
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) { return res.status(404).json({ message: 'Campaign not found' }); }
        if (campaign.creator.toString() !== req.user.id) { return res.status(401).json({ message: 'User not authorized' }); }
        campaign.title = title || campaign.title;
        campaign.story = story || campaign.story;
        campaign.goalAmount = goalAmount || campaign.goalAmount;
        campaign.endDate = endDate || campaign.endDate;
        const updatedCampaign = await campaign.save();
        res.json(updatedCampaign);
    } catch (error) { next(error); }
};

// @desc    Delete a campaign
const deleteCampaign = async (req, res, next) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (!campaign) { return res.status(404).json({ message: 'Campaign not found' }); }
        if (campaign.creator.toString() !== req.user.id) { return res.status(401).json({ message: 'User not authorized' }); }
        await campaign.deleteOne();
        res.json({ message: 'Campaign removed' });
    } catch (error) { next(error); }
};

module.exports = {
    createCampaign,
    getCampaigns,
    getCampaignById,
    pledgeToCampaign,
    getMyCampaigns,
    updateCampaign,
    deleteCampaign,
};