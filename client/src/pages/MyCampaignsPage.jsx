// src/pages/MyCampaignsPage.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const { data } = await axios.get('/api/campaigns/mycampaigns');
        setCampaigns(data);
      } catch (error) {
        toast.error('Failed to fetch your campaigns.');
        console.error('Failed to fetch my campaigns', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCampaigns();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this campaign?')) {
      try {
        await axios.delete(`/api/campaigns/${id}`);
        // Remove the deleted campaign from the local state to update the UI instantly
        setCampaigns(campaigns.filter((c) => c._id !== id));
        toast.success('Campaign deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete campaign.');
        console.error('Failed to delete campaign', error);
      }
    }
  };

  if (loading) return <p className="p-8 text-center">Loading your campaigns...</p>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-center text-4xl font-bold">My Campaigns</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full rounded-md bg-white shadow">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Goal</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Raised</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {campaigns.length > 0 ? campaigns.map((campaign) => (
              <tr key={campaign._id}>
                <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{campaign.title}</td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">${campaign.goalAmount.toLocaleString()}</td>
                <td className="whitespace-nowrap px-6 py-4 text-gray-500">${campaign.amountRaised.toLocaleString()}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <Link to={`/edit-campaign/${campaign._id}`} className="mr-4 text-indigo-600 hover:text-indigo-900">Edit</Link>
                  <button onClick={() => handleDelete(campaign._id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">You have not created any campaigns yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCampaignsPage;