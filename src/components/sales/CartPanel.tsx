"use client";

import Image from "next/image";
import { Minus, Plus, Users, UtensilsCrossed, X } from "lucide-react";
import { CartLine } from "./Types";

interface Props {
  lines: CartLine[];
  onQtyChange: (productId: string, delta: number) => void;
  onRemove: (productId: string) => void;
  onSave: () => void;
  onPrint: () => void;
  onCancel: () => void;
}

const VAT_RATE = 0; // wire to org tax settings

export default function CartPanel({ lines, onQtyChange, onRemove, onSave, onPrint, onCancel }: Props) {
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat;

  return (
    <div
      className="absolute top-[77px] left-[583px] w-[281px] h-[564px] rounded-[15px]
                 border border-white/10 bg-[#241423] flex flex-col overflow-hidden"
    >
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-4 py-2.5 bg-[#1C1220] text-white/50 text-xs font-medium">
        <span>Item</span>
        <span>Quantity</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Cart lines */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {lines.length === 0 && (
          <p className="text-white/30 text-xs text-center pt-6">No items yet — tap a product to add it.</p>
        )}
        {lines.map(({ product, qty }) => (
          <div key={product.id} className="flex items-center gap-2.5">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-black/20 shrink-0">
              <Image src={product.image} alt={product.name} fill sizes="40px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium leading-tight line-clamp-2">{product.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => onQtyChange(product.id, -1)}
                  className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-white"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-white text-xs w-4 text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => onQtyChange(product.id, 1)}
                  className="w-5 h-5 rounded-full bg-[#E779C1] flex items-center justify-center text-white"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-white text-xs font-semibold">₹{product.price * qty}</span>
              <button type="button" onClick={() => onRemove(product.id)} aria-label="Remove item">
                <X className="w-4 h-4 rounded-full bg-red-500 text-white p-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="px-4 pt-3 border-t border-white/10 text-sm space-y-1.5">
        <div className="flex justify-between text-white/60">
          <span>Items ({lines.length})</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>VAT({(VAT_RATE * 100).toFixed(0)}%)</span>
          <span>{vat.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-white font-bold text-base pt-1">
          <span>Total</span>
          <span>{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2 px-4 py-3">
        <button type="button" onClick={onSave} className="h-9 rounded-lg bg-emerald-500 text-white text-xs font-semibold">
          Save
        </button>
        <button type="button" onClick={onPrint} className="h-9 rounded-lg bg-white text-[#2C192B] text-xs font-semibold">
          Print
        </button>
        <button type="button" onClick={onCancel} className="h-9 rounded-lg bg-red-500 text-white text-xs font-semibold">
          Cancel
        </button>
      </div>

      {/* Bottom nav */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        <button type="button" className="flex flex-col items-center gap-1 rounded-lg bg-[#1C1220] py-2 text-white/80">
          <UtensilsCrossed className="w-4 h-4" />
          <span className="text-[10px]">Table</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 rounded-lg bg-[#1C1220] py-2 text-white/80">
          <UtensilsCrossed className="w-4 h-4" />
          <span className="text-[10px]">Order</span>
        </button>
        <button type="button" className="flex flex-col items-center gap-1 rounded-lg bg-[#1C1220] py-2 text-white/80">
          <Users className="w-4 h-4" />
          <span className="text-[10px]">Customers</span>
        </button>
      </div>
    </div>
  );
}