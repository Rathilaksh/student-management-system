import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import StudentForm from '../../components/forms/StudentForm';
import { studentService } from '../../services/api';

const AddStudentPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      await studentService.create(payload);
      toast.success('Student created successfully');
      navigate('/students');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create student');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Create"
        title="Add Enrollee"
        description="Capture a new learner profile with validated contact details, program stream, and batch details."
      />
      <StudentForm submitLabel="Create Record" onSubmit={handleSubmit} />
    </div>
  );
};

export default AddStudentPage;