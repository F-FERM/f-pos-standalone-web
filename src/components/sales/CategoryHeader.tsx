"use client";

import { SearchInput } from "../common/SearchInput";
import { useQuery } from "@tanstack/react-query";
import { listMenuTypes } from "@/src/api/menu-type";

type CategoryHeaderProps = {
  selectedFilter?: string;
  onSelectFilter?: (filter: string) => void;
};

export function CategoryHeader({
  selectedFilter = "All",
  onSelectFilter,
}: CategoryHeaderProps) {
  const menuTypesQuery = useQuery({
    queryKey: ["menu-types"],
    queryFn: listMenuTypes,
  });
  const filters = [
    "All",
    ...(menuTypesQuery.data?.data || []).map((menuType) => menuType.name),
  ];

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
        style={{
          minWidth: 194,
          height: 18,
          justifyContent: "space-between",
          gap: 12,
        }}
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
