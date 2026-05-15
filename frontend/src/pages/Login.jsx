import { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { IconLogo } from '../components/Icons.jsx';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  if (isAuthenticated) return <Navigate to={from} replace />;

  const ERR_MAP = {
    invalid_credentials: 'Invalid email or password.',
    email_and_password_required: 'Please enter both email and password.',
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate(from, { replace: true });
    } catch (e) {
      setErr(ERR_MAP[e.message] || e.message);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-500 text-white">
            <IconLogo size={28} />
          </div>
          <h1 className="text-2xl font-semibold mt-3">StudentOps</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your dashboard</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {err && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-2 text-sm">
              {err}
            </div>
          )}
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </form>

        <p className="text-sm text-slate-600 dark:text-slate-300 text-center mt-6">
          New here?{' '}
          <Link to="/register" className="font-medium text-brand-600 hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-xs text-slate-500 text-center mt-3">
          Demo: <code>admin@example.com</code> / <code>admin123</code>
        </p>
      </div>
    </div>
  );
}
