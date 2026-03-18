import { z } from "zod";

export class HttpError extends Error {
  constructor(
    public readonly code: number,
    message: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export type APIError = HttpError | z.ZodError;

export const isHttpError = (error: APIError): error is HttpError => {
  return error instanceof HttpError;
};

export const isValidationError = (error: APIError): error is z.ZodError => {
  return error instanceof z.ZodError;
};

export const isServerError = (error: APIError): boolean => {
  return isHttpError(error) && error.code >= 500 && error.code < 600;
};

export const isClientError = (error: APIError): boolean => {
  return isHttpError(error) && error.code >= 400 && error.code < 500;
};

export const getHttpErrorCode = (error: APIError): number | null => {
  return isHttpError(error) ? error.code : null;
};
