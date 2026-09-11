"use client";

import { useState } from "react";
import CreateNewComboModal, { ComboPortionItem } from "./CreateNewComboModal";


export default function MenuItemCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Replace with real data — e.g. fetched from your food/combo item API
  const comboItem: ComboPortionItem = {
    name: "VEG",
    choiceLabel: "Name",
    portions: [
      { id: "half", label: "half", price: 10 },
      // add more, e.g. { id: "full", label: "full", price: 18 },
    ],
  };

  const handleAddCombo = (payload: { image?: string; portionId: string }) => {
    const selected = comboItem.portions.find((p) => p.id === payload.portionId);
    console.log("Adding to order:", {
      name: comboItem.name,
      portion: selected?.label,
      price: selected?.price,
      image: payload.image,
    });

    // e.g. dispatch to cart / call your addToCart API here

    setIsModalOpen(false);
  };

  return (
    <>
      <button type="button" onClick={() => setIsModalOpen(true)}>
        Open Combo
      </button>

      <CreateNewComboModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddCombo}
        item={comboItem}
      />
    </>
  );
}
