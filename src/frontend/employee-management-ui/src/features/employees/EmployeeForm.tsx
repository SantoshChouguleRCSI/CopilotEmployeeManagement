import { useEffect, useState } from 'react';
import { createEmployee, getEmployee, updateEmployee } from '../../api/employeeApi';
import type { CreateEmployeeRequest, UpdateEmployeeRequest } from '../../models/employee';

interface Props {
  employeeId?: string;
  onSaved: () => void;
  onCancel: () => void;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  salary: string;
  dateOfJoining: string;
}

const emptyForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  jobTitle: '',
  salary: '',
  dateOfJoining: '',
};

export function EmployeeForm({ employeeId, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const isEdit = employeeId !== undefined;

  useEffect(() => {
    if (!employeeId) return;
    setLoadError(null);
    getEmployee(employeeId)
      .then(emp =>
        setForm({
          firstName: emp.firstName,
          lastName: emp.lastName,
          email: emp.email,
          department: emp.department,
          jobTitle: emp.jobTitle,
          salary: emp.salary.toString(),
          dateOfJoining: emp.dateOfJoining,
        })
      )
      .catch(e => setLoadError(e instanceof Error ? e.message : 'Failed to load employee'));
  }, [employeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (isEdit) {
        const req: UpdateEmployeeRequest = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          department: form.department,
          jobTitle: form.jobTitle,
          salary: parseFloat(form.salary),
        };
        await updateEmployee(employeeId, req);
      } else {
        const req: CreateEmployeeRequest = {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          department: form.department,
          jobTitle: form.jobTitle,
          salary: parseFloat(form.salary),
          dateOfJoining: form.dateOfJoining,
        };
        await createEmployee(req);
      }
      onSaved();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to save employee');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) return <p>Error: {loadError}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      <div>
        <label>
          First Name
          <input name="firstName" value={form.firstName} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Last Name
          <input name="lastName" value={form.lastName} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Department
          <input name="department" value={form.department} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Job Title
          <input name="jobTitle" value={form.jobTitle} onChange={handleChange} required />
        </label>
      </div>
      <div>
        <label>
          Salary
          <input name="salary" type="number" min="0" step="0.01" value={form.salary} onChange={handleChange} required />
        </label>
      </div>
      {!isEdit && (
        <div>
          <label>
            Date of Joining
            <input name="dateOfJoining" type="date" value={form.dateOfJoining} onChange={handleChange} required />
          </label>
        </div>
      )}
      <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
      <button type="button" onClick={onCancel} disabled={submitting}>Cancel</button>
    </form>
  );
}
