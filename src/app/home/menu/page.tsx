"use client";

import { useMemo, useState } from "react";
import userPlus from "../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";


import AddFoodModal, { NewFoodInput } from "@/src/components/menu/AddFoodModal";
import AddCategoryModal, { NewCategoryInput } from "@/src/components/menu/AddCategoryModal";
import AddMenuTypeModal, { NewMenuTypeInput } from "@/src/components/menu/AddMenuTypeModal";
import AddComboModal, { NewComboInput } from "@/src/components/menu/AddComboModal";
import { Button } from "@/src/components/ui/button";


type Category = {
  id: number;
  name: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
};

type MenuType = {
  id: number;
  name: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
};

type Food = {
  id: number;
  image?: string;
  name: string;
  category: string;
  kitchen: string;
  foodType: "Veg" | "Non-Veg";
  createdBy: string;
  createdAt: string;
};

type Combo = {
  id: number;
  image?: string;
  name: string;
  price: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

const TABS = ["Category", "Menu Type", "Food", "Combo"] as const;
type MenuTab = (typeof TABS)[number];

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

const CATEGORY_COLUMNS = [
  "No.",
  "Category Name",
  "Created By",
  "Created Date",
  "Updated Date",
  "Actions",
] as const;

const MENU_TYPE_COLUMNS = [
  "No.",
  "Menu Type",
  "Created By",
  "Created Date",
  "Updated Date",
  "Actions",
] as const;

const FOOD_COLUMNS = [
  "No.",
  "Image",
  "Food Name",
  "Category",
  "Kitchen",
  "Food Type",
  "Created By",
  "Created At",
  "Actions",
] as const;

const COMBO_COLUMNS = [
  "No.",
  "Image",
  "Combo Name",
  "Combo Price",
  "Created By",
  "Created At",
  "Updated At",
  "Actions",
] as const;

const CATEGORY_GRID = "grid-cols-[48px_1.4fr_1fr_1fr_1fr_80px]";
const MENU_TYPE_GRID = "grid-cols-[48px_1.4fr_1fr_1fr_1fr_80px]";
const FOOD_GRID = "grid-cols-[48px_70px_1.2fr_1fr_1fr_0.8fr_1fr_1fr_80px]";
const COMBO_GRID = "grid-cols-[48px_70px_1.4fr_1fr_1fr_1fr_1fr_80px]";

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const TAB_META: Record<
  MenuTab,
  { columns: readonly string[]; grid: string; addLabel: string }
> = {
  Category: { columns: CATEGORY_COLUMNS, grid: CATEGORY_GRID, addLabel: "Add Category" },
  "Menu Type": { columns: MENU_TYPE_COLUMNS, grid: MENU_TYPE_GRID, addLabel: "Add Menu Type" },
  Food: { columns: FOOD_COLUMNS, grid: FOOD_GRID, addLabel: "Add Food" },
  Combo: { columns: COMBO_COLUMNS, grid: COMBO_GRID, addLabel: "Add Combo" },
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<MenuTab>("Category");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isMenuTypeModalOpen, setIsMenuTypeModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);

  const meta = TAB_META[activeTab];

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(query));
  }, [categories, search]);

  const filteredMenuTypes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return menuTypes;
    return menuTypes.filter((m) => m.name.toLowerCase().includes(query));
  }, [menuTypes, search]);

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return foods;
    return foods.filter((f) =>
      [f.name, f.category, f.kitchen].join(" ").toLowerCase().includes(query),
    );
  }, [foods, search]);

  const filteredCombos = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return combos;
    return combos.filter((c) => c.name.toLowerCase().includes(query));
  }, [combos, search]);

  const rowsByTab: Record<MenuTab, unknown[]> = {
    Category: filteredCategories,
    "Menu Type": filteredMenuTypes,
    Food: filteredFoods,
    Combo: filteredCombos,
  };
  const rows = rowsByTab[activeTab];
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize) || 0);

  const openAddModal = () => {
    switch (activeTab) {
      case "Category":
        setIsCategoryModalOpen(true);
        break;
      case "Menu Type":
        setIsMenuTypeModalOpen(true);
        break;
      case "Food":
        setIsFoodModalOpen(true);
        break;
      case "Combo":
        setIsComboModalOpen(true);
        break;
    }
  };

  const handleAddCategory = (data: NewCategoryInput) => {
    const today = formatDate(new Date());
    setCategories((current) => [
      ...current,
      {
        id: current.length + 1,
        name: data.categoryName,
        createdBy: "Admin",
        createdDate: today,
        updatedDate: today,
      },
    ]);
    setIsCategoryModalOpen(false);
  };

  const handleAddMenuType = (data: NewMenuTypeInput) => {
    const today = formatDate(new Date());
    setMenuTypes((current) => [
      ...current,
      {
        id: current.length + 1,
        name: data.menuType,
        createdBy: "Admin",
        createdDate: today,
        updatedDate: today,
      },
    ]);
    setIsMenuTypeModalOpen(false);
  };

  const handleAddFood = (data: NewFoodInput) => {
    const today = formatDate(new Date());
    setFoods((current) => [
      ...current,
      {
        id: current.length + 1,
        image: data.foodImage,
        name: data.foodName,
        category: data.category,
        kitchen: data.kitchen,
        foodType: data.foodType,
        createdBy: "Admin",
        createdAt: today,
      },
    ]);
    setIsFoodModalOpen(false);
  };

  const handleAddCombo = (data: NewComboInput) => {
    const today = formatDate(new Date());
    setCombos((current) => [
      ...current,
      {
        id: current.length + 1,
        image: data.foodImage,
        name: data.comboName,
        price: data.price,
        createdBy: "Admin",
        createdAt: today,
        updatedAt: today,
      },
    ]);
    setIsComboModalOpen(false);
  };
 const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex h-full flex-col overflow-hidden bg-black text-white">
      <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col bg-[#2C192B] px-[29px] pb-[18px] pt-[22px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[26px] font-semibold">{activeTab}</h2>

          <Button
            variant="addcustomer"
            size="none"
            iconSrc={userPlus}
            iconAlt={meta.addLabel}
            onClick={openAddModal}
          >
            {meta.addLabel}
          </Button>
        </div>

        <div className="mt-[16px] flex flex-wrap items-center gap-[12px]">
          {TABS.map((tab) => {
            const selected = activeTab === tab;

            return (
             <button
  key={tab}
  type="button"
  onClick={() => {
    setActiveTab(tab);
    setSearch("");
  }}
  className={`
    flex
    h-[50px]
    min-w-[120px]
    items-center
    justify-center
    gap-[10px]
    rounded-[12px]
    border
    px-[18px]
    pt-[15px]
    pr-[17px]
    pb-[14px]
    pl-[18px]
    text-[18px]
    font-semibold
    whitespace-nowrap
    transition-colors
    ${
      selected
        ? "border-[#D4CCD4] bg-[#FFFFFF29] text-white"
        : "border-transparent bg-black text-white"
    }
  `}
>
  {tab}
</button>
            );
          })}

          <SearchInput
            variant="panel"
            value={search}
            onChange={(value) => setSearch(value)}
            className="w-full sm:ml-auto sm:w-[280px]"
          />
        </div>

        <div className="mt-[14px] flex min-h-0 flex-1 flex-col overflow-hidden rounded-[12px]">
          <div
            className={`hidden items-center justify-between gap-2 bg-black px-[18px] py-[12px] text-[13px] font-normal text-white sm:flex sm:text-[16px] ${meta.grid}`}
          >
            {meta.columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#82367F4D]">
            {rows.length === 0 && (
              <p className="px-[16px] py-[18px] text-[14px] text-white/80">
                No Data Available
              </p>
            )}

            {activeTab === "Category" &&
              filteredCategories.slice(0, pageSize).map((category, index) => (
                <div
                  key={category.id}
                  className={`grid border-b border-white/5 px-[16px] py-[12px] text-[12px] text-white/90 ${CATEGORY_GRID}`}
                >
                  <span>{index + 1}</span>
                  <span className="truncate">{category.name}</span>
                  <span className="truncate">{category.createdBy}</span>
                  <span>{category.createdDate}</span>
                  <span>{category.updatedDate}</span>
                  <span />
                </div>
              ))}

            {activeTab === "Menu Type" &&
              filteredMenuTypes.slice(0, pageSize).map((menuType, index) => (
                <div
                  key={menuType.id}
                  className={`grid border-b border-white/5 px-[16px] py-[12px] text-[12px] text-white/90 ${MENU_TYPE_GRID}`}
                >
                  <span>{index + 1}</span>
                  <span className="truncate">{menuType.name}</span>
                  <span className="truncate">{menuType.createdBy}</span>
                  <span>{menuType.createdDate}</span>
                  <span>{menuType.updatedDate}</span>
                  <span />
                </div>
              ))}

            {activeTab === "Food" &&
              filteredFoods.slice(0, pageSize).map((food, index) => (
                <div
                  key={food.id}
                  className={`grid items-center border-b border-white/5 px-[16px] py-[12px] text-[12px] text-white/90 ${FOOD_GRID}`}
                >
                  <span>{index + 1}</span>
                  <span>
                    {food.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={food.image}
                        alt={food.name}
                        className="h-8 w-8 rounded-[6px] object-cover"
                      />
                    ) : (
                      <span className="block h-8 w-8 rounded-[6px] bg-white/10" />
                    )}
                  </span>
                  <span className="truncate">{food.name}</span>
                  <span className="truncate">{food.category}</span>
                  <span className="truncate">{food.kitchen}</span>
                  <span className="truncate">{food.foodType}</span>
                  <span className="truncate">{food.createdBy}</span>
                  <span>{food.createdAt}</span>
                  <span />
                </div>
              ))}

            {activeTab === "Combo" &&
              filteredCombos.slice(0, pageSize).map((combo, index) => (
                <div
                  key={combo.id}
                  className={`grid items-center border-b border-white/5 px-[16px] py-[12px] text-[12px] text-white/90 ${COMBO_GRID}`}
                >
                  <span>{index + 1}</span>
                  <span>
                    {combo.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={combo.image}
                        alt={combo.name}
                        className="h-8 w-8 rounded-[6px] object-cover"
                      />
                    ) : (
                      <span className="block h-8 w-8 rounded-[6px] bg-white/10" />
                    )}
                  </span>
                  <span className="truncate">{combo.name}</span>
                  <span>{combo.price.toFixed(2)}</span>
                  <span className="truncate">{combo.createdBy}</span>
                  <span>{combo.createdAt}</span>
                  <span>{combo.updatedAt}</span>
                  <span />
                </div>
              ))}
          </div>
        </div>

        <div className="mt-[14px]">
         <Pagination
            currentPage={1}
            totalItems={10}
         
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAdd={handleAddCategory}
      />

      <AddMenuTypeModal
        isOpen={isMenuTypeModalOpen}
        onClose={() => setIsMenuTypeModalOpen(false)}
        onAdd={handleAddMenuType}
      />

      <AddFoodModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onAdd={handleAddFood}
        categoryOptions={categories.map((c) => ({ label: c.name, value: c.name }))}
        menuTypeOptions={menuTypes.map((m) => ({ label: m.name, value: m.name }))}
      />

      <AddComboModal
        isOpen={isComboModalOpen}
        onClose={() => setIsComboModalOpen(false)}
        onAdd={handleAddCombo}
        foodOptions={foods.map((f) => ({ label: f.name, value: f.name }))}
      />
    </main>
  );
}