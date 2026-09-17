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
      className="flex w-full items-center justify-between gap-2 bg-[#EFEFEF] px-3 py-3 sm:gap-3 sm:px-5 sm:py-4 md:h-[77px] md:py-[22px]"
    >
      {/* Left: back button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.back()}
        className="h-9 w-9 shrink-0 rounded-[5px] bg-[#B3B3B336] p-[6px] text-black text-xl hover:bg-[#B3B3B336] sm:h-10 sm:w-10"
      >
        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
      </Button>

      {/* Center: restaurant avatar + name */}
      <div className="flex min-w-0 flex-1 items-center justify-center gap-2 sm:gap-3">
        <Avatar
          className="flex shrink-0 items-center justify-center bg-[#EFEFEF] p-2"
          style={{
            width: isCompact ? 36 : undefined,
            height: isCompact ? 36 : undefined,
            borderRadius: 40,
            boxShadow: "0px 0px 4px 0px #00000040",
          }}
        >
          <AvatarFallback className="bg-transparent text-black font-normal">
            <User className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </AvatarFallback>
        </Avatar>
        <span
          className="truncate text-black text-lg font-semibold sm:text-2xl md:text-[32px]"
          style={{
            fontFamily: "Inter, sans-serif",
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          My Restaurant
        </span>
      </div>

      {/* Right: admin profile */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-[10px]">
        <Avatar
          className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#EFEFEF] p-2 sm:h-9 sm:w-9"
          style={{
            borderRadius: 40,
            boxShadow: "0px 0px 4px 0px #00000040",
          }}
        >
          <AvatarFallback className="bg-transparent text-black">
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="hidden flex-col leading-none sm:flex">
          <span
            className="text-black text-base font-semibold sm:text-lg md:text-xl"
            style={{
              fontFamily: "Inter, sans-serif",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            Admin
          </span>
          <span
            className="mt-1 text-[#686868] text-xs sm:text-sm"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            Company Admin
          </span>
        </div>
      </div>
    </header>
  );
}