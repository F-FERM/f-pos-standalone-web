"use client";
import { CornerDownLeft, RefreshCw } from "lucide-react";
import { cn } from "@/src/lib/utils";

const KEYPAD_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;
const BTN = "aspect-[115/50] w-full rounded-[10px] flex items-center justify-center shadow-sm transition active:scale-[0.98] disabled:opacity-60";
const TXT = "font-semibold text-[22px] leading-none";

interface Props {
  disabled?: boolean;
  onDigit: (digit: string) => void;
  onClear: () => void;
  onBackspace: () => void;
}

export default function LoginPinKeypad({ disabled, onDigit, onClear, onBackspace }: Props) {
  return (
    <div className="mt-[15px] grid grid-cols-3 gap-[10px]">
      {KEYPAD_DIGITS.map((d) => (
        <button key={d} type="button" onClick={() => onDigit(d)} disabled={disabled}
          className={cn(BTN, "bg-white text-[#1a1a1a] hover:bg-white/90")}>
          <span className={TXT}>{d}</span>
        </button>
      ))}
      <button type="button" onClick={() => onDigit("0")} disabled={disabled}
        className={cn(BTN, "bg-white text-[#1a1a1a] hover:bg-white/90")}>
        <span className={TXT}>0</span>
      </button>
      <button type="button" onClick={onClear} aria-label="Clear PIN" disabled={disabled}
        className={cn(BTN, "bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90")}>
        <RefreshCw />
      </button>
      <button type="button" onClick={onBackspace} aria-label="Backspace" disabled={disabled}
        className={cn(BTN, "bg-[#EF4444] text-white hover:bg-[#EF4444]/90")}>
        <CornerDownLeft />
      </button>
    </div>
  );
}