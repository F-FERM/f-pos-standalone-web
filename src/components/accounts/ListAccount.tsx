"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/src/components/common/Pagination";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { ListAccountApi } from "@/src/api/account/api/GetAll";
import { AccountHeader } from "./AccountHeader";
import { AccountTable } from "./AccountTable";


const PAGE_SIZE = 10;

const ListAccount = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: accountListData, isLoading: isAccountListLoading } = useQuery({
    queryKey: ["getAllAccounts", search, currentPage],
    queryFn: () =>
      ListAccountApi({
        search,
        page: currentPage,
        limit: PAGE_SIZE,
      }),
  });

  const accounts = accountListData?.data ?? [];
  const totalItems = 10;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#EFEFEF]">
      <POSHeader />

      <div className="flex flex-1 flex-col">
        <div className="mx-3 flex flex-1 flex-col rounded-[15px] bg-[#D2D2D2] px-3 py-4 sm:mx-4 sm:px-5 sm:py-5 md:mx-5 md:px-6 lg:px-[30px] lg:pb-[20px] lg:pt-[20px]">
          <AccountHeader search={search} onSearchChange={handleSearchChange} />

          <AccountTable data={accounts} isLoading={isAccountListLoading} />

          <div className="mt-[14px]">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

        <div className="flex items-center justify-center px-3 py-[12px] text-center">
          <span className=" text-[11px] font-medium text-[#939393] sm:text-[12px]">
            © 2026 F-FERM Digital Labs. All rights reserved.
          </span>
        </div>
      </div>
    </main>
  );
};

export default ListAccount;