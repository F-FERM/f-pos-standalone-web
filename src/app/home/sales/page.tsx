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
import { useEffect, useState } from "react";

const fluid = {
  // sides + top only, no bottom padding, so the board sits closer to the footer
  pagePad: "px-[clamp(4px,0.7vw,10px)] pt-[clamp(4px,0.7vw,10px)] pb-0",
  boardGap: "gap-[clamp(6px,0.8vw,10px)]",
  boardPad: "p-[clamp(6px,0.8vw,10px)]",
  barMinH: "min-h-[clamp(36px,3.8vw,46px)]",
  barPadX: "px-[clamp(10px,1.2vw,16px)]",
  barPadY: "py-[clamp(4px,0.6vw,8px)]",
  leftColMinH: "min-h-[clamp(320px,46vh,460px)]",
  rightColMinH: "min-h-[clamp(280px,40vh,420px)]",
  // small fixed footer padding instead of a fluid one
  footerPadY: "pt-[2px] pb-[3px]",
  footerText: "text-[clamp(8px,0.75vw,12px)]",
};

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

  const [noTableChosen, setNoTableChosen] = useState(false);

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [invoiceTotal, setInvoiceTotal] = useState(0);

  useEffect(() => {
    setNoTableChosen(false);
    setTableId(null);
  }, [selectedType]);

  const handleAddProduct = (product: Product) => {
    const hasChoices = product.food?.choices && product.food.choices.length > 0;
    const needsPortion = product.food?.isPortionEnabled || hasChoices;


    if (!needsPortion) {
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
      return;
    }

    setPendingProduct(product);

    const isDineIn = selectedType === CustomerTypeEnum.DINE_IN;

    if (isDineIn && !tableId && !noTableChosen) {
      setIsTableModalOpen(true);
    } else {
      setIsPortionModalOpen(true);
    }
  };

  const handleTableSelection = (id: string | null) => {
    if (id !== null) {
      setTableId(id);
      setNoTableChosen(false);
      if (pendingProduct) {
        setIsPortionModalOpen(true);
      }
    } else {
      setNoTableChosen(true);
      setTableId(null);
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

      <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto md:overflow-hidden ${fluid.pagePad}`}>
        <div className={`flex min-h-0 flex-1 flex-col rounded-[15px] bg-[#D2D2D2] lg:flex-row ${fluid.boardGap} ${fluid.boardPad}`}>
       
          <div className={`flex min-w-0 flex-1 flex-col gap-2 lg:min-h-0 lg:basis-[56%] ${fluid.leftColMinH}`}>
            <div className={`flex h-auto shrink-0 flex-wrap items-center gap-2.5 rounded-xl bg-[#EFEFEF] ${fluid.barMinH} ${fluid.barPadX} ${fluid.barPadY}`}>
              <CategoryHeader
                selectedFilter={selectedMenuType}
                onSelectFilter={setSelectedMenuType}
                search={search}
                onSearchChange={setSearch}
              />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-[#EFEFEF] md:overflow-visible">
              <ProductSection
                selectedMenuType={selectedMenuType}
                search={search}
                onAddProduct={handleAddProduct}
              />
            </div>
          </div>

      
          <div className={`flex min-w-0 flex-col gap-3 lg:min-h-0 lg:basis-[44%] ${fluid.rightColMinH}`}>
            <div className={`flex h-auto shrink-0 items-center justify-between gap-2.5 rounded-xl bg-[#EFEFEF] ${fluid.barMinH} ${fluid.barPadX} ${fluid.barPadY}`}>
              <InvoiceHeader total={invoiceTotal} />
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto md:overflow-visible">
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
                onTotalChange={setInvoiceTotal}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`flex shrink-0 items-center justify-center text-center  ${fluid.footerPadY}`}>
        <span className={`font-medium leading-none text-[#939393] ${fluid.footerText}`}>
          © 2026 F-FERM Digital Labs. All rights reserved.
        </span>
      </div>

      <TableModal
        open={isTableModalOpen}
        onClose={(isCancel) => {
          setIsTableModalOpen(false);
          if (isCancel && pendingProduct) {
            setNoTableChosen(true);
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
        tableId={tableId}
      />
    </main>
  );
}