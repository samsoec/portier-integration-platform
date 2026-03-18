import { z } from "zod";
import type * as Schemas from "./schemas";

export type Status = z.infer<typeof Schemas.StatusSchema>;
export type Platform = z.infer<typeof Schemas.PlatformSchema>;

export type FetchPlatformsRequest = z.infer<typeof Schemas.FetchPlatformsRequestSchema>;
export type FetchPlatformsResponse = z.infer<typeof Schemas.FetchPlatformsResponseSchema>;
