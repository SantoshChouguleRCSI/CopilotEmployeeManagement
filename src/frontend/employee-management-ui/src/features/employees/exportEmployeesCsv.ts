import type { Employee } from '../../models/employee';

const headers = ['Name', 'Email', 'Department', 'Job Title', 'Status'];
const formulaPrefixes = new Set(['=', '+', '-', '@']);

function escapeCsvValue(value: string): string {
  const firstSignificantCharacter = Array.from(value)
    .find(character => (character.codePointAt(0) ?? 0) > 0x20);
  const safeValue = firstSignificantCharacter && formulaPrefixes.has(firstSignificantCharacter)
    ? `'${value}`
    : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function exportEmployeesCsv(employees: Employee[]): void {
  const rows = employees.map(employee => [
    `${employee.firstName} ${employee.lastName}`,
    employee.email,
    employee.department,
    employee.jobTitle,
    employee.isActive ? 'Active' : 'Inactive',
  ].map(escapeCsvValue).join(','));
  const csv = [headers.join(','), ...rows].join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');

  link.href = url;
  link.download = 'employees.csv';
  link.click();
  URL.revokeObjectURL(url);
}
