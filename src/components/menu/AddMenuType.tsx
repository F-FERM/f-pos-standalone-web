"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddMenuTypeModal from "./AddMenuTypeModal";
import userPlus from "../../..//public/images/icons/usergroup.png";

type MenuTypeFormActionProps = { isEdit: boolean; id?: string; currentName?: string };

export function MenuTypeFormAction({ isEdit, id, currentName }: MenuTypeFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button type="button" variant="editicon" size="icon" aria-label="Edit menu type" onClick={() => setIsOpen(true)}>
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={userPlus}
          iconAlt="Add menu type"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add Menu Type
        </Button>
      )}

      <AddMenuTypeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        id={id}
        initialName={currentName ?? null}
      />
    </>
  );
}