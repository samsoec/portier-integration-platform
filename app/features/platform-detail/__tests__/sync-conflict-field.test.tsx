import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SyncConflictField } from "../sync-conflict-field";
import { renderWithProviders } from "~/test-utils";
import type { SyncChange } from "~/entities/types";

const baseChange: SyncChange = {
  id: "c1",
  field_name: "User.email",
  change_type: "UPDATE",
  current_value: "old@example.com",
  new_value: "new@example.com",
};

const defaultProps = {
  name: "c1",
  label: "email",
  change: baseChange,
  onChange: vi.fn(),
};

describe("SyncConflictField", () => {
  it("renders field name from change", () => {
    renderWithProviders(<SyncConflictField {...defaultProps} />);
    expect(screen.getByText("email")).toBeInTheDocument();
  });

  it("renders change type badge", () => {
    renderWithProviders(<SyncConflictField {...defaultProps} />);
    expect(screen.getByText("UPDATE")).toBeInTheDocument();
  });

  it("renders current and new value options", () => {
    renderWithProviders(<SyncConflictField {...defaultProps} />);
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("old@example.com")).toBeInTheDocument();
    expect(screen.getByText("new@example.com")).toBeInTheDocument();
  });

  it("renders custom input", () => {
    renderWithProviders(<SyncConflictField {...defaultProps} />);
    expect(screen.getByPlaceholderText("Enter custom value")).toBeInTheDocument();
  });

  it("calls onChange with current value when current button is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<SyncConflictField {...defaultProps} onChange={onChange} />);

    const currentBtn = screen.getByText("Current").closest("button")!;
    await user.click(currentBtn);

    expect(onChange).toHaveBeenCalledWith("c1", "old@example.com", "current");
  });

  it("calls onChange with new value when new button is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<SyncConflictField {...defaultProps} onChange={onChange} />);

    const newBtn = screen.getAllByRole("button").find((btn) => {
      const spans = btn.querySelectorAll("span");
      return Array.from(spans).some((s) => s.textContent === "New");
    })!;
    await user.click(newBtn);

    expect(onChange).toHaveBeenCalledWith("c1", "new@example.com", "new");
  });

  it("calls onChange with custom value when typing in custom input", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(<SyncConflictField {...defaultProps} onChange={onChange} />);

    const input = screen.getByPlaceholderText("Enter custom value");
    await user.type(input, "x");

    expect(onChange).toHaveBeenCalledWith("c1", "x", "custom");
  });

  it("calls onChange with undefined when custom input is cleared", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    renderWithProviders(
      <SyncConflictField {...defaultProps} onChange={onChange} value="x" valueType="custom" />
    );

    const input = screen.getByPlaceholderText("Enter custom value");
    await user.clear(input);

    expect(onChange).toHaveBeenCalledWith("c1", undefined, "custom");
  });

  it("shows Keeping badge when current is selected", () => {
    renderWithProviders(
      <SyncConflictField {...defaultProps} value="old@example.com" valueType="current" />
    );
    expect(screen.getByText("Keeping")).toBeInTheDocument();
  });

  it("shows Accepting badge when new is selected", () => {
    renderWithProviders(
      <SyncConflictField {...defaultProps} value="new@example.com" valueType="new" />
    );
    expect(screen.getByText("Accepting")).toBeInTheDocument();
  });

  it("shows custom value in input when custom is resolved", () => {
    renderWithProviders(
      <SyncConflictField {...defaultProps} value="custom@example.com" valueType="custom" />
    );
    expect(screen.getByPlaceholderText("Enter custom value")).toHaveValue("custom@example.com");
  });

  it("clears custom input display when current/new is selected", () => {
    renderWithProviders(
      <SyncConflictField {...defaultProps} value="old@example.com" valueType="current" />
    );
    expect(screen.getByPlaceholderText("Enter custom value")).toHaveValue("");
  });

  describe("required field", () => {
    it("shows Required badge when required prop is true", () => {
      renderWithProviders(<SyncConflictField {...defaultProps} required />);
      expect(screen.getByText("Required")).toBeInTheDocument();
    });

    it("does not show Required badge when required prop is false", () => {
      renderWithProviders(<SyncConflictField {...defaultProps} required={false} />);
      expect(screen.queryByText("Required")).not.toBeInTheDocument();
    });

    it("marks custom input as required when required prop is true", () => {
      renderWithProviders(<SyncConflictField {...defaultProps} required />);
      expect(screen.getByPlaceholderText("Enter custom value")).toBeRequired();
    });

    it("does not mark custom input as required when required prop is false", () => {
      renderWithProviders(<SyncConflictField {...defaultProps} required={false} />);
      expect(screen.getByPlaceholderText("Enter custom value")).not.toBeRequired();
    });
  });

  describe("errorMessage", () => {
    it("renders error message when provided", () => {
      renderWithProviders(
        <SyncConflictField {...defaultProps} errorMessage="email is required and cannot be empty" />
      );
      expect(screen.getByText("email is required and cannot be empty")).toBeInTheDocument();
    });

    it("does not render error message when not provided", () => {
      renderWithProviders(<SyncConflictField {...defaultProps} />);
      expect(screen.queryByText("email is required and cannot be empty")).not.toBeInTheDocument();
    });

    it("applies error styling to custom input when errorMessage is present", () => {
      renderWithProviders(
        <SyncConflictField {...defaultProps} errorMessage="email is required and cannot be empty" />
      );
      const input = screen.getByPlaceholderText("Enter custom value");
      expect(input.className).toContain("border-red-400");
    });

    it("does not apply error styling when no errorMessage", () => {
      renderWithProviders(<SyncConflictField {...defaultProps} />);
      const input = screen.getByPlaceholderText("Enter custom value");
      expect(input.className).not.toContain("border-red-400");
      expect(input.className).toContain("border-gray-300");
    });
  });
});
