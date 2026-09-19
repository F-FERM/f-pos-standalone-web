"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

type SelectCustomerTypeModalProps = {
  open: boolean;
  onClose: () => void;
};

export function SelectCustomerTypeModal({
  open,
  onClose,
}: SelectCustomerTypeModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="select-customer-type-title"
        aria-describedby="select-customer-type-desc"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[380px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-6 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-md"
        >
          <X size={15} strokeWidth={2.5} />
        </button>

        <h3
          id="select-customer-type-title"
          className="pr-8 text-[20px] font-semibold leading-tight text-black"
        >
          Customer type required
        </h3>

        <p
          id="select-customer-type-desc"
          className="mt-3 text-sm text-[#555] sm:text-base"
        >
          Please select a customer type to continue.
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            autoFocus
            onClick={onClose}
            className="h-[38px] min-w-[96px] rounded-[10px] bg-[#3B0038] px-5 text-sm font-semibold text-white"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}