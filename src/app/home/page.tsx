"use client";

import { useState } from "react";
import { User, X, FileSearch, TrendingUp, ReceiptText, Bike } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import expenseIcon from "../../../public/images/icons/Expense.png";
import supplierIcon from "../../../public/images/icons/Supplier.png";
import accountsIcon from "../../../public/images/icons/accounts.png";
import customerIcon from "../../../public/images/icons/customer.png";
import deliveryIcon from "../../../public/images/icons/delivery.png";
import kitchenIcon from "../../../public/images/icons/kitchen.png";
import menuIcon from "../../../public/images/icons/menu.png";
import purchaseIcon from "../../../public/images/icons/purchase.png";
import reportsIcon from "../../../public/images/icons/reports.png";
import saleIcon from "../../../public/images/icons/sale.png";
import settingsIcon from "../../../public/images/icons/settings.png";
import userIcon from "../../../public/images/icons/user.png";
import logo from "../../../public/images/login/fposlogo.png";
import Link from "next/link";
import Restaurant from "../../../public/images/icons/restaurant.png"
import PosSettings from "../../../public/images/icons/possettings.png"
import Kitchen from "../../../public/images/icons/kitchensettings.png"
import Riders from "../../../public/images/icons/riders.png"
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
  { label: "Settings", icon: settingsIcon, href: "" }, // handled by modal, not navigation
];

// Split into rows of 4 to match the "each row" spec (width 718, justify-between)
const rows: MenuItem[][] = [
  menuItems.slice(0, 4),
  menuItems.slice(4, 8),
  menuItems.slice(8, 12),
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

export default function RestaurantDashboard() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className=" w-full h-full bg-[#EFEFEF] relative">
      {/* Header */}
      <header
        className="flex w-full items-center justify-between"
        style={{
          height: "91px",
          paddingTop: "22px",
          paddingBottom: "22px",
          paddingLeft: "80px",
          paddingRight: "80px",
          gap: "10px",
        }}
      >
        {/* Logo */}
        <Image src={logo} alt="FPOS logo" width={100} height={32} priority />

        {/* Nav items + close icon */}
        <div
          className="flex items-center justify-between"
          style={{ width: "355px", height: "40px" }}
        >
          <nav
            className="flex items-center gap-8 text-black"
            style={{
              fontWeight: 600,
              fontSize: "12px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
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
          <button aria-label="Close" className="text-black hover:opacity-80">
            <X width={24} height={24} />
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex flex-col items-center">
        {/* My Restaurant */}
        <div
          className="flex items-center"
          style={{
            height: "47px",
            marginTop: "28px",
            gap: "9px",
          }}
        >
          <div
            className="flex items-center justify-center rounded-[40px] bg-[#D2D2D2]"
            style={{ width: "47px", height: "47px", padding: "10px" }}
          >
            <User className="text-black" size={24} />
          </div>
          <h1
            className="text-black"
            style={{
              fontWeight: 600,
              fontSize: "32px",
              lineHeight: "100%",
              letterSpacing: "0%",
            }}
          >
            My Restaurant
          </h1>
        </div>

        {/* Grid of cards */}
        <div
          className="flex flex-col"
          style={{ width: "718px", marginTop: "85px", gap: "32px" }}
        >
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-between"
              style={{ width: "718px", height: "115px" }}
            >
              {row.map((item) => {
                const cardContent = (
                  <>
                    <Image src={item.icon} alt={item.label} width={42} height={42} />
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#BD29B7",
                      }}
                    >
                      {item.label}
                    </span>
                  </>
                );

                const cardClassName =
                  "flex flex-col items-center justify-center rounded-[20px] bg-[#D2D2D2] transition hover:brightness-95";
                const cardStyle = {
                  width: "150px",
                  height: "115px",
                  gap: "10px",
                  paddingTop: "21px",
                  paddingBottom: "20px",
                  paddingLeft: "50px",
                  paddingRight: "50px",
                };

                // Settings opens a modal instead of navigating
                if (item.label === "Settings") {
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setIsSettingsOpen(true)}
                      className={cardClassName}
                      style={cardStyle}
                    >
                      {cardContent}
                    </button>
                  );
                }

                return (
                  <Link key={item.label} href={item.href} className={cardClassName} style={cardStyle}>
                    {cardContent}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#EFEFEF] border border-[#D2D2D2]"
            style={{
              width: "452px",
              height: "368px",
              borderRadius: "20px",
              borderWidth: "1px",
              paddingTop: "26px",
              paddingRight: "62px",
              paddingBottom: "34px",
              paddingLeft: "62px",
              opacity: 1,
            }}
          >
            {/* Close button */}
            <button
              aria-label="Close settings"
              onClick={() => setIsSettingsOpen(false)}
              className="absolute flex items-center justify-center rounded-full bg-white shadow"
              style={{ width: "36px", height: "36px", top: "-18px", right: "-18px" }}
            >
              <X className="text-red-500" size={18} />
            </button>

            {/* Title */}
            <h2
              className="text-black font-semibold"
              style={{
                fontWeight: 700,
                fontSize: "22px",
                lineHeight: "100%",
                letterSpacing: "0%",
                marginBottom: "26px",
              }}
            >
              Settings
            </h2>

            {/* 2x2 grid of cards */}
            <div
              className="grid grid-cols-2"
              style={{ gap: "20px" }}
            >
              {settingsCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.label}
                    href={card.href}
                    className="flex flex-col items-center justify-center rounded-[20px] bg-[#D2D2D2] transition hover:brightness-95"
                    style={{
                      height: "115px",
                      gap: "10px",
                    }}
                  >
                    <Image src={card.icon} alt={card.label} width={42} height={42} />
                    <span
                      style={{
                        fontWeight: 500,
                        fontSize: "16px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#BD29B7",
                      }}
                    >
                      {card.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}