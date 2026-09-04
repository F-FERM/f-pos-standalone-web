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
      className={`relative min-w-0 shrink-0 ${className}`}
      style={{ width: isPanel ? 292 : 212, height: 38 }}
    >
      <Search
        size={isPanel ? 24 : 14}
        className={`pointer-events-none absolute left-[20px]  ${isPanel ? "top-1/2" : "top-[45%]"} -translate-y-1/2 `}
        style={{ color: "#848484" }}
      />

      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={
          isPanel
            ? {
                width: 292,
                height: 38,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#AEAEAE",
                backgroundColor: "#E5E5E5",
                paddingTop: 6,
                paddingRight: 20,
                paddingBottom: 6,
                paddingLeft: 53, // 20 (left padding) + 24 (icon) + 9 (gap)
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#848484",
              }
            : {
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
        }
      />
    </div>
  );
}