"use client";

import FposLogo from "@/src/components/login/LoginLogo";
import { X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import expenseIcon from "../../../public/images/icons/Expense.png";
import supplierIcon from "../../../public/images/icons/Supplier.png";
import accountsIcon from "../../../public/images/icons/accounts.png";
import Avatar from "../../../public/images/icons/avatar.png";
import customerIcon from "../../../public/images/icons/customer.png";
import deliveryIcon from "../../../public/images/icons/delivery.png";
import kitchenIcon from "../../../public/images/icons/kitchen.png";
import menuIcon from "../../../public/images/icons/menu.png";
import purchaseIcon from "../../../public/images/icons/purchase.png";
import reportsIcon from "../../../public/images/icons/reports.png";
import saleIcon from "../../../public/images/icons/sale.png";
import settingsIcon from "../../../public/images/icons/settings.png";
import userIcon from "../../../public/images/icons/user.png";

interface MenuItem {
  label: string;
  icon: string | StaticImageData;
  href: string;
}

const menuItems: MenuItem[] = [
  { label: "Sale", icon: saleIcon, href: "/home/sales" },
  { label: "Delivery", icon: deliveryIcon, href: "/home/delivery" },
  { label: "Kitchen", icon: kitchenIcon, href: "/home/kitchen" },
  { label: "Customer", icon: customerIcon, href: "/home/customer" },
  { label: "Purchase", icon: purchaseIcon, href: "/home/purchase" },
  { label: "Expense", icon: expenseIcon, href: "/home/expense" },
  { label: "Supplier", icon: supplierIcon, href: "/home/supplier" },
  { label: "Menu", icon: menuIcon, href: "/home/menu" },
  { label: "Reports", icon: reportsIcon, href: "/reports" },
  { label: "Accounts", icon: accountsIcon, href: "/accounts" },
  { label: "User", icon: userIcon, href: "/user" },
  { label: "Settings", icon: settingsIcon, href: "/settings" },
];

const navLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "ABOUT", href: "/about" },
  { label: "SUPPORT", href: "/support" },
];

export default function FposDashboard() {
  return (
    <main className="flex h-full w-full flex-col bg-black overflow-x-hidden">

      <style>{`
        @property --angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes rotate-border {
          0% { --angle: 0deg; }
          50% { --angle: 180deg; }
          100% { --angle: 0deg; }
        }
        .gradient-border {
          position: relative;
          z-index: 0;
        }
.gradient-border::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background-image: conic-gradient(
    from var(--angle),
    transparent 0%,
    #444b55 12%,
    transparent 48%,
    transparent 50%,
    #444b55 62%,
    transparent 78%,
    transparent 100%
  );

  background-size: 260px 260px;
  background-position: center;
  background-repeat: no-repeat;

  -webkit-mask: linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  // animation: rotate-border 3.5s ease-in-out infinite;
  pointer-events: none;
}
          -webkit-mask: linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          // animation: rotate-border 3.5s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ---------------- Navbar ---------------- */}
      <header className="flex w-full items-center justify-between px-3 pt-2 -mt-4 xs:px-4 sm:px-10 sm:pt-3 sm:-mt-7 lg:px-19">
        <Link href="/" className="flex shrink-0 items-center gap-1.5">
          <FposLogo className="w-[56px] h-[56px] xs:w-[64px] xs:h-[64px] sm:w-[100px] sm:h-[100px]" />
        </Link>
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-8 lg:gap-12">
          <nav className="flex items-center gap-2 xs:gap-3 sm:gap-8 lg:gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-[9px] font-semibold tracking-wide text-white/90 transition-colors hover:text-white xs:text-[10px] sm:text-xs lg:text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Close"
            className="shrink-0 text-white/90 transition-colors hover:text-white"
          >
            <X className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6" strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* ---------------- Body — centered in remaining viewport space ---------------- */}
      <div className="flex pt-2 mb-6 flex-col items-center justify-center px-4 py-10 sm:px-6">
        {/* Profile header */}
        <div className="mt-4 flex items-center justify-center gap-3 sm:mt-5">
          <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-300 sm:h-12 sm:w-12">
            <Image
              src={Avatar}
              alt="Restaurant profile"
              fill
              sizes="(min-width: 640px) 48px, 40px"
              className="object-cover"
            />
          </span>
          <h1 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">
          My Restaurant
          </h1>
        </div>

        {/* Menu grid */}
        <div
          className="mt-14 grid w-full max-w-[720px] grid-cols-2 gap-x-4 gap-y-4
                     sm:mt-20 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-6
                     md:grid-cols-4"
        >
          {menuItems.map((item) => {
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="gradient-border group flex w-full flex-col items-center justify-center
                           gap-2.5 sm:gap-[10px]
                           rounded-[20px]
                           px-4 pb-4 pt-5 sm:px-[50px] sm:pb-[20px] sm:pt-[21px]
                           sm:mx-auto sm:h-[115px] sm:w-[150px]
                           bg-[#4A4A4A]/20
                           outline-none transition-colors duration-150
                           hover:bg-neutral-300/10
                           focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black
                           focus-visible:ring-secondary"
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={42}
                  height={42}
                  className="w-[36px] h-[36px] shrink-0 sm:w-[42px] sm:h-[42px]"
                  aria-hidden="true"
                />
                <span
                  className="whitespace-nowrap font-medium text-sm leading-none tracking-normal text-secondary sm:text-base"
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}