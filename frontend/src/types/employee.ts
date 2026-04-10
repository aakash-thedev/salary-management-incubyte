export interface Employee {
  id: number;
  full_name: string;
  job_title: string;
  department: string | null;
  country: string;
  salary: string; // Decimal comes as string from Rails
  currency: string;
  employment_type: string;
  hired_on: string | null;
}

export interface EmployeeFormData {
  full_name: string;
  job_title: string;
  department?: string;
  country: string;
  salary: number;
  currency: string;
  employment_type: string;
  hired_on?: string;
}

export interface PaginationMeta {
  current_page: number;
  total_pages: number;
  total_count: number;
}

export interface EmployeesResponse {
  employees: Employee[];
  meta: PaginationMeta;
}

export interface SalaryComparison {
  country_avg_salary: number | null;
  country_headcount: number;
  role_avg_salary: number | null;
  role_headcount: number;
}

export interface EmployeeResponse {
  employee: Employee;
  comparison?: SalaryComparison;
}

export interface EmployeeErrors {
  errors: Record<string, string[]>;
}
