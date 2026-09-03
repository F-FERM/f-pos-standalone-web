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
      className={`relative min-w-0 ${isPanel ? "w-full sm:w-[270px]" : ""} ${className}`}
      style={!isPanel ? { width: 212, height: 33 } : undefined}
    >
      <Search
        size={18}
        className={`pointer-events-none absolute left-[10px] top-1/2 z-10 -translate-y-1/2 ${
          isPanel ? "text-[#AAAAAA]" : "text-[#848484]"
        }`}
      />

      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={
          isPanel
            ? `
              h-[38px]
              rounded-[6px]
              border-[#D9D9D9]/70
              bg-[#474747AB]
              pl-[34px]
              text-[13px] text-white
              placeholder:text-[#AAAAAA]
              focus-visible:ring-1
              focus-visible:ring-secondary
              sm:text-[15px]
            `
            : ""
        }
        style={
          !isPanel
            ? {
                width: 212,
                height: 33,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#D5D5D5",
                backgroundColor: "#E5E5E5",
                paddingTop: 5,
                paddingRight: 10,
                paddingBottom: 5,
                paddingLeft: 38,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#848484",
              }
            : undefined
        }
      />
    </div>
  );
}