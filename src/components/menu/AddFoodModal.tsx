"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/src/components/Button";
import FormCombobox, { selectType } from "@/src/components/form/FormCombobox";
import FormMultiSelectInput from "@/src/components/form/FormMultiSelectInput";
import FormInput from "@/src/components/form/FormInput";
import { Check, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

export type FoodType = "Veg" | "Non-Veg";

export type FoodFormValues = {
  foodName: string;
  foodType: FoodType;
  menuTypes: string[];
  category: string;
  kitchen: string;
  hasPortions: boolean;
  basePrice: string;
  hasOffer: boolean;
  choices: string;
  prepTime: string;
};

export type NewFoodInput = {
  foodName: string;
  foodType: FoodType;
  menuTypes: string[];
  category: string;
  kitchen: string;
  basePrice: number;
  foodImage?: string;
  choices?: string;
  prepTimeMinutes?: number;
};

const emptyForm: FoodFormValues = {
  foodName: "",
  foodType: "Veg",
  menuTypes: [],
  category: "",
  kitchen: "",
  hasPortions: false,
  basePrice: "",
  hasOffer: false,
  choices: "",
  prepTime: "",
};

type AddFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (food: NewFoodInput) => void;
  categoryOptions?: selectType[];
  menuTypeOptions?: selectType[];
  kitchenOptions?: selectType[];
};

export default function AddFoodModal({
  isOpen,
  onClose,
  onAdd,
  categoryOptions = [],
  menuTypeOptions = [],
  kitchenOptions = [],
}: AddFoodModalProps) {
  const methods = useForm<FoodFormValues>({ defaultValues: emptyForm });
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    methods.reset(emptyForm);
    setImagePreview(undefined);
    onClose();
  };

  const handleImagePick = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.foodName || !values.foodName.trim()) return;

    onAdd({
      foodName: values.foodName.trim(),
      foodType: values.foodType,
      menuTypes: values.menuTypes,
      category: values.category,
      kitchen: values.kitchen,
      basePrice: Number(values.basePrice) || 0,
      foodImage: imagePreview,
      choices: values.choices.trim(),
      prepTimeMinutes: Number(values.prepTime) || 0,
    });

    methods.reset(emptyForm);
    setImagePreview(undefined);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="
          w-full max-w-[812px] p-0
          rounded-[20px] border border-gray-600 border-[1px]
          bg-[#2C192BE5] text-white
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)] 
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg"
          aria-label="Close add food modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div className="max-h-[90dvh] overflow-y-auto flex flex-col gap-[10px] px-4 py-5 sm:px-[34px] sm:py-[26px] rounded-[20px]">
          <DialogTitle className="text-[20px] sm:text-[22px] font-semibold text-white mb-3">
            Add Food
          </DialogTitle>

          <FormProvider {...methods}>
            <div className="space-y-[20px]">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-[16px]">
                <div className="flex flex-col gap-[20px]">
                  <label className="block">
                    <FormInput
                      name="foodName"
                      label="Food Name"
                      placeholder="Enter Food Name"
                    />
                  </label>

                  <div>
                    <span className="flex gap-2 text-base font-medium mb-3 text-white">
                      Food Type
                    </span>
                    <div className="flex flex-wrap items-center gap-[30px]">
                      {(["Veg", "Non-Veg"] as FoodType[]).map((type) => {
                        const isChecked = methods.watch("foodType") === type;
                        return (
                          <label
                            key={type}
                            className="flex w-[120px] items-center justify-between text-[16px] font-normal text-[#A1A1A1] cursor-pointer"
                          >
                            {type}
                            <div
                              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                                isChecked ? "border-[#9A3796]" : "border-[#A1A1A1]"
                              }`}
                            >
                              {isChecked && (
                                <div className="h-[10px] w-[10px] rounded-full bg-[#9A3796]" />
                              )}
                            </div>
                            <input
                              type="radio"
                              value={type}
                              checked={isChecked}
                              onChange={() => methods.setValue("foodType", type)}
                              className="hidden"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="flex gap-2 text-base font-medium mb-3 text-white">
                    Food Image
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImagePick(e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[118px] w-[118px] items-center justify-center gap-[9px] rounded-[7px] border-[1px] border-[#6B6B6B] bg-[#2D2D2DAB] p-[40px] text-[#A1A1A1] overflow-hidden"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Food preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImagePlus size={22} />
                    )}
                  </button>
                </div>
              </div>

              <label className="block">
                <FormMultiSelectInput
                  name="menuTypes"
                  placeholder="Select Or search"
                  options={menuTypeOptions}
                  allowCreate
                  className="w-full"
                  label="Menu Type"
                />
              </label>

              <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
                <label className="block">
                  <FormCombobox
                    name="category"
                    placeholder="Select Or search"
                    options={categoryOptions}
                    label="Category"
                  />
                </label>

                <label className="block">
                  <FormCombobox
                    name="kitchen"
                    placeholder="Select Or search"
                    options={kitchenOptions}
                    label="Kitchen"
                  />
                </label>
              </div>

              <div>
                <span className="mb-[10px] block text-[16px] font-medium text-white ">
                  Portions
                </span>
                <label className="flex items-center gap-[8px] text-[14px] text-white cursor-pointer">
                  <button
                    type="button"
                    onClick={() =>
                      methods.setValue("hasPortions", !methods.watch("hasPortions"))
                    }
                    aria-pressed={methods.watch("hasPortions")}
                    className="relative flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border-[1px] border-[#FFFFFF]"
                  >
                    {methods.watch("hasPortions") && (
                      <Check size={10} strokeWidth={3} className="text-white" />
                    )}
                  </button>
                  Portions
                </label>
              </div>

              <label className="block">
                <FormInput name="basePrice" placeholder="Enter Base Price" label="Base Price" />
              </label>

              <label className="flex items-center gap-[8px] text-[14px] text-white cursor-pointer">
                <button
                  type="button"
                  onClick={() =>
                    methods.setValue("hasOffer", !methods.watch("hasOffer"))
                  }
                  aria-pressed={methods.watch("hasOffer")}
                  className="relative flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border-[1px] border-[#FFFFFF]"
                >
                  {methods.watch("hasOffer") && (
                    <Check size={10} strokeWidth={3} className="text-white" />
                  )}
                </button>
                Offer
              </label>

              <div>
                <span className="mb-[6px] block text-[18px] sm:text-[20px] font-semibold text-white">
                  Choices
                </span>
                <p className="mb-[12px] text-[13px] font-normal text-[#A1A1A1]">
                  Choose from different food variants or preferences.
                </p>
                <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
                  <label className="block">
                    <FormInput name="choices" placeholder="Enter Choices..." label="Choices" />
                  </label>

                  <label className="block">
                    <FormInput
                      name="prepTime"
                      placeholder="Enter Preparation Time"
                      label="Preparation Time (Minutes)"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="add" size="none" onClick={handleSubmit}>
                  ADD
                </Button>
              </div>
            </div>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}