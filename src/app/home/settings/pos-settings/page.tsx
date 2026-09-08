"use client";

import { useMemo, useState } from "react";
import userPlus from "../../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import AddPrinterModal, { NewPrinterInput } from "@/src/components/settings/AddPrinterModal";
import { Button } from "@/src/components/ui/button";
import { SettingsToggleCard } from "@/src/components/settings/PosSettingsPanel";

type Printer = {
  id: number;
  printerName: string;
  printType: string;
  kitchenCustomerType: string;
  printerIp: string;
};

const TABS = ["POS Settings", "Printer Settings"] as const;
type SettingsTab = (typeof TABS)[number];

const PRINTER_COLUMNS = [
  "No",
  "Printer Name",
  "Print Type",
  "Kitchen/Customer Type",
  "Printer Ip",
  "Actions",
] as const;

const PRINTER_GRID = "grid-cols-[48px_1.1fr_1fr_1.3fr_1fr_70px]";

type KotSettings = {
  kotSettings: boolean;
  printAndSendKot: boolean;
};

type BillSettings = {
  changePriceInBill: boolean;
  vatExcludedAddVat: boolean;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("POS Settings");
  const [search, setSearch] = useState("");
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false);

  const [printers, setPrinters] = useState<Printer[]>([]);

  const [kotSettings, setKotSettings] = useState<KotSettings>({
    kotSettings: false,
    printAndSendKot: false,
  });
  const [billSettings, setBillSettings] = useState<BillSettings>({
    changePriceInBill: false,
    vatExcludedAddVat: false,
  });

  const isPosSettings = activeTab === "POS Settings";

  const filteredPrinters = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return printers;
    return printers.filter((printer) =>
      [printer.printerName, printer.printType, printer.kitchenCustomerType, printer.printerIp]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [printers, search]);

  const toggleKot = (key: keyof KotSettings) => {
    setKotSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleBill = (key: keyof BillSettings) => {
    setBillSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleAddPrinter = (data: NewPrinterInput) => {
    setPrinters((current) => [
      ...current,
      {
        id: current.length + 1,
        printerName: data.printerName,
        printType: data.printerType,
        kitchenCustomerType: "-",
        printerIp: data.printerIp,
      },
    ]);
    setIsPrinterModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex h-full flex-col overflow-y-auto bg-black text-black">
      <POSHeader />

      <div className="flex flex-1 flex-col items-center gap-4 bg-[#EFEFEF] ">
        <div className="flex w-full max-w-[984px] flex-col gap-4 rounded-[15px] bg-[#D2D2D2] p-4 sm:gap-5 sm:p-6 md:p-7 lg:h-[661px]">
          {/* Tabs stay mounted and switchable regardless of active tab */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
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
                    className={`flex h-[38px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] border px-4 font-poppins text-[13px] font-semibold transition-colors sm:text-[14px] ${
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
              <Button
                variant="addcustomer"
                size="none"
                iconSrc={userPlus}
                iconAlt="Add printer"
                onClick={() => setIsPrinterModalOpen(true)}
              >
                Add Printer
              </Button>
            )}
          </div>

          {isPosSettings ? (
            <div className="flex flex-1 flex-col gap-4 lg:min-h-0">
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
            <div className="flex flex-1 flex-col gap-4 lg:min-h-0">
              <div className="flex justify-end">
                <SearchInput variant="panel" value={search} onChange={(value) => setSearch(value)} />
              </div>

              <div
                className={`hidden items-center justify-between gap-2 rounded-[10px] bg-[#EFEFEF] px-3 py-2 font-poppins text-[12px] font-normal text-black sm:grid ${PRINTER_GRID}`}
              >
                {PRINTER_COLUMNS.map((column) => (
                  <span key={column} className="truncate text-center">
                    {column}
                  </span>
                ))}
              </div>

              <div className="flex flex-1 min-h-[180px] flex-col overflow-y-auto rounded-[10px] bg-[#B8B8B8] py-4 lg:min-h-0">
                {filteredPrinters.length === 0 ? (
                  <p className="px-4 font-poppins text-[14px] font-normal text-[#5D5D5D]">
                    No data Data Available
                  </p>
                ) : (
                  filteredPrinters.slice(0, pageSize).map((printer) => (
                    <div
                      key={printer.id}
                      className={`grid gap-2 border-b border-black/5 px-4 py-2.5 font-poppins text-[12px] text-black ${PRINTER_GRID}`}
                    >
                      <span className="truncate">{printer.id}</span>
                      <span className="truncate">{printer.printerName}</span>
                      <span className="truncate">{printer.printType}</span>
                      <span className="truncate">{printer.kitchenCustomerType}</span>
                      <span className="truncate">{printer.printerIp}</span>
                      <span />
                    </div>
                  ))
                )}
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={filteredPrinters.length}
                itemsPerPage={pageSize}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>

        <span className="font-poppins text-[12px] font-medium text-[#939393]">
          © 2026 Techon Innovations. All rights reserved.
        </span>
      </div>

      <AddPrinterModal
        isOpen={isPrinterModalOpen}
        onClose={() => setIsPrinterModalOpen(false)}
        onAdd={handleAddPrinter}
      />
    </main>
  );
}