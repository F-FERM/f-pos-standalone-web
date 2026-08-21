"use client";

import { ArrowLeft, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryHeader } from "@/src/components/sales/CategoryHeader";
import { InvoiceHeader } from "@/src/components/sales/InvoiceHeader";
import { ProductSection } from "@/src/components/sales/ProductSection";
import { OrderPanel } from "@/src/components/sales/OrderPanel";


export default function POSScreen() {
  return (
    <main className="flex flex-col overflow-x-hidden bg-black text-white  ">
      <div className="h-[7px] hidden" />

      {/* Navbar */}
      <header
        className="
          relative
          flex
          h-[70px]
          shrink-0
          items-center
          px-3
          xs:h-[80px]
          xs:px-4
          md:h-[115px]
          md:px-[29px]
        "
      >
        <Button
          size="icon"
          className="h-[36px] w-[36px] shrink-0 rounded-[6px] bg-[#292929] hover:bg-[#333333] xs:h-[40px] xs:w-[40px]"
        >
          <ArrowLeft size={20} />
        </Button>

        {/* Restaurant name - centered on larger screens, inline on mobile */}
        <div
          className="
            absolute
            left-1/2
            -translate-x-1/2
            flex
            min-w-0
            items-center
            gap-2
            xs:gap-[10px]
          "
        >
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#D9D9D9] xs:h-[48px] xs:w-[48px]">
            <UserRound className="text-black" size={18} />
          </div>

          <h1 className="truncate text-[16px] font-semibold tracking-[-1px] xs:text-[22px] md:text-[32px]">
            My Restaurant
          </h1>
        </div>

        {/* Admin - hides label on very small screens */}
        <div className="ml-auto flex shrink-0 items-center gap-[8px]">
          <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#D9D9D9] xs:h-[38px] xs:w-[38px]">
            <UserRound size={16} className="text-black" />
          </div>

          <div className="hidden sm:block">
            <p className="text-[16px] font-semibold leading-[20px] md:text-[20px]">Admin</p>
            <p className="text-[12px] text-[#AAAAAA] md:text-[13px]">Company Admin</p>
          </div>
        </div>
      </header>

      {/* Main content */}
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