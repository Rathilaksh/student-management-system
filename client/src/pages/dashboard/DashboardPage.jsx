import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUsers, FiLayers, FiBookOpen, FiPlusCircle } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import RecentStudents from '../../components/dashboard/RecentStudents';
import { studentService } from '../../services/api';

const DashboardPage = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    totalDepartments: 0,
    totalCourses: 0,
    recentStudents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await studentService.stats();
        setDashboardStats({
          totalStudents: response.data.totalStudents || 0,
          totalDepartments: response.data.totalDepartments || 0,
          totalCourses: response.data.totalCourses || 0,
          recentStudents: response.data.recentStudents || []
        });
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => dashboardStats, [dashboardStats]);

  if (loading) {
    return <LoadingScreen message="Loading dashboard metrics..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Coaching Dashboard"
        description="Monitor enrollments, review recent admissions, and jump into core institute management actions from one screen."
        actions={
          <>
            <Link
              to="/students"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View Enrollments
            </Link>
            <Link
              to="/students/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700"
            >
              <FiPlusCircle />
              Add Enrollee
            </Link>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Enrollments" value={stats.totalStudents} icon={FiUsers} tone="brand" helperText="All enrolled students in the institute" />
        <StatCard label="Total Programs" value={stats.totalDepartments} icon={FiLayers} tone="emerald" helperText="Foundation and exam-prep streams" />
        <StatCard label="Total Batches" value={stats.totalCourses} icon={FiBookOpen} tone="amber" helperText="Distinct class and exam batches" />
      </div>

      <RecentStudents students={stats.recentStudents} />
    </div>
  );
};

export default DashboardPage;