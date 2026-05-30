import { NavLink } from 'react-router-dom';
import { FiBookOpen, FiGrid, FiLogOut, FiUsers } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/students', label: 'Students', icon: FiUsers },
  { to: '/students/new', label: 'Add Enrollee', icon: FiBookOpen }
];

const Sidebar = ({ onNavigate }) => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    onNavigate?.('/login');
  };

  return (
    <aside className="flex h-full flex-col border-r border-slate-200 bg-white/95 px-5 py-6 backdrop-blur">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-lg shadow-brand-200">
          SM
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Admin Portal</p>
          <h2 className="text-lg font-bold text-slate-900">Coaching Manager</h2>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon className="text-lg" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Signed in as</p>
        <p className="mt-2 text-sm font-semibold text-slate-900">{user?.email}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;