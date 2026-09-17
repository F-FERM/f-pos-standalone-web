"use client";

import { getOrderById } from "@/src/api/order";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Clock, Package, ShoppingBag, User, Utensils, X } from "lucide-react";

type OrderDetailsModalProps = {
  orderId: string | null;
  onClose: () => void;
};

export function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orderById", orderId],
    queryFn: () => getOrderById(orderId as string),
    enabled: !!orderId,
  });

  if (!orderId) return null;

  const order = data?.data;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-[2px]">
      <div className="relative flex w-full max-w-[800px] flex-col rounded-[20px] border border-[#E0E0E0] bg-[#EFEFEF] p-6 shadow-2xl sm:p-8">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#D0D0D0] bg-white text-[#FF3B3B] shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Close"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        {isLoading ? (
          <div className="flex h-[400px] items-center justify-center">
            <span className="text-[#848484]">Loading order details...</span>
          </div>
        ) : isError || !order ? (
          <div className="flex h-[400px] items-center justify-center">
            <span className="text-[#FF3B3B]">Failed to load order.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Top info section */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#D0D0D0] bg-white p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5F0FF] text-[#133FCD]">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#848484]">Order Date</div>
                  <div className="text-sm font-bold text-black sm:text-base">
                    {dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCE5FF] text-[#B754CA]">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#848484]">Table</div>
                  <div className="text-sm font-bold text-black sm:text-base">
                    No table
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E5F8ED] text-[#47A469]">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#848484]">Order</div>
                  <div className="text-sm font-bold text-black sm:text-base">
                    #{order.invoiceNo || order._id.slice(-5)}
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-full bg-[#3B0038] px-4 py-2 text-sm font-bold text-white shadow-sm">
                <Package size={16} />
                {order.customerTypeName || "Dine-In"}
              </div>
              <div className="rounded-full bg-[#AA7200] px-5 py-2 text-sm font-bold text-white shadow-sm">
                <span className="mr-2">🕒</span>
                {order.status}
              </div>
            </div>

            {/* Table */}
            <div className="mt-2 flex flex-col rounded-xl border border-[#D0D0D0] bg-white p-4 sm:p-5">
              {/* Table Header */}
              <div className="mb-3 flex justify-between px-2 text-xs font-bold tracking-wider text-[#848484]">
                <div className="flex w-1/2 items-center gap-2">
                  <Package size={14} /> ITEM
                </div>
                <div className="w-1/4 text-center sm:w-1/5">PRICE</div>
                <div className="w-16 text-center sm:w-20">QTY</div>
                <div className="w-1/4 text-right sm:w-1/5">TOTAL</div>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] p-3 transition-colors"
                  >
                    <div className="flex w-1/2 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#EFEFEF] text-[#848484]">
                        <Utensils size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-black">{item.foodName}</span>
                        {item.portionName && (
                          <span className="text-xs text-[#848484]">Portion: {item.portionName}</span>
                        )}
                        {item.choices && item.choices.length > 0 && (
                          <span className="text-xs text-[#848484]">Choices: {item.choices.join(', ')}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="w-1/4 text-center text-sm font-bold text-black sm:w-1/5">
                      AED {item.unitPrice?.toFixed(2)}
                    </div>
                    
                    <div className="flex w-16 justify-center sm:w-20">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#133FCD] text-xs font-bold text-white shadow-sm">
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="w-1/4 text-right text-sm font-bold text-black sm:w-1/5">
                      AED {item.totalPrice?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 flex flex-col items-end gap-3 px-2">
                <div className="flex w-[200px] justify-between text-sm font-bold">
                  <span className="text-[#848484]">Subtotal:</span>
                  <span className="text-black">AED {order.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex w-[200px] justify-between text-sm font-bold">
                  <span className="text-[#848484]">VAT:</span>
                  <span className="text-black">AED {order.vatAmount?.toFixed(2)}</span>
                </div>
                <div className="mt-1 flex w-[200px] justify-between text-base font-bold">
                  <span className="text-[#848484]">Total:</span>
                  <span className="text-black">AED {order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
