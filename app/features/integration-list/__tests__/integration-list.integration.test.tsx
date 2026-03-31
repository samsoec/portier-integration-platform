import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

describe("IntegrationList integration", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUseFetchPlatforms.mockImplementation((params) => {
      const search = params?.search?.toLowerCase() ?? "";
      const filtered = mockPlatforms.filter((platform) => {
        if (!search) return true;

        return (
          platform.name.toLowerCase().includes(search) ||
          platform.description.toLowerCase().includes(search)
        );
      });

      return {
        data: { data: filtered },
        isLoading: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useFetchPlatforms>;
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("filters the integration cards after the search debounce elapses", async () => {
    renderWithProviders(<IntegrationList />);

    expect(screen.getByText("Salesforce")).toBeInTheDocument();
    expect(screen.getByText("Stripe")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search..."), {
      target: { value: "stripe" },
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });

    expect(screen.getByText("Salesforce")).toBeInTheDocument();
    expect(screen.getByText("Stripe")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(screen.getByText("Stripe")).toBeInTheDocument();
    expect(screen.queryByText("Salesforce")).not.toBeInTheDocument();
    expect(screen.queryByText("No platforms found")).not.toBeInTheDocument();
  });
});
