"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  Minus,
  Plus,
  Table2,
  UsersRound,
  Utensils,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { createOrder, getOrderById, updateOrder, type CreateOrderPayload } from "@/src/api/order";
import { CustomerModal } from "./CustomerModal";
import { OrderModal } from "./OrderModal";

import { ListCustomerTypeApi } from "@/src/api/customer-type/api/GetAll";
import { ListCustomerApi } from "@/src/api/customer/api/GetAll";
import { ListFoodApi } from "@/src/api/food/api/GetAll";
import { listRestaurants } from "@/src/api/restaurant";
import { CustomerTypeValue } from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import { Food } from "@/src/interfaces/food/ListFoodResponse";
import { HomeDeliveryModal, type HomeDeliveryFormValues } from "./HomDeleiveryModal";
import { OnlinePlatformModal } from "./onlinePlatformModal";

const CUSTOMER_TYPE_LABELS: Record<CustomerTypeValue, string> = {
  TAKE_AWAY: "Take Away",
  DINE_IN: "Dine",
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

import { CartItemType, CustomerTypeEnum, OrderStatus } from "./Types";

type OrderPanelProps = {
  cartItems: CartItemType[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>;
  selectedType: CustomerTypeValue | null;
  setSelectedType: React.Dispatch<React.SetStateAction<CustomerTypeValue | null>>;
  tableId: string | null;
  openTableModal: () => void;
  editingOrderId: string | null;
  onClearEdit: () => void;
  onEditOrder: (orderId: string) => void;
};

export function OrderPanel({ 
  cartItems, 
  setCartItems, 
  selectedType, 
  setSelectedType, 
  tableId, 
  openTableModal,
  editingOrderId,
  onClearEdit,
  onEditOrder
}: OrderPanelProps) {
  const router = useRouter();

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
    enabled: selectedType === CustomerTypeEnum.HOME_DELIVERY,
  });

  const customerTypes = customerTypesQuery.data?.data || [];
  const restaurants = restaurantQuery.data?.data?.map((restaurant) => {
    return {
      value: restaurant._id,
      label: restaurant.name,
      vat: restaurant.vatPercentage,
    };
  }) || [];
  const sortedCustomerTypes = [...customerTypes].sort(
  (a: any, b: any) => (a.order ?? a.index ?? 0) - (b.order ?? b.index ?? 0)
);
  const vatPercentage = restaurants[0]?.vat ?? 0;
 

  useEffect(() => {
    if (!selectedType && customerTypes.length > 0) {
      setSelectedType(customerTypes[0].type as CustomerTypeValue);
    }
  }, [customerTypes, selectedType]);

  const selectedCustomerType = customerTypes.find(
    (customerType) => customerType.type === selectedType,
  );

  const onlineCustomerType = customerTypes.find((ct) => ct.type === CustomerTypeEnum.ONLINE) as
    | (typeof customerTypes[number] & { onlinePlatforms?: string[] })
    | undefined;
  const onlinePlatformOptions = onlineCustomerType?.onlinePlatforms ?? [];

  useEffect(() => {
    if (selectedType === CustomerTypeEnum.HOME_DELIVERY) {
      if (!selectedCustomerId || !deliveryDetails) {
        setIsHomeDeliveryModalOpen(true);
      }
    } else {
      setSelectedCustomerId(null);
      setDeliveryDetails(null);
      setIsHomeDeliveryModalOpen(false);
    }

    if (selectedType === CustomerTypeEnum.ONLINE) {
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

  const getCustomerTypePrice = (food: Food) => {
    const override = selectedCustomerType
      ? food.customerTypes?.find(
          (ct) => ct.customerTypeId._id === selectedCustomerType._id,
        )
      : undefined;
    return override?.price ?? food.basePrice;
  };

  const getItemPrice = (item: CartItemType) => {
    if (item.portion) return item.portion.basePrice;
    return getCustomerTypePrice(item.food);
  };

  const getItemOriginalPrice = (food: Food) => getCustomerTypePrice(food);

  const getPriceDetails = (food: Food) => {
    const override = selectedCustomerType
      ? food.customerTypes?.find(
          (ct) => ct.customerTypeId._id === selectedCustomerType._id,
        )
      : undefined;
    if (!override || !selectedCustomerType) return undefined;
    return { customerTypeId: selectedCustomerType._id, price: override.price };
  };

  const handleIncrement = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, qty: item.qty + 1 } : item))
    );
  };
  const handleDecrement = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const { data: orderResponse } = useQuery({
    queryKey: ["orderById", editingOrderId],
    queryFn: () => getOrderById(editingOrderId as string),
    enabled: !!editingOrderId,
  });

  const existingOrder = orderResponse?.data;
  const existingItems = existingOrder?.items || [];

  const existingSubtotal = existingOrder?.subtotal || 0;
  const existingVat = existingOrder?.vatAmount || 0;
  const existingTotal = existingOrder?.totalAmount || 0;

  const newSubtotal = cartItems.reduce(
    (sum, item) => sum + getItemPrice(item) * item.qty,
    0,
  );
  const newVat = (newSubtotal * vatPercentage) / 100;
  
  const subtotal = existingSubtotal + newSubtotal;
  const vat = existingVat + newVat;
  const total = existingTotal + newSubtotal + newVat;


  const buildOrderTypeExtras = (): Pick<
    Partial<CreateOrderPayload>,
    "customerId" | "deliveryDetails" | "onlinePlatform"
  > => {
    if (selectedType === CustomerTypeEnum.HOME_DELIVERY) {
      const extras = {
        ...(selectedCustomerId ? { customerId: selectedCustomerId } : {}),
        ...(deliveryDetails ? { deliveryDetails } : {}),
      };
      return extras;
    }
    if (selectedType === CustomerTypeEnum.ONLINE && onlinePlatform) {
      return { onlinePlatform };
    }
    return {};
  };

  const resetOrderState = () => {
    setCartItems([]);
    setSelectedCustomerId(null);
    setDeliveryDetails(null);
    setOnlinePlatform(null);
    onClearEdit();
  };

  const handleOrderAction = async (status: OrderStatus) => {
    if (!selectedCustomerType || cartItems.length === 0) return;

    if (selectedType === CustomerTypeEnum.HOME_DELIVERY && !deliveryDetails) {
      toast.error("Please fill in the home delivery details first.");
      setIsHomeDeliveryModalOpen(true);
      return;
    }

    if (selectedType === CustomerTypeEnum.ONLINE && !onlinePlatform) {
      toast.error("Please select an online platform first.");
      setIsOnlinePlatformModalOpen(true);
      return;
    }

    try {
      if (editingOrderId) {
        await updateOrder(editingOrderId, {
          customerTypeId: selectedCustomerType._id,
          tableId: selectedType === CustomerTypeEnum.DINE_IN ? tableId || undefined : undefined,
          vat,
          items: [
            ...existingItems.map(item => ({
              foodId: typeof item.foodId === 'object' ? item.foodId._id : item.foodId,
              portion: item.portionId || null,
              price: item.unitPrice,
              originalPrice: item.unitPrice,
              qty: item.quantity,
              total: item.totalPrice,
              foodName: item.foodName,
              choices: item.choices || [],
            })),
            ...cartItems.map((item) => {
              const qty = item.qty;
              const price = getItemPrice(item);
              const originalPrice = getItemOriginalPrice(item.food);
              return {
                foodId: item.food._id,
                portion: item.portion ? item.portion._id : null,
                price,
                originalPrice,
                qty,
                total: price * qty,
                foodName: item.food.name,
                priceDetails: getPriceDetails(item.food),
                choices: item.choices,
              };
            })
          ],
          subTotal: subtotal,
          total,
          discount: 0,
          status,
          ...buildOrderTypeExtras(),
        } as any);
      } else {
        await createOrder({
          customerTypeId: selectedCustomerType._id,
          tableId: selectedType === CustomerTypeEnum.DINE_IN ? tableId || undefined : undefined,
          vat,
          items: cartItems.map((item) => {
            const qty = item.qty;
            const price = getItemPrice(item);
            const originalPrice = getItemOriginalPrice(item.food);
            return {
              foodId: item.food._id,
              portion: item.portion ? item.portion._id : null,
              price,
              originalPrice,
              qty,
              total: price * qty,
              foodName: item.food.name,
              priceDetails: getPriceDetails(item.food),
              choices: item.choices,
            };
          }),
          subTotal: subtotal,
          total,
          discount: 0,
          status,
          ...buildOrderTypeExtras(),
        });
      }

      if (status === OrderStatus.PLACED) {
        toast.success("Order saved successfully!");
        resetOrderState();
        // router.push(ORDER_SUCCESS_REDIRECT_PATH);
      } else if (status === OrderStatus.PRINTED) {
        toast.success("Order sent to print!");
        resetOrderState();
        // router.push(ORDER_SUCCESS_REDIRECT_PATH);
      } else if (status === OrderStatus.CANCELLED) {
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    console.error("NEXT_PUBLIC_BASE_URL is not defined");
    return "no image";
  }

  return `${baseUrl.replace(/\/$/, "")}/${foodImage.replace(/^\//, "")}`;
};


  return (
    <>
      <div className="flex h-full w-full flex-col">
      
<div className="flex h-5 w-full shrink-0 items-center justify-between gap-1.5 rounded-[10px] bg-[#D2D2D2] p-[3px] xs:h-6 sm:h-7 md:h-8 lg:h-9">
  {sortedCustomerTypes.map((customerType) => {
    const typeValue = customerType.type as CustomerTypeValue;
    const active = typeValue === selectedType;
    const label = CUSTOMER_TYPE_LABELS[typeValue] || customerType.type || customerType.type;
    return (
      <button
        key={customerType._id}
        type="button"
        onClick={() => setSelectedType(typeValue)}
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
              {existingItems.length > 0 && (
                <div className="flex flex-col gap-2 mb-2">
                  {existingItems.map((item, index) => (
                    <div
                      key={`existing-${index}`}
                      className="flex h-14 shrink-0 items-center gap-1.5 rounded-md border border-[#CECECE] py-[3px] pl-[5px] pr-[5px] xs:h-[58px] sm:h-16 sm:gap-2 md:h-[68px] lg:h-[74px] opacity-80"
                    >
                      <div className="relative h-9 w-24 shrink-0 overflow-hidden rounded-[5px] bg-[#D0D0D0] xs:h-10 xs:w-28 sm:h-[41px] sm:w-[115px] md:h-[46px] md:w-[130px] lg:h-[52px] lg:w-[150px] flex items-center justify-center">
                        <span className="text-xs text-gray-500">Image</span>
                      </div>

                      <div className="ml-0.5 flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                        <p className="truncate  text-[11px] font-medium text-black sm:text-xs md:text-sm">
                          {item.foodName} {item.portionName ? `(${item.portionName})` : ''} {item.choices && item.choices.length > 0 ? `[${item.choices.join(', ')}]` : ''}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled
                            className="flex h-[14px] w-[14px] items-center justify-center rounded-full border border-[#C4C4C4] bg-gray-200 sm:h-[15px] sm:w-[15px] md:h-4 md:w-4"
                          >
                            <Minus size={8} className="text-gray-400 sm:hidden" />
                            <Minus size={9} className="hidden text-gray-400 sm:block" />
                          </button>
                          <span className="text-xs font-medium text-black sm:text-[13px] md:text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled
                            className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-gray-400 sm:h-[15px] sm:w-[15px] md:h-4 md:w-4"
                          >
                            <Plus size={8} className="text-white sm:hidden" />
                            <Plus size={9} className="hidden text-white sm:block" />
                          </button>
                        </div>
                      </div>

                      <span className="w-[70px] shrink-0 text-right  text-sm font-semibold text-black sm:w-[80px] sm:text-base md:w-24 md:text-lg">
                        ₹{item.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="flex items-center gap-2 mt-2 px-1 py-1.5 bg-[#E2E2E2] rounded-md font-bold text-sm text-[#3B0038]">
                    <span>Additional Order</span>
                    <Utensils size={14} />
                  </div>
                </div>
              )}
              
              {cartItems.length === 0 && (
                <p className="py-4 text-center text-[10px] text-[#878787] sm:text-xs">
                  No items in cart
                </p>
              )}
              {cartItems.map((item) => {
                const qty = item.qty;
                const lineTotal = getItemPrice(item) * qty;

                return (
                  <div
                    key={item.id}
                    className="flex h-14 shrink-0 items-center gap-1.5 rounded-md border border-[#CECECE] py-[3px] pl-[5px] pr-[5px] xs:h-[58px] sm:h-16 sm:gap-2 md:h-[68px] lg:h-[74px]"
                  >
                    <div className="relative h-9 w-24 shrink-0 overflow-hidden rounded-[5px] xs:h-10 xs:w-28 sm:h-[41px] sm:w-[115px] md:h-[46px] md:w-[130px] lg:h-[52px] lg:w-[150px]">
                      <Image
                        src={getFoodImageUrl(item.food.foodImage ?? undefined)}
                        alt={item.food.name}
                        fill
                        sizes="(min-width: 1024px) 150px, (min-width: 768px) 130px, (min-width: 640px) 115px, 96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="ml-0.5 flex min-w-0 flex-1 flex-col justify-center gap-0.5">
                      <p className="truncate  text-[11px] font-medium text-black sm:text-xs md:text-sm">
                        {item.food.name} {item.portion ? `(${item.portion.name})` : ''} {item.choices && item.choices.length > 0 ? `[${item.choices.join(', ')}]` : ''}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDecrement(item.id)}
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
                          onClick={() => handleIncrement(item.id)}
                          className="flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#670063] sm:h-[15px] sm:w-[15px] md:h-4 md:w-4"
                        >
                          <Plus size={8} className="text-white sm:hidden" />
                          <Plus size={9} className="hidden text-white sm:block" />
                        </button>
                      </div>
                    </div>

                    <span className="w-[70px] shrink-0 text-right  text-sm font-semibold text-black sm:w-[80px] sm:text-base md:w-24 md:text-lg">
                      ₹{lineTotal.toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.food.name} from cart`}
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
                onClick={() => handleOrderAction(OrderStatus.PLACED)}
                className="flex h-8 flex-1 min-w-[80px] items-center justify-center rounded-[10px] bg-[#3EA200] text-[11px] font-semibold text-white sm:min-w-[90px] sm:text-xs md:h-9 md:text-sm"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => void handleOrderAction(OrderStatus.PRINTED)}
                className="flex h-8 flex-1 min-w-[80px] items-center justify-center rounded-[10px] bg-[#3B0038] text-[11px] font-semibold text-white sm:min-w-[90px] sm:text-xs md:h-9 md:text-sm"
              >
                Print
              </button>
              <button
                type="button"
                onClick={() => handleOrderAction(OrderStatus.CANCELLED)}
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
                    if (label === "Table") openTableModal();
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

      <OrderModal 
        open={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        onEdit={(orderId) => {
           onEditOrder(orderId);
           setIsOrderModalOpen(false);
        }}
      />
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