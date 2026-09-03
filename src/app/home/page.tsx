import { User, X } from "lucide-react";
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

// Split into rows of 4 to match the "each row" spec (width 718, justify-between)
const rows: MenuItem[][] = [
  menuItems.slice(0, 4),
  menuItems.slice(4, 8),
  menuItems.slice(8, 12),
];

export default function RestaurantDashboard() {
  return (
    <div className=" w-full h-full bg-[#EFEFEF]">
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
        <Image
          src={logo}
          alt="FPOS logo"
          width={100}
          height={32}
          priority
        />

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
              {row.map((item) => (
                <button
                  key={item.label}
                  className="flex flex-col items-center justify-center rounded-[20px] bg-[#D2D2D2] transition hover:brightness-95"
                  style={{
                    width: "150px",
                    height: "115px",
                    gap: "10px",
                    paddingTop: "21px",
                    paddingBottom: "20px",
                    paddingLeft: "50px",
                    paddingRight: "50px",
                  }}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={42}
                    height={42}
                  />
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
                </button>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}