import type { Employee } from "@/types/employee";
import { formatSalary, formatDate, formatEmploymentType } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const employmentTypeBadgeClass: Record<string, string> = {
  full_time:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  part_time:
    "bg-amber-50 text-amber-700 border-amber-200",
  contract:
    "bg-sky-50 text-sky-700 border-sky-200",
};

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-xl border border-dashed bg-card">
        <div className="text-center">
          <p className="text-muted-foreground">No employees found.</p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Try adjusting your search or filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Job Title</TableHead>
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="font-semibold">Country</TableHead>
            <TableHead className="text-right font-semibold">Salary</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Hired On</TableHead>
            <TableHead className="text-right font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              className="transition-colors hover:bg-muted/30"
            >
              <TableCell className="font-medium">
                {employee.full_name}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {employee.job_title}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {employee.department || "—"}
              </TableCell>
              <TableCell>{employee.country}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {formatSalary(employee.salary, employee.currency)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    employmentTypeBadgeClass[employee.employment_type] ||
                    "bg-secondary text-secondary-foreground"
                  }
                >
                  {formatEmploymentType(employee.employment_type)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(employee.hired_on)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer"
                    onClick={() => onEdit(employee)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                    onClick={() => onDelete(employee)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
