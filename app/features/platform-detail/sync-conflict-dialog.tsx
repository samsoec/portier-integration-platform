import { CheckCircleIcon, RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import type { SyncChange } from "~/entities/types";
import { useState, useMemo, useCallback } from "react";
import { cn } from "~/utils/classname";
import { groupChangesByEntity, parseFieldName } from "~/utils/group-changes";
import {
  validateRequiredFields,
  isRequiredField,
  type ResolvedChange,
} from "~/utils/conflict-resolution";
import { SyncConflictField } from "./sync-conflict-field";

type SyncConflictDialogProps = {
  platformName: string;
  platformChanges: SyncChange[];
  isSubmitting: boolean;
  isSubmitted: boolean;
  onClose: () => void;
  onSubmit: (acceptedChangeIds: Record<string, ResolvedChange>) => void;
};

export function SyncConflictDialog({
  platformName,
  platformChanges,
  isSubmitting = false,
  isSubmitted = false,
  onClose,
  onSubmit,
}: SyncConflictDialogProps) {
  const [acceptedChangeIds, setAcceptedChangeIds] = useState<Record<string, ResolvedChange>>({});

  const numberAccepted = Object.keys(acceptedChangeIds).length;
  const isAllReviewed = platformChanges.length > 0 && numberAccepted === platformChanges.length;

  const validation = useMemo(
    () => validateRequiredFields(acceptedChangeIds, platformChanges),
    [acceptedChangeIds, platformChanges]
  );

  const canConfirm = isAllReviewed && validation.valid;

  const handleSelect = useCallback(
    (changeId: string, changeValue: unknown, valueType: "current" | "new" | "custom") => {
      setAcceptedChangeIds((prev) => {
        if (changeValue === undefined) {
          const newState = { ...prev };
          delete newState[changeId];
          return newState;
        }
        return { ...prev, [changeId]: { type: valueType, value: changeValue } };
      });
    },
    []
  );

  const handleAcceptAllNew = () => {
    const newAccepted = platformChanges.reduce(
      (acc, change) => {
        acc[change.id] = { type: "new", value: change.new_value };
        return acc;
      },
      {} as Record<string, ResolvedChange>
    );
    setAcceptedChangeIds(newAccepted);
  };

  const handleKeepAllCurrent = () => {
    const newAccepted = platformChanges.reduce(
      (acc, change) => {
        acc[change.id] = { type: "current", value: change.current_value };
        return acc;
      },
      {} as Record<string, ResolvedChange>
    );
    setAcceptedChangeIds(newAccepted);
  };

  const allNewSelected =
    platformChanges.length > 0 &&
    platformChanges.every(
      (change) =>
        Object.hasOwn(acceptedChangeIds, change.id) &&
        acceptedChangeIds[change.id].value === change.new_value
    );
  const allCurrentSelected =
    platformChanges.length > 0 &&
    platformChanges.every(
      (change) =>
        Object.hasOwn(acceptedChangeIds, change.id) &&
        acceptedChangeIds[change.id].value === change.current_value
    );

  const grouped = useMemo(() => groupChangesByEntity(platformChanges), [platformChanges]);

  const footer = (
    <>
      {!isSubmitted && (
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      )}
      {platformChanges.length > 0 && !isSubmitted && (
        <Button
          variant="solid"
          disabled={!canConfirm || isSubmitting}
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
            Click on the value you want to keep for each field, or enter a custom value.
          </p>

          <div className="flex flex-col gap-5">
            {grouped.map((group) => (
              <div key={group.entity} className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    {group.entity}
                  </h3>
                  <p className="text-xs text-gray-500">{group.changes.length} changes conflict</p>
                </div>
                {group.changes.map((change) => (
                  <SyncConflictField
                    key={change.id}
                    name={change.id}
                    label={parseFieldName(change.field_name).field}
                    change={change}
                    value={acceptedChangeIds[change.id]?.value}
                    valueType={acceptedChangeIds[change.id]?.type}
                    onChange={handleSelect}
                    errorMessage={validation.fieldErrors[change.id]}
                    required={isRequiredField(change.field_name)}
                  />
                ))}
              </div>
            ))}
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
    </Dialog>
  );
}
