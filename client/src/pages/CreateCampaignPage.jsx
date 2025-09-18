// src/pages/CreateCampaignPage.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateCampaignPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    goalAmount: '',
    endDate: '',
    imageUrl: '', // Will hold the URL from Cloudinary
    rewards: [{ title: '', description: '', pledgeAmount: '' }],
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setUploading(true);

    try {
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, imageUrl: data.imageUrl });
      setUploading(false);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      setUploading(false);
      toast.error('Image upload failed.');
    }
  };

  const onSubmit = async (e) => { /* ... onSubmit logic remains the same ... */ };

  // --- Full component code for completeness ---
  const handleRewardChange = (index, e) => {
      const updatedRewards = formData.rewards.map((reward, i) => (i === index ? { ...reward, [e.target.name]: e.target.value } : reward));
      setFormData({ ...formData, rewards: updatedRewards });
  };
  const addRewardTier = () => {
      setFormData({ ...formData, rewards: [...formData.rewards, { title: '', description: '', pledgeAmount: '' }] });
  };
  const removeRewardTier = (index) => {
      setFormData({ ...formData, rewards: formData.rewards.filter((_, i) => i !== index) });
  };
  const fullOnSubmit = async (e) => {
      e.preventDefault();
      if (!formData.imageUrl) {
          return toast.error('Please upload a campaign image.');
      }
      setLoading(true);
      try {
          await axios.post('/api/campaigns', formData);
          toast.success('Campaign created successfully!');
          navigate('/');
      } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to create campaign.');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-center text-4xl font-bold">Start a New Campaign</h1>
      <form onSubmit={fullOnSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-md">
        {/* Main Campaign Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
          <input type="text" name="title" value={formData.title} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
        </div>

        {/* --- NEW IMAGE UPLOAD FIELD --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Image</label>
          <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Campaign Preview" className="mx-auto h-48 w-auto rounded-md" />
              ) : (
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              )}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="image-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-green-500 focus-within:ring-offset-2 hover:text-green-500">
                  <span>Upload a file</span>
                  <input id="image-upload" name="image" type="file" className="sr-only" onChange={uploadFileHandler} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              {uploading && <p>Uploading...</p>}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Story</label>
          <textarea name="story" value={formData.story} onChange={onChange} required rows="6" className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Funding Goal ($)</label>
          <input type="number" name="goalAmount" value={formData.goalAmount} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
        </div>

        {/* Reward Tiers Section */}
        <div className="space-y-4 rounded-md border border-gray-300 p-4">
          {/* ... Rewards JSX is the same ... */}
          <h2 className="text-lg font-semibold">Reward Tiers</h2>
          {formData.rewards.map((reward, index) => (
            <div key={index} className="space-y-2 rounded border p-3">
              <div className="flex justify-between">
                <p className="font-medium">Reward #{index + 1}</p>
                {formData.rewards.length > 1 && ( <button type="button" onClick={() => removeRewardTier(index)} className="text-sm text-red-600 hover:text-red-800">Remove</button>)}
              </div>
              <div>
                <label className="block text-xs text-gray-600">Title</label>
                <input type="text" name="title" value={reward.title} onChange={(e) => handleRewardChange(index, e)} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Description</label>
                <input type="text" name="description" value={reward.description} onChange={(e) => handleRewardChange(index, e)} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-600">Pledge Amount ($)</label>
                <input type="number" name="pledgeAmount" value={reward.pledgeAmount} onChange={(e) => handleRewardChange(index, e)} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
              </div>
            </div>
          ))}
          <button type="button" onClick={addRewardTier} className="text-sm font-medium text-green-600 hover:text-green-800">+ Add Another Reward Tier</button>
        </div>

        <div>
          <button type="submit" disabled={loading || uploading} className="flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCampaignPage;