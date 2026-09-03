"use client";

import { useState } from "react";
import { Minus, Plus, X, UsersRound, Table2, ClipboardList } from "lucide-react";
import { products } from "./Data";
import { TableModal } from "./TableModal";
import { OrderModal } from "./OrderModal";
import { CustomerModal } from "./CustomerModal";

const orderTypes = ["Dine", "Take Away", "Online", "Home delivery"];
const footerActions = [
  { icon: Table2, label: "Table" },
  { icon: ClipboardList, label: "Order" },
  { icon: UsersRound, label: "Customers" },
];

// panel wrapper is anchored at page top:153 left:653 — this thumb's page coords (top:231 left:657)
// become relative offsets of top:78, left:4 within that wrapper
const SCROLL_THUMB_TOP = 231 - 153;
const SCROLL_THUMB_LEFT = 657 - 653;

export function OrderPanel() {
  const [selectedType, setSelectedType] = useState("Online");
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const cartItems = Array(6).fill(products[0]); // placeholder — wire to real cart state

  return (
    <>
      <div className="relative flex flex-col">
        {/* Order-type toggle bar — 341x20 */}
        <div
          className="flex items-center"
          style={{ width: 341, height: 20, borderRadius: 10, background: "#D2D2D2", justifyContent: "space-between" }}
        >
          {orderTypes.map((type) => {
            const active = type === selectedType;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className="flex items-center justify-center"
                style={{
                  width: 77,
                  height: 20,
                  borderRadius: 6,
                  paddingTop: 8,
                  paddingRight: 7,
                  paddingBottom: 7,
                  paddingLeft: 8,
                  background: active ? "#3B0038" : "#EFEFEF",
                }}
              >
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: 8,
                    lineHeight: "100%",
                    color: active ? "#FFFFFF" : "#3B0038",
                  }}
                >
                  {type}
                </span>
              </button>
            );
          })}
        </div>

        {/* Card — 341x546 */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            marginTop: 6,
            width: 341,
            height: 546,
            borderRadius: 15,
            border: "1px solid #C4C4C4",
            background: "#EFEFEF",
          }}
        >
          {/* Item / Quantity / Amount header */}
          <div
            className="flex shrink-0 items-center justify-between"
            style={{
              height: 29,
              paddingTop: 8,
              paddingRight: 18,
              paddingBottom: 8,
              paddingLeft: 18,
              gap: 10,
              background: "#9494945E",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
          >
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, color: "#3B0038" }}>
              Item
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, color: "#3B0038" }}>
              Quantity
            </span>
            <span style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: 10, color: "#3B0038" }}>
              Amount
            </span>
          </div>

          {/* Cart rows — scrollable */}
         {/* Cart rows — scrollable */}
<div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#EFEFEF] " style={{ padding: 6, gap: 8 }}>
  {cartItems.map((product, i) => (
    <div
      key={i}
      className="flex shrink-0 items-center"
      style={{
        width: 310,
        height: 46,
        borderRadius: 6,
        border: "1px solid #CECECE",
        paddingTop: 3,
        paddingRight: 5,
        paddingBottom: 3,
        paddingLeft: 5,
      }}
    >
      <img
        src={product.image}
        alt=""
        className="shrink-0 object-cover"
        style={{ width: 97, height: 41, borderRadius: 5 }}
      />

      {/* tight gap to image */}
      <div className="flex min-w-0 flex-1 flex-col justify-center" style={{ marginLeft: 8, gap: 4 }}>
        <p
          className="truncate"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 12, color: "#000000" }}
        >
          {product.name}
        </p>

        {/* compact inline stepper — no border box */}
        <div className="flex items-center" style={{ gap: 7 }}>
          <button
            type="button"
            className="flex h-[15px] w-[15px] items-center justify-center rounded-full"
            style={{ background: "white", border: "1px solid #C4C4C4" }}
          >
            <Minus size={9} className="text-black" />
          </button>
          <span className="text-[13px] font-medium" style={{ color: "#000000" }}>
            1
          </span>
          <button
            type="button"
            className="flex h-[15px] w-[15px] items-center justify-center rounded-full"
            style={{ background: "#670063" }}
          >
            <Plus size={9} className="text-white" />
          </button>
        </div>
      </div>

      <span
        className="shrink-0 pl-2"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: 16, color: "#000000" }}
      >
        ₹{product.price}
      </span>

      <button
        type="button"
        className="ml-[10px] flex shrink-0 items-center justify-center"
        style={{ width: 16, height: 16, borderRadius: 10, padding: 2, background: "#FF0F0F" }}
      >
        <X size={10} className="text-white" />
      </button>
    </div>
  ))}

  {/* Decorative scroll-position thumb — unchanged */}
  <div
    className="pointer-events-none absolute "
    style={{ top: SCROLL_THUMB_TOP, left: SCROLL_THUMB_LEFT, width: 3, height: 104, borderRadius: 5 }}
  />
