import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AccountLayout({ children, title, copy, linkText, linkTo }) {
  return (
    <main className="account-page">
      <div className="account-image">
        <img src="https://neevcraft.com/uploads/1788711582_Esp32002.jpeg" alt="NeevCraft ESP32 robotics kit" />
        <div className="account-image-copy"><span>NEEVCRAFT / FOR MAKERS</span><strong>Make an idea<br />work in the real world.</strong><i>⌁</i></div>
      </div>
      <div className="account-form-wrap">
        <div className="account-form-inner">
          <span className="eyebrow">Your NeevCraft account</span>
          <h1>{title}</h1>
          <p className="account-intro">{copy}</p>
          {children}
          <p className="account-switch">{linkText} <Link to={linkTo}>{linkTo === '/login' ? 'Sign in' : 'Create an account'} <span>↗</span></Link></p>
          <Link to="/" className="account-back">← Back to NeevCraft</Link>
        </div>
      </div>
    </main>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const message = location.state?.message;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/shop', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AccountLayout title="Welcome back." copy="Sign in to pick up where you left off." linkText="New around here?" linkTo="/register">
      {message && <div className="form-notice">{message}</div>}
      <form className="account-form" onSubmit={handleSubmit}>
        <label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
        <label>Password<input type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Your password" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-dark account-submit" type="submit" disabled={submitting}>{submitting ? 'Signing you in…' : 'Sign in'} <span>↗</span></button>
      </form>
    </AccountLayout>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await register(form);
      navigate('/shop', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AccountLayout title="A good place to start." copy="Create an account for a quicker, easier checkout." linkText="Already have an account?" linkTo="/login">
      <form className="account-form" onSubmit={handleSubmit}>
        <label>Your name<input type="text" autoComplete="name" minLength="2" maxLength="80" required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="What should we call you?" /></label>
        <label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label>
        <label>Password<input type="password" autoComplete="new-password" minLength="8" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 8 characters" /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-dark account-submit" type="submit" disabled={submitting}>{submitting ? 'Making your account…' : 'Create account'} <span>↗</span></button>
        <span className="form-fine-print">Account details are used by this capstone storefront.</span>
      </form>
    </AccountLayout>
  );
}
