"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listFoods, type FoodRecord } from "@/src/api/food";

import { CategorySidebar } from "./CategorySidebar";
import { Product } from "./Types";
import { PanelBackground, PanelBackgroundHandle } from "./PanelGround";
import Image from "next/image";

type ProductGridProps = {
  selectedProduct: Product;
  onSelect: (product: Product) => void;
  products: Product[];
};

function mapFoodToProduct(food: FoodRecord): Product {
  return {
    id: food._id,
    name: food.name,
    price: food.basePrice,
    image: food.foodImage || "/images/icons/butterscotch.jpg",
  };
}

function ProductGrid({
  selectedProduct,
  onSelect,
  products,
}: ProductGridProps) {
  return (
    <div className="min-w-0 flex-1 overflow-y-auto py-3 pr-0 xs:py-4 sm:py-[29px] ">
      <div
        className="mx-auto flex flex-wrap content-start justify-between "
        style={{ width: 476, rowGap: 10, height: 104 }}
      >
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
              <Image
                width={150}
                height={104}
                src={product.image}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                }}
              />

              <div
                className="absolute inset-0 flex flex-col justify-end"
                style={{
                  paddingTop: 90,
                  paddingRight: 8,
                  paddingBottom: 8,
                  paddingLeft: 9,
                }}
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
                      lineHeight: "150%",
                      letterSpacing: "5%",
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

type ProductSectionProps = {
  selectedMenuType?: string;
};

export function ProductSection({
  selectedMenuType = "All",
}: ProductSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [size, setSize] = useState({ width: 613, height: 564 });
  const foodsQuery = useQuery({
    queryKey: ["foods"],
    queryFn: listFoods,
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

  // deliberately not state: the sidebar calls this on every scroll event and
  // the notch has to move in that same frame, so it goes straight to the svg
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
      {/* single unified background shape — draws the sidebar/grid split AND the notch */}
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
            onSelect={(product) => setSelectedProductId(product.id)}
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
