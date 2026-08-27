import { useNavigate } from 'react-router-dom';
import { EmployeeList } from '../features/employees/EmployeeList';

export function EmployeesPage() {
  const navigate = useNavigate();

  return (
    <EmployeeList
      onEdit={id => navigate(`/employees/${id}/edit`)}
      onAdd={() => navigate('/employees/new')}
    />
  );
}
