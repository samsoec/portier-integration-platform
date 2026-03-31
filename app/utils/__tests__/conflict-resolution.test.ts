import { describe, it, expect } from "vitest";
import {
  isRequiredField,
  validateRequiredFields,
  REQUIRED_FIELDS,
  type ResolvedChange,
} from "../conflict-resolution";
import type { SyncChange } from "~/entities/types";

const makeChange = (
  overrides: Partial<SyncChange> & { id: string; field_name: string }
): SyncChange => ({
  change_type: "UPDATE",
  current_value: "old",
  new_value: "new",
  ...overrides,
});

describe("REQUIRED_FIELDS", () => {
  it("includes id and email", () => {
    expect(REQUIRED_FIELDS).toContain("id");
    expect(REQUIRED_FIELDS).toContain("email");
  });
});

describe("isRequiredField", () => {
  it("returns true for User.id", () => {
    expect(isRequiredField("User.id")).toBe(true);
  });

  it("returns true for User.email", () => {
    expect(isRequiredField("User.email")).toBe(true);
  });

  it("returns true for case-insensitive match User.Email", () => {
    expect(isRequiredField("User.Email")).toBe(true);
  });

  it("returns true for case-insensitive match User.ID", () => {
    expect(isRequiredField("User.ID")).toBe(true);
  });

  it("returns false for User.phone", () => {
    expect(isRequiredField("User.phone")).toBe(false);
  });

  it("returns false for User.name", () => {
    expect(isRequiredField("User.name")).toBe(false);
  });

  it("returns true for plain field name email (no entity)", () => {
    expect(isRequiredField("email")).toBe(true);
  });

  it("returns false for entity named email (email.something)", () => {
    expect(isRequiredField("email.something")).toBe(false);
  });
});

describe("validateRequiredFields", () => {
  it("returns valid when all required fields have values", () => {
    const changes: SyncChange[] = [
      makeChange({ id: "c1", field_name: "User.email", new_value: "a@b.com" }),
      makeChange({ id: "c2", field_name: "User.id", new_value: "123" }),
      makeChange({ id: "c3", field_name: "User.phone", new_value: "555" }),
    ];
    const accepted: Record<string, ResolvedChange> = {
      c1: { type: "new", value: "a@b.com" },
      c2: { type: "new", value: "123" },
      c3: { type: "new", value: "555" },
    };
    const result = validateRequiredFields(accepted, changes);
    expect(result.valid).toBe(true);
    expect(result.fieldErrors).toEqual({});
  });

  it("returns invalid when email is empty string", () => {
    const changes: SyncChange[] = [makeChange({ id: "c1", field_name: "User.email" })];
    const accepted: Record<string, ResolvedChange> = { c1: { type: "new", value: "" } };
    const result = validateRequiredFields(accepted, changes);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors).toHaveProperty("c1", "email is required and cannot be empty");
  });

  it("returns invalid when id is null", () => {
    const changes: SyncChange[] = [makeChange({ id: "c1", field_name: "User.id" })];
    const accepted: Record<string, ResolvedChange> = { c1: { type: "new", value: null } };
    const result = validateRequiredFields(accepted, changes);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors).toHaveProperty("c1", "id is required and cannot be empty");
  });

  it("returns invalid when required field is undefined (not selected)", () => {
    const changes: SyncChange[] = [makeChange({ id: "c1", field_name: "User.email" })];
    const accepted: Record<string, ResolvedChange> = {};
    const result = validateRequiredFields(accepted, changes);
    expect(result.valid).toBe(false);
    expect(result.fieldErrors).toHaveProperty("c1", "email is required and cannot be empty");
  });

  it("does not flag non-required fields with empty values", () => {
    const changes: SyncChange[] = [makeChange({ id: "c1", field_name: "User.phone" })];
    const accepted: Record<string, ResolvedChange> = { c1: { type: "new", value: "" } };
    const result = validateRequiredFields(accepted, changes);
    expect(result.valid).toBe(true);
    expect(result.fieldErrors).toEqual({});
  });

  it("returns multiple errors when multiple required fields are empty", () => {
    const changes: SyncChange[] = [
      makeChange({ id: "c1", field_name: "User.email" }),
      makeChange({ id: "c2", field_name: "User.id" }),
    ];
    const accepted: Record<string, ResolvedChange> = {
      c1: { type: "new", value: "" },
      c2: { type: "new", value: null },
    };
    const result = validateRequiredFields(accepted, changes);
    expect(result.valid).toBe(false);
    expect(Object.keys(result.fieldErrors)).toHaveLength(2);
  });

  it("returns valid for empty changes array", () => {
    const result = validateRequiredFields({}, []);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.fieldErrors)).toHaveLength(0);
    expect(result.fieldErrors).toEqual({});
  });

  it("returns fieldErrors keyed by change id for invalid fields", () => {
    const changes: SyncChange[] = [
      makeChange({ id: "c1", field_name: "User.email" }),
      makeChange({ id: "c2", field_name: "User.id" }),
      makeChange({ id: "c3", field_name: "User.phone" }),
    ];
    const accepted: Record<string, ResolvedChange> = {
      c1: { type: "new", value: "" },
      c2: { type: "new", value: null },
      c3: { type: "new", value: "" },
    };
    const result = validateRequiredFields(accepted, changes);
    expect(result.fieldErrors).toEqual({
      c1: "email is required and cannot be empty",
      c2: "id is required and cannot be empty",
    });
    expect(result.fieldErrors).not.toHaveProperty("c3");
  });

  it("does not include fieldErrors for valid required fields", () => {
    const changes: SyncChange[] = [makeChange({ id: "c1", field_name: "User.email" })];
    const accepted: Record<string, ResolvedChange> = {
      c1: { type: "custom", value: "valid@email.com" },
    };
    const result = validateRequiredFields(accepted, changes);
    expect(result.fieldErrors).toEqual({});
  });
});
