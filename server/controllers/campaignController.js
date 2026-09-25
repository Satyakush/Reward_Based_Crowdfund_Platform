const Campaign = require('../models/Campaign');
const mongoose = require('mongoose');
const { cloudinary } = require('../config/cloudinary');

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

const createCampaign = async (req, res, next) => {
  try {
    const { title, story, goalAmount, endDate, rewards, imageUrl } = req.body;
    if (!title || !story || !goalAmount || !endDate) return res.status(400).json({ message: 'Title, story, goal amount and end date are required.' });
    const finalImageUrl = req.file?.path || imageUrl;
    if (!finalImageUrl) return res.status(400).json({ message: 'Please upload a campaign image.' });

    const campaign = await Campaign.create({
      creator: req.user._id, title: title.trim(), story: story.trim(),
      goalAmount: Number(goalAmount), endDate, imageUrl: finalImageUrl,
      rewards: Array.isArray(rewards) ? rewards : [],
    });
    const populated = await Campaign.findById(campaign._id).populate('creator', '_id name');
    res.status(201).json(populated);
  } catch (error) { next(error); }
};

const getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({}).populate('creator', '_id name').sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) { next(error); }
};

const getCampaignById = async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid campaign ID.' });
  try {
    const campaign = await Campaign.findById(req.params.id).populate('creator', '_id name');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });
    res.json(campaign);
  } catch (error) { next(error); }
};

const getMyCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ creator: req.user._id }).populate('creator', '_id name').sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) { next(error); }
};

const updateCampaign = async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid campaign ID.' });
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });
    if (campaign.creator.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You can only edit your own campaigns.' });

    const { title, story, goalAmount, endDate, imageUrl, rewards } = req.body;
    if (title !== undefined) campaign.title = title.trim();
    if (story !== undefined) campaign.story = story.trim();
    if (goalAmount !== undefined) campaign.goalAmount = Number(goalAmount);
    if (endDate !== undefined) campaign.endDate = endDate;
    if (imageUrl) campaign.imageUrl = imageUrl;
    if (req.file?.path) campaign.imageUrl = req.file.path;
    if (Array.isArray(rewards)) campaign.rewards = rewards;

    const updated = await campaign.save();
    res.json(await Campaign.findById(updated._id).populate('creator', '_id name'));
  } catch (error) { next(error); }
};

const deleteCampaign = async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid campaign ID.' });
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });
    if (campaign.creator.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You can only delete your own campaigns.' });
    await campaign.deleteOne();
    res.json({ message: 'Campaign deleted successfully.' });
  } catch (error) { next(error); }
};

const pledgeToCampaign = async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid campaign ID.' });
  try {
    const amount = Number(req.body.pledgeAmount);
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: 'Pledge amount must be greater than zero.' });

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });
    if (new Date(campaign.endDate).getTime() <= Date.now()) return res.status(400).json({ message: 'This campaign has ended.' });
    if (campaign.amountRaised >= campaign.goalAmount) return res.status(400).json({ message: 'This campaign is already fully funded.' });

    const remaining = campaign.goalAmount - campaign.amountRaised;
    if (amount > remaining) return res.status(400).json({ message: `Pledge cannot exceed the remaining goal of ${remaining}.` });

    campaign.amountRaised += amount;
    campaign.backers.push({ user: req.user._id, amount });
    await campaign.save();
    res.json(await Campaign.findById(campaign._id).populate('creator', '_id name'));
  } catch (error) { next(error); }
};

module.exports = { createCampaign, getCampaigns, getCampaignById, pledgeToCampaign, getMyCampaigns, updateCampaign, deleteCampaign };
