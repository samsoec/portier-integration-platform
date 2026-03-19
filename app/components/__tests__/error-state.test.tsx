import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ErrorState } from "../error-state";

describe("ErrorState", () => {
  it("renders default title and message", () => {
    render(<ErrorState />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("An unexpected error occurred. Please try again.")).toBeInTheDocument();
  });

  it("renders custom title and message", () => {
    render(<ErrorState title="Not found" message="Page does not exist." />);
    expect(screen.getByText("Not found")).toBeInTheDocument();
    expect(screen.getByText("Page does not exist.")).toBeInTheDocument();
  });

  it("renders action slot when provided", () => {
    render(<ErrorState action={<button>Go back</button>} />);
    expect(screen.getByRole("button", { name: "Go back" })).toBeInTheDocument();
  });

  it("does not render action slot when omitted", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
