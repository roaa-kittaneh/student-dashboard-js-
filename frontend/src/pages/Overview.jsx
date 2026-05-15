import { Link, useOutletContext } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import Button from '../components/Button.jsx';
import Header from '../components/Header.jsx';
import Loader from '../components/Loader.jsx';
import { IconPlus } from '../components/Icons.jsx';
import { useOverviewData } from '../hooks/useOverviewData';

/* Status badge color */
const STATUS_DOT = {
  active:    'bg-teal-500',
  graduated: 'bg-brand-500',
  inactive:  'bg-slate-400',
};

const DEPT_BAR = ['bg-brand-500', 'bg-amber-500', 'bg-teal-500', 'bg-rose-500', 'bg-indigo-500'];

function StudentRow({ s }) {
  return (
    <li className="flex items-center gap-3 py-3">
      <Avatar name={`${s.firstName} ${s.lastName}`} size="md" />
      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">
          {s.firstName} {s.lastName}
        </div>
        <div className="text-xs text-slate-500 truncate">
          {s.department} · {s.email}
        </div>
      </div>
      <span className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span className={`h-2 w-2 rounded-full ${STATUS_DOT[s.status]}`} />
        {s.status}
      </span>
      <Link
        to={`/dashboard/students/${s.id}/edit`}
        className="text-xs font-medium text-brand-600 hover:underline ml-2"
      >
        Edit
      </Link>
    </li>
  );
}

function SummaryChip({ label, value, accent }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 px-4 py-3">
      <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
      <div className="leading-tight">
        <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
        <div className="text-lg font-semibold">{value}</div>
      </div>
    </div>
  );
}

function DepartmentBar({ name, count, max, color }) {
  const pct = max ? Math.max(6, Math.round((count / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-600 dark:text-slate-300 truncate pr-2">{name}</span>
        <span className="text-slate-500 tabular-nums">{count}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 dark:bg-navy-700 overflow-hidden">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Overview() {
  const { openSidebar } = useOutletContext();
  const { stats, recent, loading, error, refetch } = useOverviewData();

  if (loading) return <Loader />;
  if (error) {
    return (
      <div>
        <Header onMenu={openSidebar} title="Dashboard" />
        <div className="rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-4 py-3 text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button size="sm" variant="secondary" onClick={refetch}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const maxDept = stats.byDepartment.reduce((m, d) => Math.max(m, d.count), 0);

  return (
    <>
      <Header onMenu={openSidebar} title="Dashboard" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Summary chips */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SummaryChip label="Total"     value={stats.total}               accent="bg-brand-500" />
            <SummaryChip label="Active"    value={stats.byStatus.active}     accent="bg-teal-500" />
            <SummaryChip label="Graduated" value={stats.byStatus.graduated}  accent="bg-amber-500" />
            <SummaryChip label="Inactive"  value={stats.byStatus.inactive}   accent="bg-rose-500" />
          </div>

          {/* Recent students — transaction-style list */}
          <section className="rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700">
            <header className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-navy-700">
              <h2 className="font-semibold">Recently added</h2>
              <Link
                to="/dashboard/students"
                className="text-xs font-medium text-brand-600 hover:underline"
              >
                View all
              </Link>
            </header>
            {recent.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                No students yet.{' '}
                <Link to="/dashboard/students/add" className="text-brand-600 hover:underline">
                  Add the first one
                </Link>
                .
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-navy-700 px-5">
                {recent.map((s) => <StudentRow key={s.id} s={s} />)}
              </ul>
            )}
          </section>
        </div>

        {/* Right rail */}
        <aside className="space-y-4">
          <section className="rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 p-5">
            <h2 className="font-semibold mb-1">By department</h2>
            <p className="text-xs text-slate-500 mb-4">Distribution across {stats.byDepartment.length} departments</p>
            {stats.byDepartment.length === 0 ? (
              <p className="text-sm text-slate-500">No data yet.</p>
            ) : (
              <div className="space-y-3.5">
                {stats.byDepartment.map((d, i) => (
                  <DepartmentBar
                    key={d.name}
                    name={d.name}
                    count={d.count}
                    max={maxDept}
                    color={DEPT_BAR[i % DEPT_BAR.length]}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-navy-900 text-white p-5">
            <h3 className="font-semibold">Add a new student</h3>
            <p className="text-sm text-slate-300 mt-1">
              Keep your roster up to date.
            </p>
            <Link to="/dashboard/students/add" className="inline-block mt-4">
              <Button size="sm" variant="primary">
                <IconPlus size={16} /> New student
              </Button>
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
