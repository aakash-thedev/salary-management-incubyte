import { useParams, useNavigate } from "react-router-dom";
import { useEmployee } from "@/hooks/useEmployees";
import { formatSalary, formatDate, formatEmploymentType } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";

const employmentTypeBadgeClass: Record<string, string> = {
  full_time: "bg-emerald-50 text-emerald-700 border-emerald-200",
  part_time: "bg-amber-50 text-amber-700 border-amber-200",
  contract: "bg-sky-50 text-sky-700 border-sky-200",
};

function SalaryComparisonCard({
  label,
  avgSalary,
  headcount,
  employeeSalary,
  scope,
  currency,
}: {
  label: string;
  avgSalary: number | null;
  headcount: number;
  employeeSalary: number;
  scope: string;
  currency: string;
}) {
  if (avgSalary == null) return null;

  const diff = employeeSalary - avgSalary;
  const percentDiff = avgSalary > 0 ? (diff / avgSalary) * 100 : 0;
  const isAbove = diff > 0;
  const isEqual = Math.abs(percentDiff) < 0.5;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Avg in {scope}</span>
          </div>
          <span className="font-semibold tabular-nums">
            {formatSalary(avgSalary, currency)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Peers</span>
          </div>
          <span className="tabular-nums">{headcount}</span>
        </div>
        <div className="rounded-lg border bg-muted/30 px-3 py-2">
          <div className="flex items-center gap-2">
            {isEqual ? (
              <Minus className="h-4 w-4 text-muted-foreground" />
            ) : isAbove ? (
              <ArrowUp className="h-4 w-4 text-emerald-600" />
            ) : (
              <ArrowDown className="h-4 w-4 text-amber-600" />
            )}
            <span
              className={`text-sm font-semibold ${
                isEqual
                  ? "text-muted-foreground"
                  : isAbove
                    ? "text-emerald-600"
                    : "text-amber-600"
              }`}
            >
              {isEqual
                ? "At average"
                : `${Math.abs(percentDiff).toFixed(1)}% ${isAbove ? "above" : "below"} average`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="rounded-lg bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function TenureBadge({ hiredOn }: { hiredOn: string | null }) {
  if (!hiredOn) return <span className="text-muted-foreground">--</span>;

  const hired = new Date(hiredOn + "T00:00:00");
  const now = new Date();
  const diffMs = now.getTime() - hired.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return <span className="text-muted-foreground">Not yet started</span>;

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);

  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (months > 0) parts.push(`${months}m`);
  if (parts.length === 0) parts.push("< 1m");

  return (
    <span>
      {formatDate(hiredOn)}{" "}
      <span className="text-muted-foreground">({parts.join(" ")})</span>
    </span>
  );
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useEmployee(Number(id) || 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          onClick={() => navigate("/employees")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Employees
        </Button>
        <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading employee...
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="gap-2 cursor-pointer"
          onClick={() => navigate("/employees")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Employees
        </Button>
        <div className="flex h-48 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5">
          <p className="text-destructive">
            Employee not found or failed to load.
          </p>
        </div>
      </div>
    );
  }

  const { employee, comparison } = data;
  const salary = parseFloat(employee.salary);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="gap-2 cursor-pointer"
        onClick={() => navigate("/employees")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Employees
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {employee.full_name}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {employee.job_title}
            {employee.department && ` · ${employee.department}`}
            {` · ${employee.country}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tracking-tight">
            {formatSalary(employee.salary, employee.currency)}
          </p>
          <Badge
            variant="outline"
            className={`mt-1 ${employmentTypeBadgeClass[employee.employment_type] || ""}`}
          >
            {formatEmploymentType(employee.employment_type)}
          </Badge>
        </div>
      </div>

      {/* Main Content: Details + Comparison */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Employee Details Card */}
        <Card className="shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow icon={User} label="Full Name" value={employee.full_name} />
            <DetailRow icon={Briefcase} label="Job Title" value={employee.job_title} />
            <DetailRow
              icon={Building2}
              label="Department"
              value={employee.department || <span className="text-muted-foreground">--</span>}
            />
            <DetailRow icon={MapPin} label="Country" value={employee.country} />
            <DetailRow
              icon={DollarSign}
              label="Salary"
              value={formatSalary(employee.salary, employee.currency)}
            />
            <DetailRow
              icon={Calendar}
              label="Hired On"
              value={<TenureBadge hiredOn={employee.hired_on} />}
            />
          </CardContent>
        </Card>

        {/* Salary Comparison Cards */}
        {comparison && (
          <div className="space-y-6 lg:col-span-2">
            <h2 className="text-lg font-semibold">Salary Benchmarks</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <SalaryComparisonCard
                label="vs. Country Average"
                avgSalary={comparison.country_avg_salary}
                headcount={comparison.country_headcount}
                employeeSalary={salary}
                scope={employee.country}
                currency={employee.currency}
              />
              <SalaryComparisonCard
                label={`vs. ${employee.job_title} in ${employee.country}`}
                avgSalary={comparison.role_avg_salary}
                headcount={comparison.role_headcount}
                employeeSalary={salary}
                scope="role"
                currency={employee.currency}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
