"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import type { selectType } from "@/src/components/form/FormCombobox";
import AddPrinterModal, { NewPrinterInput } from "./AddPrinterModal";
import userPlus from "../../../../public/images/icons/usergroup.png";

type PrinterFormActionProps = {
  isEdit: boolean;
  id?: string;
  currentPrinter?: NewPrinterInput | null;
  kitchenOptions: selectType[];
  customerTypeOptions: selectType[];
};

export function PrinterFormAction({
  isEdit,
  id,
  currentPrinter,
  kitchenOptions,
  customerTypeOptions,
}: PrinterFormActionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isEdit ? (
        <Button
          type="button"
          variant="editicon"
          size="icon"
          aria-label="Edit printer"
          onClick={() => setIsOpen(true)}
        >
          <Pencil size={15} />
        </Button>
      ) : (
        <Button
          variant="addcustomer"
          size="none"
          iconSrc={userPlus}
          iconAlt="Add printer"
          onClick={() => setIsOpen(true)}
          className="w-full justify-center sm:w-auto"
        >
          Add Printer
        </Button>
      )}

      <AddPrinterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={isEdit ? "edit" : "add"}
        id={id}
        initialPrinter={currentPrinter ?? null}
        kitchenOptions={kitchenOptions}
        customerTypeOptions={customerTypeOptions}
      />
    </>
  );
}