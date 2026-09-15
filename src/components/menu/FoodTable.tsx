"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmationDialog } from "../common/ConfirmationDialogue";
import { FoodFormAction } from "./AddFood";
import { useDeleteFood } from "@/src/api/food/hooks/delete.hook";
import { ColGroup, TruncatedCell } from "../settings/restaurant/TableHelpers";
import { Food } from "@/src/interfaces/food/ListFoodResponse";

const API_MEDIA_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3005";

function getMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:|blob:|data:)/i.test(path)) return path;
  return `${API_MEDIA_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatApiDate(date: string) {
  const parsedDate = new Date(date);
  return Number.isNaN(parsedDate.getTime()) ? date : parsedDate.toLocaleDateString("en-GB");
}

export type FoodListItem = {
  _id: string;
  name: string;
  foodImage?: string | null;
  foodType: "VEG" | "NON_VEG";
  categoryId?: { name?: string };
  kitchenId?: { name?: string };
  createdBy?: { username?: string };
  createdAt: string;
};

const COLUMNS = ["No.", "Image", "Food Name", "Category", "Kitchen", "Food Type", "Created By", "Created At", "Actions"] as const;
const WIDTHS = ["48px", "70px", "180px", "140px", "140px", "100px", "120px", "130px", "100px"];

type FoodTableProps = { data: Food[]; isLoading?: boolean };

export function FoodTable({ data, isLoading }: FoodTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const { mutate: deleteFood, isPending } = useDeleteFood();

  const openDelete = (id: string, name: string) => {
    setToDelete({ id, name });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    deleteFood(toDelete, {
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
          <Table className="w-full min-w-[980px] table-fixed">
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
          <Table className="w-full min-w-[980px] table-fixed">
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
                data.map((food, index) => (
                  <TableRow key={food._id} className="border-black/5 text-[11px] text-black hover:bg-black/5 sm:text-[12px]">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {getMediaUrl(food.foodImage) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getMediaUrl(food.foodImage)}
                          alt={food.name}
                          className="h-8 w-8 rounded-[6px] object-cover"
                        />
                      ) : (
                        <span className="block h-8 w-8 rounded-[6px] bg-black/10" />
                      )}
                    </TableCell>
                    <TableCell><TruncatedCell value={food.name} /></TableCell>
                    <TableCell><TruncatedCell value={food.categoryId?.name || "-"} /></TableCell>
                    <TableCell><TruncatedCell value={food.kitchenId?.name || "-"} /></TableCell>
                    <TableCell>{food.foodType}</TableCell>
                    <TableCell><TruncatedCell value={food.createdBy?.username || "Admin"} /></TableCell>
                    <TableCell>{formatApiDate(food.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <FoodFormAction isEdit id={food._id} />
                        <Button
                          type="button"
                          variant="deleteicon"
                          size="icon"
                          aria-label={`Delete ${food.name}`}
                          onClick={() => openDelete(food._id, food.name)}
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
        message={`Are you sure you want to delete food "${toDelete?.name}"?`}
        isPending={isPending}
      />
    </div>
  );
}