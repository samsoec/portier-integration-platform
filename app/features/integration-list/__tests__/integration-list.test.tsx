import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { IntegrationList } from "../index";
import { renderWithProviders } from "~/test-utils";

vi.mock("~/api/fetch-platforms", () => ({
  useFetchPlatforms: vi.fn(),
}));

import { useFetchPlatforms } from "~/api/fetch-platforms";
const mockUseFetchPlatforms = vi.mocked(useFetchPlatforms);

const mockPlatforms = [
  {
    id: "salesforce",
    avatar: "https://example.com/sf.png",
    name: "Salesforce",
    description: "CRM integration",
    status: "Synced" as const,
    version: "1.0.0",
    lastSynced: "2026-03-01T00:00:00.000Z",
    lastSyncDuration: 120,
  },
  {
    id: "stripe",
    avatar: "https://example.com/st.png",
    name: "Stripe",
    description: "Payment gateway",
    status: "Conflict" as const,
    version: "0.9.4",
    lastSynced: "2026-03-01T00:00:00.000Z",
    lastSyncDuration: 300,
  },
];

describe("IntegrationList", () => {
  it("shows spinner while loading", () => {
    mockUseFetchPlatforms.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatforms>);

    renderWithProviders(<IntegrationList />);

    expect(screen.getByText("Loading platforms...")).toBeInTheDocument();
  });

  it("shows error state on fetch failure", () => {
    mockUseFetchPlatforms.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: "Network error" },
    } as unknown as ReturnType<typeof useFetchPlatforms>);

    renderWithProviders(<IntegrationList />);

    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("renders platform cards when data loads", () => {
    mockUseFetchPlatforms.mockReturnValue({
      data: { data: mockPlatforms },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatforms>);

    renderWithProviders(<IntegrationList />);

    expect(screen.getByText("Salesforce")).toBeInTheDocument();
    expect(screen.getByText("Stripe")).toBeInTheDocument();
  });

  it("shows empty state when no platforms match", () => {
    mockUseFetchPlatforms.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatforms>);

    renderWithProviders(<IntegrationList />);

    expect(screen.getByText("No platforms found")).toBeInTheDocument();
  });

  it("renders page heading", () => {
    mockUseFetchPlatforms.mockReturnValue({
      data: { data: mockPlatforms },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatforms>);

    renderWithProviders(<IntegrationList />);

    expect(screen.getByText("Integration List")).toBeInTheDocument();
  });

  it("renders search input and status filter", () => {
    mockUseFetchPlatforms.mockReturnValue({
      data: { data: mockPlatforms },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatforms>);

    renderWithProviders(<IntegrationList />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    // Status filter renders "All" button and status buttons
    const allButtons = screen.getAllByRole("button");
    expect(allButtons.length).toBeGreaterThanOrEqual(5); // All + 4 statuses
  });

  it("passes search and status params to useFetchPlatforms", async () => {
    mockUseFetchPlatforms.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatforms>);

    renderWithProviders(<IntegrationList />);

    // Verify initial call with no filters
    expect(mockUseFetchPlatforms).toHaveBeenCalledWith(
      expect.objectContaining({
        search: undefined,
        status: undefined,
      })
    );
  });
});
