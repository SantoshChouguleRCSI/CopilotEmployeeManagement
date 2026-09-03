export interface Department {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentRequest {
  name: string;
  description: string;
}