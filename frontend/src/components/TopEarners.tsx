import type { Employee } from "@/types/employee";
import { formatSalary, formatEmploymentType } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
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

export default function TopEarners({ employees }: TopEarnersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Highest Paid</CardTitle>
      </CardHeader>
      <CardContent>
        {employees.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No employees found.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee, index) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {employee.full_name}
                    </TableCell>
                    <TableCell>{employee.job_title}</TableCell>
                    <TableCell>{employee.department || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {formatEmploymentType(employee.employment_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
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
