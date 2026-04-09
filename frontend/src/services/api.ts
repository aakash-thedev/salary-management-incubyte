import axios from "axios";
import type {
  EmployeesResponse,
  EmployeeResponse,
  EmployeeFormData,
} from "@/types/employee";
import type { InsightsResponse } from "@/types/insights";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Employees ---

export interface EmployeeListParams {
  page?: number;
  country?: string;
  search?: string;
}

export async function fetchEmployees(
  params: EmployeeListParams = {}
): Promise<EmployeesResponse> {
  const { data } = await api.get<EmployeesResponse>("/api/v1/employees", {
    params,
  });
  return data;
}

export async function fetchEmployee(id: number): Promise<EmployeeResponse> {
  const { data } = await api.get<EmployeeResponse>(`/api/v1/employees/${id}`);
  return data;
}

export async function createEmployee(
  employee: EmployeeFormData
): Promise<EmployeeResponse> {
  const { data } = await api.post<EmployeeResponse>("/api/v1/employees", {
    employee,
  });
  return data;
}

export async function updateEmployee(
  id: number,
  employee: Partial<EmployeeFormData>
): Promise<EmployeeResponse> {
  const { data } = await api.put<EmployeeResponse>(
    `/api/v1/employees/${id}`,
    { employee }
  );
  return data;
}

export async function deleteEmployee(id: number): Promise<void> {
  await api.delete(`/api/v1/employees/${id}`);
}

// --- Insights ---

export interface InsightsParams {
  country: string;
  job_title?: string;
}

export async function fetchInsights(
  params: InsightsParams
): Promise<InsightsResponse> {
  const { data } = await api.get<InsightsResponse>("/api/v1/insights", {
    params,
  });
  return data;
}
