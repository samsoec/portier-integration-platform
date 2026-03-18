import { z } from "zod";

export const StatusSchema = z.enum(["Synced", "Syncing", "Conflict", "Error"]);

export const PlatformSchema = z.object({
  id: z.string(),
  avatar: z.string(),
  name: z.string(),
  description: z.string().optional(),
  status: StatusSchema,
  version: z.string(),
  lastSynced: z.iso.datetime(),
  lastSyncDuration: z.number().optional(),
});

export const FetchPlatformsRequestSchema = z.object({
  search: z.string().optional(),
  status: StatusSchema.optional(),
});

export const FetchPlatformsResponseSchema = z.object({
  data: z.array(PlatformSchema),
});
