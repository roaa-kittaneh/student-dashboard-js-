import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl font-bold text-brand-600">404</h1>
      <p className="mt-2 text-slate-500">Page not found.</p>
      <Link to="/dashboard" className="mt-4 text-brand-600 hover:underline">
        Back to dashboard
      </Link>
    </div>
  );
}
