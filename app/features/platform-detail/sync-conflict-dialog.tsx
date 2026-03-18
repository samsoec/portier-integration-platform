import { Check, CheckCircleIcon, Circle, RefreshCw } from "lucide-react";
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

type SyncConflictDialogProps = {
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

export function SyncConflictDialog({
  platformName,
  platformChanges,
  isSubmitting = false,
  isSubmitted = false,
  error,
  onClose,
  onSubmit,
  onRetry,
}: SyncConflictDialogProps) {
  const [acceptedChangeIds, setAcceptedChangeIds] = useState<Record<string, unknown>>({});

  const numberAccepted = Object.keys(acceptedChangeIds).length;
  const isAllReviewed = platformChanges.length > 0 && numberAccepted === platformChanges.length;

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

  const handleAcceptAllNew = () => {
    const newAccepted = platformChanges.reduce(
      (acc, change) => {
        acc[change.id] = change.new_value;
        return acc;
      },
      {} as Record<string, unknown>
    );
    setAcceptedChangeIds(newAccepted);
  };

  const handleKeepAllCurrent = () => {
    const newAccepted = platformChanges.reduce(
      (acc, change) => {
        acc[change.id] = change.current_value;
        return acc;
      },
      {} as Record<string, unknown>
    );
    setAcceptedChangeIds(newAccepted);
  };

  const allNewSelected =
    platformChanges.length > 0 &&
    platformChanges.every(
      (change) =>
        Object.hasOwn(acceptedChangeIds, change.id) &&
        acceptedChangeIds[change.id] === change.new_value
    );
  const allCurrentSelected =
    platformChanges.length > 0 &&
    platformChanges.every(
      (change) =>
        Object.hasOwn(acceptedChangeIds, change.id) &&
        acceptedChangeIds[change.id] === change.current_value
    );

  const footer = (
    <>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      {platformChanges.length > 0 && !isSubmitted && (
        <Button
          variant="solid"
          disabled={!isAllReviewed || isSubmitting}
          onClick={() => onSubmit(acceptedChangeIds)}
          className="flex items-center gap-1.5"
        >
          {isSubmitting && <RefreshCw size={14} className="animate-spin" />}
          Confirm Resolve ({numberAccepted})
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

  return (
    <Dialog open title={`Resolve Conflicts — ${platformName}`} onClose={onClose} footer={footer}>
      {platformChanges.length > 0 && !isSubmitted && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{numberAccepted}</span> of{" "}
              {platformChanges.length} conflicts resolved
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleKeepAllCurrent}
                disabled={allCurrentSelected}
                className={cn("text-xs", allCurrentSelected && "opacity-50")}
              >
                Keep All Current
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAcceptAllNew}
                disabled={allNewSelected}
                className={cn("text-xs", allNewSelected && "opacity-50")}
              >
                Accept All New
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Click on the value you want to keep for each field.
          </p>

          <div className="flex flex-col gap-3">
            {platformChanges.map((change) => {
              const acceptedNew =
                Object.hasOwn(acceptedChangeIds, change.id) &&
                acceptedChangeIds[change.id] === change.new_value;
              const acceptedCurrent =
                Object.hasOwn(acceptedChangeIds, change.id) &&
                acceptedChangeIds[change.id] === change.current_value;
              const hasSelection = acceptedNew || acceptedCurrent;
              return (
                <div key={change.id} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      {hasSelection ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Circle size={14} className="text-gray-300" />
                      )}
                      <code className="text-sm font-medium text-gray-900">{change.field_name}</code>
                    </div>
                    <Badge variant={CHANGE_TYPE_BADGE[change.change_type]}>
                      {change.change_type}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleChange(change.id, change.current_value)}
                      className={cn(
                        "relative flex flex-col gap-1 rounded-lg border p-3 text-left transition-all",
                        acceptedCurrent
                          ? "border-blue-400 bg-blue-50 ring-2 ring-blue-400 shadow-sm"
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
                      onClick={() => handleToggleChange(change.id, change.new_value)}
                      className={cn(
                        "relative flex flex-col gap-1 rounded-lg border p-3 text-left transition-all",
                        acceptedNew
                          ? "border-violet-400 bg-violet-50 ring-2 ring-violet-400 shadow-sm"
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
                        className={cn(
                          "text-sm",
                          acceptedNew ? "font-medium text-gray-900" : "text-gray-700"
                        )}
                      >
                        {change.new_value ?? <span className="italic text-gray-400">—</span>}
                      </span>
                    </button>
                  </div>
                </div>
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
          <p className="text-lg font-semibold text-gray-900">Conflicts resolved successfully!</p>
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
