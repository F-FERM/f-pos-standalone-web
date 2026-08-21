"use client";

import { categories } from "./Data";


type CategorySidebarProps = {
  selectedId: number;
  onSelect: (id: number) => void;
};

export function CategorySidebar({ selectedId, onSelect }: CategorySidebarProps) {
  return (
    <nav
      className="
        relative
        z-20
        flex
        h-full
        min-h-0
        w-[56px]
        shrink-0
        flex-col
        items-center
        overflow-y-auto
        overflow-x-hidden
        py-2
        [scrollbar-width:none]
        [-ms-overflow-style:none]
        [&::-webkit-scrollbar]:hidden
        xs:w-[64px]
        sm:w-[72px]
        md:w-[78px]
        md:py-3
      "
    >
      {categories.map((category) => {
        const Icon = category.icon;
        const selected = selectedId === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className="flex min-h-0 w-full flex-1 flex-col items-center justify-center px-1"
          >
            {selected ? (
              <span
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#670063]
                  shadow-[0_4px_16px_rgba(0,0,0,0.45)]
                  xs:h-11
                  xs:w-11
                  sm:h-12
                  sm:w-12
                  md:h-14
                  md:w-14
                "
              >
                <Icon className="h-5 w-5 text-white xs:h-6 xs:w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
              </span>
            ) : (
              <>
                <Icon
                  className="h-[22px] w-[22px] shrink-0 text-secondary xs:h-[26px] xs:w-[26px]"
                  strokeWidth={1.7}
                />
                <span
                  className="
                    mt-0.5
                    w-full
                    text-center
                    text-[10px]
                    font-medium
                    leading-tight
                    text-secondary
                    xs:text-[12px]
                    md:text-[12px]
                    md:leading-[20px]
                  "
                >
                  {category.name}
                </span>
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
}