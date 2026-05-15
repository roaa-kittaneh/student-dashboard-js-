import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Header from '../components/Header.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import StudentTable from '../components/StudentTable.jsx';
import { IconPlus } from '../components/Icons.jsx';
import { useDebounce } from '../hooks/useDebounce';
import { useStudents } from '../hooks/useStudents';
import { useToast } from '../hooks/useToast';
import { studentsApi } from '../api/students';

export default function Students() {
  const { openSidebar } = useOutletContext();
  const [q, setQ] = useState('');
  const [department, setDepartment] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [deleting, setDeleting] = useState(null);
  const [departments, setDepartments] = useState([]);

  const debouncedQ = useDebounce(q, 350);
  const toast = useToast();

  // Reset to first page whenever search/filter changes
  useEffect(() => { setPage(1); }, [debouncedQ, department, status]);

  const { items, totalPages, total, loading, error, remove } = useStudents({
    q: debouncedQ,
    department,
    status,
    page,
    pageSize,
  });

  useEffect(() => {
    studentsApi.departments().then(setDepartments).catch(() => {});
  }, []);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await remove(deleting.id);
      toast.success(`Removed ${deleting.firstName} ${deleting.lastName}`);
    } catch (e) {
      toast.error('Failed to delete');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Header onMenu={openSidebar} title="Students" subtitle={`${total} total`} />
        <Link to="/dashboard/students/add">
          <Button>
            <IconPlus size={16} /> Add Student
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-navy-800 rounded-xl border border-slate-200 dark:border-navy-700">
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 border-b border-slate-200 dark:border-navy-700">
          <Input
            placeholder="Search by name or email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Input as="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">All departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Input>
          <Input as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="graduated">Graduated</option>
          </Input>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : (
          <StudentTable students={items} onDelete={setDeleting} />
        )}

        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete student"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to permanently delete{' '}
          <strong>
            {deleting?.firstName} {deleting?.lastName}
          </strong>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
