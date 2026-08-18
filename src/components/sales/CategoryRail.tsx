"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  Cake,
  Cookie,
  IceCreamCone,
  Pizza,
  UtensilsCrossed,
} from "lucide-react";
import { CategoryItem } from "./Types";

const ICONS = {
  combo: UtensilsCrossed,
  snacks: Cookie,
  cake: Cake,
  scoop: IceCreamCone,
  burger: Pizza,
} as const;

interface Props {
  categories: CategoryItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

/* =========================================
   SIDEBAR
========================================= */

const RAIL_WIDTH = 88;

/*
 * Active circle = 64px
 *
 * The border will curve around it.
 */
const BUMP_RADIUS = 50;

/*
 * How far the curve moves toward
 * the left side of the sidebar.
 */
const BUMP_DEPTH = 46;

/*
 * Smoothing factor for the bump curve.
 * ~0.55 approximates a circular arc (same idea as
 * SVG's circle-via-bezier constant, kappa).
 * Lower = tighter/more angular, higher = rounder.
 */
const BUMP_SMOOTHING = 0.55;

export default function CategoryRail({
  categories,
  activeId,
  onSelect,
}: Props) {
  const railRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  const [rail, setRail] = useState({
    height: 0,
    centerY: 0,
  });

  /* =========================================
     MEASURE ACTIVE BUTTON
  ========================================== */

  useLayoutEffect(() => {
    const measure = () => {
      const railEl = railRef.current;
      const activeEl = activeBtnRef.current;

      if (!railEl || !activeEl) return;

      const railRect = railEl.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();

      const centerY =
        activeRect.top -
        railRect.top +
        activeRect.height / 2 +
        railEl.scrollTop;

      setRail({
        height: railEl.scrollHeight,
        centerY,
      });
    };

    const frame = requestAnimationFrame(measure);

    const railEl = railRef.current;

    railEl?.addEventListener("scroll", measure);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(frame);
      railEl?.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [activeId, categories.length]);

  const { height: H, centerY: cy } = rail;

  /* =========================================
     CURVE POSITION
  ========================================== */

  const top = Math.max(0, cy - BUMP_RADIUS);
  const bottom = Math.min(H, cy + BUMP_RADIUS);

  /*
   * Right edge of sidebar
   *
   * Example:
   *
   * RAIL_WIDTH = 88
   * BUMP_DEPTH = 46
   *
   * Deepest point = 42px
   */
  const curveX = RAIL_WIDTH - BUMP_DEPTH;

  /*
   * How far the control points are pulled
   * vertically to approximate a smooth arc.
   */
  const ctrlOffset = BUMP_RADIUS * BUMP_SMOOTHING;

  /* =========================================
     CURVED BORDER PATH

     Single continuous "C" bracket, built from
     two cubic beziers that share a tangent at
     the deepest point (curveX, cy):

          │
          │╲
          │ ╲
          │  )
          │ (
          │  )
          │ (
          │  )
          │ ╱
          │╱
          │

     - Leaves the straight edge tangent to vertical
       (control point directly below/above the start).
     - Meets the deepest point tangent to horizontal
       (control point directly left of cy).

     This avoids the double-kink you get from chaining
     three separate bezier segments.
  ========================================== */

  const borderPath =
    H > 0
      ? `
        M ${RAIL_WIDTH} 0

        L ${RAIL_WIDTH} ${top}

        C ${RAIL_WIDTH} ${top + ctrlOffset},
          ${curveX} ${cy - ctrlOffset},
          ${curveX} ${cy}

        C ${curveX} ${cy + ctrlOffset},
          ${RAIL_WIDTH} ${bottom - ctrlOffset},
          ${RAIL_WIDTH} ${bottom}

        L ${RAIL_WIDTH} ${H}
      `
      : "";

  return (
    <div
      className="relative h-full shrink-0"
      style={{
        width: RAIL_WIDTH,
      }}
    >
      {/* =========================================
          SIDEBAR CONTENT
      ========================================== */}

      <div
        ref={railRef}
        className="
          relative
          z-10
          w-full
          h-full
          bg-[#1C1220]
          flex
          flex-col
          items-center
          py-5
          gap-6
          overflow-y-auto
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {categories.map((cat) => {
          const Icon = ICONS[cat.icon];
          const isActive = cat.id === activeId;

          return (
            <button
              key={cat.id}
              ref={isActive ? activeBtnRef : undefined}
              type="button"
              onClick={() => onSelect(cat.id)}
              className="
                relative
                z-30
                flex
                flex-col
                items-center
                justify-center
                gap-1.5
                shrink-0
                p-0
                m-0
                border-0
                bg-transparent
                outline-none
              "
            >
              {isActive ? (
            

                <span
                  className="
                    relative
                    z-50
                    flex
                    items-center
                    justify-center
                    w-16
                    h-16
                    rounded-full
                    bg-gradient-to-b
                    from-[#B341D6]
                    to-[#7B1FA2]
                    shadow-[0_4px_14px_rgba(0,0,0,0.45)]
                  "
                >
                  <IceCreamCone
                    className="
                      w-6
                      h-6
                      text-white
                    "
                    fill="white"
                    strokeWidth={1.8}
                  />
                </span>
              ) : (
             

                <>
                  <Icon
                    className="
                      w-6
                      h-6
                      text-[#E779C1]
                    "
                    strokeWidth={1.8}
                  />

                  <span
                    className="
                      w-[68px]
                      text-center
                      text-[#E779C1]
                      text-[11px]
                      font-medium
                      leading-[13px]
                    "
                  >
                    {cat.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>


      {H > 0 && (
        <svg
          className="
            absolute
            top-0
            left-0
            z-20
            pointer-events-none
            overflow-visible
          "
          width={RAIL_WIDTH}
          height={H}
          viewBox={`0 0 ${RAIL_WIDTH} ${H}`}
          preserveAspectRatio="none"
        >
          <path
            d={borderPath}
            fill="none"
            stroke="#E779C1"
            strokeWidth="1.5"
            strokeOpacity="0.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}