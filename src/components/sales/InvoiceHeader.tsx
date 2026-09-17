"use client";

import { ListInvoiceApi } from "@/src/api/invoice/api/GetAll";
import { useQuery } from "@tanstack/react-query";

type InvoiceHeaderProps = {
  total?: number;
};

export function InvoiceHeader({
  total = 2000,
}: InvoiceHeaderProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["getNextInvoice"],
    queryFn: () => ListInvoiceApi({}),
  });

  const invoiceNumber = data?.nextNumber;

  return (
    <div className="flex h-full w-full items-center justify-between">
      <span className="text-sm font-semibold leading-none text-black">
        {isLoading ? "Loading..." : invoiceNumber}
      </span>
      <span className="text-base font-medium leading-none text-black">
        ₹{total}
      </span>
    </div>
  );
}