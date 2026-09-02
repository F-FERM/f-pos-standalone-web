"use client";
import { ReactNode, useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { cn } from "@/src/lib/utils";
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
  type: string;
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
  
  variant?: "default" | "kiosk";
}

const VARIANT_CLASSES = {
  default: `w-[304px] h-[38px] rounded-[7px] border border-[#A1A1A1]
    bg-[#1C1C1C] text-[#A1A1A1] placeholder:text-[#A1A1A1] placeholder:text-[16px] md:placeholder:text-[16px]
    font-poppins font-normal text-[20px] md:text-[20px] leading-none tracking-normal
    px-5 py-1.5
    flex items-center transition-all duration-200
    focus-visible:ring-1 focus-visible:ring-[#A1A1A1] focus-visible:ring-offset-0
    disabled:border-gray-700 disabled:bg-[#141414] disabled:text-gray-600`,
  kiosk: `w-[365px] h-[50px] rounded-[10px] border border-white/30
    bg-[#ACACAC99] text-white placeholder:text-white/70
    font-poppins font-medium text-[20px] md:text-[20px] leading-none tracking-normal placeholder:text-[16px] md:placeholder:text-[16px]
    px-7 py-[18px]
    flex items-center transition-all duration-200
    focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-0
    disabled:border-white/10 disabled:bg-white/10 disabled:text-white/40`,
} as const;

const ICON_COLOR_CLASSES = {
  default: "text-[#A1A1A1]",
  kiosk: "text-white/80",
} as const;

const LoginFormInput = ({
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
  variant = "default",
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine the actual input type
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel
              className={`flex gap-2 text-base font-medium mb-1 ${
                variant === "kiosk" ? "text-white" : ""
              } ${labelClassName}`}
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
                className={cn(VARIANT_CLASSES[variant], className)}
                disabled={disabled}
                value={value ?? field.value ?? ""}
              />
              {type === "password" ? (
                <div
                  className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer text-base font-normal  "
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className={cn("h-5 w-5", ICON_COLOR_CLASSES[variant])} />
                  ) : (
                    <Eye className={cn("h-5 w-5", ICON_COLOR_CLASSES[variant])} />
                  )}
                </div>
              ) : Icon ? (
                <div
                  className={cn(
                    "pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50",
                    ICON_COLOR_CLASSES[variant]
                  )}
                >
                  {Icon}
                </div>
              ) : null}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LoginFormInput;