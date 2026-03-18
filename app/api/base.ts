import type { UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import type { APIError } from "~/utils/error";

export type QueryOptions<T> = Omit<UseQueryOptions<T, APIError>, "queryKey" | "queryFn">;
export type MutationOptions<T, V> = Omit<UseMutationOptions<T, APIError, V>, "mutationFn">;
