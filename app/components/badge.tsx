import { cn } from "~/utils/classname";

type variant = "neutral" | "info" | "success" | "warning" | "error";

const STATUS_STYLES: Record<variant, string> = {
  neutral: "bg-gray-100 text-gray-700 border border-gray-400",
  info: "bg-blue-100 text-blue-700 border border-blue-400",
  success: "bg-green-100 text-green-700 border border-green-400",
  warning: "bg-yellow-100 text-yellow-700 border border-yellow-400",
  error: "bg-red-100 text-red-700 border border-red-400",
};

export type BadgeProps = {
  variant: variant;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Badge({ variant, icon, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        STATUS_STYLES[variant],
        className
      )}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
