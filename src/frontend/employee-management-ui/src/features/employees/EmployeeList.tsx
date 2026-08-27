import { EmployeeRow } from './components/EmployeeRow';
import { useEmployees } from './hooks/useEmployees';

interface Props {
  onEdit: (id: string) => void;
  onAdd: () => void;
}

export function EmployeeList({ onEdit, onAdd }: Props) {
  const { employees, loading, error, remove } = useEmployees();

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Employees</h2>
        <button type="button" onClick={onAdd}>Add Employee</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Job Title</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <EmployeeRow
              key={emp.id}
              employee={emp}
              onEdit={onEdit}
              onDelete={remove}
            />
          ))}
        </tbody>
      </table>
      {employees.length === 0 && <p>No employees found.</p>}
    </div>
  );
}
