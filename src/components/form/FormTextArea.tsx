import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
        <label className="text-base font-medium block mb-2 text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative w-full">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              readOnly={readOnly}
              placeholder={placeholder}
              className={cn(
                "min-h-[100px] resize-none w-full box-border rounded-[7px] border border-[#A1A1A1]",
                "bg-[#1C1C1C] text-[#A1A1A1] placeholder:text-[#A1A1A1]",
                "font-poppins font-normal text-sm leading-[100%] tracking-normal",
                "px-5 py-1.5 pb-6",
                "transition-all duration-200",
                "focus-visible:ring-1 focus-visible:ring-[#A1A1A1] focus-visible:ring-offset-0",
                "disabled:border-gray-700 disabled:bg-[#141414] disabled:text-gray-600",
                className,
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
        <div className="absolute bottom-3 right-3 text-xs text-[#A1A1A1] bg-[#1C1C1C] px-1 font-poppins">
          {currentLength} / {maxLength}
        </div>
      </div>
    </div>
  );
};

export default FormTextArea;
