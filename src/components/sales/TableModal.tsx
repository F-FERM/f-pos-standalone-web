"use client";

import { X, Users } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ListTableApi } from "@/src/api/table/api/GetAll";
import changeTable from "../../../public/images/icons/changetable.png";
import noTable from "../../../public/images/icons/notable.png";
import { IconArmchair } from '@tabler/icons-react';
type TableModalProps = {
  open: boolean;
  onClose: () => void;
};

const legend = [
  { color: "#9F9F9F", label: "Available Table" },
  { color: "#FF7676", label: "Running Table" },
  { color: "#80C1FF", label: "Vacating Soon" },
  { color: "#FFD166", label: "Running KOT" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Available":
      return "#E5E5E5"; 
    case "Running":
      return "#FF7676";
    case "VacatingSoon":
      return "#80C1FF";
    case "RunningKOT":
      return "#FFD166";
    default:
      return "#E5E5E5";
  }
};


export function TableModal({ open, onClose }: TableModalProps) {
  const { data: tableData, isLoading } = useQuery({
    queryKey: ["getAllTables"],
    queryFn: () => ListTableApi({ page: 1, limit: 100 }),
    enabled: open,
  });

  const tables = tableData?.data || [];

  const floors = tables.reduce((acc, table) => {
    const floorName = table.floorId?.name || "Other";
    if (!acc[floorName]) {
      acc[floorName] = [];
    }
    acc[floorName].push(table);
    return acc;
  }, {} as Record<string, typeof tables>);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-[2px]">
      <div className="relative flex w-full max-w-[812px] flex-col gap-4 rounded-[20px] border border-[#E0E0E0] bg-[#EFEFEF] p-5 sm:px-[34px] sm:py-[26px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full border border-[#A6A6A6] bg-[#E9E9E9] text-[#FF3B3B] shadow-[0_2px_8px_rgba(0,0,0,0.15)] z-10"
          aria-label="Close table modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <h3 className=" text-lg font-semibold leading-none text-black sm:text-[22px]">
          Change Table
        </h3>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="flex shrink-0 items-center justify-center gap-[9px] whitespace-nowrap rounded-[7px] border border-[#9C9C9C] bg-[#EFEFEF] px-[10px] py-[6px]  text-sm font-semibold text-black sm:text-base hover:bg-[#E0E0E0] transition-colors"
            >
              <Image src={changeTable} alt="" width={15} height={15} />
              Change Table
            </button>

            <button
              type="button"
              className="flex shrink-0 items-center justify-center gap-[9px] whitespace-nowrap rounded-[7px] border border-[#9C9C9C] bg-[#EFEFEF] px-[10px] py-[6px]  text-sm font-semibold text-black sm:text-base hover:bg-[#E0E0E0] transition-colors"
            >
              <Image src={noTable} alt="" width={15} height={15} />
              No Table
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {legend.map((item) => (
              <span key={item.label} className="flex shrink-0 items-center gap-1">
                <span
                  className="inline-block h-3.5 w-3.5 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="whitespace-nowrap  text-sm font-medium leading-none text-black">
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 flex max-h-[60vh] w-full flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-[#5D5D5D]">
              Loading tables...
            </div>
          ) : Object.keys(floors).length === 0 ? (
            <div className="flex h-32 items-center justify-center text-[#5D5D5D]">
              No tables found.
            </div>
          ) : (
            Object.entries(floors).map(([floorName, floorTables]) => (
              <div key={floorName} className="flex flex-col gap-3">
                <h4 className=" text-[18px] font-semibold capitalize text-black">
                  {floorName}
                </h4>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-4">
                  {floorTables.map((table) => (
                    <button
                      type="button"
                      key={table._id}
                      className="group relative flex h-[130px] w-full flex-col items-center justify-center rounded-[12px] p-2 transition-transform hover:scale-105 active:scale-95 shadow-sm"
                      style={{ backgroundColor: getStatusColor(table.currentStatus || 'Available') }}
                    >
                      <div className="absolute right-2 top-2 flex items-center gap-1 text-xs font-semibold text-black">
                        {table.capacity}
                        <IconArmchair size={14} strokeWidth={2.5} />
                      </div>
                      <span className=" text-[22px] font-bold text-black px-2 text-center leading-tight [word-break:break-word]">
                        {table.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}