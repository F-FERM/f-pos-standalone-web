"use client";

import { ListMenuTypeApi } from "@/src/api/menu-type/api/GetAll";
import { SearchInput } from "../common/SearchInput";
import { useQuery } from "@tanstack/react-query";

type CategoryHeaderProps = {
  selectedFilter?: string;
  onSelectFilter?: (filter: string) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
};

export function CategoryHeader({
  selectedFilter = "",
  onSelectFilter,
  search = "",
  onSearchChange,
}: CategoryHeaderProps) {
  const menuTypesQuery = useQuery({
    queryKey: ["getAllMenuTypes"],
    queryFn: () => ListMenuTypeApi({ page: 1, limit: 100 }),
  });
  const filters = [
    "",
    ...(menuTypesQuery.data?.data || []).map((menuType) => menuType.name),
  ];

  return (
    <div className="flex h-full w-full flex-wrap items-center gap-3">
      <h2 className="whitespace-nowrap  text-xl font-semibold leading-none text-black sm:text-[22px]">
        Categories
      </h2>

      <SearchInput
        variant="compact"
        value={search}
        onChange={onSearchChange}
      />

      <div className="flex min-w-[194px] flex-1 shrink-0 flex-wrap items-center justify-end gap-3 sm:justify-between">
        {filters.map((filter) => {
          const isActive = filter === selectedFilter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onSelectFilter?.(filter)}
              className={`shrink-0  text-xs leading-none hover:opacity-70 ${
                isActive ? "font-semibold text-[#3B0038]" : "font-medium text-black"
              }`}
            >
              {filter || ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}