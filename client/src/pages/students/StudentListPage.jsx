import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlusCircle, FiSearch, FiRefreshCw, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import StudentTable from '../../components/tables/StudentTable';
import Pagination from '../../components/common/Pagination';
import ConfirmModal from '../../components/modals/ConfirmModal';
import LoadingScreen from '../../components/common/LoadingScreen';
import EmptyState from '../../components/common/EmptyState';
import useDebounce from '../../hooks/useDebounce';
import { courseOptions, departmentOptions, semesterOptions } from '../../data/options';
import { studentService } from '../../services/api';

const initialFilters = {
  search: '',
  department: '',
  course: '',
  semester: '',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

const StudentListPage = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(initialFilters);
  const [pendingDelete, setPendingDelete] = useState(null);
  const debouncedSearch = useDebounce(filters.search, 350);

  const fetchStudents = async (currentPage = page, currentFilters = filters) => {
    setLoading(true);
    try {
      const response = await studentService.list({
        page: currentPage,
        limit: 10,
        search: currentFilters.search || undefined,
        department: currentFilters.department || undefined,
        course: currentFilters.course || undefined,
        semester: currentFilters.semester || undefined,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder
      });

      setStudents(response.data.students || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page, { ...filters, search: debouncedSearch });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedSearch, filters.department, filters.course, filters.semester, filters.sortBy, filters.sortOrder]);

  const updateFilter = (name, value) => {
    setPage(1);
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const resetFilters = () => {
    setPage(1);
    setFilters(initialFilters);
  };

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    try {
      await studentService.remove(pendingDelete._id);
      toast.success('Student deleted successfully');
      setPendingDelete(null);
      fetchStudents(page, { ...filters, search: debouncedSearch });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  const sortDirectionIcon = filters.sortOrder === 'asc' ? FiArrowUp : FiArrowDown;

  if (loading) {
    return <LoadingScreen message="Loading enrollment records..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Records"
        title="Enrolled Students"
        description="Search, filter, sort, and manage coaching enrollments from a professional data table experience."
        actions={
          <Link
            to="/students/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700"
          >
            <FiPlusCircle />
            Add Enrollee
          </Link>
        }
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <label className="relative block xl:col-span-2">
            <span className="sr-only">Search students</span>
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
              placeholder="Search by name, email, or mobile"
            />
          </label>

          <select value={filters.department} onChange={(event) => updateFilter('department', event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50">
            <option value="">All Programs</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          <select value={filters.course} onChange={(event) => updateFilter('course', event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50">
            <option value="">All Batches</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <select value={filters.semester} onChange={(event) => updateFilter('semester', event.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50">
            <option value="">All Classes</option>
            {semesterOptions.map((semester) => (
              <option key={semester} value={semester}>
                Class {semester}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(event) => updateFilter('sortBy', event.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
          >
            <option value="createdAt">Sort: Date Added</option>
            <option value="fullName">Sort: Name</option>
            <option value="semester">Sort: Class</option>
          </select>

          <button
            type="button"
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {(() => {
              const SortIcon = filters.sortOrder === 'asc' ? FiArrowUp : FiArrowDown;
              return <SortIcon className="text-base" />;
            })()}
            {filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <FiRefreshCw />
            Reset Filters
          </button>
        </div>
      </div>

      {students.length ? <StudentTable students={students} onDelete={setPendingDelete} /> : <EmptyState title="No matching enrollments" description="Try adjusting search, filters, or sorting to reveal matching records." />}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete enrollment record?"
        description={`This action permanently removes ${pendingDelete?.fullName || 'the selected learner'} from the database.`}
        confirmLabel="Delete Record"
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default StudentListPage;