import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import CampaignCard from '../components/CampaignCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await axios.get('/api/campaigns');
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Could not fetch campaigns.');
      } finally { setLoading(false); }
    };
    fetchCampaigns();
  }, []);

  const stats = useMemo(() => {
    const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.amountRaised || 0), 0);
    const totalGoal = campaigns.reduce((sum, c) => sum + Number(c.goalAmount || 0), 0);
    const active = campaigns.filter(c => c.endDate && new Date(c.endDate) > new Date() && Number(c.amountRaised || 0) < Number(c.goalAmount || 0)).length;
    return { totalRaised, totalGoal, active, progress: totalGoal ? Math.min(100, Math.round((totalRaised / totalGoal) * 100)) : 0 };
  }, [campaigns]);

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

  if (loading) return <div className="min-h-screen bg-slate-50 px-4 py-10"><div className="mx-auto max-w-7xl animate-pulse"><div className="h-96 rounded-[2rem] bg-slate-200" /><div className="mt-10 h-8 w-64 rounded bg-slate-200" /><div className="mt-6 grid gap-6 md:grid-cols-3">{[1,2,3].map(i => <div key={i} className="h-96 rounded-3xl bg-white" />)}</div></div></div>;
  if (error) return <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50"><div className="rounded-3xl bg-white p-8 text-center shadow"><p className="text-lg font-black">Something went wrong</p><p className="mt-2 text-sm text-slate-500">{error}</p></div></div>;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.25),transparent_32%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.2),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Ideas worth backing</motion.div>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">Big ideas need<span className="block text-emerald-400">people who believe.</span></motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">Discover ambitious projects, support creators you believe in, and help turn meaningful ideas into something real.</motion.p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/create-campaign" className="inline-flex items-center justify-center rounded-2xl bg-emerald-400 px-6 py-3.5 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300">Start a campaign <span className="ml-2 text-lg">↗</span></Link><a href="#campaigns" className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">Explore campaigns</a></div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Community impact</p>
            <p className="mt-2 text-5xl font-black text-white">{campaigns.length}</p><p className="text-sm text-slate-400">campaigns launched</p>
            <div className="mt-8"><div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Total raised</span><span className="text-emerald-300">${stats.totalRaised.toLocaleString()}</span></div><div className="mt-2 h-2 rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: stats.progress + '%' }} /></div></div>
            <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-2xl font-black text-white">{stats.active}</p><p className="text-xs text-slate-400">active campaigns</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-2xl font-black text-white">{stats.progress}%</p><p className="text-xs text-slate-400">goal progress</p></div></div>
          </motion.div>
        </div>
      </section>
      <section id="campaigns" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-600">Discover</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Projects worth backing</h2><p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">Browse campaigns and find an idea you want to help move forward.</p></div><span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm ring-1 ring-slate-200">{campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'}</span></div>
        {campaigns.length === 0 ? <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white p-12 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">✦</div><h3 className="mt-5 text-xl font-black">Nothing here yet.</h3><p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Be the first creator to bring an idea to the CrowdFund community.</p><Link to="/create-campaign" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600">Launch a campaign</Link></div> : <motion.div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" variants={containerVariants} initial="hidden" animate="visible">{campaigns.map(c => <CampaignCard key={c._id} campaign={c} />)}</motion.div>}
      </section>
    </div>
  );
};

export default HomePage;