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

type FilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center justify-center gap-[9px] whitespace-nowrap rounded-[7px] px-3.5 py-[6px] font-['Poppins',sans-serif] text-sm font-semibold sm:text-base"
      style={{
        border: active ? "1px solid #BFBFBF" : "1px solid #9C9C9C",
        background: active ? "#450042" : "#EFEFEF",
        boxShadow: active ? "0px 0px 14px 0px #BD29B740" : "none",
        color: active ? "#FFFFFF" : "#000000",
      }}
    >
      {label}
    </button>
  );
}

export function OrderModal({ open, onClose }: OrderModalProps) {
  const [activeTab, setActiveTab] = useState(orderTabs[0]);
  const [activeType, setActiveType] = useState(orderTypes[0]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-[2px]">
      {/* outer positioned wrapper — fluid width capped at 812px, height follows content */}
      <div className="relative w-full max-w-[812px]">
        {/* close button — sits on the outer wrapper, never clipped */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E0E0] bg-white text-[#FF3B3B] shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
          aria-label="Close orders modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* card — fluid, scrolls internally if content exceeds viewport height */}
        <div className="flex max-h-[85vh] w-full flex-col gap-4 overflow-y-auto rounded-[20px] border border-[#EFEFEF] bg-[#EFEFEF] p-5 backdrop-blur-[4px] sm:px-[34px] sm:py-[26px]">
          {/* title */}
          <h3 className="font-['Poppins',sans-serif] text-lg font-semibold leading-none text-black sm:text-[22px]">
            Orders
          </h3>

          {/* order status tabs */}
          <div className="flex flex-wrap items-center gap-[9px]">
            {orderTabs.map((tab) => (
              <FilterButton
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>

          {/* order type filters + search — wrap freely, search takes its own row on mobile */}
          <div className="flex flex-wrap items-center gap-[9px]">
            {orderTypes.map((type) => (
              <FilterButton
                key={type}
                label={type}
                active={activeType === type}
                onClick={() => setActiveType(type)}
              />
            ))}

            <div className="ml-auto w-full sm:w-auto">
              <SearchInput variant="panel" />
            </div>
          </div>

          {/* orders list / empty state */}
          <div className="mt-4 flex min-h-[120px] items-center justify-center">
            <span className="font-['Poppins',sans-serif] text-sm font-normal leading-none text-[#848484]">
              No orders for {activeType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}