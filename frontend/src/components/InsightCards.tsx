import type { SalaryInsights } from "@/types/insights";
import { formatSalary } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface InsightCardsProps {
  insights: SalaryInsights;
}

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  iconClassName: string;
}

function StatCard({ title, value, description, icon: Icon, iconClassName }: StatCardProps) {
  return (
    <Card className="shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground/70">{description}</p>
            )}
          </div>
          <div className={`rounded-lg p-2.5 ${iconClassName}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
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
    currency,
  } = insights;

  const cur = currency ?? "USD";

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Total Employees"
        value={headcount.toLocaleString()}
        description="in this country"
        icon={Users}
        iconClassName="bg-primary/10 text-primary"
      />
      <StatCard
        title="Average Salary"
        value={avg_salary != null ? formatSalary(avg_salary, cur) : "—"}
        description="across all roles"
        icon={TrendingUp}
        iconClassName="bg-emerald-50 text-emerald-600"
      />
      <StatCard
        title="Median Salary"
        value={median_salary != null ? formatSalary(median_salary, cur) : "—"}
        description="middle value"
        icon={ArrowUpDown}
        iconClassName="bg-amber-50 text-amber-600"
      />
      <StatCard
        title="Minimum Salary"
        value={min_salary != null ? formatSalary(min_salary, cur) : "—"}
        description="lowest paid"
        icon={ArrowDown}
        iconClassName="bg-sky-50 text-sky-600"
      />
      <StatCard
        title="Maximum Salary"
        value={max_salary != null ? formatSalary(max_salary, cur) : "—"}
        description="highest paid"
        icon={ArrowUp}
        iconClassName="bg-violet-50 text-violet-600"
      />
    </div>
  );
}
