"use client";

import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";

import { CategoryTable } from "@/src/components/menu/CategoryTable";
import { MenuTypeTable } from "@/src/components/menu/MenuTypeTable";
import { FoodTable } from "@/src/components/menu/FoodTable";

import { CategoryFormAction } from "@/src/components/menu/AddCategory";
import { MenuTypeFormAction } from "@/src/components/menu/AddMenuType";
import { FoodFormAction } from "@/src/components/menu/AddFood";

import { ListCategoryApi } from "@/src/api/category/api/GetAll";
import { ListMenuTypeApi } from "@/src/api/menu-type/api/GetAll";
import { ListFoodApi } from "@/src/api/food/api/GetAll";

const TABS = ["Category", "Menu Type", "Food", "Combo"] as const;
type MenuTab = (typeof TABS)[number];

const DEFAULT_TAB: MenuTab = "Category";

function isMenuTab(value: string | null): value is MenuTab {
  return (TABS as readonly string[]).includes(value ?? "");
}

// Renamed: this is the part that actually calls useSearchParams()
function MenuPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get("tab");
  const activeTab: MenuTab = isMenuTab(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;

  const [search, setSearch] = useState("");

  const handleTabChange = (tab: MenuTab) => {
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

  const { data: categoryData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ["getAllCategories", search],
    queryFn: () => ListCategoryApi({ search, page: 1, limit: 100 }),
    enabled: activeTab === "Category",
  });

  const { data: menuTypeData, isLoading: isMenuTypeLoading } = useQuery({
    queryKey: ["getAllMenuTypes", search],
    queryFn: () => ListMenuTypeApi({ search, page: 1, limit: 100 }),
    enabled: activeTab === "Menu Type",
  });

  const { data: foodData, isLoading: isFoodLoading } = useQuery({
    queryKey: ["getAllFoods", search],
    queryFn: () => ListFoodApi({ search, page: 1, limit: 100 }),
    enabled: activeTab === "Food",
  });

  const categories = categoryData?.data ?? [];
  const menuTypes = menuTypeData?.data ?? [];
  const foods = foodData?.data ?? [];

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

            {activeTab === "Category" && <CategoryFormAction isEdit={false} />}
            {activeTab === "Menu Type" && <MenuTypeFormAction isEdit={false} />}
            {activeTab === "Food" && <FoodFormAction isEdit={false} />}
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex justify-end">
              <SearchInput variant="panel" value={search} onChange={setSearch} className="w-full sm:w-auto" />
            </div>

            {activeTab === "Category" && <CategoryTable data={categories} isLoading={isCategoryLoading} />}
            {activeTab === "Menu Type" && <MenuTypeTable data={menuTypes} isLoading={isMenuTypeLoading} />}
            {activeTab === "Food" && <FoodTable data={foods} isLoading={isFoodLoading} />}
          </div>
        </div>

        <span className="font-poppins text-[12px] font-medium text-[#939393]">
          © 2026 F-FERM Digital Labs. All rights reserved.
        </span>
      </div>
    </main>
  );
}

// Default export: wraps the content in a Suspense boundary
export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuPageContent />
    </Suspense>
  );
}