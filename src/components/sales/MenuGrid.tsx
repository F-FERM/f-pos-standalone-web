"use client";

import Image from "next/image";
import { Product } from "./Types";

interface Props {
  products: Product[];
  onAdd: (product: Product) => void;
}

export default function MenuGrid({ products, onAdd }: Props) {
  return (
    <div className="flex-1 h-full overflow-y-auto p-4">
      <div className="grid grid-cols-3 gap-3">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => onAdd(product)}
            className="bg-[#3A2138] rounded-xl overflow-hidden text-left hover:ring-2 hover:ring-[#E779C1]/60 transition-shadow"
          >
            <div className="relative w-full h-[90px] bg-black/20">
              <Image src={product.image} alt={product.name} fill sizes="140px" className="object-cover" />
            </div>
            <div className="px-2.5 py-2 flex items-center justify-between gap-1">
              <span className="text-white text-xs font-medium leading-tight line-clamp-2">
                {product.name}
              </span>
              <span className="text-white text-xs font-semibold whitespace-nowrap">
                ₹{product.price}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}