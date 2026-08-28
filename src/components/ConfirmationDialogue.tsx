"use client";

import { Button } from "@/src/components/Button";
import { X } from "lucide-react";
import { useState } from "react";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (remark: string) => void;
  message: string;
  isPending?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  message,
  isPending,
}: ConfirmationDialogProps) {
  const [remark, setRemark] = useState("");

  if (!open) return null;

  const handleClose = () => {
    setRemark("");
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm(remark);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2C192BE5] p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-[440px]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute z-10 right-2 top-2 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
          aria-label="Close confirmation"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="w-full rounded-[20px] border border-gray-600 bg-[#2C192BE5] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px] sm:py-[26px]">
          <h3 className="mb-[14px] text-[18px] font-semibold text-white sm:text-[22px]">
            Confirm
          </h3>
          <p className="text-[14px] text-white/80">{message}</p>

          <label className="mt-[14px] block">
            <span className="mb-1 block text-[13px] text-[#C9C9C9]">
              Remark
            </span>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              className="w-full rounded-[10px] border border-gray-600 bg-transparent px-3 py-2 text-[14px] text-white outline-none"
              placeholder="Optional remark"
            />
          </label>

          <div className="mt-[22px] flex justify-end gap-3">
            <Button type="button" variant="cancel" size="none" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="add"
              size="none"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "DELETING..." : "DELETE"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}