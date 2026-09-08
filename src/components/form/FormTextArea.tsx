"use client";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { cn } from "@/src/lib/utils";

interface FormTextAreaProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxLength?: number;
  required?: boolean;
  readOnly?: boolean;
}

const FormTextArea = ({
  name,
  label,
  placeholder,
  className,
  value,
  onChange,
  readOnly,
  maxLength = 255,
  required = false,
}: FormTextAreaProps) => {
  const { control, watch } = useFormContext();
  const fieldValue = watch(name) || value || "";
  const currentLength = fieldValue.length;

  return (
    <div className="w-full">
      {label && (
        <label className="flex gap-2 text-base font-medium mb-3 text-black">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative w-full max-w-[742px]">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              readOnly={readOnly}
              placeholder={placeholder}
              className={cn(
                "min-h-[100px] resize-none w-full box-border rounded-[7px] !border !border-[#D2D2D2]",
                "bg-[#D2D2D2] text-gray-500 placeholder:text-[#797979]",
                "font-poppins font-normal text-sm leading-[100%] tracking-normal",
                "px-[20px] py-3 pb-8",
                "opacity-100",
                "transition-all duration-200",
                "focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-0",
                "disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-300",
                className
              )}
              value={fieldValue}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e);
              }}
              maxLength={maxLength}
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
              }}
            />
          )}
        />
        <div className="absolute bottom-3 right-3 text-xs text-[#797979] bg-[#D2D2D2] px-2 py-0.5 rounded-[6px] border border-[#C4C4C4] font-poppins">
          {currentLength} / {maxLength}
        </div>
      </div>
    </div>
  );
};

export default FormTextArea;