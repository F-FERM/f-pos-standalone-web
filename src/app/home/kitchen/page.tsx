"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { POSHeader } from "@/src/components/sales/PosHeader";

const TABS = [
  "All",
  "Pending",
  "Completed",
  "Rejected",
] as const;

type DeliveryTab = (typeof TABS)[number];

export default function DeliveryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DeliveryTab>("All");

  return (
    <main className="flex h-full flex-col overflow-hidden bg-black text-black">
      {/* Navbar */}
      <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col bg-[#D2D2D2] px-[29px] pt-[22px] pb-[18px]">
        <div className="grid grid-cols-4 items-center gap-[9px]">
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
            © 2026 Techon Innovations. All rights reserved.
          </span>
        </div>
      </div>
    </main>
  );
}