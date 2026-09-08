"use client";

import { X } from "lucide-react";
import Image from "next/image";
import changeTable from "../../../public/images/icons/changetable.png"
import noTable from "../../../public/images/icons/notable.png"
type TableModalProps = {
  open: boolean;
  onClose: () => void;
};

const legend = [
  { color: "#9F9F9F", label: "Available Table" },
  { color: "#FF7676", label: "Running Table" },
  { color: "#80C1FF", label: "Vacating Soon" },
];

export function TableModal({ open, onClose }: TableModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[2px]">
      {/* main — 812x141, top:320 left:106, radius20, bg #EFEFEF, padding 26/34, gap16 */}
      <div
        className="relative"
        style={{
          position: "absolute",
          top: 320,
          left: 106,
          width: 812,
          height: 141,
          background: "#EFEFEF",
          borderRadius: 20,
          border: "1px solid #E0E0E0",
          paddingTop: 26,
          paddingRight: 34,
          paddingBottom: 26,
          paddingLeft: 34,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* close button */}
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center"
          style={{
            position: "absolute",
            top: -14,
            right: -14,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#EFEFEF",
            border: "1px solid #FFFFFF",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            color: "#FF3B3B",
          }}
          aria-label="Close table modal"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* title */}
        <h3
          className="mb-2"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: 22,
            lineHeight: "100%",
            letterSpacing: 0,
            color: "#000000",
          }}
        >
          Change Table
        </h3>

        {/* under section — 732x38, gap 45 */}
        <div className="flex items-center" style={{ width: 732, height: 38, gap: 45 }}>
          {/* 2 buttons — 293x38, gap 12 */}
          <div className="flex shrink-0 items-center" style={{ width: 293, height: 38, gap: 12 }}>
            {/* Change Table button — 162x38 */}
            <button
              type="button"
              className="flex shrink-0 items-center justify-center text-[#000000]"
              style={{
                width: 162,
                height: 38,
                borderRadius: 7,
                border: "1px solid #9C9C9C",
                background: "#EFEFEF",
                paddingTop: 6,
                paddingRight: 10,
                paddingBottom: 6,
                paddingLeft: 10,
                gap: 9,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              <Image src={changeTable} alt="" width={15} height={15} />
              Change Table
            </button>

            {/* No Table button — 119x38 */}
            <button
              type="button"
              className="flex shrink-0 items-center justify-center text-[#000000]"
              style={{
                width: 119,
                height: 38,
                borderRadius: 7,
                border: "1px solid #9C9C9C",
                background: "#EFEFEF",
                paddingTop: 6,
                paddingRight: 10,
                paddingBottom: 6,
                paddingLeft: 10,
                gap: 9,
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              <Image src={noTable} alt="" width={15} height={15} />
              No Table
            </button>
          </div>

          {/* legend — 394x21, gap 12 */}
          <div className="flex shrink-0 items-center" style={{ width: 394, height: 21, gap: 12 }}>
            {legend.map((item) => (
              <span key={item.label} className="flex shrink-0 items-center" style={{ gap: 4 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: item.color,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: "100%",
                    letterSpacing: 0,
                    color: "#000000",
                  }}
                >
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}