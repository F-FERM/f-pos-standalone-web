"use client";

import { SearchInput } from "../common/SearchInput";

const filters = ["All", "Scoop", "Corn", "Stick"];

type CategoryHeaderProps = {
  selectedFilter?: string;
  onSelectFilter?: (filter: string) => void;
};

export function CategoryHeader({
  selectedFilter = "All",
  onSelectFilter,
}: CategoryHeaderProps) {
  return (
    <div className="flex h-full w-full items-center justify-between">
      <h2
        className="whitespace-nowrap"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: 22,
          lineHeight: "100%",
          letterSpacing: "0%",
          color: "#000000",
        }}
      >
        Categories
      </h2>

      <SearchInput variant="compact" />

      <div
        className="flex shrink-0 items-center"
        style={{ width: 194, height: 18, justifyContent: "space-between" }}
      >
        {filters.map((filter) => {
          const isActive = filter === selectedFilter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onSelectFilter?.(filter)}
              className="shrink-0 hover:opacity-70"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: isActive ? 600 : 500,
                fontSize: 12,
                lineHeight: "100%",
                letterSpacing: "0%",
                color: isActive ? "#3B0038" : "#000000",
              }}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}