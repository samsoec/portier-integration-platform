import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { validateResponse } from "../schema-validator";

const TestSchema = z.object({
  name: z.string(),
  age: z.number(),
});

describe("validateResponse", () => {
  it("returns parsed data for valid input", () => {
    const data = { name: "Alice", age: 30 };
    expect(validateResponse(TestSchema, data)).toEqual(data);
  });

  it("throws ZodError for invalid input", () => {
    expect(() => validateResponse(TestSchema, { name: 123 })).toThrow(z.ZodError);
  });

  it("calls onError callback on failure", () => {
    const onError = vi.fn();
    const badData = { name: 123 };

    expect(() => validateResponse(TestSchema, badData, onError)).toThrow();
    expect(onError).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledWith(expect.any(z.ZodError), badData);
  });

  it("does not call onError on success", () => {
    const onError = vi.fn();
    validateResponse(TestSchema, { name: "Alice", age: 30 }, onError);
    expect(onError).not.toHaveBeenCalled();
  });

  it("strips unknown fields", () => {
    const result = validateResponse(TestSchema, { name: "Alice", age: 30, extra: true });
    expect(result).toEqual({ name: "Alice", age: 30 });
  });
});
