"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import type { Customer } from "@/src/interfaces/customer/ListCustomerResponse";
import { useDeleteCustomer } from "@/src/api/customer/hooks/delete.hook";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { CustomerFormAction } from "./AddCustomer";
import CustomerTableSkeleton from "./CustomerTableSkeleton";
import { CustomerDetailModal } from "./CustomerDetailModal";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const TABLE_COLUMNS = [
  "No.", "Customer Name", "Credit", "Phone", "Address",
  "Total Orders", "Total Spend", "Created Date", "Actions",
] as const;

const COLUMN_WIDTHS = [
  "60px", "200px", "100px", "140px", "220px",
  "120px", "120px", "130px", "90px",
];

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

// TruncatedCell
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

type CustomerTableProps = {
  data: Customer[];
  isLoading?: boolean;
};

export function CustomerTable({ data, isLoading }: CustomerTableProps) {
  // delete dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // detail modal state (row click)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const { mutate: deleteCustomer, isPending } = useDeleteCustomer();

  const openDeleteDialog = (id: string, name: string) => {
    setCustomerToDelete({ id, name });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!customerToDelete) return;

    deleteCustomer(
      { id: customerToDelete.id, name: customerToDelete.name },
      {
        onSuccess: () => {
          setIsConfirmDialogOpen(false);
          setCustomerToDelete(null);
        },
      },
    );
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setCustomerToDelete(null);
  };

  return (
    <div className="mt-[5px] flex flex-col gap-[10px]">
      {/* header — own rounded block, radius10, bg #EFEFEF */}
      <div className="overflow-hidden rounded-[10px] bg-[#EFEFEF]">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[700px] table-fixed sm:min-w-[820px]">
            <ColGroup />
            <TableHeader>
              <TableRow className="border-b-0 hover:bg-transparent">
                {TABLE_COLUMNS.map((column) => (
                  <TableHead
                    key={column}
                    className={` text-[11px] font-normal text-black sm:text-[12px] ${
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

      {/* list — own rounded block, radius10, bg #B8B8B8 */}
      <div className="overflow-hidden rounded-[10px] bg-[#B8B8B8]">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[700px] table-fixed sm:min-w-[820px]">
            <ColGroup />
            <TableBody>
              {isLoading ? (
                <CustomerTableSkeleton />
              ) : data.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={TABLE_COLUMNS.length}
                    className="py-8 text-center text-sm text-[#5D5D5D]"
                  >
                    No customers Data Available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((customer, index) => (
                  <TableRow
                    key={customer._id}
                    tabIndex={0}
                    onClick={() => setSelectedCustomerId(customer._id)}
                    onKeyDown={(e) => {
                      // ignore keys pressed on inner buttons (edit/delete)
                      if (e.target !== e.currentTarget) return;
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedCustomerId(customer._id);
                      }
                    }}
                    className="cursor-pointer border-black/5 text-[11px] text-black hover:bg-black/5 sm:text-[12px]"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <TruncatedCell value={customer.name} />
                    </TableCell>
                    <TableCell>{customer.credit}</TableCell>
                    <TableCell>
                      <TruncatedCell value={customer.phone} />
                    </TableCell>
                    <TableCell>
                      <TruncatedCell value={customer.address} />
                    </TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>{formatDate(customer.createdAt)}</TableCell>

                    {/* Actions: stop propagation so edit/delete don't open the detail modal */}
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <CustomerFormAction isEdit id={customer._id} />

                        <Tooltip>
                          <TooltipTrigger
                            render={
                              <Button
                                type="button"
                                variant="deleteicon"
                                size="icon"
                                aria-label={`Delete ${customer.name}`}
                                onClick={() => openDeleteDialog(customer._id, customer.name)}
                              >
                                <Trash2 size={15} />
                              </Button>
                            }
                          />
                          <TooltipContent>
                            <p>Delete</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Customer detail modal (get by id) */}
      <CustomerDetailModal
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
      />

      {/* Delete confirmation */}
      <ConfirmationDialog
        open={isConfirmDialogOpen}
        onOpenChange={handleConfirmDialogClose}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete customer "${customerToDelete?.name}?"`}
        isPending={isPending}
      />
    </div>
  );
}