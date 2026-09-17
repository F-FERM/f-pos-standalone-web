"use client";

import { useState } from "react";

import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";

const TABS = [
  "Placed Orders",
  "Waiting for Pick",
  "Out for Delivery",
  "Delivered Orders",
] as const;

type DeliveryTab = (typeof TABS)[number];

export default function DeliveryPage() {
  const [activeTab, setActiveTab] = useState<DeliveryTab>("Placed Orders");

  return (
    <main className="flex h-screen flex-col overflow-x-hidden bg-black text-black">
      {/* Navbar */}
      <POSHeader />

      <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto bg-[#EFEFEF] px-3 pb-4">
        <div className="flex w-full flex-1 flex-col gap-3 rounded-[15px] bg-[#D2D2D2] p-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {TABS.map((tab) => {
              const selected = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex h-[42px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] border px-4  text-[15px] font-semibold transition-colors sm:px-5 sm:text-[18px] ${
                    selected
                      ? "border-transparent bg-[#450042] text-white"
                      : "border-[#9C9C9C] bg-[#D2D2D2] text-black"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Filters row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="h-[42px] shrink-0 whitespace-nowrap rounded-[12px] border border-[#9C9C9C] bg-transparent px-4  text-[13px] font-medium text-[#5D5D5D] sm:px-5 sm:text-sm"
              >
                From Date & Time
              </button>

              <button
                type="button"
                className="h-[42px] shrink-0 whitespace-nowrap rounded-[12px] border border-[#9C9C9C] bg-transparent px-4  text-[13px] font-medium text-[#5D5D5D] sm:px-5 sm:text-sm"
              >
                To Date & Time
              </button>
            </div>

            <SearchInput variant="panel" className="w-full sm:ml-auto sm:w-[270px]" />
          </div>

          {/* Orders content goes here */}
          <div className="flex flex-1 flex-col gap-4">
            {/* e.g. {activeTab === "Placed Orders" && <PlacedOrdersTable data={...} isLoading={...} />} */}
          </div>
        </div>

        <span className=" text-[12px] font-medium text-[#939393]">
          © 2026 F-FERM Digital Labs. All rights reserved.
        </span>
      </div>
    </main>
  );
}