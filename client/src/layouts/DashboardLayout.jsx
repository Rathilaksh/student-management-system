import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const DashboardLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const titleByPath = {
    '/dashboard': 'Dashboard',
    '/students': 'Students',
    '/students/new': 'Add Enrollee',
    '/students/:id': 'Details',
    '/students/:id/edit': 'Edit Enrollee'
  };

  const getPageTitle = () => {
    if (location.pathname.startsWith('/students/') && location.pathname.endsWith('/edit')) {
      return 'Edit Enrollee';
    }

    if (location.pathname.startsWith('/students/')) {
      return 'Enrollment Details';
    }

    return titleByPath[location.pathname] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${mobileNavOpen ? 'translate-x-0' : '-translate-x-full'} lg:block`}>
        <Sidebar
          onNavigate={(path) => {
            if (path) {
              navigate(path);
            }
            setMobileNavOpen(false);
          }}
        />
      </div>
      {mobileNavOpen ? (
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          aria-label="Close navigation"
        />
      ) : null}

      <div className="flex min-w-0 flex-col">
        <Topbar onMenuClick={() => setMobileNavOpen((current) => !current)} title={getPageTitle()} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;