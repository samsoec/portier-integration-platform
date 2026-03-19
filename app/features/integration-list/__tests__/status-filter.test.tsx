import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StatusFilter } from "../status-filter";

describe("StatusFilter", () => {
  it("renders All button and all status buttons", () => {
    render(<StatusFilter value={null} onChange={() => {}} />);

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Synced")).toBeInTheDocument();
    expect(screen.getByText("Syncing")).toBeInTheDocument();
    expect(screen.getByText("Conflict")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("calls onChange with status when a status button is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<StatusFilter value={null} onChange={onChange} />);
    await user.click(screen.getByText("Synced"));

    expect(onChange).toHaveBeenCalledWith("Synced");
  });

  it("calls onChange with null when the active status is clicked (deselect)", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<StatusFilter value="Synced" onChange={onChange} />);
    await user.click(screen.getByText("Synced"));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("calls onChange with null when All button is clicked", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<StatusFilter value="Error" onChange={onChange} />);
    await user.click(screen.getByText("All"));

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("calls onChange with different status when switching filter", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<StatusFilter value="Synced" onChange={onChange} />);
    await user.click(screen.getByText("Error"));

    expect(onChange).toHaveBeenCalledWith("Error");
  });
});
