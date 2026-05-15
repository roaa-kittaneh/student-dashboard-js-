import { useEffect, useState } from 'react';
import Input from './Input.jsx';
import Button from './Button.jsx';
import { validateStudent } from '../utils/validators';

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  department: '',
  status: 'active',
};

export default function StudentForm({ initial, onSubmit, submitLabel = 'Save', onCancel }) {
  const [values, setValues] = useState(initial || EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initial) setValues(initial);
  }, [initial]);

  const setField = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateStudent(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    try {
      setSubmitting(true);
      await onSubmit({ ...values, age: Number(values.age) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input label="First name" value={values.firstName} onChange={setField('firstName')} error={errors.firstName} />
      <Input label="Last name"  value={values.lastName}  onChange={setField('lastName')}  error={errors.lastName} />
      <Input label="Email" type="email" value={values.email} onChange={setField('email')} error={errors.email} className="md:col-span-2" />
      <Input label="Age" type="number" min={10} max={120} value={values.age} onChange={setField('age')} error={errors.age} />
      <Input label="Department" value={values.department} onChange={setField('department')} error={errors.department} />
      <Input as="select" label="Status" value={values.status} onChange={setField('status')} error={errors.status} className="md:col-span-2">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="graduated">Graduated</option>
      </Input>

      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
