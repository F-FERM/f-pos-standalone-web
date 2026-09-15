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
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import FormInput from "@/src/components/form/FormInput";
import FormMultiSelectInput from "@/src/components/form/FormMultiSelectInput";
import FormCombobox from "@/src/components/form/FormCombobox";
import { Button } from "../ui/button";


import { ListCategoryApi } from "@/src/api/category/api/GetAll";
import { ListMenuTypeApi } from "@/src/api/menu-type/api/GetAll";
import { ListCustomerTypeApi } from "@/src/api/customer-type/api/GetAll";
import { ListKitchenApi } from "@/src/api/kitchen/api/GetAll";
import { ListFoodByIdApi } from "@/src/api/food/api/GetById";
import { useAddFood } from "@/src/api/food/hooks/create.hook";
import { useUpdateFood } from "@/src/api/food/hooks/update.hook";

const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB

// ─── Zod schema ─────────────────────────────────────────────────────────────
const portionSchema = z.object({
  name: z.string().min(1, "Portion name is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
});

const foodSchema = z
  .object({
    foodName: z.string().min(1, "Food name is required").max(150),
    foodImage: z.string().nullish(),
    foodType: z.enum(["Veg", "Non-Veg"]),
    menuTypes: z.array(z.string()).min(1, "Select at least one menu type"),
    category: z.string().min(1, "Category is required"),
    kitchen: z.string().min(1, "Kitchen is required"),
    hasPortions: z.boolean(),
    portions: z.array(portionSchema),
    basePrice: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === "string" ? val.trim() : val))
      .refine((val) => val !== "" && val !== undefined && val !== null, {
        message: "Base price is required",
      })
      .transform((val) => Number(val))
      .refine((val) => !Number.isNaN(val), { message: "Base price must be a valid number" })
      .refine((val) => val >= 0, { message: "Base price must be 0 or more" }),
    customerPrices: z.record(z.string(), z.coerce.number().min(0)),
    hasOffer: z.boolean(),
    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),
    discountPercent: z.coerce.number().min(0).max(100),
    choices: z.array(z.string()),
    preparationTime: z.coerce.number().min(0, "Must be 0 or more"),
  })
  .refine(
    (data) =>
      !data.hasOffer ||
      !data.startDate ||
      !data.endDate ||
      new Date(data.endDate) >= new Date(data.startDate),
    { message: "End date must be on or after the start date", path: ["endDate"] },
  );

export type FoodFormValues = z.infer<typeof foodSchema>;

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

function formatCustomerTypeLabel(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getErrorMessage(error: FieldError | { message?: string } | undefined): string | undefined {
  return error && typeof error.message === "string" ? error.message : undefined;
}

type AddFoodDialogueProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  foodId?: string;
};

