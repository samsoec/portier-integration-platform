import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Alert } from "../alert";

describe("Alert", () => {
  it("renders title text", () => {
    render(<Alert title="Something happened" />);
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<Alert title="Title" description="Extra detail" />);
    expect(screen.getByText("Extra detail")).toBeInTheDocument();
  });

  it("does not render description when omitted", () => {
    render(<Alert title="Title" />);
    expect(screen.queryByText("Extra detail")).not.toBeInTheDocument();
  });

  it("defaults to info variant styling", () => {
    const { container } = render(<Alert title="Info" />);
    expect(container.firstElementChild).toHaveClass("bg-blue-50");
  });

  it("applies error variant styling", () => {
    const { container } = render(<Alert variant="error" title="Error" />);
    expect(container.firstElementChild).toHaveClass("bg-red-50");
  });

  it("applies success variant styling", () => {
    const { container } = render(<Alert variant="success" title="Done" />);
    expect(container.firstElementChild).toHaveClass("bg-green-50");
  });

  it("applies warning variant styling", () => {
    const { container } = render(<Alert variant="warning" title="Careful" />);
    expect(container.firstElementChild).toHaveClass("bg-yellow-50");
  });
});
