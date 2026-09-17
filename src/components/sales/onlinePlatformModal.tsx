"use client";

import { Check, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface OnlinePlatformModalProps {
  open: boolean;
  onClose: () => void;
  platforms: string[];
  onSubmit: (platform: string) => void;
}


const CARD_COLORS = [
  "from-[#FF3B3B] to-[#FF7A7A]",
  "from-[#3EA200] to-[#7ED957]",
  "from-[#3B0038] to-[#8A2BE2]",
  "from-[#0066FF] to-[#5DA9FF]",
  "from-[#FF8A00] to-[#FFC24B]",
  "from-[#00A8A8] to-[#5FE0E0]",
];

const getPlatformColor = (platform: string, platforms: string[]) => {
  const index = platforms.indexOf(platform);
  return CARD_COLORS[index % CARD_COLORS.length];
};

export function OnlinePlatformModal({
  open,
  onClose,
  platforms,
  onSubmit,
}: OnlinePlatformModalProps) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!selected) return;
    onSubmit(selected);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 py-6 backdrop-blur-[2px]">
      <div className="relative my-auto w-[720px] max-w-[calc(100vw-2rem)]">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-2 top-2 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px]"
          aria-label="Close online platform modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="flex max-h-[85vh] w-full flex-col gap-5 overflow-y-auto rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
          <div>
            <h3 className="text-[22px] font-semibold leading-none text-black">
              Select Online Platform
            </h3>
            <p className="mt-1.5 text-[14px] text-[#767676]">
              Choose which platform this order is coming from.
            </p>
          </div>

          {platforms.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#878787]">
              No online platforms configured yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {platforms.map((platform) => {
                const isSelected = selected === platform;
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setSelected(platform)}
                    className={`group relative flex flex-col items-center gap-2.5 rounded-[16px] border-2 bg-white px-3 py-5 shadow-sm transition-all duration-150 ${
                      isSelected
                        ? "border-[#3B0038] shadow-md scale-[1.02]"
                        : "border-transparent hover:border-[#C4C4C4] hover:shadow-md"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#3B0038]">
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-inner ${getPlatformColor(
                        platform,platforms,
                      )}`}
                    >
                      <ShoppingBag size={22} />
                    </span>
                    <span className="text-center text-[13px] font-medium text-black">
                      {platform}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-auto flex justify-end">
            <Button
              type="button"
              variant="add"
              size="none"
              onClick={handleConfirm}
              disabled={!selected}
              className="w-full disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              CONFIRM
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}