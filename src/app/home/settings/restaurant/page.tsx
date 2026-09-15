"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Calendar,
  Clock, Globe, ImagePlus, Mail, MapPin,
  Pencil,
  Phone,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { CustomerTypeTable } from "@/src/components/settings/restaurant/CustomerTypeTable";
import { FloorTable } from "@/src/components/settings/restaurant/FloorTable";
import { formatDisplayDate } from "@/src/components/settings/restaurant/TableHelpers";

import { ListCustomerTypeApi } from "@/src/api/customer-type/api/GetAll";
import { ListFloorApi } from "@/src/api/floor/api/GetAll";
import { listRestaurants, updateRestaurant, type RestaurantPayload } from "@/src/api/restaurant";
import { ListTableApi } from "@/src/api/table/api/GetAll";
import { CustomerTypeFormAction } from "@/src/components/settings/restaurant/AddCustomerType";
import { FloorFormAction } from "@/src/components/settings/restaurant/AddFloor";
import { TableFormAction } from "@/src/components/settings/restaurant/AddTable";
import { RestaurantTableList } from "@/src/components/settings/restaurant/Table";
import EditRestaurantModal from "@/src/components/settings/restaurant/EditRestaurantModal";


const TABS = ["My Restaurant", "Customer Types", "Floor", "Table"] as const;
type RestaurantTab = (typeof TABS)[number];

const DEFAULT_TAB: RestaurantTab = "My Restaurant";

function isRestaurantTab(value: string | null): value is RestaurantTab {
  return (TABS as readonly string[]).includes(value ?? "");
}

