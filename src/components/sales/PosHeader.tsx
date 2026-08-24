"use client";

import { ArrowLeft, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";

export function POSHeader() {
  return (
    <header
      className="
        relative
        flex
        w-full
        shrink-0
        items-center
        bg-black
        px-3
        py-3
        sm:px-4
        md:px-6
        lg:px-7
        xl:px-[29px]
      "
    >
      {/* =========================
          LEFT - BACK BUTTON
      ========================== */}
      <div className="flex shrink-0 items-center">
        <Button
          type="button"
          size="icon"
          className="
            flex
            shrink-0
            items-center
            justify-center
            rounded-[6px]
            bg-[#292929]
            hover:bg-[#333333]

            h-[36px]
            w-[36px]

            sm:h-[42px]
            sm:w-[42px]

            md:h-[46px]
            md:w-[46px]

            lg:h-[50px]
            lg:w-[50px]
          "
        >
          <ArrowLeft
            className="
              h-[18px]
              w-[18px]

              sm:h-[20px]
              sm:w-[20px]

              md:h-[22px]
              md:w-[22px]
            "
          />
        </Button>
      </div>

      {/* =========================
          CENTER - RESTAURANT
      ========================== */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          flex
          max-w-[45%]
          -translate-x-1/2
          -translate-y-1/2
          items-center
          gap-2
          sm:gap-[10px]
          md:gap-3
        "
      >
        {/* Restaurant Avatar */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#D9D9D9]

            h-[34px]
            w-[34px]

            sm:h-[40px]
            sm:w-[40px]

            md:h-[46px]
            md:w-[46px]

            lg:h-[50px]
            lg:w-[50px]
          "
        >
          <UserRound
            className="
              h-[16px]
              w-[16px]
              text-black

              sm:h-[18px]
              sm:w-[18px]

              md:h-[20px]
              md:w-[20px]
            "
          />
        </div>

        {/* Restaurant Name */}
        <h1
          className="
            min-w-0
            truncate
            whitespace-nowrap
            font-semibold
            tracking-[-0.5px]

            text-[16px]

            sm:text-[20px]

            md:text-[24px]

            lg:text-[28px]

            xl:text-[32px]
          "
        >
          My Restaurant
        </h1>
      </div>

      {/* =========================
          RIGHT - ADMIN
      ========================== */}
      <div
        className="
          ml-auto
          flex
          shrink-0
          items-center
          gap-2

          sm:gap-[10px]

          md:gap-3
        "
      >
        {/* Admin Avatar */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#D9D9D9]

            h-[32px]
            w-[32px]

            sm:h-[38px]
            sm:w-[38px]

            md:h-[44px]
            md:w-[44px]

            lg:h-[48px]
            lg:w-[48px]
          "
        >
          <UserRound
            className="
              h-[15px]
              w-[15px]
              text-black

              sm:h-[17px]
              sm:w-[17px]

              md:h-[19px]
              md:w-[19px]
            "
          />
        </div>

        {/* Admin Details */}
        <div className="hidden min-w-0 sm:block">
          <p
            className="
              truncate
              font-semibold
              leading-tight

              text-[14px]

              md:text-[16px]

              lg:text-[18px]

              xl:text-[20px]
            "
          >
            Admin
          </p>

          <p
            className="
              truncate
              text-[#AAAAAA]

              text-[10px]

              md:text-[11px]

              lg:text-[12px]

              xl:text-[13px]
            "
          >
            Company Admin
          </p>
        </div>
      </div>
    </header>
  );
}