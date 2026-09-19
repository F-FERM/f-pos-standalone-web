"use client";

import { getOrderById } from "@/src/api/order";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Clock, Package, ShoppingBag, User, Utensils, X } from "lucide-react";

type OrderDetailsModalProps = {
  orderId: string | null;
  onClose: () => void;
};

/**
 * One grid template shared by the table header AND every item row,
 * so ITEM / PRICE / QTY / TOTAL always line up exactly.
 *   item  -> takes all remaining space
 *   price -> 96px, right aligned
 *   qty   -> 64px, centered
 *   total -> 104px, right aligned
 */
const ROW_GRID =
  "grid grid-cols-[minmax(0,1fr)_96px_64px_104px] items-center gap-3";

export function OrderDetailsModal({ orderId, onClose }: OrderDetailsModalProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orderById", orderId],
    queryFn: () => getOrderById(orderId as string),
    enabled: !!orderId,
  });

  if (!orderId) return null;

  const order = data?.data;

  // Discount is only shown when the order actually has one.
  // Adjust the field name if your order response uses a different one.
  const discount =
    Number((order as any)?.discount ?? (order as any)?.discountAmount ?? 0) ||
    0;

  return (
    // The modal never grows taller than the screen (max-h-full). When there are
    // many items only the item list scrolls; header, order info, summary and
    // close button always stay visible.
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px]">
      <div className="flex h-full items-center justify-center p-4">
        <div className="relative flex max-h-full w-full max-w-[800px] flex-col rounded-[20px] border border-[#E0E0E0] bg-[#EFEFEF] p-4 shadow-2xl sm:p-8">
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
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              {/* Top info section: 3 equal columns on sm+, stacked on mobile */}
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-[#D0D0D0] bg-white p-4 sm:grid-cols-3 sm:p-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5F0FF] text-[#133FCD]">
                    <Clock size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium leading-tight text-[#848484]">
                      Order Date
                    </div>
                    <div className="text-sm font-bold leading-tight text-black sm:text-base">
                      {dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FCE5FF] text-[#B754CA]">
                    <User size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium leading-tight text-[#848484]">
                      Table
                    </div>
                    <div className="text-sm font-bold leading-tight text-black sm:text-base">
                      No table
                    </div>
                  </div>
                </div>

                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5F8ED] text-[#47A469]">
                    <ShoppingBag size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium leading-tight text-[#848484]">
                      Order
                    </div>
                    <div className="truncate text-sm font-bold leading-tight text-black sm:text-base">
                      #{order.invoiceNo || order._id.slice(-5)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#3B0038] px-4 py-2 text-sm font-bold leading-none text-white shadow-sm">
                  <Package size={16} />
                  {order.customerTypeName || "Dine-In"}
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#AA7200] px-5 py-2 text-sm font-bold leading-none text-white shadow-sm">
                  <span>🕒</span>
                  {order.status}
                </div>
              </div>

              {/* Table card */}
              <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#D0D0D0] bg-white p-4 sm:p-5">
                {/* Scroll area (vertical for many items, horizontal on very narrow screens).
                    The header lives INSIDE it and is sticky, so it always has exactly
                    the same width as the rows, even when a scrollbar appears. */}
                <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin]">
                  <div className="min-w-[520px]">
                    {/* Table Header (sticky)
                        border-transparent + px-3 gives it the same inner offset as the rows */}
                    <div
                      className={`${ROW_GRID} sticky top-0 z-10 border border-transparent bg-white px-3 pb-2 text-xs font-bold tracking-wider text-[#848484]`}
                    >
                      <div className="flex items-center gap-2">
                        <Package size={14} />
                        ITEM
                      </div>
                      <div className="text-right">PRICE</div>
                      <div className="text-center">QTY</div>
                      <div className="text-right">TOTAL</div>
                    </div>

                    {/* Items List */}
                    <div className="flex flex-col gap-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className={`${ROW_GRID} rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] p-3 transition-colors`}
                        >
                          {/* Item */}
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-[#EFEFEF] text-[#848484]">
                              <Utensils size={20} />
                            </div>
                            <div className="flex min-w-0 flex-col">
                              <span className="break-words font-bold text-black">
                                {item.foodName}
                              </span>
                              {item.portionName && (
                                <span className="text-xs text-[#848484]">
                                  Portion: {item.portionName}
                                </span>
                              )}
                              {item.choices && item.choices.length > 0 && (
                                <span className="text-xs text-[#848484]">
                                  Choices: {item.choices.join(", ")}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="whitespace-nowrap text-right text-sm font-bold tabular-nums text-black">
                            AED {item.unitPrice?.toFixed(2)}
                          </div>

                          {/* Qty */}
                          <div className="flex justify-center">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#133FCD] text-xs font-bold text-white shadow-sm">
                              {item.quantity}
                            </div>
                          </div>

                          {/* Total */}
                          <div className="whitespace-nowrap text-right text-sm font-bold tabular-nums text-black">
                            AED {item.totalPrice?.toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary: right edge lines up with the TOTAL column above
                    (rows have 1px border + 12px padding, so px-[13px]) */}
                <div className="mt-4 flex shrink-0 justify-end border-t border-[#F0F0F0] px-[13px] pt-4">
                  {/* One shared block: every label starts at the same left edge,
                      every amount ends at the same right edge */}
                  <div className="flex w-full max-w-[240px] flex-col gap-3">
                    <div className="flex items-center justify-between gap-4 text-sm font-bold">
                      <span className="text-[#848484]">Subtotal:</span>
                      <span className="whitespace-nowrap tabular-nums text-black">
                        AED {order.subtotal?.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4 text-sm font-bold">
                      <span className="text-[#848484]">VAT:</span>
                      <span className="whitespace-nowrap tabular-nums text-black">
                        AED {order.vatAmount?.toFixed(2)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex items-center justify-between gap-4 text-sm font-bold">
                        <span className="text-[#848484]">Discount:</span>
                        <span className="whitespace-nowrap tabular-nums text-[#FF3B3B]">
                          - AED {discount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="mt-1 flex items-center justify-between gap-4 border-t border-[#E0E0E0] pt-3 text-base font-bold">
                      <span className="text-[#848484]">Total:</span>
                      <span className="whitespace-nowrap tabular-nums text-black">
                        AED {order.totalAmount?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}