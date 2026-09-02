"use client";

import { useMemo, useState } from "react";
import userPlus  from "../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import AddPurchaseModal, { NewPurchaseInput } from "@/src/components/purchase/AddPurchaseModal";
import AddItemModal, { NewItemInput } from "@/src/components/purchase/AddItemModal";
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

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

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
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(
    10,
  );
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
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize) || 0);

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
    const total =
      data.vatMode === "VAT Inclusive" ? subTotal : subTotal + vat;

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

  return (
    <main className="flex h-full flex-col overflow-hidden bg-black text-white">
      <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col bg-[#2C192B] px-[29px] pb-[18px] pt-[22px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[26px] font-semibold">
            {isPurchase ? "Purchase" : "Item"}
          </h2>

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
                  h-[38px]
                  w-[166px]
                  items-center
                  justify-center
                  gap-[10px]
                  rounded-[12px]
                  border
                  pt-[15px]
                  pb-[14px]
                  pl-[39px]
                  pr-[39px]
                  text-[15px]
                  font-medium
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
            className={`hidden items-center justify-between gap-2 bg-black px-[18px] py-[12px] text-[13px] font-normal text-white sm:flex sm:text-[16px] ${gridClass}`}
          >
            {columns.map((column) => (
              <span key={column}>{column}</span>
            ))}
          </div>

          <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#82367F4D]">
            {rows.length === 0 ? (
              <p className="px-[16px] py-[18px] text-[14px] text-white/80">
                No Data Available
              </p>
            ) : isPurchase ? (
              filteredPurchases.slice(0, pageSize).map((purchase, index) => (
                <div
                  key={purchase.id}
                  className={`grid border-b border-white/5 px-[16px] py-[12px] text-[12px] text-white/90 ${PURCHASE_GRID}`}
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
                  className={`grid border-b border-white/5 px-[16px] py-[12px] text-[12px] text-white/90 ${ITEM_GRID}`}
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
              <div className="sticky bottom-[14px] ml-auto mr-[14px] mt-auto rounded-[10px] bg-[#6E6E6E] px-[16px] py-[10px] text-[13px] text-white">
                <p>Total VAT: AED {totals.vat.toFixed(2)}</p>
                <p className="mt-[2px]">
                  Grand Total: AED {totals.total.toFixed(2)}
                </p>
              </div>
            )}
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