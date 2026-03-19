import { ErrorState } from "~/components/error-state";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";
import { getHttpErrorCode, isClientError, isServerError, type APIError } from "~/utils/error";

type SyncErrorDialogProps = {
  error: APIError;
  onClose: () => void;
  onRetry: () => void;
};

export function SyncErrorDialog({ error, onClose, onRetry }: SyncErrorDialogProps) {
  function getErrorTitle(error: APIError) {
    if (isClientError(error)) return "Configuration Error";
    if (getHttpErrorCode(error) === 502) return "Gateway Error";
    if (isServerError(error)) return "Server Error";

    return "Sync Error";
  }

  function getErrorDescription(error: APIError) {
    if (isClientError(error))
      return "Possible missing configuration. Please check your integration settings before syncing.";
    if (getHttpErrorCode(error) === 502)
      return "Gateway error. The integration client server appears to be down. Please contact support.";
    if (isServerError(error))
      return "Internal server error. The sync service is experiencing issues. Please try again later.";

    return error.message || "An unexpected error occurred. Please try again.";
  }

  return (
    <Dialog
      open
      title="Sync Failed"
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="solid" onClick={onRetry}>
            Retry
          </Button>
        </>
      }
    >
      <ErrorState title={getErrorTitle(error)} message={getErrorDescription(error)} />
    </Dialog>
  );
}
