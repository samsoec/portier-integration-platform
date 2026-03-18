import { Link } from "react-router";
import { useFetchPlatform } from "~/api";
import { ErrorState } from "~/components/error-state";
import { Spinner } from "~/components/spinner";
import type { Platform } from "~/entities/types";
import { cn } from "~/utils/classname";

const STATUS_STYLES: Record<Platform["status"], string> = {
  Synced: "bg-green-100 text-green-700",
  Syncing: "bg-blue-100 text-blue-700",
  Conflict: "bg-orange-100 text-orange-700",
  Error: "bg-red-100 text-red-700",
};

type DetailRowProps = { label: string; value: React.ReactNode };

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center">
      <dt className="w-40 shrink-0 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
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
        <div className="mt-4 rounded-md border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{data.name}</h1>
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium",
                STATUS_STYLES[data.status]
              )}
            >
              {data.status}
            </span>
          </div>

          <dl className="divide-y divide-gray-100">
            <DetailRow label="ID" value={data.id} />
            <DetailRow label="Version" value={data.version} />
            <DetailRow label="Last Synced" value={new Date(data.lastSynced).toLocaleString()} />
          </dl>
        </div>
      )}
    </div>
  );
}
