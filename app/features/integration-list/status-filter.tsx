import { cn } from "~/utils/classname";
import type { Status } from "~/entities/types";

const ALL_STATUSES: Status[] = ["Synced", "Syncing", "Conflict", "Error"];

const STATUS_ACTIVE_STYLES: Record<Status, string> = {
  Synced: "bg-green-100 text-green-700 border-green-300",
  Syncing: "bg-blue-100 text-blue-700 border-blue-300",
  Conflict: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Error: "bg-red-100 text-red-700 border-red-300",
};

type StatusFilterProps = {
  value: Status | null;
  onChange: (status: Status | null) => void;
  className?: string;
};

export function StatusFilter({ value, onChange, className }: StatusFilterProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <button
        onClick={() => onChange(null)}
        className={cn(
          "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
          value === null
            ? "border-gray-400 bg-gray-100 text-gray-700"
            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
        )}
      >
        All
      </button>
      {ALL_STATUSES.map((status) => (
        <button
          key={status}
          onClick={() => onChange(value === status ? null : status)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
            value === status
              ? STATUS_ACTIVE_STYLES[status]
              : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
          )}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
