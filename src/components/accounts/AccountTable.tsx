"use client";

import { useState } from "react";
import { Badge, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import { useDeleteAccount } from "@/src/api/account/hooks/delete.hook";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import AccountTableSkeleton from "./AccountTableSkeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Account } from "@/src/interfaces/accounts/ListAccountResponse";
import { AccountFormAction } from "./AddAccount";

const TABLE_COLUMNS = [
  "No.", "Account Name", "Account Type", "Opening Balance", "Show In POS",
  "Description", "Created Date", "Actions",
] as const;

const COLUMN_WIDTHS = [
  "60px", "200px", "160px", "130px", "100px",
  "220px", "130px", "90px",
];

function formatDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-GB");
}

function formatBalance(value: number) {
  return Number.isFinite(value) ? value.toLocaleString("en-IN") : "0";
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
type AccountTableProps = {
  data: Account[];
  isLoading?: boolean;
};

export function AccountTable({ data, isLoading }: AccountTableProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  const openDeleteDialog = (id: string, name: string) => {
    setAccountToDelete({ id, name });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!accountToDelete) return;

    deleteAccount(
      { id: accountToDelete.id, name: accountToDelete.name },
      {
        onSuccess: () => {
          setIsConfirmDialogOpen(false);
          setAccountToDelete(null);
        },
      },
    );
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setAccountToDelete(null);
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
                <AccountTableSkeleton />
              ) : data.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={TABLE_COLUMNS.length}
                    className="py-8 text-center text-sm text-[#5D5D5D]"
                  >
                    No accounts Data Available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((account, index) => (
                  <TableRow
                    key={account._id}
                    className="border-black/5 text-[11px] text-black hover:bg-black/5 sm:text-[12px]"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <TruncatedCell value={account.accountName} />
                    </TableCell>
                    <TableCell>
                      <TruncatedCell value={account.accountType} />
                    </TableCell>
                    <TableCell>{formatBalance(account.openingBalance)}</TableCell>
           <TableCell>
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      account.showInPos
        ? "bg-green-700 text-green-200"
        : "bg-red-700 text-red-200"
    }`}
  >
    {account.showInPos ? "Yes" : "No"}
  </span>
</TableCell>
                    <TableCell>
                      <TruncatedCell value={account.description} />
                    </TableCell>
                    <TableCell>{formatDate(account.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <AccountFormAction isEdit id={account._id} />

                        {!account.isSystemGenerated && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="deleteicon"
                                  size="icon"
                                  aria-label={`Delete ${account.accountName}`}
                                  onClick={() =>
                                    openDeleteDialog(account._id, account.accountName)
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
        message={`Are you sure you want to delete account "${accountToDelete?.name}?"`}
        isPending={isPending}
      />
    </div>
  );
}