"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";

export type ComboPortionOption = {
  id: string;
  label: string; // e.g. "half", "full"
  price: number;
};

export type ComboPortionItem = {
  name: string; // e.g. "VEG"
  image?: string;
  choiceLabel?: string; // renders as "Choices: {choiceLabel}"
  portions: ComboPortionOption[];
};

type CreateNewComboModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payload: { image?: string; portionId: string }) => void;
  item: ComboPortionItem;
};

export default function CreateNewComboModal({
  isOpen,
  onClose,
  onAdd,
  item,
}: CreateNewComboModalProps) {
  const [image, setImage] = useState<string | undefined>(item.image);
  const [selectedPortionId, setSelectedPortionId] = useState<string | undefined>(
    item.portions[0]?.id,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImagePick = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!selectedPortionId) return;
    onAdd({ image, portionId: selectedPortionId });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto  p-4 py-6 backdrop-blur-[2px]">
      <div className="relative my-auto w-full max-w-[812px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-[-18px] top-[-18px] z-10 flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg"
          aria-label="Close combo modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <div
          className="flex w-full flex-col"
          style={{
            minHeight: 345,
            gap: 5,
            borderRadius: 20,
            border: "1px solid #A6A6A6",
            background: "#E9E9E9",
            paddingTop: 26,
            paddingRight: 34,
            paddingBottom: 26,
            paddingLeft: 34,
            backdropFilter: "blur(4px)",
          }}
        >
          <h2
            style={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: 24,
              lineHeight: "100%",
              color: "#000000",
            }}
          >
            Create New Combo
          </h2>
          <p
            style={{
              fontFamily: "Poppins",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: "100%",
              color: "#A4A4A4",
              marginTop: 6,
              marginBottom: 20,
            }}
          >
            Bundle food items based on portion sizes for custom combos
          </p>

          <div className="flex items-start" style={{ gap: 12 }}>
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
              className="flex shrink-0 items-center justify-center overflow-hidden rounded-[7px] border border-[#D2D2D2] bg-[#D2D2D2] text-[#A1A1A1]"
              style={{ width: 118, height: 117 }}
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="Combo preview" className="h-full w-full object-cover" />
              ) : (
                <ImagePlus size={22} />
              )}
            </button>

            <div className="flex flex-col gap-3" >
              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: "100%",
                  color: "#000000",
                }}
              >
                Name
              </span>
              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "100%",
                  color: "#A4A4A4",
                }}
              >
                {item.name}
              </span>
              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: "100%",
                  color: "#000000",
                  marginTop: 8,
                }}
              >
                Choices: {item.choiceLabel ?? "Name"}
              </span>
              <span
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: "100%",
                  color: "#000000",
                  marginTop: 4,
                }}
              >
                Select Portion
              </span>
            </div>
          </div>

          <div className="mt-[16px] flex flex-col" style={{ gap: 5 }}>
            <div
              className="flex items-center"
              style={{ width: "100%", maxWidth: 742, justifyContent: "space-between" }}
            >
              <span
              className="mb-2"
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "100%",
                  color: "#A4A4A4",
                }}
              >
                Portion
              </span>
              <span
              className="mb-2"
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "100%",
                  color: "#A4A4A4",
                }}
              >
                Prize
              </span>
            </div>

            {item.portions.map((portion) => (
              <div
                key={portion.id}
                className="flex items-center"
                style={{ width: "100%", maxWidth: 742,  justifyContent: "space-between" }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedPortionId(portion.id)}
                  className="flex items-center gap-[10px]"
                >
                  <span
                    aria-pressed={selectedPortionId === portion.id}
                    className="relative flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-black"
                  >
                    {selectedPortionId === portion.id && (
                      <span className="h-[9px] w-[9px] rounded-full bg-black" />
                    )}
                  </span>
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: "100%",
                      color: "#000000",
                    }}
                  >
                    {portion.label}
                  </span>
                </button>
                <span
                  style={{
                    fontFamily: "Poppins",
                    fontWeight: 600,
                    fontSize: 16,
                    lineHeight: "100%",
                    color: "#000000",
                  }}
                >
                  {portion.price}AED
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex justify-end pt-[16px]">
            <Button
              type="button"
              variant={"add"}
              onClick={handleAdd}
             
            >
              ADD
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
