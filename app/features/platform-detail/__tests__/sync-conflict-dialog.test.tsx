import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncConflictDialog } from "../sync-conflict-dialog";
import { renderWithProviders } from "~/test-utils";
import type { SyncChange } from "~/entities/types";

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

  it("calls onClose when Cancel is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<SyncConflictDialog {...defaultProps} onClose={onClose} />);
    await user.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledOnce();
  });

  describe("custom value (third option)", () => {
    it("renders a Custom input for each change", () => {
      renderWithProviders(<SyncConflictDialog {...defaultProps} />);

      const customInputs = screen.getAllByPlaceholderText("Enter custom value");
      expect(customInputs).toHaveLength(2);
    });

    it("typing a custom value selects that change as resolved", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SyncConflictDialog {...defaultProps} />);

      const customInputs = screen.getAllByPlaceholderText("Enter custom value");
      await user.type(customInputs[0], "custom@example.com");

      expect(
        screen.getByText(
          (_content, element) => element?.textContent === "1 of 2 conflicts resolved"
        )
      ).toBeInTheDocument();
    });

    it("submits custom value in acceptedChangeIds", async () => {
      const onSubmit = vi.fn();
      const user = userEvent.setup();
      renderWithProviders(<SyncConflictDialog {...defaultProps} onSubmit={onSubmit} />);

      const customInputs = screen.getAllByPlaceholderText("Enter custom value");
      await user.type(customInputs[0], "custom@example.com");

      // Select new for second change
      const newButtons = screen.getAllByRole("button").filter((btn) => {
        const spans = btn.querySelectorAll("span");
        return Array.from(spans).some((s) => s.textContent === "New");
      });
      await user.click(newButtons[1]);

      await user.click(screen.getByRole("button", { name: /confirm resolve/i }));

      expect(onSubmit).toHaveBeenCalledWith({
        c1: { type: "custom", value: "custom@example.com" },
        c2: { type: "new", value: "222" },
      });
    });

    it("selecting current or new clears the custom input", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SyncConflictDialog {...defaultProps} />);

      const customInputs = screen.getAllByPlaceholderText("Enter custom value");
      await user.type(customInputs[0], "custom@example.com");

      // Now click Current
      const currentButtons = screen.getAllByText("Current").map((el) => el.closest("button")!);
      await user.click(currentButtons[0]);

      expect(customInputs[0]).toHaveValue("");
    });
  });

  describe("required fields (id and email)", () => {
    const changesWithRequired: SyncChange[] = [
      {
        id: "c1",
        field_name: "User.email",
        change_type: "DELETE",
        current_value: "old@example.com",
        new_value: undefined,
      },
      {
        id: "c2",
        field_name: "User.id",
        change_type: "DELETE",
        current_value: "user-123",
        new_value: undefined,
      },
      {
        id: "c3",
        field_name: "User.phone",
        change_type: "UPDATE",
        current_value: "111",
        new_value: "222",
      },
    ];

    it("shows required indicator on email and id fields", () => {
      renderWithProviders(
        <SyncConflictDialog {...defaultProps} platformChanges={changesWithRequired} />
      );

      const requiredBadges = screen.getAllByText("Required");
      expect(requiredBadges.length).toBeGreaterThanOrEqual(2);
    });

    it("shows error when Accept All New results in empty required field", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <SyncConflictDialog {...defaultProps} platformChanges={changesWithRequired} />
      );

      await user.click(screen.getByText("Accept All New"));

      const errors = screen.getAllByText(/email is required and cannot be empty/i);
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });

    it("does not allow confirm when required fields are empty", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <SyncConflictDialog {...defaultProps} platformChanges={changesWithRequired} />
      );

      await user.click(screen.getByText("Accept All New"));

      const confirmBtn = screen.getByRole("button", { name: /confirm resolve/i });
      expect(confirmBtn).toBeDisabled();
    });

    it("allows confirm when required fields are filled via custom input", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <SyncConflictDialog {...defaultProps} platformChanges={changesWithRequired} />
      );

      // Fill required fields with custom values
      const customInputs = screen.getAllByPlaceholderText("Enter custom value");
      await user.type(customInputs[0], "filled@example.com");
      await user.type(customInputs[1], "user-456");

      // Select new for the non-required phone field
      const newButtons = screen.getAllByRole("button").filter((btn) => {
        const spans = btn.querySelectorAll("span");
        return Array.from(spans).some((s) => s.textContent === "New");
      });
      await user.click(newButtons[2]);

      const confirmBtn = screen.getByRole("button", { name: /confirm resolve/i });
      expect(confirmBtn).toBeEnabled();
    });

    it("clears error when required fields are subsequently filled", async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <SyncConflictDialog {...defaultProps} platformChanges={changesWithRequired} />
      );

      // Accept all new - triggers error for empty required
      await user.click(screen.getByText("Accept All New"));
      expect(
        screen.getAllByText(/email is required and cannot be empty/i).length
      ).toBeGreaterThanOrEqual(1);

      // Now fill the required field with custom value
      const customInputs = screen.getAllByPlaceholderText("Enter custom value");
      await user.type(customInputs[0], "filled@example.com");

      // email error should be gone
      expect(screen.queryByText(/email is required and cannot be empty/i)).not.toBeInTheDocument();
    });

    it("marks custom input as required for id and email fields when change is DELETE", () => {
      renderWithProviders(
        <SyncConflictDialog {...defaultProps} platformChanges={changesWithRequired} />
      );

      const customInputs = screen.getAllByPlaceholderText("Enter custom value");
      // First two are email and id (required), third is phone (not required)
      expect(customInputs[0]).toBeRequired();
      expect(customInputs[1]).toBeRequired();
      expect(customInputs[2]).not.toBeRequired();
    });
  });
});
