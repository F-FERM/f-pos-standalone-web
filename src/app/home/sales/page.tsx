"use client";

import { CategoryHeader } from "@/src/components/sales/CategoryHeader";
import { InvoiceHeader } from "@/src/components/sales/InvoiceHeader";
import { OrderPanel } from "@/src/components/sales/OrderPanel";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { ProductSection } from "@/src/components/sales/ProductSection";
import { useState } from "react";

export default function POSScreen() {
  const [selectedMenuType, setSelectedMenuType] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#EFEFEF]">
      {/* Navbar */}
      <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 xs:p-3 sm:p-3">
        <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-[15px] bg-[#D2D2D2] p-3 lg:flex-row lg:gap-4 lg:p-4">
          {/* Left column: category/search bar + product panel */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 lg:basis-[63.6%]">
            <div className="flex h-auto min-h-[56px] shrink-0 items-center gap-2.5 rounded-xl bg-[#EFEFEF] px-4 py-3 sm:gap-3">
              <CategoryHeader
                selectedFilter={selectedMenuType}
                onSelectFilter={setSelectedMenuType}
                search={search}
                onSearchChange={setSearch}
              />
            </div>

            <div className="min-h-0 flex-1 rounded-xl bg-[#EFEFEF]">
              <ProductSection
                selectedMenuType={selectedMenuType}
                search={search}
              />
            </div>
          </div>

          {/* Right column: invoice bar + order panel */}
          <div className="flex min-h-0 min-w-0 flex-col gap-3 lg:basis-[calc(36.4%-16px)]">
            <div className="flex h-auto min-h-[56px] shrink-0 items-center justify-between gap-2.5 rounded-xl bg-[#EFEFEF] px-4 py-3.5">
              <InvoiceHeader />
            </div>

            <div className="min-h-0 flex-1">
              <OrderPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-center py-2 text-center">
        <span className="text-xs font-medium leading-none text-[#939393]">
          © 2026 F-FERM Digital Labs. All rights reserved.
        </span>
      </div>
    </main>
  );
}