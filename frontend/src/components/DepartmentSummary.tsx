import type { DepartmentSummary as DepartmentData } from "@/types/insights";
import { formatSalary } from "@/lib/formatters";
import { Building2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DepartmentSummaryProps {
  data: DepartmentData[];
  currency: string;
}

export default function DepartmentSummary({ data, currency }: DepartmentSummaryProps) {
  const sortedData = [...data].sort((a, b) => b.headcount - a.headcount);

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-violet-500" />
          <CardTitle className="text-lg">By Department</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {sortedData.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No department data available.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold">Department</TableHead>
                  <TableHead className="text-right font-semibold">Employees</TableHead>
                  <TableHead className="text-right font-semibold">Avg Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row) => (
                  <TableRow key={row.department} className="transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {row.department}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.headcount}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatSalary(row.avg_salary, currency)}
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
