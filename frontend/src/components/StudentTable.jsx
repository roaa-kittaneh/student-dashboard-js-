import { Link } from 'react-router-dom';
import Button from './Button.jsx';

const STATUS_STYLES = {
  active: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  inactive: 'bg-slate-200 text-slate-700 dark:bg-navy-700 dark:text-slate-200',
  graduated: 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300',
};

export default function StudentTable({ students, onDelete }) {
  if (!students.length) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        No students found. Try adjusting filters or add a new student.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-navy-700">
        <thead className="bg-slate-50 dark:bg-navy-900/50">
          <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3 hidden md:table-cell">Email</th>
            <th className="px-4 py-3 hidden sm:table-cell">Age</th>
            <th className="px-4 py-3 hidden md:table-cell">Department</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-navy-700">
          {students.map((s) => (
            <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-navy-900/50">
              <td className="px-4 py-3 font-medium">
                {s.firstName} {s.lastName}
                <div className="md:hidden text-xs text-slate-500">{s.email}</div>
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-sm text-slate-600 dark:text-slate-300">
                {s.email}
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">{s.age}</td>
              <td className="px-4 py-3 hidden md:table-cell">{s.department}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[s.status] || ''}`}
                >
                  {s.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex gap-2">
                  <Link
                    to={`/dashboard/students/${s.id}/edit`}
                    className="text-xs font-medium text-brand-700 hover:underline dark:text-brand-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete?.(s)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
