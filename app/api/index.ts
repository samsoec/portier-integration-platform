import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { ZodError } from "zod";
import { FetchPlatformsResponseSchema, PlatformSchema } from "~/entities/schemas";
import type { FetchPlatformsRequest, FetchPlatformsResponse, Platform } from "~/entities/types";
import { PLATFORM_DATA } from "~/mocks";
import { validateResponse } from "~/utils/schema-validator";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

type APIError = HttpError | ZodError;
type QueryOptions<T> = UseQueryOptions<T, APIError>;

export const useFetchPlatforms = (
  params?: FetchPlatformsRequest,
  options?: QueryOptions<FetchPlatformsResponse>
) => {
  return useQuery<FetchPlatformsResponse, APIError>({
    queryKey: ["fetchPlatforms", params],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock server-side filtering
      const filtered = PLATFORM_DATA.data.filter((p) => {
        const matchesSearch =
          !params?.search ||
          p.name.toLowerCase().includes(params.search.toLowerCase()) ||
          p.description?.toLowerCase().includes(params.search.toLowerCase());

        const matchesStatus = !params?.status || p.status === params.status;

        return matchesSearch && matchesStatus;
      });

      return validateResponse(FetchPlatformsResponseSchema, { data: filtered });
    },
    ...options,
  });
};

export const useFetchPlatform = (id: string, options?: QueryOptions<Platform>) => {
  return useQuery<Platform, APIError>({
    queryKey: ["fetchPlatform", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const platform = PLATFORM_DATA.data.find((p) => p.id === id);
      if (!platform) {
        throw new HttpError(404, `Platform with id "${id}" not found`);
      }

      return validateResponse(PlatformSchema, platform);
    },
    ...options,
  });
};
