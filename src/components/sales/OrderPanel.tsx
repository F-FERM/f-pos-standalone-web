"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Minus,
  Plus,
  X,
  UsersRound,
  Table2,
  ClipboardList,
} from "lucide-react";
import {
  listCustomerTypes,
  type CustomerTypeValue,
} from "@/src/api/customer-type";
import { listFoods, type FoodRecord } from "@/src/api/food";
import { createOrder, type OrderStatus } from "@/src/api/order";
import { TableModal } from "./TableModal";
import { OrderModal } from "./OrderModal";
import { CustomerModal } from "./CustomerModal";

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
  const [selectedType, setSelectedType] = useState<CustomerTypeValue | null>(
    null,
  );
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  // per-item quantity, keyed by foodId — this is what the +/- buttons drive
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const customerTypesQuery = useQuery({
    queryKey: ["customer-types"],
    queryFn: listCustomerTypes,
  });
  const foodsQuery = useQuery({
    queryKey: ["foods"],
    queryFn: listFoods,
  });

  const customerTypes = customerTypesQuery.data?.data || [];
  const foods = foodsQuery.data?.data || [];

  // default to the first customer type once the list loads, instead of a
  // hardcoded value that may not exist in this account's list
  useEffect(() => {
    if (!selectedType && customerTypes.length > 0) {
      setSelectedType(customerTypes[0].type);
    }
  }, [customerTypes, selectedType]);

  const selectedCustomerType = customerTypes.find(
    (customerType) => customerType.type === selectedType,
  );
  const cartItems = foods;

  const getQty = (foodId: string) => quantities[foodId] ?? 1;

  const getSelectedPortion = (food: FoodRecord) =>
    food.isPortionEnabled ? food.portions?.[0] : undefined;

  // the customer-type-specific price this food defines for the currently
  // selected type, falling back to the food's flat basePrice if it has none
  const getCustomerTypePrice = (food: FoodRecord) => {
    const override = selectedCustomerType
      ? food.customerTypes?.find(
          (ct) => ct.customerTypeId._id === selectedCustomerType._id,
        )
      : undefined;
    return override?.price ?? food.basePrice;
  };

  // selling price: the selected portion's basePrice when portions apply,
  // otherwise the customer-type price
  const getItemPrice = (food: FoodRecord) => {
    const portion = getSelectedPortion(food);
    return portion ? portion.basePrice : getCustomerTypePrice(food);
  };

  // originalPrice reports the customer-type price regardless of portion
  const getItemOriginalPrice = (food: FoodRecord) => getCustomerTypePrice(food);

  const getItemPortionId = (food: FoodRecord): string | null =>
    getSelectedPortion(food)?._id ?? null;

  // only sent when this food actually defines a price override for the
  // selected customer type — otherwise there's nothing to report
  const getPriceDetails = (food: FoodRecord) => {
    const override = selectedCustomerType
      ? food.customerTypes?.find(
          (ct) => ct.customerTypeId._id === selectedCustomerType._id,
        )
      : undefined;
    if (!override || !selectedCustomerType) return undefined;
    return {
      customerTypeId: selectedCustomerType._id,
      price: override.price,
    };
  };

  const handleIncrement = (foodId: string) => {
    setQuantities((prev) => ({ ...prev, [foodId]: getQty(foodId) + 1 }));
  };

  const handleDecrement = (foodId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max(1, getQty(foodId) - 1),
    }));
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
        items: cartItems.map((food: FoodRecord) => {
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
    } catch (error: any) {
      // surface the backend's actual rejection reason instead of a bare error object
      console.error(
        "Unable to create order",
        error?.response?.data ?? error,
      );
    }
  };

  // --- cart scroll indicator (same pattern as CategorySidebar) ---
  const cartScrollRef = useRef<HTMLDivElement>(null);
  const [cartThumbTop, setCartThumbTop] = useState<number | null>(null);

  const THUMB_HEIGHT = 104;
  const THUMB_MIN_TOP = 8;

  useEffect(() => {
    const scrollEl = cartScrollRef.current;
    if (!scrollEl) return;

    const updateThumb = () => {
      const { scrollTop: st, scrollHeight, clientHeight } = scrollEl;

      // nothing to scroll — hide the thumb entirely
      if (scrollHeight <= clientHeight + 1) {
        setCartThumbTop(null);
        return;
      }

      const maxTop = clientHeight - THUMB_HEIGHT - THUMB_MIN_TOP;
      const scrollRatio = st / (scrollHeight - clientHeight);
      const top = THUMB_MIN_TOP + scrollRatio * Math.max(maxTop, 0);

      setCartThumbTop(top);
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
      <div className="relative flex flex-col">
        {/* Order-type toggle bar — full width, 20 tall */}
        <div
          className="flex items-center"
          style={{
            width: "100%",
            height: 20,
            borderRadius: 10,
            background: "#D2D2D2",
            justifyContent: "space-between",
          }}
        >
          {customerTypes.map((customerType) => {
            const active = customerType.type === selectedType;
            const label = CUSTOMER_TYPE_LABELS[customerType.type];
            return (
              <button
                key={customerType._id}
                type="button"
                onClick={() => setSelectedType(customerType.type)}
                className="flex flex-1 items-center justify-center"
                style={{
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
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Card — full width, 546 tall */}
        <div
          className="flex flex-col overflow-hidden"
          style={{
            marginTop: 6,
            width: "100%",
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
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 10,
                color: "#3B0038",
              }}
            >
              Item
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 10,
                color: "#3B0038",
              }}
            >
              Quantity
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontSize: 10,
                color: "#3B0038",
              }}
            >
              Amount
            </span>
          </div>

          {/* Cart rows — scrollable, native scrollbar hidden, JS-driven indicator instead */}
          <div className="relative min-h-0 flex-1">
            {/* purple scroll-position indicator on the left edge */}
            {cartThumbTop !== null && (
              <span
                className="pointer-events-none absolute left-0 z-10 transition-[top] duration-150"
                style={{
                  top: cartThumbTop,
                  width: 3,
                  height: THUMB_HEIGHT,
                  borderRadius: 5,
                  backgroundColor: "#3B0038",
                  opacity: 1,
                }}
              />
            )}
            <div
              ref={cartScrollRef}
              className="
                flex h-full flex-col overflow-y-auto bg-[#EFEFEF]
                [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
              "
              style={{ padding: "10px 6px 6px 10px", gap: 8 }}
            >
              {cartItems.map((product) => {
                const qty = getQty(product._id);
                const lineTotal = getItemPrice(product) * qty;

                return (
                  <div
                    key={product._id}
                    className="flex shrink-0 items-center"
                    style={{
                      width: "100%",
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
                      src={product.foodImage || "/images/icons/butterscotch.jpg"}
                      alt={product.name}
                      className="shrink-0 object-cover"
                      style={{ width: 97, height: 41, borderRadius: 5 }}
                    />

                    <div
                      className="flex min-w-0 flex-1 flex-col justify-center"
                      style={{ marginLeft: 8, gap: 2 }}
                    >
                      <p
                        className="truncate"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontSize: 12,
                          color: "#000000",
                        }}
                      >
                        {product.name}
                      </p>

                      <div className="flex items-center" style={{ gap: 7 }}>
                        <button
                          type="button"
                          onClick={() => handleDecrement(product._id)}
                          className="flex h-[15px] w-[15px] items-center justify-center rounded-full"
                          style={{
                            background: "white",
                            border: "1px solid #C4C4C4",
                          }}
                        >
                          <Minus size={9} className="text-black" />
                        </button>
                        <span
                          className="text-[13px] font-medium"
                          style={{ color: "#000000" }}
                        >
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrement(product._id)}
                          className="flex h-[15px] w-[15px] items-center justify-center rounded-full"
                          style={{ background: "#670063" }}
                        >
                          <Plus size={9} className="text-white" />
                        </button>
                      </div>
                    </div>

                    <span
                      className="shrink-0 pl-2"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#000000",
                      }}
                    >
                      ₹{lineTotal}
                    </span>

                    <button
                      type="button"
                      className="ml-[10px] flex shrink-0 items-center justify-center"
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 10,
                        padding: 2,
                        background: "#FF0F0F",
                      }}
                    >
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* small gap + hairline before totals */}
          <div style={{ height: 4 }} />
          <div
            className=" shrink-0"
            style={{ width: "calc(100% - 20px)", margin: "0 auto", borderColor: "#CECECE" }}
          />
          <div style={{ height: 6 }} />

          {/* Bottom stack: totals + action buttons + footer */}
          <div
            className="flex shrink-0 flex-col"
            style={{ width: "calc(100% - 20px)", margin: "0 auto", gap: 2, paddingBottom: 10 }}
          >
            <div
              className="flex justify-between"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: 12,
                color: "#000000",
              }}
            >
              <span>Items ({cartItems.length})</span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 10,
                }}
              >
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div
              className="flex justify-between"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: 12,
                color: "#000000",
              }}
            >
              <span>Subtotal</span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 10,
                }}
              >
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div
              className="flex justify-between"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: 12,
                color: "#000000",
              }}
            >
              <span>VAT(0%)</span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontSize: 10,
                }}
              >
                {vat.toFixed(2)}
              </span>
            </div>

            <div
              className="border-t mt-1 mb-1"
              style={{ borderColor: "#878787" }}
            />

            <div className="flex justify-between items-center">
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#000000",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#000000",
                }}
              >
                {total.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between mb-2">
              <button
                type="button"
                className="flex items-center justify-center text-white"
                style={{
                  width: 105,
                  height: 32,
                  borderRadius: 10,
                  background: "#3EA200",
                  fontSize: 12,
                  fontWeight: 600,
                }}
                onClick={() => handleOrderAction("Placed")}
              >
                Save
              </button>
              <button
                type="button"
                className="flex items-center justify-center text-white"
                style={{
                  width: 105,
                  height: 32,
                  borderRadius: 10,
                  background: "#3B0038",
                  fontSize: 12,
                  fontWeight: 600,
                }}
                onClick={() => {
                  void handleOrderAction("Printed");
                }}
              >
                Print
              </button>
              <button
                type="button"
                className="flex items-center justify-center text-white"
                style={{
                  width: 105,
                  height: 32,
                  borderRadius: 10,
                  background: "#FF0F0F",
                  fontSize: 12,
                  fontWeight: 600,
                }}
                onClick={() => handleOrderAction("Cancelled")}
              >
                Cancel
              </button>
            </div>

            <div
              className="flex items-center"
              style={{
                width: "100%",
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
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: 8,
                      color: "#3B0038",
                    }}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TableModal
        open={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />
      <OrderModal
        open={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
      <CustomerModal
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />
    </>
  );
}