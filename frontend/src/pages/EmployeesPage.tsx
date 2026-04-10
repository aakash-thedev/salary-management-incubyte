import { useState } from "react";
import { useEmployees, useCountries } from "@/hooks/useEmployees";
import { useDebounce } from "@/hooks/useDebounce";
import EmployeeTable from "@/components/EmployeeTable";
import EmployeePagination from "@/components/EmployeePagination";
import EmployeeForm from "@/components/EmployeeForm";
import DeleteEmployeeDialog from "@/components/DeleteEmployeeDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, X } from "lucide-react";
import type { Employee } from "@/types/employee";

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");

  // Modal state
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

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

  const hasFilters = search || country;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your organization&apos;s employee records.
          </p>
        </div>
        <Button onClick={handleAddNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
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
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => {
              setSearch("");
              setCountry("");
              setPage(1);
            }}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading && (
        <div className="flex h-48 items-center justify-center rounded-xl border bg-card">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Loading employees...
          </div>
        </div>
      )}

      {isError && (
        <div className="flex h-48 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5">
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

      {/* Delete Confirmation Dialog */}
      <DeleteEmployeeDialog
        open={deletingEmployee !== null}
        onClose={() => setDeletingEmployee(null)}
        employee={deletingEmployee}
      />
    </div>
  );
}
