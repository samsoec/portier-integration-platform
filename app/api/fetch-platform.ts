import { useQuery } from "@tanstack/react-query";
import type { QueryOptions } from "./base";
import type { FetchPlatformResponse } from "~/entities/types";
import { HttpError, type APIError } from "~/utils/error";
import { PLATFORM_DATA } from "~/mocks";
import { FetchPlatformResponseSchema } from "~/entities/schemas";
import { validateResponse } from "~/utils/schema-validator";

export const fetchPlatform = async (id: string): Promise<FetchPlatformResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const platform = PLATFORM_DATA.data.find((p) => p.id === id);
  if (!platform) {
    throw new HttpError(404, `Platform with id "${id}" not found`);
  }

  return validateResponse(FetchPlatformResponseSchema, { data: platform });
};

export const useFetchPlatform = (id: string, options?: QueryOptions<FetchPlatformResponse>) => {
  return useQuery<FetchPlatformResponse, APIError>({
    queryKey: ["fetchPlatform", id],
    queryFn: () => fetchPlatform(id),
    ...options,
  });
};
