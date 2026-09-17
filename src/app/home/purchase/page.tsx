"use client";

import { useMemo, useState } from "react";
import userPlus from "../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import AddPurchaseModal, {
  NewPurchaseInput,
} from "@/src/components/purchase/AddPurchaseModal";
import AddItemModal, {
  NewItemInput,
} from "@/src/components/purchase/AddItemModal";
import { Button } from "@/src/components/ui/button";

type Purchase = {
  id: number;
  date: string;
  paymentType: string;
  supplier: string;
  invoiceNo: string;
  subTotal: number;
  vat: number;
  total: number;
};

type Item = {
  id: number;
  ingredientName: string;
  purchaseUnit: string;
  createdDate: string;
  updatedDate: string;
};

const TABS = ["Purchase", "Item"] as const;
type PurchaseTab = (typeof TABS)[number];

const PURCHASE_COLUMNS = [
  "No.",
  "Date",
  "Payment Mode",
  "Supplier",
  "Invoice",
  "Sub Total",
  "VAT",
  "Total",
  "Actions",
] as const;

const ITEM_COLUMNS = [
  "No.",
  "Ingredient Name",
  "Purchase Unit",
  "Created Date",
  "Updated Date",
  "Actions",
] as const;

const PURCHASE_GRID =
  "grid-cols-[48px_0.9fr_1.1fr_1fr_0.9fr_0.9fr_0.7fr_0.8fr_70px]";
const ITEM_GRID = "grid-cols-[48px_1.4fr_1fr_1fr_1fr_80px]";

