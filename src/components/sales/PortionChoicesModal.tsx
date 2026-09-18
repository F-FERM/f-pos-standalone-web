"use client";

import { Food, Portion } from "@/src/interfaces/food/ListFoodResponse";
import { ChevronLeft, ChevronRight, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CartItemType } from "./Types";

type PortionChoicesModalProps = {
  open: boolean;
  onClose: () => void;
  product: Food | null;
  onAdd: (items: CartItemType[]) => void;
  tableId?: string | null;
};

export function PortionChoicesModal({ open, onClose, product, onAdd }: PortionChoicesModalProps) {
  const [activeTab, setActiveTab] = useState<"portions" | "choices">("portions");
  const [localCart, setLocalCart] = useState<CartItemType[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);

  useEffect(() => {
    if (open && product) {
      if (!product.isPortionEnabled && (!product.portions || product.portions.length === 0)) {
        setLocalCart([{
          id: product._id,
          food: product,
          portion: null,
          choices: [],
          qty: 1,
        }]);
      } else {
        setLocalCart([]);
      }
      setSelectedChoices([]);
    }
  }, [open, product]);

  if (!open || !product) return null;

  const handleAddPortion = (portion: Portion) => {
    setLocalCart((prev) => {
      const existing = prev.find((item) => item.portion?._id === portion._id && item.choices.length === 0);
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: `${product._id}-${portion._id}`,
          food: product,
          portion: portion,
          choices: [],
          qty: 1,
        },
      ];
    });
  };

  const handleAddChoice = (choice: string) => {
    setSelectedChoices((prev) => {
      if (prev.includes(choice)) return prev;
      return [...prev, choice];
    });
  };

  const handleRemoveChoice = (choice: string) => {
    setSelectedChoices((prev) => prev.filter((c) => c !== choice));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setLocalCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, qty: Math.max(1, item.qty + delta) };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setLocalCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleConfirmAdd = () => {
    if (localCart.length > 0) {
      const itemsToAdd = localCart.map((item) => ({
        ...item,
        choices: selectedChoices,
      }));
      onAdd(itemsToAdd);
    }
    setLocalCart([]);
    setSelectedChoices([]);
    onClose();
  };

  const handleClose = () => {
    setLocalCart([]);
    setSelectedChoices([]);
    onClose();
  };

  const grandTotal = localCart.reduce(
    (sum, item) => sum + (item.portion?.basePrice || product.basePrice) * item.qty,
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto  p-3 backdrop-blur-[3px] sm:p-4 transform-gpu"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[900px] animate-[fadeIn_0.18s_ease-out] flex-col gap-4 rounded-2xl border border-[#E0E0E0] bg-[#EFEFEF] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:gap-5 sm:rounded-[20px] sm:p-6 sm:px-[30px]"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#A6A6A6] bg-white text-[#FF3B3B] shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-transform hover:scale-110 active:scale-95 sm:-right-3 sm:-top-3 sm:h-9 sm:w-9"
          aria-label="Close portion modal"
        >
          <X size={18} strokeWidth={2.5} className="sm:hidden" />
          <X size={20} strokeWidth={2.5} className="hidden sm:block" />
        </button>

        {/* Title */}
        <div>
          <h3 className="text-lg font-bold leading-none tracking-tight text-black sm:text-[22px]">
            {product.name}
          </h3>
          <p className="mt-1.5 text-[14px] text-[#767676]">
            Choose a portion size and quantity to add to the order.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#DADADA] pb-4 sm:gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("portions")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-colors sm:px-6 sm:py-2.5 sm:text-sm ${
              activeTab === "portions"
                ? "bg-[#3B0038] text-white"
                : "border border-[#9C9C9C] bg-white text-black hover:bg-[#F5F5F5]"
            }`}
          >
            Portions
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("choices")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition-colors sm:px-6 sm:py-2.5 sm:text-sm ${
              activeTab === "choices"
                ? "bg-[#3B0038] text-white"
                : "border border-[#9C9C9C] bg-white text-black hover:bg-[#F5F5F5]"
            }`}
          >
            Choices
          </button>
        </div>

        {/* Content */}
        <div className="flex min-h-[280px] flex-col gap-4 md:flex-row md:gap-6">
          {/* Left panel: Portions/Choices list */}
          <div className="flex w-full flex-col gap-3 md:w-1/3">
            {activeTab === "portions" &&
              (product.portions && product.portions.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:flex md:flex-col">
                  {product.portions.map((portion) => (
                    <button
                      key={portion._id}
                      type="button"
                      onClick={() => handleAddPortion(portion)}
                      className="group flex flex-col items-center justify-center gap-1 rounded-[14px] border-2 border-transparent bg-white px-3 py-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[#3B0038] hover:shadow-md active:scale-95"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3B0038] to-[#8A2BE2] text-white shadow-inner">
                        <ShoppingBag size={16} />
                      </span>
                      <span className="mt-1 text-center text-sm font-bold text-black">
                        {portion.name}
                      </span>
                      <span className="text-xs font-medium text-[#767676]">
                        AED {portion.basePrice.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-[14px] bg-white text-sm text-[#878787] shadow-sm">
                  No portions available.
                </div>
              ))}

            {activeTab === "choices" &&
              (product.choices && product.choices.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:flex md:flex-col">
                  {product.choices.map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleAddChoice(choice)}
                      className="group flex flex-col items-center justify-center gap-1 rounded-[14px] border-2 border-transparent bg-white px-3 py-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[#3B0038] hover:shadow-md active:scale-95"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#3B0038] to-[#8A2BE2] text-white shadow-inner">
                        <ShoppingBag size={16} />
                      </span>
                      <span className="mt-1 text-center text-sm font-bold text-black">
                        {choice}
                      </span>
                      <span className="text-xs font-medium text-[#767676]">
                        AED {product.basePrice.toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-[14px] bg-white text-sm text-[#878787] shadow-sm">
                  No choices available.
                </div>
              ))}
          </div>

          {/* Right panel: Selected Items */}
          <div className="flex w-full flex-col rounded-[16px] border border-[#DADADA] bg-white p-4 shadow-sm sm:p-5 md:w-2/3">
            <h4 className="mb-4 text-[15px] font-semibold text-black sm:text-base">
              Items
            </h4>

            <div className="mb-3 flex justify-between px-2 text-[11px] font-semibold text-[#878787] sm:text-xs">
              <span className="w-1/2">Name</span>
              <span className="w-16 text-center sm:w-20">Qty</span>
              <span className="hidden w-20 text-right sm:block">Price</span>
              <span className="w-16 text-right sm:w-20">Total</span>
              <span className="w-6 sm:w-8"></span>
            </div>

            <div className="mb-4 flex max-h-[250px] flex-1 flex-col gap-2 overflow-y-auto custom-scrollbar">
              {localCart.length === 0 && (
                <div className="mt-2 px-2 text-sm text-[#A0A0A0]">No items selected</div>
              )}
              {localCart.map((item) => {
                const itemPrice = item.portion?.basePrice || product.basePrice;
                const total = itemPrice * item.qty;
                return (
                  <div
                    key={item.id}
                    className="flex items-center rounded-lg px-2 py-2 text-sm text-black transition-colors hover:bg-[#F5F5F5]"
                  >
                    <span className="w-1/2 truncate pr-2 font-medium">
                      {product.name} {item.portion ? `(${item.portion.name})` : ""}
                    </span>
                    <div className="flex w-16 items-center justify-center gap-1.5 sm:w-20 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, -1)}
                        className="rounded-full border border-[#D0D0D0] bg-white p-1 text-black hover:bg-[#EFEFEF]"
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <span className="w-4 text-center font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQty(item.id, 1)}
                        className="rounded-full border border-[#D0D0D0] bg-white p-1 text-black hover:bg-[#EFEFEF]"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                    <span className="hidden w-20 text-right text-[#767676] sm:block">
                      {itemPrice.toFixed(2)}
                    </span>
                    <span className="w-16 text-right font-semibold sm:w-20">
                      {total.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="flex w-6 justify-end text-[#B0B0B0] hover:text-[#FF3B3B] sm:w-8"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>

            {selectedChoices.length > 0 && (
              <>
                <h4 className="mb-2 mt-4 text-[15px] font-semibold text-black sm:text-base">
                  Choices
                </h4>
                <div className="mb-4 flex flex-col gap-2">
                  {selectedChoices.map((choice) => (
                    <div
                      key={choice}
                      className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-[#5D5D5D] transition-colors hover:bg-[#F5F5F5]"
                    >
                      <span className="truncate pr-2 font-medium">{choice}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChoice(choice)}
                        className="flex w-6 justify-end text-[#B0B0B0] hover:text-[#FF3B3B] sm:w-8"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-end border-t border-[#E4E4E4] pt-4">
              <span className="text-sm font-bold text-black sm:text-base">
                Grand Total:{" "}
                <span className="text-[#3B0038]">AED {grandTotal.toFixed(2)}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-1 flex justify-end">
          <button
            type="button"
            onClick={handleConfirmAdd}
            disabled={localCart.length === 0}
            className="w-full rounded-lg bg-[#3B0038] px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#4A0047] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            ADD
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c4c4c4;
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}