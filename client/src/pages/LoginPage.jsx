import { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', formData);
      login(data.token, data.user, remember);
      navigate(location.state?.from || '/my-campaigns', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#071411]">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-teal-400/10 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-2 lg:px-8">
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-300" /> CrowdFund
          </div>
          <h1 className="max-w-xl text-6xl font-black leading-[0.98] tracking-[-0.04em] text-white">
            Ideas become real when people <span className="text-emerald-300">believe.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">
            Sign in to follow your campaigns, back ideas you care about, and keep building momentum.
          </p>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {['Build', 'Back', 'Belong'].map((item, i) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <span className="text-xs font-black text-emerald-300">0{i + 1}</span>
                <p className="mt-2 font-bold text-white">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="mb-8">
              <p className="text-sm font-bold text-emerald-300">Welcome back</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white">Enter your space.</h2>
              <p className="mt-2 text-sm text-slate-400">Your next big idea is only a sign-in away.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <label className="block">
                <span className="text-sm font-bold text-slate-200">Email</span>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required autoComplete="email" placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-slate-200">Password</span>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required autoComplete="current-password" placeholder="••••••••"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10" />
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} className="h-4 w-4 accent-emerald-300" /> Remember me</label><button disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-300 py-3.5 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Signing you in...' : <>Continue <span className="transition group-hover:translate-x-1">→</span></>}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-400">
              New here? <Link to="/register" className="font-black text-emerald-300 hover:text-emerald-200">Create an account</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
