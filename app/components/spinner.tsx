import { cn } from "~/utils/classname";

type SpinnerSize = "sm" | "md" | "lg";

const SIZE_STYLES: Record<SpinnerSize, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

type SpinnerProps = {
  size?: SpinnerSize;
  label?: string;
  className?: string;
};

export function Spinner({ size = "md", label = "Loading...", className }: SpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        role="status"
        aria-label={label}
        className={cn(
          "animate-spin rounded-full border-gray-200 border-t-blue-500",
          SIZE_STYLES[size]
        )}
      />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}
