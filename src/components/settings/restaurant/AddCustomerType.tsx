"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddCustomerTypeModal from "./AddCustomerTypeModal";
import userPlus from "../../../../public/images/icons/usergroup.png";

type CustomerTypeFormActionProps = {
  isEdit: boolean;
  id?: string;
  currentType?: string;
};

export function CustomerTypeFormAction({ isEdit, id, currentType }: CustomerTypeFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button
          type="button"
          variant="editicon"
          size="icon"
          aria-label="Edit customer type"
          onClick={() => setIsOpen(true)}
        >
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={userPlus}
          iconAlt="Add customer type"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add Customer Type
        </Button>
      )}

      <AddCustomerTypeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        id={id}
        initialType={currentType ?? null}
      />
    </>
  );
}