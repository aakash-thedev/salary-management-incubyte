import { useState } from "react";
import { useCountries, useJobTitles } from "@/hooks/useEmployees";
import { useInsights } from "@/hooks/useInsights";
import InsightCards from "@/components/InsightCards";
import JobTitleBreakdown from "@/components/JobTitleBreakdown";
import TopEarners from "@/components/TopEarners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InsightsPage() {
  const [country, setCountry] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: jobTitles } = useJobTitles();

  const { data: insightsData, isLoading, isError } = useInsights({
    country,
    job_title: jobTitle || undefined,
  });

  const insights = insightsData?.insights;

  const handleCountryChange = (value: string | null) => {
    setCountry(value || "");
    setJobTitle(""); // Reset job title when country changes
  };

  const handleJobTitleChange = (value: string | null) => {
    setJobTitle(!value || value === "all" ? "" : value);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Salary Insights</h1>
        <p className="text-sm text-muted-foreground">
          Analyze salary data across countries and job titles.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Country</label>
          <Select value={country || undefined} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a country..." />
            </SelectTrigger>
            <SelectContent>
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

        {country && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Job Title (optional)</label>
            <Select
              value={jobTitle || "all"}
              onValueChange={handleJobTitleChange}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="All Job Titles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Job Titles</SelectItem>
                {jobTitles?.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* No Country Selected */}
      {!country && (
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">
            Select a country to view salary insights.
          </p>
        </div>
      )}

      {/* Loading */}
      {country && isLoading && (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading insights...</p>
        </div>
      )}

      {/* Error */}
      {country && isError && (
        <div className="flex h-48 items-center justify-center rounded-md border border-destructive/50 bg-destructive/10">
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

          {/* Two-column layout: Job Title Breakdown + Top Earners */}
          <div className="grid gap-6 lg:grid-cols-2">
            <JobTitleBreakdown
              data={insights.salary_by_job_title}
              jobTitleAvgSalary={insights.job_title_avg_salary}
              selectedJobTitle={jobTitle}
            />
            <TopEarners employees={insights.top_earners} />
          </div>
        </div>
      )}
    </div>
  );
}
