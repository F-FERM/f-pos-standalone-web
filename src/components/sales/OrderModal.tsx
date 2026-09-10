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
  width?: number;
};

function FilterButton({ label, active, onClick, width }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center justify-center whitespace-nowrap"
      style={{
        width,
        height: 38,
        borderRadius: 7,
        border: active ? "1px solid #BFBFBF" : "1px solid #9C9C9C",
        background: active ? "#450042" : "#EFEFEF",
        boxShadow: active ? "0px 0px 14px 0px #BD29B740" : "none",
        paddingTop: 6,
        paddingRight: 14,
        paddingBottom: 6,
        paddingLeft: 14,
        gap: 9,
        fontFamily: "Poppins, sans-serif",
        fontWeight: 600,
        fontSize: 16,
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
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px]">
      {/* outer positioned wrapper — no overflow clipping, so the close button can sit outside the card */}
      <div
        className="relative"
        style={{
          position: "absolute",
          top: 111,
          left: 106,
          width: 812,
          height: 558,
        }}
      >
        {/* close button — sits on the outer wrapper, never clipped */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center"
          style={{
            position: "absolute",
            top: -14,
            right: -14,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#FFFFFF",
            border: "1px solid #E0E0E0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            color: "#FF3B3B",
            zIndex: 10,
          }}
          aria-label="Close orders modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* card — 812x558, radius20, bg #EFEFEF, padding 26/34, gap16, clips its own content only */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#EFEFEF",
            border: "1px solid #EFEFEF",
            borderRadius: 20,
            backdropFilter: "blur(4px)",
            paddingTop: 26,
            paddingRight: 34,
            paddingBottom: 26,
            paddingLeft: 34,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            overflow: "hidden",
          }}
        >
          {/* title */}
          <h3
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: 22,
              lineHeight: "100%",
              letterSpacing: 0,
              color: "#000000",
            }}
          >
            Orders
          </h3>

          {/* order status tabs */}
          <div className="flex flex-wrap items-center" style={{ gap: 9 }}>
            {orderTabs.map((tab) => (
              <FilterButton
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                width={164}
              />
            ))}
          </div>

          {/* order type filters + search — grid: buttons auto-sized, search fixed width at the end */}
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: "repeat(4, auto) 1fr",
              gap: 9,
            }}
          >
            {orderTypes.map((type) => (
              <FilterButton
                key={type}
                label={type}
                active={activeType === type}
                onClick={() => setActiveType(type)}
              />
            ))}

            <SearchInput variant="panel" className="justify-self-end" />
          </div>

          {/* orders list / empty state — small gap, blends with bg */}
          <div className="flex items-center justify-center mt-4">
            <span
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "100%",
                letterSpacing: 0,
                color: "#848484",
              }}
            >
              No orders for {activeType}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}