</div>

          {/* Bottom stack: totals + action buttons + footer, 321 wide, gap 5 */}
          <div className="flex shrink-0 flex-col " style={{ width: 321, margin: "0 auto", gap: 2, paddingBottom: 10 }}>
            <div
              className="flex justify-between"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 12, color: "#000000" }}
            >
              <span>Items ({cartItems.length})</span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 10 }}>200.00</span>
            </div>

            <div
              className="flex justify-between"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 12, color: "#000000" }}
            >
              <span>Subtotal</span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 10 }}>200.00</span>
            </div>

            <div
              className="flex justify-between"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500, fontSize: 12, color: "#000000" }}
            >
              <span>VAT(0%)</span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 10 }}>0.00</span>
            </div>

            <div className="border-t" style={{ borderColor: "#878787" }} />

            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#000000" }}>
                Total
              </span>
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: 16, color: "#000000" }}>
                200.00
              </span>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                className="flex items-center justify-center text-white"
                style={{ width: 105, height: 32, borderRadius: 10, background: "#3EA200", fontSize: 12, fontWeight: 600 }}
              >
                Save
              </button>
              <button
                type="button"
                className="flex items-center justify-center text-white"
                style={{ width: 105, height: 32, borderRadius: 10, background: "#3B0038", fontSize: 12, fontWeight: 600 }}
                onClick={() => setIsOrderModalOpen(true)}
              >
                Print
              </button>
              <button
                type="button"
                className="flex items-center justify-center text-white"
                style={{ width: 105, height: 32, borderRadius: 10, background: "#FF0F0F", fontSize: 12, fontWeight: 600 }}
              >
                Cancel
              </button>
            </div>

            <div
              className="flex items-center"
              style={{
                width: 321,
                height: 64,
                borderRadius: 10,
                background: "#D2D2D2",
                justifyContent: "space-between",
                paddingTop: 8,
                paddingRight: 10,
                paddingBottom: 8,
                paddingLeft: 10,
              }}
            >
              {footerActions.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex flex-col items-center justify-center"
                  style={{
                    width: 82,
                    height: 49,
                    borderRadius: 6,
                    background: "#EFEFEF",
                    paddingTop: 8,
                    paddingRight: 7,
                    paddingBottom: 7,
                    paddingLeft: 8,
                    gap: 2,
                  }}
                  onClick={() => {
                    if (label === "Table") setIsTableModalOpen(true);
                    if (label === "Order") setIsOrderModalOpen(true);
                    if (label === "Customers") setIsCustomerModalOpen(true);
                  }}
                >
                  <Icon size={18} style={{ color: "#3B0038" }} />
                  <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: 8, color: "#3B0038" }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TableModal open={isTableModalOpen} onClose={() => setIsTableModalOpen(false)} />
      <OrderModal open={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
      <CustomerModal open={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} />
    </>
  );
}