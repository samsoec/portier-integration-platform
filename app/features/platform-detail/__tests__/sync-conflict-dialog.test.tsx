import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncConflictDialog } from "../sync-conflict-dialog";
import { renderWithProviders } from "~/test-utils";
import type { SyncChange } from "~/entities/types";
import { HttpError } from "~/utils/error";

const changes: SyncChange[] = [
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
    change_type: "UPDATE",
    current_value: "111",
    new_value: "222",
  },
];

const defaultProps = {
  platformName: "Stripe",
  platformChanges: changes,
  isSubmitting: false,
  isSubmitted: false,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  onRetry: vi.fn(),
};

describe("SyncConflictDialog", () => {
  it("renders dialog title with platform name", () => {
    renderWithProviders(<SyncConflictDialog {...defaultProps} />);

    expect(screen.getByText("Resolve Conflicts — Stripe")).toBeInTheDocument();
  });

  it("renders conflict changes with field names", () => {
    renderWithProviders(<SyncConflictDialog {...defaultProps} />);

    expect(screen.getByText("email")).toBeInTheDocument();
    expect(screen.getByText("phone")).toBeInTheDocument();
  });

  it("shows conflicts resolved counter starting at 0", () => {
    renderWithProviders(<SyncConflictDialog {...defaultProps} />);

    expect(
      screen.getByText((_content, element) => element?.textContent === "0 of 2 conflicts resolved")
    ).toBeInTheDocument();
  });

  it("selecting current value updates resolved count", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyncConflictDialog {...defaultProps} />);

    const currentButtons = screen.getAllByText("Current").map((el) => el.closest("button")!);
    await user.click(currentButtons[0]);

    expect(
      screen.getByText((_content, element) => element?.textContent === "1 of 2 conflicts resolved")
    ).toBeInTheDocument();
  });

  it("selecting new value updates resolved count", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyncConflictDialog {...defaultProps} />);

    const newButtons = screen.getAllByRole("button").filter((btn) => {
      const spans = btn.querySelectorAll("span");
      return Array.from(spans).some((s) => s.textContent === "New");
    });
    await user.click(newButtons[0]);

    expect(
      screen.getByText((_content, element) => element?.textContent === "1 of 2 conflicts resolved")
    ).toBeInTheDocument();
  });

  it("Accept All New selects new values for all changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyncConflictDialog {...defaultProps} />);

    await user.click(screen.getByText("Accept All New"));

    expect(
      screen.getByText((_content, element) => element?.textContent === "2 of 2 conflicts resolved")
    ).toBeInTheDocument();
  });

  it("Keep All Current selects current values for all changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyncConflictDialog {...defaultProps} />);

    await user.click(screen.getByText("Keep All Current"));

    expect(
      screen.getByText((_content, element) => element?.textContent === "2 of 2 conflicts resolved")
    ).toBeInTheDocument();
  });

  it("Confirm button is disabled until all conflicts are resolved", () => {
    renderWithProviders(<SyncConflictDialog {...defaultProps} />);

    const confirmBtn = screen.getByRole("button", { name: /confirm resolve/i });
    expect(confirmBtn).toBeDisabled();
  });

  it("Confirm button is enabled when all conflicts are resolved", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyncConflictDialog {...defaultProps} />);

    await user.click(screen.getByText("Accept All New"));

    const confirmBtn = screen.getByRole("button", { name: /confirm resolve/i });
    expect(confirmBtn).toBeEnabled();
  });

  it("calls onSubmit when confirmed with all resolved", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<SyncConflictDialog {...defaultProps} onSubmit={onSubmit} />);

    await user.click(screen.getByText("Accept All New"));
    await user.click(screen.getByRole("button", { name: /confirm resolve/i }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("shows success state when isSubmitted is true", () => {
    renderWithProviders(<SyncConflictDialog {...defaultProps} isSubmitted={true} />);

    expect(screen.getByText("Conflicts resolved successfully!")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("shows error state for server errors", () => {
    const error = new HttpError(500, "Internal Server Error");
    renderWithProviders(<SyncConflictDialog {...defaultProps} error={error} />);

    expect(screen.getByText("Server Error")).toBeInTheDocument();
  });

  it("shows Retry button on error", async () => {
    const onRetry = vi.fn();
    const error = new HttpError(500, "err");
    const user = userEvent.setup();

    renderWithProviders(<SyncConflictDialog {...defaultProps} error={error} onRetry={onRetry} />);
    await user.click(screen.getByText("Retry"));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<SyncConflictDialog {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
