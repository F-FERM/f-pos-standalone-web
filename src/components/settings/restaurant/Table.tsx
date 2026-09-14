"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmationDialog } from "../../common/ConfirmationDialogue";
import { ColGroup, TruncatedCell, formatDisplayDate } from "./TableHelpers";
import { useDeleteTable } from "@/src/api/table/hooks/delete.hook";
import {  TableData } from "@/src/interfaces/table/ListTableResponse";
import { TableFormAction } from "./AddTable";


const COLUMNS = ["No.", "Floor Name", "Table Name", "Seats", "Created Date", "Updated Date", "Actions"] as const;
const WIDTHS = ["48px", "160px", "160px", "90px", "150px", "150px", "110px"];

type RestaurantTableListProps = { data: TableData[]; isLoading?: boolean };

export function RestaurantTableList({ data, isLoading }: RestaurantTableListProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const { mutate: deleteTable, isPending } = useDeleteTable();

  const openDelete = (id: string, name: string) => {
    setToDelete({ id, name });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteTable(toDelete, {
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
          <Table className="w-full min-w-[820px] table-fixed">
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
          <Table className="w-full min-w-[820px] table-fixed">
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
                data.map((table, index) => (
                  <TableRow key={table._id} className="border-black/5 text-[11px] text-black hover:bg-black/5 sm:text-[12px]">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell><TruncatedCell value={table.floorId?.name ?? ""} /></TableCell>
                    <TableCell><TruncatedCell value={table.name} /></TableCell>
                    <TableCell>{table.capacity}</TableCell>
                    <TableCell>{formatDisplayDate(table.createdAt)}</TableCell>
                    <TableCell>{formatDisplayDate(table.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <TableFormAction
                          isEdit
                          id={table._id}
                          currentTable={{
                            floor: table.floorId?._id ?? "",
                            tableName: table.name,
                            capacity: table.capacity,
                          }}
                        />
                        <Button
                          type="button"
                          variant="deleteicon"
                          size="icon"
                          aria-label={`Delete ${table.name}`}
                          onClick={() => openDelete(table._id, table.name)}
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
        message={`Are you sure you want to delete table "${toDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}