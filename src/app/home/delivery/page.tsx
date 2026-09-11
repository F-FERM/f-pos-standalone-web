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
    <main className="flex h-full flex-col overflow-hidden bg-black text-black">
      {/* Navbar */}
      <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col bg-[#D2D2D2] px-[29px] pt-[22px] pb-[18px]">
        <div className="flex flex-wrap items-center gap-[9px]">
          {TABS.map((tab) => {
            const selected = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`
                  flex
                  items-center
                  justify-center
                  whitespace-nowrap
                  rounded-[7px]
                  border
                  px-[12px]
                  py-[9px]
                  text-[16px]
                  font-medium
                  transition
                  ${
                    selected
                      ? "border-[#450042] bg-[#450042] text-white"
                      : "border-[#9C9C9C] bg-transparent text-black"
                  }
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="mt-[18px] flex items-center gap-[14px]">
          <button
            type="button"
            className="
              h-[40px]
              rounded-[10px]
              border
              border-[#8A8A8A]
              bg-transparent
              px-[18px]
              text-[14px]
              font-medium
              whitespace-nowrap
              text-[#5D5D5D]
            "
          >
            From Date & Time
          </button>

          <button
            type="button"
            className="
              h-[40px]
              rounded-[10px]
              border
              border-[#8A8A8A]
              bg-transparent
              px-[18px]
              text-[14px]
              font-medium
              whitespace-nowrap
              text-[#5D5D5D]
            "
          >
            To Date & Time
          </button>

          <div className="relative ml-auto w-[280px]">
            <SearchInput variant="panel" className="w-full sm:ml-auto sm:w-[270px]" />
          </div>
        </div>

        <div className="mt-auto flex items-center justify-center pt-[14px]">
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
      </div>
    </main>
  );
}
