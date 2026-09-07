"use client";

import FormInput from "@/src/components/form/FormInput";
import { selectType } from "@/src/components/form/FormMultiSelectInput";
import { Check, ImagePlus, Search, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  Control,
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Button } from "../ui/button";

const COMBO_TABS = ["Add Combo", "Group Item", "Prizing"] as const;
type ComboTab = (typeof COMBO_TABS)[number];

export type ComboGroupItem = {
  itemId: string;
  itemName: string;
  qty: number;
  extraPrice: number;
};

export type ComboGroupInput = {
  groupName: string;
  maxSelectable: number;
  items: ComboGroupItem[];
};

export type ComboFormValues = {
  comboName: string;
  comboDescription: string;
  hasOffer: boolean;
  groups: ComboGroupInput[];
  price: string;
};

export type NewComboInput = {
  comboName: string;
  comboDescription: string;
  groups: ComboGroupInput[];
  price: number;
  foodImage?: string;
};

const emptyForm: ComboFormValues = {
  comboName: "",
  comboDescription: "",
  hasOffer: false,
  groups: [],
  price: "",
};

const emptyGroup: ComboGroupInput = {
  groupName: "",
  maxSelectable: 1,
  items: [],
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

  const { register } = methods;

  const {
    fields: groupFields,
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({ control: methods.control, name: "groups" });

  const watchedGroups = methods.watch("groups") ?? [];

  const computedTotal = useMemo(() => {
    return watchedGroups.reduce((sum, group) => {
      const lineTotals = (group.items ?? []).map(
        (item) => (item.qty || 0) * (item.extraPrice || 0),
      );
      const highest = lineTotals.length ? Math.max(...lineTotals) : 0;
      return sum + highest;
    }, 0);
  }, [watchedGroups]);

  const hasRealGroups = watchedGroups.length > 0;

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
      groups: values.groups,
      price: Number(values.price) || 0,
      foodImage: imagePreview,
    });

    methods.reset(emptyForm);
    setImagePreview(undefined);
    setActiveTab("Add Combo");
  };

  const isLastTab = activeTab === COMBO_TABS[COMBO_TABS.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 py-6 backdrop-blur-[2px]">
      <FormProvider {...methods}>
        <div className="relative my-auto w-full max-w-[812px]">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
            aria-label="Close food modal"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          <div
            className="
              flex h-auto min-h-[408px] w-full flex-col gap-[10px]
              rounded-[20px] border border-[1px]
              bg-[#E9E9E9] px-4 py-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]
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
                        ? "border-[#D4CCD4] bg-[#450042] text-white"
                        : "border-[#D4CCD4] bg-transparent text-black"
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
                    <span className="mb-3 flex gap-2 text-base font-medium text-black">
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
                      className="flex h-[118px] w-[118px] items-center justify-center overflow-hidden rounded-[7px] border border-[#D2D2D2] bg-[#D2D2D2] p-[40px] text-[#A1A1A1]"
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

                  <div className="flex items-start">
                    <label className="flex items-center gap-[8px] cursor-pointer text-[16px] font-normal text-[#A1A1A1]">
                      <button
                        type="button"
                        onClick={() =>
                          methods.setValue("hasOffer", !methods.watch("hasOffer"))
                        }
                        aria-pressed={methods.watch("hasOffer")}
                        className="relative flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] border border-black"
                      >
                        {methods.watch("hasOffer") && (
                          <Check size={15} strokeWidth={3} className="text-white" />
                        )}
                      </button>
                      <span>Offer</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Group Item" && (
              <div className="flex flex-col gap-[6px]">
                <p className="text-center text-[14px] font-normal leading-relaxed text-[#A1A1A1]">
                  Combo Items let you assign multiple food items that will be
                  included together as a set under one combo name.
                </p>

                <button
                  type="button"
                  onClick={() => appendGroup({ ...emptyGroup })}
                  className="mx-auto flex min-h-[54px] w-full items-center justify-center rounded-[10px] border border-[#450042] bg-transparent text-[18px] font-medium text-[#450042] transition-colors hover:bg-[#45004211]"
                >
                  Add Combo
                </button>

                {groupFields.map((group, groupIndex) => (
                  <GroupCard
                    key={group.id}
                    control={methods.control}
                    groupIndex={groupIndex}
                    foodOptions={foodOptions}
                    onRemove={() => removeGroup(groupIndex)}
                  />
                ))}
              </div>
            )}

   {activeTab === "Prizing" && (
  <div className="flex flex-1 min-h-0 flex-col">
    <p
      style={{
        fontFamily: "Poppins",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: "100%",
        letterSpacing: "0%",
        textAlign: "center",
        color: "#A4A4A4",
      }}
      className="mb-[16px]"
    >
      Set a custom prize for this combo, regardless of the individual item
      prizes
    </p>

    <div
      className="mx-auto flex w-full flex-col overflow-y-auto"
      style={{
        maxWidth: 742,
        minHeight: 319,
        opacity: 1,
        gap: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#E9E9E9",
        paddingTop: 20,
        paddingRight: 34,
        paddingBottom: 20,
        paddingLeft: 34,
        background: "#E9E9E9",
        backdropFilter: "blur(4px)",
        boxShadow: "0px 0px 4px 0px #00000040",
      }}
    >
      <p
        style={{
          fontFamily: "Poppins",
          fontWeight: 600,
          fontSize: 22,
          lineHeight: "100%",
          letterSpacing: "0%",
          color: "#000000",
        }}
      >
        Items
      </p>

      <div
        className="grid grid-cols-3 mt-[10px] pb-[8px] border-b border-[#D4D4D4]"
        style={{
          fontFamily: "Poppins",
          fontWeight: 500,
          fontSize: 16,
          lineHeight: "100%",
          letterSpacing: "0%",
          color: "#787878",
        }}
      >
        <span>Food Name</span>
        <span>Portions</span>
        <span className="text-right">Total</span>
      </div>

      {hasRealGroups ? (
        watchedGroups.map((group, gIdx) => {
          const lineTotals = (group.items ?? []).map(
            (item) => (item.qty || 0) * (item.extraPrice || 0),
          );
          return (
            <div key={gIdx} className="mt-[10px]">
              <p
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: 22,
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#000000",
                }}
              >
                {group.groupName || "Unnamed Group"}
              </p>
              {(group.items ?? []).map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="grid grid-cols-3 items-center py-[6px] text-[14px] text-black"
                >
                  <span className="truncate">
                    {item.itemName} x{item.qty}
                  </span>
                  <span>—</span>
                  <span className="text-right">{lineTotals[iIdx].toFixed(2)}</span>
                </div>
              ))}
            </div>
          );
        })
      ) : (
        // Placeholder preview row shown until real group/item data exists
        <div className="mt-[10px]">
          <p
            style={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: 22,
              lineHeight: "100%",
              letterSpacing: "0%",
              color: "#000000",
            }}
          >
            Name-Group
          </p>
          <div className="grid grid-cols-3 items-center py-[6px] text-[16px] font-medium text-black">
            <span>Name x1</span>
            <span>Half</span>
            <span className="text-right">10.00</span>
          </div>
        </div>
      )}

      <input
        {...register("comboName")}
        placeholder="Name"
        className=" w-full rounded-[8px] border border-[#E9E9E9] bg-[#D9D9D9] px-3 py-2.5 text-sm text-black placeholder:text-[#8A8A8A] outline-none"
      />

      <div className="mt-[10px] flex flex-col gap-[16px] sm:flex-row sm:items-center ">
        <div className="flex w-full flex-col gap-[12px]" style={{ maxWidth: 330 }}>
          <div
            className="flex items-start"
            style={{
              width: 330,
              maxWidth: "100%",
              height: 50,
              opacity: 1,
              gap: 9,
              borderRadius: 8,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "#AEAEAE",
              paddingTop: 6,
              paddingRight: 5,
              paddingBottom: 6,
              paddingLeft: 5,
              background: "#E5E5E5",
            }}
          >
            <span
              className="flex shrink-0 items-start"
              style={{
                width: 68,
                height: 24,
                opacity: 1,
                gap: 5,
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "100%",
                letterSpacing: "0%",
                color: "#000000",
                justifyContent:"space-around"
              }}
            >
              <span
                className="mt-[4px] shrink-0"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#000000",
                }}
              />
              Note:
            </span>
            <span
              style={{
                fontFamily: "Poppins",
                fontWeight: 500,
                fontSize: 12,
                lineHeight: "150%",
                letterSpacing: "0%",
                color: "#535353",
              }}
            >
              The total reflects the height-priced item per group, not the
              full combo prize
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[22px] font-bold text-black">Total</span>
            <span className="text-[22px] font-bold text-black">
              {hasRealGroups ? computedTotal.toFixed(2) : "10.00"}
            </span>
          </div>
        </div>

        <div className="w-full sm:max-w-[280px]">
          <span className="mb-2 block text-[16px] font-semibold text-black">
            Enter combo prize
          </span>
          <div className="relative">
            <input
              {...register("price")}
              placeholder="Enter combo prize"
              className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D9D9D9] py-2.5 pl-3 pr-12 text-sm text-black placeholder:text-[#8A8A8A] outline-none"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#8A8A8A]">
              AED
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

            <div className="mt-auto flex justify-end">
              {isLastTab ? (
                <Button type="button" variant="add" size="none" onClick={handleSubmit}>
                  SUBMIT
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

type GroupCardProps = {
  control: Control<ComboFormValues>;
  groupIndex: number;
  foodOptions: selectType[];
  onRemove: () => void;
};

function GroupCard({ control, groupIndex, foodOptions, onRemove }: GroupCardProps) {
  const { register } = useFormContext<ComboFormValues>();
  const [search, setSearch] = useState("");

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({ control, name: `groups.${groupIndex}.items` });

  const selectedIds = itemFields.map((f) => f.itemId);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return foodOptions
      .filter(
        (opt) => !selectedIds.includes(opt.value) && opt.label.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [search, foodOptions, selectedIds]);

  const handlePick = (opt: selectType) => {
    appendItem({ itemId: opt.value, itemName: opt.label, qty: 1, extraPrice: 0 });
    setSearch("");
  };

  return (
    <div
      className="relative mx-auto flex w-full flex-col overflow-y-auto"
      style={{
        maxWidth: 701,
        minHeight: 342,
        opacity: 1,
        gap: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#E9E9E9",
        paddingTop: 26,
        paddingRight: 34,
        paddingBottom: 26,
        paddingLeft: 34,
        background: "#E9E9E9",
        backdropFilter: "blur(4px)",
        boxShadow: "0px 0px 4px 0px #00000040",
      }}
    >
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove group"
        className="absolute right-[16px] top-[16px] text-[#FF3B3B]"
      >
        <X size={18} strokeWidth={2.5} />
      </button>

      <label className="block">
        <span className="mb-2 block text-[16px] font-medium text-black">Group name</span>
        <input
          {...register(`groups.${groupIndex}.groupName` as const)}
          placeholder="Enter Menu Type..."
          className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D9D9D9] px-3 py-2.5 text-sm text-black placeholder:text-[#8A8A8A] outline-none"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-[16px] font-medium text-black">
          Maximum item selectable in this group
        </span>
        <input
          type="number"
          min={1}
          {...register(`groups.${groupIndex}.maxSelectable` as const, {
            valueAsNumber: true,
          })}
          className="w-full rounded-[8px] border border-[#E9E9E9] bg-[#D9D9D9] px-3 py-2.5 text-sm text-black outline-none"
        />
      </label>

      <div className="relative">
        <span className="mb-2 block text-[16px] font-medium text-black">Search</span>
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter Food Name"
            className="w-full rounded-[8px] border border-[#D4CCD4] bg-[#E5E5E5] py-2.5 pl-9 pr-3 text-sm text-black placeholder:text-[#8A8A8A] outline-none"
          />
        </div>

        {suggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[180px] overflow-y-auto rounded-[8px] border border-[#D4CCD4] bg-white shadow-lg">
            {suggestions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handlePick(opt)}
                className="block w-full px-3 py-2 text-left text-sm text-black hover:bg-[#F0EAF0]"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-[16px] font-semibold text-black">Optional Choice</p>

      <div className="grid grid-cols-3 gap-[10px] border-b border-[#C9C9C9] pb-[8px] text-[14px] font-medium text-[#8A8A8A]">
        <span>Item Name</span>
        <span className="text-center">Qty</span>
        <span className="text-center">Extra Price</span>
      </div>

      {itemFields.length === 0 ? (
        <p className="py-[16px] text-center text-[13px] text-[#A1A1A1]">
          Search and select food items to add them here.
        </p>
      ) : (
        itemFields.map((item, itemIndex) => (
          <div
            key={item.id}
            className="grid grid-cols-3 items-center gap-[10px] border-b border-[#E9E9E9] py-[10px]"
          >
            <div className="flex items-center gap-2 truncate">
              <button
                type="button"
                onClick={() => removeItem(itemIndex)}
                aria-label="Remove item"
                className="shrink-0 text-[#FF3B3B]"
              >
                <X size={14} />
              </button>
              <span className="truncate text-[14px] text-black">{item.itemName}</span>
            </div>

            <input
              type="number"
              min={0}
              {...register(`groups.${groupIndex}.items.${itemIndex}.qty` as const, {
                valueAsNumber: true,
              })}
              className="w-full rounded-[6px] border border-[#E9E9E9] bg-[#D9D9D9] px-2 py-1.5 text-center text-sm text-black outline-none"
            />

            <input
              type="number"
              min={0}
              {...register(`groups.${groupIndex}.items.${itemIndex}.extraPrice` as const, {
                valueAsNumber: true,
              })}
              className="w-full rounded-[6px] border border-[#E9E9E9] bg-[#D9D9D9] px-2 py-1.5 text-center text-sm text-black outline-none"
            />
          </div>
        ))
      )}
    </div>
  );
}