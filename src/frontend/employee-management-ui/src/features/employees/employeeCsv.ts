import type { Employee } from '../../models/employee';

const headers = ['Name', 'Email', 'Department', 'Job Title', 'Status'];

function escapeCsvValue(value: string): string {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function createEmployeesCsv(employees: Employee[]): string {
  const rows = employees.map(employee => [
    `${employee.firstName} ${employee.lastName}`,
    employee.email,
    employee.department,
    employee.jobTitle,
    employee.isActive ? 'Active' : 'Inactive',
  ].map(escapeCsvValue).join(','));

  return [headers.join(','), ...rows].join('\r\n');
}

export function downloadEmployeesCsv(employees: Employee[]): void {
  const url = URL.createObjectURL(new Blob([createEmployeesCsv(employees)], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `employees-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
