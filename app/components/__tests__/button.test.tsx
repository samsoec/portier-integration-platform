import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../ui/button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("fires onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>
    );
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies solid variant styles by default", () => {
    render(<Button>Solid</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-blue-500");
  });

  it("applies outlined variant styles", () => {
    render(<Button variant="outlined">Outlined</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-gray-300");
  });

  it("applies ghost variant styles", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button");
    expect(btn).not.toHaveClass("bg-blue-500");
    expect(btn).not.toHaveClass("border-gray-300");
  });

  it("applies small size styles", () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-sm");
  });

  it("applies large size styles", () => {
    render(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("text-lg");
  });

  it("applies additional className", () => {
    render(<Button className="my-class">Btn</Button>);
    expect(screen.getByRole("button")).toHaveClass("my-class");
  });

  it("has disabled styling when disabled", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByRole("button")).toHaveClass("disabled:opacity-50");
  });
});
