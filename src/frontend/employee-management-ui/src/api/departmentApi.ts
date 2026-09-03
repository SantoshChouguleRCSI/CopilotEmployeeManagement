import type { Department, DepartmentRequest } from '../models/department';

const BASE_URL = 'https://localhost:7027/api/departments';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const problem = await response.json().catch(() => null) as { detail?: string } | null;
    throw new Error(problem?.detail ?? `HTTP ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function getDepartments(): Promise<Department[]> {
  return handleResponse<Department[]>(await fetch(BASE_URL));
}

export async function createDepartment(data: DepartmentRequest): Promise<Department> {
  return handleResponse<Department>(await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
}

export async function updateDepartment(id: string, data: DepartmentRequest): Promise<Department> {
  return handleResponse<Department>(await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
}

export async function deleteDepartment(id: string): Promise<void> {
  return handleResponse<void>(await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' }));
}