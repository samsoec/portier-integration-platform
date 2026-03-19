import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SearchInput } from "../search-input";

describe("SearchInput", () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it("renders with the given value", () => {
    render(<SearchInput value="hello" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Search...")).toHaveValue("hello");
  });

  it("calls onChange after debounce when input changes", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} debounce={200} />);

    await user.type(screen.getByPlaceholderText("Search..."), "test");
    await vi.advanceTimersByTimeAsync(200);

    expect(onChange).toHaveBeenCalledWith("test");
  });

  it("does not call onChange before debounce elapses", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const onChange = vi.fn();
    render(<SearchInput value="" onChange={onChange} debounce={500} />);

    await user.type(screen.getByPlaceholderText("Search..."), "ab");
    await vi.advanceTimersByTimeAsync(100);

    expect(onChange).not.toHaveBeenCalled();
  });
});
