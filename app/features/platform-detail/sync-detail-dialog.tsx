import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { Badge } from "~/components/badge";
import type { BadgeProps } from "~/components/badge";
import type { SyncChange, SyncHistoryEntry, ChangeType } from "~/entities/types";
import { EmptyState } from "~/components/empty-state";
import { cn } from "~/utils/classname";
import { useMemo } from "react";
import { groupChangesByEntity, parseFieldName } from "~/utils/group-changes";

const CHANGE_TYPE_BADGE: Record<ChangeType, BadgeProps["variant"]> = {
  UPDATE: "info",
  ADD: "success",
  DELETE: "error",
};

type SyncDetailDialogProps = {
  entry: SyncHistoryEntry;
  onClose: () => void;
};

export function SyncDetailDialog({ entry, onClose }: SyncDetailDialogProps) {
  const grouped = useMemo(() => groupChangesByEntity(entry.changes), [entry.changes]);
  const footer = (
    <Button variant="ghost" onClick={onClose}>
      Close
    </Button>
  );

  return (
    <Dialog open title={`Sync Details — ${entry.version}`} onClose={onClose} footer={footer}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span>{new Date(entry.timestamp).toLocaleString()}</span>
          <Badge variant={entry.source === "System" ? "info" : "neutral"}>{entry.source}</Badge>
          <span className="text-gray-900 font-medium">{entry.summary}</span>
        </div>

        {entry.changes.length === 0 && (
          <EmptyState title="No Changes" description="This sync did not result in any changes." />
        )}

        {entry.changes.length > 0 && (
          <div className="flex flex-col gap-4">
            {grouped.map((group) => (
              <div key={group.entity} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-400">
                    {group.entity}
                  </h3>
                  <p className="text-xs text-gray-500">{group.changes.length} changes conflict</p>
                </div>
                <div className="flex flex-col gap-2">
                  {group.changes.map((change) => {
                    const { field } = parseFieldName(change.field_name);
                    return (
                      <div
                        key={change.id}
                        className="flex flex-col gap-1.5 rounded-lg border border-gray-200 bg-gray-50/50 p-3"
                      >
                        <div className="flex items-center gap-2 justify-between">
                          <code className="text-sm font-medium text-gray-900">{field}</code>
                          <Badge variant={CHANGE_TYPE_BADGE[change.change_type]}>
                            {change.change_type}
                          </Badge>
                        </div>
                        <ChangeValue change={change} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
      <div
        className={cn(
          "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
          CONTAINER_STYLES[change.change_type]
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Current</span>
        <span className={cn("text-sm", TEXT_STYLES[change.change_type])}>
          {change.current_value ?? <span className="italic text-gray-400">—</span>}
        </span>
      </div>
      <div
        className={cn(
          "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
          CONTAINER_STYLES[change.change_type]
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">New</span>
        <span className={cn("text-sm", TEXT_STYLES[change.change_type])}>
          {change.new_value ?? <span className="italic text-gray-400">—</span>}
        </span>
      </div>
    </div>
  );
}
