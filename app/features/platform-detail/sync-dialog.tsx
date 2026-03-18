import { CheckCircleIcon, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Badge } from "~/components/badge";
import type { BadgeProps } from "~/components/badge";
import { getHttpErrorCode, isClientError, isServerError, type APIError } from "~/utils/error";
import { ErrorState } from "~/components/error-state";
import type { SyncChange, ChangeType } from "~/entities/types";
import { useState } from "react";
import { cn } from "~/utils/classname";

const CHANGE_TYPE_BADGE: Record<ChangeType, BadgeProps["variant"]> = {
  UPDATE: "info",
  ADD: "success",
  DELETE: "error",
};

type SyncDialogProps = {
  platformName: string;
  platformChanges: SyncChange[];
  isSubmitting: boolean;
  isSubmitted: boolean;
  error?: APIError;
  onClose: () => void;
  onSubmit: (acceptedChangeIds: Record<string, unknown>) => void;
  onRetry: () => void;
};

function getErrorTitle(error: APIError | undefined) {
  if (!error) return "Sync Error";
  if (isClientError(error)) return "Configuration Error";
  if (isServerError(error)) return "Server Error";
  if (getHttpErrorCode(error) === 502) return "Gateway Error";
  return "Sync Error";
}

function getErrorDescription(error: APIError | undefined) {
  if (!error) return "An unexpected error occurred. Please try again.";
  if (isClientError(error))
    return "Possible missing configuration. Please check your integration settings before syncing.";
  if (isServerError(error))
    return "Internal server error. The sync service is experiencing issues. Please try again later.";
  if (getHttpErrorCode(error) === 502)
    return "Gateway error. The integration client server appears to be down. Please contact support.";
  return error.message || "An unexpected error occurred. Please try again.";
}

export function SyncDialog({
  platformName,
  platformChanges,
  isSubmitting = false,
  isSubmitted = false,
  error,
  onClose,
  onSubmit,
  onRetry,
}: SyncDialogProps) {
  const [acceptedChangeIds, setAcceptedChangeIds] = useState<Record<string, unknown>>({});

  const numberAccepted = Object.keys(acceptedChangeIds).length;
  const isSomeReviewed = numberAccepted > 0;

  const handleToggleChange = (changeId: string, changeValue: unknown) => {
    setAcceptedChangeIds((prev) => {
      const newState = { ...prev };
      if (Object.hasOwn(newState, changeId) && newState[changeId] === changeValue) {
        delete newState[changeId];
      } else {
        newState[changeId] = changeValue;
      }
      return newState;
    });
  };

  const handleAcceptAll = () => {
    const newAccepted = platformChanges.reduce(
      (acc, change) => {
        acc[change.id] = change.new_value;
        return acc;
      },
      {} as Record<string, unknown>
    );
    setAcceptedChangeIds(newAccepted);
  };

  const handleRejectAll = () => {
    setAcceptedChangeIds({});
  };

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      {platformChanges.length > 0 && !isSubmitted && (
        <Button
          variant="solid"
          disabled={!isSomeReviewed || isSubmitting}
          onClick={() => onSubmit(acceptedChangeIds)}
          className="flex items-center gap-1.5"
        >
          {isSubmitting && <RefreshCw size={14} className="animate-spin" />}
          Confirm Sync ({numberAccepted})
        </Button>
      )}
      {isSubmitted && (
        <Button variant="solid" onClick={onClose}>
          Done
        </Button>
      )}
      {error && !isSubmitted && (
        <Button variant="solid" onClick={onRetry}>
          Retry
        </Button>
      )}
    </>
  );

  const allSelected = numberAccepted === platformChanges.length;
  const noneSelected = numberAccepted === 0;

  return (
    <Dialog open title={`Review Changes — ${platformName}`} onClose={onClose} footer={footer}>
      {platformChanges.length > 0 && !isSubmitted && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{numberAccepted}</span> of{" "}
              {platformChanges.length} changes selected
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAcceptAll}
                disabled={allSelected}
                className="text-xs font-medium text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                Select All
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={handleRejectAll}
                disabled={noneSelected}
                className="text-xs font-medium text-blue-600 hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {platformChanges.map((change) => {
              const accepted = !!acceptedChangeIds[change.id];
              return (
                <label
                  key={change.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                    accepted ? "border-blue-200 bg-blue-50/50" : "border-gray-200 bg-gray-50/50"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={() => handleToggleChange(change.id, change.new_value)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-center gap-2 justify-between">
                      <code className="text-sm font-medium text-gray-900">{change.field_name}</code>
                      <Badge variant={CHANGE_TYPE_BADGE[change.change_type]}>
                        {change.change_type}
                      </Badge>
                    </div>
                    <ChangeValue change={change} />
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircleIcon size={24} className="text-green-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">Sync completed successfully!</p>
          <p className="text-sm text-gray-500">{numberAccepted} changes have been applied.</p>
        </div>
      )}

      {error && (
        <ErrorState
          className="py-4"
          title={getErrorTitle(error)}
          message={getErrorDescription(error)}
        />
      )}
    </Dialog>
  );
}

const TEXT_STYLES: Record<ChangeType, string> = {
  UPDATE: "text-gray-900",
  ADD: "text-green-700",
  DELETE: "text-red-600 line-through",
};

const CONTAINER_STYLES: Record<ChangeType, string> = {
  UPDATE: "border-blue-200 bg-blue-50/50",
  ADD: "border-green-300 bg-green-50/50",
  DELETE: "border-red-300 bg-red-50/50",
};

function ChangeValue({ change }: { change: SyncChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors border-gray-200 bg-gray-50/50">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Current</span>
        <span className={`text-sm ${TEXT_STYLES[change.change_type]}`}>
          {change.current_value ?? <span className="italic text-gray-400">—</span>}
        </span>
      </div>
      <div
        className={`flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors ${CONTAINER_STYLES[change.change_type]}`}
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">New</span>
        <span className={`text-sm ${TEXT_STYLES[change.change_type]}`}>
          {change.new_value ?? <span className="italic text-gray-400">—</span>}
        </span>
      </div>
    </div>
  );
}
