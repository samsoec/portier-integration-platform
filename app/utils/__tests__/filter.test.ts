import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFilter } from "../filter";

describe("useFilter", () => {
  it("returns initial filter state", () => {
    const { result } = renderHook(() => useFilter({ search: "", status: null }));

    const [filter] = result.current;
    expect(filter).toEqual({ search: "", status: null });
  });

  it("updates a specific key immutably", () => {
    const { result } = renderHook(() => useFilter({ search: "", status: null as string | null }));

    act(() => {
      const [, updateFilter] = result.current;
      updateFilter("search", "hello");
    });

    const [filter] = result.current;
    expect(filter.search).toBe("hello");
    expect(filter.status).toBeNull();
  });

  it("preserves other keys when updating one key", () => {
    const { result } = renderHook(() =>
      useFilter({ search: "initial", status: "active" as string })
    );

    act(() => {
      const [, updateFilter] = result.current;
      updateFilter("status", "inactive");
    });

    const [filter] = result.current;
    expect(filter.search).toBe("initial");
    expect(filter.status).toBe("inactive");
  });

  it("supports multiple sequential updates", () => {
    const { result } = renderHook(() => useFilter({ a: 1, b: 2 }));

    act(() => {
      result.current[1]("a", 10);
    });
    act(() => {
      result.current[1]("b", 20);
    });

    expect(result.current[0]).toEqual({ a: 10, b: 20 });
  });
});