// Renamed: holds the useSearchParams() call and all the page logic
function RestaurantSettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const tabFromUrl = searchParams.get("tab");
  const activeTab: RestaurantTab = isRestaurantTab(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;

  const [search, setSearch] = useState("");
  const [isEditRestaurantOpen, setIsEditRestaurantOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: restaurantListData, isLoading: isRestaurantLoading } = useQuery({
    queryKey: ["getRestaurant"],
    queryFn: () => listRestaurants(),
  });

  const restaurant =
    restaurantListData?.data.find((item) => item.isActive) ||
    restaurantListData?.data[0] ||
    null;

  const { data: customerTypeListData, isLoading: isCustomerTypeListLoading } = useQuery({
    queryKey: ["getAllCustomerTypes", search],
    queryFn: () =>
      ListCustomerTypeApi({
        search,
        page: 1,
        limit: 100,
      }),
    enabled: activeTab === "Customer Types",
  });

  const { data: floorListData, isLoading: isFloorListLoading } = useQuery({
    queryKey: ["getAllFloors", search],
    queryFn: () =>
      ListFloorApi({
        search,
        page: 1,
        limit: 100,
      }),
    enabled: activeTab === "Floor",
  });

  const { data: tableListData, isLoading: isTableListLoading } = useQuery({
    queryKey: ["getAllTables", search],
    queryFn: () =>
      ListTableApi({
        search,
        page: 1,
        limit: 100,
      }),
    enabled: activeTab === "Table",
  });

  const customerTypes = customerTypeListData?.data ?? [];
  const floors = floorListData?.data ?? [];
  const tables = tableListData?.data ?? [];

  const infoCards = restaurant
    ? [
        { icon: MapPin, label: "Address", value: restaurant.address || "-" },
        { icon: Phone, label: "Phone", value: restaurant.phone || "-" },
        { icon: Mail, label: "Email", value: restaurant.email || "Not specified" },
        { icon: Globe, label: "Country", value: restaurant.country || "-" },
        { icon: Globe, label: "State", value: restaurant.state || "-" },
        { icon: Building2, label: "City", value: restaurant.city || "-" },
        { icon: Clock, label: "Opening Time", value: restaurant.openingTime || "-" },
        { icon: Clock, label: "Closing Time", value: restaurant.closingTime || "-" },
        { icon: Phone, label: "Primary Phone", value: restaurant.phone || "-" },
        { icon: Smartphone, label: "Secondary Phone", value: restaurant.phone2 || "-" },
      ]
    : [];

  const handleTabChange = (tab: RestaurantTab) => {
    setSearch("");
    const params = new URLSearchParams(searchParams.toString());
    if (tab === DEFAULT_TAB) {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  };

  const handleSaveRestaurant = async (payload: RestaurantPayload, logoFile?: File) => {
    if (!restaurant) return;
    try {
      await updateRestaurant(restaurant._id, payload, logoFile);
      toast.success("Restaurant details updated!");
      await queryClient.invalidateQueries({ queryKey: ["getRestaurant"] });
      setIsEditRestaurantOpen(false);
    } catch (error: any) {
      console.error("Unable to update restaurant", error?.response?.data ?? error);
      toast.error(
        error?.response?.data?.message ?? error?.message ?? "Unable to update restaurant",
      );
    }
  };

 return (
    <main className="flex h-screen flex-col overflow-x-hidden bg-black text-black">
      <POSHeader />

      <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto bg-[#EFEFEF] px-3 pb-4">
        <div className="flex w-full flex-1 flex-col gap-3 rounded-[15px] bg-[#D2D2D2] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {TABS.map((tab) => {
                const selected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabChange(tab)}
                    className={`flex h-[42px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] border px-4 font-poppins text-[15px] font-semibold transition-colors sm:px-5 sm:text-[18px] ${
                      selected
                        ? "border-transparent bg-[#450042] text-white"
                        : "border-[#9C9C9C] bg-[#D2D2D2] text-black"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {activeTab === "Customer Types" && <CustomerTypeFormAction isEdit={false} />}
            {activeTab === "Floor" && <FloorFormAction isEdit={false} />}
            {activeTab === "Table" && <TableFormAction isEdit={false} />}
          </div>

          {activeTab === "My Restaurant" ? (
            <div className="flex flex-1 flex-col gap-6 mt-8 lg:mt-12 lg:flex-row lg:justify-start">
              {/* Profile section */}
              <div className="flex w-full flex-col items-center lg:w-[267px] lg:shrink-0 lg:items-start">
                <div className="mb-3 flex h-[153px] w-[158px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#9C9C9C] bg-[#EFEFEF] p-[10px] text-[#A1A1A1]">
                  {restaurant?.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={restaurant.logo} alt="Restaurant" className="h-full w-full rounded-full object-cover" />
                  ) : (
                    <ImagePlus size={22} />
                  )}
                </div>

                <div className="mb-2 flex items-center gap-2 font-poppins text-[18px] font-semibold leading-none text-black">
                  <Building2 size={18} />
                  {isRestaurantLoading ? "Loading..." : restaurant?.name ?? "Restaurant"}
                  <button
                    type="button"
                    onClick={() => setIsEditRestaurantOpen(true)}
                    className="ml-1 flex items-center justify-center rounded-full bg-[#450042] p-1.5 text-white transition-colors hover:bg-[#3b0038]"
                    aria-label="Edit restaurant profile"
                    disabled={!restaurant}
                  >
                    <Pencil size={13} />
                  </button>
                </div>

                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-2 font-poppins text-[16px] font-medium text-[#4D4D4D]">
                    <Calendar size={16} />
                    Created: {restaurant ? formatDisplayDate(restaurant.createdAt) : "-"}
                  </div>
                  <div className="flex items-center gap-2 font-poppins text-[16px] font-medium text-[#4D4D4D]">
                    <RefreshCw size={16} />
                    Updated: {restaurant ? formatDisplayDate(restaurant.updatedAt) : "-"}
                  </div>
                </div>
              </div>

              {/* Info cards */}
              <div className="flex flex-1 flex-wrap content-start gap-[10px]">
                {infoCards.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex h-[93px] w-full flex-col gap-[10px] rounded-[10px] bg-[#B8B8B8] pb-[26px] pl-[20px] pr-[20px] pt-[27px] sm:w-[220px]"
                  >
                    <div className="flex items-center gap-2 font-poppins text-[16px] font-semibold leading-none text-black">
                      <Icon size={16} />
                      {label}
                    </div>
                    <p
                      className={`font-poppins text-[16px] font-medium leading-none text-[#4D4D4D] ${
                        !value || value === "Not specified" ? "italic" : ""
                      }`}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-1  flex-col gap-4">
              <div className="flex justify-end">
                <SearchInput variant="panel" value={search} onChange={setSearch} className="w-full sm:w-auto" />
              </div>

              {activeTab === "Customer Types" && (
                <CustomerTypeTable data={customerTypes} isLoading={isCustomerTypeListLoading} />
              )}
              {activeTab === "Floor" && (
                <FloorTable data={floors} isLoading={isFloorListLoading} />
              )}
              {activeTab === "Table" && (
                <RestaurantTableList data={tables} isLoading={isTableListLoading} />
              )}
            </div>
          )}
        </div>

        <span className="font-poppins text-[12px] font-medium text-[#939393]">
          © 2026 F-FERM Digital Labs. All rights reserved.
        </span>
      </div>

      <EditRestaurantModal
        isOpen={isEditRestaurantOpen}
        onClose={() => setIsEditRestaurantOpen(false)}
        onSave={handleSaveRestaurant}
        initialRecord={restaurant}
      />
    </main>
  );
}

// Default export: wraps content in Suspense
export default function RestaurantSettingsPage() {
  return (
    <Suspense fallback={null}>
      <RestaurantSettingsPageContent />
    </Suspense>
  );
}