"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ClipboardList,
  Minus,
  Plus,
  Table2,
  UsersRound,
  Utensils,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createOrder,
  getOrderById,
  updateOrder,
  type CreateOrderPayload,
} from "@/src/api/order";

import { CustomerModal } from "./CustomerModal";
import { OrderModal } from "./OrderModal";

import { ListCustomerTypeApi } from "@/src/api/customer-type/api/GetAll";
import { ListCustomerApi } from "@/src/api/customer/api/GetAll";
import { ListFoodApi } from "@/src/api/food/api/GetAll";
import { listRestaurants } from "@/src/api/restaurant";

import { CustomerTypeValue } from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import { Food } from "@/src/interfaces/food/ListFoodResponse";

import {
  HomeDeliveryModal,
  type HomeDeliveryFormValues,
} from "./HomDeleiveryModal";

import { OnlinePlatformModal } from "./onlinePlatformModal";

import { CartItemType, CustomerTypeEnum, OrderStatus } from "./Types";
import { playBeep } from "./Beep";


/* -------------------------------------------------------------------------- */
/* Media URL                                                                  */
/* -------------------------------------------------------------------------- */

const API_MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:3005";

function getMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;

  if (/^(https?:|blob:|data:)/i.test(path)) {
    return path;
  }

  return `${API_MEDIA_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/* -------------------------------------------------------------------------- */
/* Numeric input sizing                                                       */
/* ASSUMPTION: qty / rate values are expected to stay in the 1–999999 range.  */
/* The width grows in `ch` (character) units with the value's length so long  */
/* numbers (9999, 15000.50, etc.) are never clipped, but it's capped at 8ch   */
/* so a runaway value can't blow out the row layout — beyond 8 digits it      */
/* just stops growing and the number scrolls within the input. Raise maxCh    */
/* if you expect larger numbers than that.                                   */
/* -------------------------------------------------------------------------- */

function numInputWidth(
  value: number | string | undefined | null,
  minCh = 2,
  maxCh = 8
): string {
  const len = String(value ?? "").length;
  return `${Math.min(Math.max(len + 1, minCh), maxCh)}ch`;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* Fluid sizing tokens                                                        */
/* All scale continuously between the two viewport widths via clamp() —       */
/* one rule per property, no stacked breakpoint variants, no plugin, no JS.   */
/* clamp(MIN, PREFERRED, MAX): stays at MIN below ~360px, at MAX above        */
/* ~1440px, and scales linearly with viewport width in between.              */
/*                                                                            */
/* CHANGE: colQty / colVat / colRate / colAmount switched from `w-[...]`      */
/* (fixed width) to `min-w-[...]` (floor only). That lets each column grow    */
/* past its clamp() size when the value inside is wider than usual (large    */
/* qty, rate, VAT or amount), while the item-name column — which already has */
/* `flex-1 min-w-0` + `truncate` — absorbs the shrink instead of the numbers */
/* getting clipped.                                                          */
/* -------------------------------------------------------------------------- */

const fluid = {
  tabH: "h-[clamp(20px,3.4vw,36px)]",
  tabText: "text-[clamp(7.5px,1vw,12px)]",
  tabPadX: "px-[clamp(4px,0.7vw,10px)]",

  headerH: "h-[clamp(32px,4.2vw,40px)]",
  headerPadX: "px-[clamp(6px,0.9vw,14px)]",
  headerPadY: "py-[clamp(4px,0.6vw,10px)]",
  headerText: "text-[clamp(8.5px,0.95vw,13px)]",

  imgW: "w-[clamp(56px,9vw,118px)]",
  imgH: "h-[clamp(32px,4.6vw,48px)]",

  colQty: "min-w-[clamp(20px,2.2vw,30px)]",
  colVat: "min-w-[clamp(20px,2vw,30px)]",
  colRate: "min-w-[clamp(26px,2.8vw,38px)]",
  colAmount: "min-w-[clamp(32px,3.6vw,46px)]",
  colDel: "w-[clamp(12px,1.4vw,16px)]",
  rowGap: "gap-[clamp(2px,0.35vw,6px)]",

  rowText: "text-[clamp(10px,1.1vw,13px)]",
  smallText: "text-[clamp(9px,1vw,13px)]",

  discountW: "w-[clamp(56px,7vw,72px)]",

  totalText: "text-[clamp(14px,1.9vw,22px)]",

  actionH: "h-[clamp(28px,3.6vw,40px)]",
  actionText: "text-[clamp(9px,1.05vw,14px)]",

  footerH: "h-[clamp(48px,7vw,72px)]",
  footerBtnH: "h-[clamp(36px,5.6vw,56px)]",
  footerIcon: "w-[clamp(14px,1.9vw,20px)] h-[clamp(14px,1.9vw,20px)]",
  footerLabel: "text-[clamp(6.5px,0.85vw,9px)]",
};

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface DeliveryDetailsState {
  location: string;
  deliveryDate: string;
  deliveryTime: string;
}

type OrderPanelProps = {
  cartItems: CartItemType[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>;

  selectedType: CustomerTypeValue | null;
  setSelectedType: React.Dispatch<
    React.SetStateAction<CustomerTypeValue | null>
  >;

  tableId: string | null;
  openTableModal: () => void;

  editingOrderId: string | null;
  onClearEdit: () => void;
  onEditOrder: (orderId: string) => void;

  onTotalChange?: (total: number) => void;
};

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function OrderPanel({
  cartItems,
  setCartItems,
  selectedType,
  setSelectedType,
  tableId,
  openTableModal,
  editingOrderId,
  onClearEdit,
  onEditOrder,
  onTotalChange,
}: OrderPanelProps) {
  const router = useRouter();

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  /* ------------------------- Home delivery / online ---------------------- */

  const [isHomeDeliveryModalOpen, setIsHomeDeliveryModalOpen] =
    useState(false);

  const [isOnlinePlatformModalOpen, setIsOnlinePlatformModalOpen] =
    useState(false);

  const [deliveryDetails, setDeliveryDetails] =
    useState<DeliveryDetailsState | null>(null);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );

  const [onlinePlatform, setOnlinePlatform] = useState<string | null>(null);

  /* ------------------------------- Discount ------------------------------ */

  // CHANGE: default is a real "0" now, not "" with a display-time fallback.
  // The old version rendered "0" whenever the state was "" (`discount === ""
  // ? "0" : discount`), so `onFocus` clearing the state to "" immediately
  // got overwritten back to "0" on the next render — the field could never
  // actually be cleared. Now the state itself holds what's shown.
  const [discount, setDiscount] = useState<string>("0");

  /* ------------------------------------------------------------------------ */
  /* Add-to-cart beep                                                         */
  /* ------------------------------------------------------------------------ */

  // Snapshot of the previous cart, used to tell an "add" apart from any other
  // cart change (remove, rate edit, reset).
  const prevCartRef = useRef<{ ids: string[]; totalQty: number } | null>(null);

  // Set to true right before a quantity change that came from the cart's own
  // +/- buttons or qty input, so those don't beep — only adds from the product
  // grid do. Delete these if you want every quantity bump to beep.
  const suppressBeepRef = useRef(false);

  useEffect(() => {
    const ids = cartItems.map((item) => item.id);

    const totalQty = cartItems.reduce(
      (sum, item) =>
        sum + (typeof item.qty === "number" ? item.qty : 0),
      0
    );

    const prev = prevCartRef.current;

    prevCartRef.current = { ids, totalQty };

    // First run — don't beep for a cart that was already there on mount
    // (e.g. when opening an existing order for editing).
    if (!prev) {
      return;
    }

    if (suppressBeepRef.current) {
      suppressBeepRef.current = false;
      return;
    }

    const hasNewItem = ids.some((id) => !prev.ids.includes(id));

    // A brand new row, or the same food added again (which bumps qty).
    if (hasNewItem || totalQty > prev.totalQty) {
      playBeep();
    }
  }, [cartItems]);

  /* ------------------------------------------------------------------------ */
  /* Queries                                                                  */
  /* ------------------------------------------------------------------------ */

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

  const restaurants =
    restaurantQuery.data?.data?.map((restaurant) => {
      return {
        value: restaurant._id,
        label: restaurant.name,
        vat: restaurant.vatPercentage,
      };
    }) || [];

  const sortedCustomerTypes = [...customerTypes].sort(
    (a: any, b: any) =>
      (a.order ?? a.index ?? 0) - (b.order ?? b.index ?? 0)
  );

  const vatPercentage = restaurants[0]?.vat ?? 0;

  /* ------------------------------------------------------------------------ */
  /* Customer type                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!selectedType && customerTypes.length > 0) {
      setSelectedType(customerTypes[0].type as CustomerTypeValue);
    }
  }, [customerTypes, selectedType, setSelectedType]);

  const selectedCustomerType = customerTypes.find(
    (customerType) => customerType.type === selectedType
  );

  const onlineCustomerType = customerTypes.find(
    (ct) => ct.type === CustomerTypeEnum.ONLINE
  ) as
    | (typeof customerTypes[number] & {
        onlinePlatforms?: string[];
      })
    | undefined;

  const onlinePlatformOptions = onlineCustomerType?.onlinePlatforms ?? [];

  /* ------------------------------------------------------------------------ */
  /* Type-specific modal handling                                             */
  /* ------------------------------------------------------------------------ */

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

  // Re-clicking a tab that's already selected doesn't change `selectedType`,
  // so the effect above (which only fires on a real change) won't reopen the
  // Online/Home Delivery picker if it was closed without completing it. This
  // handler opens the right modal directly from the click itself, so it
  // works whether or not the tab was already active — and it's what the tab
  // button's onClick below must call (not setSelectedType directly).
  const handleSelectCustomerType = (typeValue: CustomerTypeValue) => {
    setSelectedType(typeValue);

    if (typeValue === CustomerTypeEnum.ONLINE && !onlinePlatform) {
      setIsOnlinePlatformModalOpen(true);
    }

    if (
      typeValue === CustomerTypeEnum.HOME_DELIVERY &&
      (!selectedCustomerId || !deliveryDetails)
    ) {
      setIsHomeDeliveryModalOpen(true);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Price helpers                                                            */
  /* ------------------------------------------------------------------------ */

  const getCustomerTypePrice = (food: Food) => {
    const override = selectedCustomerType
      ? food.customerTypes?.find(
          (ct) => ct.customerTypeId._id === selectedCustomerType._id
        )
      : undefined;

    return override?.price ?? food.basePrice;
  };

  const getItemRate = (item: CartItemType): number => {
    if (item.customRate !== undefined) {
      return item.customRate;
    }

    if (item.portion) {
      return item.portion.basePrice;
    }

    return getCustomerTypePrice(item.food);
  };

  const getItemOriginalPrice = (food: Food) => {
    return getCustomerTypePrice(food);
  };

  const getItemPrice = (item: CartItemType) => {
    return getItemRate(item);
  };

  const getPriceDetails = (food: Food) => {
    const override = selectedCustomerType
      ? food.customerTypes?.find(
          (ct) => ct.customerTypeId._id === selectedCustomerType._id
        )
      : undefined;

    if (!override || !selectedCustomerType) {
      return undefined;
    }

    return {
      customerTypeId: selectedCustomerType._id,
      price: override.price,
    };
  };

  /* ------------------------------------------------------------------------ */
  /* Cart actions                                                             */
  /* ------------------------------------------------------------------------ */

  const handleIncrement = (itemId: string) => {
    suppressBeepRef.current = true;

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const currentQty = typeof item.qty === "number" ? item.qty : 0;

          return {
            ...item,
            qty: currentQty + 1,
          };
        }

        return item;
      })
    );
  };

  const handleDecrement = (itemId: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const currentQty = typeof item.qty === "number" ? item.qty : 1;

          return {
            ...item,
            qty: Math.max(1, currentQty - 1),
          };
        }

        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleRateChange = (itemId: string, value: string) => {
    const parsed = parseFloat(value);

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              customRate: isNaN(parsed) ? undefined : parsed,
            }
          : item
      )
    );
  };

  /* ------------------------------------------------------------------------ */
  /* Existing order                                                           */
  /* ------------------------------------------------------------------------ */

  const { data: orderResponse } = useQuery({
    queryKey: ["orderById", editingOrderId],
    queryFn: () => getOrderById(editingOrderId as string),
    enabled: !!editingOrderId,
  });

  const existingOrder = orderResponse?.data;

  const [localExistingItems, setLocalExistingItems] = useState<any[]>([]);

  useEffect(() => {
    if (existingOrder?.items) {
      setLocalExistingItems(existingOrder.items);
    } else {
      setLocalExistingItems([]);
    }
  }, [existingOrder?.items]);

  const existingSubtotal = localExistingItems.reduce(
    (sum, item) =>
      sum +
      item.unitPrice *
        (typeof item.quantity === "number" ? item.quantity : 0),
    0
  );

  const existingVat = (existingSubtotal * vatPercentage) / 100;

  const existingTotal = existingSubtotal + existingVat;

  const newSubtotal = cartItems.reduce(
    (sum, item) => sum + getItemRate(item) * item.qty,
    0
  );

  const newVat = (newSubtotal * vatPercentage) / 100;

  const subtotal = existingSubtotal + newSubtotal;

  const vat = existingVat + newVat;

  const discountValue = parseFloat(discount) || 0;

  const total =
    existingTotal + newSubtotal + newVat - discountValue;

  useEffect(() => {
    onTotalChange?.(total);
  }, [total, onTotalChange]);

  /* ------------------------------------------------------------------------ */
  /* Order extras                                                             */
  /* ------------------------------------------------------------------------ */

  const buildOrderTypeExtras = (): Pick<
    Partial<CreateOrderPayload>,
    "customerId" | "deliveryDetails" | "onlinePlatform"
  > => {
    if (selectedType === CustomerTypeEnum.HOME_DELIVERY) {
      const extras = {
        ...(selectedCustomerId
          ? { customerId: selectedCustomerId }
          : {}),
        ...(deliveryDetails ? { deliveryDetails } : {}),
      };

      return extras;
    }

    if (
      selectedType === CustomerTypeEnum.ONLINE &&
      onlinePlatform
    ) {
      return {
        onlinePlatform,
      };
    }

    return {};
  };

  /* ------------------------------------------------------------------------ */
  /* Reset                                                                    */
  /* ------------------------------------------------------------------------ */

  const resetOrderState = () => {
    setCartItems([]);
    setSelectedCustomerId(null);
    setDeliveryDetails(null);
    setOnlinePlatform(null);
    setDiscount("0");
    onClearEdit();
  };

  /* ------------------------------------------------------------------------ */
  /* Order action                                                             */
  /* ------------------------------------------------------------------------ */

  const handleOrderAction = async (status: OrderStatus) => {
    if (!selectedCustomerType || cartItems.length === 0) {
      return;
    }

    if (
      selectedType === CustomerTypeEnum.HOME_DELIVERY &&
      !deliveryDetails
    ) {
      toast.error(
        "Please fill in the home delivery details first."
      );

      setIsHomeDeliveryModalOpen(true);

      return;
    }

    if (
      selectedType === CustomerTypeEnum.ONLINE &&
      !onlinePlatform
    ) {
      toast.error(
        "Please select an online platform first."
      );

      setIsOnlinePlatformModalOpen(true);

      return;
    }

    try {
      if (editingOrderId) {
        await updateOrder(editingOrderId, {
          customerTypeId: selectedCustomerType._id,

          tableId:
            selectedType === CustomerTypeEnum.DINE_IN
              ? tableId || undefined
              : undefined,

          vat,

          items: [
            ...localExistingItems.map((item) => ({
              foodId:
                typeof item.foodId === "object"
                  ? item.foodId._id
                  : item.foodId,

              portion: item.portionId || null,

              price: item.unitPrice,

              originalPrice: item.unitPrice,

              qty:
                typeof item.quantity === "number"
                  ? item.quantity
                  : 0,

              total:
                item.unitPrice *
                (typeof item.quantity === "number"
                  ? item.quantity
                  : 0),

              foodName: item.foodName,

              choices: item.choices || [],
            })),

            ...cartItems.map((item) => {
              const qty = item.qty;

              const price = getItemPrice(item);

              const originalPrice =
                getItemOriginalPrice(item.food);

              return {
                foodId: item.food._id,

                portion: item.portion
                  ? item.portion._id
                  : null,

                price,

                originalPrice,

                qty,

                total: price * qty,

                foodName: item.food.name,

                priceDetails: getPriceDetails(
                  item.food
                ),

                choices: item.choices,
              };
            }),
          ],

          subTotal: subtotal,

          total,

          discount: discountValue,

          status,

          ...buildOrderTypeExtras(),
        } as any);
      } else {
        await createOrder({
          customerTypeId: selectedCustomerType._id,

          tableId:
            selectedType === CustomerTypeEnum.DINE_IN
              ? tableId || undefined
              : undefined,

          vat,

          items: cartItems.map((item) => {
            const qty = item.qty;

            const price = getItemPrice(item);

            const originalPrice =
              getItemOriginalPrice(item.food);

            return {
              foodId: item.food._id,

              portion: item.portion
                ? item.portion._id
                : null,

              price,

              originalPrice,

              qty,

              total: price * qty,

              foodName: item.food.name,

              priceDetails: getPriceDetails(
                item.food
              ),

              choices: item.choices,
            };
          }),

          subTotal: subtotal,

          total,

          discount: discountValue,

          status,

          ...buildOrderTypeExtras(),
        });
      }

      if (status === OrderStatus.PLACED) {
        toast.success("Order saved successfully!");

        resetOrderState();
      } else if (status === OrderStatus.PRINTED) {
        toast.success("Order sent to print!");

        resetOrderState();
      } else if (status === OrderStatus.CANCELLED) {
        toast.success("Order cancelled.");

        resetOrderState();
      }
    } catch (error: any) {
      console.error(
        "Unable to create order",
        error?.response?.data ?? error
      );

      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Unable to process order"
      );
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Cart scrollbar                                                           */
  /* ------------------------------------------------------------------------ */

  const cartScrollRef = useRef<HTMLDivElement>(null);

  const [cartThumbTop, setCartThumbTop] =
    useState<number | null>(null);

  const THUMB_HEIGHT = 104;

  const THUMB_MIN_TOP = 8;

  useEffect(() => {
    const scrollEl = cartScrollRef.current;

    if (!scrollEl) {
      return;
    }

    const updateThumb = () => {
      const {
        scrollTop: st,
        scrollHeight,
        clientHeight,
      } = scrollEl;

      if (scrollHeight <= clientHeight + 1) {
        setCartThumbTop(null);
        return;
      }

      const maxTop =
        clientHeight -
        THUMB_HEIGHT -
        THUMB_MIN_TOP;

      const scrollRatio =
        st / (scrollHeight - clientHeight);

      setCartThumbTop(
        THUMB_MIN_TOP +
          scrollRatio * Math.max(maxTop, 0)
      );
    };

    updateThumb();

    scrollEl.addEventListener(
      "scroll",
      updateThumb
    );

    const ro = new ResizeObserver(updateThumb);

    ro.observe(scrollEl);

    return () => {
      scrollEl.removeEventListener(
        "scroll",
        updateThumb
      );

      ro.disconnect();
    };
  }, [cartItems.length]);

  /* ------------------------------------------------------------------------ */
  /* Column configuration — fluid widths, no breakpoint chains                */
  /* CHANGE: qty / vat / amount are now `whitespace-nowrap tabular-nums` so   */
  /* large numbers stay on one line and digits stay aligned as the column     */
  /* grows past its clamp() floor. `rate` keeps its own centering wrapper     */
  /* since it holds an input, not a span.                                    */
  /* ------------------------------------------------------------------------ */

  const colCls = {
    img: fluid.imgW,
    item: "flex-1 min-w-0",
    qty: `${fluid.colQty} shrink-0 text-center whitespace-nowrap tabular-nums`,
    vat: `hidden shrink-0 text-right sm:block ${fluid.colVat} whitespace-nowrap tabular-nums`,
    rate: `${fluid.colRate} shrink-0 text-center`,
    amount: `${fluid.colAmount} shrink-0 text-right whitespace-nowrap tabular-nums`,
    del: `${fluid.colDel} shrink-0`,
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <div className="flex h-full w-full flex-col">

        {/* Customer Type Tabs */}
        <div className={`flex w-full shrink-0 items-center justify-between gap-1.5 rounded-[10px] bg-[#D2D2D2] p-[3px] ${fluid.tabH}`}>
          {sortedCustomerTypes.map((customerType) => {
            const typeValue =
              customerType.type as CustomerTypeValue;

            const active =
              typeValue === selectedType;

            const label =
              CUSTOMER_TYPE_LABELS[typeValue] ||
              customerType.type ||
              customerType.type;

            return (
              <button
                key={customerType._id}
                type="button"
                onClick={() =>
                  handleSelectCustomerType(typeValue)
                }
                className={`flex h-full flex-1 items-center justify-center rounded-md transition-colors ${fluid.tabPadX} ${
                  active
                    ? "bg-[#3B0038]"
                    : "bg-[#EFEFEF]"
                }`}
              >
                <span
                  className={`whitespace-nowrap font-medium leading-none tracking-wide ${fluid.tabText} ${
                    active
                      ? "text-white"
                      : "text-[#3B0038]"
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Card */}
        <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-[15px] border border-[#C4C4C4] bg-[#EFEFEF]">

          {/* Header */}
          <div className={`flex shrink-0 items-center rounded-t-[15px] bg-[#9494945E] ${fluid.rowGap} ${fluid.headerH} ${fluid.headerPadX} ${fluid.headerPadY}`}>

            <span className={colCls.img} />

            <span
              className={`${colCls.item} font-semibold text-[#3B0038] ${fluid.headerText}`}
            >
              Item
            </span>

            <span
              className={`${colCls.qty} font-semibold text-[#3B0038] ${fluid.headerText}`}
            >
              Qty
            </span>

            <span
              className={`${colCls.vat} font-semibold text-[#3B0038] ${fluid.headerText}`}
            >
              VAT
            </span>

            <span
              className={`${colCls.rate} font-semibold text-[#3B0038] ${fluid.headerText}`}
            >
              Rate
            </span>

            <span
              className={`${colCls.amount} font-semibold text-[#3B0038] ${fluid.headerText}`}
            >
              Amount
            </span>

            <span className={colCls.del} />
          </div>

          {/* Cart area */}
          <div className="relative min-h-0 flex-1">

            {cartThumbTop !== null && (
              <span
                className="pointer-events-none absolute left-0 z-10 h-[104px] w-[3px] rounded-[5px] bg-[#3B0038] opacity-100 transition-[top] duration-150"
                style={{ top: cartThumbTop }}
              />
            )}

            <div
              ref={cartScrollRef}
              className="flex h-full flex-col gap-1.5 overflow-y-auto bg-[#EFEFEF] py-2 pb-1.5 pl-2 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >

              {/* Existing Items */}
              {localExistingItems.length > 0 && (
                <div className="mb-2 flex flex-col gap-1.5">

                  {localExistingItems.map(
                    (item, index) => {
                      const exQty =
                        typeof item.quantity === "number"
                          ? item.quantity
                          : 0;

                      const exRate =
                        item.unitPrice || 0;

                      const exVatAmt =
                        (exRate *
                          exQty *
                          vatPercentage) /
                        100;

                      const exAmount =
                        exRate * exQty +
                        exVatAmt;

                      return (
                        <div
                          key={`existing-${index}`}
                          className={`flex min-h-[70px] shrink-0 items-center rounded-md border border-[#CECECE] px-2 py-1.5 opacity-80 ${fluid.rowGap}`}
                        >

                          {/* Food image */}
                          <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#D2D2D2] ${fluid.imgW} ${fluid.imgH}`}>
                            {getMediaUrl(
                              item.foodId?.foodImage ??
                                null
                            ) ? (
                              <Image
                                src={
                                  getMediaUrl(
                                    item.foodId
                                      ?.foodImage ??
                                      null
                                  )!
                                }
                                alt={item.foodName}
                                width={118}
                                height={48}
                                className="h-full w-full rounded-[6px] object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-[8px] text-[#878787]">
                                🍽
                              </span>
                            )}
                          </div>

                          {/* Item name + qty */}
                          <div
                            className={`${colCls.item} flex flex-col gap-0.5`}
                          >
                            <p className={`truncate font-medium text-black ${fluid.rowText}`}>
                              {item.foodName}

                              {item.portionName
                                ? ` (${item.portionName})`
                                : ""}

                              {item.choices?.length > 0
                                ? ` [${item.choices.join(
                                    ", "
                                  )}]`
                                : ""}
                            </p>

                            <div className="flex items-center gap-1">

                              <button
                                type="button"
                                onClick={() =>
                                  setLocalExistingItems(
                                    (prev) =>
                                      prev.map(
                                        (i, idx) =>
                                          idx === index
                                            ? {
                                                ...i,
                                                quantity:
                                                  Math.max(
                                                    1,
                                                    (typeof i.quantity ===
                                                    "number"
                                                      ? i.quantity
                                                      : 1) - 1
                                                  ),
                                              }
                                            : i
                                      )
                                  )
                                }
                                className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border border-[#C4C4C4] bg-white"
                              >
                                <Minus
                                  size={8}
                                  className="text-black"
                                />
                              </button>

                              <input
                                type="number"
                                value={exQty}
                                onChange={(e) => {
                                  const v =
                                    parseInt(
                                      e.target.value,
                                      10
                                    );

                                  if (
                                    !isNaN(v) &&
                                    v > 0
                                  ) {
                                    setLocalExistingItems(
                                      (prev) =>
                                        prev.map(
                                          (i, idx) =>
                                            idx === index
                                              ? {
                                                  ...i,
                                                  quantity:
                                                    v,
                                                }
                                              : i
                                        )
                                    );
                                  }
                                }}
                                onBlur={(e) => {
                                  if (
                                    !e.target.value ||
                                    parseInt(
                                      e.target.value,
                                      10
                                    ) < 1
                                  ) {
                                    setLocalExistingItems(
                                      (prev) =>
                                        prev.map(
                                          (i, idx) =>
                                            idx === index
                                              ? {
                                                  ...i,
                                                  quantity: 1,
                                                }
                                              : i
                                        )
                                    );
                                  }
                                }}
                                style={{
                                  width: numInputWidth(exQty),
                                }}
                                className="min-w-[24px] shrink-0 border-b border-black/30 bg-transparent text-center text-xs font-medium text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  setLocalExistingItems(
                                    (prev) =>
                                      prev.map(
                                        (i, idx) =>
                                          idx === index
                                            ? {
                                                ...i,
                                                quantity:
                                                  (typeof i.quantity ===
                                                  "number"
                                                    ? i.quantity
                                                    : 0) + 1,
                                              }
                                            : i
                                      )
                                  )
                                }
                                className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full bg-[#670063]"
                              >
                                <Plus
                                  size={8}
                                  className="text-white"
                                />
                              </button>

                            </div>
                          </div>

                          <span
                            className={`${colCls.qty} font-medium text-black ${fluid.rowText}`}
                          >
                            {exQty}
                          </span>

                          <span
                            className={`${colCls.vat} text-[#555] ${fluid.rowText}`}
                          >
                            {exVatAmt.toFixed(1)}
                          </span>

                          <span
                            className={`${colCls.rate} font-medium text-black ${fluid.rowText}`}
                          >
                            {exRate.toFixed(2)}
                          </span>

                          <span
                            className={`${colCls.amount} font-semibold text-black ${fluid.rowText}`}
                          >
                            {exAmount.toFixed(2)}
                          </span>

                          <span className={colCls.del} />
                        </div>
                      );
                    }
                  )}

                  <div className="mt-1 flex items-center gap-2 rounded-md bg-[#E2E2E2] px-1 py-1 text-[10px] font-bold text-[#3B0038]">
                    <span>Additional Order</span>
                    <Utensils size={12} />
                  </div>

                </div>
              )}

              {/* Empty */}
              {cartItems.length === 0 && (
                <p className={`py-4 text-center text-[#878787] ${fluid.smallText}`}>
                  No items in cart
                </p>
              )}

              {/* New Cart Items */}
              {cartItems.map((item) => {
                const qty = item.qty;

                const rate = getItemRate(item);

                const itemVat =
                  (rate *
                    qty *
                    vatPercentage) /
                  100;

                const amount =
                  rate * qty + itemVat;

                const rateInputValue =
                  item.customRate !== undefined
                    ? item.customRate
                    : rate;

                return (
                  <div
                    key={item.id}
                    className={`flex min-h-[62px] shrink-0 items-center rounded-md border border-[#CECECE] px-2 py-1.5 ${fluid.rowGap}`}
                  >

                    {/* Food image */}
                    <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-[#D2D2D2] ${fluid.imgW} ${fluid.imgH}`}>
                      {getMediaUrl(
                        item.food.foodImage
                      ) ? (
                        <Image
                          src={
                            getMediaUrl(
                              item.food.foodImage
                            )!
                          }
                          alt={item.food.name}
                          width={118}
                          height={48}
                          className="h-full w-full rounded-[6px] object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[8px] text-[#878787]">
                          🍽
                        </span>
                      )}
                    </div>

                    {/* Item name + qty */}
                    <div
                      className={`${colCls.item} flex flex-col gap-0.5`}
                    >
                      <p className={`truncate font-medium text-black ${fluid.rowText}`}>
                        {item.food.name}

                        {item.portion
                          ? ` (${item.portion.name})`
                          : ""}

                        {item.choices?.length > 0
                          ? ` [${item.choices.join(
                              ", "
                            )}]`
                          : ""}
                      </p>

                      <div className="flex items-center gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            handleDecrement(
                              item.id
                            )
                          }
                          className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border border-[#C4C4C4] bg-white"
                        >
                          <Minus
                            size={8}
                            className="text-black"
                          />
                        </button>

                        <input
                          type="number"
                          value={qty}
                          onChange={(e) => {
                            suppressBeepRef.current = true;

                            const val =
                              parseInt(
                                e.target.value,
                                10
                              );

                            if (
                              !isNaN(val) &&
                              val > 0
                            ) {
                              setCartItems(
                                (prev) =>
                                  prev.map(
                                    (i) =>
                                      i.id === item.id
                                        ? {
                                            ...i,
                                            qty: val,
                                          }
                                        : i
                                  )
                              );
                            } else if (
                              e.target.value === ""
                            ) {
                              setCartItems(
                                (prev) =>
                                  prev.map(
                                    (i) =>
                                      i.id === item.id
                                        ? {
                                            ...i,
                                            qty: "" as unknown as number,
                                          }
                                        : i
                                  )
                              );
                            }
                          }}
                          onBlur={(e) => {
                            if (
                              !e.target.value ||
                              parseInt(
                                e.target.value,
                                10
                              ) < 1
                            ) {
                              suppressBeepRef.current = true;

                              setCartItems(
                                (prev) =>
                                  prev.map(
                                    (i) =>
                                      i.id === item.id
                                        ? {
                                            ...i,
                                            qty: 1,
                                          }
                                        : i
                                  )
                              );
                            }
                          }}
                          style={{
                            width: numInputWidth(qty),
                          }}
                          className="min-w-[24px] shrink-0 border-b border-black/30 bg-transparent text-center text-xs font-medium text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            handleIncrement(
                              item.id
                            )
                          }
                          className="flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full bg-[#670063]"
                        >
                          <Plus
                            size={8}
                            className="text-white"
                          />
                        </button>

                      </div>
                    </div>

                    {/* Qty */}
                    <span
                      className={`${colCls.qty} font-medium text-black ${fluid.rowText}`}
                    >
                      {qty}
                    </span>

                    {/* VAT */}
                    <span
                      className={`${colCls.vat} text-[#555] ${fluid.rowText}`}
                    >
                      {itemVat.toFixed(1)}
                    </span>

                    {/* Rate */}
                    <div
                      className={`${colCls.rate} flex items-center justify-center`}
                    >
                      <input
                        type="number"
                        value={rateInputValue}
                        onChange={(e) =>
                          handleRateChange(
                            item.id,
                            e.target.value
                          )
                        }
                        onBlur={(e) => {
                          if (
                            !e.target.value ||
                            parseFloat(
                              e.target.value
                            ) < 0
                          ) {
                            handleRateChange(
                              item.id,
                              rate.toString()
                            );
                          }
                        }}
                        style={{
                          width: numInputWidth(
                            rateInputValue,
                            3
                          ),
                        }}
                        className={`min-w-[32px] border-b border-black/30 bg-transparent text-center font-medium text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${fluid.rowText}`}
                      />
                    </div>

                    {/* Amount */}
                    <span
                      className={`${colCls.amount} font-semibold text-black ${fluid.rowText}`}
                    >
                      {amount.toFixed(2)}
                    </span>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem(item.id)
                      }
                      aria-label={`Remove ${item.food.name} from cart`}
                      className={`${colCls.del} flex h-[15px] w-[15px] items-center justify-center rounded-[10px] bg-[#FF0F0F] p-0.5`}
                    >
                      <X
                        size={9}
                        className="text-white"
                      />
                    </button>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="mx-auto h-px w-[calc(100%-18px)] shrink-0 bg-[#CECECE]" />

          {/* Bottom section */}
          <div className="mx-auto flex w-[calc(100%-18px)] shrink-0 flex-col gap-[3px] pb-2 pt-1.5">

            {/* Items */}
            <div className={`flex justify-between gap-2 font-medium text-black ${fluid.smallText}`}>
              <span>
                Items (
                {cartItems.length +
                  localExistingItems.length}
                )
              </span>

              <span className="whitespace-nowrap font-normal tabular-nums">
                {subtotal.toFixed(2)}
              </span>
            </div>

            {/* Subtotal */}
            <div className={`flex justify-between gap-2 font-medium text-black ${fluid.smallText}`}>
              <span>Subtotal</span>

              <span className="whitespace-nowrap font-normal tabular-nums">
                {subtotal.toFixed(2)}
              </span>
            </div>

            {/* VAT */}
            <div className={`flex justify-between gap-2 font-medium text-black ${fluid.smallText}`}>
              <span>
                VAT ({vatPercentage}%)
              </span>

              <span className="whitespace-nowrap font-normal tabular-nums">
                {vat.toFixed(2)}
              </span>
            </div>

            {/* Discount */}
            <div className={`flex items-center justify-between gap-2 font-medium text-black ${fluid.smallText}`}>
              <label className="shrink-0">
                Discount
              </label>

              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => {
                  const v = e.target.value;

                  if (
                    v === "" ||
                    parseFloat(v) >= 0
                  ) {
                    setDiscount(v);
                  }
                }}
                onFocus={(e) => {
                  // Select the current value so the first keystroke
                  // replaces it (e.g. typing "5" over a selected "0"
                  // gives "5", not "05"), and backspace clears it in
                  // one press instead of fighting a leading zero.
                  e.target.select();
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setDiscount("0");
                  }
                }}
                className={`min-w-0 border-b border-black/30 bg-transparent text-right font-medium text-black outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${fluid.discountW} ${fluid.smallText}`}
              />
            </div>

            <div className="my-1 border-t border-[#878787]" />

            {/* Total */}
            <div className="flex items-center justify-between gap-2">
              <span className={`font-bold text-black ${fluid.totalText}`}>
                Total
              </span>

              <span className={`whitespace-nowrap font-bold tabular-nums text-black ${fluid.totalText}`}>
                {Math.max(0, total).toFixed(2)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="mb-2 flex flex-wrap justify-between gap-2">

              <button
                type="button"
                onClick={() =>
                  handleOrderAction(
                    OrderStatus.PLACED
                  )
                }
                className={`flex min-w-[80px] flex-1 items-center justify-center rounded-[10px] bg-[#3EA200] font-semibold text-white ${fluid.actionH} ${fluid.actionText}`}
              >
                Save
              </button>

              <button
                type="button"
                onClick={() =>
                  void handleOrderAction(
                    OrderStatus.PRINTED
                  )
                }
                className={`flex min-w-[80px] flex-1 items-center justify-center rounded-[10px] bg-[#3B0038] font-semibold text-white ${fluid.actionH} ${fluid.actionText}`}
              >
                Print
              </button>

              <button
                type="button"
                onClick={() =>
                  handleOrderAction(
                    OrderStatus.CANCELLED
                  )
                }
                className={`flex min-w-[80px] flex-1 items-center justify-center rounded-[10px] bg-[#FF0F0F] font-semibold text-white ${fluid.actionH} ${fluid.actionText}`}
              >
                Cancel
              </button>

            </div>

            {/* Footer actions */}
            <div className={`mb-0 flex items-center justify-between gap-1 rounded-[10px] bg-[#D2D2D2] px-2 py-1.5 ${fluid.footerH}`}>

              {footerActions.map(
                ({ icon: Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      if (label === "Table") {
                        openTableModal();
                      }

                      if (label === "Order") {
                        setIsOrderModalOpen(
                          true
                        );
                      }

                      if (
                        label === "Customers"
                      ) {
                        setIsCustomerModalOpen(
                          true
                        );
                      }
                    }}
                    className={`flex max-w-[82px] flex-1 flex-col items-center justify-center gap-0.5 rounded-md bg-[#EFEFEF] px-1 py-1 ${fluid.footerBtnH}`}
                  >
                    <Icon className={`text-[#3B0038] ${fluid.footerIcon}`} />

                    <span className={`font-normal text-[#3B0038] ${fluid.footerLabel}`}>
                      {label}
                    </span>
                  </button>
                )
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        open={isOrderModalOpen}
        onClose={() =>
          setIsOrderModalOpen(false)
        }
        onEdit={(orderId) => {
          onEditOrder(orderId);
          setIsOrderModalOpen(false);
        }}
      />

      {/* Customer Modal */}
      <CustomerModal
        open={isCustomerModalOpen}
        onClose={() =>
          setIsCustomerModalOpen(false)
        }
      />

      {/* Home Delivery Modal */}
      <HomeDeliveryModal
        open={isHomeDeliveryModalOpen}
        onClose={() =>
          setIsHomeDeliveryModalOpen(false)
        }
        onSubmit={handleHomeDeliverySubmit}
      />

      {/* Online Platform Modal */}
      <OnlinePlatformModal
        open={isOnlinePlatformModalOpen}
        onClose={() =>
          setIsOnlinePlatformModalOpen(false)
        }
        platforms={onlinePlatformOptions}
        onSubmit={handleOnlinePlatformSubmit}
      />
    </>
  );
}