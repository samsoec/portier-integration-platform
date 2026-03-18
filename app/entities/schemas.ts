import { z } from "zod";

export const StatusSchema = z.enum(["Synced", "Syncing", "Conflict", "Error"]);

export const ChangeTypeSchema = z.enum(["UPDATE", "ADD", "DELETE"]);

export const SyncSourceSchema = z.enum(["System", "External", "Manual"]);

export const SyncStatusSchema = z.enum(["Success", "Conflict", "Failed"]);

export const PlatformSchema = z.object({
  id: z.string(),
  avatar: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: StatusSchema,
  version: z.string(),
  lastSynced: z.iso.datetime(),
  lastSyncDuration: z.number().optional(),
  applicationId: z.string(),
});

export const FetchPlatformsRequestSchema = z.object({
  search: z.string().optional(),
  status: StatusSchema.optional(),
});

export const FetchPlatformsResponseSchema = z.object({
  data: z.array(PlatformSchema),
});

export const FetchPlatformResponseSchema = z.object({
  data: PlatformSchema,
});

export const SyncChangeSchema = z.object({
  id: z.string(),
  field_name: z.string(),
  change_type: ChangeTypeSchema,
  current_value: z.string().optional(),
  new_value: z.string().optional(),
});

export const SyncApprovalSchema = z.object({
  application_name: z.string(),
  changes: z.array(SyncChangeSchema),
});

export const SyncResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    sync_approval: SyncApprovalSchema,
    metadata: z.record(z.string(), z.unknown()),
  }),
});

export const SyncHistoryEntrySchema = z.object({
  id: z.string(),
  timestamp: z.iso.datetime(),
  source: SyncSourceSchema,
  version: z.string(),
  status: SyncStatusSchema,
  summary: z.string(),
  changes: z.array(SyncChangeSchema),
});

export const FetchSyncHistoryResponseSchema = z.object({
  data: z.array(SyncHistoryEntrySchema),
});
