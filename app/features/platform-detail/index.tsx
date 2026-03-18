import { Clock, Tag } from "lucide-react";
import { Link } from "react-router";
import { Badge, type BadgeProps } from "~/components/badge";
import { Alert } from "~/components/alert";
import { ErrorState } from "~/components/error-state";
import { Spinner } from "~/components/spinner";
import type { Status } from "~/entities/types";
import { SyncAction } from "./sync-action";
import { SyncHistory } from "./sync-history";
import { useFetchPlatform } from "~/api/fetch-platform";

const STATUS_BADGE_MAP: Record<Status, BadgeProps["variant"]> = {
  Synced: "success",
  Syncing: "info",
  Conflict: "warning",
  Error: "error",
};

type DetailFieldProps = { label: string; value: React.ReactNode };

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

type PlatformDetailProps = { id: string };

export function PlatformDetail({ id }: PlatformDetailProps) {
  const { data, isLoading, isError, error } = useFetchPlatform(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        ← Back to list
      </Link>

      {isLoading && <Spinner size="lg" label="Loading platform..." className="py-16" />}

      {isError && (
        <ErrorState className="mt-4" message={error?.message ?? "Failed to load platform."} />
      )}

      {data && (
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row">
            <div className="flex min-h-48 w-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 sm:w-64 sm:min-h-full">
              <img
                src={data.data.avatar}
                alt={data.data.name}
                className="h-24 w-24 rounded-full border-4 border-white shadow-md"
              />
            </div>

            <div className="flex flex-1 flex-col gap-6 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-semibold text-gray-900">{data.data.name}</h1>
                  {data.data.description && (
                    <p className="text-sm text-gray-500">{data.data.description}</p>
                  )}
                </div>
                <SyncAction platform={data.data} />
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                <DetailField
                  label="Status"
                  value={
                    <Badge variant={STATUS_BADGE_MAP[data.data.status]}>{data.data.status}</Badge>
                  }
                />
                <DetailField
                  label="Version"
                  value={
                    <Badge variant="neutral" icon={<Tag size={12} />}>
                      {data.data.version}
                    </Badge>
                  }
                />
                <DetailField
                  label="Last Synced"
                  value={
                    <span className="flex items-center gap-1 text-gray-700">
                      <Clock size={12} className="text-gray-400" />
                      {new Date(data.data.lastSynced).toLocaleString()}
                    </span>
                  }
                />
                {data.data.lastSyncDuration != null && (
                  <DetailField label="Sync Duration" value={`${data.data.lastSyncDuration}s`} />
                )}
              </div>

              {data.data.status === "Conflict" && (
                <Alert
                  variant="warning"
                  title="Conflict Detected"
                  description="This integration has conflicting data that requires your attention."
                />
              )}
            </div>
          </div>
        </div>
      )}

      {data && (
        <div className="mt-8 flex flex-1 flex-col gap-6 p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Sync History</h1>
          <SyncHistory platformId={id} />
        </div>
      )}
    </div>
  );
}
