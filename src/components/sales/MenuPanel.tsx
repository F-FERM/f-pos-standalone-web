"use client";

import { useMemo, useState } from "react";
import MenuGrid from "./MenuGrid";
import { CATEGORIES, Product, PRODUCTS } from "./Types";
import CategoryRail from "./CategoryRail";

interface Props {
  search: string;
  onAdd: (product: Product) => void;
}

export default function MenuPanel({ search, onAdd }: Props) {
  const [activeCategory, setActiveCategory] = useState("scoop");

  const filtered = useMemo(() => {
    return PRODUCTS.filter(
      (p) =>
        p.categoryId === activeCategory &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [activeCategory, search]);

  return (
    <div
      className="absolute top-[77px] left-[13px] w-[550px] h-[564px] rounded-tr-[15px] rounded-br-[15px]
                 border border-white/10 bg-[#241423] flex overflow-hidden"
    >
      <CategoryRail categories={CATEGORIES} activeId={activeCategory} onSelect={setActiveCategory} />
      <MenuGrid products={filtered} onAdd={onAdd} />
    </div>
  );
}