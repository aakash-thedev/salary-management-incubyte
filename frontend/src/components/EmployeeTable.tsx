import type { Employee } from "@/types/employee";
import { formatSalary, formatDate, formatEmploymentType } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export default function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  if (employees.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-md border border-dashed">
        <p className="text-muted-foreground">No employees found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Country</TableHead>
            <TableHead className="text-right">Salary</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Hired On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">
                {employee.full_name}
              </TableCell>
              <TableCell>{employee.job_title}</TableCell>
              <TableCell>{employee.department || "—"}</TableCell>
              <TableCell>{employee.country}</TableCell>
              <TableCell className="text-right">
                {formatSalary(employee.salary, employee.currency)}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {formatEmploymentType(employee.employment_type)}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(employee.hired_on)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(employee)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(employee)}
                  >
                    Delete
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
