import { describe, it, expect } from "vitest";
import { parseFieldName, groupChangesByEntity } from "../group-changes";
import type { SyncChange } from "~/entities/types";

const makeChange = (fieldName: string, id?: string): SyncChange => ({
  id: id ?? fieldName,
  field_name: fieldName,
  change_type: "UPDATE",
  current_value: "old",
  new_value: "new",
});

describe("parseFieldName", () => {
  it('parses "User.email" into entity and field', () => {
    expect(parseFieldName("User.email")).toEqual({ entity: "User", field: "email" });
  });

  it("parses field with underscore", () => {
    expect(parseFieldName("Door.battery_level")).toEqual({
      entity: "Door",
      field: "battery_level",
    });
  });

  it('returns entity "Other" for names without dot', () => {
    expect(parseFieldName("email")).toEqual({ entity: "Other", field: "email" });
  });

  it("uses first dot as separator when multiple dots exist", () => {
    expect(parseFieldName("User.nested.field")).toEqual({
      entity: "User",
      field: "nested.field",
    });
  });
});

describe("groupChangesByEntity", () => {
  it("groups changes by entity name", () => {
    const changes = [
      makeChange("User.email", "1"),
      makeChange("User.name", "2"),
      makeChange("Door.status", "3"),
    ];
    const result = groupChangesByEntity(changes);
    expect(result).toEqual([
      { entity: "User", changes: [changes[0], changes[1]] },
      { entity: "Door", changes: [changes[2]] },
    ]);
  });

  it("returns empty array for empty input", () => {
    expect(groupChangesByEntity([])).toEqual([]);
  });

  it("returns single group when all changes share the same entity", () => {
    const changes = [makeChange("User.email", "1"), makeChange("User.name", "2")];
    const result = groupChangesByEntity(changes);
    expect(result).toHaveLength(1);
    expect(result[0].entity).toBe("User");
    expect(result[0].changes).toHaveLength(2);
  });

  it('groups dotless field names under "Other"', () => {
    const changes = [makeChange("email", "1"), makeChange("phone", "2")];
    const result = groupChangesByEntity(changes);
    expect(result).toEqual([{ entity: "Other", changes }]);
  });
});
