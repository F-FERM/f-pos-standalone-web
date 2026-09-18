"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddAccountModal from "./AddAccountDialogue";
import AddCustomerIcon from "../../../public/images/icons/usergroup.png";

type AccountFormActionProps = {
  isEdit: boolean;
  id?: string;
};

export function AccountFormAction({ isEdit, id }: AccountFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button
          type="button"
          variant="editicon"
          size="icon"
          aria-label="Edit account"
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
          Add Account
        </Button>
      )}

      <AddAccountModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        accountId={id}
      />
    </>
  );
}