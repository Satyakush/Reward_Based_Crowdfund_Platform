import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const money = (value = 0) => `₹${Number(value).toLocaleString('en-IN')}`;
const date = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const Stat = ({ label, value, hint }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
    {hint && <p className="mt-1 text-xs font-medium text-slate-500">{hint}</p>}
  </div>
);

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [dashboardRes, notificationRes] = await Promise.all([
        axios.get('/api/dashboard'),
        axios.get('/api/notifications'),
      ]);
      setData(dashboardRes.data);
      setNotifications(notificationRes.data.notifications || []);
      setUnread(notificationRes.data.unreadCount || 0);
    } catch (error) {
      toast.error('Could not load your dashboard.');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const recentPayments = useMemo(() => data?.payments?.slice(0, 8) || [], [data]);
  const creatorCampaigns = useMemo(() => data?.campaigns?.slice(0, 6) || [], [data]);

  const markAllRead = async () => {
    try {
      await axios.patch('/api/notifications/read-all');
      setNotifications(current => current.map(item => ({ ...item, readAt: new Date().toISOString() })));
      setUnread(0);
    } catch { toast.error('Could not update notifications.'); }
  };

  if (loading) return <div className="min-h-[calc(100vh-72px)] bg-slate-50 p-6"><div className="mx-auto max-w-7xl animate-pulse"><div className="h-40 rounded-[2rem] bg-slate-200" /><div className="mt-6 grid gap-4 md:grid-cols-4">{[1,2,3,4].map(i => <div key={i} className="h-28 rounded-3xl bg-white" />)}</div></div></div>;

  const creatorProgress = data?.creator?.goal ? Math.min(100, Math.round((data.creator.raised / data.creator.goal) * 100)) : 0;

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Account dashboard</p>
              <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Your CrowdFund activity</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Track campaigns you create, contributions you make, payments, and important account events in one place.</p>
            </div>
            <Link to="/create-campaign" className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-emerald-300">Create campaign</Link>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Campaigns" value={data.creator.campaigns} hint="Created by you" />
          <Stat label="Raised" value={money(data.creator.raised)} hint={`${creatorProgress}% of combined goals`} />
          <Stat label="Contributed" value={money(data.backer.total)} hint={`${data.backer.contributions} successful payments`} />
          <Stat label="Backers" value={data.creator.backers} hint={`${data.creator.active} active · ${data.creator.funded} funded`} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Creator side</p><h2 className="mt-1 text-2xl font-black text-slate-950">Your campaigns</h2></div>
              <Link to="/my-campaigns" className="text-sm font-bold text-emerald-600">Manage all →</Link>
            </div>
            <div className="mt-5 space-y-3">
              {creatorCampaigns.length ? creatorCampaigns.map(c => {
                const progress = c.goalAmount ? Math.min(100, Math.round((c.amountRaised / c.goalAmount) * 100)) : 0;
                return <Link key={c._id} to={`/campaign/${c._id}`} className="block rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300">
                  <div className="flex items-start justify-between gap-4"><div><p className="font-extrabold text-slate-900">{c.title}</p><p className="mt-1 text-xs text-slate-400">Ends {date(c.endDate)} · {c.backers?.length || 0} backers</p></div><span className="text-sm font-black text-emerald-600">{progress}%</span></div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} /></div>
                  <p className="mt-2 text-xs font-semibold text-slate-500">{money(c.amountRaised)} raised of {money(c.goalAmount)}</p>
                </Link>;
              }) : <p className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">You have not created a campaign yet.</p>}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Activity</p><h2 className="mt-1 text-2xl font-black text-slate-950">Notifications</h2></div>{unread > 0 && <button onClick={markAllRead} className="text-xs font-bold text-emerald-600">Mark all read</button>}</div>
            <div className="mt-5 space-y-3">
              {notifications.slice(0, 6).length ? notifications.slice(0, 6).map(n => <div key={n._id} className={`rounded-2xl p-4 ${n.readAt ? 'bg-slate-50' : 'bg-emerald-50'}`}><div className="flex items-start gap-3"><span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500" /><div><p className="text-sm font-extrabold text-slate-900">{n.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{n.message}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{date(n.createdAt)}</p></div></div></div>) : <p className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">No notifications yet.</p>}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Creator analytics</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Campaign performance</h2>
            <div className="mt-5 space-y-3">
              {(data.analytics?.campaignPerformance || []).map(c => (
                <div key={c._id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3"><span className="font-extrabold text-slate-800">{c.title}</span><span className="text-xs font-black uppercase text-emerald-600">{c.status}</span></div>
                  <div className="mt-3 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-500" style={{width: `${c.fundingPercent}%`}} /></div>
                  <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500"><span>₹{Number(c.amountRaised).toLocaleString('en-IN')} raised</span><span>{c.backers} backers</span><span>{c.fundingPercent}%</span></div>
                </div>
              ))}
              {!data.analytics?.campaignPerformance?.length && <p className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">Create a campaign to see analytics.</p>}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Reward analytics</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Top reward tiers</h2>
            <p className="mt-2 text-sm text-slate-500">Average successful contribution: ₹{Number(data.analytics?.averageContribution || 0).toLocaleString('en-IN')}</p>
            <div className="mt-5 space-y-3">
              {(data.analytics?.rewardPerformance || []).slice(0, 5).map(r => (
                <div key={r.title} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div><p className="font-bold text-slate-800">{r.title}</p><p className="text-xs text-slate-400">{r.contributions} contribution{r.contributions === 1 ? '' : 's'}</p></div>
                  <span className="font-black text-slate-900">₹{Number(r.raised).toLocaleString('en-IN')}</span>
                </div>
              ))}
              {!data.analytics?.rewardPerformance?.length && <p className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">Successful contributions will appear here.</p>}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Backer side</p><h2 className="mt-1 text-2xl font-black text-slate-950">Payment history</h2></div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">{data.backer.contributions} successful</span></div>
          <div className="mt-5 overflow-x-auto"><table className="min-w-full text-left"><thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400"><th className="px-3 py-3">Campaign</th><th className="px-3 py-3">Reward</th><th className="px-3 py-3">Amount</th><th className="px-3 py-3">Date</th><th className="px-3 py-3">Status</th></tr></thead><tbody>{recentPayments.length ? recentPayments.map(p => <tr key={p._id} className="border-b border-slate-100 text-sm"><td className="px-3 py-4 font-bold text-slate-800">{p.campaign?.title || 'Campaign'}</td><td className="px-3 py-4 text-slate-500">{p.reward?.title || 'Reward'}</td><td className="px-3 py-4 font-black text-slate-900">{money(p.amount)}</td><td className="px-3 py-4 text-slate-500">{date(p.paidAt)}</td><td className="px-3 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Paid</span></td></tr>) : <tr><td colSpan="5" className="px-3 py-10 text-center text-sm text-slate-500">No successful payments yet.</td></tr>}</tbody></table></div>
        </section>
      </main>
    </div>
  );
}
