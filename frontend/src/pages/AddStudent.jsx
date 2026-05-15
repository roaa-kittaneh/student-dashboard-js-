import { useNavigate, useOutletContext } from 'react-router-dom';
import Header from '../components/Header.jsx';
import StudentForm from '../components/StudentForm.jsx';
import { studentsApi } from '../api/students';
import { extractError } from '../api/client';
import { useToast } from '../hooks/useToast';

export default function AddStudent() {
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (values) => {
    try {
      await studentsApi.create(values);
      toast.success('Student created');
      navigate('/dashboard/students');
    } catch (e) {
      toast.error(extractError(e, 'Failed to create student'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Header onMenu={openSidebar} title="Add Student" subtitle="Create a new student record" />
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 mt-2">
        <StudentForm
          submitLabel="Create"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/students')}
        />
      </div>
    </div>
  );
}
