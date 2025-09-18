// src/pages/EditCampaignPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditCampaignPage = () => {
  const [formData, setFormData] = useState({ title: '', story: '', goalAmount: '', endDate: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const { data } = await axios.get(`/api/campaigns/${id}`);
        setFormData({
          title: data.title,
          story: data.story,
          goalAmount: data.goalAmount,
          endDate: new Date(data.endDate).toISOString().split('T')[0],
          imageUrl: data.imageUrl,
        });
      } catch (error) {
        toast.error('Failed to load campaign data.');
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

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
      toast.success('Image updated successfully!');
    } catch (error) {
      setUploading(false);
      toast.error('Image upload failed.');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`/api/campaigns/${id}`, formData);
      toast.success('Campaign updated successfully!');
      navigate('/my-campaigns');
    } catch (error) {
      toast.error('Failed to update campaign.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Loading campaign editor...</p>;

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-center text-4xl font-bold">Edit Your Campaign</h1>
      <form onSubmit={onSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-md">
        {/* Image Upload Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Image</label>
          <div className="mt-1 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Campaign Preview" className="mx-auto h-48 w-auto rounded-md" />
              ) : (
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
              )}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="image-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-green-600 focus-within:outline-none hover:text-green-500">
                  <span>Change image</span>
                  <input id="image-upload" name="image" type="file" className="sr-only" onChange={uploadFileHandler} />
                </label>
              </div>
              {uploading && <p>Uploading...</p>}
            </div>
          </div>
        </div>
        {/* Other Form Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
          <input type="text" name="title" value={formData.title} onChange={onChange} required className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" />
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
        <div>
          <button type="submit" disabled={loading || uploading} className="flex w-full justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCampaignPage;