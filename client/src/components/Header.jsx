import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 text-white shadow-lg shadow-slate-950/10 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400 text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20 transition group-hover:rotate-3">
            C
          </span>
          <div>
            <p className="text-lg font-black tracking-tight">CrowdFund</p>
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:block">Ideas worth backing</p>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">
            Campaigns
          </Link>

          {user ? (
            <>
              <Link to="/my-campaigns" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">
                Dashboard
              </Link>
              <Link
                to="/create-campaign"
                className="hidden rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 sm:inline-flex"
              >
                Create Campaign
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">
                Login
              </Link>
              <Link to="/register" className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
