"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddTableModal, { type EditableTable } from "./AddTableModal";
import userPlus from "../../../../public/images/icons/usergroup.png";

type TableFormActionProps = { isEdit: boolean; id?: string; currentTable?: EditableTable };

export function TableFormAction({ isEdit, id, currentTable }: TableFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button type="button" variant="editicon" size="icon" aria-label="Edit table" onClick={() => setIsOpen(true)}>
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={userPlus}
          iconAlt="Add table"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add Table
        </Button>
      )}

      <AddTableModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        id={id}
        initialTable={currentTable ?? null}
      />
    </>
  );
}