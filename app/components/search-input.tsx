import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "./ui/input";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
};

export function SearchInput({ value, onChange, debounce = 300 }: SearchInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue !== value) {
        onChangeRef.current(inputValue);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [inputValue, value, debounce]);

  return (
    <Input
      type="text"
      placeholder="Search..."
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      icon={<Search />}
    />
  );
}
