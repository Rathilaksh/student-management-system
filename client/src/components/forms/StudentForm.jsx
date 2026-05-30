import { useEffect, useState } from 'react';
import { departmentOptions, courseOptions, genderOptions, semesterOptions } from '../../data/options';
import { toDateInputValue } from '../../utils/formatters';
import { validateStudent } from '../../utils/validation';

const defaultValues = {
  fullName: '',
  email: '',
  mobile: '',
  gender: '',
  dob: '',
  department: '',
  course: '',
  semester: '',
  address: ''
};

const StudentForm = ({ initialValues, onSubmit, submitLabel = 'Save Student', loading = false }) => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setValues({
        fullName: initialValues.fullName || '',
        email: initialValues.email || '',
        mobile: initialValues.mobile || '',
        gender: initialValues.gender || '',
        dob: toDateInputValue(initialValues.dob),
        department: initialValues.department || '',
        course: initialValues.course || '',
        semester: initialValues.semester || '',
        address: initialValues.address || ''
      });
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateStudent(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await onSubmit({
        ...values,
        semester: Number(values.semester)
      });
    } catch (error) {
      // The page-level submit handler is responsible for showing the error toast.
    }
  };

  const inputClasses = 'mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50';
  const fieldWrapper = 'space-y-2';
  const errorClasses = 'text-xs font-medium text-rose-600';

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className={fieldWrapper}>
          <span className="text-sm font-semibold text-slate-700">Full Name</span>
          <input name="fullName" value={values.fullName} onChange={handleChange} className={inputClasses} placeholder="Enter full name" />
          {errors.fullName ? <span className={errorClasses}>{errors.fullName}</span> : null}
        </label>

        <label className={fieldWrapper}>
          <span className="text-sm font-semibold text-slate-700">Email</span>
          <input type="email" name="email" value={values.email} onChange={handleChange} className={inputClasses} placeholder="student@example.com" />
          {errors.email ? <span className={errorClasses}>{errors.email}</span> : null}
        </label>

        <label className={fieldWrapper}>
          <span className="text-sm font-semibold text-slate-700">Mobile Number</span>
          <input name="mobile" value={values.mobile} onChange={handleChange} className={inputClasses} placeholder="+919876543210" />
          {errors.mobile ? <span className={errorClasses}>{errors.mobile}</span> : null}
        </label>

        <label className={fieldWrapper}>
          <span className="text-sm font-semibold text-slate-700">Gender</span>
          <select name="gender" value={values.gender} onChange={handleChange} className={inputClasses}>
            <option value="">Select gender</option>
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
          {errors.gender ? <span className={errorClasses}>{errors.gender}</span> : null}
        </label>

        <label className={fieldWrapper}>
          <span className="text-sm font-semibold text-slate-700">Date of Birth</span>
          <input type="date" name="dob" value={values.dob} onChange={handleChange} className={inputClasses} />
          {errors.dob ? <span className={errorClasses}>{errors.dob}</span> : null}
        </label>

        <label className={fieldWrapper}>
          <span className="text-sm font-semibold text-slate-700">Class / Grade</span>
          <select name="semester" value={values.semester} onChange={handleChange} className={inputClasses}>
            <option value="">Select class</option>
            {semesterOptions.map((semester) => (
              <option key={semester} value={semester}>
                Class {semester}
              </option>
            ))}
          </select>
          {errors.semester ? <span className={errorClasses}>{errors.semester}</span> : null}
        </label>

        <label className={fieldWrapper}>
          <span className="text-sm font-semibold text-slate-700">Program Stream</span>
          <select name="department" value={values.department} onChange={handleChange} className={inputClasses}>
            <option value="">Select stream</option>
            {departmentOptions.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
          {errors.department ? <span className={errorClasses}>{errors.department}</span> : null}
        </label>

        <label className={fieldWrapper}>
          <span className="text-sm font-semibold text-slate-700">Batch</span>
          <select name="course" value={values.course} onChange={handleChange} className={inputClasses}>
            <option value="">Select batch</option>
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          {errors.course ? <span className={errorClasses}>{errors.course}</span> : null}
        </label>
      </div>

      <label className={fieldWrapper}>
        <span className="text-sm font-semibold text-slate-700">Address</span>
        <textarea name="address" value={values.address} onChange={handleChange} rows="4" className={inputClasses} placeholder="Enter learner address" />
        {errors.address ? <span className={errorClasses}>{errors.address}</span> : null}
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;