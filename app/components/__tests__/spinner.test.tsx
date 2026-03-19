import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Spinner } from "../spinner";

describe("Spinner", () => {
  it("renders with default label", () => {
    render(<Spinner />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders with a custom label", () => {
    render(<Spinner label="Please wait" />);
    expect(screen.getByText("Please wait")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveAttribute("aria-label", "Please wait");
  });

  it("applies small size class", () => {
    render(<Spinner size="sm" />);
    expect(screen.getByRole("status")).toHaveClass("h-4", "w-4");
  });

  it("applies large size class", () => {
    render(<Spinner size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("h-12", "w-12");
  });
});
