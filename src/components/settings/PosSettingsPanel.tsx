"use client";

import { Check } from "lucide-react";

export type ToggleItem = {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
};

type SettingsToggleCardProps = {
  title: string;
  description: string;
  items: ToggleItem[];
};

export function SettingsToggleCard({ title, description, items }: SettingsToggleCardProps) {
  return (
    <div className="flex w-full flex-col gap-4 rounded-[10px] bg-[#B8B8B8] px-4 py-4 sm:px-5">
      <div>
        <h4 className="font-poppins text-[16px] font-semibold leading-none text-black sm:text-[18px]">
          {title}
        </h4>
        <p className="mt-1.5 font-poppins text-[13px] font-normal leading-normal text-[#5B5B5B] sm:text-[14px]">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <label key={item.label} className="flex cursor-pointer items-start gap-2.5">
            <span
              onClick={item.onChange}
              className={`mt-[2px] flex h-4 w-4 shrink-0 cursor-pointer appearance-none bg-[#B8B8B8] items-center justify-center rounded-sm border border-black ${
                item.checked
                  ? "border-[#450042] bg-[#450042]"
                  : "border-black bg-[#B8B8B8]"
              }`}
            >
              {item.checked && <Check size={12} strokeWidth={3} className="text-white" />}
            </span>
            <span>
              <span className="block font-poppins text-[13px] font-semibold text-black sm:text-[14px]">
                {item.label}
              </span>
              <span className="block font-poppins text-[11px] font-normal text-[#5B5B5B] sm:text-[12px]">
                {item.description}
              </span>
            </span>
          </label>
        ))}
      </div>

      <p className="font-poppins text-[11px] font-normal text-[#5B5B5B] sm:text-[12px]">
        Changes are saved automatically
      </p>
    </div>
  );
}
