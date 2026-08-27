"use client";
import { ReactNode, useState } from "react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  name: string;
  description?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean | undefined;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  type?: string;
  value?: string | number;
  Icon?: ReactNode;
  labelClassName?: string;
  onPaste?: (e: React.ClipboardEvent) => void;
  onCopy?: (e: React.ClipboardEvent) => void;
  step?: string | number;
  readOnly?: boolean;
  min?: number | string;
  max?: number | string;
  errorMessage?: string;
}

const FormInput = ({
  name,
  description,
  placeholder,
  label,
  className,
  onChange,
  disabled = false,
  required = false,
  type,
  value,
  Icon,
  labelClassName = "",
  onPaste,
  onCopy,
  readOnly = false,
  max,
  min,
  errorMessage,
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine the actual input type (default to text)
  const inputType = type === "password" && showPassword ? "text" : type || "text";

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel
              className={`flex gap-2 text-base font-medium mb-3 ${labelClassName}`}
            >
              {label}
              {required && (
                <span className="text-red-500 text-base font-medium ">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                type={inputType}
                min={
                  type === "date" || type === "datetime-local"
                    ? (min as string)
                    : (min as number)
                }
                max={
                  type === "date" || type === "datetime-local"
                    ? (max as string)
                    : (max as number)
                }
                required={required}
                placeholder={placeholder}
                {...field}
                readOnly={readOnly}
                onChange={(e) => {
                  if (onChange) onChange(e);
                  if (type === "number") {
                    const value =
                      e.target.value === "" ? "" : Number(e.target.value);
                    field.onChange(value);
                  } else {
                    field.onChange(e);
                  }
                }}
                onPaste={(e) => {
                  if (onPaste) onPaste(e);
                }}
                onCopy={(e) => {
                  if (onCopy) onCopy(e);
                }}
                className={`${className ? className : ""} w-full max-w-[742px] h-[38px] rounded-[7px] border border-gray-500
    bg-[#2D2D2DAB] text-[#E6D6E8] placeholder:text-[#A1A1A1]
    font-poppins font-normal text-sm leading-none tracking-normal
    gap-[9px] pt-[6px] pr-[20px] pb-[6px] pl-[20px]
    flex items-center transition-all duration-200
    opacity-100
    focus-visible:ring-1 focus-visible:ring-gray-700 focus-visible:ring-offset-0
    disabled:border-gray-700 disabled:bg-[#0f0f0f] disabled:text-gray-600`}
                disabled={disabled}
                value={value ?? field.value ?? ""}
              />
              {type === "password" ? (
                <div
                  className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer text-base font-normal  "
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                      <EyeOff className="h-5 w-5 text-[#E6D6E8]" />
                    ) : (
                      <Eye className="h-5 w-5 text-[#E6D6E8]" />
                    )}
                </div>
              ) : Icon ? (
                <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-[#E6D6E8] peer-disabled:opacity-50">
                  {Icon}
                </div>
              ) : null}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
          {/* {errorMessage && (
            <div className="text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          )} */}
        </FormItem>
      )}
    />
  );
};

export default FormInput;