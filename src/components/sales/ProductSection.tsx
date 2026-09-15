"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CategorySidebar } from "./CategorySidebar";
import { Product } from "./Types";
import { PanelBackground, PanelBackgroundHandle } from "./PanelGround";
import Image from "next/image";
import { Food } from "@/src/interfaces/food/ListFoodResponse";
import { ListFoodApi } from "@/src/api/food/api/GetAll";

type ProductGridProps = {
  selectedProduct: Product;
  onSelect: (product: Product) => void;
  products: Product[];
};

function mapFoodToProduct(food: Food): Product {
  return {
    id: food._id,
    name: food.name,
    price: food.basePrice,
    image: food.foodImage || "/images/icons/butterscotch.jpg",
  };
}

function ProductGrid({ selectedProduct, onSelect, products }: ProductGridProps) {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto py-3 pr-0 xs:py-4 sm:py-[29px]">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,150px))] content-start justify-start gap-2.5">
        {products.map((product) => {
          const selected = selectedProduct.id === product.id;

          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className={`group relative h-[104px] w-full shrink-0 overflow-hidden rounded-[5px] border-[3px] text-left ${
                selected ? "border-[#670063]" : "border-[#565656]"
              }`}
            >
              <Image
                width={150}
                height={104}
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${product.image}`}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_100%)]" />

              <div className="absolute inset-0 flex flex-col justify-end pb-2 pl-[9px] pr-2 pt-[90px]">
                <div className="flex min-h-[39px] w-[127px] items-end justify-between gap-1">
                  <span className="font-['Poppins'] text-xs font-medium leading-[1.5] tracking-wide text-white [word-break:break-word]">
                    {product.name}
                  </span>
                  <span className="shrink-0 text-sm font-semibold leading-none text-white">
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

type ProductSectionProps = {
  selectedMenuType?: string;
  search?: string;
  onAddProduct?: (product: Product) => void;
};

export function ProductSection({
  selectedMenuType = "All",
  search = "",
  onAddProduct,
}: ProductSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [size, setSize] = useState({ width: 613, height: 564 });

  const foodsQuery = useQuery({
    queryKey: ["getAllFoods", search],
    queryFn: () => ListFoodApi({ search, page: 1, limit: 100 }),
  });

  const filteredFoods = (foodsQuery.data?.data || []).filter((food) => {
    const matchesCategory =
      !selectedCategory || food.categoryId._id === selectedCategory;
    const matchesMenuType =
      selectedMenuType === "All" || food.menuTypeId.name === selectedMenuType;

    return matchesCategory && matchesMenuType;
  });
  const products = filteredFoods.map(mapFoodToProduct);
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) || products[0];

  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<PanelBackgroundHandle>(null);

  const handleNotchCenterChange = useCallback((centerY: number) => {
    panelRef.current?.setNotchCenterY(centerY);
  }, []);

  useLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const update = () =>
      setSize({ width: el.clientWidth, height: el.clientHeight });
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
      <PanelBackground
        ref={panelRef}
        width={size.width}
        height={size.height}
        defaultNotchCenterY={267.5}
        fill="#D2D2D2"
      />

      <div className="relative z-10 flex h-full w-full">
        <CategorySidebar
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
          onSelectedCenterChange={handleNotchCenterChange}
        />
        {selectedProduct ? (
          <ProductGrid
            products={products}
            selectedProduct={selectedProduct}
            onSelect={(product) => {
              setSelectedProductId(product.id);
              if (onAddProduct) onAddProduct(product);
            }}
          />
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-center text-sm text-[#5D5D5D]">
            No products available
          </div>
        )}
      </div>
    </section>
  );
}