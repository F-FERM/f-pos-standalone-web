"use client";

import { Button } from "@/src/components/Button";
import FormInput from "@/src/components/form/FormInput";
import FormMultiSelectInput, {
  selectType,
} from "@/src/components/form/FormMultiSelectInput";
import { Check, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const COMBO_TABS = ["Add Combo", "Group Item", "Prizing"] as const;
type ComboTab = (typeof COMBO_TABS)[number];

export type ComboFormValues = {
  comboName: string;
  comboDescription: string;
  hasOffer: boolean;
  groupItems: string[];
  price: string;
};

export type NewComboInput = {
  comboName: string;
  comboDescription: string;
  groupItems: string[];
  price: number;
  foodImage?: string;
};

const emptyForm: ComboFormValues = {
  comboName: "",
  comboDescription: "",
  hasOffer: false,
  groupItems: [],
  price: "",
};

type AddComboModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (combo: NewComboInput) => void;
  foodOptions?: selectType[];
};

export default function AddComboModal({
  isOpen,
  onClose,
  onAdd,
  foodOptions = [],
}: AddComboModalProps) {
  const methods = useForm<ComboFormValues>({ defaultValues: emptyForm });
  const [activeTab, setActiveTab] = useState<ComboTab>("Add Combo");
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    methods.reset(emptyForm);
    setImagePreview(undefined);
    setActiveTab("Add Combo");
    onClose();
  };

  const handleImagePick = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const goNext = () => {
    const currentIndex = COMBO_TABS.indexOf(activeTab);
    if (currentIndex < COMBO_TABS.length - 1) {
      setActiveTab(COMBO_TABS[currentIndex + 1]);
    }
  };

  const handleSubmit = () => {
    const values = methods.getValues();
    if (!values.comboName || !values.comboName.trim()) return;

    onAdd({
      comboName: values.comboName.trim(),
      comboDescription: values.comboDescription.trim(),
      groupItems: values.groupItems,
      price: Number(values.price) || 0,
      foodImage: imagePreview,
    });

    methods.reset(emptyForm);
    setImagePreview(undefined);
    setActiveTab("Add Combo");
  };

  const isLastTab = activeTab === COMBO_TABS[COMBO_TABS.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#2C192BE5] p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div className="relative my-auto w-full max-w-[812px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute z-10 right-2 top-2 flex h-[36px] w-[36px] items-center justify-center rounded-full border border-white bg-[#2B102B]/60 text-[#FF3B3B] shadow-lg sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
            aria-label="Close combo modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div
            className="
              flex h-auto min-h-[408px] w-full flex-col gap-[10px]
              rounded-[20px] border border-[1px] border-gray-600
              bg-[#2C192BE5] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]
              sm:px-[34px] sm:py-[26px]
            "
          >
            <div className="flex flex-wrap gap-[10px]">
              {COMBO_TABS.map((tab) => {
                const selected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex h-[50px] w-[235.33px] items-center justify-center rounded-[12px] border-[1px] pl-[18px] pr-[17px] pt-[15px] pb-[14px] text-[18px] font-medium transition-colors ${
                      selected
                        ? "border-[#D4CCD4] bg-[#FFFFFF29] text-white"
                        : "border-transparent bg-black text-white"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {activeTab === "Add Combo" && (
              <>
                <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 mb-3">
                  <label className="block">
                    <FormInput name="comboName" placeholder="Enter Combo Name" label="Combo Name" />
                  </label>

                  <label className="block">
                  
                    <FormInput
                      name="comboDescription"
                      placeholder="Enter Combo Description"
                      label="Combo Description"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2">
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
                      className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] border border-gray-500 bg-[#2D2D2DAB] text-[#A1A1A1] overflow-hidden"
                    >
                      {imagePreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imagePreview}
                          alt="Combo preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ImagePlus size={22} />
                      )}
                    </button>
                  </div>

                  <label className="flex  gap-[8px] text-[16px] font-normal text-[#A1A1A1] cursor-pointer">
                <button
                  type="button"
                  onClick={() =>
                    methods.setValue("hasOffer", !methods.watch("hasOffer"))
                  }
                  aria-pressed={methods.watch("hasOffer")}
                  className="relative flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-[3px] border-[1px] border-[#FFFFFF]"
                >
                  {methods.watch("hasOffer") && (
                    <Check size={15} strokeWidth={3} className="text-white" />
                  )}
                </button>
                Offer
              </label>
                </div>
              </>
            )}

            {activeTab === "Group Item" && (
              <div className="flex h-full flex-col items-center justify-center px-[20px] pt-[30px]">
                <p className="mb-[24px] text-center text-[14px] font-normal leading-relaxed text-[#A1A1A1]">
                  Combo Items let you assign multiple food items that will be included together as a set under one combo name.
                </p>
                <FormMultiSelectInput
                  name="groupItems"
                  placeholder="Add Combo"
                  options={foodOptions}
                  showCheckbox
                  showSelectAll
                  className="mx-auto flex min-h-[54px] w-full items-center justify-center rounded-[10px] border border-[#9C9C9C] bg-[#FFFFFF2E] transition-colors hover:bg-[#FFFFFF1A] [&>div]:flex-none [&>div]:justify-center [&>svg]:hidden [&_span]:!text-[16px] [&_span]:!font-medium [&_span]:!text-white"
                />
              </div>
            )}

            {activeTab === "Prizing" && (
              <label className="block">
                <span className="mb-[6px] block text-[14px] font-medium text-white">
                  Combo Price
                </span>
                <FormInput name="price" placeholder="Enter Combo Price" />
              </label>
            )}

            <div className="mt-auto flex justify-end">
              {isLastTab ? (
                <Button
                  type="button"
                  variant="add"
                  size="none"
                  onClick={handleSubmit}
                >
                  ADD
                </Button>
              ) : (
                <Button type="button" variant="add" size="none" onClick={goNext}>
                  NEXT
                </Button>
              )}
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}