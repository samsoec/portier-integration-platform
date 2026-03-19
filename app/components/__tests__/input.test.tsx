import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Input } from "../ui/input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("accepts text input", async () => {
    render(<Input placeholder="Name" />);
    const input = screen.getByPlaceholderText("Name");
    await userEvent.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("calls onChange when typing", async () => {
    const onChange = vi.fn();
    render(<Input placeholder="Name" onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText("Name"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("renders an icon when provided", () => {
    render(<Input icon={<span data-testid="icon">🔍</span>} />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies pl-10 class when icon is provided", () => {
    render(<Input icon={<span>🔍</span>} placeholder="Search" />);
    expect(screen.getByPlaceholderText("Search")).toHaveClass("pl-10");
  });

  it("does not apply pl-10 class when no icon", () => {
    render(<Input placeholder="Search" />);
    expect(screen.getByPlaceholderText("Search")).not.toHaveClass("pl-10");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled placeholder="Disabled" />);
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
  });

  it("applies additional className", () => {
    render(<Input className="my-input" placeholder="X" />);
    expect(screen.getByPlaceholderText("X")).toHaveClass("my-input");
  });
});
