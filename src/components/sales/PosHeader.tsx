"use client";

import { ChevronLeft, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function POSHeader() {
  return (
    <header
      className="flex items-center justify-between bg-[#EFEFEF]"
      style={{
        width: 1024,
        height: 77,
        gap: 10,
        paddingTop: 22,
        paddingRight: 20,
        paddingBottom: 22,
        paddingLeft: 20,
        

      }}
    >
      {/* Left: back button — 40x40, radius 5, padding 6, bg #B3B3B336 */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 rounded-[5px] p-[6px] text-black text-xl hover:bg-[#B3B3B336]"
        style={{
          width: 40,
          height: 40,
          gap: 10,
          backgroundColor: "#B3B3B336",
        }}
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
      </Button>

      {/* Center: restaurant avatar + name */}
      <div className="flex flex-1 items-center justify-center gap-3">
        <Avatar
          className="flex items-center justify-center bg-[#EFEFEF]"
          style={{
            width: 47,
            height: 47,
            borderRadius: 40,
            padding: 10,
            boxShadow: "0px 0px 4px 0px #00000040",
          }}
        >
          <AvatarFallback className="bg-transparent text-black font-normal">
            <User className="h-6 w-6 " />
          </AvatarFallback>
        </Avatar>
        <span
          className="text-black"
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 32,
            lineHeight: "100%",
            letterSpacing: "0%",
          }}
        >
          My Restaurant
        </span>
      </div>

      {/* Right: admin profile — 150x40, gap 10 */}
      <div className="flex shrink-0 items-center" style={{ width: 150, height: 40, gap: 10 }}>
        <Avatar
          className="flex items-center justify-center bg-[#EFEFEF]"
          style={{
            width: 36,
            height: 36,
            borderRadius: 40,
            padding: 10,
            boxShadow: "0px 0px 4px 0px #00000040",
          }}
        >
          <AvatarFallback className="bg-transparent text-black">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-none">
          <span
            className="text-black"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            Admin
          </span>
          <span
            className="mt-1 text-[#686868]"
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              fontSize: 14,
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