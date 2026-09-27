const Campaign = require('../models/Campaign');
const mongoose = require('mongoose');
const { cloudinary } = require('../config/cloudinary');

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

const normalizeRewards = (rewards) => {
  if (!Array.isArray(rewards)) return [];
  return rewards.map((reward) => ({
    title: String(reward.title || '').trim(),
    description: String(reward.description || '').trim(),
    pledgeAmount: Number(reward.pledgeAmount),
  })).filter((reward) => reward.title && reward.description && Number.isFinite(reward.pledgeAmount) && reward.pledgeAmount > 0);
};

const validateCampaignFields = ({ title, story, goalAmount, endDate }) => {
  if (!String(title || '').trim() || !String(story || '').trim()) return 'Title and story are required.';
  const goal = Number(goalAmount);
  if (!Number.isFinite(goal) || goal <= 0) return 'Funding goal must be greater than zero.';
  if (!endDate || Number.isNaN(new Date(endDate).getTime())) return 'A valid campaign end date is required.';
  if (new Date(endDate).getTime() <= Date.now()) return 'Campaign end date must be in the future.';
  return null;
};

const createCampaign = async (req, res, next) => {
  try {
    const { title, story, goalAmount, endDate, rewards, imageUrl } = req.body;
    const validationError = validateCampaignFields({ title, story, goalAmount, endDate });
    if (validationError) return res.status(400).json({ message: validationError });

    const finalImageUrl = req.file?.path || imageUrl;
    if (!finalImageUrl) return res.status(400).json({ message: 'Please upload a campaign image.' });

    const normalizedRewards = normalizeRewards(rewards);
    if (!normalizedRewards.length) return res.status(400).json({ message: 'Add at least one valid reward tier.' });

    const campaign = await Campaign.create({
      creator: req.user._id,
      title: title.trim(),
      story: story.trim(),
      goalAmount: Number(goalAmount),
      endDate,
      imageUrl: finalImageUrl,
      rewards: normalizedRewards,
    });

    const populated = await Campaign.findById(campaign._id).populate('creator', '_id name');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const getCampaigns = async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(24, Math.max(1, Number.parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;
    const search = String(req.query.search || '').trim();
    const filter = search ? { $or: [{ title: { $regex: search, $options: 'i' } }, { story: { $regex: search, $options: 'i' } }] } : {};

    const [campaigns, total] = await Promise.all([
      Campaign.find(filter).populate('creator', '_id name').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Campaign.countDocuments(filter),
    ]);

    res.json({ campaigns, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

const getCampaignById = async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid campaign ID.' });
  try {
    const campaign = await Campaign.findById(req.params.id).populate('creator', '_id name');
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });
    res.json(campaign);
  } catch (error) {
    next(error);
  }
};

const getMyCampaigns = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ creator: req.user._id }).populate('creator', '_id name').sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
};

const updateCampaign = async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid campaign ID.' });
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });
    if (campaign.creator.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You can only edit your own campaigns.' });

    const { title, story, goalAmount, endDate, imageUrl, rewards } = req.body;
    const nextValues = {
      title: title !== undefined ? title : campaign.title,
      story: story !== undefined ? story : campaign.story,
      goalAmount: goalAmount !== undefined ? goalAmount : campaign.goalAmount,
      endDate: endDate !== undefined ? endDate : campaign.endDate,
    };

    const validationError = validateCampaignFields(nextValues);
    if (validationError) return res.status(400).json({ message: validationError });

    const nextGoal = Number(nextValues.goalAmount);
    if (nextGoal < campaign.amountRaised) {
      return res.status(400).json({ message: 'Funding goal cannot be lower than the amount already raised.' });
    }

    campaign.title = String(nextValues.title).trim();
    campaign.story = String(nextValues.story).trim();
    campaign.goalAmount = nextGoal;
    campaign.endDate = nextValues.endDate;
    if (imageUrl) campaign.imageUrl = imageUrl;
    if (req.file?.path) campaign.imageUrl = req.file.path;
    if (rewards !== undefined) {
      const normalizedRewards = normalizeRewards(rewards);
      if (!normalizedRewards.length) return res.status(400).json({ message: 'Add at least one valid reward tier.' });
      campaign.rewards = normalizedRewards;
    }

    const updated = await campaign.save();
    res.json(await Campaign.findById(updated._id).populate('creator', '_id name'));
  } catch (error) {
    next(error);
  }
};

const deleteCampaign = async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid campaign ID.' });
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });
    if (campaign.creator.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'You can only delete your own campaigns.' });

    if (campaign.imageUrl?.includes('res.cloudinary.com/')) {
      const match = campaign.imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/);
      if (match) {
        const publicId = match[1].replace(/\.[^/.]+$/, '');
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(() => null);
      }
    }

    await campaign.deleteOne();
    res.json({ message: 'Campaign deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

const pledgeToCampaign = async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid campaign ID.' });

  try {
    const amount = Number(req.body.pledgeAmount);
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: 'Pledge amount must be greater than zero.' });

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });
    if (campaign.creator.toString() === req.user._id.toString()) return res.status(400).json({ message: 'You cannot pledge to your own campaign.' });
    if (new Date(campaign.endDate).getTime() <= Date.now()) return res.status(400).json({ message: 'This campaign has ended.' });

    const remaining = campaign.goalAmount - campaign.amountRaised;
    if (remaining <= 0) return res.status(400).json({ message: 'This campaign is already fully funded.' });
    if (amount > remaining) return res.status(400).json({ message: `Pledge cannot exceed the remaining goal of ${remaining}.` });

    const updated = await Campaign.findOneAndUpdate(
      { _id: campaign._id, amountRaised: campaign.amountRaised },
      { $inc: { amountRaised: amount }, $push: { backers: { user: req.user._id, amount } } },
      { new: true }
    );

    if (!updated) return res.status(409).json({ message: 'Campaign changed while processing your pledge. Please try again.' });

    res.json(await Campaign.findById(updated._id).populate('creator', '_id name'));
  } catch (error) {
    next(error);
  }
};

module.exports = { createCampaign, getCampaigns, getCampaignById, pledgeToCampaign, getMyCampaigns, updateCampaign, deleteCampaign };
