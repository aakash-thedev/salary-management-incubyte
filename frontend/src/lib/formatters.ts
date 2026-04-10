/**
 * Format a salary value as a locale-aware currency string.
 * Salary comes as a string from Rails (decimal), so we parse it first.
 */
export function formatSalary(salary: string | number, currency = "USD"): string {
  const numericValue = typeof salary === "string" ? parseFloat(salary) : salary;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
}

/**
 * Format a date string (YYYY-MM-DD) to a readable format.
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return "—";

  return new Date(dateString + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format employment_type from snake_case to Title Case.
 */
export function formatEmploymentType(type: string): string {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
