"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import SearchFilterBar from "./SearchFilterBar";
import InvoiceBadge from "./InvoiceBadge";
import MenuPanel from "./MenuPanel";
import CartPanel from "./CartPanel";
import { CartLine, FILTER_TABS, Product } from "./Types";


export default function PosScreen() {
  const [activeTab, setActiveTab] = useState<(typeof FILTER_TABS)[number]>("Scoop");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) => (l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l));
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const changeQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((l) => (l.product.id === productId ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0)
    );
  };

  const removeLine = (productId: string) => {
    setCart((prev) => prev.filter((l) => l.product.id !== productId));
  };

  const total = cart.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  return (
    <div className="relative w-full h-full">
      <Navbar />

      {/* Main card */}
      <div className="absolute top-[109px] left-[80px] w-[944px] h-[671px] rounded-tl-[10px] bg-[#2C192B]">
        <div className="relative w-full h-full">
          <SearchFilterBar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            search={search}
            onSearchChange={setSearch}
          />
          <InvoiceBadge invoiceNo="INV0001" total={total} />
          <MenuPanel search={search} onAdd={addToCart} />
          <CartPanel
            lines={cart}
            onQtyChange={changeQty}
            onRemove={removeLine}
            onSave={() => console.log("save order", cart)}
            onPrint={() => console.log("print invoice", cart)}
            onCancel={() => setCart([])}
          />
        </div>
      </div>
    </div>
  );
}