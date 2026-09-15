"use client";

type InvoiceHeaderProps = {
  invoiceNumber?: string;
  total?: number;
};

export function InvoiceHeader({
  invoiceNumber = "#INV0001",
  total = 200,
}: InvoiceHeaderProps) {
  return (
    <div className="flex h-full w-full items-center justify-between">
      <span className="text-sm font-semibold leading-none text-black">
        {invoiceNumber}
      </span>
      <span className="text-base font-medium leading-none text-black">
        ₹{total}
      </span>
    </div>
  );
}