import { Inbox } from "lucide-react";
import { cn } from "~/utils/classname";

type EmptyStateProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title = "No data found",
  description = "There's nothing here yet.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        {icon ?? <Inbox size={24} />}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
