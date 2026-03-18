import type { SyncHistoryEntry } from "~/entities/types";

export const PLATFORM_DATA = {
  data: [
    {
      id: "1",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=PA",
      name: "Platform A",
      description: "Core integration hub for syncing data across internal services.",
      status: "Synced",
      applicationId: "salesforce",
      lastSynced: new Date().toISOString(),
      lastSyncDuration: 120,
      version: "1.0.0",
    },
    {
      id: "2",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=PB",
      name: "Platform B",
      description: "Real-time message broker for event-driven pipelines.",
      status: "Syncing",
      applicationId: "stripe",
      lastSynced: new Date().toISOString(),
      lastSyncDuration: 45,
      version: "2.0.0",
    },
    {
      id: "3",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=PC",
      name: "Platform C",
      description: "Legacy ERP connector with scheduled batch sync.",
      status: "Conflict",
      applicationId: "stripe",
      lastSynced: new Date(Date.now() - 3600000).toISOString(),
      lastSyncDuration: 300,
      version: "0.9.4",
    },
    {
      id: "4",
      avatar: "https://api.dicebear.com/9.x/initials/svg?seed=PD",
      name: "Platform D",
      description: "External payment gateway integration.",
      status: "Error",
      applicationId: "slack",
      lastSynced: new Date(Date.now() - 7200000).toISOString(),
      version: "3.1.2",
    },
  ],
};

export const SYNC_HISTORY_DATA: Record<string, SyncHistoryEntry[]> = {
  "1": [
    {
      id: "sh-1a",
      timestamp: "2026-03-02T07:15:00.000Z",
      source: "External",
      version: "v1.8.3",
      status: "Conflict",
      summary: "Sync conflict detected",
      changes: [
        {
          id: "c1",
          field_name: "email",
          change_type: "UPDATE",
          current_value: "old@example.com",
          new_value: "new@example.com",
        },
        { id: "c2", field_name: "phone", change_type: "ADD", new_value: "+1234567890" },
      ],
    },
    {
      id: "sh-1b",
      timestamp: "2026-03-02T03:15:00.000Z",
      source: "System",
      version: "v1.8.2",
      status: "Success",
      summary: "Automatic sync completed",
      changes: [
        {
          id: "c3",
          field_name: "address",
          change_type: "UPDATE",
          current_value: "123 Old St",
          new_value: "456 New Ave",
        },
      ],
    },
  ],
  "2": [
    {
      id: "sh-2a",
      timestamp: "2026-03-01T12:00:00.000Z",
      source: "Manual",
      version: "v2.0.0",
      status: "Success",
      summary: "Manual sync triggered by admin",
      changes: [
        {
          id: "c4",
          field_name: "plan",
          change_type: "UPDATE",
          current_value: "free",
          new_value: "pro",
        },
        {
          id: "c5",
          field_name: "seats",
          change_type: "UPDATE",
          current_value: "5",
          new_value: "25",
        },
      ],
    },
  ],
  "3": [
    {
      id: "sh-3a",
      timestamp: "2026-03-02T10:30:00.000Z",
      source: "External",
      version: "v0.9.4",
      status: "Conflict",
      summary: "Conflicting field updates from ERP",
      changes: [
        {
          id: "c6",
          field_name: "inventory_count",
          change_type: "UPDATE",
          current_value: "100",
          new_value: "85",
        },
        { id: "c7", field_name: "warehouse_id", change_type: "DELETE", current_value: "WH-003" },
      ],
    },
    {
      id: "sh-3b",
      timestamp: "2026-02-28T18:00:00.000Z",
      source: "System",
      version: "v0.9.3",
      status: "Success",
      summary: "Scheduled batch sync completed",
      changes: [{ id: "c8", field_name: "sku", change_type: "ADD", new_value: "SKU-9921" }],
    },
  ],
  "4": [
    {
      id: "sh-4a",
      timestamp: "2026-03-01T09:00:00.000Z",
      source: "System",
      version: "v3.1.2",
      status: "Failed",
      summary: "Sync failed due to gateway timeout",
      changes: [],
    },
  ],
};
