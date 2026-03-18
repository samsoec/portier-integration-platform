import { z } from "zod";
import type * as Schemas from "./schemas";

export type Status = z.infer<typeof Schemas.StatusSchema>;
export type Platform = z.infer<typeof Schemas.PlatformSchema>;

export type FetchPlatformsRequest = z.infer<typeof Schemas.FetchPlatformsRequestSchema>;
export type FetchPlatformsResponse = z.infer<typeof Schemas.FetchPlatformsResponseSchema>;
export type FetchPlatformResponse = z.infer<typeof Schemas.FetchPlatformResponseSchema>;

export type ChangeType = z.infer<typeof Schemas.ChangeTypeSchema>;
export type SyncChange = z.infer<typeof Schemas.SyncChangeSchema>;
export type SyncApproval = z.infer<typeof Schemas.SyncApprovalSchema>;
export type SyncResponse = z.infer<typeof Schemas.SyncResponseSchema>;
