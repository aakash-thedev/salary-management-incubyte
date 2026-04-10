import { useState } from "react";
import type { JobTitleSalary } from "@/types/insights";
import { formatSalary } from "@/lib/formatters";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JobTitleBreakdownProps {
  data: JobTitleSalary[];
  jobTitleAvgSalary?: number | null;
  selectedJobTitle?: string;
}

export default function JobTitleBreakdown({
  data,
  jobTitleAvgSalary,
  selectedJobTitle,
}: JobTitleBreakdownProps) {
  const [filter, setFilter] = useState("");

  const filteredData = data.filter((row) =>
    row.job_title.toLowerCase().includes(filter.toLowerCase())
  );

  // Sort by avg salary descending
  const sortedData = [...filteredData].sort(
    (a, b) => b.avg_salary - a.avg_salary
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary by Job Title</CardTitle>
        <div className="flex items-center gap-4 pt-2">
          <Input
            placeholder="Filter job titles..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        {selectedJobTitle && jobTitleAvgSalary != null && (
          <div className="mt-3 rounded-md bg-muted px-4 py-3">
            <p className="text-sm">
              Average salary for{" "}
              <span className="font-semibold">{selectedJobTitle}</span>:{" "}
              <span className="font-bold text-primary">
                {formatSalary(jobTitleAvgSalary)}
              </span>
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No job titles found.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead className="text-right">Avg Salary</TableHead>
                  <TableHead className="text-right">Employees</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row) => (
                  <TableRow key={row.job_title}>
                    <TableCell className="font-medium">
                      {row.job_title}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatSalary(row.avg_salary)}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.headcount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
