"use client";

import { Table2, X } from "lucide-react";

type TableModalProps = {
  open: boolean;
  onClose: () => void;
};

const legend = [
  { color: "bg-[#C7C7C7]", label: "Available Table" },
  { color: "bg-[#FF3B3B]", label: "Running Table" },
  { color: "bg-[#D9D9D9]", label: "Vacating Soon" },
];

export function TableModal({ open, onClose }: TableModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[820px] rounded-[20px] border border-gray-600 bg-[#2C192BE5] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:rounded-[30px] sm:px-[28px] sm:py-[26px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
          aria-label="Close table modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <h3 className="mb-4 text-[18px] font-semibold text-white sm:mb-[20px] sm:text-[22px]">
          Change Table
        </h3>

        <div className="flex flex-wrap items-center gap-3 sm:gap-[14px]">
          <button
            type="button"
            className="flex items-center gap-[8px] rounded-[12px] border border-[#D7B2D9]/70 bg-[#2B102B]/60 px-[14px] py-[10px] text-[14px] font-semibold text-white sm:px-[16px] sm:py-[12px] sm:text-[16px]"
          >
            <Table2 size={18} />
            Change Table
          </button>

          <button
            type="button"
            className="flex items-center gap-[8px] rounded-[12px] border border-[#D7B2D9]/70 bg-[#2B102B]/60 px-[14px] py-[10px] text-[14px] font-semibold text-white sm:px-[16px] sm:py-[12px] sm:text-[16px]"
          >
            <span className="h-[14px] w-[14px] rounded-full border border-[#F0D7F5] bg-transparent" />
            No Table
          </button>

          <div className="flex w-full flex-wrap items-center gap-3 pt-2 text-[13px] font-normal text-white/90 sm:w-auto sm:gap-[20px] sm:pt-0 sm:text-[14px]">
            {legend.map((item) => (
              <span key={item.label} className="flex items-center gap-[8px]">
                <span className={`h-[12px] w-[12px] rounded-full ${item.color}`} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}