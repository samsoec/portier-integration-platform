import { RefreshCw, ShieldAlert } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Platform } from "~/entities/types";
import { SyncDialog } from "./sync-dialog";
import { useMachine } from "@xstate/react";
import { syncMachine } from "~/machines/sync.machine";
import { useSyncPlatform } from "~/api/sync-platform";
import { SyncConflictDialog } from "./sync-conflict-dialog";
import { SyncErrorDialog } from "./sync-error-dialog";

type SyncActionProps = {
  platform: Platform;
};

export function SyncAction({ platform }: SyncActionProps) {
  const { data: syncData, mutateAsync: syncPlatform, error: syncError } = useSyncPlatform();

  const [state, send] = useMachine(syncMachine, {
    services: {
      sync: (ctx, evt) => syncPlatform(evt.applicationId),
      syncConflict: () => new Promise((resolve) => setTimeout(resolve, 1500)),
      syncChanges: () => new Promise((resolve) => setTimeout(resolve, 1500)),
    },
    guards: {
      isConflict: (ctx, evt) => {
        // We check if the response contains changes and the platform status is "Conflict" to determine if it's a conflict.
        // In a real implementation, you might want to have a more explicit way to determine this.
        if ("data" in evt) {
          const changes = evt.data.data.sync_approval.changes;
          return changes.length > 0 && platform.status === "Conflict";
        }
        return false;
      },
    },
  });

  const changes = syncData?.data.sync_approval.changes || [];
  const isConflict = platform.status === "Conflict";

  return (
    <>
      <div className="flex items-center gap-2">
        {/**
         * In a real application, this button only used for conflicts occured on last sync version
         */}
        {isConflict && (
          <Button
            variant="outlined"
            size="sm"
            onClick={() => send({ type: "SYNC", applicationId: platform.id })}
            className="flex items-center gap-1.5 border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            <ShieldAlert size={14} />
            Resolve Conflict
          </Button>
        )}
        {/**
         * So this button will do sync to another platform version and skipping last version conflict occured
         */}
        <Button
          variant="solid"
          size="sm"
          disabled={state.matches("syncing")}
          onClick={() => send({ type: "SYNC", applicationId: platform.id })}
          className="flex items-center gap-1.5"
        >
          <RefreshCw size={14} className={state.matches("syncing") ? "animate-spin" : ""} />
          {state.matches("syncing") ? "Syncing..." : "Sync"}
        </Button>
      </div>

      {state.matches("previewingConflict") && (
        <SyncConflictDialog
          platformName={platform.name}
          platformChanges={changes}
          isSubmitting={state.matches("previewingConflict.submitting")}
          isSubmitted={state.matches("previewingConflict.success")}
          onClose={() => send({ type: "CLOSE" })}
          onSubmit={() => send({ type: "CONFIRM" })}
        />
      )}

      {state.matches("previewingChanges") && (
        <SyncDialog
          platformName={platform.name}
          platformChanges={changes}
          isSubmitting={state.matches("previewingChanges.submitting")}
          isSubmitted={state.matches("previewingChanges.success")}
          onClose={() => send({ type: "CLOSE" })}
          onSubmit={() => send({ type: "CONFIRM" })}
        />
      )}

      {state.matches("error") && (
        <SyncErrorDialog
          error={syncError!}
          onClose={() => send({ type: "CLOSE" })}
          onRetry={() => send({ type: "RETRY", applicationId: platform.id })}
        />
      )}
    </>
  );
}
