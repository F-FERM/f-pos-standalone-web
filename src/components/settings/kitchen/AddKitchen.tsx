"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddKitchenIcon from "../../../../public/images/icons/usergroup.png";
import AddKitchenModal from "./AddKitchenModal";

type KitchenFormActionProps = {
  isEdit: boolean;
  id?: string;
};

export function KitchenFormAction({ isEdit, id }: KitchenFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button
          type="button"
          variant="editicon"
          size="icon"
          aria-label="Edit kitchen"
          onClick={() => setIsOpen(true)}
        >
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={AddKitchenIcon}
          iconAlt="Add kitchen"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add Kitchen
        </Button>
      )}

      <AddKitchenModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        kitchenId={id}
      />
    </>
  );
}