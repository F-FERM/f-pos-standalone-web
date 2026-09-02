"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";

type SearchInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** "compact" = small pill used in the categories header, "panel" = wider bar used inside modals */
  variant?: "compact" | "panel";
  className?: string;
};

/**
 * Shared search field. Reused by CategoryHeader, OrderModal and CustomerModal
 * so styling and behaviour stay in one place.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  variant = "compact",
  className = "",
}: SearchInputProps) {
  const isPanel = variant === "panel";

  return (
    <div
      className={`relative w-full min-w-0 ${
        isPanel ? "sm:w-[270px]" : "max-w-[172px]"
      } ${className}`}
    >
      <Search
        size={16}
        className="pointer-events-none absolute left-[12px] top-1/2 z-10 -translate-y-1/2 text-[#AAAAAA]"
      />

      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`
          rounded-[6px]
          border-[#777777]
          pl-[34px]
          text-white
          placeholder:text-[#AAAAAA]
          focus-visible:ring-1
          focus-visible:ring-secondary
          ${
            isPanel
              ? "h-[38px] border-[#D9D9D9]/70 bg-[#474747AB] text-[13px] sm:text-[15px]"
              : "h-[28px] bg-[#454545] text-[12px]"
          }
        `}
      />
    </div>
  );
}