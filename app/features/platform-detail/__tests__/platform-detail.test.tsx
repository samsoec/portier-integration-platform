import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { PlatformDetail } from "../index";
import { renderWithProviders } from "~/test-utils";

vi.mock("~/api/fetch-platform", () => ({
  useFetchPlatform: vi.fn(),
}));

vi.mock("~/api/fetch-sync-history", () => ({
  useFetchSyncHistory: vi.fn().mockReturnValue({
    data: { data: [] },
    isLoading: false,
  }),
}));

vi.mock("~/api/sync-platform", () => ({
  useSyncPlatform: vi.fn().mockReturnValue({
    data: undefined,
    mutateAsync: vi.fn(),
    error: null,
  }),
}));

import { useFetchPlatform } from "~/api/fetch-platform";
const mockUseFetchPlatform = vi.mocked(useFetchPlatform);

const mockPlatform = {
  id: "salesforce",
  avatar: "https://example.com/sf.png",
  name: "Salesforce",
  description: "CRM integration hub",
  status: "Synced" as const,
  version: "1.0.0",
  lastSynced: "2026-03-01T00:00:00.000Z",
  lastSyncDuration: 120,
};

describe("PlatformDetail", () => {
  it("shows spinner while loading", () => {
    mockUseFetchPlatform.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    expect(screen.getByText("Loading platform...")).toBeInTheDocument();
  });

  it("shows error state on fetch failure", () => {
    mockUseFetchPlatform.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: "Not found" },
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    expect(screen.getByText("Not found")).toBeInTheDocument();
  });

  it("renders platform name and description", () => {
    mockUseFetchPlatform.mockReturnValue({
      data: { data: mockPlatform },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    expect(screen.getByText("Salesforce")).toBeInTheDocument();
    expect(screen.getByText("CRM integration hub")).toBeInTheDocument();
  });

  it("renders status badge and version", () => {
    mockUseFetchPlatform.mockReturnValue({
      data: { data: mockPlatform },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    expect(screen.getByText("Synced")).toBeInTheDocument();
    expect(screen.getByText("1.0.0")).toBeInTheDocument();
  });

  it("renders Back to list link", () => {
    mockUseFetchPlatform.mockReturnValue({
      data: { data: mockPlatform },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    const backLink = screen.getByText("← Back to list");
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest("a")).toHaveAttribute("href", "/");
  });

  it("renders avatar image", () => {
    mockUseFetchPlatform.mockReturnValue({
      data: { data: mockPlatform },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    const img = screen.getByAltText("Salesforce");
    expect(img).toHaveAttribute("src", "https://example.com/sf.png");
  });

  it("renders sync duration when available", () => {
    mockUseFetchPlatform.mockReturnValue({
      data: { data: mockPlatform },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    expect(screen.getByText("120s")).toBeInTheDocument();
  });

  it("shows conflict alert when status is Conflict", () => {
    const conflictPlatform = { ...mockPlatform, status: "Conflict" as const };
    mockUseFetchPlatform.mockReturnValue({
      data: { data: conflictPlatform },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    expect(screen.getByText("Conflict Detected")).toBeInTheDocument();
  });

  it("does not show conflict alert when status is not Conflict", () => {
    mockUseFetchPlatform.mockReturnValue({
      data: { data: mockPlatform },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    expect(screen.queryByText("Conflict Detected")).not.toBeInTheDocument();
  });

  it("renders Sync History section when data is loaded", () => {
    mockUseFetchPlatform.mockReturnValue({
      data: { data: mockPlatform },
      isLoading: false,
      isError: false,
      error: null,
    } as unknown as ReturnType<typeof useFetchPlatform>);

    renderWithProviders(<PlatformDetail id="salesforce" />);

    expect(screen.getByText("Sync History")).toBeInTheDocument();
  });
});
