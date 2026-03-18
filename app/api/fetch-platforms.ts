import { useQuery } from "@tanstack/react-query";
import { FetchPlatformsResponseSchema } from "~/entities/schemas";
import type { FetchPlatformsRequest, FetchPlatformsResponse } from "~/entities/types";
import { PLATFORM_DATA } from "~/mocks";
import type { APIError } from "~/utils/error";
import { validateResponse } from "~/utils/schema-validator";
import type { QueryOptions } from "./base";

export const fetchPlatforms = async (
  params?: FetchPlatformsRequest
): Promise<FetchPlatformsResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const filtered = PLATFORM_DATA.data.filter((p) => {
    const matchesSearch =
      !params?.search ||
      p.name.toLowerCase().includes(params.search.toLowerCase()) ||
      p.description?.toLowerCase().includes(params.search.toLowerCase());

    const matchesStatus = !params?.status || p.status === params.status;

    return matchesSearch && matchesStatus;
  });

  return validateResponse(FetchPlatformsResponseSchema, { data: filtered });
};

export const useFetchPlatforms = (
  params?: FetchPlatformsRequest,
  options?: QueryOptions<FetchPlatformsResponse>
) => {
  return useQuery<FetchPlatformsResponse, APIError>({
    queryKey: ["fetchPlatforms", params],
    queryFn: () => fetchPlatforms(params),
    ...options,
  });
};
