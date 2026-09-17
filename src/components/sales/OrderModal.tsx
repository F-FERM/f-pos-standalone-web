"use client";

import { getOrders, Item, ListOrderFilteredResponse, updateOrder, type CreateOrderPayload } from "@/src/api/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Eye, Pen, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { CustomerTypeEnum, OrderStatus, OrderTab } from "./Types";

type OrderModalProps = {
  open: boolean;
  onClose: () => void;
  onEdit: (orderId: string) => void;
};

const orderTabs = [
  { label: "On Going Order", value: OrderTab.ONGOING },
  { label: "Completed Order", value: OrderTab.COMPLETED },
  { label: "Cancelled Order", value: OrderTab.CANCELLED },
];

const customerTypes = [
  { label: "Dine-In", value: CustomerTypeEnum.DINE_IN },
  { label: "Take Away", value: CustomerTypeEnum.TAKE_AWAY },
  { label: "Home Delivery", value: CustomerTypeEnum.HOME_DELIVERY },
  { label: "Online", value: CustomerTypeEnum.ONLINE },
];

function formatElapsedTime(dateString: string) {
  const diff = dayjs().diff(dayjs(dateString), "minute");
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  if (hours > 0) return `${hours} hr ${minutes} min`;
  return `${minutes} min`;
}

export function OrderModal({ open, onClose, onEdit }: OrderModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<OrderTab>(OrderTab.ONGOING);
  const [activeType, setActiveType] = useState<CustomerTypeEnum>(CustomerTypeEnum.DINE_IN);
  const [search, setSearch] = useState("");
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["orders", activeTab, activeType],
    queryFn: () => getOrders(activeTab, activeType),
    enabled: open,
  });

  interface UpdateOrderVariables {
    order: ListOrderFilteredResponse["data"][0];
    status: OrderStatus;
  }

  const updateMutation = useMutation({
    mutationFn: ({ order, status }: UpdateOrderVariables) => {
      const payload: CreateOrderPayload = {
        customerTypeId: typeof order.customerTypeId === 'string' ? order.customerTypeId : order.customerTypeId?._id,
        vat: order.vatAmount || 0,
        subTotal: order.subtotal || 0,
        total: order.totalAmount || 0,
        discount: 0,
        status: status,
        items: order.items?.map((item:Item) => ({
          foodId: typeof item.foodId === 'string' ? item.foodId : item.foodId?._id,
          portion: item.portionId || null,
          price: item.unitPrice || 0,
          originalPrice: item.unitPrice || 0,
          qty: item.quantity || 1,
          total: item.totalPrice || 0,
          foodName: item.foodName || '',
          choices: item.choices || [],
        })) || [],
      };
      
      // If order has online platforms or delivery details, we could map them here if needed
      if (order.customerId) payload.customerId = order.customerId;
      if (order.onlinePlatform) payload.onlinePlatform = order.onlinePlatform;
      if (order.deliveryDetails) payload.deliveryDetails = order.deliveryDetails;

      return updateOrder(order._id, payload);
    },
    onSuccess: () => {
      toast.success("Order status updated!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => {
      toast.error("Failed to update order status");
    }
  });

  const handleUpdateStatus = (order: any, status: OrderStatus) => {
    updateMutation.mutate({ order, status });
  };

  if (!open) return null;

  const orders = data?.data || [];
  const filteredOrders = orders.filter((o) =>
    o.invoiceNo?.toLowerCase().includes(search.toLowerCase()) || 
    o._id.toLowerCase().includes(search.toLowerCase())
  );
  
  // The API returns meta.count for the current tab + type combo.
  const currentCount = data?.meta?.count || 0;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-[2px]">
        {/* Modal Container */}
        <div className="relative flex w-full max-w-[1000px] flex-col gap-6 rounded-[20px] border border-[#E0E0E0] bg-[#EFEFEF] p-6 shadow-2xl sm:p-8">
          
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-black sm:text-3xl">Orders</h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D0D0D0] bg-white text-[#FF3B3B] shadow-sm transition-colors hover:bg-gray-50"
              aria-label="Close"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Main Order Tabs */}
          <div className="flex flex-wrap gap-3">
            {orderTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-md px-6 py-2.5 text-sm font-semibold transition-colors sm:text-base ${
                  activeTab === tab.value
                    ? "bg-[#3B0038] text-white"
                    : "border border-[#9C9C9C] bg-white text-black hover:bg-[#F5F5F5]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Customer Type Sub-Tabs + Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              {customerTypes.map((type) => {
                const isActive = activeType === type.value;
                const count = isActive ? currentCount : 0;
                return (
                  <div key={type.value} className="relative">
                    <button
                      onClick={() => setActiveType(type.value)}
                      className={`rounded-md border px-4 py-1.5 text-sm font-semibold transition-colors sm:text-base ${
                        isActive
                          ? "border-[#BFBFBF] bg-[#450042] text-white shadow-[0_0_14px_rgba(189,41,183,0.25)]"
                          : "border-[#9C9C9C] bg-[#EFEFEF] text-black hover:bg-[#E5E5E5]"
                      }`}
                    >
                      {type.label}
                    </button>
                    {/* Badge */}
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[#FF0F0F] text-[10px] font-bold text-white shadow-sm">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full max-w-[280px]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#848484" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search here"
                className="w-full rounded-lg border border-[#D5D5D5] bg-[#E5E5E5] py-2.5 pl-10 pr-4 text-sm text-[#848484] placeholder-[#848484] focus:border-[#BFBFBF] focus:outline-none"
              />
            </div>
          </div>

          {/* Orders Grid */}
          <div className="mt-2 min-h-[300px]">
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <span className="text-[#848484]">Loading orders...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex h-[300px] items-center justify-center">
                <span className="text-[#848484]">No orders found for {customerTypes.find(t => t.value === activeType)?.label}.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="flex flex-col overflow-hidden rounded-xl border border-[#D0D0D0] bg-white shadow-sm">
                    {/* Top Info */}
                    <div className="flex justify-between border-b border-[#F0F0F0] p-3">
                      <span className="font-bold text-black">#{order.invoiceNo || order._id.slice(-5)}</span>
                      <span className="text-xs text-[#848484]">{formatElapsedTime(order.createdAt)}</span>
                    </div>

                    {/* Icon & Details */}
                    <div className="px-3 pb-4 pt-3">
                    
                      <div className="mt-4 flex items-center justify-between">
                        <button 
                          onClick={() => onEdit(order._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#D0D0D0] bg-gray-50 text-gray-600 hover:bg-gray-100"
                          title="Edit Order"
                        >
                          <Pen size={16} />
                        </button>
                        <span className="text-lg font-bold text-black sm:text-xl">
                          {order.totalAmount?.toFixed(2) ?? '0.00'}
                        </span>
                        <button 
                          onClick={() => setViewOrderId(order._id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#D0D0D0] bg-gray-50 text-gray-600 hover:bg-gray-100"
                          title="View Order"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex border-t border-[#F0F0F0] bg-gray-50">
                      <button 
                        onClick={() => handleUpdateStatus(order, OrderStatus.PRINTED)}
                        className="flex-1 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                      >
                        Print
                      </button>
                      <div className="w-px bg-[#F0F0F0]"></div>
                      <button 
                        onClick={() => handleUpdateStatus(order, OrderStatus.COMPLETED)}
                        className="flex-1 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Sub-modal for viewing order details */}
      <OrderDetailsModal 
        orderId={viewOrderId} 
        onClose={() => setViewOrderId(null)} 
      />
    </>
  );
}