"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { X } from "lucide-react";

import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import FormInput from "@/src/components/form/FormInput";
import { Button } from "../../ui/button";
import { useAddTable } from "@/src/api/table/hooks/create.hook";
import { useUpdateTable } from "@/src/api/table/hooks/update.hook";
import { useQuery } from "@tanstack/react-query";
import { ListFloorApi } from "@/src/api/floor/api/GetAll";
import { ListTableByIdApi } from "@/src/api/table/api/GetById";

const schema = z.object({
  floor: z.string().min(1, "Please select a floor"),
  tableName: z.string().min(1, "Table name is required").max(100),
  capacity: z
    .number({ error: "Capacity must be a number" })
    ,
  
});

export type TableFormValues = z.infer<typeof schema>;

const emptyForm: TableFormValues = { floor: "", tableName: "", capacity: 0 };

export type EditableTable = { floor: string; tableName: string; capacity: number };

type AddTableModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  id?: string;
  initialTable?: EditableTable | null;
};

export default function AddTableModal({
  isOpen,
  onClose,
  mode = "add",
  id,
  initialTable = null,
}: AddTableModalProps) {
  const isEdit = mode === "edit";
  const form = useForm<TableFormValues>({ defaultValues: emptyForm, resolver: zodResolver(schema) });
  const onOpenChange = (open: boolean) => { if (!open) onClose(); };
const [search,setSearch]=useState("")
 
  const { mutate: addTable, isPending: isAdding } = useAddTable({ form,onOpenChange });
  const { mutate: updateTable, isPending: isUpdating } = useUpdateTable({ form,onOpenChange });
  const { data: floorListData, isLoading: isFloorListLoading } = useQuery({
    queryKey: ["getAllFloors", search],
    queryFn: () =>
      ListFloorApi({
        search,
        page: 1,
        limit: 100,
      }),
  });
  const { data: tableListData, isLoading: isTableListLoading } = useQuery({
    queryKey: ["getTableById", id],
    queryFn: () =>
      ListTableByIdApi(String(id)),
  });
  const floorOptions: selectType[] = (floorListData?.data ?? []).map((floor) => ({
    label: floor.name,
    value: floor._id,
  }));

  useEffect(() => {
    if (!isOpen) return;
    form.reset(
      initialTable
        ? {
            floor: initialTable.floor,
            tableName: initialTable.tableName,
            capacity: (initialTable.capacity),
          }
        : emptyForm,
    );
  }, [initialTable, isOpen, form]);

  if (!isOpen) return null;

  const handleClose = () => {
    form.reset(emptyForm);
    onClose();
  };

  const handleSubmit = form.handleSubmit((values) => {
    const payload = {
      floorId: values.floor,
      name: values.tableName.trim(),
      capacity: Number(values.capacity) || 0,
    };

    if (isEdit && id) {
      updateTable({ id, value:payload });
    } else {
      addTable(payload);
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...form}>
        <div className="relative my-auto w-full max-w-[812px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-2 top-2 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px]"
            aria-label="Close table modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex min-h-[420px] w-full flex-col gap-[16px] rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <h3 className=" text-[22px] font-semibold leading-none text-black">
              {isEdit ? "Edit Table" : "Add Table"}
            </h3>

            <div className="flex w-full flex-col gap-[10px] rounded-[10px] border border-[#B5B5B5] bg-[#E9E9E9] p-2.5 sm:max-w-[742px]">
              <label className="block">
                <FormCombobox
                  name="floor"
                  placeholder={isFloorListLoading ? "Loading floors..." : "Select Or Search"}
                  options={floorOptions}
                  label="Floor"
                  required
                  valueLabel={tableListData?.data?.floorId?.name}
                />
              </label>

              <label className="block">
                <FormInput name="tableName" placeholder="Enter Table" label="Table" required/>
              </label>

              <label className="block">
                <FormInput name="capacity" type="number" placeholder="Enter Capacity" label="Capacity" required />
              </label>
            </div>

            <div className="mt-auto flex justify-end">
              <Button
                type="button"
                variant="add"
                size="none"
                onClick={handleSubmit}
                disabled={isEdit ? isUpdating : isAdding}
              >
                {isEdit ? "SAVE" : "ADD"}
              </Button>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}