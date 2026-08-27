"use client";

import { CategoryHeader } from "@/src/components/sales/CategoryHeader";
import { InvoiceHeader } from "@/src/components/sales/InvoiceHeader";
import { OrderPanel } from "@/src/components/sales/OrderPanel";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { ProductSection } from "@/src/components/sales/ProductSection";

export default function POSScreen() {
  return (
    <main className="flex flex-col overflow-x-hidden bg-black text-white">
      <div className="hidden h-[7px]" />

      {/* Navbar */}
      <POSHeader />

      {/* Main Content */}
      <div className="min-h-0 flex-1 bg-[#2C192B] px-3 py-[7px] md:px-[29px]">
        <div
          className="
            mx-auto
            grid
            w-full
            max-w-[1100px]
            min-w-0
            grid-cols-1
            gap-3
            md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]
            md:gap-x-[10px]
            md:gap-y-[14px]
            lg:grid-cols-[minmax(0,1fr)_320px]
          "
        >
          <CategoryHeader />
          <InvoiceHeader />
          <ProductSection />
          <OrderPanel />
        </div>
      </div>
    </main>
  );
}