"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pagination } from "@/src/components/common/Pagination";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { ListKitchenApi } from "@/src/api/kitchen/api/GetAll";
import { KitchenHeader } from "./KitchenHeader";
import { KitchenTable } from "./KitchenTable";

const PAGE_SIZE = 10;

const ListKitchen = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: kitchenListData, isLoading: isKitchenListLoading } = useQuery({
    queryKey: ["getAllKitchen", search, currentPage],
    queryFn: () =>
      ListKitchenApi({
        search,
        page: currentPage,
        limit: PAGE_SIZE,
      }),
  });

  const kitchens = kitchenListData?.data ?? [];
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
          <KitchenHeader search={search} onSearchChange={handleSearchChange} />

          <KitchenTable data={kitchens} isLoading={isKitchenListLoading} />

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
          <span className="text-[11px] font-medium text-[#939393] sm:text-[12px]">
            © 2026 F-FERM Digital Labs. All rights reserved.
          </span>
        </div>
      </div>
    </main>
  );
};

export default ListKitchen;