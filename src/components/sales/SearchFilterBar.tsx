"use client";

import { Search } from "lucide-react";
import { FILTER_TABS } from "./Types";

interface Props {
  activeTab: (typeof FILTER_TABS)[number];
  onTabChange: (tab: (typeof FILTER_TABS)[number]) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function SearchFilterBar({ activeTab, onTabChange, search, onSearchChange }: Props) {
  return (
    <div
      className="absolute top-[13px] left-[10px] w-[563px] h-[50px] rounded-xl bg-[#1C1220]
                 flex items-center gap-[10px] pt-[12px] pr-[17px] pb-[11px] pl-[18px]"
    >
      <span className="text-white font-semibold text-sm whitespace-nowrap">Categories</span>

      <div className="flex items-center gap-2 bg-[#2C192B] rounded-lg px-3 h-full flex-1 min-w-0">
        <Search className="w-4 h-4 text-white/40 shrink-0" />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search"
          className="bg-transparent outline-none text-sm text-white placeholder:text-white/40 w-full"
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? "text-[#E779C1]" : "text-white/60 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}