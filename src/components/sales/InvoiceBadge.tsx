interface Props {
  invoiceNo: string;
  total: number;
}

export default function InvoiceBadge({ invoiceNo, total }: Props) {
  return (
    <div
      className="absolute top-[13px] left-[583px] w-[280px] h-[50px] rounded-xl bg-[#1C1220]
                 flex items-center justify-between pt-[15px] pr-[17px] pb-[14px] pl-[18px]"
    >
      <span className="text-white font-semibold text-sm">#{invoiceNo}</span>
      <span className="text-white font-semibold text-sm">₹{total}</span>
    </div>
  );
}