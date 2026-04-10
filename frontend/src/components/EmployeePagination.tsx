import type { PaginationMeta } from "@/types/employee";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {startRecord}–{endRecord}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">
          {total_count.toLocaleString()}
        </span>{" "}
        employees
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="px-2 text-sm text-muted-foreground">
          {current_page} / {total_pages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page >= total_pages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
