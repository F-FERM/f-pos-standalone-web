"use client";

import { User, X } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";
import expenseIcon from "../../../public/images/icons/Expense.png";
import supplierIcon from "../../../public/images/icons/Supplier.png";
import accountsIcon from "../../../public/images/icons/accounts.png";
import customerIcon from "../../../public/images/icons/customer.png";
import deliveryIcon from "../../../public/images/icons/delivery.png";
import kitchenIcon from "../../../public/images/icons/kitchen.png";
import Kitchen from "../../../public/images/icons/kitchensettings.png";
import menuIcon from "../../../public/images/icons/menu.png";
import PosSettings from "../../../public/images/icons/possettings.png";
import purchaseIcon from "../../../public/images/icons/purchase.png";
import reportsIcon from "../../../public/images/icons/reports.png";
import Restaurant from "../../../public/images/icons/restaurant.png";
import Riders from "../../../public/images/icons/riders.png";
import saleIcon from "../../../public/images/icons/sale.png";
import settingsIcon from "../../../public/images/icons/settings.png";
import userIcon from "../../../public/images/icons/user.png";
import logo from "../../../public/images/login/fposlogo.png";
import { closeApp } from "@/src/lib/electron";

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
  { label: "User", icon: userIcon, href: "/home/users" },
  { label: "Settings", icon: settingsIcon, href: "" }, 
];

interface SettingsCardItem {
  label: string;
  icon: string | StaticImageData;
  href: string;
}

const settingsCards: SettingsCardItem[] = [
  { label: "Pos Settings", icon: PosSettings, href: "/home/settings/pos-settings" },
  { label: "Restaurant", icon: Restaurant, href: "/home/settings/restaurant" },
  { label: "Kitchen", icon: Kitchen, href: "/home/settings/kitchen" },
  { label: "Riders", icon: Riders, href: "/home/settings/riders" },
];

const CARD_CLASSNAME =
  "flex flex-col items-center justify-center gap-2 sm:gap-2.5 rounded-[14px] sm:rounded-[17px] md:rounded-[20px] " +
  "bg-[#D2D2D2] transition hover:brightness-95 " +
  "w-full aspect-[150/115] " +
  "px-8 sm:px-10 md:px-[50px] " +
  "pt-[15px] sm:pt-[18px] md:pt-[21px] " +
  "pb-[14px] sm:pb-[17px] md:pb-[20px]";

const CARD_LABEL_CLASSNAME =
  "font-medium text-[13px] sm:text-[14px] md:text-[16px] leading-none text-[#BD29B7] text-center";



const CARD_ICON_SIZE = 42;

export default function RestaurantDashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="min-h-dvh w-full bg-[#EFEFEF]">
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
          <nav className="hidden sm:flex items-center gap-6 lg:gap-8 text-black font-semibold text-[11px] lg:text-[12px] leading-none">
            <a href="#" className="hover:opacity-80">FAQ</a>
            <a href="#" className="hover:opacity-80">ABOUT</a>
            <a href="#" className="hover:opacity-80">SUPPORT</a>
          </nav>

          <button
            type="button"
            aria-label="Close"
            onClick={closeApp}
            className="text-black hover:opacity-80"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-col items-center px-4 pb-12 sm:px-8">
        {/* My Restaurant */}
        <div className="flex items-center gap-2.5 mt-4 sm:mt-6 md:mt-[28px]">
          <div className="flex items-center justify-center rounded-full bg-[#D2D2D2] h-10 w-10 sm:h-12 sm:w-12 md:h-[47px] md:w-[47px] p-2 sm:p-2.5">
            <User className="text-black h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <h1 className="text-black font-semibold text-[22px] sm:text-[26px] md:text-[32px] leading-none">
            My Restaurant
          </h1>
        </div>

        {/* Grid of cards */}
        <div className="w-full max-w-[718px] mt-10 sm:mt-14 md:mt-[85px]">
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {menuItems.map((item) => {
              const cardContent = (
                <>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={CARD_ICON_SIZE}
                    height={CARD_ICON_SIZE}
                    className="h-8 w-8 sm:h-9 sm:w-9 md:h-[42px] md:w-[42px] object-contain"
                  />
                  <span className={CARD_LABEL_CLASSNAME}>{item.label}</span>
                </>
              );

              if (item.label === "Settings") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className={CARD_CLASSNAME}
                  >
                    {cardContent}
                  </button>
                );
              }

              return (
                <Link key={item.label} href={item.href} className={CARD_CLASSNAME}>
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
    {isSettingsOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[4px] px-4"
    onClick={() => setIsSettingsOpen(false)}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative w-full max-w-[452px] aspect-[452/368] rounded-[20px] border border-[#EFEFEF] bg-[#EFEFEF]
        flex flex-col
        px-8 sm:px-12 md:px-[62px]
        pt-5 sm:pt-6 md:pt-[26px]
        pb-6 sm:pb-8 md:pb-[34px]"
    >
      <button
        aria-label="Close settings"
        onClick={() => setIsSettingsOpen(false)}
        className="absolute -top-4 -right-4 flex h-9 w-9 items-center justify-center rounded-full border-[#E0E0E0] bg-[#EFEFEF]  shadow"
      >
        <X className="text-red-600 h-[18px] w-[18px]" />
      </button>

      <h2 className="text-black font-bold text-[18px] sm:text-[20px] md:text-[22px] leading-none mb-4 sm:mb-5 md:mb-[26px]">
        Settings
      </h2>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 flex-1">
        {settingsCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 rounded-[14px] sm:rounded-[17px] md:rounded-[20px]
              bg-[#D2D2D2] transition hover:brightness-95"
          >
            <Image
              src={card.icon}
              alt={card.label}
              width={CARD_ICON_SIZE}
              height={CARD_ICON_SIZE}
              className="h-8 w-8 sm:h-[42px] sm:w-[42px] object-contain"
            />
            <span className={CARD_LABEL_CLASSNAME}>{card.label}</span>
          </Link>
        ))}
      </div>
    </div>
  </div>
)}
    </div>
  );
}