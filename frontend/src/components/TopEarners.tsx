import type { Employee } from "@/types/employee";
import { formatSalary, formatEmploymentType } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopEarnersProps {
  employees: Employee[];
}

const rankColors = [
  "bg-amber-100 text-amber-700 border-amber-300",   // 1st — gold
  "bg-slate-100 text-slate-600 border-slate-300",    // 2nd — silver
  "bg-orange-100 text-orange-700 border-orange-300", // 3rd — bronze
];

export default function TopEarners({ employees }: TopEarnersProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-lg">Top 5 Highest Paid</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No employees found.
          </p>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-12 font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Job Title</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="text-right font-semibold">Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee, index) => (
                  <TableRow key={employee.id} className="transition-colors hover:bg-muted/30">
                    <TableCell>
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-bold ${
                          rankColors[index] || "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {index + 1}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {employee.full_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {employee.job_title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {formatEmploymentType(employee.employment_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums">
                      {formatSalary(employee.salary, employee.currency)}
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
