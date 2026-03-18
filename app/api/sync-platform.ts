import { useMutation } from "@tanstack/react-query";
import type { MutationOptions } from "./base";
import type { SyncResponse } from "~/entities/types";
import { HttpError, type APIError } from "~/utils/error";
import { validateResponse } from "~/utils/schema-validator";
import { SyncResponseSchema } from "~/entities/schemas";

const SYNC_API_URL = "https://portier-takehometest.onrender.com/api/v1/data/sync";

export const syncPlatform = async (applicationId: string): Promise<SyncResponse> => {
  const url = new URL(SYNC_API_URL);
  url.searchParams.set("application_id", applicationId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    let message: string;
    try {
      const body = await response.json();
      message = body.message ?? `Sync failed with status ${response.status}`;
    } catch {
      message = `Sync failed with status ${response.status}`;
    }
    throw new HttpError(response.status, message);
  }

  const json = await response.json();
  return validateResponse(SyncResponseSchema, json);
};

export const useSyncPlatform = (options?: MutationOptions<SyncResponse, string>) => {
  return useMutation<SyncResponse, APIError, string>({
    mutationFn: (applicationId: string) => syncPlatform(applicationId),
    ...options,
  });
};
