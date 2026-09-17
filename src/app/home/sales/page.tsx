"use client";

import { CategoryHeader } from "@/src/components/sales/CategoryHeader";
import { InvoiceHeader } from "@/src/components/sales/InvoiceHeader";
import { OrderPanel } from "@/src/components/sales/OrderPanel";
import { PortionChoicesModal } from "@/src/components/sales/PortionChoicesModal";
import { POSHeader } from "@/src/components/sales/PosHeader";
import { ProductSection } from "@/src/components/sales/ProductSection";
import { TableModal } from "@/src/components/sales/TableModal";
import { CustomerTypeEnum, type CartItemType, type Product } from "@/src/components/sales/Types";
import { CustomerTypeValue } from "@/src/interfaces/customer-type/AddCustomerTypePayload";
import { useState } from "react";

export default function POSScreen() {
  const [selectedMenuType, setSelectedMenuType] = useState("All");
  const [search, setSearch] = useState("");
  
  // Lifted state for customer type and cart
  const [selectedType, setSelectedType] = useState<CustomerTypeValue | null>(null);
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [tableId, setTableId] = useState<string | null>(null);

  // Modals state
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isPortionModalOpen, setIsPortionModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  
  const handleAddProduct = (product: Product) => {
    const hasChoices = product.food?.choices && product.food.choices.length > 0;
    if (product.food?.isPortionEnabled || hasChoices) {
      setPendingProduct(product);
      if (selectedType === CustomerTypeEnum.DINE_IN && !tableId) {
        setIsTableModalOpen(true);
      } else {
        setIsPortionModalOpen(true);
      }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            food: product.food,
            portion: null,
            choices: [],
            qty: 1,
          },
        ];
      });
    }
  };

  const handleTableSelection = (id: string | null) => {
    setTableId(id);
    if (id !== null && pendingProduct) {
      setIsPortionModalOpen(true);
    } else if (id === null && pendingProduct) {
      setPendingProduct(null);
    }
  };

  const handleAddPortionedItems = (items: CartItemType[]) => {
    setCartItems((prev) => {
      let updatedCart = [...prev];
      items.forEach((newItem) => {
        const existingIndex = updatedCart.findIndex((item) => item.id === newItem.id);
        if (existingIndex >= 0) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            qty: updatedCart[existingIndex].qty + newItem.qty,
          };
        } else {
          updatedCart.push(newItem);
        }
      });
      return updatedCart;
    });
    setPendingProduct(null);
  };

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-hidden bg-[#EFEFEF]">
      {/* Navbar */}
      <POSHeader />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 xs:p-3 sm:p-3">
        <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-[15px] bg-[#D2D2D2] p-3 lg:flex-row lg:gap-4 lg:p-4">
          {/* Left column: category/search bar + product panel */}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 lg:basis-[63.6%]">
            <div className="flex h-auto min-h-[56px] shrink-0 items-center gap-2.5 rounded-xl bg-[#EFEFEF] px-4 py-3 sm:gap-3">
              <CategoryHeader
                selectedFilter={selectedMenuType}
                onSelectFilter={setSelectedMenuType}
                search={search}
                onSearchChange={setSearch}
              />
            </div>

            <div className="min-h-0 flex-1 rounded-xl bg-[#EFEFEF]">
              <ProductSection
                selectedMenuType={selectedMenuType}
                search={search}
                onAddProduct={handleAddProduct}
              />
            </div>
          </div>

          {/* Right column: invoice bar + order panel */}
          <div className="flex min-h-0 min-w-0 flex-col gap-3 lg:basis-[calc(36.4%-16px)]">
            <div className="flex h-auto min-h-[56px] shrink-0 items-center justify-between gap-2.5 rounded-xl bg-[#EFEFEF] px-4 py-3.5">
              <InvoiceHeader />
            </div>

            <div className="min-h-0 flex-1">
              <OrderPanel 
                cartItems={cartItems} 
                setCartItems={setCartItems} 
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                tableId={tableId}
                openTableModal={() => setIsTableModalOpen(true)}
                editingOrderId={editingOrderId}
                onClearEdit={() => setEditingOrderId(null)}
                onEditOrder={(orderId) => setEditingOrderId(orderId)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex shrink-0 items-center justify-center py-2 text-center">
        <span className="text-xs font-medium leading-none text-[#939393]">
          © 2026 F-FERM Digital Labs. All rights reserved.
        </span>
      </div>

      <TableModal 
        open={isTableModalOpen} 
        onClose={(isCancel) => {
          setIsTableModalOpen(false);
          if (isCancel && pendingProduct) {
            setPendingProduct(null);
          }
        }} 
        onSelectTable={handleTableSelection} 
      />

      <PortionChoicesModal
        open={isPortionModalOpen}
        onClose={() => {
          setIsPortionModalOpen(false);
          setPendingProduct(null);
        }}
        product={pendingProduct?.food || null}
        onAdd={handleAddPortionedItems}
      />
    </main>
  );
}