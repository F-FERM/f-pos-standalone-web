"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddUserModal from "./AddUserDialogue";
import AddUserIcon from "../../../public/images/icons/usergroup.png";

type UserFormActionProps = {
  isEdit: boolean;
  id?: string;
};

export function UserFormAction({ isEdit, id }: UserFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button
          type="button"
          variant="editicon"
          size="icon"
          aria-label="Edit user"
          onClick={() => setIsOpen(true)}
        >
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={AddUserIcon}
          iconAlt="Add user"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add User
        </Button>
      )}

      <AddUserModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        userId={id}
      />
    </>
  );
}