const VAT_RATE = 0.05;

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function PurchasePage() {
  const [activeTab, setActiveTab] = useState<PurchaseTab>("Purchase");
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const isPurchase = activeTab === "Purchase";
  const columns = isPurchase ? PURCHASE_COLUMNS : ITEM_COLUMNS;
  const gridClass = isPurchase ? PURCHASE_GRID : ITEM_GRID;

  const filteredPurchases = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return purchases;
    return purchases.filter((purchase) =>
      [purchase.supplier, purchase.invoiceNo, purchase.paymentType]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [purchases, search]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      [item.ingredientName, item.purchaseUnit]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [items, search]);

  const rows = isPurchase ? filteredPurchases : filteredItems;

  const totals = useMemo(
    () =>
      filteredPurchases.reduce(
        (acc, purchase) => ({
          vat: acc.vat + purchase.vat,
          total: acc.total + purchase.total,
        }),
        { vat: 0, total: 0 },
      ),
    [filteredPurchases],
  );

  const openAddModal = () => {
    if (isPurchase) {
      setIsPurchaseModalOpen(true);
      return;
    }
    setIsItemModalOpen(true);
  };

  const handleAddPurchase = (data: NewPurchaseInput) => {
    const subTotal = data.lineItems.reduce(
      (sum, line) => sum + line.qty * line.price,
      0,
    );
    const vat =
      data.vatMode === "VAT Inclusive"
        ? subTotal - subTotal / (1 + VAT_RATE)
        : subTotal * VAT_RATE;
    const total = data.vatMode === "VAT Inclusive" ? subTotal : subTotal + vat;

    setPurchases((current) => [
      ...current,
      {
        id: current.length + 1,
        date: data.date,
        paymentType: data.paymentType,
        supplier: data.supplierName,
        invoiceNo: data.invoiceNo,
        subTotal,
        vat,
        total,
      },
    ]);
    setIsPurchaseModalOpen(false);
  };

  const handleAddItem = (data: NewItemInput) => {
    const today = formatDate(new Date());
    setItems((current) => [
      ...current,
      {
        id: current.length + 1,
        ingredientName: data.ingredientName,
        purchaseUnit: data.purchaseUnit,
        createdDate: today,
        updatedDate: today,
      },
    ]);
    setIsItemModalOpen(false);
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

      <div
        className="relative flex-1 bg-[#EFEFEF]"
        style={{ minHeight: CARD_TOP + CARD_HEIGHT + 40 }}
      >
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
          <span
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: 26,
              lineHeight: "100%",
              color: "#000000",
            }}
          >
            {isPurchase ? "Purchase" : "Item"}
          </span>

          <Button
            variant="addcustomer"
            size="none"
            iconSrc={userPlus}
            iconAlt={isPurchase ? "Add purchase" : "Add item"}
            onClick={openAddModal}
          >
            {isPurchase ? "Add Purchase" : "Add Item"}
          </Button>
        </div>

        <div
          className="absolute flex flex-wrap items-center gap-[12px]"
          style={{ top: CARD_TOP + 88, left: 30, right: 30 }}
        >
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
                  width: 166,
                  height: 50,
                  borderRadius: 12,
                  border: selected
                    ? "1px solid transparent"
                    : "1px solid #9C9C9C",
                  background: selected ? "#450042" : "#D2D2D2",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: 15,
                  lineHeight: "100%",
                  color: selected ? "#FFFFFF" : "#000000",
                }}
              >
                {tab}
              </button>
            );
          })}

          <SearchInput
            variant="panel"
            value={search}
            onChange={(value) => setSearch(value)}
            className="ml-auto"
          />
        </div>

        <div
          className="absolute hidden items-center sm:flex"
          style={{
            top: CARD_TOP + 152,
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
          {columns.map((column) => (
            <span
              key={column}
              className="truncate text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: "normal",
                color: "#000000",
              }}
            >
              {column}
            </span>
          ))}
        </div>

        <div
          className="absolute flex flex-col overflow-x-hidden overflow-y-auto"
          style={{
            top: CARD_TOP + 197,
            left: 30,
            right: 30,
            height: 242,
            borderRadius: 10,
            background: "#B8B8B8",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {rows.length === 0 ? (
            <p
              className="px-[16px]"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: 14,
                color: "#5D5D5D",
              }}
            >
              No Data Available
            </p>
          ) : isPurchase ? (
            filteredPurchases.slice(0, pageSize).map((purchase, index) => (
              <div
                key={purchase.id}
                className={`grid border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${PURCHASE_GRID}`}
              >
                <span>{index + 1}</span>
                <span className="truncate">{purchase.date}</span>
                <span className="truncate">{purchase.paymentType}</span>
                <span className="truncate">{purchase.supplier}</span>
                <span className="truncate">{purchase.invoiceNo}</span>
                <span>{purchase.subTotal.toFixed(2)}</span>
                <span>{purchase.vat.toFixed(2)}</span>
                <span>{purchase.total.toFixed(2)}</span>
                <span />
              </div>
            ))
          ) : (
            filteredItems.slice(0, pageSize).map((item, index) => (
              <div
                key={item.id}
                className={`grid border-b border-black/5 px-[16px] py-[10px] text-[12px] text-black ${ITEM_GRID}`}
              >
                <span>{index + 1}</span>
                <span className="truncate">{item.ingredientName}</span>
                <span className="truncate">{item.purchaseUnit}</span>
                <span>{item.createdDate}</span>
                <span>{item.updatedDate}</span>
                <span />
              </div>
            ))
          )}

          {isPurchase && (
            <div
              className="
    sticky bottom-0 ml-auto mr-3 mt-auto
    flex h-[76px] w-[208px]
    flex-col gap-[10px]
    rounded-[10px]
    bg-[#868686]
    px-[18px]
    pt-[9px]
    pb-[9px]
    pr-[17px]
    text-[16px]
    font-medium
    text-white
  "
            >
              <p>Total VAT: AED {totals.vat.toFixed(2)}</p>
              <p>Grand Total: AED {totals.total.toFixed(2)}</p>
            </div>
          )}
        </div>

        <div
          className="absolute"
          style={{ top: CARD_TOP + 197 + 242 + 14, left: 30, right: 30 }}
        >
          <Pagination
            currentPage={currentPage}
            totalItems={rows.length}
            itemsPerPage={pageSize}
            onPageChange={handlePageChange}
          />
        </div>

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
              color: "#939393",
            }}
          >
            © 2026 FFERM Digital Labs. All rights reserved.
          </span>
        </div>
      </div>

      <AddPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onAdd={handleAddPurchase}
      />

      <AddItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onAdd={handleAddItem}
      />
    </main>
  );
}

