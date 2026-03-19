import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncAction } from "../sync-action";
import { renderWithProviders } from "~/test-utils";
import type { Platform } from "~/entities/types";

const mockMutateAsync = vi.fn();

vi.mock("~/api/sync-platform", () => ({
  useSyncPlatform: vi.fn(() => ({
    data: undefined,
    mutateAsync: mockMutateAsync,
    error: null,
  })),
}));

const syncedPlatform: Platform = {
  id: "salesforce",
  avatar: "https://example.com/sf.png",
  name: "Salesforce",
  description: "CRM",
  status: "Synced",
  version: "1.0.0",
  lastSynced: "2026-03-01T00:00:00.000Z",
  lastSyncDuration: 120,
};

const conflictPlatform: Platform = {
  ...syncedPlatform,
  id: "stripe",
  name: "Stripe",
  status: "Conflict",
};

describe("SyncAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Sync button for synced platform", () => {
    renderWithProviders(<SyncAction platform={syncedPlatform} />);

    expect(screen.getByText("Sync")).toBeInTheDocument();
  });

  it("does not render Resolve Conflict button for non-Conflict status", () => {
    renderWithProviders(<SyncAction platform={syncedPlatform} />);

    expect(screen.queryByText("Resolve Conflict")).not.toBeInTheDocument();
  });

  it("renders Resolve Conflict button when status is Conflict", () => {
    renderWithProviders(<SyncAction platform={conflictPlatform} />);

    expect(screen.getByText("Resolve Conflict")).toBeInTheDocument();
  });

  it("calls mutateAsync with platform id when Sync is clicked", async () => {
    const mockResponse = {
      code: "200",
      message: "Success",
      data: {
        sync_approval: { application_name: "salesforce", changes: [] },
        metadata: {},
      },
    };
    mockMutateAsync.mockResolvedValue(mockResponse);
    const user = userEvent.setup();

    renderWithProviders(<SyncAction platform={syncedPlatform} />);
    await user.click(screen.getByText("Sync"));

    expect(mockMutateAsync).toHaveBeenCalledWith("salesforce");
  });

  it("shows Syncing text while sync is in progress", async () => {
    // Make the promise never resolve to keep the syncing state
    mockMutateAsync.mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();

    renderWithProviders(<SyncAction platform={syncedPlatform} />);
    await user.click(screen.getByText("Sync"));

    await waitFor(() => {
      expect(screen.getByText("Syncing...")).toBeInTheDocument();
    });
  });
});
