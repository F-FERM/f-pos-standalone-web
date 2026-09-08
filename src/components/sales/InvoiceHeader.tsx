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
      <span
        style={{
          fontWeight: 600,
          fontSize: 14,
          lineHeight: "100%",
          letterSpacing: "0%",
          color: "#000000",
        }}
      >
        {invoiceNumber}
      </span>

      <span
        style={{
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "100%",
          letterSpacing: "0%",
          color: "#000000",
        }}
      >
        ₹{total}
      </span>
    </div>
  );
}