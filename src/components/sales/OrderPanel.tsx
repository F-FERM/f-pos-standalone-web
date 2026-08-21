"use client";

import { useState } from "react";
import { Minus, Plus, X, UsersRound, Table2, ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { products } from "./Data";
import { FooterAction } from "./FooterSection";
import { TableModal } from "./TableModal";
import { OrderModal } from "./OrderModal";
import { CustomerModal } from "./CustomerModal";


export function OrderPanel() {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  return (
    <>
      <section
        className="
          relative
          h-[min(564px,calc(100vh-220px))]
          min-h-[420px]
          w-full
          min-w-0
          overflow-hidden
          rounded-[15px]
          border
          border-primary
          bg-[#170716]
        "
      >
        {/* Table header */}
        <div
          className="
            flex
            h-[29px]
            items-center
            justify-between
            rounded-t-[14px]
            border-b
            border-primary
            bg-[#9A37965E]
            px-3
            text-[10px]
            sm:px-[18px]
          "
        >
          <span className="w-[70px] text-[10px] font-normal text-[#FF87FA] sm:w-[84px]">
            Item
          </span>
          <span className="w-[60px] text-[10px] font-normal text-[#FF87FA] sm:w-[70px]">
            Quantity
          </span>
          <span className="text-[10px] font-normal text-[#FF87FA]">Amount</span>
        </div>

        {/* Cart item */}
        <div
          className="
            mx-[5px]
            mt-[17px]
            flex
            h-[64px]
            items-center
            rounded-[6px]
            border
            border-secondary
            bg-[#170716]
            px-[5px]
          "
        >
          <img
            src={products[0].image}
            alt=""
            className="h-[48px] w-[48px] rounded-[5px] object-cover"
          />

          <div className="ml-[7px] min-w-0 flex-1">
            <p className="max-w-[95px] truncate text-[10px] font-medium leading-[15px] text-white">
              Butter scotch crunch
            </p>

            <div className="mt-[4px] flex items-center gap-[7px]">
              <button
                type="button"
                className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-white"
              >
                <Minus size={10} className="text-black" />
              </button>

              <span className="text-[13px] text-white">1</span>

              <button
                type="button"
                className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-secondary"
              >
                <Plus size={10} className="text-white" />
              </button>
            </div>
          </div>

          <span className="mr-[10px] shrink-0 text-[13px] font-semibold text-white sm:text-[14px]">
            ₹200
          </span>

          <button
            type="button"
            className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full bg-red-500"
          >
            <X size={10} className="text-white" />
          </button>
        </div>

        {/* Bottom calculation */}
        <div className="absolute bottom-[72px] left-0 right-0 px-[7px]">
          <div className="space-y-[7px] px-[7px]">
            <div className="flex justify-between text-[12px] text-white">
              <span>Items (1)</span>
              <span>200.00</span>
            </div>

            <div className="flex justify-between text-[12px] text-white">
              <span>Subtotal</span>
              <span>200.00</span>
            </div>

            <div className="flex justify-between text-[12px] text-white">
              <span>VAT(0%)</span>
              <span>0.00</span>
            </div>

            <div className="my-[7px] border-t border-[#777777]" />

            <div className="flex justify-between text-[14px] font-semibold text-white">
              <span>Total</span>
              <span>200.00</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-[9px] grid grid-cols-3 gap-[9px]">
            <Button className="h-[33px] rounded-[9px] bg-[#3EA200] text-[11px] hover:bg-[#3EA200]/90 sm:text-[12px]">
              Save
            </Button>

            <Button className="h-[33px] rounded-[9px] bg-white text-[11px] text-black hover:bg-white/90 sm:text-[12px]">
              Print
            </Button>

            <Button className="h-[33px] rounded-[9px] bg-[#FF0F0F] text-[11px] hover:bg-[#FF0F0F]/90 sm:text-[12px]">
              Cancel
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-[8px] left-[7px] right-[7px] flex h-[54px] items-center justify-around rounded-[10px] bg-black xs:h-[58px]">
          <FooterAction icon={Table2} label="Table" onClick={() => setIsTableModalOpen(true)} />
          <FooterAction
            icon={ClipboardList}
            label="Order"
            onClick={() => setIsOrderModalOpen(true)}
          />
          <FooterAction
            icon={UsersRound}
            label="Customers"
            onClick={() => setIsCustomerModalOpen(true)}
          />
        </div>
      </section>

      <TableModal open={isTableModalOpen} onClose={() => setIsTableModalOpen(false)} />
      <OrderModal open={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
      <CustomerModal open={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} />
    </>
  );
}