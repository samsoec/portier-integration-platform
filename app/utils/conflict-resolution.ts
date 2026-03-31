import type { SyncChange } from "~/entities/types";
import { parseFieldName } from "~/utils/group-changes";

export type ResolutionOption = "current" | "new" | "custom";

export type ResolvedChange = {
  type: ResolutionOption;
  value: unknown;
};

export const REQUIRED_FIELDS = ["id", "email"];

export function isRequiredField(fieldName: string): boolean {
  const { field } = parseFieldName(fieldName);
  return REQUIRED_FIELDS.includes(field.toLowerCase());
}

export function validateRequiredFields(
  acceptedChangeIds: Record<string, ResolvedChange>,
  changes: SyncChange[]
): { valid: boolean; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  for (const change of changes) {
    if (isRequiredField(change.field_name)) {
      const resolved = acceptedChangeIds[change.id];
      const value = resolved?.value;
      console.log("Validating required field:", change.field_name, "with value:", value);
      if (value === undefined || value === null || value === "") {
        const { field } = parseFieldName(change.field_name);
        const msg = `${field} is required and cannot be empty`;
        fieldErrors[change.id] = msg;
      }
    }
  }
  return { valid: Object.keys(fieldErrors).length === 0, fieldErrors };
}
