import { useState, useContext } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import "./login.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);\n\n  const EyeIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="2.7" fill="none" stroke="currentColor" strokeWidth="1.8"/></svg>;\n  const EyeOffIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.1 0 9.5 6 9.5 6a17.8 17.8 0 0 1-3.1 3.7M6.2 6.8C3.8 8.3 2.5 12 2.5 12s3.4 6 9.5 6c1.3 0 2.5-.3 3.5-.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", formData);
      login(data.token, data.user, remember);
      navigate(location.state?.from || "/my-campaigns", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="crowdfund-login">
      <img className="crowdfund-login__visual" src="/auth-crowdfund.svg" alt="" aria-hidden="true" />
      <div className="crowdfund-login__layout">
        <section className="crowdfund-login__intro">
          <div className="crowdfund-login__eyebrow"><span className="crowdfund-login__dot" /> CrowdFund</div>
          <h1>Ideas become real when people <span>believe.</span></h1>
          <p>Sign in to follow your campaigns, back ideas you care about, and keep building momentum.</p>
          <div className="crowdfund-login__steps">
            {["Build", "Back", "Belong"].map((item, i) => (
              <div key={item} className="crowdfund-login__step"><small>0{i + 1}</small><strong>{item}</strong></div>
            ))}
          </div>
        </section>

        <section className="crowdfund-login__card">
          <div className="crowdfund-login__mobile-brand">
            <span>CrowdFund</span>
            <h1>Back ideas that matter.</h1>
          </div>

          <p className="crowdfund-login__subtitle">WELCOME BACK</p>
          <h2>Enter your space.</h2>
          <p className="crowdfund-login__subtitle">Your next big idea is only a sign-in away.</p>

          <form onSubmit={onSubmit} className="crowdfund-login__form">
            <label className="crowdfund-login__field">
              <span>Email address</span>
              <div className="crowdfund-login__control">
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required autoComplete="email" placeholder="you@example.com" />
              </div>
            </label>

            <label className="crowdfund-login__field">
              <span>Password</span>
              <div className="crowdfund-login__control">
                <input className="has-toggle" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required autoComplete="current-password" placeholder="••••••••" />
                <button type="button" className="crowdfund-login__toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
              </div>
            </label>

            <label className="crowdfund-login__remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>

            <button type="submit" disabled={loading} className="crowdfund-login__submit">
              {loading ? "Signing you in..." : "Continue →"}
            </button>
          </form>

          <p className="crowdfund-login__footer">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
