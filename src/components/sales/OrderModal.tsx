"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { SearchInput } from "../common/SearchInput";



type OrderModalProps = {
  open: boolean;
  onClose: () => void;
};

const orderTabs = ["On Going", "Completed Order", "Canceled Order"];
const orderTypes = ["Dine In", "Take Away", "Home Delivery", "Online"];

export function OrderModal({ open, onClose }: OrderModalProps) {
  const [activeTab, setActiveTab] = useState(orderTabs[0]);
  const [activeType, setActiveType] = useState(orderTypes[0]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[900px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute z-10 right-2 top-2 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
          aria-label="Close orders modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="max-h-[90vh] w-full overflow-y-auto rounded-[20px] border border-gray-600 bg-[#2C192BE5] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px] sm:py-[26px]">
          <div className="mb-[18px] flex items-center justify-between">
            <h3 className="text-[18px] font-semibold text-white sm:text-[22px]">Orders</h3>
          </div>

        <div className="mb-[18px] flex flex-wrap items-center gap-[9px]">
          {orderTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-center rounded-[7px] border px-[10px] py-[7px] text-[13px] font-medium transition sm:px-[12px] sm:py-[9px] sm:text-[18px] ${
                activeTab === tab
                  ? "border-[#D9D9D9] bg-[#FFFFFF29] text-white"
                  : "border-[#D9D9D9]/70 bg-transparent text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-[18px] flex flex-wrap items-center gap-[9px]">
          {orderTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setActiveType(type)}
              className={`flex items-center justify-center rounded-[7px] border px-[10px] py-[7px] text-[13px] font-medium transition sm:px-[12px] sm:py-[9px] sm:text-[18px] ${
                activeType === type
                  ? "border-[#D9D9D9] bg-[#FFFFFF29] text-white"
                  : "border-[#D9D9D9]/70 bg-transparent text-white"
              }`}
            >
              {type}
            </button>
          ))}

          <SearchInput variant="panel" className="w-full sm:ml-auto sm:w-[270px]" />
        </div>

        <div className="rounded-[14px] bg-[#2D0D2F]/40 p-[14px]">
          <div className="flex min-h-[160px] items-center justify-center text-[14px] font-normal text-[#9A9A9A] sm:min-h-[200px] sm:text-[18px]">
            No orders for {activeType}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}