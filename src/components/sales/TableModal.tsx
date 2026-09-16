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
  { color: "#9F9F9F", label: "Available" },
  { color: "#FF7676", label: "Running" },
  { color: "#80C1FF", label: "Vacating Soon" },
  { color: "#FFD166", label: "Running KOT" },
];

const STATUS_STYLES: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Available: { bg: "#F1F1F1", border: "#D8D8D8", text: "#4B4B4B" },
  Running: { bg: "#FFE3E3", border: "#FF7676", text: "#B22B2B" },
  VacatingSoon: { bg: "#E1F1FF", border: "#80C1FF", text: "#1E5A96" },
  RunningKOT: { bg: "#FFF3D6", border: "#FFD166", text: "#8A6400" },
};

const getStatusStyle = (status: string) =>
  STATUS_STYLES[status] || STATUS_STYLES.Available;

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-[3px] sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[860px] animate-[fadeIn_0.18s_ease-out] flex-col gap-4 rounded-2xl border border-[#E0E0E0] bg-[#EFEFEF] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:gap-5 sm:rounded-[20px] sm:p-6 sm:px-[30px]"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#A6A6A6] bg-white text-[#FF3B3B] shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-transform hover:scale-110 active:scale-95 sm:-right-3 sm:-top-3 sm:h-9 sm:w-9"
          aria-label="Close table modal"
        >
          <X size={18} strokeWidth={2.5} className="sm:hidden" />
          <X size={20} strokeWidth={2.5} className="hidden sm:block" />
        </button>

        {/* Title */}
        <h3 className="text-lg font-bold leading-none tracking-tight text-black sm:text-[22px]">
          Change Table
        </h3>

        {/* Controls + Legend row */}
        <div className="flex flex-col gap-3 border-b border-[#DADADA] pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#9C9C9C] bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-sm transition-colors hover:bg-[#F5F5F5] sm:text-[15px]"
            >
              <Image src={changeTable} alt="" width={14} height={14} />
              Change Table
            </button>

            <button
              type="button"
              className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#9C9C9C] bg-white px-3 py-1.5 text-xs font-semibold text-black shadow-sm transition-colors hover:bg-[#F5F5F5] sm:text-[15px]"
            >
              <Image src={noTable} alt="" width={14} height={14} />
              No Table
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legend.map((item) => (
              <span key={item.label} className="flex shrink-0 items-center gap-1.5">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white shadow-sm sm:h-3 sm:w-3"
                  style={{ background: item.color }}
                />
                <span className="whitespace-nowrap text-[11px] font-medium leading-none text-[#4B4B4B] sm:text-sm">
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Table grid */}
        <div className="flex max-h-[65vh] w-full flex-col gap-6 overflow-y-auto pr-1 custom-scrollbar sm:max-h-[60vh] sm:pr-2">
          {isLoading ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 text-[#5D5D5D]">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#B0B0B0] border-t-transparent" />
              <span className="text-sm">Loading tables...</span>
            </div>
          ) : Object.keys(floors).length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm text-[#5D5D5D]">
              No tables found.
            </div>
          ) : (
            Object.entries(floors).map(([floorName, floorTables]) => (
              <div key={floorName} className="flex flex-col gap-3">
                <h4 className="flex items-center gap-2 text-[15px] font-semibold capitalize text-black sm:text-[18px]">
                  {floorName}
                 
                </h4>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(105px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(130px,1fr))] sm:gap-4">
                  {floorTables.map((table) => {
                    const style = getStatusStyle(table.currentStatus || "Available");
                    return (
                      <button
                        type="button"
                        key={table._id}
                        className="group relative flex h-[105px] w-full flex-col items-center justify-center gap-1 rounded-[14px] border-2 p-2 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-95 sm:h-[130px] sm:rounded-[16px]"
                        style={{
                          backgroundColor: style.bg,
                          borderColor: style.border,
                        }}
                      >
                        <div
                          className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full bg-white/70 px-1.5 py-0.5 text-[12px] font-semibold sm:right-2 sm:top-2 sm:text-[12px]"
                          style={{ color: style.text }}
                        >
                          {table.capacity}
                          <IconArmchair size={12} strokeWidth={2.5} className="sm:hidden" />
                          <IconArmchair size={14} strokeWidth={2.5} className="hidden sm:block" />
                        </div>
                        <span
                          className="px-1 text-center text-[16px] font-bold leading-tight [word-break:break-word] sm:text-[18px]"
                          style={{ color: style.text }}
                        >
                          {table.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c4c4c4;
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}