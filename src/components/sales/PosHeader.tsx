"use client";

import { ChevronLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type POSHeaderProps = {
  variant?: "default" | "compact";
};

export function POSHeader({ variant = "default" }: POSHeaderProps) {
  const router = useRouter();
  const isCompact = variant === "compact";

  return (
   <header
  className="flex w-full shrink-0 items-center justify-between gap-1.5 bg-[#EFEFEF] px-2.5 py-1.5 xs:gap-2 xs:px-3 sm:gap-3 sm:px-5 sm:py-2 md:h-[56px] md:py-1.5 lg:px-6"
>
  {/* Back button */}
  <Button
    variant="ghost"
    size="icon"
    onClick={() => router.back()}
    className="h-8 w-8 shrink-0 rounded-[5px] bg-[#B3B3B336] p-[6px] text-black text-xl hover:bg-[#B3B3B336] sm:h-9 sm:w-9 lg:h-10 lg:w-10"
  >
    <ChevronLeft className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
  </Button>

  {/* Center */}
  <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 xs:gap-2 sm:gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-[#EFEFEF] p-1.5 shadow-sm sm:h-9 sm:w-9 md:h-10 md:w-10">
      <User className="h-4 w-4 text-black sm:h-5 sm:w-5" />
    </div>
    <span
      className="truncate text-base font-semibold text-black xs:text-lg sm:text-xl md:text-[26px] lg:text-[28px]"
      style={{ lineHeight: "100%", letterSpacing: "0%" }}
    >
      My Restaurant
    </span>
  </div>

  {/* Right: admin */}
  <div className="flex min-w-0 shrink-0 items-center gap-1.5 xs:gap-2 sm:gap-[10px]">
    <Avatar
      className="flex h-7 w-7 shrink-0 items-center justify-center bg-[#EFEFEF] p-1.5 xs:h-8 xs:w-8 xs:p-2 sm:h-9 sm:w-9"
      style={{ borderRadius: 40, boxShadow: "0px 0px 4px 0px #00000040" }}
    >
      <AvatarFallback className="bg-transparent text-black">
        <User className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4" />
      </AvatarFallback>
    </Avatar>
    <div className="hidden min-w-0 flex-col leading-none sm:flex">
      <span className="truncate text-base font-semibold text-black sm:text-lg" style={{ lineHeight: "100%" }}>
        Admin
      </span>
      <span className="mt-0.5 truncate text-xs text-[#686868]" style={{ fontWeight: 400, lineHeight: "100%" }}>
        Company Admin
      </span>
    </div>
  </div>
</header>
  );
}