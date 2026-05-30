export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!password?.trim()) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateStudent = (values) => {
  const errors = {};

  if (!values.fullName?.trim()) errors.fullName = 'Full name is required';
  if (!values.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.mobile?.trim()) {
    errors.mobile = 'Mobile number is required';
  } else if (!/^\+?[0-9]{10,15}$/.test(values.mobile.trim())) {
    errors.mobile = 'Enter a valid mobile number';
  }

  if (!values.gender?.trim()) errors.gender = 'Gender is required';
  if (!values.dob) errors.dob = 'Date of birth is required';
  if (!values.department?.trim()) errors.department = 'Department is required';
  if (!values.course?.trim()) errors.course = 'Course is required';
  if (!values.semester) {
    errors.semester = 'Class is required';
  } else if (Number(values.semester) < 7 || Number(values.semester) > 12) {
    errors.semester = 'Class must be between 7 and 12';
  }
  if (!values.address?.trim()) errors.address = 'Address is required';

  if (values.dob) {
    const dob = new Date(values.dob);
    if (Number.isNaN(dob.getTime())) {
      errors.dob = 'Enter a valid date';
    } else if (dob >= new Date()) {
      errors.dob = 'Date of birth must be in the past';
    }
  }

  return errors;
};