import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncHistory } from "../sync-history";
import { renderWithProviders } from "~/test-utils";

vi.mock("~/api/fetch-sync-history", () => ({
  useFetchSyncHistory: vi.fn(),
}));

import { useFetchSyncHistory } from "~/api/fetch-sync-history";
const mockUseFetchSyncHistory = vi.mocked(useFetchSyncHistory);

const mockEntries = [
  {
    id: "sh-1",
    timestamp: "2026-03-02T07:15:00.000Z",
    source: "External" as const,
    version: "v1.8.3",
    status: "Conflict" as const,
    summary: "Sync conflict detected",
    changes: [
      {
        id: "c1",
        field_name: "User.email",
        change_type: "UPDATE" as const,
        current_value: "old@example.com",
        new_value: "new@example.com",
      },
    ],
  },
  {
    id: "sh-2",
    timestamp: "2026-03-01T12:00:00.000Z",
    source: "System" as const,
    version: "v1.8.2",
    status: "Success" as const,
    summary: "Automatic sync completed",
    changes: [],
  },
];

const mockEmptyEntries: typeof mockEntries = [];

describe("SyncHistory", () => {
  it("shows spinner while loading", () => {
    mockUseFetchSyncHistory.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useFetchSyncHistory>);

    renderWithProviders(<SyncHistory platformId="salesforce" />);

    expect(screen.getByText("Loading sync history...")).toBeInTheDocument();
  });

  it("shows empty state when no entries exist", () => {
    mockUseFetchSyncHistory.mockReturnValue({
      data: { data: mockEmptyEntries },
      isLoading: false,
    } as ReturnType<typeof useFetchSyncHistory>);

    renderWithProviders(<SyncHistory platformId="salesforce" />);

    expect(screen.getByText("No Sync History")).toBeInTheDocument();
  });

  it("renders table rows for each history entry", () => {
    mockUseFetchSyncHistory.mockReturnValue({
      data: { data: mockEntries },
      isLoading: false,
    } as ReturnType<typeof useFetchSyncHistory>);

    renderWithProviders(<SyncHistory platformId="salesforce" />);

    expect(screen.getByText("Sync conflict detected")).toBeInTheDocument();
    expect(screen.getByText("Automatic sync completed")).toBeInTheDocument();
    expect(screen.getByText("v1.8.3")).toBeInTheDocument();
    expect(screen.getByText("v1.8.2")).toBeInTheDocument();
  });

  it("renders status and source badges", () => {
    mockUseFetchSyncHistory.mockReturnValue({
      data: { data: mockEntries },
      isLoading: false,
    } as ReturnType<typeof useFetchSyncHistory>);

    renderWithProviders(<SyncHistory platformId="salesforce" />);

    expect(screen.getByText("Conflict")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("External")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("opens SyncDetailDialog when View Changes is clicked", async () => {
    const user = userEvent.setup();
    mockUseFetchSyncHistory.mockReturnValue({
      data: { data: mockEntries },
      isLoading: false,
    } as ReturnType<typeof useFetchSyncHistory>);

    renderWithProviders(<SyncHistory platformId="salesforce" />);

    const viewButtons = screen.getAllByText("View Changes");
    await user.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Sync Details — v1.8.3")).toBeInTheDocument();
    });
  });
});
