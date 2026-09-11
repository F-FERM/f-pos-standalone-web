"use client";

import { useEffect, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  type FieldError,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import FormInput from "@/src/components/form/FormInput";
import FormMultiSelectInput, {
  selectType,
} from "@/src/components/form/FormMultiSelectInput";
import FormCombobox from "@/src/components/form/FormCombobox";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";

// ─── Zod schema ───────────────────────────────────────────────────────────────
// Required fields: foodName, foodType, menuTypes, category, kitchen, basePrice.
// Everything else (portions, pricing, offer dates/discount, choices, prep time)
// is optional, and 0 is a valid value wherever a number field isn't required.
const portionSchema = z.object({
  name: z.string().min(1, "Portion name is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
});

const foodSchema = z
  .object({
    foodName: z
      .string()
      .min(1, "Food name is required")
      .max(150, "Food name must be 150 characters or less"),
   foodImage: z.string().nullish(),
    foodType: z.enum(["Veg", "Non-Veg"]),
    menuTypes: z.array(z.string()).min(1, "Select at least one menu type"),
    category: z.string().min(1, "Category is required"),
    kitchen: z.string().min(1, "Kitchen is required"),
    hasPortions: z.boolean(),
    portions: z.array(portionSchema),
    // basePrice: unlike z.coerce.number() alone, this rejects a blank field
    // instead of silently coercing "" -> 0. 0 typed explicitly is still valid.
    basePrice: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === "string" ? val.trim() : val))
      .refine((val) => val !== "" && val !== undefined && val !== null, {
        message: "Base price is required",
      })
      .transform((val) => Number(val))
      .refine((val) => !Number.isNaN(val), {
        message: "Base price must be a valid number",
      })
      .refine((val) => val >= 0, {
        message: "Base price must be 0 or more",
      }),
    // Keyed by customer type id — optional pricing, 0 is fine per channel.
    customerPrices: z.record(z.string(), z.coerce.number().min(0)),
    hasOffer: z.boolean(),
    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),
    discountPercent: z.coerce.number().min(0).max(100),
    choices: z.array(z.string()),
    preparationTime: z.coerce.number().min(0, "Must be 0 or more"),
  })
  // Only remaining cross-field rule: if both dates happen to be filled in,
  // keep them in order. Neither portions, nor start/end date, are required.
  .refine(
    (data) =>
      !data.hasOffer ||
      !data.startDate ||
      !data.endDate ||
      new Date(data.endDate) >= new Date(data.startDate),
    {
      message: "End date must be on or after the start date",
      path: ["endDate"],
    },
  );

export type FoodFormValues = z.infer<typeof foodSchema>;
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
  customerPrices: {},
  hasOffer: false,
  startDate: "",
  endDate: "",
  discountPercent: 0,
  choices: [],
  preparationTime: 0,
};

// One entry per customer type coming back from the customer-type API
// (e.g. { id: "6aa37e69...", label: "Take Away" }) — the Pricing section
// renders one price card per entry instead of four hardcoded channels.
export type CustomerTypeOption = {
  id: string;
  label: string;
};
type AddFoodModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: NewFoodInput, imageFile?: File) => void;
  categoryOptions: selectType[];
  menuTypeOptions: selectType[];
  kitchenOptions?: selectType[];
  customerTypeOptions: CustomerTypeOption[];
  mode?: "add" | "edit";
  initialFood?: FoodFormValues | null;
};
const foodTypeLabelStyle: React.CSSProperties = {
  fontFamily: "Poppins",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "100%",
  letterSpacing: "0%",
  color: "#808080",
};

// Small helper so we never have to `as string` a FieldError/Merge union —
// FieldError.message is already `string | undefined`, this just narrows
// the wider RHF error-shape (arrays/objects) down safely for display.
function getErrorMessage(
  error: FieldError | { message?: string } | undefined,
): string | undefined {
  return error && typeof error.message === "string" ? error.message : undefined;
}

