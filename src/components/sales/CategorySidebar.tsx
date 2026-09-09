"use client";

import { useEffect, useRef } from "react";
import { categories } from "./Data";

type CategorySidebarProps = {
  selectedId: number;
  onSelect: (id: number) => void;
  /**
   * reports the vertical center (px, relative to the sidebar container) of the
   * selected item. Called synchronously on every scroll event, so the handler
   * must write to the DOM directly rather than set React state.
   */
  onSelectedCenterChange?: (centerY: number) => void;
};

const THUMB_HEIGHT = 104;
const THUMB_MIN_TOP = 16;

export function CategorySidebar({
  selectedId,
  onSelect,
  onSelectedCenterChange,
}: CategorySidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Keeps the notch locked onto the selected item wherever it currently sits,
  // and drives the purple scroll indicator. The list is never auto-scrolled to
  // the selection — the notch travels with the item instead, sliding off the
  // panel edge once the item scrolls away.
  //
  // Everything here is written straight to the DOM inside the scroll event:
  // routing it through React state costs at least a frame, which reads as the
  // notch lagging behind the item it is supposed to be welded to.
  useEffect(() => {
    const container = containerRef.current;
    const scrollEl = scrollRef.current;
    if (!container || !scrollEl) return;

    const update = () => {
      const containerRect = container.getBoundingClientRect();

      const item = itemRefs.current[selectedId];
      if (item) {
        const itemRect = item.getBoundingClientRect();
        onSelectedCenterChange?.(itemRect.top - containerRect.top + itemRect.height / 2);
      }

      const thumb = thumbRef.current;
      if (thumb) {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;

        // nothing to scroll — hide the thumb entirely
        if (scrollHeight <= clientHeight + 1) {
          thumb.style.opacity = "0";
        } else {
          const maxTop = clientHeight - THUMB_HEIGHT - THUMB_MIN_TOP;
          const scrollRatio = scrollTop / (scrollHeight - clientHeight);

          thumb.style.opacity = "1";
          thumb.style.top = `${THUMB_MIN_TOP + scrollRatio * Math.max(maxTop, 0)}px`;
        }
      }
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    ro.observe(scrollEl);

    scrollEl.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      scrollEl.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [selectedId, onSelectedCenterChange]);

  return (
    <nav
      ref={containerRef}
      className="relative z-20 h-full w-[56px] shrink-0 xs:w-[64px] sm:w-[72px] md:w-[78px]"
    >
      {/* purple scroll-position indicator on the left edge */}
      <span
        ref={thumbRef}
        className="pointer-events-none absolute left-0 z-30"
        style={{
          top: THUMB_MIN_TOP,
          width: 3,
          height: THUMB_HEIGHT,
          borderRadius: 5,
          backgroundColor: "#3B0038",
          opacity: 0,
        }}
      />
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
