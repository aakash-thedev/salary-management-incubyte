import type { EmploymentTypeBreakdown as BreakdownData } from "@/types/insights";
import { formatSalary, formatEmploymentType } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmploymentTypeBreakdownProps {
  data: BreakdownData[];
  totalHeadcount: number;
}

const typeBadgeClass: Record<string, string> = {
  full_time: "bg-emerald-50 text-emerald-700 border-emerald-200",
  part_time: "bg-amber-50 text-amber-700 border-amber-200",
  contract: "bg-sky-50 text-sky-700 border-sky-200",
};

export default function EmploymentTypeBreakdown({
  data,
  totalHeadcount,
}: EmploymentTypeBreakdownProps) {
  const sortedData = [...data].sort((a, b) => b.headcount - a.headcount);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">By Employment Type</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No data available.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="text-right font-semibold">Employees</TableHead>
                  <TableHead className="text-right font-semibold">% Share</TableHead>
                  <TableHead className="text-right font-semibold">Avg Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row) => {
                  const percentage = totalHeadcount > 0
                    ? ((row.headcount / totalHeadcount) * 100).toFixed(1)
                    : "0";

                  return (
                    <TableRow key={row.employment_type} className="transition-colors hover:bg-muted/30">
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={typeBadgeClass[row.employment_type] || "bg-secondary text-secondary-foreground"}
                        >
                          {formatEmploymentType(row.employment_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.headcount}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        {percentage}%
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {formatSalary(row.avg_salary)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
