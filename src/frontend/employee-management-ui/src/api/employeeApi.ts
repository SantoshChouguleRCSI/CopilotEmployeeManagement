import type { CreateEmployeeRequest, Employee, UpdateEmployeeRequest } from '../models/employee';

const BASE_URL = 'https://localhost:7027/api/employees';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function getEmployees(search?: string): Promise<Employee[]> {
  const url = search ? `${BASE_URL}?search=${encodeURIComponent(search)}` : BASE_URL;
  const res = await fetch(url);
  return handleResponse<Employee[]>(res);
}

export async function getEmployee(id: string): Promise<Employee> {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse<Employee>(res);
}

export async function createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Employee>(res);
}

export async function updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<Employee>(res);
}

export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  return handleResponse<void>(res);
}
