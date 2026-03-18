import type { SyncChange } from "~/entities/types";

export type GroupedChanges = { entity: string; changes: SyncChange[] }[];

export function parseFieldName(fieldName: string): { entity: string; field: string } {
  const dotIndex = fieldName.indexOf(".");
  if (dotIndex === -1) return { entity: "Other", field: fieldName };
  return { entity: fieldName.slice(0, dotIndex), field: fieldName.slice(dotIndex + 1) };
}

export function groupChangesByEntity(changes: SyncChange[]): GroupedChanges {
  const map = new Map<string, SyncChange[]>();
  for (const change of changes) {
    const { entity } = parseFieldName(change.field_name);
    const group = map.get(entity);
    if (group) {
      group.push(change);
    } else {
      map.set(entity, [change]);
    }
  }
  return Array.from(map, ([entity, changes]) => ({ entity, changes }));
}
