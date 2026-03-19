import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncAction } from "../sync-action";
import { renderWithProviders } from "~/test-utils";
import type { Platform } from "~/entities/types";
import { useSyncPlatform } from "~/api/sync-platform";
import { HttpError } from "~/utils/error";

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

  it("shows error dialog when sync fails", async () => {
    const syncError = new HttpError(500, "Internal Server Error");
    mockMutateAsync.mockRejectedValue(syncError);
    vi.mocked(useSyncPlatform).mockReturnValue({
      data: undefined,
      mutateAsync: mockMutateAsync,
      error: syncError,
    } as unknown as ReturnType<typeof useSyncPlatform>);
    const user = userEvent.setup();

    renderWithProviders(<SyncAction platform={syncedPlatform} />);
    await user.click(screen.getByText("Sync"));

    await waitFor(() => {
      expect(screen.getByText("Sync Failed")).toBeInTheDocument();
    });
    expect(screen.getByText("Server Error")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("retries sync when Retry is clicked in error dialog", async () => {
    const syncError = new HttpError(500, "Internal Server Error");
    mockMutateAsync.mockRejectedValue(syncError);
    vi.mocked(useSyncPlatform).mockReturnValue({
      data: undefined,
      mutateAsync: mockMutateAsync,
      error: syncError,
    } as unknown as ReturnType<typeof useSyncPlatform>);
    const user = userEvent.setup();

    renderWithProviders(<SyncAction platform={syncedPlatform} />);
    await user.click(screen.getByText("Sync"));

    await waitFor(() => {
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Retry"));

    // mutateAsync called twice: initial sync + retry
    expect(mockMutateAsync).toHaveBeenCalledTimes(2);
  });

  it("returns to idle when Cancel is clicked in error dialog", async () => {
    const syncError = new HttpError(500, "Internal Server Error");
    mockMutateAsync.mockRejectedValue(syncError);
    vi.mocked(useSyncPlatform).mockReturnValue({
      data: undefined,
      mutateAsync: mockMutateAsync,
      error: syncError,
    } as unknown as ReturnType<typeof useSyncPlatform>);
    const user = userEvent.setup();

    renderWithProviders(<SyncAction platform={syncedPlatform} />);
    await user.click(screen.getByText("Sync"));

    await waitFor(() => {
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Cancel"));

    // Error dialog should be gone, back to idle with Sync button available
    await waitFor(() => {
      expect(screen.queryByText("Sync Failed")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Sync")).toBeInTheDocument();
  });
});
