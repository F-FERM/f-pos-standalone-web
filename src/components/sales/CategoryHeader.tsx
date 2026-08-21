"use client";

import { SearchInput } from "../SearchInput";


const filters = ["All", "Scoop", "Corn", "Stick"];

export function CategoryHeader() {
  return (
    <section
      className="
        flex
        h-auto
        min-h-[50px]
        w-full
        min-w-0
        flex-wrap
        items-center
        gap-2
        rounded-[12px]
        bg-black
        px-3
        py-2
        sm:flex-nowrap
        sm:gap-[10px]
        sm:px-[18px]
        sm:py-[11px]
      "
    >
      <h2 className="whitespace-nowrap text-[16px] font-semibold text-white xs:text-[18px]">
        Categories
      </h2>

      <SearchInput variant="compact" className="ml-0 flex-1 sm:ml-[14px]" />

      <div className="ml-auto flex items-center gap-3 overflow-x-auto text-[12px] font-medium sm:gap-[28px]">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="shrink-0 text-white hover:text-secondary"
          >
            {filter}
          </button>
        ))}
      </div>
    </section>
  );
}