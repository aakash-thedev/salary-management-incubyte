import { useState } from "react";
import type { JobTitleSalary } from "@/types/insights";
import { formatSalary } from "@/lib/formatters";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Salary by Job Title</CardTitle>
        <div className="relative pt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 translate-y-[-25%] text-muted-foreground" />
          <Input
            placeholder="Filter job titles..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9"
          />
        </div>
        {selectedJobTitle && jobTitleAvgSalary != null && (
          <div className="mt-3 rounded-lg bg-primary/5 border border-primary/15 px-4 py-3">
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
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Job Title</TableHead>
                  <TableHead className="text-right font-semibold">Avg Salary</TableHead>
                  <TableHead className="text-right font-semibold">Employees</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row) => (
                  <TableRow key={row.job_title} className="transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {row.job_title}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatSalary(row.avg_salary)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground tabular-nums">
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
