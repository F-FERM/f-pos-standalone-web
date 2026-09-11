"use client";

import { CategoryHeader } from "@/src/components/sales/CategoryHeader";
import { InvoiceHeader } from "@/src/components/sales/InvoiceHeader";
import { OrderPanel } from "@/src/components/sales/OrderPanel";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { ProductSection } from "@/src/components/sales/ProductSection";
import { useState } from "react";

export default function POSScreen() {
  const CARD_TOP = 77;
  const CARD_LEFT = 20;
  const CARD_HEIGHT = 661;
  const [selectedMenuType, setSelectedMenuType] = useState("All");

  return (
    <main
      className="relative mx-auto overflow-hidden w-full h-full"
      style={{
        backgroundColor: "#EFEFEF",
      }}
    >
      {/* Navbar — 1024x77, bg #000000 */}
      <POSHeader />

      {/* Backdrop — 984x661, top:77 left:20, radius 15, bg #D2D2D2 */}
      <div
        className="absolute"
        style={{
          top: CARD_TOP,
          left: CARD_LEFT,
          right: CARD_LEFT,
          height: CARD_HEIGHT,
          borderRadius: 15,
          backgroundColor: "#D2D2D2",
        }}
      />

      {/* Section 1 — Categories/search bar — 613x56 */}
      <div
        className="absolute flex items-center"
        style={{
          top: 90,
          left: 30,
          width: "calc(63.6% - 38px)",
          height: 56,
          gap: 10,
          borderRadius: 12,
          paddingTop: 12,
          paddingRight: 17,
          paddingBottom: 11,
          paddingLeft: 18,
          backgroundColor: "#EFEFEF",
        }}
      >
        <CategoryHeader
          selectedFilter={selectedMenuType}
          onSelectFilter={setSelectedMenuType}
        />
      </div>

      {/* Section 2 — Order/invoice info bar — 341x56 */}
      <div
        className="absolute flex items-center"
        style={{
          top: 90,
          left: "calc(63.6% + 2px)",
          right: 30,
          height: 56,
          gap: 10,
          borderRadius: 12,
          paddingTop: 15,
          paddingRight: 17,
          paddingBottom: 14,
          paddingLeft: 18,
          backgroundColor: "#EFEFEF",
        }}
      >
        <InvoiceHeader />
      </div>

      {/* Section 3 — Category + product panel — 613x564 */}
      <div
        className="absolute bg-[#EFEFEF] rounded-xl"
        style={{
          top: 159,
          left: 30,
          width: "calc(63.6% - 38px)",
          height: 564,
        }}
      >
        <ProductSection selectedMenuType={selectedMenuType} />
      </div>

      {/* Section 4 — Order panel — anchored at top:153 left:653 */}
      <div
        className="absolute"
        style={{ top: 153, left: "calc(63.6% + 2px)", right: 30 }}
      >
        <OrderPanel />
      </div>

      {/* Footer copyright — sits BELOW the backdrop card, not overlapping it */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          top: CARD_TOP + CARD_HEIGHT + 14,
          left: CARD_LEFT,
          right: CARD_LEFT,
        }}
      >
        <span
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
            fontSize: 12,
            lineHeight: "100%",
            letterSpacing: 0,
            color: "#939393",
          }}
        >
          © 2026 FFERM Digital Labs. All rights reserved.
        </span>
      </div>
    </main>
  );
}

