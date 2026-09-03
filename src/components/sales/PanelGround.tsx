"use client";

type PanelBackgroundProps = {
  width: number;
  height: number;
  /** vertical center (in px, relative to this panel) where the notch should sit */
  notchCenterY: number;
  fill?: string;
  borderColor?: string;
};

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
 * All notch Y coordinates below are stored as deltas from the original
 * 267.5 center so the whole notch can be re-centered on any selected
 * sidebar item via `notchCenterY`, instead of being frozen in place.
 */
export function PanelBackground({
  width,
  height,
  notchCenterY,
  fill = "#D2D2D2",
  borderColor = "#EFEFEF",
}: PanelBackgroundProps) {
  const cy = notchCenterY;
  const r = 15; // corner radius, matches 587->602 / 15 / 549->564 in the source

  const buildPath = (w: number, h: number) => `
    M ${w - r} 0
    C ${w - 6.7157} 0 ${w} 6.7157 ${w} 15
    V ${h - 15}
    C ${w} ${h - 6.7157} ${w - 6.7157} ${h} ${w - r} ${h}
    H 82
    C 73.7157 ${h} 67 ${h - 6.7157} 67 ${h - 15}
    V ${cy + 28.497}
    C 67 ${cy + 25.464} 62.4211 ${cy + 23.955} 60.1444 ${cy + 25.959}
    C 53.7588 ${cy + 31.577} 45.2911 ${cy + 35} 36 ${cy + 35}
    C 16.1177 ${cy + 35} 0 ${cy + 19.33} 0 ${cy}
    C 0 ${cy - 19.33} 16.1177 ${cy - 35} 36 ${cy - 35}
    C 45.2909 ${cy - 35} 53.7588 ${cy - 31.578} 60.1445 ${cy - 25.959}
    C 62.4212 ${cy - 23.956} 67 ${cy - 25.465} 67 ${cy - 28.497}
    V 15
    C 67 6.71574 73.7157 0 82 0
    H ${w - r}
    Z
  `;

  const d = buildPath(width, height);
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
        <path d={d} />
      </mask>

      {/* base fill */}
      <path d={d} fill={fill} />

      {/* thin inner highlight ring, reproducing the masked border from the source svg */}
      <path d={d} fill="none" stroke={borderColor} strokeWidth={6} mask={`url(#${maskId})`} />
    </svg>
  );
}