export default function AddFoodModal({
  isOpen,
  onClose,
  onAdd,
  categoryOptions,
  menuTypeOptions,
  kitchenOptions = [],
  customerTypeOptions,
  mode = "add",
  initialFood = null,
}: AddFoodModalProps) {
  const methods = useForm<FoodFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(foodSchema) as Resolver<FoodFormValues>,
  });
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined,
  );
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [choiceInput, setChoiceInput] = useState("");

  const hasOffer = methods.watch("hasOffer");
  const hasPortions = methods.watch("hasPortions");

  const {
    fields: portionFields,
    append: appendPortion,
    remove: removePortion,
  } = useFieldArray({ control: methods.control, name: "portions" });

  // Populate the form when opening in edit mode (or reset for add),
  // same pattern as AddCategoryModal / AddMenuTypeModal. Also seeds
  // customerPrices with a 0 entry per customer type so each price
  // field starts as a controlled input instead of undefined.
  useEffect(() => {
    if (!isOpen) return;

    const defaultCustomerPrices = customerTypeOptions.reduce<Record<string, number>>(
      (acc, option) => {
        acc[option.id] = 0;
        return acc;
      },
      {},
    );

    const values: FoodFormValues =
      mode === "edit" && initialFood
        ? {
            ...initialFood,
            customerPrices: {
              ...defaultCustomerPrices,
              ...initialFood.customerPrices,
            },
          }
        : { ...emptyForm, customerPrices: defaultCustomerPrices };

    methods.reset(values);
    setImagePreview(values.foodImage ?? undefined);
    setChoiceInput("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode, initialFood, customerTypeOptions]);

  const handlePortionsToggle = (checked: boolean) => {
    methods.setValue("hasPortions", checked);
    if (checked && portionFields.length === 0) {
      appendPortion({ name: "", price: 0 });
    }
  };

  const handleClose = () => {
    methods.reset(emptyForm);
    setImagePreview(undefined);
    setImageFile(undefined);
    onClose();
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file); // keep the real file
    const url = URL.createObjectURL(file);
    setImagePreview(url); // only for on-screen preview
    // don't setValue("foodImage", url) — it's not a durable value
  };

  const handleAddChoice = () => {
    const value = choiceInput.trim();
    if (!value) return;

    const current = methods.getValues("choices") || [];
    if (current.includes(value)) {
      setChoiceInput("");
      return;
    }

    methods.setValue("choices", [...current, value]);
    setChoiceInput("");
  };

  const handleRemoveChoice = (value: string) => {
    const current = methods.getValues("choices") || [];
    methods.setValue(
      "choices",
      current.filter((choice) => choice !== value),
    );
  };

 const handleSubmit = methods.handleSubmit(
  (values) => {
    // ✅ validation passed
    onAdd(values, imageFile);
    methods.reset(emptyForm);
    setImagePreview(undefined);
    setImageFile(undefined);
  },
  (errors) => {
    // ❌ validation failed — this is where you "get" the errors
    console.log("Form validation errors:", errors);
  },
);

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
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
          aria-label="Close food modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <DialogTitle className="text-[22px] font-semibold text-black">
          {mode === "edit" ? "Edit Food" : "Add Food"}
        </DialogTitle>

        <FormProvider {...methods}>
          <div className="flex flex-1 min-h-0 flex-col gap-[10px] overflow-y-auto pr-1">
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
                    Food Type <span className="text-[#FF3B3B]">*</span>
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

                    <label
                      htmlFor="food-type-nonveg"
                      className="cursor-pointer"
                    >
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
              required
            />

            {/* Category + Kitchen */}
            <div className="grid grid-cols-2 gap-4">
              <FormCombobox
                name="category"
                label="Category"
                options={categoryOptions}
                placeholder="Select Or search"
                required
              />

              <FormCombobox
                name="kitchen"
                label="Kitchen"
                options={kitchenOptions}
                placeholder="Select Or search"
                required
              />
            </div>

            {/* Portions — fully optional, 0 price allowed */}
            <div>
              <label className="mb-3 block text-base font-medium text-black">
                Portions
              </label>
              <label className="flex items-center gap-2 text-base text-[#A1A1A1]">
                <span
                  onClick={() => handlePortionsToggle(!hasPortions)}
                  className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm border border-black ${
                    hasPortions
                      ? "border-[#450042] bg-[#450042]"
                      : "border-black bg-[#E9E9E9]"
                  }`}
                >
                  {hasPortions && (
                    <Check size={12} strokeWidth={3} className="text-white" />
                  )}
                </span>
                Portions
              </label>

              {hasPortions && (
                <div className="mt-3">
                  <p className="mb-3 text-base text-[#A1A1A1]">
                    The First potion added serves as the base for the recipe
                  </p>

                  {portionFields.map((field, index) => {
                    const rowErrors = methods.formState.errors.portions?.[index];
                    const nameErrorMessage = getErrorMessage(rowErrors?.name);
                    const priceErrorMessage = getErrorMessage(rowErrors?.price);

                    return (
                      <div key={field.id} className="mb-3 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base font-medium mb-3 text-black">
                            Potion name
                          </label>
                          <div className="relative">
                            <input
                              {...methods.register(
                                `portions.${index}.name` as const,
                              )}
                              placeholder="Enter position name"
                              className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D2D2D2] px-3 py-2 text-sm text-black placeholder:text-[#8A8A8A] outline-none"
                            />
                            {index === 0 && (
                              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-base text-[#8A8A8A]">
                                (Base potion)
                              </span>
                            )}
                          </div>
                          {nameErrorMessage && (
                            <p className="mt-1 text-sm text-[#FF3B3B]">
                              {nameErrorMessage}
                            </p>
                          )}
                        </div>

                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-base font-medium mb-3 text-black">
                              Base Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              {...methods.register(
                                `portions.${index}.price` as const,
                              )}
                              className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D2D2D2] px-3 py-2 text-sm text-black outline-none"
                            />
                            {priceErrorMessage && (
                              <p className="mt-1 text-sm text-[#FF3B3B]">
                                {priceErrorMessage}
                              </p>
                            )}
                          </div>

                          {index === portionFields.length - 1 ? (
                            <button
                              type="button"
                              onClick={() =>
                                appendPortion({ name: "", price: 0 })
                              }
                              className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] bg-[#D2D2D2] text-black"
                              aria-label="Add potion"
                            >
                              <Plus size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removePortion(index)}
                              className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B]"
                              aria-label="Remove potion"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Base Price — required, 0 allowed (but blank is rejected) */}
            <FormInput
              name="basePrice"
              label="Base Price"
              placeholder="Enter Base Price"
              type="number"
              required
            />

            {/* Pricing — optional, one card per customer type returned by the API */}
            <div>
              <label className="mb-3 block text-base font-medium text-black">
                Pricing
              </label>

              {customerTypeOptions.length === 0 ? (
                <p className="text-sm text-[#A1A1A1]">
                  No customer types available.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {customerTypeOptions.map((option) => (
                    <div
                      key={option.id}
                      className="rounded-lg border border-gray-400 p-4"
                    >
                      <p className="mb-3 text-base font-medium text-black">
                        {option.label}
                      </p>
                      <FormInput
                        name={`customerPrices.${option.id}`}
                        label="Price"
                        type="number"
                        labelClassName="mb-0 text-gray-500 text-sm font-medium "
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-base text-[#A1A1A1]">
              <span
                onClick={() =>
                  methods.setValue("hasOffer", !methods.getValues("hasOffer"))
                }
                className={`flex h-4 w-4 cursor-pointer items-center justify-center rounded-sm border border-black ${
                  hasOffer
                    ? "border-[#450042] bg-[#450042]"
                    : "border-black bg-[#E9E9E9]"
                }`}
              >
                {hasOffer && (
                  <Check size={12} strokeWidth={3} className="text-white" />
                )}
              </span>
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
                    <FormInput name="endDate" label="End Date" type="date" />
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
                <div>
                  <label className="block text-base font-medium mb-3 text-black">
                    Choices
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={choiceInput}
                      onChange={(e) => setChoiceInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddChoice();
                        }
                      }}
                      placeholder="Enter Choices..."
                      className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D2D2D2] px-3 py-2 text-sm text-black placeholder:text-[#8A8A8A] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddChoice}
                      aria-label="Add choice"
                      className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-[#D2D2D2] text-black"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {(methods.watch("choices") || []).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(methods.watch("choices") || []).map((choice) => (
                        <span
                          key={choice}
                          className="flex items-center gap-1 rounded-[6px] bg-[#9A379633] px-2 py-[3px] text-xs text-[#450042]"
                        >
                          <span className="truncate max-w-[160px]">
                            {choice}
                          </span>
                          <X
                            size={12}
                            className="cursor-pointer hover:text-red-500"
                            onClick={() => handleRemoveChoice(choice)}
                          />
                        </span>
                      ))}
                    </div>
                  )}
                </div>

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
              {mode === "edit" ? "SAVE" : "ADD"}
            </Button>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}