"use client";

import type { ElementType } from "react";

type FooterActionProps = {
  icon: ElementType;
  label: string;
  onClick?: () => void;
};

export function FooterAction({ icon: Icon, label, onClick }: FooterActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        h-[42px]
        w-[42px]
        flex-col
        items-center
        justify-center
        gap-[3px]
        rounded-[6px]
        border
        border-[#482045]
        bg-[#2C102A]
        text-white
        xs:h-[49px]
        xs:w-[49px]
      "
    >
      <Icon size={16} strokeWidth={1.5} />
      <span className="text-[7px] font-medium xs:text-[8px]">{label}</span>
    </button>
  );
}