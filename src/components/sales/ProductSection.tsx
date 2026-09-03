"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { CategorySidebar } from "./CategorySidebar";
import { Product } from "./Types";
import { products } from "./Data";
import { PanelBackground } from "./PanelGround";

type ProductGridProps = {
  selectedProduct: Product;
  onSelect: (product: Product) => void;
};

function ProductGrid({ selectedProduct, onSelect }: ProductGridProps) {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto py-3 pr-2 pl-1 xs:py-4 xs:pr-3 sm:py-[29px] ">
      <div className="mx-auto flex flex-wrap content-start justify-between" style={{ width: 476, rowGap: 10 }}>
        {products.map((product) => {
          const selected = selectedProduct.id === product.id;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              style={{
                width: 150,
                height: 104,
                borderRadius: 5,
                border: `3px solid ${selected ? "#670063" : "#565656"}`,
              }}
              className="group relative shrink-0 overflow-hidden text-left"
            >
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                }}
              />

              <div
                className="absolute inset-0 flex flex-col justify-end"
                style={{ paddingTop: 90, paddingRight: 8, paddingBottom: 8, paddingLeft: 9 }}
              >
                <div
                  className="flex items-end justify-between gap-1"
                  style={{ width: 127, minHeight: 39 }}
                >
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: 12,
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      overflow: "visible",
                    }}
                  >
                    {product.name}
                  </span>

                  <span
                    className="shrink-0 text-white"
                    style={{
                      fontFamily: "Inter",
                      fontWeight: 600,
                      fontSize: 14,
                      lineHeight: "100%",
                      letterSpacing: "0%",
                    }}
                  >
                    ₹{product.price}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ProductSection() {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [selectedCategory, setSelectedCategory] = useState(4);
  const [notchCenterY, setNotchCenterY] = useState(267.5);
  const [size, setSize] = useState({ width: 613, height: 564 });

  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-full w-full min-w-0 overflow-hidden rounded-[15px]"
    >
      {/* single unified background shape — draws the sidebar/grid split AND the notch */}
      <PanelBackground width={size.width} height={size.height} notchCenterY={notchCenterY} fill="#D2D2D2" />

      <div className="relative z-10 flex h-full w-full">
        <CategorySidebar
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
          onSelectedCenterChange={setNotchCenterY}
        />
        <ProductGrid selectedProduct={selectedProduct} onSelect={setSelectedProduct} />
      </div>
    </section>
  );
}