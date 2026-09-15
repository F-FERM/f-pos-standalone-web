"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Minus,
  Plus,
  X,
  UsersRound,
  Table2,
  ClipboardList,
} from "lucide-react";

import { createOrder, type OrderStatus } from "@/src/api/order";
import { TableModal } from "./TableModal";
import { OrderModal } from "./OrderModal";
import { CustomerModal } from "./CustomerModal";
import { CustomerTypeValue } from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import { ListCustomerTypeApi } from "@/src/api/customer-type/api/GetAll";
import { ListFoodApi } from "@/src/api/food/api/GetAll";
import { Food } from "@/src/interfaces/food/ListFoodResponse";

const CUSTOMER_TYPE_LABELS: Record<CustomerTypeValue, string> = {
  DINE_IN: "Dine",
  TAKE_AWAY: "Take Away",
  ONLINE: "Online",
  HOME_DELIVERY: "Home delivery",
};
const footerActions = [
  { icon: Table2, label: "Table" },
  { icon: ClipboardList, label: "Order" },
  { icon: UsersRound, label: "Customers" },
];

export function OrderPanel() {
  const [selectedType, setSelectedType] = useState<CustomerTypeValue | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const customerTypesQuery = useQuery({
    queryKey: ["getAllCustomerTypes"],
    queryFn: () => ListCustomerTypeApi({ limit: 100, page: 1 }),
  });
  const foodsQuery = useQuery({
    queryKey: ["getAllFoods"],
    queryFn: () => ListFoodApi({ page: 1, limit: 100 }),
  });

  const customerTypes = customerTypesQuery.data?.data || [];
  const foods = foodsQuery.data?.data || [];

  useEffect(() => {
    if (!selectedType && customerTypes.length > 0) {
      setSelectedType(customerTypes[0].type as CustomerTypeValue);
    }
  }, [customerTypes, selectedType]);

  const selectedCustomerType = customerTypes.find(
    (customerType) => customerType.type === selectedType,
  );
  const cartItems = foods;

  const getQty = (foodId: string) => quantities[foodId] ?? 1;
  const getSelectedPortion = (food: Food) =>
    food.isPortionEnabled ? food.portions?.[0] : undefined;

  const getCustomerTypePrice = (food: Food) => {
    const override = selectedCustomerType
      ? food.customerTypes?.find(
          (ct) => ct.customerTypeId._id === selectedCustomerType._id,
        )
      : undefined;
    return override?.price ?? food.basePrice;
  };

  const getItemPrice = (food: Food) => {
    const portion = getSelectedPortion(food);
    return portion ? portion.basePrice : getCustomerTypePrice(food);
  };

  const getItemOriginalPrice = (food: Food) => getCustomerTypePrice(food);
  const getItemPortionId = (food: Food): string | null =>
    getSelectedPortion(food)?._id ?? null;

  const getPriceDetails = (food: Food) => {
    const override = selectedCustomerType
      ? food.customerTypes?.find(
          (ct) => ct.customerTypeId._id === selectedCustomerType._id,
        )
      : undefined;
    if (!override || !selectedCustomerType) return undefined;
    return { customerTypeId: selectedCustomerType._id, price: override.price };
  };

  const handleIncrement = (foodId: string) => {
    setQuantities((prev) => ({ ...prev, [foodId]: getQty(foodId) + 1 }));
  };
  const handleDecrement = (foodId: string) => {
    setQuantities((prev) => ({ ...prev, [foodId]: Math.max(1, getQty(foodId) - 1) }));
  };

  const subtotal = cartItems.reduce(
    (sum, food) => sum + getItemPrice(food) * getQty(food._id),
    0,
  );
  const vat = 0;
  const total = subtotal + vat;

  const handleOrderAction = async (status: OrderStatus) => {
    if (!selectedCustomerType || cartItems.length === 0) return;

    try {
      await createOrder({
        customerTypeId: selectedCustomerType._id,
        vat,
        items: cartItems.map((food: Food) => {
          const qty = getQty(food._id);
          const price = getItemPrice(food);
          const originalPrice = getItemOriginalPrice(food);
          return {
            foodId: food._id,
            portion: getItemPortionId(food),
            price,
            originalPrice,
            qty,
            total: price * qty,
            foodName: food.name,
            priceDetails: getPriceDetails(food),
          };
        }),
        subTotal: subtotal,
        total,
        discount: 0,
        status,
      });

      if (status === "Placed") toast.success("Order saved successfully!");
      else if (status === "Printed") toast.success("Order sent to print!");
      else if (status === "Cancelled") toast.success("Order cancelled.");
    } catch (error: any) {
      console.error("Unable to create order", error?.response?.data ?? error);
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Unable to process order",
      );
    }
  };

  const cartScrollRef = useRef<HTMLDivElement>(null);
  const [cartThumbTop, setCartThumbTop] = useState<number | null>(null);
  const THUMB_HEIGHT = 104;
  const THUMB_MIN_TOP = 8;

  useEffect(() => {
    const scrollEl = cartScrollRef.current;
    if (!scrollEl) return;

    const updateThumb = () => {
      const { scrollTop: st, scrollHeight, clientHeight } = scrollEl;
      if (scrollHeight <= clientHeight + 1) {
        setCartThumbTop(null);
        return;
      }
      const maxTop = clientHeight - THUMB_HEIGHT - THUMB_MIN_TOP;
      const scrollRatio = st / (scrollHeight - clientHeight);
      setCartThumbTop(THUMB_MIN_TOP + scrollRatio * Math.max(maxTop, 0));
    };

    updateThumb();
    scrollEl.addEventListener("scroll", updateThumb);
    const ro = new ResizeObserver(updateThumb);
    ro.observe(scrollEl);

    return () => {
      scrollEl.removeEventListener("scroll", updateThumb);
      ro.disconnect();
    };
  }, [cartItems.length]);

  return (
    <>
      <div className="flex h-full w-full flex-col">
        {/* Order-type toggle bar */}
        <div className="flex h-5 w-full shrink-0 items-center justify-between rounded-[10px] bg-[#D2D2D2] sm:h-6">
          {customerTypes.map((customerType) => {
            const active = customerType.type === selectedType;
            const typeValue = customerType.type as CustomerTypeValue;
            const label = CUSTOMER_TYPE_LABELS[typeValue] || customerType.type;
            return (
              <button
                key={customerType._id}
                type="button"
                onClick={() => setSelectedType(typeValue)}
                className={`flex h-5 flex-1 items-center justify-center rounded-md px-1.5 py-1 sm:h-6 sm:px-2 sm:py-1.5 ${
                  active ? "bg-[#3B0038]" : "bg-[#EFEFEF]"
                }`}
              >
                <span
                  className={`whitespace-nowrap text-[7px] font-normal leading-none xs:text-[8px] sm:text-[9px] ${
                    active ? "text-white" : "text-[#3B0038]"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div className="mt-1.5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[15px] border border-[#C4C4C4] bg-[#EFEFEF] sm:mt-2">
          {/* Header */}
          <div className="flex h-[26px] shrink-0 items-center justify-between gap-1.5 rounded-t-[15px] bg-[#9494945E] px-3 py-1.5 xs:h-[29px] sm:gap-2.5 sm:px-[18px] sm:py-2">
            <span className="text-[9px] font-normal text-[#3B0038] xs:text-[10px]">
              Item
            </span>
            <span className="text-[9px] font-normal text-[#3B0038] xs:text-[10px]">
              Quantity
            </span>
            <span className="text-[9px] font-normal text-[#3B0038] xs:text-[10px]">
              Amount
            </span>
          </div>

          {/* Cart rows — flexes to fill remaining space, scrolls internally.
              This is the ONLY elastic piece of the card; everything else
              (header above, totals/buttons/footer below) is shrink-0, so
              those never get clipped regardless of screen height. */}
          <div className="relative min-h-0 flex-1">
            {cartThumbTop !== null && (
              <span
                className="pointer-events-none absolute left-0 z-10 h-[104px] w-[3px] rounded-[5px] bg-[#3B0038] opacity-100 transition-[top] duration-150"
                style={{ top: cartThumbTop }}
              />
            )}
            <div
              ref={cartScrollRef}
              className="flex h-full flex-col gap-2 overflow-y-auto bg-[#EFEFEF] py-2.5 pb-1.5 pl-2.5 pr-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {cartItems.map((product) => {
                const qty = getQty(product._id);
                const lineTotal = getItemPrice(product) * qty;

                return (
                  <div
                    key={product._id}
                    className="flex h-11 shrink-0 items-center rounded-md border border-[#CECECE] py-[3px] pl-[5px] pr-[5px] sm:h-[46px]"
                  >
                    <img
                      src={product.foodImage || "/images/icons/butterscotch.jpg"}
                      alt={product.name}
                      className="h-9 w-20 shrink-0 rounded-[5px] object-cover xs:h-10 xs:w-24 sm:h-[41px] sm:w-[97px]"
                    />

                    <div className="ml-1.5 flex min-w-0 flex-1 flex-col justify-center gap-0.5 sm:ml-2">
                      <p className="truncate font-['Poppins'] text-[11px] font-medium text-black sm:text-xs">
                        {product.name}
                      </p>

                      <div className="flex items-center gap-1.5 sm:gap-[7px]">
                        <button
                          type="button"
                          onClick={() => handleDecrement(product._id)}
                          className="flex h-[14px] w-[14px] items-center justify-center rounded-full border border-[#C4C4C4] bg-white sm:h-[15px] sm:w-[15px]"
                        >
                          <Minus size={8} className="text-black sm:hidden" />
                          <Minus size={9} className="hidden text-black sm:block" />
                        </button>
                        <span className="text-xs font-medium text-black sm:text-[13px]">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrement(product._id)}
                          className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#670063] sm:h-[15px] sm:w-[15px]"
                        >
                          <Plus size={8} className="text-white sm:hidden" />
                          <Plus size={9} className="hidden text-white sm:block" />
                        </button>
                      </div>
                    </div>

                    <span className="shrink-0 pl-1.5 font-['Inter'] text-sm font-semibold text-black sm:pl-2 sm:text-base">
                      ₹{lineTotal}
                    </span>

                    <button
                      type="button"
                      className="ml-1.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[10px] bg-[#FF0F0F] p-0.5 sm:ml-2.5 sm:h-4 sm:w-4"
                    >
                      <X size={9} className="text-white sm:hidden" />
                      <X size={10} className="hidden text-white sm:block" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mx-auto h-px w-[calc(100%-16px)] shrink-0 bg-[#CECECE] sm:w-[calc(100%-20px)]" />

          {/* Totals + actions + footer */}
          <div className="mx-auto flex w-[calc(100%-16px)] shrink-0 flex-col gap-0.5 pb-2 pt-1.5 sm:w-[calc(100%-20px)] sm:pb-2.5">
            <div className="flex justify-between text-[11px] font-medium text-black sm:text-xs">
              <span>Items ({cartItems.length})</span>
              <span className="text-[9px] font-normal sm:text-[10px]">
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[11px] font-medium text-black sm:text-xs">
              <span>Subtotal</span>
              <span className="text-[9px] font-normal sm:text-[10px]">
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[11px] font-medium text-black sm:text-xs">
              <span>VAT(0%)</span>
              <span className="text-[9px] font-normal sm:text-[10px]">
                {vat.toFixed(2)}
              </span>
            </div>

            <div className="my-1 border-t border-[#878787]" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-black sm:text-base">Total</span>
              <span className="text-sm font-bold text-black sm:text-base">
                {total.toFixed(2)}
              </span>
            </div>

            <div className="mb-2 flex flex-wrap justify-between gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => handleOrderAction("Placed")}
                className="flex h-8 flex-1 min-w-[80px] items-center justify-center rounded-[10px] bg-[#3EA200] text-[11px] font-semibold text-white sm:min-w-[90px] sm:text-xs"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => void handleOrderAction("Printed")}
                className="flex h-8 flex-1 min-w-[80px] items-center justify-center rounded-[10px] bg-[#3B0038] text-[11px] font-semibold text-white sm:min-w-[90px] sm:text-xs"
              >
                Print
              </button>
              <button
                type="button"
                onClick={() => handleOrderAction("Cancelled")}
                className="flex h-8 flex-1 min-w-[80px] items-center justify-center rounded-[10px] bg-[#FF0F0F] text-[11px] font-semibold text-white sm:min-w-[90px] sm:text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="flex h-14 items-center justify-between gap-1 rounded-[10px] bg-[#D2D2D2] px-2 py-1.5 sm:h-16 sm:gap-0 sm:px-2.5 sm:py-2">
              {footerActions.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === "Table") setIsTableModalOpen(true);
                    if (label === "Order") setIsOrderModalOpen(true);
                    if (label === "Customers") setIsCustomerModalOpen(true);
                  }}
                  className="flex h-11 flex-1 max-w-[82px] flex-col items-center justify-center gap-0.5 rounded-md bg-[#EFEFEF] px-1 py-1 sm:h-[49px] sm:px-2 sm:py-1.5"
                >
                  <Icon size={16} className="text-[#3B0038] sm:hidden" />
                  <Icon size={18} className="hidden text-[#3B0038] sm:block" />
                  <span className="text-[7px] font-normal text-[#3B0038] xs:text-[8px]">
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