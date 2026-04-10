import { useState } from "react";
import { useEmployees, useCountries } from "@/hooks/useEmployees";
import { useDebounce } from "@/hooks/useDebounce";
import EmployeeTable from "@/components/EmployeeTable";
import EmployeePagination from "@/components/EmployeePagination";
import EmployeeForm from "@/components/EmployeeForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/types/employee";

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");

  // Modal state
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [_deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError } = useEmployees({
    page,
    search: debouncedSearch || undefined,
    country: country || undefined,
  });

  const { data: countries } = useCountries();

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCountryChange = (value: string | null) => {
    setCountry(!value || value === "all" ? "" : value);
    setPage(1);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = (employee: Employee) => {
    setDeletingEmployee(employee);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization&apos;s employee records.
          </p>
        </div>
        <Button onClick={handleAddNew}>Add Employee</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <Select value={country || "all"} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries?.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || country) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch("");
              setCountry("");
              setPage(1);
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex h-48 items-center justify-center">
          <p className="text-muted-foreground">Loading employees...</p>
        </div>
      )}

      {isError && (
        <div className="flex h-48 items-center justify-center rounded-md border border-destructive/50 bg-destructive/10">
          <p className="text-destructive">
            Failed to load employees. Please check that the backend is running.
          </p>
        </div>
      )}

      {data && (
        <>
          <EmployeeTable
            employees={data.employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <EmployeePagination meta={data.meta} onPageChange={setPage} />
        </>
      )}

      {/* Create/Edit Form Modal */}
      <EmployeeForm
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingEmployee(null);
        }}
        employee={editingEmployee}
      />
    </div>
  );
}
