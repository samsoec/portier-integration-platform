import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  HttpError,
  isHttpError,
  isValidationError,
  isServerError,
  isClientError,
  getHttpErrorCode,
} from "../error";

const makeZodError = () => {
  try {
    z.string().parse(123);
  } catch (e) {
    return e as z.ZodError;
  }
  throw new Error("unreachable");
};

describe("HttpError", () => {
  it("creates with correct code and message", () => {
    const err = new HttpError(404, "Not Found");
    expect(err.code).toBe(404);
    expect(err.message).toBe("Not Found");
  });

  it('has name "HttpError"', () => {
    expect(new HttpError(500, "err").name).toBe("HttpError");
  });

  it("extends Error", () => {
    expect(new HttpError(400, "err")).toBeInstanceOf(Error);
  });
});

describe("isHttpError", () => {
  it("returns true for HttpError", () => {
    expect(isHttpError(new HttpError(400, "bad"))).toBe(true);
  });

  it("returns false for ZodError", () => {
    expect(isHttpError(makeZodError())).toBe(false);
  });
});

describe("isValidationError", () => {
  it("returns true for ZodError", () => {
    expect(isValidationError(makeZodError())).toBe(true);
  });

  it("returns false for HttpError", () => {
    expect(isValidationError(new HttpError(400, "bad"))).toBe(false);
  });
});

describe("isServerError", () => {
  it("returns true for code 500", () => {
    expect(isServerError(new HttpError(500, "err"))).toBe(true);
  });

  it("returns true for code 503", () => {
    expect(isServerError(new HttpError(503, "err"))).toBe(true);
  });

  it("returns false for code 400", () => {
    expect(isServerError(new HttpError(400, "err"))).toBe(false);
  });

  it("returns false for ZodError", () => {
    expect(isServerError(makeZodError())).toBe(false);
  });
});

describe("isClientError", () => {
  it("returns true for code 400", () => {
    expect(isClientError(new HttpError(400, "err"))).toBe(true);
  });

  it("returns true for code 404", () => {
    expect(isClientError(new HttpError(404, "err"))).toBe(true);
  });

  it("returns false for code 500", () => {
    expect(isClientError(new HttpError(500, "err"))).toBe(false);
  });

  it("returns false for ZodError", () => {
    expect(isClientError(makeZodError())).toBe(false);
  });
});

describe("getHttpErrorCode", () => {
  it("returns code for HttpError", () => {
    expect(getHttpErrorCode(new HttpError(422, "err"))).toBe(422);
  });

  it("returns null for ZodError", () => {
    expect(getHttpErrorCode(makeZodError())).toBeNull();
  });
});
