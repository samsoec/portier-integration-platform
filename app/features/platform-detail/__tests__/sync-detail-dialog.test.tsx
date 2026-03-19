import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncDetailDialog } from "../sync-detail-dialog";
import { renderWithProviders } from "~/test-utils";
import type { SyncHistoryEntry } from "~/entities/types";

const entryWithChanges: SyncHistoryEntry = {
  id: "sh-1",
  timestamp: "2026-03-02T07:15:00.000Z",
  source: "External",
  version: "v1.8.3",
  status: "Success",
  summary: "Sync completed",
  changes: [
    {
      id: "c1",
      field_name: "User.email",
      change_type: "UPDATE",
      current_value: "old@example.com",
      new_value: "new@example.com",
    },
    {
      id: "c2",
      field_name: "User.phone",
      change_type: "ADD",
      new_value: "+1234567890",
    },
  ],
};

const entryNoChanges: SyncHistoryEntry = {
  id: "sh-2",
  timestamp: "2026-03-01T12:00:00.000Z",
  source: "System",
  version: "v1.0.0",
  status: "Success",
  summary: "No updates found",
  changes: [],
};

describe("SyncDetailDialog", () => {
  it("renders dialog title with version", () => {
    renderWithProviders(<SyncDetailDialog entry={entryWithChanges} onClose={() => {}} />);

    expect(screen.getByText("Sync Details — v1.8.3")).toBeInTheDocument();
  });

  it("renders summary and source badge", () => {
    renderWithProviders(<SyncDetailDialog entry={entryWithChanges} onClose={() => {}} />);

    expect(screen.getByText("Sync completed")).toBeInTheDocument();
    expect(screen.getByText("External")).toBeInTheDocument();
  });

  it("renders grouped changes by entity", () => {
    renderWithProviders(<SyncDetailDialog entry={entryWithChanges} onClose={() => {}} />);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("phone")).toBeInTheDocument();
  });

  it("renders change type badges", () => {
    renderWithProviders(<SyncDetailDialog entry={entryWithChanges} onClose={() => {}} />);

    expect(screen.getByText("UPDATE")).toBeInTheDocument();
    expect(screen.getByText("ADD")).toBeInTheDocument();
  });

  it("shows empty state when entry has no changes", () => {
    renderWithProviders(<SyncDetailDialog entry={entryNoChanges} onClose={() => {}} />);

    expect(screen.getByText("No Changes")).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<SyncDetailDialog entry={entryWithChanges} onClose={onClose} />);

    await user.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
