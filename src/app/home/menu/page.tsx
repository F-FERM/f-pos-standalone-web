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

  const CARD_TOP = 0;
  const CARD_LEFT = 20;
  const CARD_WIDTH = 984;
  const CARD_HEIGHT = 661;

  return (
    <main className="flex h-full flex-col overflow-y-auto bg-black text-black">
      <POSHeader />

      {/* relative canvas — explicit min-height guarantees the card + footer always fit and render */}
      <div
        className="relative flex-1 bg-[#EFEFEF]"
        style={{ minHeight: CARD_TOP + CARD_HEIGHT + 40 }}
      >
        {/* content card — exact spec: 984x661, radius15, bg #D2D2D2, pulled up right under the header */}
        <div
          className="absolute"
          style={{
            top: CARD_TOP,
            left: CARD_LEFT,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            borderRadius: 15,
            background: "#D2D2D2",
          }}
        />

        <div
          className="absolute flex items-center justify-between"
          style={{ top: CARD_TOP + 20, left: 30, width: 964 }}
        >
          <div className="flex flex-wrap items-center gap-[12px]">
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
                  className="flex shrink-0 items-center justify-center whitespace-nowrap transition-colors"
                  style={{
                    width: 120,
                    height: 50,
                    borderRadius: 12,
                    border: selected ? "1px solid transparent" : "1px solid #9C9C9C",
                    background: selected ? "#450042" : "#D2D2D2",
                    paddingTop: 15,
                    paddingRight: 17,
                    paddingBottom: 14,
                    paddingLeft: 18,
                    gap: 10,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: 18,
                    lineHeight: "100%",
                    letterSpacing: 0,
                    color: selected ? "#FFFFFF" : "#000000",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

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

        <div
          className="absolute"
          style={{ top: CARD_TOP + 88, left: 30, width: 964, display: "flex" }}
        >
          <SearchInput
            variant="panel"
            value={search}
            onChange={(value) => setSearch(value)}
            className="ml-auto"
          />
        </div>

        {/* header row — exact spec: 964x40, radius10, bg #EFEFEF */}
       {/* header row — exact spec: 964x40, radius10, bg #EFEFEF */}
{/* header row — exact spec: 964x40, radius10, bg #EFEFEF */}
<div
  className="absolute hidden items-center sm:flex"
  style={{
    top: CARD_TOP + 139,
    left: 30,
    width: 964,
    height: 40,
    justifyContent: "space-between",
    borderRadius: 10,
    background: "#EFEFEF",
    paddingRight: 11,
    paddingLeft: 11,
  }}
>
  {meta.columns.map((column) => (
    <span
      key={column}
      className="truncate text-center"
      style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 400,
        fontSize: 12,
        lineHeight: "normal",
        letterSpacing: 0,
        color: "#000000",
      }}
    >
      {column}
    </span>
  ))}
</div>

        {/* list — exact spec: 964x255, radius10, bg #B8B8B8, padding 20/0 */}
        <div
          className="absolute flex flex-col overflow-y-auto"
          style={{
            top: CARD_TOP + 184,
            left: 30,
            width: 964,
            height: 255,
            justifyContent: "space-between",
            borderRadius: 10,
            background: "#B8B8B8",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {rows.length === 0 && (
            <p
              className="px-[16px]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                lineHeight: "100%",
                letterSpacing: 0,
                color: "#5D5D5D",
              }}
            >
              No data Data Available
            </p>
          )}

          {activeTab === "Category" &&
            filteredCategories.slice(0, pageSize).map((category, index) => (
              <div
                key={category.id}
                className={`grid border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${CATEGORY_GRID}`}
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
                className={`grid border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${MENU_TYPE_GRID}`}
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
                className={`grid items-center border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${FOOD_GRID}`}
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
                    <span className="block h-8 w-8 rounded-[6px] bg-black/10" />
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
                className={`grid items-center border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${COMBO_GRID}`}
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
                    <span className="block h-8 w-8 rounded-[6px] bg-black/10" />
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

        <div
          className="absolute"
          style={{ top: CARD_TOP + 184 + 255 + 14, left: 30, width: 964 }}
        >
          <Pagination
            currentPage={currentPage}
            totalItems={rows.length}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        </div>

        {/* footer copyright — sits BELOW the card, outside its background, not overlapping it */}
        <div
          className="absolute flex items-center justify-center"
          style={{ top: CARD_TOP + CARD_HEIGHT + 14, left: CARD_LEFT, width: CARD_WIDTH }}
        >
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: 12,
              lineHeight: "100%",
              letterSpacing: 0,
              color: "#939393",
            }}
          >
            © 2026 Techon Innovations. All rights reserved.
          </span>
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

