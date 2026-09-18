"use client";

import { SearchInput } from "@/src/components/common/SearchInput";
import { AccountFormAction } from "./AddAccount";

type AccountHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export function AccountHeader({ search, onSearchChange }: AccountHeaderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <span className="text-xl font-semibold text-black sm:text-2xl lg:text-[26px]">
          Account
        </span>
        <AccountFormAction isEdit={false} />
      </div>

      <div className="mb-2 mt-5 flex sm:mt-[28px] sm:justify-end">
        <SearchInput
          variant="panel"
          value={search}
          onChange={onSearchChange}
          className="w-full sm:ml-auto sm:w-auto"
        />
      </div>
    </div>
  );
}