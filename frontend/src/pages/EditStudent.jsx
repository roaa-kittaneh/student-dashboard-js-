import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import Header from '../components/Header.jsx';
import StudentForm from '../components/StudentForm.jsx';
import Loader from '../components/Loader.jsx';
import { studentsApi } from '../api/students';
import { extractError } from '../api/client';
import { useToast } from '../hooks/useToast';

export default function EditStudent() {
  const { id } = useParams();
  const { openSidebar } = useOutletContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [initial, setInitial] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    studentsApi
      .get(id)
      .then((s) => setInitial({ ...s, age: String(s.age) }))
      .catch((e) => setLoadError(extractError(e, 'Failed to load student')));
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await studentsApi.update(id, values);
      toast.success('Student updated');
      navigate('/dashboard/students');
    } catch (e) {
      toast.error(extractError(e, 'Failed to update student'));
    }
  };

  if (loadError) return <div className="text-red-600 text-sm">{loadError}</div>;
  if (!initial) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto">
      <Header
        onMenu={openSidebar}
        title="Edit Student"
        subtitle={`${initial.firstName} ${initial.lastName}`}
      />
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-slate-200 dark:border-navy-700 p-6 mt-2">
        <StudentForm
          initial={initial}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/students')}
        />
      </div>
    </div>
  );
}
