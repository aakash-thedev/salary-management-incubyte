import type { SalaryInsights } from "@/types/insights";
import { formatSalary } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsightCardsProps {
  insights: SalaryInsights;
}

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
}

function StatCard({ title, value, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function InsightCards({ insights }: InsightCardsProps) {
  const {
    min_salary,
    max_salary,
    avg_salary,
    median_salary,
    headcount,
  } = insights;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Total Employees"
        value={headcount.toLocaleString()}
        description="in this country"
      />
      <StatCard
        title="Average Salary"
        value={avg_salary != null ? formatSalary(avg_salary) : "—"}
        description="across all roles"
      />
      <StatCard
        title="Median Salary"
        value={median_salary != null ? formatSalary(median_salary) : "—"}
        description="middle value"
      />
      <StatCard
        title="Minimum Salary"
        value={min_salary != null ? formatSalary(min_salary) : "—"}
        description="lowest paid"
      />
      <StatCard
        title="Maximum Salary"
        value={max_salary != null ? formatSalary(max_salary) : "—"}
        description="highest paid"
      />
    </div>
  );
}
