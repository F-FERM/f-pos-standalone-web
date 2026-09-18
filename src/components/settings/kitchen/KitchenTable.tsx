"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useDeleteKitchen } from "@/src/api/kitchen/hooks/delete.hook";

import { KitchenFormAction } from "./AddKitchen";
import KitchenTableSkeleton from "./KitchenTableSkeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { ConfirmationDialog } from "../../common/ConfirmationDialogue";

export type Kitchen = {
  _id: string;
  isDefault: boolean;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const TABLE_COLUMNS = ["No.", "Kitchen Name", "Created Date", "Updated Date", "Actions"] as const;
const COLUMN_WIDTHS = ["60px", "260px", "160px", "160px", "100px"];

function formatDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-GB");
}

function ColGroup() {
  return (
    <colgroup>
      {COLUMN_WIDTHS.map((width, i) => (
        <col key={i} style={{ width }} />
      ))}
    </colgroup>
  );
}

function TruncatedCell({ value }: { value: string }) {
  if (!value) return <div className="truncate">{value}</div>;

  return (
    <Tooltip>
      <TooltipTrigger render={<div className="truncate" title={value} />}>
        {value}
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-[260px] break-words">{value}</p>
      </TooltipContent>
    </Tooltip>
  );
}

type KitchenTableProps = {
  data: Kitchen[];
  isLoading?: boolean;
};

export function KitchenTable({ data, isLoading }: KitchenTableProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [kitchenToDelete, setKitchenToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { mutate: deleteKitchen, isPending } = useDeleteKitchen();

  const openDeleteDialog = (id: string, name: string) => {
    setKitchenToDelete({ id, name });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!kitchenToDelete) return;

    deleteKitchen(
      { id: kitchenToDelete.id, name: kitchenToDelete.name },
      {
        onSuccess: () => {
          setIsConfirmDialogOpen(false);
          setKitchenToDelete(null);
        },
      },
    );
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setKitchenToDelete(null);
  };

  return (
    <div className="mt-[5px] flex flex-col gap-[10px]">
      <div className="overflow-hidden rounded-[10px] bg-[#EFEFEF]">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[600px] table-fixed sm:min-w-[720px]">
            <ColGroup />
            <TableHeader>
              <TableRow className="border-b-0 hover:bg-transparent">
                {TABLE_COLUMNS.map((column) => (
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
          <Table className="w-full min-w-[600px] table-fixed sm:min-w-[720px]">
            <ColGroup />
            <TableBody>
              {isLoading ? (
                <KitchenTableSkeleton />
              ) : data.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={TABLE_COLUMNS.length}
                    className="py-8 text-center text-sm text-[#5D5D5D]"
                  >
                    No kitchens Data Available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((kitchen, index) => (
                  <TableRow
                    key={kitchen._id}
                    className="border-black/5 text-[11px] text-black hover:bg-black/5 sm:text-[12px]"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <TruncatedCell value={kitchen.name} />
                    </TableCell>
                    <TableCell>{formatDate(kitchen.createdAt)}</TableCell>
                    <TableCell>{formatDate(kitchen.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <KitchenFormAction isEdit id={kitchen._id} />

                          {!kitchen.isDefault && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="deleteicon"
                                  size="icon"
                                  aria-label={`Delete ${kitchen.name}`}
                                  onClick={() =>
                                    openDeleteDialog(
                                      kitchen._id,
                                      kitchen.name
                                    )
                                  }
                                >
                                  <Trash2 size={15} />
                                </Button>
                              }
                            />

                            <TooltipContent>
                              <p>Delete</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
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
        open={isConfirmDialogOpen}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete kitchen "${kitchenToDelete?.name}?"`}
        isPending={isPending}
      />
    </div>
  );
}