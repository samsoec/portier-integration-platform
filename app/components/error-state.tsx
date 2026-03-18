import { AlertCircle } from "lucide-react";
import { cn } from "~/utils/classname";

type ErrorStateProps = {
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-red-200 bg-red-50 px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
        <AlertCircle size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-red-700">{title}</p>
        <p className="mt-1 text-sm text-red-500">{message}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
