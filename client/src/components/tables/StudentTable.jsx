import { Link } from 'react-router-dom';
import { FiEdit2, FiEye, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';

const StudentTable = ({ students, onDelete }) => {
  if (!students.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center text-sm text-slate-600">
        No enrollments match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {['Name', 'Email', 'Program', 'Batch', 'Class', 'Added On', 'Actions'].map((heading) => (
                <th key={heading} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {students.map((student) => (
              <tr key={student._id} className="transition hover:bg-slate-50/60">
                <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900">{student.fullName}</td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{student.email}</td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{student.department}</td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{student.course}</td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">Class {student.semester}</td>
                <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">{formatDate(student.createdAt)}</td>
                <td className="whitespace-nowrap px-5 py-4 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/students/${student._id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <FiEye />
                      View
                    </Link>
                    <Link
                      to={`/students/${student._id}/edit`}
                      className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 font-medium text-brand-700 transition hover:bg-brand-100"
                    >
                      <FiEdit2 />
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(student)}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 font-medium text-rose-700 transition hover:bg-rose-100"
                    >
                      <FiTrash2 />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;