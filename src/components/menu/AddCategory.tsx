"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddCategoryModal from "./AddCategoryModal";
import userPlus from "../../../public/images/icons/usergroup.png";

type CategoryFormActionProps = { isEdit: boolean; id?: string; currentName?: string };

export function CategoryFormAction({ isEdit, id, currentName }: CategoryFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button type="button" variant="editicon" size="icon" aria-label="Edit category" onClick={() => setIsOpen(true)}>
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={userPlus}
          iconAlt="Add category"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add Category
        </Button>
      )}

      <AddCategoryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        id={id}
        initialName={currentName ?? null}
      />
    </>
  );
}