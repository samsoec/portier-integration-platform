import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/badge";
import type { BadgeProps } from "~/components/badge";
import { Spinner } from "~/components/spinner";
import { Table } from "~/components/ui/table";
import { useFetchSyncHistory } from "~/api/fetch-sync-history";
import { SyncDetailDialog } from "./sync-detail-dialog";
import { EmptyState } from "~/components/empty-state";
import type { SyncHistoryEntry, SyncStatus } from "~/entities/types";
import { Button } from "~/components/ui/button";

const STATUS_BADGE: Record<SyncStatus, BadgeProps["variant"]> = {
  Success: "success",
  Conflict: "warning",
  Failed: "error",
};

const SOURCE_BADGE: Record<string, BadgeProps["variant"]> = {
  System: "info",
  External: "neutral",
  Manual: "neutral",
};

type SyncHistoryProps = {
  platformId: string;
};

export function SyncHistory({ platformId }: SyncHistoryProps) {
  const { data, isLoading } = useFetchSyncHistory(platformId);
  const [selectedEntry, setSelectedEntry] = useState<SyncHistoryEntry | null>(null);

  if (isLoading) {
    return <Spinner label="Loading sync history..." className="py-8" />;
  }

  const entries = data?.data ?? [];

  if (entries.length === 0) {
    return (
      <EmptyState title="No Sync History" description="This platform has not been synced yet." />
    );
  }

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.Head>Timestamp</Table.Head>
            <Table.Head>Source</Table.Head>
            <Table.Head>Version</Table.Head>
            <Table.Head>Status</Table.Head>
            <Table.Head>Summary</Table.Head>
            <Table.Head className="text-right">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {entries.map((entry) => (
            <Table.Row key={entry.id}>
              <Table.Cell className="whitespace-nowrap text-sm">
                {new Date(entry.timestamp).toLocaleString()}
              </Table.Cell>
              <Table.Cell>
                <Badge variant={SOURCE_BADGE[entry.source]}>{entry.source}</Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge variant="neutral">{entry.version}</Badge>
              </Table.Cell>
              <Table.Cell>
                <Badge variant={STATUS_BADGE[entry.status]}>{entry.status}</Badge>
              </Table.Cell>
              <Table.Cell className="text-sm">{entry.summary}</Table.Cell>
              <Table.Cell className="text-right">
                <Button
                  onClick={() => setSelectedEntry(entry)}
                  size="sm"
                  variant="ghost"
                  className="inline-flex items-center gap-1"
                >
                  <EyeIcon size={14} />
                  View Changes
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {selectedEntry && (
        <SyncDetailDialog entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
      )}
    </>
  );
}
