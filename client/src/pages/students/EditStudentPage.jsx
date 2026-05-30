import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageHeader from '../../components/common/PageHeader';
import LoadingScreen from '../../components/common/LoadingScreen';
import StudentForm from '../../components/forms/StudentForm';
import { studentService } from '../../services/api';

const EditStudentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const response = await studentService.getById(id);
        setStudent(response.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load student');
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  const handleSubmit = async (payload) => {
    try {
      await studentService.update(id, payload);
      toast.success('Student updated successfully');
      navigate('/students');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update student');
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading enrollee details..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Update"
        title={`Edit ${student?.fullName || 'Learner'}`}
        description="Modify the learner profile and keep records accurate across the dashboard and list views."
      />
      <StudentForm initialValues={student} submitLabel="Update Record" onSubmit={handleSubmit} />
    </div>
  );
};

export default EditStudentPage;