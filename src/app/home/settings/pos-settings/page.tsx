"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import userPlus from "../../../../../public/images/icons/usergroup.png";

import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import AddPrinterModal, { NewPrinterInput } from "@/src/components/settings/AddPrinterModal";
import { Button } from "@/src/components/ui/button";
import { SettingsToggleCard } from "@/src/components/settings/PosSettingsPanel";
import { listKitchens } from "@/src/api/kitchen";
import { listCustomerTypes } from "@/src/api/customer-type";
import { createPrinter, deletePrinter, listPrinters, PrinterPayload, PrinterRecord, updatePrinter } from "@/src/api/printer/printer";

type Printer = {
  id: string;
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

function formatApiDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-GB");
}

function mapPrinter(printer: PrinterRecord): Printer {
  const kitchenName =
    typeof printer.kitchenId === "object" ? printer.kitchenId?.name : "-";
  const customerType =
    typeof printer.customerTypeId === "object"
      ? printer.customerTypeId?.type
      : "-";

  return {
    id: printer._id,
    printerName: printer.printerName,
    printType: printer.printerType,
    kitchenCustomerType: [kitchenName, customerType].filter(Boolean).join(" / ") || "-",
    printerIp: printer.printerIp,
  };
}

// Converts a raw PrinterRecord (from GET /printers) back into the shape
// AddPrinterModal's form expects, for pre-filling on edit — same idea as
// mapFoodToFormValues in MenuPage.
function mapPrinterToFormValues(printer: PrinterRecord): NewPrinterInput {
  const kitchenId =
    typeof printer.kitchenId === "object" ? printer.kitchenId._id : printer.kitchenId;
  const customerTypeId =
    typeof printer.customerTypeId === "object"
      ? printer.customerTypeId._id
      : printer.customerTypeId;

  return {
    printerName: printer.printerName,
    printerType: printer.printerType,
    customerTypeId: customerTypeId || "",
    kitchenId: kitchenId || "",
    printerIp: printer.printerIp,
    isDefault: printer.isDefault,
    paperWidth: printer.paperWidth,
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("POS Settings");
  const [search, setSearch] = useState("");
  const [pageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPrinterModalOpen, setIsPrinterModalOpen] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState<PrinterRecord | null>(null);

  const [kotSettings, setKotSettings] = useState<KotSettings>({
    kotSettings: false,
    printAndSendKot: false,
  });
  const [billSettings, setBillSettings] = useState<BillSettings>({
    changePriceInBill: false,
    vatExcludedAddVat: false,
  });

  const queryClient = useQueryClient();
  const isPosSettings = activeTab === "POS Settings";

  const printersQuery = useQuery({
    queryKey: ["printers"],
    queryFn: listPrinters,
  });
  const kitchensQuery = useQuery({
    queryKey: ["kitchens"],
    queryFn: listKitchens,
  });
  const customerTypesQuery = useQuery({
    queryKey: ["customer-types"],
    queryFn: listCustomerTypes,
  });

  const printerRows = printersQuery.data?.data.map(mapPrinter) || [];

  const filteredPrinters = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return printerRows;
    return printerRows.filter((printer) =>
      [printer.printerName, printer.printType, printer.kitchenCustomerType, printer.printerIp]
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

  const handleSavePrinter = async (data: NewPrinterInput) => {
    const payload: PrinterPayload = {
      printerName: data.printerName,
      printerType: data.printerType,
      customerTypeId: data.customerTypeId,
      kitchenId: data.kitchenId,
      printerIp: data.printerIp,
      isDefault: data.isDefault,
      paperWidth: data.paperWidth,
    };

    try {
      if (editingPrinter) {
        await updatePrinter(editingPrinter._id, payload);
        toast.success("Printer updated successfully");
      } else {
        await createPrinter(payload);
        toast.success("Printer created successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["printers"] });
      setEditingPrinter(null);
      setIsPrinterModalOpen(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save printer",
      );
    }
  };

  const handleDeletePrinter = async (printer: Printer) => {
    if (!window.confirm(`Delete ${printer.printerName}?`)) return;

    try {
      await deletePrinter(printer.id);
      queryClient.invalidateQueries({ queryKey: ["printers"] });
      toast.success(`${printer.printerName} deleted successfully`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete printer",
      );
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <main className="flex h-full  flex-col bg-black text-black">
      <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#EFEFEF] px-5 py-5">
        <div className="flex w-full flex-col gap-4 rounded-[15px] bg-[#D2D2D2] p-4 sm:gap-5 sm:p-6 md:p-7 lg:h-[661px]">
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
                onClick={() => {
                  setEditingPrinter(null);
                  setIsPrinterModalOpen(true);
                }}
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
                  filteredPrinters.slice(0, pageSize).map((printer, index) => (
                    <div
                      key={printer.id}
                      className={`grid items-center gap-2 border-b border-black/5 px-4 py-2.5 font-poppins text-[12px] text-black ${PRINTER_GRID}`}
                    >
                      <span className="truncate">{index + 1}</span>
                      <span className="truncate">{printer.printerName}</span>
                      <span className="truncate">{printer.printType}</span>
                      <span className="truncate">{printer.kitchenCustomerType}</span>
                      <span className="truncate">{printer.printerIp}</span>
                      <span className="flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="editicon"
                          size="icon"
                          aria-label={`Edit ${printer.printerName}`}
                          onClick={() => {
                            const record = printersQuery.data?.data.find(
                              (p) => p._id === printer.id,
                            );
                            if (record) {
                              setEditingPrinter(record);
                              setIsPrinterModalOpen(true);
                            }
                          }}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          type="button"
                          variant="deleteicon"
                          size="icon"
                          aria-label={`Delete ${printer.printerName}`}
                          onClick={() => handleDeletePrinter(printer)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </span>
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

        <div className="mt-auto flex w-full justify-center pt-4">
          <span className="font-poppins text-[12px] font-medium text-[#939393]">
            © 2026 FFERM Digital Labs. All rights reserved.
          </span>
        </div>
      </div>

      <AddPrinterModal
        isOpen={isPrinterModalOpen}
        onClose={() => {
          setIsPrinterModalOpen(false);
          setEditingPrinter(null);
        }}
        onAdd={handleSavePrinter}
        mode={editingPrinter ? "edit" : "add"}
        initialPrinter={editingPrinter ? mapPrinterToFormValues(editingPrinter) : null}
        kitchenOptions={(kitchensQuery.data?.data || []).map((kitchen) => ({
          label: kitchen.name,
          value: kitchen._id,
        }))}
        customerTypeOptions={(customerTypesQuery.data?.data || []).map(
          (customerType) => ({
            label: customerType.type,
            value: customerType._id,
          }),
        )}
      />
    </main>
  );
}