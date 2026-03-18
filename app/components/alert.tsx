import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/utils/classname";

type AlertVariant = "info" | "success" | "warning" | "error";

type AlertProps = {
  variant?: AlertVariant;
  title: ReactNode;
  description?: ReactNode;
};

const VARIANT_STYLES: Record<
  AlertVariant,
  { container: string; icon: string; title: string; description: string; action: string }
> = {
  info: {
    container: "border-blue-200 bg-blue-50",
    icon: "text-blue-500",
    title: "text-blue-900",
    description: "text-blue-700",
    action: "text-blue-900",
  },
  success: {
    container: "border-green-200 bg-green-50",
    icon: "text-green-500",
    title: "text-green-900",
    description: "text-green-700",
    action: "text-green-900",
  },
  warning: {
    container: "border-yellow-200 bg-yellow-50",
    icon: "text-yellow-600",
    title: "text-yellow-800",
    description: "text-yellow-700",
    action: "text-yellow-800",
  },
  error: {
    container: "border-red-200 bg-red-50",
    icon: "text-red-500",
    title: "text-red-900",
    description: "text-red-700",
    action: "text-red-900",
  },
};

const VARIANT_ICONS: Record<AlertVariant, React.FC<{ size: number; className: string }>> = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertTriangle,
};

export function Alert({ variant = "info", title, description }: AlertProps) {
  const styles = VARIANT_STYLES[variant];
  const Icon = VARIANT_ICONS[variant];

  return (
    <div className={cn("rounded-lg border px-4 py-3", styles.container)}>
      <div className="flex items-start gap-3">
        <Icon size={18} className={cn("mt-0.5 shrink-0", styles.icon)} />
        <div className="flex flex-col gap-1">
          <p className={cn("text-sm font-semibold", styles.title)}>{title}</p>
          {description && <p className={cn("text-sm", styles.description)}>{description}</p>}
        </div>
      </div>
    </div>
  );
}
