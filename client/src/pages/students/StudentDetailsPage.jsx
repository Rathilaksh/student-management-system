import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiEdit2, FiMail, FiPhone, FiMapPin, FiCalendar, FiUser, FiTrash2 } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import LoadingScreen from '../../components/common/LoadingScreen';
import ConfirmModal from '../../components/modals/ConfirmModal';
import { formatDate } from '../../utils/formatters';
import { studentService } from '../../services/api';

const infoRows = [
  { label: 'Email', icon: FiMail, key: 'email' },
  { label: 'Mobile', icon: FiPhone, key: 'mobile' },
  { label: 'Gender', icon: FiUser, key: 'gender' },
  { label: 'Program Stream', icon: FiCalendar, key: 'department' },
  { label: 'Batch', icon: FiCalendar, key: 'course' },
  { label: 'Class', icon: FiCalendar, key: 'semester' },
  { label: 'Address', icon: FiMapPin, key: 'address' }
];

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await studentService.getById(id);
        setStudent(response.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load student');
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentService.remove(id);
      toast.success('Student deleted successfully');
      navigate('/students');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete student');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading student profile..." />;
  }

  if (!student) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title={student.fullName}
        description="A complete profile view with academic and contact details plus management actions."
        actions={
          <>
            <Link
              to="/students"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <FiArrowLeft />
              Back
            </Link>
            <Link
              to={`/students/${student._id}/edit`}
              className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700"
            >
              <FiEdit2 />
              Edit Enrollee
            </Link>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            {infoRows.map(({ label, icon: Icon, key }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <Icon />
                  {label}
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {key === 'semester' ? `Class ${student[key]}` : student[key] || '-'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="rounded-2xl bg-brand-50 p-5 text-brand-900">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Record Summary</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900">Enrollment ID</h2>
            <p className="mt-2 break-all text-sm text-slate-600">{student._id}</p>
            <p className="mt-4 text-sm text-slate-600">Created {formatDate(student.createdAt)}</p>
          </div>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <FiTrash2 />
              Delete Record
            </button>
          </div>
        </aside>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete this enrollment?"
        description={`This will permanently remove ${student.fullName} from the system.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete Record'}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
};

export default StudentDetailsPage;