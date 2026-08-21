"use client";

import { useState } from "react";


import { CategorySidebar } from "./CategorySidebar";
import { Product } from "./Types";
import { products } from "./Data";

type ProductGridProps = {
  selectedProduct: Product;
  onSelect: (product: Product) => void;
};

function ProductGrid({ selectedProduct, onSelect }: ProductGridProps) {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto py-3 pr-2 pl-1 xs:py-4 xs:pr-3 sm:py-[29px] sm:pr-[27px] sm:pl-[8px]">
      <div className="grid grid-cols-2 gap-2 xs:gap-3 sm:grid-cols-3 sm:gap-[18px] lg:grid-cols-4">
        {products.map((product) => {
          const selected = selectedProduct.id === product.id;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className={`
                group
                relative
                h-[80px]
                w-full
                min-w-0
                overflow-hidden
                rounded-[6px]
                text-left
                transition-all
                duration-200
                xs:h-[90px]
                sm:h-[101px]
                ${selected ? "ring-2 ring-secondary" : "ring-1 ring-transparent"}
              `}
            >
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-[6px] xs:p-[8px]">
                <div className="flex items-end justify-between gap-1">
                  <span className="line-clamp-2 max-w-[80px] text-[11px] font-medium leading-[15px] text-white xs:text-[12px] xs:leading-[17px]">
                    {product.name}
                  </span>

                  <span className="shrink-0 text-[12px] font-semibold text-white xs:text-[14px]">
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

  return (
    <section
      className="
        relative
        flex
        h-[min(564px,calc(100vh-220px))]
        min-h-[340px]
        w-full
        min-w-0
        overflow-hidden
        rounded-[15px]
        bg-[#170716]
      "
    >
      <CategorySidebar selectedId={selectedCategory} onSelect={setSelectedCategory} />
      <ProductGrid selectedProduct={selectedProduct} onSelect={setSelectedProduct} />
    </section>
  );
}