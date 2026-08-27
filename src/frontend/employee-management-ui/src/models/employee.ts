export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  salary: number;
  dateOfJoining: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  salary: number;
  dateOfJoining: string;
}

export interface UpdateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  jobTitle: string;
  salary: number;
}
