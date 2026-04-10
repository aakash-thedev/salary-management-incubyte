import type { PaginationMeta } from "@/types/employee";
import { Button } from "@/components/ui/button";

interface EmployeePaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function EmployeePagination({
  meta,
  onPageChange,
}: EmployeePaginationProps) {
  const { current_page, total_pages, total_count } = meta;

  if (total_pages <= 1) return null;

  const startRecord = (current_page - 1) * 25 + 1;
  const endRecord = Math.min(current_page * 25, total_count);

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm text-muted-foreground">
        Showing {startRecord}–{endRecord} of {total_count} employees
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {current_page} of {total_pages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page >= total_pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
