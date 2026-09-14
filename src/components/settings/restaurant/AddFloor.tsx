"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddFloorModal from "./AddFloorModal";
import userPlus from "../../../../public/images/icons/usergroup.png";

type FloorFormActionProps = { isEdit: boolean; id?: string; currentName?: string };

export function FloorFormAction({ isEdit, id, currentName }: FloorFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button type="button" variant="editicon" size="icon" aria-label="Edit floor" onClick={() => setIsOpen(true)}>
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={userPlus}
          iconAlt="Add floor"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add Floor
        </Button>
      )}

      <AddFloorModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        id={id}
        initialFloor={currentName ?? null}
      />
    </>
  );
}