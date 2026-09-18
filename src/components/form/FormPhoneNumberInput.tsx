"use client";
import { useEffect, useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Input } from "../ui/input";

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

import { Country } from "country-state-city";

const allCountries = Country.getAllCountries();
const countryCodes: CountryCode[] = Array.from(
  new Map(
    allCountries.map((c) => [
      `+${c.phonecode}`,
      { code: `+${c.phonecode}`, country: c.name, flag: c.flag },
    ])
  ).values()
);

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
  const [open, setOpen] = useState(false);

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
              className={`flex gap-2 text-base font-medium mb-3 text-black ${labelClassName}`}
            >
              {label}
              {required && (
                <span className="text-red-500 text-base font-medium  ">*</span>
              )}
            </FormLabel>
          )}
          <FormControl>
            <div
              className={`${className ? className : ""} flex h-[38px] w-full max-w-[742px] items-center rounded-[7px] border border-[#D2D2D2] bg-[#D2D2D2] pr-[20px] transition-all duration-200 focus-within:ring-1 focus-within:ring-gray-300 focus-within:ring-offset-0 ${
                disabled ? "border-gray-300 bg-gray-300" : ""
              }`}
            >
              {/* Country Code Selector */}
              {/* Country Code Selector */}
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger 
                  disabled={disabled}
                  className="h-full w-fit shrink-0 gap-1 border-0 border-r border-[#B5B5B5] bg-transparent
                    text-gray-500 hover:bg-black/5
                    font-poppins font-normal text-sm leading-none tracking-normal
                    rounded-l-[7px] rounded-r-none
                    pl-[14px] pr-[10px]
                    focus:ring-0 focus:ring-offset-0
                    disabled:text-gray-300 flex items-center justify-center outline-none"
                >
                  <span className="text-base leading-none">
                    {countryCodes.find((c) => c.code === selectedCountryCode)?.flag || "🏳️"}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search country or code..." />
                    <CommandList className="max-h-[300px] overflow-y-auto">
                      <CommandEmpty>No country found.</CommandEmpty>
                      <CommandGroup>
                        {countryCodes.map((country) => (
                          <CommandItem
                            key={country.code}
                            value={`${country.country} ${country.code}`}
                            onSelect={() => {
                              handleCountryCodeChange(country.code);
                              setOpen(false);
                            }}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span className="text-sm font-medium">{country.code}</span>
                              <span className="text-sm text-[#797979]">
                                {country.country}
                              </span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                selectedCountryCode === country.code ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

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
                className="h-full flex-1 border-0 bg-transparent text-gray-500 placeholder:text-[#797979]
                  font-poppins font-normal text-sm leading-none tracking-normal
                  pl-[12px] pr-0
                  shadow-none
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  disabled:text-gray-300"
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
