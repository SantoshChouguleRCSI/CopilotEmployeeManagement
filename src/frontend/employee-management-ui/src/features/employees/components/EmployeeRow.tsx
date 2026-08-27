import type { Employee } from '../../../models/employee';

interface Props {
  employee: Employee;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmployeeRow({ employee, onEdit, onDelete }: Props) {
  return (
    <tr>
      <td>{employee.firstName} {employee.lastName}</td>
      <td>{employee.email}</td>
      <td>{employee.department}</td>
      <td>{employee.jobTitle}</td>
      <td>{employee.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
      <td>{employee.isActive ? 'Active' : 'Inactive'}</td>
      <td>
        <button type="button" onClick={() => onEdit(employee.id)}>Edit</button>
        <button type="button" onClick={() => onDelete(employee.id)}>Delete</button>
      </td>
    </tr>
  );
}
