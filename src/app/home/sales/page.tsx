"use client";

import { CategoryHeader } from "@/src/components/sales/CategoryHeader";
import { InvoiceHeader } from "@/src/components/sales/InvoiceHeader";
import { OrderPanel } from "@/src/components/sales/OrderPanel";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { ProductSection } from "@/src/components/sales/ProductSection";

export default function POSScreen() {
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
          top: 77,
          left: 20,
          width: 984,
          height: 661,
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
          width: 613,
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
        <CategoryHeader />
      </div>

      {/* Section 2 — Order/invoice info bar — 341x56 */}
      <div
        className="absolute flex items-center"
        style={{
          top: 90,
          left: 653,
          width: 341,
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
        className="absolute bg-white rounded-xl"
        style={{
          top: 159,
          left: 30,
          width: 613,
          height: 564,

          // backgroundColor: "#D2D2D2",
        }}
      >
        <ProductSection />
      </div>

      {/* Section 4 — Order panel — 341x566, bordered */}
    {/* Section 4 — Order panel — anchored at top:153 left:653 */}
<div className="absolute" style={{ top: 153, left: 653, width: 341 }}>
  <OrderPanel />
</div>
    </main>
  );
}