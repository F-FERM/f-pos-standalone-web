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
              className={`flex gap-2 text-base font-medium mb-1 text-white ${labelClassName}`}
            >
              {label}
              {required && (
                <span className="text-red-500 text-base font-medium  ">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <div className="flex gap-[9px]">
              {/* Country Code Selector */}
              <Select
                value={selectedCountryCode}
                onValueChange={handleCountryCodeChange}
                disabled={disabled}
              >
                <SelectTrigger
                  className="w-[100px] h-[38px] rounded-[7px] border border-[#A1A1A1]
                    bg-[#1C1C1C] text-[#A1A1A1] hover:bg-[#1C1C1C]
                    font-poppins font-normal text-sm leading-none tracking-normal
                    px-5 py-1.5
                    focus:ring-1 focus:ring-[#A1A1A1] focus:ring-offset-0
                    disabled:border-gray-700 disabled:bg-[#141414] disabled:text-gray-600"
                >
                  <SelectValue>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-normal text-[#A1A1A1]">
                        {selectedCountryCode}
                      </span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="h-72 overflow-y-scroll bg-[#1C1C1C] border border-[#A1A1A1] text-[#A1A1A1]">
                  {countryCodes.map((country) => (
                    <SelectItem
                      key={country.code}
                      value={country.code}
                      className="font-poppins text-sm text-[#A1A1A1] focus:bg-[#2A2A2A] focus:text-[#A1A1A1] data-[state=checked]:bg-[#2A2A2A]"
                    >
                      <div className="flex items-center gap-2 ">
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
                className={`${
                  className ? className : ""
                } h-[38px] flex-1 rounded-[7px] border border-[#A1A1A1]
                  bg-[#1C1C1C] text-[#A1A1A1] placeholder:text-[#A1A1A1]
                  font-poppins font-normal text-sm leading-none tracking-normal
                  px-5 py-1.5
                  transition-all duration-200
                  focus-visible:ring-1 focus-visible:ring-[#A1A1A1] focus-visible:ring-offset-0
                  disabled:border-gray-700 disabled:bg-[#141414] disabled:text-gray-600`}
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
