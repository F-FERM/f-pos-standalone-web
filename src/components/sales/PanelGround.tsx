"use client";

import { forwardRef, useCallback, useImperativeHandle, useLayoutEffect, useRef } from "react";

export type PanelBackgroundHandle = {
  /** repositions the notch immediately, without going through a React render */
  setNotchCenterY: (centerY: number) => void;
};

type PanelBackgroundProps = {
  width: number;
  height: number;
  /** vertical center (in px, relative to this panel) the notch starts at */
  defaultNotchCenterY: number;
  fill?: string;
  borderColor?: string;
};

const r = 15; // corner radius, matches 587->602 / 15 / 549->564 in the source
// circular-arc control-point ratios lifted from the source path (6.7157/15, 8.2843/15)
const K1 = 0.4477;
const K2 = 0.5523;

/**
 * Reproduces the exact shape from the provided SVG:
 *   M587 0 C595.284 0 602 6.71573 602 15 V549 C602 557.284 595.284 564 587 564
 *   H82 C73.7157 564 67 557.284 67 549 V295.997
 *   C67 292.964 62.4211 291.455 60.1444 293.459
 *   C53.7588 299.077 45.2911 302.5 36 302.5
 *   C16.1177 302.5 0 286.83 0 267.5
 *   C0 248.17 16.1177 232.5 36 232.5
 *   C45.2909 232.5 53.7588 235.922 60.1445 241.541
 *   C62.4212 243.544 67 242.035 67 239.003
 *   V15 C67 6.71574 73.7157 0 82 0 H587 Z
 *
 * All notch Y coordinates are stored as deltas from the original 267.5 center
 * so the whole notch can be re-centered on any selected sidebar item, instead
 * of being frozen in place.
 *
 * The notch center is NOT clamped: the sidebar reports the live position of
 * the selected item, so as that item scrolls the notch travels with it and
 * slides off the top/bottom edge. To keep the path valid at those extremes the
 * two left-hand corner radii collapse as the notch reaches them, and anything
 * past the edge is cut by the svg viewport.
 */
function buildPath(w: number, h: number, cy: number) {
  // where the notch meets the panel's straight left edge
  const topStop = cy - 28.497;
  const botStop = cy + 28.497;

  // shrink the left corners as the notch runs into them, so the left edge is
  // never asked to travel backwards (which would fold the path onto itself)
  const rTop = Math.min(r, Math.max(0, topStop));
  const rBottom = Math.min(r, Math.max(0, h - botStop));

  return `
    M ${w - r} 0
    C ${w - r * K1} 0 ${w} ${r * K1} ${w} ${r}
    V ${h - r}
    C ${w} ${h - r * K1} ${w - r * K1} ${h} ${w - r} ${h}
    H ${67 + rBottom}
    C ${67 + rBottom * K2} ${h} 67 ${h - rBottom * K1} 67 ${h - rBottom}
    V ${botStop}
    C 67 ${cy + 25.464} 62.4211 ${cy + 23.955} 60.1444 ${cy + 25.959}
    C 53.7588 ${cy + 31.577} 45.2911 ${cy + 35} 36 ${cy + 35}
    C 16.1177 ${cy + 35} 0 ${cy + 19.33} 0 ${cy}
    C 0 ${cy - 19.33} 16.1177 ${cy - 35} 36 ${cy - 35}
    C 45.2909 ${cy - 35} 53.7588 ${cy - 31.578} 60.1445 ${cy - 25.959}
    C 62.4212 ${cy - 23.956} 67 ${cy - 25.465} 67 ${topStop}
    V ${rTop}
    C 67 ${rTop - rTop * K2} ${67 + rTop * K1} 0 ${67 + rTop} 0
    H ${w - r}
    Z
  `;
}

export const PanelBackground = forwardRef<PanelBackgroundHandle, PanelBackgroundProps>(
  function PanelBackground(
    { width, height, defaultNotchCenterY, fill = "#D2D2D2", borderColor = "#EFEFEF" },
    ref,
  ) {
    const cyRef = useRef(defaultNotchCenterY);
    // the mask path, the fill and the highlight ring all share one geometry
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);

    // written straight to the DOM: the notch has to land in the same frame as
    // the scroll that moved the selected item, so a React render is too late
    const setNotchCenterY = useCallback(
      (centerY: number) => {
        cyRef.current = centerY;
        const d = buildPath(width, height, centerY);
        for (const path of pathRefs.current) path?.setAttribute("d", d);
      },
      [width, height],
    );

    useImperativeHandle(ref, () => ({ setNotchCenterY }), [setNotchCenterY]);

    // a resize re-renders with the stale `d` below — re-apply the live center
    useLayoutEffect(() => {
      setNotchCenterY(cyRef.current);
    }, [setNotchCenterY]);

    const d = buildPath(width, height, cyRef.current);
    const maskId = "panel-notch-inset";

    return (
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id={maskId} fill="white">
          <path
            ref={(el) => {
              pathRefs.current[0] = el;
            }}
            d={d}
          />
        </mask>

        {/* base fill */}
        <path
          ref={(el) => {
            pathRefs.current[1] = el;
          }}
          d={d}
          fill={fill}
        />

        {/* thin inner highlight ring, reproducing the masked border from the source svg */}
        <path
          ref={(el) => {
            pathRefs.current[2] = el;
          }}
          d={d}
          fill="none"
          stroke={borderColor}
          strokeWidth={6}
          mask={`url(#${maskId})`}
        />
      </svg>
    );
  },
);

