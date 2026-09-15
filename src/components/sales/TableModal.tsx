"use client";

import { X } from "lucide-react";
import Image from "next/image";
import changeTable from "../../../public/images/icons/changetable.png"
import noTable from "../../../public/images/icons/notable.png"
type TableModalProps = {
  open: boolean;
  onClose: () => void;
};

const legend = [
  { color: "#9F9F9F", label: "Available Table" },
  { color: "#FF7676", label: "Running Table" },
  { color: "#80C1FF", label: "Vacating Soon" },
];

export function TableModal({ open, onClose }: TableModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-[2px]">
      {/* card — fluid width capped at 812px, content dictates height */}
      <div
        className="relative flex w-full max-w-[812px] flex-col gap-4 rounded-[20px] border border-[#E0E0E0] bg-[#EFEFEF] p-5 sm:px-[34px] sm:py-[26px]"
      >
        {/* close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white bg-[#EFEFEF] text-[#FF3B3B] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          aria-label="Close table modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* title */}
        <h3 className="font-['Poppins',sans-serif] text-lg font-semibold leading-none text-black sm:text-[22px]">
          Change Table
        </h3>

        {/* under section — buttons + legend, wraps on narrow screens */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {/* 2 buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex shrink-0 items-center justify-center gap-[9px] whitespace-nowrap rounded-[7px] border border-[#9C9C9C] bg-[#EFEFEF] px-[10px] py-[6px] font-['Poppins',sans-serif] text-sm font-semibold text-black sm:text-base"
            >
              <Image src={changeTable} alt="" width={15} height={15} />
              Change Table
            </button>

            <button
              type="button"
              className="flex shrink-0 items-center justify-center gap-[9px] whitespace-nowrap rounded-[7px] border border-[#9C9C9C] bg-[#EFEFEF] px-[10px] py-[6px] font-['Poppins',sans-serif] text-sm font-semibold text-black sm:text-base"
            >
              <Image src={noTable} alt="" width={15} height={15} />
              No Table
            </button>
          </div>

          {/* legend */}
          <div className="flex flex-wrap items-center gap-3">
            {legend.map((item) => (
              <span key={item.label} className="flex shrink-0 items-center gap-1">
                <span
                  className="inline-block h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="whitespace-nowrap font-['Poppins',sans-serif] text-sm font-medium leading-none text-black">
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}