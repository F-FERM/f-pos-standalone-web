"use client";

import { categories } from "./Data";

type CategorySidebarProps = {
  selectedId: number;
  onSelect: (id: number) => void;
};

export function CategorySidebar({
  selectedId,
  onSelect,
}: CategorySidebarProps) {
  return (
    <nav
      className="
        relative
        z-20
        h-full
        w-[56px]
        shrink-0
        xs:w-[64px]
        sm:w-[72px]
        md:w-[78px]
      "
    >
      <div
        className="
          flex
          h-full
          min-h-0
          flex-col
          items-center
          overflow-y-auto
          overflow-x-visible
          py-2
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
          md:py-3
        "
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const selected = selectedId === category.id;

          return (
            <div
              key={category.id}
              className="
                relative
                flex
                min-h-0
                w-full
                flex-1
                items-center
                justify-center
              "
            >
              {/* =========================================
                  NORMAL RIGHT BORDER
              ========================================== */}
              {!selected && (
                <span
                  className="
                    pointer-events-none
                    absolute
                    right-0
                    top-0
                    z-0
                    h-full
                    w-px
                    bg-[#373737]
                  "
                />
              )}

              {/* =========================================
                  SELECTED CATEGORY
              ========================================== */}
 {/* =========================================
    SELECTED CATEGORY
========================================== */}
{selected && (
  <>
    {/* top straight border segment (matches sibling style exactly) */}
    <span
      className="
        pointer-events-none
        absolute
        right-0
        top-0
        z-0
        w-px
        bg-[#373737]
      "
      style={{ height: "calc(50% - 33.275px)" }}
    />

    {/* bottom straight border segment */}
    <span
      className="
        pointer-events-none
        absolute
        right-0
        bottom-0
        z-0
        w-px
        bg-[#373737]
      "
      style={{ height: "calc(50% - 33.275px)" }}
    />

    {/* curve-only SVG, fixed height, always centered on the item */}
    <svg
      className="
        pointer-events-none
        absolute
        right-0
        top-1/2
        z-0
        h-[66.55px]
        w-[96px]
        -translate-y-1/2
        overflow-visible
      "
      viewBox="0 0 96 66.55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="
          M 96 0

          C 96 3.54
            85.17 6.79
            82.28 4.73

          C 76.56 0.66
            69.56 -1.74
            62 -1.74

          C 42.67 -1.74
            27 13.93
            27 33.26

          C 27 52.59
            42.67 68.26
            62 68.26

          C 69.56 68.26
            76.56 65.86
            82.28 61.79

          C 85.17 59.73
            96 62.98
            96 66.55
        "
        stroke="#373737"
        strokeWidth="2"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />
    </svg>

    {/* SELECTED CIRCLE */}
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      className="
        relative
        z-10
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        border-0
        bg-[#670063]
        shadow-[0_4px_16px_rgba(0,0,0,0.45)]
        xs:h-11
        xs:w-11
        sm:h-12
        sm:w-12
        md:h-12
        md:w-12
      "
    >
      <Icon
        className="
          h-5
          w-5
          text-white
          xs:h-6
          xs:w-6
          sm:h-6
          sm:w-6
        "
        strokeWidth={1.8}
      />
    </button>
  </>
)}
              {/* =========================================
                  NORMAL CATEGORY
              ========================================== */}
              {!selected && (
                <button
                  type="button"
                  onClick={() => onSelect(category.id)}
                  className="
                    relative
                    z-10
                    flex
                    h-full
                    w-full
                    flex-col
                    items-center
                    justify-center
                    px-1
                  "
                >
                  <Icon
                    className="
                      h-[22px]
                      w-[22px]
                      shrink-0
                      text-secondary
                      xs:h-[26px]
                      xs:w-[26px]
                    "
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
                </button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}