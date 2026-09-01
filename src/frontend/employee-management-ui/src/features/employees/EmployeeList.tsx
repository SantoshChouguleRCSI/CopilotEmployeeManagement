import { EmployeeRow } from './components/EmployeeRow';
import { exportEmployeesCsv } from './exportEmployeesCsv';
import { useEmployees } from './hooks/useEmployees';

interface Props {
  onEdit: (id: string) => void;
  onAdd: () => void;
}

export function EmployeeList({ onEdit, onAdd }: Props) {
  const { employees, loading, error, search, setSearch, remove } = useEmployees();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Employees</h2>
        <div>
          <button
            type="button"
            onClick={() => exportEmployeesCsv(employees)}
            disabled={loading || error !== null || employees.length === 0}
          >
            Export Employees
          </button>
          <button type="button" onClick={onAdd}>Add Employee</button>
        </div>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="search"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search employees"
        />
      </div>
      {loading && <p>Loading employees...</p>}
      {!loading && error && <p>Error: {error}</p>}
      {!loading && !error && (
        <>
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
        </>
      )}
    </div>
  );
}
