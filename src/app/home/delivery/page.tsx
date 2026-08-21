"use client";

import { useState } from "react";
import { ArrowLeft, Search, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInput } from "@/src/components/SearchInput";

const TABS = [
  "Placed Orders",
  "Waiting for Pick",
  "Out for Delivery",
  "Delivered Orders",
] as const;

type DeliveryTab = (typeof TABS)[number];

export default function DeliveryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DeliveryTab>("Placed Orders");
  const [search, setSearch] = useState("");

  return (
    <main className="flex h-full flex-col overflow-hidden bg-black text-white">
      <header className="relative flex h-[115px] shrink-0 items-center px-[29px]">
        <Button
          size="icon"
          onClick={() => router.push("/home")}
          className="h-[40px] w-[40px] rounded-[6px] bg-[#292929] hover:bg-[#333333]"
        >
          <ArrowLeft size={22} />
        </Button>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[10px]">
          <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#D9D9D9]">
            <UserRound className="text-black" size={22} />
          </div>

          <h1 className="text-[32px] font-semibold tracking-[-1px]">
            My Restaurant
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-[8px]">
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#D9D9D9]">
            <UserRound size={18} className="text-black" />
          </div>

          <div>
            <p className="text-[20px] font-semibold leading-[20px]">Admin</p>
            <p className="text-[13px] text-[#AAAAAA]">Company Admin</p>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col bg-[#2C192B] px-[29px] pt-[22px]">
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
              text-[#B0B0B0]
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
              text-[#B0B0B0]
            "
          >
            To Date & Time
          </button>

          <div className="relative ml-auto w-[280px]">
            <SearchInput variant="panel" className="w-full sm:ml-auto sm:w-[270px]" />
          </div>
        </div>
      </div>
    </main>
  );
}