import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center bg-hero-pattern px-4">
    <div className="max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">404</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-sm text-slate-600">The page you requested does not exist or was moved.</p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700"
      >
        Go to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;