"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import userPlus from "../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";

import AddFoodModal, { NewFoodInput } from "@/src/components/menu/AddFoodModal";
import AddCategoryModal, {
  NewCategoryInput,
} from "@/src/components/menu/AddCategoryModal";
import AddMenuTypeModal, {
  NewMenuTypeInput,
} from "@/src/components/menu/AddMenuTypeModal";
import AddComboModal, {
  NewComboInput,
} from "@/src/components/menu/AddComboModal";
import { Button } from "@/src/components/ui/button";
import MenuItemCard from "@/src/components/menu/item";
import {
  CategoryRecord,
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/src/api/category";
import {
  MenuTypeRecord,
  createMenuType,
  deleteMenuType,
  listMenuTypes,
  updateMenuType,
} from "@/src/api/menu-type";
import { listKitchens } from "@/src/api/kitchen";
import { listCustomerTypes } from "@/src/api/customer-type";
import {
  createFood,
  deleteFood,
  updateFood,
  listFoods,
  type FoodPayload,
  type FoodRecord,
} from "@/src/api/food";

// ─── Media base URL ─────────────────────────────────────────────────────────
// The API returns relative paths for uploaded images, e.g.
// "/uploads/foods/1789119719841-222955978.png". These need the API's own
// origin prepended before they can be used in <img src>, since the frontend
// runs on a different origin/port than the API.
// Prefer an env var so this isn't hardcoded per-environment; falls back to
// localhost:3005 for local dev.
const API_MEDIA_BASE_URL ="http://127.0.0.1:3010";
  // process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ||

function getMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  // Already absolute (e.g. http://..., https://..., or a blob: preview URL) — leave as-is.
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  return `${API_MEDIA_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type Category = {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
};

type MenuType = {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
};

type Food = {
  id: string;
  image?: string;
  name: string;
  category: string;
  kitchen: string;
  foodType: "VEG" | "NON_VEG";
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

// "HOME_DELIVERY" -> "Home Delivery" — used as the card label in the
// dynamic Pricing section of AddFoodModal.
function formatCustomerTypeLabel(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatApiDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-GB");
}

function mapCategory(category: CategoryRecord): Category {
  return {
    id: category._id,
    name: category.name,
    createdBy: category?.createdBy?.username || "Admin",
    createdDate: formatApiDate(category.createdAt),
    updatedDate: formatApiDate(category.updatedAt),
  };
}

function mapMenuType(menuType: MenuTypeRecord): MenuType {
  return {
    id: menuType._id,
    name: menuType.name,
    createdBy: menuType.createdBy?.username || "Admin",
    createdDate: formatApiDate(menuType.createdAt),
    updatedDate: formatApiDate(menuType.updatedAt),
  };
}

function mapFood(food: FoodRecord): Food {
  return {
    id: food._id,
    image: getMediaUrl(food.foodImage), // relative path -> absolute API URL
    name: food.name,
    category: food.categoryId.name || "-",
    kitchen: food.kitchenId.name || "-",
    foodType: food.foodType,
    createdBy: food.createdBy?.username || "Admin",
    createdAt: formatApiDate(food.createdAt),
  };
}

// Converts a raw FoodRecord (from GET /foods/:id) back into the shape
// AddFoodModal's form expects, so the modal can be pre-filled when editing.
// Matches the actual getById response shape: menuTypeId/categoryId/kitchenId
// are populated objects, and customerTypes[].customerTypeId is itself a
// populated object carrying `type` (DINE_IN / TAKE_AWAY / ONLINE / HOME_DELIVERY).
function mapFoodToFormValues(food: FoodRecord): NewFoodInput {
  const record = food as any;

  const menuTypeId = record.menuTypeId?._id || "";

  // Keyed by the master customer-type id (customerTypeId._id), matching
  // the keys AddFoodModal's dynamic Pricing cards use.
  const customerPrices: Record<string, number> = {};
  (record.customerTypes || []).forEach((c: any) => {
    const id = c.customerTypeId?._id;
    if (id) customerPrices[id] = c.price ?? 0;
  });

  // API returns ISO datetimes ("2026-09-11T00:00:00.000Z") but the form's
  // <input type="date"> only accepts "YYYY-MM-DD" — without this it silently
  // fails to populate.
  const toDateInputValue = (value?: string) => {
    if (!value) return "";
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
  };

  return {
    foodName: record.name,
    // getMediaUrl here so AddFoodModal's imagePreview (seeded from
    // initialFood.foodImage) shows the real image instead of a broken
    // relative-path <img src> on edit.
    foodImage: getMediaUrl(record.foodImage),
    foodType: record.foodType === "VEG" ? "Veg" : "Non-Veg",
    menuTypes: menuTypeId ? [menuTypeId] : [],
    category: record.categoryId?._id || "",
    kitchen: record.kitchenId?._id || "",
    hasPortions: Boolean(record.isPortionEnabled),
    portions:
      record.portions?.map((p: any) => ({ name: p.name, price: p.basePrice })) ||
      [],
    basePrice: record.basePrice || 0,
    customerPrices,
    hasOffer: Boolean(record.isOfferEnabled),
    startDate: toDateInputValue(record.offer?.startDate),
    endDate: toDateInputValue(record.offer?.endDate),
    discountPercent: record.offer?.discount || 0,
    choices: record.choices || [],
    preparationTime: record.preparationTime || 0,
  };
}

const TAB_META: Record<
  MenuTab,
  { columns: readonly string[]; grid: string; addLabel: string }
> = {
  Category: {
    columns: CATEGORY_COLUMNS,
    grid: CATEGORY_GRID,
    addLabel: "Add Category",
  },
  "Menu Type": {
    columns: MENU_TYPE_COLUMNS,
    grid: MENU_TYPE_GRID,
    addLabel: "Add Menu Type",
  },
  Food: { columns: FOOD_COLUMNS, grid: FOOD_GRID, addLabel: "Add Food" },
  Combo: { columns: COMBO_COLUMNS, grid: COMBO_GRID, addLabel: "Add Combo" },
};

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<MenuTab>("Category");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] =
    useState<(typeof PAGE_SIZE_OPTIONS)[number]>(10);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isMenuTypeModalOpen, setIsMenuTypeModalOpen] = useState(false);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMenuType, setEditingMenuType] = useState<MenuType | null>(null);
  const [editingFood, setEditingFood] = useState<FoodRecord | null>(null);
  const queryClient = useQueryClient();

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
  });
  const menuTypesQuery = useQuery({
    queryKey: ["menu-types"],
    queryFn: listMenuTypes,
  });
  const kitchensQuery = useQuery({
    queryKey: ["kitchens"],
    queryFn: listKitchens,
  });
  const customerTypesQuery = useQuery({
    queryKey: ["customer-types"],
    queryFn: listCustomerTypes,
  });
  const foodsQuery = useQuery({
    queryKey: ["foods"],
    queryFn: listFoods,
  });

  const categoryRows =
    categoriesQuery.data?.data.map(mapCategory) || categories;
  const menuTypeRows = menuTypesQuery.data?.data.map(mapMenuType) || menuTypes;
  const foodRows = foodsQuery.data?.data.map(mapFood) || foods;

  const meta = TAB_META[activeTab];

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categoryRows;
    return categoryRows.filter((c) => c.name.toLowerCase().includes(query));
  }, [categoryRows, search]);

  const filteredMenuTypes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return menuTypeRows;
    return menuTypeRows.filter((m) => m.name.toLowerCase().includes(query));
  }, [menuTypeRows, search]);

  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return foodRows;
    return foodRows.filter((f) =>
      [f.name, f.category, f.kitchen].join(" ").toLowerCase().includes(query),
    );
  }, [foodRows, search]);

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

  const handleSaveCategory = async (data: NewCategoryInput) => {
    try {
      if (editingCategory) {
        const response = await updateCategory(
          editingCategory.id,
          data.categoryName,
        );
        setCategories((current) =>
          current.map((category) =>
            category.id === editingCategory.id
              ? mapCategory(response.data)
              : category,
          ),
        );
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Category updated successfully");
      } else {
        const response = await createCategory(data.categoryName);
        setCategories((current) => [mapCategory(response.data), ...current]);
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast.success("Category created successfully");
      }

      setEditingCategory(null);
      setIsCategoryModalOpen(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save category",
      );
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return;

    try {
      await deleteCategory(category.id);
      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(`${category.name} deleted successfully`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete category",
      );
    }
  };

  const handleSaveMenuType = async (data: NewMenuTypeInput) => {
    try {
      if (editingMenuType) {
        const response = await updateMenuType(
          editingMenuType.id,
          data.name,
        );
        setMenuTypes((current) =>
          current.map((menuType) =>
            menuType.id === editingMenuType.id
              ? mapMenuType(response.data)
              : menuType,
          ),
        );
        queryClient.invalidateQueries({ queryKey: ["menu-types"] });
        toast.success("Menu type updated successfully");
      } else {
        const response = await createMenuType(data.name);
        setMenuTypes((current) => [mapMenuType(response.data), ...current]);
        queryClient.invalidateQueries({ queryKey: ["menu-types"] });
        toast.success("Menu type created successfully");
      }

      setEditingMenuType(null);
      setIsMenuTypeModalOpen(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save menu type",
      );
    }
  };

  const handleDeleteMenuType = async (menuType: MenuType) => {
    if (!window.confirm(`Delete ${menuType.name}?`)) return;

    try {
      await deleteMenuType(menuType.id);
      setMenuTypes((current) =>
        current.filter((item) => item.id !== menuType.id),
      );
      queryClient.invalidateQueries({ queryKey: ["menu-types"] });
      toast.success(`${menuType.name} deleted successfully`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete menu type",
      );
    }
  };

  const handleSaveFood = async (data: NewFoodInput, imageFile?: File) => {
  const payload: FoodPayload = {
    name: data.foodName.trim(),
    foodType: data.foodType === "Veg" ? "VEG" : "NON_VEG",
    menuTypeId: data.menuTypes[0] || "",
    categoryId: data.category,
    kitchenId: data.kitchen,
    isPortionEnabled: data.hasPortions,
    portions: data.hasPortions
      ? data.portions.map((portion) => ({
          name: portion.name.trim(),
          basePrice: Number(portion.price) || 0,
        }))
      : [],
    basePrice: Number(data.basePrice) || 0,
    customerTypes: (customerTypesQuery.data?.data || [])
      .map((customerType) => ({
        customerTypeId: customerType._id,
        price: Number(data.customerPrices?.[customerType._id]) || 0,
      }))
      .filter((customerType) => customerType.price > 0),
    isOfferEnabled: data.hasOffer,
    offer: data.hasOffer
      ? {
          startDate: data.startDate || "",
          endDate: data.endDate || "",
          discount: Number(data.discountPercent) || 0,
        }
      : undefined,
    choices: Array.isArray(data.choices)
      ? data.choices.filter(Boolean)
      : String(data.choices || "")
          .split(",")
          .map((choice) => choice.trim())
          .filter(Boolean),
    preparationTime: Number(data.preparationTime) || 0,
  };

  try {
    if (editingFood) {
      const response = await updateFood(editingFood._id, payload, imageFile);
      setFoods((current) =>
        current.map((food) =>
          food.id === editingFood._id ? mapFood(response.data) : food,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast.success("Food updated successfully");
    } else {
      const response = await createFood(payload, imageFile);
      setFoods((current) => [mapFood(response.data), ...current]);
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast.success("Food created successfully");
    }

    setEditingFood(null);
    setIsFoodModalOpen(false);
  } catch (error: unknown) {
    toast.error(
      error instanceof Error ? error.message : "Unable to save food",
    );
  }
};

  const handleDeleteFood = async (food: Food) => {
    if (!window.confirm(`Delete ${food.name}?`)) return;

    try {
      await deleteFood(food.id);
      setFoods((current) => current.filter((item) => item.id !== food.id));
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      toast.success(`${food.name} deleted successfully`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete food",
      );
    }
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
  const CARD_HEIGHT = 661;

  return (
    <main className="flex h-full flex-col overflow-x-hidden overflow-y-auto bg-black text-black">
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
            right: CARD_LEFT,
            height: CARD_HEIGHT,
            borderRadius: 15,
            background: "#D2D2D2",
          }}
        />

        <div
          className="absolute flex items-center justify-between"
          style={{ top: CARD_TOP + 20, left: 30, right: 30 }}
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
                    border: selected
                      ? "1px solid transparent"
                      : "1px solid #9C9C9C",
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
          style={{ top: CARD_TOP + 88, left: 30, right: 30, display: "flex" }}
        >
          <SearchInput
            variant="panel"
            value={search}
            onChange={(value) => setSearch(value)}
            className="ml-auto"
          />
        </div>

        {/* header row — exact spec: 964x40, radius10, bg #EFEFEF */}
        <div
          className="absolute hidden items-center sm:flex"
          style={{
            top: CARD_TOP + 139,
            left: 30,
            right: 30,
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
          className="absolute flex flex-col overflow-x-hidden overflow-y-auto"
          style={{
            top: CARD_TOP + 184,
            left: 30,
            right: 30,
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
                <span className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="editicon"
                    size="icon"
                    aria-label={`Edit ${category.name}`}
                    onClick={() => {
                      setEditingCategory(category);
                      setIsCategoryModalOpen(true);
                    }}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    type="button"
                    variant="deleteicon"
                    size="icon"
                    aria-label={`Delete ${category.name}`}
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </span>
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
                <span className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="editicon"
                    size="icon"
                    aria-label={`Edit ${menuType.name}`}
                    onClick={() => {
                      setEditingMenuType(menuType);
                      setIsMenuTypeModalOpen(true);
                    }}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    type="button"
                    variant="deleteicon"
                    size="icon"
                    aria-label={`Delete ${menuType.name}`}
                    onClick={() => handleDeleteMenuType(menuType)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </span>
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
                <span className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="editicon"
                    size="icon"
                    aria-label={`Edit ${food.name}`}
                    onClick={() => {
                      const record = foodsQuery.data?.data.find(
                        (f) => f._id === food.id,
                      );
                      if (record) {
                        setEditingFood(record);
                        setIsFoodModalOpen(true);
                      }
                    }}
                  >
                    <Pencil size={15} />
                  </Button>
                  <Button
                    type="button"
                    variant="deleteicon"
                    size="icon"
                    aria-label={`Delete ${food.name}`}
                    onClick={() => handleDeleteFood(food)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </span>
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
          style={{ top: CARD_TOP + 184 + 255 + 14, left: 30, right: 30 }}
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
          style={{
            top: CARD_TOP + CARD_HEIGHT + 14,
            left: CARD_LEFT,
            right: CARD_LEFT,
          }}
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
            © 2026 FFERM Digital Labs. All rights reserved.
          </span>
        </div>
      </div>

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onAdd={handleSaveCategory}
        mode={editingCategory ? "edit" : "add"}
        initialCategory={
          editingCategory ? { categoryName: editingCategory.name } : null
        }
      />

      <AddMenuTypeModal
        isOpen={isMenuTypeModalOpen}
        onClose={() => {
          setIsMenuTypeModalOpen(false);
          setEditingMenuType(null);
        }}
        onAdd={handleSaveMenuType}
        mode={editingMenuType ? "edit" : "add"}
        initialMenuType={editingMenuType?.name ?? null}
      />

      <AddFoodModal
        isOpen={isFoodModalOpen}
        onClose={() => {
          setIsFoodModalOpen(false);
          setEditingFood(null);
        }}
        onAdd={handleSaveFood}
        mode={editingFood ? "edit" : "add"}
        initialFood={editingFood ? mapFoodToFormValues(editingFood) : null}
        categoryOptions={(categoriesQuery.data?.data || []).map((category) => ({
          label: category.name,
          value: category._id,
        }))}
        menuTypeOptions={(menuTypesQuery.data?.data || []).map((menuType) => ({
          label: menuType.name,
          value: menuType._id,
        }))}
        kitchenOptions={(kitchensQuery.data?.data || []).map((kitchen) => ({
          label: kitchen.name,
          value: kitchen._id,
        }))}
        customerTypeOptions={(customerTypesQuery.data?.data || []).map(
          (customerType) => ({
            id: customerType._id,
            label: formatCustomerTypeLabel(customerType.type),
          }),
        )}
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