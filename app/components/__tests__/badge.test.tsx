import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders children text", () => {
    render(<Badge variant="neutral">Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies neutral variant styling", () => {
    render(<Badge variant="neutral">Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("bg-gray-100");
  });

  it("applies success variant styling", () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText("OK")).toHaveClass("bg-green-100");
  });

  it("applies error variant styling", () => {
    render(<Badge variant="error">Fail</Badge>);
    expect(screen.getByText("Fail")).toHaveClass("bg-red-100");
  });

  it("renders an icon when provided", () => {
    render(
      <Badge variant="info" icon={<span data-testid="icon">★</span>}>
        Info
      </Badge>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies additional className", () => {
    render(
      <Badge variant="neutral" className="my-extra">
        Text
      </Badge>
    );
    expect(screen.getByText("Text")).toHaveClass("my-extra");
  });
});
