"use client";

import { useState, type ElementType } from "react";
import {
  ArrowLeft,
  Search,
  UserRound,
  ShoppingBasket,
  Cake,
  IceCreamBowl,
  Pizza,
  Minus,
  Plus,
  X,
  UsersRound,
  Table2,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* =========================================================
   TYPES
========================================================= */

type Category = {
  id: number;
  name: string;
  icon: ElementType;
};

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

/* =========================================================
   DATA
========================================================= */

const categories: Category[] = [
  {
    id: 1,
    name: "Combo",
    icon: ShoppingBasket,
  },
  {
    id: 2,
    name: "Snakes",
    icon: Cake,
  },
  {
    id: 3,
    name: "Cake & Wafers",
    icon: Cake,
  },
  {
    id: 4,
    name: "Ice Cream",
    icon: IceCreamBowl,
  },
  {
    id: 5,
    name: "Burgers & Pizza",
    icon: Pizza,
  },
  {
    id: 6,
    name: "Cake & Wafers",
    icon: Cake,
  },
  {
    id: 7,
    name: "Burgers & Pizza",
    icon: Pizza,
  },
];

const products: Product[] = [
  {
    id: 1,
    name: "Butter scotch",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500",
  },
  {
    id: 2,
    name: "Vanilla Classic",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=500",
  },
  {
    id: 3,
    name: "Chocolate chip",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500",
  },
  {
    id: 4,
    name: "Cookies and cream",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500",
  },
  {
    id: 5,
    name: "Rocky road",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
  },
  {
    id: 6,
    name: "Peanut butter",
    price: 90,
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500",
  },
  {
    id: 7,
    name: "Pistachio",
    price: 100,
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500",
  },
  {
    id: 8,
    name: "Mint chocolate",
    price: 100,
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500",
  },
  {
    id: 9,
    name: "Tender coconut",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500",
  },
  {
    id: 10,
    name: "Cherry garcia",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500",
  },
  {
    id: 11,
    name: "Mango",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500",
  },
  {
    id: 12,
    name: "Caramel crunch",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500",
  },
];





/* =========================================================
   PRODUCT SECTION
========================================================= */

function ProductSection() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  return (
    <section
      className="
        relative
        flex
        h-[564px]
        w-[563px]
        overflow-hidden
        rounded-[15px]
        bg-[#170716]
      "
    >
   

      <div
        className="
         
        "
      />

     
      {/* Product grid */}
      <div className="flex-1 overflow-hidden px-[27px] py-[29px]">
        <div className="grid grid-cols-3 gap-[18px]">
          {products.map((product) => {
            const selected = selectedProduct.id === product.id;

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => setSelectedProduct(product)}
                className={`
                  group
                  relative
                  h-[101px]
                  overflow-hidden
                  rounded-[6px]
                  text-left
                  transition-all
                  duration-200
                  ${
                    selected
                      ? "ring-2 ring-[#D000C8]"
                      : "ring-1 ring-transparent"
                  }
                `}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />

                {/* Dark gradient */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/80
                    via-black/20
                    to-transparent
                  "
                />

                {/* Product details */}
                <div className="absolute inset-x-0 bottom-0 p-[8px]">
                  <div className="flex items-end justify-between gap-1">
                    <span
                      className="
                        line-clamp-2
                        max-w-[80px]
                        // text-[12px]
                        font-medium
                        leading-[17px]
                        text-white
                        font-poppins
                      "
                    >
                      {product.name}
                    </span>

                    <span className="shrink-0 text-[16px] font-semibold text-white">
                      ₹{product.price}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

  

      


    </section>
  );
}

/* =========================================================
   CATEGORIES HEADER
========================================================= */

function CategoryHeader() {
  return (
    <section
      className="
        flex
        h-[50px]
        w-[563px]
        items-center
        gap-[10px]
        rounded-[12px]
        bg-black
        px-[18px]
        py-[11px]
      "
    >
      <h2 className="whitespace-nowrap text-[18px] font-semibold text-white">
        Categories
      </h2>

      <div className="relative ml-[14px] w-[172px]">
        <Search
          size={16}
          className="
            pointer-events-none
            absolute
            left-[12px]
            top-1/2
            z-10
            -translate-y-1/2
            text-[#AAAAAA]
          "
        />

        <Input
          placeholder="Search"
          className="
            h-[28px]
            rounded-[6px]
            border-[#777777]
            bg-[#454545]
            pl-[34px]
            text-[12px]
            text-white
            placeholder:text-[#AAAAAA]
            focus-visible:ring-1
            focus-visible:ring-[#D000C8]
          "
        />
      </div>

      <div className="ml-auto flex items-center gap-[28px] text-[12px]">
        <button type="button" className="text-white">
          All
        </button>

        <button type="button" className="text-[#D000C8]">
          Scoop
        </button>

        <button type="button" className="text-white">
          Corn
        </button>

        <button type="button" className="text-white">
          Stick
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   INVOICE HEADER
========================================================= */

function InvoiceHeader() {
  return (
    <section
      className="
        flex
        h-[50px]
        w-[280px]
        items-center
        justify-between
        rounded-[12px]
        bg-black
        px-[18px]
      "
    >
      <span className="text-[14px] font-semibold text-white">
        #INV0001
      </span>

      <span className="text-[13px] font-medium text-white">
        ₹200
      </span>
    </section>
  );
}

/* =========================================================
   ORDER PANEL
========================================================= */

function OrderPanel() {
  return (
    <section
      className="
        relative
        h-[564px]
        w-[281px]
        overflow-hidden
        rounded-[15px]
        border
        border-[#482045]
        bg-[#170716]
      "
    >
      {/* Table header */}
      <div
        className="
          flex
          h-[29px]
          items-center
          rounded-t-[14px]
          border-b
          border-[#482045]
          bg-[#481845]
          px-[12px]
          text-[10px]
        "
      >
        <span className="w-[84px] text-[#D98DD4]">
          Item
        </span>

        <span className="w-[70px] text-[#D98DD4]">
          Quantity
        </span>

        <span className="text-[#D98DD4]">
          Amount
        </span>
      </div>

      {/* Cart item */}
      <div
        className="
          mx-[5px]
          mt-[17px]
          flex
          h-[64px]
          items-center
          rounded-[6px]
          border
          border-[#670063]
          bg-[#170716]
          px-[5px]
        "
      >
        <img
          src={products[0].image}
          alt=""
          className="
            h-[48px]
            w-[48px]
            rounded-[5px]
            object-cover
          "
        />

        <div className="ml-[7px] flex-1">
          <p
            className="
              max-w-[95px]
              text-[11px]
              font-medium
              leading-[15px]
              text-white
            "
          >
            Butter scotch crunch
          </p>

          <div className="mt-[4px] flex items-center gap-[7px]">
            <button
              type="button"
              className="
                flex
                h-[15px]
                w-[15px]
                items-center
                justify-center
                rounded-full
                bg-white
              "
            >
              <Minus
                size={10}
                className="text-black"
              />
            </button>

            <span className="text-[13px] text-white">
              1
            </span>

            <button
              type="button"
              className="
                flex
                h-[15px]
                w-[15px]
                items-center
                justify-center
                rounded-full
                bg-[#D000C8]
              "
            >
              <Plus
                size={10}
                className="text-white"
              />
            </button>
          </div>
        </div>

        <span
          className="
            mr-[10px]
            text-[12px]
            font-semibold
            text-white
          "
        >
          ₹200
        </span>

        <button
          type="button"
          className="
            flex
            h-[15px]
            w-[15px]
            items-center
            justify-center
            rounded-full
            bg-red-500
          "
        >
          <X
            size={10}
            className="text-white"
          />
        </button>
      </div>

      {/* Bottom calculation */}
      <div
        className="
          absolute
          bottom-[72px]
          left-0
          right-0
          px-[7px]
        "
      >
        <div className="space-y-[7px] px-[7px]">
          <div
            className="
              flex
              justify-between
              text-[12px]
              text-white
            "
          >
            <span>Items (1)</span>
            <span>200.00</span>
          </div>

          <div
            className="
              flex
              justify-between
              text-[12px]
              text-white
            "
          >
            <span>Subtotal</span>
            <span>200.00</span>
          </div>

          <div
            className="
              flex
              justify-between
              text-[12px]
              text-white
            "
          >
            <span>VAT(0%)</span>
            <span>0.00</span>
          </div>

          <div className="my-[7px] border-t border-[#777777]" />

          <div
            className="
              flex
              justify-between
              text-[14px]
              font-semibold
              text-white
            "
          >
            <span>Total</span>
            <span>200.00</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-[9px] grid grid-cols-3 gap-[9px]">
          <Button
            className="
              h-[33px]
              rounded-[9px]
              bg-[#3EA200]
              text-[12px]
              hover:bg-[#3EA200]/90
            "
          >
            Save
          </Button>

          <Button
            className="
              h-[33px]
              rounded-[9px]
              bg-white
              text-[12px]
              text-black
              hover:bg-white/90
            "
          >
            Print
          </Button>

          <Button
            className="
              h-[33px]
              rounded-[9px]
              bg-[#FF0F0F]
              text-[12px]
              hover:bg-[#FF0F0F]/90
            "
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          absolute
          bottom-[8px]
          left-[7px]
          right-[7px]
          flex
          h-[58px]
          items-center
          justify-around
          rounded-[10px]
          bg-black
        "
      >
        <FooterAction
          icon={Table2}
          label="Table"
        />

        <FooterAction
          icon={ClipboardList}
          label="Order"
        />

        <FooterAction
          icon={UsersRound}
          label="Customers"
        />
      </div>
    </section>
  );
}

/* =========================================================
   FOOTER ACTION
========================================================= */

function FooterAction({
  icon: Icon,
  label,
}: {
  icon: ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      className="
        flex
        h-[49px]
        w-[49px]
        flex-col
        items-center
        justify-center
        gap-[3px]
        rounded-[6px]
        border
        border-[#482045]
        bg-[#2C102A]
        text-white
      "
    >
      <Icon
        size={16}
        strokeWidth={1.5}
      />

      <span className="text-[8px]">
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   MAIN POS SCREEN
========================================================= */

export default function POSScreen() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* =====================================================
          TOP BORDER
      ===================================================== */}

      <div className="h-[7px] " />

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header
        className="
          relative
          flex
          h-[115px]
          items-center
          px-[29px]
        "
      >
        {/* Back button */}
        <Button
          size="icon"
          className="
            h-[40px]
            w-[40px]
            rounded-[6px]
            bg-[#292929]
            hover:bg-[#333333]
          "
        >
          <ArrowLeft size={22} />
        </Button>

        {/* Restaurant */}
        <div
          className="
            absolute
            left-1/2
            flex
            -translate-x-1/2
            items-center
            gap-[10px]
          "
        >
          <div
            className="
              flex
              h-[48px]
              w-[48px]
              items-center
              justify-center
              rounded-full
              bg-[#D9D9D9]
            "
          >
            <UserRound
              className="text-black"
              size={22}
            />
          </div>

          <h1
            className="
              text-[32px]
              font-semibold
              tracking-[-1px]
            "
          >
            My Restaurant
          </h1>
        </div>

        {/* Admin */}
        <div
          className="
            ml-auto
            flex
            items-center
            gap-[8px]
          "
        >
          <div
            className="
              flex
              h-[38px]
              w-[38px]
              items-center
              justify-center
              rounded-full
              bg-[#D9D9D9]
            "
          >
            <UserRound
              size={18}
              className="text-black"
            />
          </div>

          <div>
            <p
              className="
                text-[20px]
                font-semibold
                leading-[20px]
              "
            >
              Admin
            </p>

            <p
              className="
                text-[13px]
                text-[#AAAAAA]
              "
            >
              Company Admin
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          bg-[#2C192B]
          px-[29px]
          py-[7px]
        "
      >
        <div
          className="
            mx-auto
            grid
            w-[844px]
            grid-cols-[563px_280px]
            gap-x-[10px]
            gap-y-[14px]
          "
        >
          {/* First section */}
          <CategoryHeader />

          {/* Second section */}
          <InvoiceHeader />

          {/* Third section */}
          <ProductSection />

          {/* Fourth section */}
          <OrderPanel />
        </div>
      </div>
    </main>
  );
}