import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { IconLogo } from '../components/Icons.jsx';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { EMAIL_RX } from '../utils/validators';

// Friendly mapping for backend error codes
const ERR_MAP = {
  email_already_registered: 'That email is already registered. Try signing in.',
  validation_failed: 'Please correct the highlighted fields.',
  invalid_email: 'Email is invalid.',
};

function friendly(msg) {
  return ERR_MAP[msg] || msg || 'Registration failed';
}

export default function Register() {
  const { register, isAuthenticated, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState('');

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Required';
    else if (!EMAIL_RX.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerErr('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      toast.success('Account created — welcome');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerErr(friendly(err.message));
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-500 text-white">
            <IconLogo size={28} />
          </div>
          <h1 className="text-2xl font-semibold mt-3">Create your account</h1>
          <p className="text-sm text-slate-500 mt-1">Set up access to the dashboard</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <Input
            label="Full name (optional)"
            value={form.name}
            onChange={set('name')}
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
            error={errors.email}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={set('password')}
            error={errors.password}
            hint="At least 6 characters"
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirm password"
            type="password"
            value={form.confirm}
            onChange={set('confirm')}
            error={errors.confirm}
            autoComplete="new-password"
            required
          />

          {serverErr && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-2 text-sm">
              {serverErr}
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        <p className="text-sm text-slate-600 dark:text-slate-300 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
