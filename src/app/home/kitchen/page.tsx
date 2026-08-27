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
    <main className="flex h-full flex-col overflow-hidden bg-black text-white">
      {/* Navbar */}
          <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col bg-[#2C192B] px-[29px] pt-[22px]">
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
                      ? "border-[#D9D9D9] bg-[#FFFFFF29] text-white"
                      : "border-[#D9D9D9]/70 bg-transparent text-white"
                  }
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>

      </div>
    </main>
  );
}