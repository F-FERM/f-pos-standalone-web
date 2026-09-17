"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmationDialog } from "../../common/ConfirmationDialogue";
import { ColGroup, TruncatedCell, formatDisplayDate } from "./TableHelpers";
import { useDeleteFloor } from "@/src/api/floor/hooks/delete.hook";
import { Floor } from "@/src/interfaces/floor/ListFloorResponse";
import { FloorFormAction } from "./AddFloor";


const COLUMNS = ["No.", "Floor Name", "Number Of Tables", "Created By", "Created Date", "Updated Date", "Actions"] as const;
const WIDTHS = ["48px", "160px", "140px", "120px", "150px", "150px", "110px"];

type FloorTableProps = { data: Floor[]; isLoading?: boolean };

export function FloorTable({ data, isLoading }: FloorTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const { mutate: deleteFloor, isPending } = useDeleteFloor();

  const openDelete = (id: string, name: string) => {
    setToDelete({ id, name });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteFloor(toDelete, {
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
          <Table className="w-full min-w-[780px] table-fixed">
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
          <Table className="w-full min-w-[780px] table-fixed">
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
                data.map((floor, index) => (
                  <TableRow key={floor._id} className="border-black/5 text-[11px] text-black hover:bg-black/5 sm:text-[12px]">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell><TruncatedCell value={floor.name} /></TableCell>
                    <TableCell>0</TableCell>
                    <TableCell><TruncatedCell value={floor.createdBy || "Admin"} /></TableCell>
                    <TableCell>{formatDisplayDate(floor.createdAt)}</TableCell>
                    <TableCell>{formatDisplayDate(floor.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <FloorFormAction isEdit id={floor._id} currentName={floor.name} />
                        <Button
                          type="button"
                          variant="deleteicon"
                          size="icon"
                          aria-label={`Delete ${floor.name}`}
                          onClick={() => openDelete(floor._id, floor.name)}
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
        message={`Are you sure you want to delete floor "${toDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}