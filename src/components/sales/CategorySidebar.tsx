"use client";

import { useEffect, useRef, useState } from "react";
import { categories } from "./Data";

type CategorySidebarProps = {
  selectedId: number;
  onSelect: (id: number) => void;
  /** reports the vertical center (px, relative to the sidebar container) of the selected item */
  onSelectedCenterChange?: (centerY: number) => void;
};

export function CategorySidebar({
  selectedId,
  onSelect,
  onSelectedCenterChange,
}: CategorySidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [scrollTop, setScrollTop] = useState<number | null>(null);

  const THUMB_HEIGHT = 104;
  const THUMB_MIN_TOP = 16;

  // track scroll position to drive the purple indicator bar on the left edge
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const updateThumb = () => {
      const { scrollTop: st, scrollHeight, clientHeight } = scrollEl;

      // nothing to scroll — hide the thumb entirely
      if (scrollHeight <= clientHeight + 1) {
        setScrollTop(null);
        return;
      }

      const maxTop = clientHeight - THUMB_HEIGHT - THUMB_MIN_TOP;
      const scrollRatio = st / (scrollHeight - clientHeight);
      const top = THUMB_MIN_TOP + scrollRatio * Math.max(maxTop, 0);

      setScrollTop(top);
    };

    updateThumb();

    scrollEl.addEventListener("scroll", updateThumb);
    const ro = new ResizeObserver(updateThumb);
    ro.observe(scrollEl);

    return () => {
      scrollEl.removeEventListener("scroll", updateThumb);
      ro.disconnect();
    };
  }, []);

  // scroll the newly selected item into view first, so the notch measurement
  // below reflects its final on-screen position rather than a pre-scroll one
  useEffect(() => {
    const item = itemRefs.current[selectedId];
    item?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [selectedId]);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const item = itemRefs.current[selectedId];
      if (!container || !item) return;

      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const rawCenterY = itemRect.top - containerRect.top + itemRect.height / 2;

      // clamp so the notch curve (which needs ~35-40px of room on either side)
      // never gets a center so close to the top/bottom edge that the bezier
      // math would produce an invalid/self-intersecting shape
      const margin = 40;
      const centerY = Math.min(Math.max(rawCenterY, margin), containerRect.height - margin);

      onSelectedCenterChange?.(centerY);
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);

    const scrollEl = scrollRef.current;
    scrollEl?.addEventListener("scroll", measure);
    window.addEventListener("resize", measure);

    // catch the post scrollIntoView position once the smooth scroll settles
    const settleTimer = window.setTimeout(measure, 350);

    return () => {
      ro.disconnect();
      scrollEl?.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.clearTimeout(settleTimer);
    };
  }, [selectedId, onSelectedCenterChange]);

  return (
    <nav
      ref={containerRef}
      className="relative z-20 h-full w-[56px] shrink-0 xs:w-[64px] sm:w-[72px] md:w-[78px]"
    >
      {/* purple scroll-position indicator on the left edge */}
      {scrollTop !== null && (
        <span
          className="pointer-events-none absolute left-0 z-30 transition-[top] duration-150"
          style={{
            top: scrollTop,
            width: 3,
            height: 104,
            borderRadius: 5,
            backgroundColor: "#3B0038",
            opacity: 1,
          }}
        />
      )}
      <div
        ref={scrollRef}
        className="
          flex h-full min-h-0 w-full flex-col items-center gap-3 overflow-y-auto overflow-x-visible py-3
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden xs:gap-4 md:gap-4
        "
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const selected = selectedId === category.id;

          return (
            <div
              key={category.id}
              ref={(el) => {
                itemRefs.current[category.id] = el;
              }}
              className="relative flex w-full shrink-0 items-center justify-center"
            >
              {selected ? (
                <button
                  type="button"
                  onClick={() => onSelect(category.id)}
                  className="
                    relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                    border-0 bg-[#670063] shadow-[0_4px_16px_rgba(0,0,0,0.45)]
                    xs:h-12 xs:w-12 sm:h-[52px] sm:w-[52px]
                  "
                >
                  <Icon className="h-5 w-5 text-white xs:h-6 xs:w-6 sm:h-6 sm:w-6" strokeWidth={1.8} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelect(category.id)}
                  className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-3"
                >
                  <Icon
                    className="h-[22px] w-[22px] shrink-0 text-secondary xs:h-[26px] xs:w-[26px]"
                    strokeWidth={1.7}
                  />
                  <span className="mt-0.5 w-full text-center text-[10px] font-medium leading-tight text-secondary xs:text-[12px] md:text-[12px] md:leading-[20px]">
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