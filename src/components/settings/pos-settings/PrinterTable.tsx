"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { selectType } from "@/src/components/form/FormCombobox";
import { PrinterFormAction } from "./AddPrinter";
import type { NewPrinterInput } from "./AddPrinterModal";
import { useDeletePrinter } from "@/src/api/printer/hooks/delete.hook";
import { ColGroup, TruncatedCell } from "../restaurant/TableHelpers";
import { ConfirmationDialog } from "../../common/ConfirmationDialogue";

export type PrinterRow = NewPrinterInput & {
  id: string;
  kitchenCustomerType: string;
};

const COLUMNS = ["No.", "Printer Name", "Print Type", "Kitchen/Customer Type", "Printer Ip", "Actions"] as const;
const WIDTHS = ["48px", "200px", "150px", "220px", "160px", "100px"];

type PrinterTableProps = {
  data: PrinterRow[];
  isLoading?: boolean;
  kitchenOptions: selectType[];
  customerTypeOptions: selectType[];
};

export function PrinterTable({ data, isLoading, kitchenOptions, customerTypeOptions }: PrinterTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const { mutate: deletePrinter, isPending } = useDeletePrinter();

  const openDelete = (id: string, name: string) => {
    setToDelete({ id, name });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deletePrinter(toDelete, {
      onSuccess: () => {
        setConfirmOpen(false);
        setToDelete(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="overflow-hidden rounded-[10px] bg-[#EFEFEF]">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[720px] table-fixed">
            <ColGroup widths={WIDTHS} />
            <TableHeader>
              <TableRow className="border-b-0 hover:bg-transparent">
                {COLUMNS.map((column) => (
                  <TableHead
                    key={column}
                    className={`text-[11px] font-normal text-black sm:text-[12px] ${
                      column === "Actions" ? "text-center" : "text-left"
                    }`}
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          </Table>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] bg-[#B8B8B8]">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[720px] table-fixed">
            <ColGroup widths={WIDTHS} />
            <TableBody>
              {isLoading ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={COLUMNS.length} className="py-8 text-center text-sm text-[#5D5D5D]">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={COLUMNS.length} className="py-8 text-center text-sm text-[#5D5D5D]">
                    No data Data Available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((printer, index) => (
                  <TableRow
                    key={printer.id}
                    className="border-black/5 text-[11px] text-black hover:bg-black/5 sm:text-[12px]"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <TruncatedCell value={printer.printerName} />
                    </TableCell>
                    <TableCell>
                      <TruncatedCell value={printer.printerType} />
                    </TableCell>
                    <TableCell>
                      <TruncatedCell value={printer.kitchenCustomerType} />
                    </TableCell>
                    <TableCell>
                      <TruncatedCell value={printer.printerIp} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <PrinterFormAction
                          isEdit
                          id={printer.id}
                          currentPrinter={printer}
                          kitchenOptions={kitchenOptions}
                          customerTypeOptions={customerTypeOptions}
                        />
                        <Button
                          type="button"
                          variant="deleteicon"
                          size="icon"
                          aria-label={`Delete ${printer.printerName}`}
                          onClick={() => openDelete(printer.id, printer.printerName)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmOpen}
        onOpenChange={() => {
          setConfirmOpen(false);
          setToDelete(null);
        }}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete printer "${toDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}