import { useNavigate, useParams } from 'react-router-dom';
import { EmployeeForm } from '../features/employees/EmployeeForm';

export function EmployeeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <EmployeeForm
      employeeId={id === 'new' ? undefined : id}
      onSaved={() => navigate('/employees')}
      onCancel={() => navigate('/employees')}
    />
  );
}
