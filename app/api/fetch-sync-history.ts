import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "./base";
import type { APIError } from "~/utils/error";
import { SYNC_HISTORY_DATA } from "~/mocks";
import type { FetchSyncHistoryResponse } from "~/entities/types";

export const useFetchSyncHistory = (
  platformId: string,
  options?: QueryOptions<FetchSyncHistoryResponse>
) => {
  return useQuery<FetchSyncHistoryResponse, APIError>({
    queryKey: ["fetchSyncHistory", platformId],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { data: SYNC_HISTORY_DATA[platformId] ?? [] };
    },
    ...options,
  });
};
