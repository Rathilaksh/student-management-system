import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StudentForm from '../components/forms/StudentForm';

test('renders student form and validates input', () => {
  const onSubmit = jest.fn();
  render(<StudentForm onSubmit={onSubmit} />);

  const name = screen.getByLabelText(/full name/i);
  const email = screen.getByLabelText(/email/i);
  const mobile = screen.getByLabelText(/mobile number/i);
  const gender = screen.getByLabelText(/gender/i);
  const dob = screen.getByLabelText(/date of birth/i);
  const semester = screen.getByLabelText(/class \/ grade/i);
  const department = screen.getByLabelText(/program stream/i);
  const course = screen.getByLabelText(/batch/i);
  const address = screen.getByLabelText(/address/i);
  const submit = screen.getByRole('button', { name: /save/i });

  fireEvent.change(name, { target: { value: 'Test Student' } });
  fireEvent.change(email, { target: { value: 'student@example.com' } });
  fireEvent.change(mobile, { target: { value: '+919876543210' } });
  fireEvent.change(gender, { target: { value: 'Male' } });
  // ISO date in the past
  fireEvent.change(dob, { target: { value: '2006-05-20' } });
  fireEvent.change(semester, { target: { value: '11' } });
  fireEvent.change(department, { target: { value: 'JEE' } });
  fireEvent.change(course, { target: { value: 'Class 11 JEE' } });
  fireEvent.change(address, { target: { value: '123 Test St' } });

  fireEvent.click(submit);

  // ensure onSubmit called (the form component should call it when valid)
  expect(onSubmit).toHaveBeenCalledTimes(1);
});
