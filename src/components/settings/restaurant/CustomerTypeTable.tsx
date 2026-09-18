"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmationDialog } from "../../common/ConfirmationDialogue";


import { useDeleteCustomerType } from "@/src/api/customer-type/hooks/delete.hook";
import { CustomerType } from "@/src/interfaces/customer-type/ListCustomerTypeResponse";
import { CustomerTypeFormAction } from "./AddCustomerType";
import { ColGroup } from "./TableHelpers";

const COLUMNS = ["Type", "Actions"] as const;
const WIDTHS = ["1fr", "120px"];

type CustomerTypeTableProps = {
  data: CustomerType[];
  isLoading?: boolean;
};

export function CustomerTypeTable({ data, isLoading }: CustomerTypeTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<{ id: string; type: string } | null>(null);

  const { mutate: deleteCustomerType, isPending } = useDeleteCustomerType();

  const openDelete = (id: string, type: string) => {
    setToDelete({ id, type });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
   

    deleteCustomerType(
      { id: toDelete.id, name: toDelete.type },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          setToDelete(null);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="overflow-hidden rounded-[10px] bg-[#EFEFEF]">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[360px] table-fixed">
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
          <Table className="w-full min-w-[360px] table-fixed">
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
                data.map((item) => (
                  <TableRow key={item._id} className="border-black/5 text-[11px] text-black hover:bg-black/5 sm:text-[12px]">
                    <TableCell className="align-top py-4">
                      <div className="font-medium text-[13px]">{item.type}</div>
                      {item.onlinePlatforms && item.onlinePlatforms.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {item.onlinePlatforms.map((platform) => (
                            <span
                              key={platform}
                              className="rounded-full bg-secondary px-3 py-1.5 text-[11px] text-white"
                            >
                              {platform}
                            </span>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <CustomerTypeFormAction isEdit id={item._id} currentType={item.type} />
                        <Button
                          type="button"
                          variant="deleteicon"
                          size="icon"
                          aria-label={`Delete ${item.type}`}
                          onClick={() => openDelete(item._id, item.type)}
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
        message={`Are you sure you want to delete customer type "${toDelete?.type}"?`}
        isPending={isPending}
      />
    </div>
  );
}