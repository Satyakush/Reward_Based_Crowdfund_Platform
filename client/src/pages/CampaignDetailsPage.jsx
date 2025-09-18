// src/pages/CampaignDetailsPage.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const CampaignDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/campaigns/${id}`);
        setCampaign(data);
      } catch (err) {
        setError('Could not fetch campaign details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaign();
  }, [id]);

  const handlePledge = async (pledgeAmount) => {
    if (!window.confirm(`Are you sure you want to pledge $${pledgeAmount}?`)) {
      return;
    }
    try {
      const res = await axios.post(`/api/campaigns/${id}/pledge`, { pledgeAmount });
      setCampaign(res.data);
      toast.success('Thank you for your generous pledge!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Pledge failed. Please try again.');
    }
  };

  if (loading) return <div className="p-8 text-center font-semibold">Loading campaign...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!campaign) return <div className="p-8 text-center">Campaign not found.</div>;
  
  const percentageRaised = (campaign.goalAmount > 0) ? (campaign.amountRaised / campaign.goalAmount) * 100 : 0;
  
  const daysToGo = (() => {
    const endDate = new Date(campaign.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    if (diffTime <= 0) { return 'Ended'; }
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  })();

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Title Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">{campaign.title}</h1>
          
          {/* CORRECTED CODE: Edit Campaign Button */}
          {user && campaign.creator && user._id === campaign.creator._id && (
            <div className="mt-4">
              <Link 
                to={`/edit-campaign/${campaign._id}`}
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                Edit Campaign
              </Link>
            </div>
          )}

          <p className="mt-4 text-lg text-gray-600">{campaign.story.substring(0, 150)}...</p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content (Image & Story) */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-lg">
              <img src={campaign.imageUrl} alt={campaign.title} className="h-auto w-full object-cover" />
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold text-gray-800">Story</h2>
              <p className="prose prose-lg mt-4 max-w-none whitespace-pre-wrap text-gray-700">{campaign.story}</p>
            </div>
          </div>

          {/* Sidebar (Funding & Rewards) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Funding Box */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <div className="h-2 w-full rounded-full bg-gray-300">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${percentageRaised > 100 ? 100 : percentageRaised}%` }}></div>
                </div>
                <div className="mt-4">
                  <p className="text-4xl font-bold text-green-600">${campaign.amountRaised.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">pledged of ${campaign.goalAmount.toLocaleString()} goal</p>
                </div>
                <div className="mt-6 grid grid-cols-2 text-center">
                  <div>
                    <p className="text-3xl font-bold">{campaign.backers?.length || 0}</p>
                    <p className="text-sm text-gray-500">backers</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{daysToGo}</p>
                    <p className="text-sm text-gray-500">{daysToGo === 'Ended' ? '' : 'days to go'}</p>
                  </div>
                </div>
              </div>
              
              {/* Rewards */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Support</h2>
                {campaign.rewards?.length > 0 ? (
                  campaign.rewards.map((reward) => (
                    <div key={reward._id} className="cursor-pointer rounded-lg border-2 border-gray-200 bg-white p-4 transition-all duration-300 hover:border-green-500">
                      <p className="text-xl font-bold text-gray-800">${reward.pledgeAmount}</p>
                      <h3 className="mt-1 text-lg font-semibold">{reward.title}</h3>
                      <p className="mt-2 text-sm text-gray-600">{reward.description}</p>
                      {user ? (
                        <button onClick={() => handlePledge(reward.pledgeAmount)} className="mt-4 w-full rounded-md bg-green-500 py-3 font-semibold text-white hover:bg-green-600">
                          Pledge ${reward.pledgeAmount}
                        </button>
                      ) : null}
                    </div>
                  ))
                ) : ( <p className="text-center text-gray-500">No reward tiers available.</p> )}
                {!user && (
                  <Link to="/login" className="block w-full rounded-md bg-gray-800 py-3 text-center font-semibold text-white hover:bg-gray-700">
                    Login to pledge
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPage;