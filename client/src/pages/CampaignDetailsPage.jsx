import { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const formatCurrency = (value = 0) => `$${Number(value).toLocaleString()}`;

const CampaignDetailsPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;

    try {
      await axios.delete(`/api/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success('Campaign successfully deleted.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete campaign.');
    }
  };

  const handlePledge = async (pledgeAmount) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!window.confirm(`Are you sure you want to pledge ${formatCurrency(pledgeAmount)}?`)) return;

    try {
      const { data } = await axios.post(
        `/api/campaigns/${id}/pledge`,
        { pledgeAmount },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCampaign(data);
      toast.success('Thank you for backing this campaign!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Pledge failed. Please try again.');
    }
  };

  const campaignStats = useMemo(() => {
    if (!campaign) return { percentage: 0, daysLeft: 0, ended: false };

    const percentage = campaign.goalAmount > 0
      ? Math.min(100, Math.round((campaign.amountRaised / campaign.goalAmount) * 100))
      : 0;

    const diff = new Date(campaign.endDate).getTime() - Date.now();
    const ended = diff <= 0;

    return {
      percentage,
      ended,
      daysLeft: ended ? 0 : Math.ceil(diff / (1000 * 60 * 60 * 24)),
    };
  }, [campaign]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-7 w-32 rounded bg-slate-200" />
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_0.7fr]">
            <div className="h-[520px] rounded-[2rem] bg-slate-200" />
            <div className="h-[520px] rounded-[2rem] bg-white" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-xl text-rose-500">!</div>
          <h2 className="mt-4 text-xl font-black text-slate-900">{error || 'Campaign not found.'}</h2>
          <Link to="/" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600">
            Back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  const isCreator = Boolean(user?._id && campaign.creator?._id && user._id.toString() === campaign.creator._id.toString());

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-emerald-600">
          ← Back to campaigns
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.45fr_0.75fr] lg:items-start">
          <main>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative">
                <img src={campaign.imageUrl} alt={campaign.title} className="h-[360px] w-full object-cover sm:h-[500px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7">
                  <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-black backdrop-blur ${campaignStats.percentage >= 100 ? 'bg-emerald-400 text-slate-950' : campaignStats.ended ? 'bg-white/85 text-slate-700' : 'bg-slate-950/75 text-white'}`}>
                    {campaignStats.percentage >= 100 ? 'Fully funded' : campaignStats.ended ? 'Campaign ended' : 'Live campaign'}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">Campaign</p>
                <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">{campaign.title}</h1>
                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 font-semibold">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">
                      {(campaign.creator?.name || 'C').charAt(0).toUpperCase()}
                    </span>
                    {campaign.creator?.name || 'Campaign creator'}
                  </span>
                  <span>•</span>
                  <span>{campaign.rewards?.length || 0} reward tiers</span>
                </div>

                {isCreator && (
                  <div className="mt-6 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <span className="mr-auto flex items-center text-sm font-bold text-slate-600">Creator controls</span>
                    <Link to={`/edit-campaign/${campaign._id}`} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:text-emerald-600">
                      Edit
                    </Link>
                    <button onClick={handleDelete} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-rose-500 ring-1 ring-slate-200 hover:bg-rose-50">
                      Delete
                    </button>
                  </div>
                )}

                <div className="mt-10 border-t border-slate-200 pt-8">
                  <h2 className="text-2xl font-black text-slate-900">The story</h2>
                  <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-slate-600">{campaign.story}</p>
                </div>
              </div>
            </motion.div>
          </main>

          <aside className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-900/5"
            >
              <div className="p-6 sm:p-7">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-3xl font-black tracking-tight text-slate-950">{formatCurrency(campaign.amountRaised)}</p>
                    <p className="mt-1 text-sm font-medium text-slate-400">raised of {formatCurrency(campaign.goalAmount)} goal</p>
                  </div>
                  <span className="text-lg font-black text-emerald-600">{campaignStats.percentage}%</span>
                </div>

                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${campaignStats.percentage}%` }}
                    transition={{ duration: 0.9 }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 divide-x divide-slate-200 rounded-2xl bg-slate-50 py-4 text-center">
                  <div>
                    <p className="text-2xl font-black text-slate-900">{campaign.backers?.length || 0}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Backers</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900">{campaignStats.ended ? '—' : campaignStats.daysLeft}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Days left</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-600">Choose your reward</p>
                  <h2 className="mt-1 text-xl font-black text-slate-900">Back this idea</h2>
                </div>

                <div className="space-y-3">
                  {campaign.rewards?.length > 0 ? campaign.rewards.map((reward) => (
                    <div key={reward._id} className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg hover:shadow-slate-900/5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-black text-slate-950">{formatCurrency(reward.pledgeAmount)}</p>
                          <h3 className="mt-1 font-extrabold text-slate-800">{reward.title}</h3>
                        </div>
                        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">Reward</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{reward.description}</p>
                      <button
                        onClick={() => handlePledge(reward.pledgeAmount)}
                        disabled={campaignStats.ended || campaignStats.percentage >= 100}
                        className="mt-4 w-full rounded-xl bg-slate-950 py-3 text-sm font-black text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {campaignStats.ended ? 'Campaign ended' : campaignStats.percentage >= 100 ? 'Goal reached' : user ? `Pledge ${formatCurrency(reward.pledgeAmount)}` : 'Login to pledge'}
                      </button>
                    </div>
                  )) : (
                    <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-center text-sm text-slate-500">No reward tiers available.</p>
                  )}
                </div>

                {!user && !campaignStats.ended && (
                  <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                    You can browse freely. <Link to="/login" className="font-bold text-emerald-600 hover:underline">Log in</Link> when you're ready to back this campaign.
                  </p>
                )}
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsPage;
