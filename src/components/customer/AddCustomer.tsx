"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddCustomerModal from "./AddCustomerDialogue";
import AddCustomerIcon from "../../../public/images/icons/usergroup.png";

type CustomerFormActionProps = {
  isEdit: boolean;
  id?: string;
};

export function CustomerFormAction({ isEdit, id }: CustomerFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button
          type="button"
          variant="editicon"
          size="icon"
          aria-label="Edit customer"
          onClick={() => setIsOpen(true)}
        >
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={AddCustomerIcon}
          iconAlt="Add customer"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add Customer
        </Button>
      )}

      <AddCustomerModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        customerId={id}
      />
    </>
  );
}