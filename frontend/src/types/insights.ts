import type { Employee } from "./employee";

export interface JobTitleSalary {
  job_title: string;
  avg_salary: number;
  headcount: number;
}

export interface SalaryInsights {
  min_salary: number | null;
  max_salary: number | null;
  avg_salary: number | null;
  median_salary: number | null;
  headcount: number;
  salary_by_job_title: JobTitleSalary[];
  top_earners: Employee[];
  job_title_avg_salary?: number | null;
}

export interface InsightsResponse {
  insights: SalaryInsights;
}
