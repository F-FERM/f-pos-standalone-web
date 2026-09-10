"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import userPlus from "../../../../../public/images/icons/usergroup.png";
import { Pagination } from "@/src/components/common/Pagination";
import { SearchInput } from "@/src/components/common/SearchInput";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { Button } from "@/src/components/ui/button";
import AddKitchenModal, {
  NewKitchenInput,
} from "@/src/components/settings/kitchen/AddKitchenModal";
import {
  createKitchen,
  deleteKitchen,
  listKitchens,
  updateKitchen,
  type KitchenRecord,
} from "@/src/api/kitchen";

const COLUMNS = [
  "No.",
  "Kitchen Name",
  "Created By",
  "Created Date",
  "Updated Date",
  "Actions",
] as const;

type Kitchen = {
  id: string;
  name: string;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
};

const GRID = "grid-cols-[48px_1.4fr_1fr_1fr_1fr_80px]";

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB");
}

function mapKitchen(kitchen: KitchenRecord): Kitchen {
  return {
    id: kitchen._id,
    name: kitchen.name,
    createdBy: kitchen.createdBy || "Admin",
    createdDate: formatDate(kitchen.createdAt),
    updatedDate: formatDate(kitchen.updatedAt),
  };
}

export default function KitchenPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [kitchens, setKitchens] = useState<Kitchen[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKitchen, setEditingKitchen] = useState<Kitchen | null>(null);
  const pageSize = 10;

  useEffect(() => {
    listKitchens()
      .then((response) => setKitchens((response.data || []).map(mapKitchen)))
      .catch((error: unknown) => {
        toast.error(
          error instanceof Error ? error.message : "Unable to load kitchens",
        );
      });
  }, []);

  const filteredKitchens = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query
      ? kitchens.filter((kitchen) => kitchen.name.toLowerCase().includes(query))
      : kitchens;
  }, [kitchens, search]);

  const handleSave = async (data: NewKitchenInput) => {
    try {
      if (editingKitchen) {
        const response = await updateKitchen(editingKitchen.id, data.name);
        setKitchens((current) =>
          current.map((kitchen) =>
            kitchen.id === editingKitchen.id
              ? mapKitchen(response.data)
              : kitchen,
          ),
        );
        toast.success("Kitchen updated successfully");
      } else {
        const response = await createKitchen(data.name);
        setKitchens((current) => [mapKitchen(response.data), ...current]);
        toast.success("Kitchen created successfully");
      }
      setEditingKitchen(null);
      setIsModalOpen(false);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save kitchen",
      );
    }
  };

  const handleDelete = async (kitchen: Kitchen) => {
    if (!window.confirm(`Delete ${kitchen.name}?`)) return;
    try {
      await deleteKitchen(kitchen.id);
      setKitchens((current) =>
        current.filter((item) => item.id !== kitchen.id),
      );
      toast.success(`${kitchen.name} deleted successfully`);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete kitchen",
      );
    }
  };

  return (
    <main className="flex h-full flex-col overflow-x-hidden overflow-y-auto bg-black text-black">
      <POSHeader />
      <div className="relative flex-1 bg-[#EFEFEF] p-3 sm:p-5">
        <section className="min-h-[661px] w-full rounded-[15px] bg-[#D2D2D2] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-poppins text-[26px] font-semibold">Kitchen</h1>
            <Button
              variant="addcustomer"
              size="none"
              iconSrc={userPlus}
              iconAlt="Add kitchen"
              onClick={() => {
                setEditingKitchen(null);
                setIsModalOpen(true);
              }}
            >
              Add Kitchen
            </Button>
          </div>

          <div className="mt-8 flex justify-end">
            <SearchInput variant="panel" value={search} onChange={setSearch} />
          </div>

          <div
            className={`mt-5 hidden h-10 items-center rounded-[10px] bg-[#EFEFEF] px-3 py-2 font-poppins text-[12px] sm:grid ${GRID}`}
          >
            {COLUMNS.map((column) => (
              <span key={column} className="truncate text-center">
                {column}
              </span>
            ))}
          </div>

          <div
            className={`mt-1 flex min-h-[255px] flex-col overflow-x-hidden overflow-y-auto rounded-[10px] bg-[#B8B8B8] py-4`}
          >
            {filteredKitchens.length === 0 ? (
              <p className="px-4 font-poppins text-[14px] text-[#5D5D5D]">
                No data Data Available
              </p>
            ) : (
              filteredKitchens.slice(0, pageSize).map((kitchen, index) => (
                <div
                  key={kitchen.id}
                  className={`grid items-center gap-2 border-b border-black/5 px-4 py-2.5 font-poppins text-[12px] ${GRID}`}
                >
                  <span>{index + 1}</span>
                  <span className="truncate">{kitchen.name}</span>
                  <span className="truncate">{kitchen.createdBy}</span>
                  <span>{kitchen.createdDate}</span>
                  <span>{kitchen.updatedDate}</span>
                  <span className="flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="editicon"
                      size="icon"
                      aria-label={`Edit ${kitchen.name}`}
                      onClick={() => {
                        setEditingKitchen(kitchen);
                        setIsModalOpen(true);
                      }}
                    >
                      <Pencil size={15} />
                    </Button>
                    <Button
                      type="button"
                      variant="deleteicon"
                      size="icon"
                      aria-label={`Delete ${kitchen.name}`}
                      onClick={() => handleDelete(kitchen)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalItems={filteredKitchens.length}
              itemsPerPage={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
        <p className="mt-3 text-center font-poppins text-[12px] font-medium text-[#939393]">
          © 2026 Techon Innovations. All rights reserved.
        </p>
      </div>
      <AddKitchenModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingKitchen(null);
        }}
        onAdd={handleSave}
        mode={editingKitchen ? "edit" : "add"}
        initialName={editingKitchen?.name ?? null}
      />
    </main>
  );
}
