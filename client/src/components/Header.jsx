import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  const load = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      setItems(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch {}
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const close = (event) => { if (ref.current && !ref.current.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const markRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setItems(current => current.map(n => n._id === id ? { ...n, readAt: new Date().toISOString() } : n));
      setUnread(current => Math.max(0, current - 1));
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white" aria-label="Notifications">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17H9m9-2V11a6 6 0 10-12 0v4l-2 2h16l-2-2zm-3 2a3 3 0 01-6 0" /></svg>
        {unread > 0 && <span className="absolute right-1 top-1 flex min-w-4 h-4 items-center justify-center rounded-full bg-emerald-400 px-1 text-[9px] font-black text-slate-950">{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div><p className="text-sm font-black">Notifications</p><p className="text-[11px] text-slate-400">{unread} unread</p></div>
            {unread > 0 && <button onClick={async () => { await axios.patch('/api/notifications/read-all'); setItems(x => x.map(n => ({...n, readAt: new Date().toISOString()}))); setUnread(0); }} className="text-xs font-bold text-emerald-600">Mark all read</button>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length ? items.slice(0, 8).map(n => (
              <div key={n._id} className={`border-b border-slate-100 px-4 py-3 hover:bg-slate-50 ${n.readAt ? '' : 'bg-emerald-50/60'}`}>
                <div className="flex gap-3">
                  <button onClick={() => markRead(n._id)} className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-label="Mark notification as read" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold">{n.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{n.message}</p>
                    <div className="mt-2 flex items-center gap-3">
                      {n.campaign?._id && <Link to={`/campaign/${n.campaign._id}`} onClick={() => { markRead(n._id); setOpen(false); }} className="text-[10px] font-black uppercase tracking-wider text-emerald-600">View campaign</Link>}
                      {!n.readAt && <button onClick={() => markRead(n._id)} className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mark read</button>}
                    </div>
                  </div>
                </div>
              </div>
            )) : <p className="px-4 py-8 text-center text-sm text-slate-500">You're all caught up.</p>}
          </div>
          <Link to="/dashboard" onClick={() => setOpen(false)} className="block border-t border-slate-100 px-4 py-3 text-center text-xs font-black text-emerald-600">Open activity dashboard →</Link>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 text-white shadow-lg shadow-slate-950/10 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition group-hover:rotate-3">C</span>
          <div><p className="text-lg font-black tracking-tight">CrowdFund</p><p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">Ideas worth backing</p></div>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          <Link to="/" className="rounded-xl px-2.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:px-3">Campaigns</Link>
          {user ? <>
            <NotificationBell />
            <Link to="/dashboard" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:inline-flex">Activity</Link>
            <Link to="/create-campaign" className="hidden rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 sm:inline-flex">Create Campaign</Link>
            <button onClick={handleLogout} className="rounded-xl border border-white/10 px-2.5 py-2 text-sm font-semibold text-slate-300 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300 sm:px-3">Logout</button>
          </> : <>
            <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">Login</Link>
            <Link to="/register" className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">Register</Link>
          </>}
        </nav>
      </div>
    </header>
  );
};

export default Header;