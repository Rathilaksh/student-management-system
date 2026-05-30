import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { validateLogin } from '../../utils/validation';
import { FiMail, FiLock } from 'react-icons/fi';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: 'admin@example.com', password: 'Admin@123' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateLogin(credentials);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await login(credentials);
      toast.success('Welcome back, admin');
      navigate(redirectPath, { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg items-center">
        <section className="w-full rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card sm:p-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white shadow-lg shadow-brand-200">
              SM
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Institute Admin Login</h1>
              <p className="text-sm text-slate-500">Sign in to continue.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email Address</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50">
                <FiMail className="text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
                  placeholder="admin@example.com"
                />
              </div>
              {errors.email ? <span className="mt-2 block text-xs font-medium text-rose-600">{errors.email}</span> : null}
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50">
                <FiLock className="text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full border-0 bg-transparent p-0 text-sm outline-none placeholder:text-slate-400"
                  placeholder="Enter password"
                />
              </div>
              {errors.password ? <span className="mt-2 block text-xs font-medium text-rose-600">{errors.password}</span> : null}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-2xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;