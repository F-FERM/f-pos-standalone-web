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
                "min-h-[100px] resize-none w-full box-border rounded-[7px] !border !border-gray-500",
                "bg-[#2D2D2DAB] text-[#E6D6E8] placeholder:text-[#A1A1A1]",
                "font-poppins font-normal text-sm leading-[100%] tracking-normal",
                "px-[20px] py-3 pb-8",
                "opacity-100",
                "transition-all duration-200",
                "focus-visible:ring-1 focus-visible:ring-gray-700 focus-visible:ring-offset-0",
                "disabled:border-gray-700 disabled:bg-[#0f0f0f] disabled:text-gray-600",
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
        <div className="absolute bottom-3 right-3 text-xs text-[#A1A1A1] bg-[#2D2D2DAB] px-2 py-0.5 rounded-[6px] border border-gray-500 font-poppins">
          {currentLength} / {maxLength}
        </div>
      </div>
    </div>
  );
};

export default FormTextArea;