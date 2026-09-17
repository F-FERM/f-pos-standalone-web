"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import userPlus from "../../../public/images/icons/usergroup.png";
import { AddFoodDialogue } from "./AddFoodModal";

type FoodFormActionProps = {
  isEdit: boolean;
  id?: string;
};

export function FoodFormAction({ isEdit, id }: FoodFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button
          type="button"
          variant="editicon"
          size="icon"
          aria-label="Edit food"
          onClick={() => setIsOpen(true)}
        >
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={userPlus}
          iconAlt="Add food"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add Food
        </Button>
      )}

      <AddFoodDialogue
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        foodId={id}
      />
    </>
  );
}