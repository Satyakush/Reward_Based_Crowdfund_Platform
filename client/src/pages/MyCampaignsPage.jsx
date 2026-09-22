import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const StatIcon = ({ children }) => (
  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
    {children}
  </div>
);

const formatCurrency = (value = 0) => `$${Number(value).toLocaleString()}`;

const getProgress = (campaign) => {
  if (!campaign?.goalAmount) return 0;
  return Math.min(100, Math.round((Number(campaign.amountRaised || 0) / Number(campaign.goalAmount)) * 100));
};

const getStatus = (campaign) => {
  const endDate = campaign?.endDate ? new Date(campaign.endDate) : null;
  if (endDate && endDate.getTime() < Date.now()) return 'Ended';
  if (getProgress(campaign) >= 100) return 'Funded';
  return 'Active';
};

const getDaysLeft = (campaign) => {
  if (!campaign?.endDate) return null;
  const diff = new Date(campaign.endDate).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const MyCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      try {
        const { data } = await axios.get('/api/campaigns/mycampaigns');
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error('Failed to fetch your campaigns.');
        console.error('Failed to fetch my campaigns', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCampaigns();
  }, []);

  const stats = useMemo(() => {
    const totalGoal = campaigns.reduce((sum, campaign) => sum + Number(campaign.goalAmount || 0), 0);
    const totalRaised = campaigns.reduce((sum, campaign) => sum + Number(campaign.amountRaised || 0), 0);
    const active = campaigns.filter((campaign) => getStatus(campaign) === 'Active').length;
    const funded = campaigns.filter((campaign) => getStatus(campaign) === 'Funded').length;

    return {
      total: campaigns.length,
      active,
      funded,
      totalGoal,
      totalRaised,
      overallProgress: totalGoal ? Math.min(100, Math.round((totalRaised / totalGoal) * 100)) : 0,
    };
  }, [campaigns]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this campaign?')) return;

    try {
      await axios.delete(`/api/campaigns/${id}`);
      setCampaigns((current) => current.filter((campaign) => campaign._id !== id));
      toast.success('Campaign deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete campaign.');
      console.error('Failed to delete campaign', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-10 w-64 rounded-xl bg-slate-200" />
          <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="h-28 rounded-3xl bg-white shadow-sm" />)}
          </div>
          <div className="mt-8 h-96 rounded-3xl bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.22),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.18),transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Creator workspace
              </div>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Turn your ideas into <span className="text-emerald-400">momentum.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Manage your campaigns, track funding progress, and keep your next big idea moving.
              </p>
            </div>

            <Link
              to="/create-campaign"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-emerald-400 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300"
            >
              <span className="text-lg leading-none">+</span>
              Create campaign
            </Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="-mt-16 relative grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total campaigns', value: stats.total, icon: 'grid' },
            { label: 'Total raised', value: formatCurrency(stats.totalRaised), icon: 'dollar' },
            { label: 'Funding goal', value: formatCurrency(stats.totalGoal), icon: 'target' },
            { label: 'Overall progress', value: `${stats.overallProgress}%`, icon: 'trend' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-900/5"
            >
              <div className="flex items-center gap-4">
                <StatIcon>
                  <span className="text-sm font-black">{stat.icon === 'dollar' ? '$' : stat.icon === 'target' ? '◎' : stat.icon === 'trend' ? '↗' : '▦'}</span>
                </StatIcon>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className="mt-1 text-2xl font-black tracking-tight text-slate-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-600">Your portfolio</p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">Campaign performance</h2>
              </div>
              <Link to="/" className="text-sm font-bold text-slate-500 transition hover:text-emerald-600">
                Explore campaigns →
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {campaigns.length > 0 ? campaigns.map((campaign, index) => {
                const progress = getProgress(campaign);
                const status = getStatus(campaign);
                const daysLeft = getDaysLeft(campaign);

                return (
                  <motion.article
                    key={campaign._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-slate-900/5"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.title}
                        className="h-40 w-full object-cover sm:h-auto sm:w-40"
                      />
                      <div className="min-w-0 flex-1 p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status === 'Funded' ? 'bg-emerald-100 text-emerald-700' : status === 'Ended' ? 'bg-slate-200 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                                {status}
                              </span>
                              {daysLeft !== null && status === 'Active' && (
                                <span className="text-xs font-medium text-slate-400">{daysLeft} days left</span>
                              )}
                            </div>
                            <h3 className="mt-2 truncate text-lg font-extrabold text-slate-900">{campaign.title}</h3>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              to={`/edit-campaign/${campaign._id}`}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(campaign._id)}
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-rose-500 transition hover:border-rose-200 hover:bg-rose-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-5">
                          <div className="mb-2 flex items-end justify-between gap-3">
                            <div>
                              <span className="text-xl font-black text-slate-900">{formatCurrency(campaign.amountRaised)}</span>
                              <span className="ml-2 text-xs font-medium text-slate-400">raised</span>
                            </div>
                            <span className="text-sm font-black text-emerald-600">{progress}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 0.8, delay: index * 0.05 }}
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                            <span>Goal {formatCurrency(campaign.goalAmount)}</span>
                            <span>{campaign.rewards?.length || 0} reward tiers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              }) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-600">✦</div>
                  <h3 className="mt-4 text-lg font-black text-slate-900">Your first campaign starts here.</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Launch an idea, set a goal, and give people a reason to back it.
                  </p>
                  <Link
                    to="/create-campaign"
                    className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
                  >
                    Create your first campaign
                  </Link>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-lg shadow-emerald-600/20">
              <p className="text-sm font-semibold text-emerald-50">Quick insight</p>
              <h3 className="mt-2 text-2xl font-black">
                {stats.totalRaised > 0 ? `${stats.overallProgress}% of your total goal is funded.` : 'Your funding journey starts now.'}
              </h3>
              <p className="mt-3 text-sm leading-6 text-emerald-50/90">
                {stats.active > 0
                  ? `${stats.active} active campaign${stats.active > 1 ? 's are' : ' is'} currently collecting support.`
                  : stats.total > 0
                    ? 'Your campaigns are currently inactive or fully funded.'
                    : 'Create a campaign to start tracking your progress here.'}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-400">At a glance</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Active</span>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-black text-blue-600">{stats.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Fully funded</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-600">{stats.funded}</span>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-500">Raised vs goal</span>
                    <span className="font-black text-slate-900">{stats.overallProgress}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${stats.overallProgress}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default MyCampaignsPage;
