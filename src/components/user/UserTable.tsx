"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";

import { useDeleteUser } from "@/src/api/user/hooks/delete.hook";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { UserFormAction } from "./AddUser";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { User } from "@/src/interfaces/user/ListUserResponse";
import UserTableSkeleton from "./UserTableSkeleton";

const TABLE_COLUMNS = [
  "No.", "User Name", "Email", "Phone", "Role", "Created Date", "Actions",
] as const;

const COLUMN_WIDTHS = [
  "60px", "180px", "220px", "140px", "120px", "130px", "90px",
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

type UserTableProps = {
  data: User[];
  isLoading?: boolean;
};

export function UserTable({ data, isLoading }: UserTableProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { mutate: deleteUser, isPending } = useDeleteUser();

  const openDeleteDialog = (id: string, name: string) => {
    setUserToDelete({ id, name });
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    deleteUser(
      { id: userToDelete.id, name: userToDelete.name },
      {
        onSuccess: () => {
          setIsConfirmDialogOpen(false);
          setUserToDelete(null);
        },
      },
    );
  };

  const handleConfirmDialogClose = () => {
    setIsConfirmDialogOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="mt-[5px] flex flex-col gap-[10px]">
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

      <div className="overflow-hidden rounded-[10px] bg-[#B8B8B8]">
        <div className="overflow-x-auto">
          <Table className="w-full min-w-[700px] table-fixed sm:min-w-[820px]">
            <ColGroup />
            <TableBody>
              {isLoading ? (
                <UserTableSkeleton />
              ) : data.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={TABLE_COLUMNS.length}
                    className="py-8 text-center text-sm text-[#5D5D5D]"
                  >
                    No users Data Available
                  </TableCell>
                </TableRow>
              ) : (
                data.map((user, index) => (
                  <TableRow
                    key={user._id}
                    className="border-black/5 text-[11px] text-black hover:bg-black/5 sm:text-[12px]"
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <TruncatedCell value={`${user.username}`} />
                    </TableCell>
                    <TableCell>
                      <TruncatedCell value={user.email} />
                    </TableCell>
                    <TableCell>
                      <TruncatedCell value={user.phone} />
                    </TableCell>
                    <TableCell>
                      <TruncatedCell value={user.role} />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <UserFormAction isEdit id={user._id} />

                        {user.role?.toLowerCase() !== "admin" && (
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  type="button"
                                  variant="deleteicon"
                                  size="icon"
                                  aria-label={`Delete ${user.username}`}
                                  onClick={() => openDeleteDialog(user._id, `${user.username}`)}
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
        message={`Are you sure you want to delete user "${userToDelete?.name}?"`}
        isPending={isPending}
      />
    </div>
  );
}