export function AddFoodDialogue({ isOpen, onClose, mode = "add", foodId }: AddFoodDialogueProps) {
  const isEdit = mode === "edit";

  const methods = useForm<FoodFormValues>({
    defaultValues: emptyForm,
    resolver: zodResolver(foodSchema) as Resolver<FoodFormValues>,
  });
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageError, setImageError] = useState<string | undefined>(undefined);
  const [choiceInput, setChoiceInput] = useState("");

  const hasOffer = methods.watch("hasOffer");
  const hasPortions = methods.watch("hasPortions");

  const {
    fields: portionFields,
    append: appendPortion,
    remove: removePortion,
  } = useFieldArray({ control: methods.control, name: "portions" });

  const onOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  // ─── Dropdown data ─────────────────────────────────────────────────────────
  const { data: categoryData } = useQuery({
    queryKey: ["getAllCategoriesForFood"],
    queryFn: () => ListCategoryApi({ search: "", page: 1, limit: 100 }),
    enabled: isOpen,
  });
  const { data: menuTypeData } = useQuery({
    queryKey: ["getAllMenuTypesForFood"],
    queryFn: () => ListMenuTypeApi({ search: "", page: 1, limit: 100 }),
    enabled: isOpen,
  });
  const { data: kitchenData } = useQuery({
    queryKey: ["getAllKitchensForFood"],
    queryFn: () => ListKitchenApi({ search: "", page: 1, limit: 100 }),
    enabled: isOpen,
  });
  const { data: customerTypeData } = useQuery({
    queryKey: ["getAllCustomerTypesForFood"],
    queryFn: () => ListCustomerTypeApi({ search: "", page: 1, limit: 100 }),
    enabled: isOpen,
  });

  const categoryOptions = (categoryData?.data || []).map((c) => ({ label: c.name, value: c._id }));
  const menuTypeOptions = (menuTypeData?.data || []).map((m) => ({ label: m.name, value: m._id }));
  const kitchenOptions = (kitchenData?.data || []).map((k) => ({ label: k.name, value: k._id }));
  const customerTypeOptions = (customerTypeData?.data || []).map((c) => ({
    id: c._id,
    label: formatCustomerTypeLabel(c.type),
  }));

  // ─── Edit-mode fetch ────────────────────────────────────────────────────────
  const { data: foodData } = useQuery({
    queryKey: ["getFoodById", foodId],
    queryFn: () => ListFoodByIdApi(String(foodId)),
    enabled: isEdit && !!foodId && isOpen,
  });

  const { mutate: addFood, isPending: isAdding } = useAddFood({ form: methods, onOpenChange });
  const { mutate: updateFood, isPending: isUpdating } = useUpdateFood({ form: methods, onOpenChange });

  useEffect(() => {
    if (!isOpen) return;

    const defaultCustomerPrices = customerTypeOptions.reduce<Record<string, number>>((acc, opt) => {
      acc[opt.id] = 0;
      return acc;
    }, {});

    if (isEdit && foodData) {
      const record = foodData.data as any;
      const customerPrices: Record<string, number> = { ...defaultCustomerPrices };
      (record.customerTypes || []).forEach((c: any) => {
        const id = c.customerTypeId?._id;
        if (id) customerPrices[id] = c.price ?? 0;
      });

      const toDateInputValue = (value?: string) => {
        if (!value) return "";
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
      };

      methods.reset({
        foodName: record.name,
        foodImage: record.foodImage ?? undefined,
        foodType: record.foodType === "VEG" ? "Veg" : "Non-Veg",
        menuTypes: record.menuTypeId?._id ? [record.menuTypeId._id] : [],
        category: record.categoryId?._id || "",
        kitchen: record.kitchenId?._id || "",
        hasPortions: Boolean(record.isPortionEnabled),
        portions: record.portions?.map((p: any) => ({ name: p.name, price: p.basePrice })) || [],
        basePrice: record.basePrice || 0,
        customerPrices,
        hasOffer: Boolean(record.isOfferEnabled),
        startDate: toDateInputValue(record.offer?.startDate),
        endDate: toDateInputValue(record.offer?.endDate),
        discountPercent: record.offer?.discount || 0,
        choices: record.choices || [],
        preparationTime: record.preparationTime || 0,
      });
      setImagePreview(record.foodImage ?? undefined);
    } else if (!isEdit) {
      methods.reset({ ...emptyForm, customerPrices: defaultCustomerPrices });
      setImagePreview(undefined);
    }
    setImageError(undefined);
    setChoiceInput("");
  }, [isOpen, isEdit, foodData, customerTypeData]);

  const handlePortionsToggle = (checked: boolean) => {
    methods.setValue("hasPortions", checked);
    if (checked && portionFields.length === 0) appendPortion({ name: "", price: 0 });
  };

  const handleClose = () => {
    methods.reset(emptyForm);
    setImagePreview(undefined);
    setImageFile(undefined);
    setImageError(undefined);
    onClose();
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError("Image must be 4MB or smaller");
      e.target.value = "";
      return;
    }

    setImageError(undefined);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(undefined);
    setImagePreview(undefined);
    setImageError(undefined);
    methods.setValue("foodImage", undefined);
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
    methods.setValue("choices", current.filter((c) => c !== value));
  };

 const handleSubmit = methods.handleSubmit(
  (values) => {
    const pendingChoice = choiceInput.trim();
    const mergedChoices =
      pendingChoice && !values.choices.includes(pendingChoice)
        ? [...values.choices, pendingChoice]
        : values.choices;

    const payload = {
      name: values.foodName.trim(),
      foodType: (values.foodType === "Veg" ? "VEG" : "NON_VEG") as "VEG" | "NON_VEG",
      menuTypeId: values.menuTypes[0] || "",
      categoryId: values.category,
      kitchenId: values.kitchen,
      isPortionEnabled: values.hasPortions,
      portions: values.hasPortions
        ? values.portions.map((p) => ({ name: p.name.trim(), basePrice: Number(p.price) || 0 }))
        : [],
      basePrice: values.basePrice,
      customerTypes: customerTypeOptions
        .map((opt) => ({ customerTypeId: opt.id, price: Number(values.customerPrices?.[opt.id]) || 0 }))
        .filter((c) => c.price > 0),
      isOfferEnabled: values.hasOffer,
      offer: values.hasOffer
        ? {
            startDate: values.startDate || "",
            endDate: values.endDate || "",
            discount: Number(values.discountPercent) || 0,
          }
        : undefined,
      choices: mergedChoices,
      preparationTime: Number(values.preparationTime) || 0,
    };

    setChoiceInput("");

    if (isEdit && foodId) {
      updateFood({ id: foodId, value: payload, imageFile });
    } else {
      addFood({ value: payload, imageFile });
    }
  },
  (errors) => {
    console.log("Form validation errors:", errors);
  },
);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div className="relative my-auto w-full max-w-[812px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-2 top-2 z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px]"
            aria-label="Close food modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div className="flex max-h-[85vh] w-full flex-col gap-[16px] overflow-y-auto rounded-[20px] border border-[#A6A6A6] bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:px-[34px]">
            <h3 className="text-[22px] font-semibold leading-none text-black">
              {isEdit ? "Edit Food" : "Add Food"}
            </h3>

            {/* Food Name + Food Image */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <FormInput name="foodName" label="Food Name" placeholder="Enter Food Name" required />

                <div className="mt-4 w-full max-w-[366px]">
                  <label className="mb-3 block text-sm font-medium text-black sm:text-base">
                    Food Type <span className="text-[#FF3B3B]">*</span>
                  </label>
                  <div className="flex flex-wrap items-center justify-start gap-3 font-['Poppins',sans-serif] text-sm text-[#808080] sm:justify-around sm:text-base">
                    <label htmlFor="food-type-veg" className="cursor-pointer">Veg</label>
                    <input
                      id="food-type-veg"
                      type="radio"
                      value="Veg"
                      {...methods.register("foodType")}
                      className="h-[18px] w-[18px] appearance-none rounded-full border-2 border-[#9C9C9C] checked:border-[4px] checked:border-[#450042]"
                    />
                    <label htmlFor="food-type-nonveg" className="cursor-pointer">Non-Veg</label>
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
                <label className="mb-3 block text-sm font-medium text-black sm:text-base">Food Image</label>

                <div className="relative h-[100px] w-[100px] sm:h-[118px] sm:w-[118px]">
                  <label
                    htmlFor="food-image-upload"
                    className={`flex h-full w-full items-center justify-center rounded-[7px] border border-[#E9E9E9] bg-[#D2D2D2] ${
                      imagePreview ? "" : "cursor-pointer"
                    }`}
                  >
                    {imagePreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imagePreview} alt="Food preview" className="h-full w-full rounded-[7px] object-cover" />
                    ) : (
                      <span className="text-xl text-[#8A8A8A]">+</span>
                    )}
                  </label>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      aria-label="Remove food image"
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-md"
                    >
                      <X size={13} strokeWidth={2.5} />
                    </button>
                  )}
                </div>

                <input
                  id="food-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImagePick}
                  disabled={Boolean(imagePreview)}
                />

                {imageError && <p className="mt-2 text-sm text-[#FF3B3B]">{imageError}</p>}
                <p className="mt-1 text-xs text-[#A1A1A1]">Max file size: 4MB</p>
              </div>
            </div>

            <FormMultiSelectInput
              name="menuTypes"
              label="Menu Type"
              options={menuTypeOptions}
              placeholder="Select Or search"
              allowCreate
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormCombobox name="category" label="Category" options={categoryOptions} placeholder="Select Or search" required />
              <FormCombobox name="kitchen" label="Kitchen" options={kitchenOptions} placeholder="Select Or search" required />
            </div>

            {/* Portions */}
            <div>
              <label className="mb-3 block text-sm font-medium text-black sm:text-base">Portions</label>
              <label className="flex items-center gap-2 text-sm text-[#A1A1A1] sm:text-base">
                <span
                  onClick={() => handlePortionsToggle(!hasPortions)}
                  className={`flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-black ${
                    hasPortions ? "border-[#450042] bg-[#450042]" : "border-black bg-[#E9E9E9]"
                  }`}
                >
                  {hasPortions && <Check size={12} strokeWidth={3} className="text-white" />}
                </span>
                Portions
              </label>

              {hasPortions && (
                <div className="mt-3">
                  <p className="mb-3 text-sm text-[#A1A1A1] sm:text-base">
                    The First potion added serves as the base for the recipe
                  </p>

                  {portionFields.map((field, index) => {
                    const rowErrors = methods.formState.errors.portions?.[index];
                    const nameErrorMessage = getErrorMessage(rowErrors?.name);
                    const priceErrorMessage = getErrorMessage(rowErrors?.price);

                    return (
                      <div key={field.id} className="mb-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-3 block text-sm font-medium text-black sm:text-base">Potion name</label>
                          <div className="relative">
                            <input
                              {...methods.register(`portions.${index}.name` as const)}
                              placeholder="Enter position name"
                              className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D2D2D2] px-3 py-2 text-sm text-black placeholder:text-[#8A8A8A] outline-none"
                            />
                            {index === 0 && (
                              <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 text-sm text-[#8A8A8A] sm:block sm:text-base">
                                (Base potion)
                              </span>
                            )}
                          </div>
                          {nameErrorMessage && <p className="mt-1 text-sm text-[#FF3B3B]">{nameErrorMessage}</p>}
                        </div>

                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="mb-3 block text-sm font-medium text-black sm:text-base">Base Price</label>
                            <input
                              type="number"
                              step="0.01"
                              {...methods.register(`portions.${index}.price` as const)}
                              className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D2D2D2] px-3 py-2 text-sm text-black outline-none"
                            />
                            {priceErrorMessage && <p className="mt-1 text-sm text-[#FF3B3B]">{priceErrorMessage}</p>}
                          </div>

                          {index === portionFields.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => appendPortion({ name: "", price: 0 })}
                              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] bg-[#D2D2D2] text-black"
                              aria-label="Add potion"
                            >
                              <Plus size={16} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removePortion(index)}
                              className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[8px] border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B]"
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

            <FormInput name="basePrice" label="Base Price" placeholder="Enter Base Price" type="number" required />

            <div>
              <label className="mb-3 block text-sm font-medium text-black sm:text-base">Pricing</label>
              {customerTypeOptions.length === 0 ? (
                <p className="text-sm text-[#A1A1A1]">No customer types available.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {customerTypeOptions.map((option) => (
                    <div key={option.id} className="rounded-lg border border-gray-400 p-4">
                      <p className="mb-3 text-sm font-medium text-black sm:text-base">{option.label}</p>
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

            <label className="flex items-center gap-2 text-sm text-[#A1A1A1] sm:text-base">
              <span
                onClick={() => methods.setValue("hasOffer", !methods.getValues("hasOffer"))}
                className={`flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-black ${
                  hasOffer ? "border-[#450042] bg-[#450042]" : "border-black bg-[#E9E9E9]"
                }`}
              >
                {hasOffer && <Check size={12} strokeWidth={3} className="text-white" />}
              </span>
              Offer
            </label>

            {hasOffer && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput name="startDate" label="Start Date" type="date" />
                  <FormInput name="endDate" label="End Date" type="date" />
                </div>
                <FormInput name="discountPercent" label="Discount (%)" type="number" />
              </>
            )}

            {/* Choices */}
            <div>
              <label className="mb-1 block text-lg font-medium text-black sm:text-[22px]">Choices</label>
              <p className="mb-3 text-sm text-[#A1A1A1]">Choose from different food variants or preferences.</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-3 block text-sm font-medium text-black sm:text-base">Choices</label>
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
                          <span className="max-w-[160px] truncate">{choice}</span>
                          <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => handleRemoveChoice(choice)} />
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <FormInput name="preparationTime" label="Preparation Time (Minutes)" type="number" placeholder="Enter Preparation Time" />
              </div>
            </div>

            <div className="mt-auto flex justify-end">
              <Button
                type="button"
                variant="add"
                size="none"
                onClick={handleSubmit}
                disabled={isEdit ? isUpdating : isAdding}
                className="w-full sm:w-auto"
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