export const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStudent(values) {
  const errors = {};
  if (!values.firstName?.trim()) errors.firstName = 'Required';
  if (!values.lastName?.trim()) errors.lastName = 'Required';
  if (!values.email?.trim()) errors.email = 'Required';
  else if (!EMAIL_RX.test(values.email)) errors.email = 'Invalid email';
  const ageNum = Number(values.age);
  if (!Number.isInteger(ageNum) || ageNum < 10 || ageNum > 120)
    errors.age = 'Age must be 10–120';
  if (!values.department?.trim()) errors.department = 'Required';
  if (!['active', 'inactive', 'graduated'].includes(values.status))
    errors.status = 'Invalid status';
  return errors;
}
