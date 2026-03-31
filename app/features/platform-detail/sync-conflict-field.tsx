import { Check, Circle } from "lucide-react";
import { Badge } from "~/components/badge";
import type { BadgeProps } from "~/components/badge";
import type { SyncChange, ChangeType } from "~/entities/types";
import { cn } from "~/utils/classname";

const CHANGE_TYPE_BADGE: Record<ChangeType, BadgeProps["variant"]> = {
  UPDATE: "info",
  ADD: "success",
  DELETE: "error",
};

type ValueType = "current" | "new" | "custom";

export type SyncConflictFieldProps = {
  name: string;
  label: string;
  change: SyncChange;
  value?: unknown;
  valueType?: ValueType;
  onChange: (changeId: string, value: unknown, valueType: ValueType) => void;
  errorMessage?: string;
  required?: boolean;
};

export function SyncConflictField({
  name,
  label,
  change,
  value,
  valueType,
  onChange,
  errorMessage,
  required = false,
}: SyncConflictFieldProps) {
  const acceptedCurrent = valueType === "current";
  const acceptedNew = valueType === "new";
  const acceptedCustom = valueType === "custom";
  const hasSelection =
    (valueType === "custom" && value !== undefined) ||
    valueType === "current" ||
    valueType === "new";

  const customInputValue = valueType === "custom" && typeof value === "string" ? value : "";

  const handleSelectOption = (value: unknown, valueType: ValueType) => {
    onChange(name, value, valueType);
  };

  const handleCustomChange = (value: string) => {
    if (value) {
      onChange(name, value, "custom");
    } else {
      onChange(name, undefined, "custom");
    }
  };

  return (
    <div key={name} className="flex flex-col gap-2">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          {hasSelection ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Circle size={14} className="text-gray-300" />
          )}
          <code className="text-sm font-medium text-gray-900">{label}</code>
          {required && (
            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
              Required
            </span>
          )}
        </div>
        <Badge variant={CHANGE_TYPE_BADGE[change.change_type]}>{change.change_type}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleSelectOption(change.current_value, "current")}
          className={cn(
            "relative flex flex-col gap-1 rounded-lg border p-3 text-left transition-all",
            acceptedCurrent
              ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400 shadow-sm"
              : hasSelection
                ? "border-gray-200 bg-gray-50/30 opacity-50 hover:opacity-80 hover:border-blue-300"
                : "border-gray-200 bg-gray-50/50 hover:border-blue-300 hover:bg-blue-50/30"
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                acceptedCurrent ? "text-blue-600" : "text-gray-400"
              )}
            >
              Current
            </span>
            {acceptedCurrent && (
              <span className="flex items-center gap-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                <Check size={10} />
                Keeping
              </span>
            )}
          </div>
          <span
            className={cn(
              "text-sm",
              acceptedCurrent ? "font-medium text-gray-900" : "text-gray-700"
            )}
          >
            {change.current_value ?? <span className="italic text-gray-400">—</span>}
          </span>
        </button>
        <button
          type="button"
          onClick={() => handleSelectOption(change.new_value, "new")}
          className={cn(
            "relative flex flex-col gap-1 rounded-lg border p-3 text-left transition-all",
            acceptedNew
              ? "border-violet-400 bg-violet-50 ring-1 ring-violet-400 shadow-sm"
              : hasSelection
                ? "border-gray-200 bg-gray-50/30 opacity-50 hover:opacity-80 hover:border-violet-300"
                : "border-gray-200 bg-gray-50/50 hover:border-violet-300 hover:bg-violet-50/30"
          )}
        >
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                acceptedNew ? "text-violet-600" : "text-gray-400"
              )}
            >
              New
            </span>
            {acceptedNew && (
              <span className="flex items-center gap-1 rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-700">
                <Check size={10} />
                Accepting
              </span>
            )}
          </div>
          <span
            className={cn("text-sm", acceptedNew ? "font-medium text-gray-900" : "text-gray-700")}
          >
            {change.new_value ?? <span className="italic text-gray-400">—</span>}
          </span>
        </button>
      </div>
      <div
        className={cn(
          "flex flex-col gap-1 rounded-lg border p-3 transition-all",
          acceptedCustom
            ? "border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400 shadow-sm"
            : "border-gray-200 bg-gray-50/50"
        )}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wide",
              acceptedCustom ? "text-emerald-600" : "text-gray-400"
            )}
          >
            Custom
          </span>
          {acceptedCustom && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              <Check size={10} />
              Custom
            </span>
          )}
        </div>
        <input
          type="text"
          placeholder="Enter custom value"
          required={required}
          value={customInputValue}
          onChange={(e) => handleCustomChange(e.target.value)}
          className={cn(
            "w-full rounded border px-2 py-1 text-sm text-gray-900 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400",
            errorMessage ? "border-red-400" : "border-gray-300"
          )}
        />
      </div>
      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
}
