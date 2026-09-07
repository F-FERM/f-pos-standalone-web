"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";

import FormInput from "@/src/components/form/FormInput";
import FormMultiSelectInput, {
  selectType,
} from "@/src/components/form/FormMultiSelectInput";
import { FormDatePicker } from "@/src/components/form/FormDatePicker";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

export type PortionInput = {
  name: string;
  price: number;
};

export type FoodFormValues = {
  foodName: string;
  foodImage?: string;
  foodType: "Veg" | "Non-Veg";
  menuTypes: string[];
  category: string;
  kitchen: string;
  hasPortions: boolean;
  portions: PortionInput[];
  basePrice: number;
  dineInPrice: number;
  takeAwayPrice: number;
  onlinePrice: number;
  homeDeliveryPrice: number;
  hasOffer: boolean;
  offerStartDate?: Date;
  offerEndDate?: Date;
  discountPercent: number;
  choices: string[];
  preparationTime: number;
};

export type NewFoodInput = FoodFormValues;

const emptyForm: FoodFormValues = {
  foodName: "",
  foodImage: undefined,
  foodType: "Veg",
  menuTypes: [],
  category: "",
  kitchen: "",
  hasPortions: false,
  portions: [],
  basePrice: 0,
  dineInPrice: 0,
  takeAwayPrice: 0,
  onlinePrice: 0,
  homeDeliveryPrice: 0,
  hasOffer: false,
  offerStartDate: undefined,
  offerEndDate: undefined,
  discountPercent: 0,
  choices: [],
  preparationTime: 0,
};

type AddFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: NewFoodInput) => void;
  categoryOptions: selectType[];
  menuTypeOptions: selectType[];
  kitchenOptions?: selectType[];
};

const foodTypeLabelStyle: React.CSSProperties = {
  fontFamily: "Poppins",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "100%",
  letterSpacing: "0%",
  color: "#808080",
};

