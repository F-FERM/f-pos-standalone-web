"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  Minus,
  Plus,
  Table2,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { createOrder, type CreateOrderPayload, type OrderStatus } from "@/src/api/order";
import { CustomerModal } from "./CustomerModal";
import { OrderModal } from "./OrderModal";
import { TableModal } from "./TableModal";

import { ListCustomerTypeApi } from "@/src/api/customer-type/api/GetAll";
import { ListCustomerApi } from "@/src/api/customer/api/GetAll";
import { ListFoodApi } from "@/src/api/food/api/GetAll";
import { CustomerTypeValue, CUSTOMER_TYPE_OPTIONS } from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import { Food } from "@/src/interfaces/food/ListFoodResponse";
import { HomeDeliveryModal, type HomeDeliveryFormValues } from "./HomDeleiveryModal";
import { OnlinePlatformModal } from "./onlinePlatformModal";
import { listRestaurants } from "@/src/api/restaurant";

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


// const ORDER_SUCCESS_REDIRECT_PATH = "/home/delivery";

interface DeliveryDetailsState {
  location: string;
  deliveryDate: string;
  deliveryTime: string;
}

type OrderPanelProps = {
  quantities: Record<string, number>;
  setQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
};

export function OrderPanel({ quantities, setQuantities }: OrderPanelProps) {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState<CustomerTypeValue | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // --- Home delivery / online platform state ---
  const [isHomeDeliveryModalOpen, setIsHomeDeliveryModalOpen] = useState(false);
  const [isOnlinePlatformModalOpen, setIsOnlinePlatformModalOpen] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetailsState | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [onlinePlatform, setOnlinePlatform] = useState<string | null>(null);

  const customerTypesQuery = useQuery({
    queryKey: ["getAllCustomerTypes"],
    queryFn: () => ListCustomerTypeApi({ limit: 100, page: 1 }),
  });
  const foodsQuery = useQuery({
    queryKey: ["getAllFoods"],
    queryFn: () => ListFoodApi({ page: 1, limit: 100 }),
  });
  const restaurantQuery = useQuery({
    queryKey: ["getAllRestaurants"],
    queryFn: () => listRestaurants(),
  });
  const customersQuery = useQuery({
    queryKey: ["getAllCustomers"],
    queryFn: () => ListCustomerApi({ limit: 100, page: 1 }),
    enabled: selectedType === "HOME_DELIVERY",
  });

  const customerTypes = customerTypesQuery.data?.data || [];
  const restaurants = restaurantQuery.data?.data?.map((restaurant) => {
    return {
      value: restaurant._id,
      label: restaurant.name,
      vat: restaurant.vatPercentage,
    };
  }) || [];
  // VAT percentage pulled from the restaurant record (assumes a single-location setup;
  // adjust the selection logic here if the app supports multiple restaurants).
  const vatPercentage = restaurants[0]?.vat ?? 0;
  const foods = foodsQuery.data?.data || [];
  const customers = customersQuery.data?.data || [];

  useEffect(() => {
    if (!selectedType && customerTypes.length > 0) {
      setSelectedType(customerTypes[0].type as CustomerTypeValue);
    }
  }, [customerTypes, selectedType]);

  const selectedCustomerType = customerTypes.find(
    (customerType) => customerType.type === selectedType,
  );

  const onlineCustomerType = customerTypes.find((ct) => ct.type === "ONLINE") as
    | (typeof customerTypes[number] & { onlinePlatforms?: string[] })
    | undefined;
  const onlinePlatformOptions = onlineCustomerType?.onlinePlatforms ?? [];

  useEffect(() => {
    console.log("[TRACE] selectedType changed to:", selectedType);
    if (selectedType === "HOME_DELIVERY") {
      if (!selectedCustomerId || !deliveryDetails) {
        setIsHomeDeliveryModalOpen(true);
      }
    } else {
      setSelectedCustomerId(null);
      setDeliveryDetails(null);
      setIsHomeDeliveryModalOpen(false);
    }

    if (selectedType === "ONLINE") {
      if (!onlinePlatform) {
        setIsOnlinePlatformModalOpen(true);
      }
    } else {
      setOnlinePlatform(null);
      setIsOnlinePlatformModalOpen(false);
    }
  }, [selectedType]);

  const handleHomeDeliverySubmit = (data: HomeDeliveryFormValues) => {
    setSelectedCustomerId(data.customerId ?? "");
    setDeliveryDetails({
      location: data.location ?? "",
      deliveryDate: data.deliveryDate ?? "",
      deliveryTime: data.deliveryTime ?? "",
    });
    setIsHomeDeliveryModalOpen(false);
  };

  const handleOnlinePlatformSubmit = (platform: string) => {
    setOnlinePlatform(platform);
    setIsOnlinePlatformModalOpen(false);
  };

  const cartItems = foods.filter((food) => (quantities[food._id] || 0) > 0);

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

  const handleRemoveItem = (foodId: string) => {
    setQuantities((prev) => {
      const next = { ...prev };
      delete next[foodId];
      return next;
    });
  };

  const subtotal = cartItems.reduce(
    (sum, food) => sum + getItemPrice(food) * getQty(food._id),
    0,
  );
  const vat = (subtotal * vatPercentage) / 100;
  const total = subtotal + vat;


  const buildOrderTypeExtras = (): Pick<
    Partial<CreateOrderPayload>,
    "customerId" | "deliveryDetails" | "onlinePlatform"
  > => {
    if (selectedType === "HOME_DELIVERY") {
      const extras = {
        ...(selectedCustomerId ? { customerId: selectedCustomerId } : {}),
        ...(deliveryDetails ? { deliveryDetails } : {}),
      };
      return extras;
    }
    if (selectedType === "ONLINE" && onlinePlatform) {
      return { onlinePlatform };
    }
    return {};
  };

  const resetOrderState = () => {
    setQuantities({});
    setSelectedCustomerId(null);
    setDeliveryDetails(null);
    setOnlinePlatform(null);
  };

  const handleOrderAction = async (status: OrderStatus) => {
    if (!selectedCustomerType || cartItems.length === 0) return;

    if (selectedType === "HOME_DELIVERY" && !deliveryDetails) {
      toast.error("Please fill in the home delivery details first.");
      setIsHomeDeliveryModalOpen(true);
      return;
    }

    if (selectedType === "ONLINE" && !onlinePlatform) {
      toast.error("Please select an online platform first.");
      setIsOnlinePlatformModalOpen(true);
      return;
    }

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
        ...buildOrderTypeExtras(),
      });

      if (status === "Placed") {
        toast.success("Order saved successfully!");
        resetOrderState();
        // router.push(ORDER_SUCCESS_REDIRECT_PATH);
      } else if (status === "Printed") {
        toast.success("Order sent to print!");
        resetOrderState();
        // router.push(ORDER_SUCCESS_REDIRECT_PATH);
      } else if (status === "Cancelled") {
        toast.success("Order cancelled.");
        resetOrderState();
      }
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

  const getFoodImageUrl = (foodImage?: string) => {
  if (!foodImage) {
    return "no image";
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL is not defined");
    return "no image";
  }

  return `${baseUrl.replace(/\/$/, "")}/${foodImage.replace(/^\//, "")}`;
};


  return (
    <>
      <div className="flex h-full w-full flex-col">
        {/* Order-type toggle bar */}
        <div className="flex h-5 w-full shrink-0 items-center justify-between gap-1.5 rounded-[10px] bg-[#D2D2D2] p-[3px] xs:h-6 sm:h-7 md:h-8 lg:h-9">
          {CUSTOMER_TYPE_OPTIONS.map((option) => {
            const typeValue = option.value;
            const active = typeValue === selectedType;
            const label = CUSTOMER_TYPE_LABELS[typeValue] || option.label;
            return (
              <button
                key={typeValue}
                type="button"
                onClick={() => {
                  console.log("[TRACE] Button clicked! Setting selectedType to:", typeValue, "from button:", label);
                  setSelectedType(typeValue);
                }}
                className={`flex h-full flex-1 items-center justify-center rounded-md px-1.5 transition-colors xs:px-2 ${
                  active ? "bg-[#3B0038]" : " bg-[#EFEFEF]"
                }`}
              >
                <span
                  className={`whitespace-nowrap text-[7.5px] font-medium leading-none tracking-wide xs:text-[8px] sm:text-[9.5px] md:text-[10.5px] lg:text-[12px] ${
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
          <div className="flex h-7 shrink-0 items-center justify-between rounded-t-[15px] bg-[#9494945E] px-3 py-1.5 xs:h-8 sm:px-[18px] sm:py-2 md:h-9">
            <span className="text-[9px] font-normal text-[#3B0038] xs:text-[10px] md:text-xs">
              Item
            </span>
            <span className="text-[9px] font-normal text-[#3B0038] xs:text-[10px] md:text-xs">
              Quantity
            </span>
            <span className="text-[9px] font-normal text-[#3B0038] xs:text-[10px] md:text-xs">
              Amount
            </span>
          </div>

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
              {cartItems.length === 0 && (
                <p className="py-4 text-center text-[10px] text-[#878787] sm:text-xs">
                  No items in cart
                </p>
              )}
              {cartItems.map((product) => {
                const qty = getQty(product._id);
                const lineTotal = getItemPrice(product) * qty;

                return (
                  <div
                    key={product._id}
                    className="flex h-14 shrink-0 items-center gap-1.5 rounded-md border border-[#CECECE] py-[3px] pl-[5px] pr-[5px] xs:h-[58px] sm:h-16 sm:gap-2 md:h-[68px] lg:h-[74px]"
                  >
                    <div className="relative h-9 w-24 shrink-0 overflow-hidden rounded-[5px] xs:h-10 xs:w-28 sm:h-[41px] sm:w-[115px] md:h-[46px] md:w-[130px] lg:h-[52px] lg:w-[150px]">
                      <Image
                        src={getFoodImageUrl(product.foodImage ?? undefined)}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 150px, (min-width: 768px) 130px, (min-width: 640px) 115px, 96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="ml-0.5 flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                      <p className="truncate font-['Poppins'] text-[11px] font-medium text-black sm:text-xs md:text-sm">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDecrement(product._id)}
                          className="flex h-[14px] w-[14px] items-center justify-center rounded-full border border-[#C4C4C4] bg-white sm:h-[15px] sm:w-[15px] md:h-4 md:w-4"
                        >
                          <Minus size={8} className="text-black sm:hidden" />
                          <Minus size={9} className="hidden text-black sm:block" />
                        </button>
                        <span className="text-xs font-medium text-black sm:text-[13px] md:text-sm">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrement(product._id)}
                          className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#670063] sm:h-[15px] sm:w-[15px] md:h-4 md:w-4"
                        >
                          <Plus size={8} className="text-white sm:hidden" />
                          <Plus size={9} className="hidden text-white sm:block" />
                        </button>
                      </div>
                    </div>

                    <span className="w-[70px] shrink-0 text-right font-['Inter'] text-sm font-semibold text-black sm:w-[80px] sm:text-base md:w-24 md:text-lg">
                      ₹{lineTotal}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(product._id)}
                      aria-label={`Remove ${product.name} from cart`}
                      className="ml-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[10px] bg-[#FF0F0F] p-0.5 sm:ml-2 sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]"
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

          <div className="mx-auto flex w-[calc(100%-16px)] shrink-0 flex-col gap-0.5 pb-2 pt-1.5 sm:w-[calc(100%-20px)] sm:pb-2.5">
            <div className="flex justify-between text-[11px] font-medium text-black sm:text-xs md:text-sm">
              <span>Items ({cartItems.length})</span>
              <span className="text-[9px] font-normal sm:text-[10px] md:text-xs">
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[11px] font-medium text-black sm:text-xs md:text-sm">
              <span>Subtotal</span>
              <span className="text-[9px] font-normal sm:text-[10px] md:text-xs">
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-[11px] font-medium text-black sm:text-xs md:text-sm">
              <span>VAT({vatPercentage}%)</span>
              <span className="text-[9px] font-normal sm:text-[10px] md:text-xs">
                {vat.toFixed(2)}
              </span>
            </div>

            <div className="my-1 border-t border-[#878787]" />

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-black sm:text-base md:text-lg">Total</span>
              <span className="text-sm font-bold text-black sm:text-base md:text-lg">
                {total.toFixed(2)}
              </span>
            </div>

            <div className="mb-2 flex flex-wrap justify-between gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => handleOrderAction("Placed")}
                className="flex h-8 flex-1 min-w-[80px] items-center justify-center rounded-[10px] bg-[#3EA200] text-[11px] font-semibold text-white sm:min-w-[90px] sm:text-xs md:h-9 md:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => void handleOrderAction("Printed")}
                className="flex h-8 flex-1 min-w-[80px] items-center justify-center rounded-[10px] bg-[#3B0038] text-[11px] font-semibold text-white sm:min-w-[90px] sm:text-xs md:h-9 md:text-sm"
              >
                Print
              </button>
              <button
                type="button"
                onClick={() => handleOrderAction("Cancelled")}
                className="flex h-8 flex-1 min-w-[80px] items-center justify-center rounded-[10px] bg-[#FF0F0F] text-[11px] font-semibold text-white sm:min-w-[90px] sm:text-xs md:h-9 md:text-sm"
              >
                Cancel
              </button>
            </div>

            <div className="flex h-14 items-center justify-between gap-1 rounded-[10px] bg-[#D2D2D2] px-2 py-1.5 sm:h-16 sm:gap-0 sm:px-2.5 sm:py-2 md:h-[72px]">
              {footerActions.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === "Table") setIsTableModalOpen(true);
                    if (label === "Order") setIsOrderModalOpen(true);
                    if (label === "Customers") setIsCustomerModalOpen(true);
                  }}
                  className="flex h-11 flex-1 max-w-[82px] flex-col items-center justify-center gap-0.5 rounded-md bg-[#EFEFEF] px-1 py-1 sm:h-[49px] sm:px-2 sm:py-1.5 md:h-[56px]"
                >
                  <Icon size={16} className="text-[#3B0038] sm:hidden" />
                  <Icon size={18} className="hidden text-[#3B0038] sm:block md:hidden" />
                  <Icon size={20} className="hidden text-[#3B0038] md:block" />
                  <span className="text-[7px] font-normal text-[#3B0038] xs:text-[8px] md:text-[9px]">
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

      <HomeDeliveryModal
        open={isHomeDeliveryModalOpen}
        onClose={() => setIsHomeDeliveryModalOpen(false)}
        onSubmit={handleHomeDeliverySubmit}
      />
      <OnlinePlatformModal
        open={isOnlinePlatformModalOpen}
        onClose={() => setIsOnlinePlatformModalOpen(false)}
        platforms={onlinePlatformOptions}
        onSubmit={handleOnlinePlatformSubmit}
      />
    </>
  );
}