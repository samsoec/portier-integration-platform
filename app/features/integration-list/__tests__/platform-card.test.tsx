import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { PlatformCard } from "../platform-card";
import { renderWithProviders } from "~/test-utils";
import type { Platform } from "~/entities/types";

const basePlatform: Platform = {
  id: "salesforce",
  avatar: "https://example.com/sf.png",
  name: "Salesforce",
  description: "CRM integration hub",
  status: "Synced",
  version: "1.0.0",
  lastSynced: "2026-03-01T00:00:00.000Z",
  lastSyncDuration: 120,
};

describe("PlatformCard", () => {
  it("renders platform name, version, and status", () => {
    renderWithProviders(<PlatformCard platform={basePlatform} />);

    expect(screen.getByText("Salesforce")).toBeInTheDocument();
    expect(screen.getByText("1.0.0")).toBeInTheDocument();
    expect(screen.getByText("Synced")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    renderWithProviders(<PlatformCard platform={basePlatform} />);

    expect(screen.getByText("CRM integration hub")).toBeInTheDocument();
  });

  it("links to /platforms/:id", () => {
    renderWithProviders(<PlatformCard platform={basePlatform} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/platforms/salesforce");
  });

  it("shows Action needed warning when status is Conflict", () => {
    const conflictPlatform: Platform = { ...basePlatform, status: "Conflict" };
    renderWithProviders(<PlatformCard platform={conflictPlatform} />);

    expect(screen.getByText("Action needed")).toBeInTheDocument();
  });

  it("does not show Action needed for non-Conflict status", () => {
    renderWithProviders(<PlatformCard platform={basePlatform} />);

    expect(screen.queryByText("Action needed")).not.toBeInTheDocument();
  });

  it("renders avatar image with alt text", () => {
    renderWithProviders(<PlatformCard platform={basePlatform} />);

    const img = screen.getByAltText("Salesforce");
    expect(img).toHaveAttribute("src", "https://example.com/sf.png");
  });

  it("shows sync duration when available", () => {
    renderWithProviders(<PlatformCard platform={basePlatform} />);

    expect(screen.getByText("120s sync")).toBeInTheDocument();
  });

  it("does not show sync duration when not provided", () => {
    const platform = { ...basePlatform };
    delete platform.lastSyncDuration;
    renderWithProviders(<PlatformCard platform={platform as Platform} />);

    expect(screen.queryByText(/sync$/)).not.toBeInTheDocument();
  });
});