export default function AddFoodModal({
  isOpen,
  onClose,
  onAdd,
  categoryOptions,
  menuTypeOptions,
  kitchenOptions = [],
}: AddFoodModalProps) {
  const methods = useForm<FoodFormValues>({ defaultValues: emptyForm });
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined,
  );
  const [createdChoices, setCreatedChoices] = useState<selectType[]>([]);

  const hasOffer = methods.watch("hasOffer");
  const hasPortions = methods.watch("hasPortions");

  const {
    fields: portionFields,
    append: appendPortion,
    remove: removePortion,
  } = useFieldArray({ control: methods.control, name: "portions" });

  const handlePortionsToggle = (checked: boolean) => {
    methods.setValue("hasPortions", checked);
    if (checked && portionFields.length === 0) {
      appendPortion({ name: "", price: 0 });
    }
  };

  const handleClose = () => {
    methods.reset(emptyForm);
    setImagePreview(undefined);
    setCreatedChoices([]);
    onClose();
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    methods.setValue("foodImage", url);
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.foodName || !values.foodName.trim()) return;

    onAdd(values);
    methods.reset(emptyForm);
    setImagePreview(undefined);
    setCreatedChoices([]);
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
          w-[812px] max-w-[calc(100vw-2rem)]
          h-[588px] max-h-[calc(100vh-2rem)]
          flex flex-col gap-[10px]
          rounded-[20px] border-[1px]
          bg-[#E9E9E9] text-black
          pt-[26px]  pb-[26px] pl-[34px]
          opacity-100 shadow-[0_0_30px_rgba(0,0,0,0.35)]
          backdrop-blur-[4px]
        "
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-white text-[#FF3B3B] shadow-lg"
          aria-label="Close food modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <DialogTitle className="text-[22px] font-semibold text-black">
          Add Food
        </DialogTitle>

        <FormProvider {...methods}>
          <div className="flex flex-1 min-h-0 flex-col gap-[16px] overflow-y-auto pr-1">
            {/* Food Name + Food Image */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormInput
                  name="foodName"
                  label="Food Name"
                  placeholder="Enter Food Name"
                  required
                />

                {/* Food Type */}
                <div className="mt-4" style={{ width: 366, height: 70 }}>
                  <label className="block text-base font-medium mb-3 text-black">
                    Food Type
                  </label>

                  <div
                    className="flex items-center justify-around gap-3"
                    style={foodTypeLabelStyle}
                  >
                    <label htmlFor="food-type-veg" className="cursor-pointer">
                      Veg
                    </label>
                    <input
                      id="food-type-veg"
                      type="radio"
                      value="Veg"
                      {...methods.register("foodType")}
                      className="h-[18px] w-[18px] appearance-none rounded-full border-2 border-[#9C9C9C] checked:border-[4px] checked:border-[#450042]"
                    />

                    <label htmlFor="food-type-nonveg" className="cursor-pointer">
                      Non-Veg
                    </label>
                    <input
                      id="food-type-nonveg"
                      type="radio"
                      value="Non-Veg"
                      {...methods.register("foodType")}
                      className="h-[18px] w-[18px] appearance-none rounded-full border-2 border-[#9C9C9C] checked:border-[4px] checked:border-[#450042]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className=" block text-base font-medium mb-3 text-black">
                  Food Image
                </label>
                <label
                  htmlFor="food-image-upload"
                  className="flex cursor-pointer items-center justify-center"
                  style={{
                    width: 118,
                    height: 118,
                    borderRadius: 7,
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "#E9E9E9",
                    background: "#D2D2D2",
                    padding: 40,
                    gap: 9,
                  }}
                >
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Food preview"
                      className="h-full w-full rounded-[4px] object-cover"
                    />
                  ) : (
                    <span className="text-xl text-[#8A8A8A]">+</span>
                  )}
                </label>
                <input
                  id="food-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                />
              </div>
            </div>

            {/* Menu Type */}
            <FormMultiSelectInput
              name="menuTypes"
              label="Menu Type"
              options={menuTypeOptions}
              placeholder="Select Or search"
              allowCreate
            />

            {/* Category + Kitchen */}
            <div className="grid grid-cols-2 gap-4">
              <FormMultiSelectInput
                name="category"
                label="Category"
                options={categoryOptions}
                placeholder="Select Or search"
              />

              <FormMultiSelectInput
                name="kitchen"
                label="Kitchen"
                options={kitchenOptions}
                placeholder="Select Or search"
              />
            </div>

            {/* Portions */}
            <div>
              <label className="mb-3 block text-base font-medium text-black">
                Portions
              </label>
              <label className="flex items-center gap-2 text-base text-[#A1A1A1]">
                <input
                  type="checkbox"
                  checked={hasPortions}
                  onChange={(e) => handlePortionsToggle(e.target.checked)}
                  className="w-4 h-4 bg-transparent border border-black"
                />
                Portions
              </label>

              {hasPortions && (
                <div className="mt-3">
                  <p className="mb-3 text-base text-[#A1A1A1]">
                    The First potion added serves as the base for the recipe
                  </p>

                  {portionFields.map((field, index) => (
                    <div key={field.id} className="mb-3 grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-base font-medium mb-3 text-black">
                          Potion name
                        </label>
                        <div className="relative">
                          <input
                            {...methods.register(`portions.${index}.name` as const)}
                            placeholder="Enter position name"
                            className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D2D2D2] px-3 py-2 text-sm text-black placeholder:text-[#8A8A8A] outline-none"
                          />
                          {index === 0 && (
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base text-[#8A8A8A]">
                              (Base potion)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-base font-medium mb-3 text-black">
                            Base Prize
                          </label>
                          <input
                            type="number"
                            {...methods.register(`portions.${index}.price` as const)}
                            className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D2D2D2] px-3 py-2 text-sm text-black outline-none"
                          />
                        </div>

                        {index === portionFields.length - 1 ? (
                          <button
                            type="button"
                            onClick={() => appendPortion({ name: "", price: 0 })}
                            className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] bg-[#D2D2D2] text-black"
                            aria-label="Add potion"
                          >
                            <Plus size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removePortion(index)}
                            className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#E0E0E0] bg-white text-[#FF3B3B]"
                            aria-label="Remove potion"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Base Price */}
            <FormInput
              name="basePrice"
              label="Base Price"
              placeholder="Enter Base Price"
              type="number"
            />

            {/* Pricing */}
            <div>
              <label className="mb-3 block text-base font-medium text-black">
                Pricing
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-gray-400 p-3">
                  <p className="mb-3 text-base font-medium text-black">
                    Dine-In
                  </p>
                  <FormInput name="dineInPrice" label="Price" type="number" labelClassName="mb-0 text-gray-500 text-sm font-medium " />
                </div>
                <div className="rounded-lg border border-gray-400 p-4">
                  <p className="mb-3 text-base font-medium text-black">
                    Take Away
                  </p>
                  <FormInput
                    name="takeAwayPrice"
                    label="Price"
                    type="number"
labelClassName="mb-0 text-gray-500 text-sm font-medium "                  />
                </div>
                <div className="rounded-lg border border-gray-400 p-4">
                  <p className="mb-3 text-base font-medium text-black">
                    Online
                  </p>
                  <FormInput
                    name="onlinePrice"
                    label="Swiggy Price"
                    type="number"
labelClassName="mb-0 text-gray-500 text-sm font-medium "                  />
                </div>
                <div className="rounded-lg border border-gray-400 p-4">
                  <p className="mb-3 text-base font-medium text-black">
                    Home Delivery
                  </p>
                  <FormInput
                    name="homeDeliveryPrice"
                    label="Price"
                    type="number"
labelClassName="mb-0 text-gray-500 text-sm font-medium "                  />
                </div>
              </div>
            </div>

            {/* Offer */}
            <label className="flex items-center gap-2 text-base font-medium text-[#A1A1A1]">
              <input
                type="checkbox"
                {...methods.register("hasOffer")}
                className="w-4 h-4 bg-transparent border border-black"
              />
              Offer
            </label>

            {hasOffer && (
              <>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                     <FormInput
                  name="startDate"
                  label="Start Date"
                  type="date"
                />
                  </div>
  <div>
                     <FormInput
                  name="endDate"
                  label="End Date"
                  type="date"
                />
                  </div>
                
                </div>

                <FormInput
                  name="discountPercent"
                  label="Discount (%)"
                  type="number"
                />
              </>
            )}

            {/* Choices */}
            <div>
              <label className="mb-1 block text-[22px] font-medium text-black">
                Choices
              </label>
              <p className="mb-3 text-sm text-[#A1A1A1]">
                Choose from different food variants or preferences.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  name="choices"
                  label="Choices"
                  placeholder="Enter Choices..."
                 
                />

                <FormInput
                  name="preparationTime"
                  label="Preparation Time (Minutes)"
                  type="number"
                  placeholder="Enter Preparation Time"
                />
              </div>
            </div>
          </div>

          <div className="flex shrink-0 justify-end pt-2">
            <Button
              type="button"
              variant="add"
              size="none"
              onClick={handleSubmit}
            >
              ADD
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}