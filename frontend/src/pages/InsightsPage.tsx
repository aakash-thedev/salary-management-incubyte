import { useState } from "react";
import { useCountries } from "@/hooks/useEmployees";
import { useInsights } from "@/hooks/useInsights";
import InsightCards from "@/components/InsightCards";
import JobTitleBreakdown from "@/components/JobTitleBreakdown";
import TopEarners from "@/components/TopEarners";
import EmploymentTypeBreakdown from "@/components/EmploymentTypeBreakdown";
import DepartmentSummary from "@/components/DepartmentSummary";
import { BarChart3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InsightsPage() {
  const [country, setCountry] = useState("");

  const { data: countries, isLoading: countriesLoading } = useCountries();

  const { data: insightsData, isLoading, isError } = useInsights({ country });

  const insights = insightsData?.insights;

  const handleCountryChange = (value: string | null) => {
    setCountry(!value || value === "all" ? "" : value);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Salary Insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Analyze salary data across countries and job titles.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <label id="insights-country-label" className="text-sm font-medium">Country</label>
          <Select value={country || "all"} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[250px]" aria-labelledby="insights-country-label">
              <SelectValue placeholder="Select a country..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Select a country...</SelectItem>
              {countriesLoading ? (
                <SelectItem value="_loading" disabled>
                  Loading...
                </SelectItem>
              ) : (
                countries?.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* No Country Selected */}
      {!country && (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-card">
          <BarChart3 className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-medium text-muted-foreground">
            Select a country to view salary insights
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Choose from {countries?.length || 0} available countries above.
          </p>
        </div>
      )}

      {/* Loading */}
      {country && isLoading && (
        <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading insights...
          </div>
        </div>
      )}

      {/* Error */}
      {country && isError && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5">
          <p className="text-destructive">
            Failed to load insights. Please check that the backend is running.
          </p>
        </div>
      )}

      {/* Insights Content */}
      {country && insights && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <InsightCards insights={insights} />

          {/* Two-column layout: Employment Type + Department */}
          <div className="grid gap-6 lg:grid-cols-2">
            <EmploymentTypeBreakdown
              data={insights.employment_type_breakdown}
              totalHeadcount={insights.headcount}
              currency={insights.currency ?? "USD"}
            />
            <DepartmentSummary
              data={insights.department_summary}
              currency={insights.currency ?? "USD"}
            />
          </div>

          {/* Two-column layout: Job Title Breakdown + Top Earners */}
          <div className="grid gap-6 lg:grid-cols-2">
            <JobTitleBreakdown
              data={insights.salary_by_job_title}
              currency={insights.currency ?? "USD"}
            />
            <TopEarners employees={insights.top_earners} />
          </div>
        </div>
      )}
    </div>
  );
}
