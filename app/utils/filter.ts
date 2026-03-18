import { useState } from "react";

export const useFilter = <T = Record<string, unknown>>(initial: T) => {
  const [filter, setFilter] = useState<T>(initial);

  const updateFilter = (key: keyof T, value: T[keyof T]) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  return [filter, updateFilter] as const;
};
