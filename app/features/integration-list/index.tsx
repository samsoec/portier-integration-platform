import { useFetchPlatforms } from "~/api";
import { EmptyState } from "~/components/empty-state";
import { ErrorState } from "~/components/error-state";
import { PlatformCard } from "~/features/integration-list/platform-card";
import { SearchInput } from "~/components/search-input";
import { Spinner } from "~/components/spinner";
import { StatusFilter } from "~/features/integration-list/status-filter";
import type { Status } from "~/entities/types";
import { useFilter } from "~/utils/filter";

export const IntegrationList = () => {
  const [filter, setFilter] = useFilter<{ search: string; status: Status | null }>({
    search: "",
    status: null,
  });

  const { data, isLoading, isError, error } = useFetchPlatforms({
    search: filter.search.trim() || undefined,
    status: filter.status || undefined,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Integration List</h1>
      <p className="mb-6 text-gray-600">Manage and monitor your connected integrations</p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={filter.search}
          onChange={(value) => setFilter("search", value)}
          debounce={300}
        />
        <StatusFilter value={filter.status} onChange={(value) => setFilter("status", value)} />
      </div>

      {isLoading && <Spinner size="lg" label="Loading platforms..." className="py-16" />}

      {isError && <ErrorState message={error?.message ?? "Failed to load platforms."} />}

      {data && data.data.length === 0 && !isLoading && (
        <EmptyState
          title="No platforms found"
          description={
            filter.search || filter.status
              ? "No platforms match your search or filter."
              : "There are no integration platforms to display yet."
          }
        />
      )}

      {data && data.data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      )}
    </div>
  );
};
