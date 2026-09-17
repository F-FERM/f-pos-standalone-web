"use client";

import { Suspense, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { SettingsToggleCard } from "@/src/components/settings/pos-settings/PosSettingsPanel";

import { ListPrinterApi } from "@/src/api/printer/api/GetAll";
import { ListKitchenApi } from "@/src/api/kitchen/api/GetAll";
import { ListCustomerTypeApi } from "@/src/api/customer-type/api/GetAll";
import { Printer } from "@/src/interfaces/printer/ListPrinterResponse";
import { PrinterFormAction } from "@/src/components/settings/pos-settings/AddPrinter";
import { PrinterTable } from "@/src/components/settings/pos-settings/PrinterTable";

const TABS = ["POS Settings", "Printer Settings"] as const;
type SettingsTab = (typeof TABS)[number];
const DEFAULT_TAB: SettingsTab = "POS Settings";

function isSettingsTab(value: string | null): value is SettingsTab {
  return (TABS as readonly string[]).includes(value ?? "");
}

type KotSettings = {
  kotSettings: boolean;
  printAndSendKot: boolean;
};

type BillSettings = {
  changePriceInBill: boolean;
  vatExcludedAddVat: boolean;
};

type PrinterRow = {
  id: string;
  printerName: string;
  printerType: string;
  kitchenCustomerType: string;
  kitchenId: string;
  customerTypeId: string;
  printerIp: string;
  paperWidth: string;
  isDefault: boolean;
};

function mapPrinter(printer: Printer): PrinterRow {
  const kitchenName = printer.kitchenId ? printer.kitchenId.name : "-";
  const customerType = printer.customerTypeId ? printer.customerTypeId.type : "-";
  const kitchenId = printer.kitchenId ? printer.kitchenId._id : "";
  const customerTypeId = printer.customerTypeId ? printer.customerTypeId._id : "";

  return {
    id: printer._id,
    printerName: printer.printerName,
    printerType: printer.printerType,
    kitchenCustomerType: [kitchenName, customerType].filter(Boolean).join(" / ") || "-",
    kitchenId,
    customerTypeId,
    printerIp: printer.printerIp,
    isDefault: printer.isDefault,
    paperWidth: printer.paperWidth,
  };
}

// Renamed: holds the useSearchParams() call and all the page logic
function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabFromUrl = searchParams.get("tab");
  const activeTab: SettingsTab = isSettingsTab(tabFromUrl) ? tabFromUrl : DEFAULT_TAB;

  const [search, setSearch] = useState("");
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [kotSettings, setKotSettings] = useState<KotSettings>({
    kotSettings: false,
    printAndSendKot: false,
  });
  const [billSettings, setBillSettings] = useState<BillSettings>({
    changePriceInBill: false,
    vatExcludedAddVat: false,
  });

  const isPosSettings = activeTab === "POS Settings";

  const handleTabChange = (tab: SettingsTab) => {
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

  const printersQuery = useQuery({
    queryKey: ["getAllPrinters"],
    queryFn: () => ListPrinterApi({ page: 1, limit: 100 }),
  });

  const kitchensQuery = useQuery({
    queryKey: ["getAllKitchens"],
    queryFn: () => ListKitchenApi({ page: 1, limit: 100 }),
  });

  const customerTypesQuery = useQuery({
    queryKey: ["getAllCustomerTypes"],
    queryFn: () => ListCustomerTypeApi({ page: 1, limit: 100 }),
  });

  const printerRows: PrinterRow[] = (printersQuery.data?.data ?? []).map(mapPrinter);

  const filteredPrinters = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return printerRows;
    return printerRows.filter((printer) =>
      [printer.printerName, printer.printerType, printer.kitchenCustomerType, printer.printerIp]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [printerRows, search]);

  const toggleKot = (key: keyof KotSettings) => {
    setKotSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleBill = (key: keyof BillSettings) => {
    setBillSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const kitchenOptions = (kitchensQuery.data?.data || []).map((kitchen) => ({
    label: kitchen.name,
    value: kitchen._id,
  }));
  const customerTypeOptions = (customerTypesQuery.data?.data || []).map((customerType) => ({
    label: customerType.type,
    value: customerType._id,
  }));

  return (
    <main className="flex h-screen flex-col overflow-x-hidden bg-black text-black">
      <POSHeader />

      <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto bg-[#EFEFEF] px-3 pb-4">
        <div className="flex w-full flex-1 flex-col gap-4 rounded-[15px] bg-[#D2D2D2] p-4 sm:gap-5 sm:p-6 md:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {TABS.map((tab) => {
                const selected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabChange(tab)}
                    className={`flex h-[38px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] border px-4  text-[13px] font-semibold transition-colors sm:text-[14px] ${
                      selected
                        ? "border-transparent bg-[#450042] text-white"
                        : "border-[#9C9C9C] bg-[#EFEFEF] text-black"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {!isPosSettings && (
              <PrinterFormAction
                isEdit={false}
                kitchenOptions={kitchenOptions}
                customerTypeOptions={customerTypeOptions}
              />
            )}
          </div>

          {isPosSettings ? (
            <div className="flex flex-1 flex-col gap-4">
              <SettingsToggleCard
                title="KOT Settings"
                description="Configure your KOT printing preferences"
                items={[
                  {
                    label: "KOT Settings",
                    description: "Configure your KOT printing preferences",
                    checked: kotSettings.kotSettings,
                    onChange: () => toggleKot("kotSettings"),
                  },
                  {
                    label: "Print and Send KOT",
                    description: "Automatically sends KOT when clicking Print",
                    checked: kotSettings.printAndSendKot,
                    onChange: () => toggleKot("printAndSendKot"),
                  },
                ]}
              />

              <SettingsToggleCard
                title="Bill Settings"
                description="Customize the appearance and behavior of the bill"
                items={[
                  {
                    label: "Change Price in Bill",
                    description: "Allow users to change the price of items in the bill",
                    checked: billSettings.changePriceInBill,
                    onChange: () => toggleBill("changePriceInBill"),
                  },
                  {
                    label: "VAT Excluded (Add VAT)",
                    description: "If enabled, VAT will be added on top of item prices",
                    checked: billSettings.vatExcludedAddVat,
                    onChange: () => toggleBill("vatExcludedAddVat"),
                  },
                ]}
              />
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4">
              <div className="flex justify-end">
                <SearchInput
                  variant="panel"
                  value={search}
                  onChange={(value) => setSearch(value)}
                  className="w-full sm:w-auto"
                />
              </div>

              <PrinterTable
                data={filteredPrinters.slice(0, pageSize)}
                isLoading={printersQuery.isLoading}
                kitchenOptions={kitchenOptions}
                customerTypeOptions={customerTypeOptions}
              />

              <Pagination
                currentPage={currentPage}
                totalItems={filteredPrinters.length}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        <span className=" text-[12px] font-medium text-[#939393]">
          © 2026 F-FERM Digital Labs. All rights reserved.
        </span>
      </div>
    </main>
  );
}

// Default export: wraps content in Suspense
export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageContent />
    </Suspense>
  );
}