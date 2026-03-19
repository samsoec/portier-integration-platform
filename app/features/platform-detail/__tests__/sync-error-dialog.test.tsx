import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncErrorDialog } from "../sync-error-dialog";
import { renderWithProviders } from "~/test-utils";
import { HttpError } from "~/utils/error";

const defaultProps = {
  error: new HttpError(500, "Internal Server Error"),
  onClose: vi.fn(),
  onRetry: vi.fn(),
};

describe("SyncErrorDialog", () => {
  it("renders dialog with Sync Failed title", () => {
    renderWithProviders(<SyncErrorDialog {...defaultProps} />);

    expect(screen.getByText("Sync Failed")).toBeInTheDocument();
  });

  it("shows Configuration Error for client errors", () => {
    const error = new HttpError(400, "Bad Request");
    renderWithProviders(<SyncErrorDialog {...defaultProps} error={error} />);

    expect(screen.getByText("Configuration Error")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Possible missing configuration. Please check your integration settings before syncing."
      )
    ).toBeInTheDocument();
  });

  it("shows Server Error for 5xx errors", () => {
    const error = new HttpError(500, "Internal Server Error");
    renderWithProviders(<SyncErrorDialog {...defaultProps} error={error} />);

    expect(screen.getByText("Server Error")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Internal server error. The sync service is experiencing issues. Please try again later."
      )
    ).toBeInTheDocument();
  });

  it("shows Gateway Error for 502 errors", () => {
    const error = new HttpError(502, "Bad Gateway");
    renderWithProviders(<SyncErrorDialog {...defaultProps} error={error} />);

    expect(screen.getByText("Gateway Error")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Gateway error. The integration client server appears to be down. Please contact support."
      )
    ).toBeInTheDocument();
  });

  it("shows generic Sync Error for unknown errors", () => {
    const error = new HttpError(0, "Network failure");
    renderWithProviders(<SyncErrorDialog {...defaultProps} error={error} />);

    expect(screen.getByText("Sync Error")).toBeInTheDocument();
    expect(screen.getByText("Network failure")).toBeInTheDocument();
  });

  it("shows fallback message when error has no message", () => {
    const error = new HttpError(0, "");
    renderWithProviders(<SyncErrorDialog {...defaultProps} error={error} />);

    expect(screen.getByText("An unexpected error occurred. Please try again.")).toBeInTheDocument();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<SyncErrorDialog {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onRetry when Retry is clicked", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<SyncErrorDialog {...defaultProps} onRetry={onRetry} />);
    await user.click(screen.getByText("Retry"));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
