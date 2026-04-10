import { useState, useEffect } from "react";
import type { Employee, EmployeeFormData } from "@/types/employee";
import { useCreateEmployee, useUpdateEmployee, useCountries, useJobTitles } from "@/hooks/useEmployees";
import { EMPLOYMENT_TYPES, CURRENCIES } from "@/lib/constants";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  employee: Employee | null; // null = create mode, Employee = edit mode
}

const INITIAL_FORM: EmployeeFormData = {
  full_name: "",
  job_title: "",
  department: "",
  country: "",
  salary: 0,
  currency: "USD",
  employment_type: "full_time",
  hired_on: "",
};

export default function EmployeeForm({
  open,
  onClose,
  employee,
}: EmployeeFormProps) {
  const [form, setForm] = useState<EmployeeFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const { data: countries } = useCountries();
  const { data: jobTitles } = useJobTitles();

  const isEditing = employee !== null;

  // Populate form when editing
  useEffect(() => {
    if (employee) {
      setForm({
        full_name: employee.full_name,
        job_title: employee.job_title,
        department: employee.department || "",
        country: employee.country,
        salary: parseFloat(employee.salary),
        currency: employee.currency,
        employment_type: employee.employment_type,
        hired_on: employee.hired_on || "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [employee, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.full_name.trim()) newErrors.full_name = "Full name is required";
    if (!form.job_title.trim()) newErrors.job_title = "Job title is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    if (!form.salary || form.salary <= 0)
      newErrors.salary = "Salary must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Clean up optional empty strings to undefined
    const payload: EmployeeFormData = {
      ...form,
      department: form.department?.trim() || undefined,
      hired_on: form.hired_on || undefined,
    };

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: employee.id, data: payload });
        toast.success("Employee updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Employee created successfully");
      }
      onClose();
    } catch {
      toast.error(
        isEditing ? "Failed to update employee" : "Failed to create employee"
      );
    }
  };

  const updateField = <K extends keyof EmployeeFormData>(
    field: K,
    value: EmployeeFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Employee" : "Add Employee"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              placeholder="e.g. Jane Smith"
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name}</p>
            )}
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title *</Label>
            <div className="relative">
              <Input
                id="job_title"
                value={form.job_title}
                onChange={(e) => updateField("job_title", e.target.value)}
                placeholder="e.g. Software Engineer"
                list="job-titles-list"
              />
              <datalist id="job-titles-list">
                {jobTitles?.map((title) => (
                  <option key={title} value={title} />
                ))}
              </datalist>
            </div>
            {errors.job_title && (
              <p className="text-sm text-destructive">{errors.job_title}</p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={form.department || ""}
              onChange={(e) => updateField("department", e.target.value)}
              placeholder="e.g. Engineering"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="country">Country *</Label>
            <div className="relative">
              <Input
                id="country"
                value={form.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="e.g. United States"
                list="countries-list"
              />
              <datalist id="countries-list">
                {countries?.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country}</p>
            )}
          </div>

          {/* Salary + Currency (side by side) */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="salary">Salary *</Label>
              <Input
                id="salary"
                type="number"
                min="1"
                step="500"
                value={form.salary || ""}
                onChange={(e) =>
                  updateField("salary", parseFloat(e.target.value) || 0)
                }
                placeholder="e.g. 75000"
              />
              {errors.salary && (
                <p className="text-sm text-destructive">{errors.salary}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(val) => val && updateField("currency", val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Employment Type + Hired On (side by side) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Employment Type</Label>
              <Select
                value={form.employment_type}
                onValueChange={(val) =>
                  val && updateField("employment_type", val)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hired_on">Hire Date</Label>
              <Input
                id="hired_on"
                type="date"
                value={form.hired_on || ""}
                onChange={(e) => updateField("hired_on", e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Update Employee"
                  : "Add Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
