import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';

const RecentStudents = ({ students }) => {
  if (!students.length) {
    return <EmptyState title="No enrollments yet" description="Add the first learner to populate dashboard activity." />;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recently Added Enrollments</h2>
          <p className="mt-1 text-sm text-slate-500">Latest admissions in the institute</p>
        </div>
        <Link to="/students" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          View all
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {students.map((student) => (
          <div key={student._id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-slate-900">{student.fullName}</p>
              <p className="text-sm text-slate-500">
                {student.department} · Class {student.semester}
              </p>
            </div>
            <div className="text-sm text-slate-500">Added {formatDate(student.createdAt)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentStudents;