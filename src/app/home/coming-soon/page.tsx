"use client";

import { User, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "../../../../public/images/login/fposlogo.png";

export default function RestaurantComingsoon() {
  const router = useRouter();

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#EFEFEF]">
      {/* Header */}
      <header className="flex w-full items-center justify-between gap-4 px-5 py-4 sm:px-10 sm:py-5 lg:px-20 lg:py-[22px]">
        <Image
          src={logo}
          alt="FPOS logo"
          width={100}
          height={32}
          priority
          className="h-auto w-[72px] sm:w-[88px] lg:w-[100px]"
        />

        <div className="flex items-center gap-4 sm:gap-8">
          <nav className="hidden items-center gap-6 text-[11px] font-semibold leading-none text-black sm:flex lg:gap-8 lg:text-[12px]">
            <a href="#" className="hover:opacity-80">
              FAQ
            </a>
            <a href="#" className="hover:opacity-80">
              ABOUT
            </a>
            <a href="#" className="hover:opacity-80">
              SUPPORT
            </a>
          </nav>
          {/* CHANGE: this close button used to open a logout confirmation
              dialog. It now just navigates back to the previous page —
              no logout, no modal. */}
          <button
            aria-label="Go back"
            className="cursor-pointer text-black hover:opacity-80"
            onClick={() => router.back()}
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex w-full flex-1 flex-col items-center px-4 pb-12 sm:px-8">
        {/* My Restaurant */}
        <div className="mt-4 flex items-center gap-2.5 sm:mt-6 md:mt-[28px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D2D2D2] p-2 sm:h-12 sm:w-12 sm:p-2.5 md:h-[47px] md:w-[47px]">
            <User className="h-5 w-5 text-black sm:h-6 sm:w-6" />
          </div>
          <h1 className="text-[22px] font-semibold leading-none text-black sm:text-[26px] md:text-[32px]">
            My Restaurant
          </h1>
        </div>

        {/* Coming soon */}
        <div className="flex w-full flex-1 flex-col items-center justify-center text-center">
          <h2 className="text-[32px] font-bold leading-tight tracking-tight text-[#450042] sm:text-[48px] md:text-[64px] lg:text-[72px]">
            Coming Soon ! !
          </h2>
          <p className="mt-3 max-w-[480px] text-sm text-[#6B6B6B] sm:mt-4 sm:text-base">
            We&apos;re working on this page. Check back soon.
          </p>
        </div>
      </main>
    </div>
  );
}