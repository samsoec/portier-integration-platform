import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncDialog } from "../sync-dialog";
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
    change_type: "ADD",
    new_value: "+1234567890",
  },
  {
    id: "c3",
    field_name: "Door.status",
    change_type: "DELETE",
    current_value: "active",
  },
];

const defaultProps = {
  platformName: "Salesforce",
  platformChanges: changes,
  isSubmitting: false,
  isSubmitted: false,
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  onRetry: vi.fn(),
};

describe("SyncDialog", () => {
  it("renders dialog title with platform name", () => {
    renderWithProviders(<SyncDialog {...defaultProps} />);

    expect(screen.getByText("Review Changes — Salesforce")).toBeInTheDocument();
  });

  it("renders grouped changes by entity", () => {
    renderWithProviders(<SyncDialog {...defaultProps} />);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Door")).toBeInTheDocument();
  });

  it("shows counter of selected changes", () => {
    renderWithProviders(<SyncDialog {...defaultProps} />);

    expect(
      screen.getByText((_content, element) => element?.textContent === "0 of 3 changes selected")
    ).toBeInTheDocument();
  });

  it("toggling a change checkbox updates selection count", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyncDialog {...defaultProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(
      screen.getByText((_content, element) => element?.textContent === "1 of 3 changes selected")
    ).toBeInTheDocument();
  });

  it("Select All selects all changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyncDialog {...defaultProps} />);

    await user.click(screen.getByText("Select All"));

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((cb) => {
      expect(cb).toBeChecked();
    });
  });

  it("Deselect All unchecks all changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyncDialog {...defaultProps} />);

    await user.click(screen.getByText("Select All"));
    await user.click(screen.getByText("Deselect All"));

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach((cb) => {
      expect(cb).not.toBeChecked();
    });
  });

  it("Confirm button is disabled when no changes selected", () => {
    renderWithProviders(<SyncDialog {...defaultProps} />);

    const confirmBtn = screen.getByRole("button", { name: /confirm sync/i });
    expect(confirmBtn).toBeDisabled();
  });

  it("Confirm button is enabled when at least one change is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SyncDialog {...defaultProps} />);

    await user.click(screen.getAllByRole("checkbox")[0]);

    const confirmBtn = screen.getByRole("button", { name: /confirm sync/i });
    expect(confirmBtn).toBeEnabled();
  });

  it("calls onSubmit with accepted change ids when confirmed", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<SyncDialog {...defaultProps} onSubmit={onSubmit} />);

    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(screen.getByRole("button", { name: /confirm sync/i }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("calls onClose when Cancel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<SyncDialog {...defaultProps} onClose={onClose} />);

    await user.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows success state when isSubmitted is true", () => {
    renderWithProviders(<SyncDialog {...defaultProps} isSubmitted={true} />);

    expect(screen.getByText("Sync completed successfully!")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });

  it("shows Configuration Error for client errors", () => {
    const error = new HttpError(400, "Bad Request");
    renderWithProviders(<SyncDialog {...defaultProps} error={error} />);

    expect(screen.getByText("Configuration Error")).toBeInTheDocument();
  });

  it("shows Server Error for 5xx errors", () => {
    const error = new HttpError(500, "Internal Server Error");
    renderWithProviders(<SyncDialog {...defaultProps} error={error} />);

    expect(screen.getByText("Server Error")).toBeInTheDocument();
  });

  it("shows Retry button when there is an error", () => {
    const error = new HttpError(500, "err");
    renderWithProviders(<SyncDialog {...defaultProps} error={error} />);

    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("calls onRetry when Retry button is clicked", async () => {
    const onRetry = vi.fn();
    const error = new HttpError(500, "err");
    const user = userEvent.setup();

    renderWithProviders(<SyncDialog {...defaultProps} error={error} onRetry={onRetry} />);
    await user.click(screen.getByText("Retry"));

    expect(onRetry).toHaveBeenCalledOnce();
  });
});
