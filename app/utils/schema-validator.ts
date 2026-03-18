import { z } from "zod";

type OnValidationError = (error: z.ZodError, data: unknown) => void;

export function validateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  onError?: OnValidationError
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    if (onError) {
      onError(result.error, data);
    }
    throw result.error;
  }

  return result.data;
}
