"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (remark: string) => void;
  message: string;
  isPending?: boolean;
  confirmText?: string;
  pendingText?: string;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  message,
  isPending,
  confirmText = "DELETE",
  pendingText = "DELETING...",
}: ConfirmationDialogProps) {
  const [remark, setRemark] = useState("");

  const handleClose = () => {
    setRemark("");
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm(remark);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="
          w-full sm:w-[680px] max-w-[calc(100vw-2rem)]
          h-auto
          flex flex-col gap-[10px]
          rounded-[16px] sm:rounded-[20px] border-[1px]
          bg-[#E9E9E9] text-white
          pt-[20px] pr-[20px] pb-[20px] pl-[20px]
          sm:pt-[26px] sm:pr-[34px] sm:pb-[26px] sm:pl-[34px]
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="
            absolute z-10 flex items-center justify-center
            rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg
            right-2 top-2 h-[34px] w-[34px]
            sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]
          "
          aria-label="Close confirmation"
        >
          <X size={18} strokeWidth={2.5} className="sm:hidden" />
          <X size={20} strokeWidth={2.5} className="hidden sm:block" />
        </button>

        <div className="pr-[36px] sm:pr-0">
          <DialogTitle className="text-[18px] sm:text-[22px] font-semibold text-black">
            Confirm
          </DialogTitle>
        </div>

        <p className="text-[14px] sm:text-[18px] text-black/70 break-words">
          {message}
        </p>

        <div className="mt-[8px] flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="add"
            className="w-full bg-white text-black sm:w-auto"
            size="none"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="add"
            className="w-full sm:w-auto"
            size="none"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? pendingText : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}