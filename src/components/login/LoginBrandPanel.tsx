"use client";

import { useLiveClock } from "@/src/hooks/useLiveClock";
import FposLogo from "./LoginLogo";

export default function LoginBrandPanel() {
  const { timeValue, meridiem, dayLabel, dateLabel } = useLiveClock();

  return (
    <section className="flex w-full max-w-[480px] flex-col items-center text-center md:text-left">
      <FposLogo />

      <span className="font-[GROCHES] text-[16px] sm:text-[20px] md:text-[24px] lg:text-[26px] font-normal text-white mt-2 md:mt-0">
        SERVE FAST SELL SMART
      </span>

      <div className="mt-[24px] sm:mt-[40px] md:mt-[60px] lg:mt-[80px] flex flex-col items-center gap-1 text-white md:items-start">
        <div className="flex items-baseline gap-2 md:pl-3">
          <span className="font-[Inter,sans-serif] text-[40px] sm:text-[52px] md:text-[68px] lg:text-[82px] font-semibold leading-none">
            {timeValue}
          </span>
          <span className="font-[Inter,sans-serif] text-[16px] sm:text-[20px] md:text-[24px] lg:text-[28px] font-semibold leading-none text-white">
            {meridiem}
          </span>
        </div>
        <p className="font-[Poppins,sans-serif] text-[14px] sm:text-[16px] md:text-[19px] lg:text-[22px] leading-[120%]">
          {dayLabel}
        </p>
        <p className="font-[Poppins,sans-serif] text-[14px] sm:text-[16px] md:text-[19px] lg:text-[22px] leading-[120%]">
          {dateLabel}
        </p>
      </div>
    </section>
  );
}