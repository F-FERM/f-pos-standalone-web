"use client";
import { useEffect, useState } from "react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CountryCode {
  code: string;
  country: string;
  flag: string;
}

interface PhoneNumberInputProps {
  name: string;
  description?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean | undefined;
  onChange?: (phoneNumber: string, countryCode: string) => void;
  className?: string;
  value?: string;
  countryCode?: string;
  labelClassName?: string;
  onPaste?: (e: React.ClipboardEvent) => void;
  onCopy?: (e: React.ClipboardEvent) => void;
  readOnly?: boolean;
}

const countryCodes: CountryCode[] = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
];

const FormPhoneNumberInput = ({
  name,
  description,
  placeholder = "enter the registered mobile number",
  label = "Mobile Number",
  className,
  onChange,
  disabled = false,
  required = false,
  value,
  countryCode = "+91",
  labelClassName = "",
  onPaste,
  onCopy,
  readOnly = false,
}: PhoneNumberInputProps) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode);

  useEffect(() => {
    setSelectedCountryCode(countryCode);
  }, [countryCode]);

  const handleCountryCodeChange = (newCountryCode: string | null) => {
    if (!newCountryCode) return;
    setSelectedCountryCode(newCountryCode);
    if (onChange) {
      onChange(value || "", newCountryCode);
    }
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    if (onChange) {
      onChange(phoneNumber, selectedCountryCode);
    }
  };

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
                <span className="text-red-500 text-base font-medium  ">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <div
              className={`${className ? className : ""} flex h-[38px] w-full max-w-[742px] items-center rounded-[7px] border border-gray-500 bg-[#2D2D2DAB] pr-[20px] transition-all duration-200 focus-within:ring-1 focus-within:ring-gray-700 focus-within:ring-offset-0 ${
                disabled ? "border-gray-700 bg-[#0f0f0f]" : ""
              }`}
            >
              {/* Country Code Selector */}
              <Select
                value={selectedCountryCode}
                onValueChange={handleCountryCodeChange}
                disabled={disabled}
              >
                <SelectTrigger
                  className="h-full w-fit shrink-0 gap-1 border-0 border-r border-gray-600 bg-transparent
                    text-[#E6D6E8] hover:bg-white/5
                    font-poppins font-normal text-sm leading-none tracking-normal
                    rounded-l-[7px] rounded-r-none
                    pl-[14px] pr-[10px]
                    focus:ring-0 focus:ring-offset-0
                    disabled:text-gray-600"
                >
                  <SelectValue>
                    <span className="text-base leading-none">
                      {countryCodes.find((c) => c.code === selectedCountryCode)?.flag}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="h-72 overflow-y-scroll rounded-[10px] border border-gray-700 bg-[#1B1B1B] p-0 text-[#E6D6E8]">
                  {countryCodes.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.code}
                      className="cursor-pointer rounded-none font-poppins text-sm text-[#E6D6E8] focus:bg-[#5A1E5C] focus:text-white data-[state=checked]:bg-[#5A1E5C] data-[state=checked]:text-white"
                    >
                      <div className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span className="text-sm">{country.code}</span>
                        <span className="text-sm text-[#A1A1A1]/70">
                          {country.country}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Phone Number Input */}
              <Input
                type="tel"
                required={required}
                placeholder={placeholder}
                {...field}
                readOnly={readOnly}
                onChange={(e) => {
                  // Remove non-numeric characters
                  const numericValue = e.target.value.replace(/\D/g, "");
                  field.onChange(numericValue);
                  handlePhoneNumberChange(numericValue);
                }}
                onPaste={(e) => {
                  if (onPaste) onPaste(e);
                }}
                onCopy={(e) => {
                  if (onCopy) onCopy(e);
                }}
                className="h-full flex-1 border-0 bg-transparent text-[#E6D6E8] placeholder:text-[#A1A1A1]
                  font-poppins font-normal text-sm leading-none tracking-normal
                  pl-[12px] pr-0
                  shadow-none
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  disabled:text-gray-600"
                disabled={disabled}
                value={value ?? field.value ?? ""}
                maxLength={15} // Maximum phone number length
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormPhoneNumberInput;