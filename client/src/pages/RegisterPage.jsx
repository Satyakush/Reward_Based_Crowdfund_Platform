import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/auth/register', formData);
      toast.success('Account created. Welcome to CrowdFund.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#071411]">
      <div className="absolute right-[-8rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="absolute bottom-[-10rem] left-[-6rem] h-[28rem] w-[28rem] rounded-full bg-teal-400/10 blur-3xl" />
      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="order-2 lg:order-1">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl sm:p-8">
            <p className="text-sm font-bold text-emerald-300">Start with an idea</p>
            <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              Your idea deserves a <span className="text-emerald-300">crowd.</span>
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-400">
              Create your account and turn a thought, project, or mission into something people can rally behind.
            </p>
            <div className="mt-8 space-y-3">
              {[
                ['01', 'Launch your campaign', 'Give your idea a clear story and goal.'],
                ['02', 'Build your community', 'Let people discover what you are creating.'],
                ['03', 'Grow together', 'Turn support into meaningful momentum.'],
              ].map(([num, title, text]) => (
                <div key={num} className="flex gap-4 rounded-2xl border border-white/10 bg-black/10 p-4">
                  <span className="text-sm font-black text-emerald-300">{num}</span>
                  <div><p className="font-bold text-white">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
            <div className="mb-7">
              <div className="mb-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.15em] text-emerald-300">Create account</div>
              <h2 className="text-3xl font-black tracking-tight text-white">Make your mark.</h2>
              <p className="mt-2 text-sm text-slate-400">Set up your creator identity in less than a minute.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-5">
              {[
                ['name', 'Your name', 'What should people call you?', 'text', 'name'],
                ['email', 'Email address', 'you@example.com', 'email', 'email'],
                ['password', 'Password', 'At least 6 characters', 'password', 'new-password'],
              ].map(([name, label, placeholder, type, autoComplete]) => (
                <label key={name} className="block">
                  <span className="text-sm font-bold text-slate-200">{label}</span>
                  <input type={type} name={name} value={formData[name]} onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} required minLength={name === 'password' ? 6 : undefined} autoComplete={autoComplete} placeholder={placeholder}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10" />
                </label>
              ))}
              <button disabled={loading} className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-300 py-3.5 font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-200 disabled:opacity-60">
                {loading ? 'Creating your account...' : <>Create account <span className="transition group-hover:translate-x-1">→</span></>}
              </button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-400">Already have an account? <Link to="/login" className="font-black text-emerald-300 hover:text-emerald-200">Sign in</Link></p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;
