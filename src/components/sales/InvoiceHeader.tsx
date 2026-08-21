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
    <section
      className="
        flex
        h-[50px]
        w-full
        min-w-0
        items-center
        justify-between
        rounded-[12px]
        bg-black
        px-[14px]
        sm:px-[18px]
      "
    >
      <span className="text-[13px] font-semibold text-white sm:text-[14px]">
        {invoiceNumber}
      </span>

      <span className="text-[12px] font-medium text-white">₹{total}</span>
    </section>
  );
}