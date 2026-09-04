import { Check, ChevronsUpDown } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { cn } from "@/src/lib/utils";

export interface selectType {
  label: string;
  value: string;
}

// classes borrowed from FormMultiSelectInput's light theme, for dropdown-item consistency
const LIGHT_SELECTED_ITEM_CLASSES = `w-full rounded-[8px] bg-[#D2D2D2] border border-[#9A3796]
  px-3 py-2 font-poppins font-medium text-[15px] leading-normal tracking-normal text-black`;

const LIGHT_DEFAULT_ITEM_CLASSES = `!bg-transparent !text-black
  data-[selected=true]:!bg-transparent data-[selected=true]:!text-black
  hover:!bg-[#F0F0F0]
  font-poppins font-medium text-[15px] leading-normal tracking-normal
  rounded-[8px] px-3 py-2`;

interface FormComboboxProps {
  name: string;
  description?: string;
  placeholder: string;
  label?: string;
  valueLabel?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options: selectType[];
  labelClassName?: string;
  value?: string;
  onChange?: (value: string) => void;
  labelInline?: boolean;
  labelInlineGap?: string;
  readonly?: boolean;
  optional?: boolean;
  setSearch?: Dispatch<SetStateAction<string>>;
  displayValueOnly?: boolean;
}

const FormCombobox = ({
  name,
  description,
  placeholder,
  label,
  className,
  disabled = false,
  required = false,
  options,
  valueLabel,
  labelClassName,
  value,
  onChange,
  labelInline = false,
  labelInlineGap,
  readonly,
  optional,
  setSearch,
  displayValueOnly = false,
}: FormComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Store the selected option to persist it even when not in options list
  const [selectedOption, setSelectedOption] = useState<selectType | null>(null);

  useLayoutEffect(() => {
    if (buttonRef.current) {
      setWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  return (
    <FormField
      name={name}
      render={({ field }) => {
        const currentValue = value || field.value || "";

        // Function to extract just the rate value from the option value
        const getDisplayValue = () => {
          if (!currentValue) return null;

          // First check if we have a stored selected option
          if (selectedOption && selectedOption.value === currentValue) {
            if (displayValueOnly) {
              return currentValue;
            }
            return selectedOption.label;
          }

          // Then check the current options list
          const foundOption = options.find(
            (option) => option.value === currentValue,
          );

          if (!foundOption) return valueLabel || null;

          if (displayValueOnly) {
            return currentValue;
          }

          return foundOption.label;
        };

        const displayValue = getDisplayValue();

        const comboboxComponent = (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              render={<FormControl />}
              onClick={() => {
                if (!open) {
                  setSearch?.("");
                }
              }}
            >
              <Button
                ref={buttonRef}
                variant="outline"
                role="combobox"
                aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    `flex h-[38px] w-full max-w-[742px] items-center justify-between
                    rounded-[7px] border border-[#D2D2D2]
                    bg-[#D2D2D2] text-gray-500
                    font-poppins font-normal text-sm leading-none tracking-normal
                    gap-[9px] pt-[6px] pr-[20px] pb-[6px] pl-[20px]
                    transition-all duration-200
                    opacity-100
                    focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-0
                    disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-300`,
                    className,
                  )}
                >
                  <span
                    className={`truncate flex-1 text-left ${
                      displayValue ? "text-gray-500" : "text-[#797979]"
                    }`}
                  >
                    {!options?.length
                      ? "No options Available"
                      : displayValue || placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-500 opacity-90" />
                </Button>
            </PopoverTrigger>
            {!readonly && (
              <PopoverContent
                className="p-2 overflow-hidden rounded-[10px] border border-[#D2D2D2] bg-[#D2D2D2] text-black"
                style={{ width: `${width}px` }}
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                
                <Command className=" bg-[#D2D2D2] text-black">
                  <CommandInput
                    placeholder="Search..."
                    onValueChange={(search) => setSearch?.(search)}
                    className="font-poppins font-normal text-sm text-gray-500 placeholder:text-[#797979] bg-transparent px-3 py-2"
                  />
                  <CommandList
                    className="max-h-[300px] overflow-y-auto bg-[#D2D2D2] flex flex-col gap-[6px]"
                    onWheel={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <CommandEmpty className="px-2 py-3 text-sm text-center text-[#797979]">
                      {!options?.length
                        ? "No options available"
                        : "No results found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {(options || [])
                        .filter(
                          (option) => option && option.value && option.label,
                        )
                        .map((option, index) => {
                          const isSelected = option.value === currentValue;
                          return (
                            <CommandItem
                              key={`${option.value}-${index}`}
                              value={`${option.value}-${index}`}
                              keywords={[option.label]}
                              onSelect={() => {
                                // Store the selected option before updating the value
                                setSelectedOption(option);
                                field.onChange(option.value);
                                onChange?.(option.value);
                                setOpen(false);
                                setSearch?.("");
                              }}
                              disabled={disabled || readonly}
                              className={cn(
                                "flex cursor-pointer select-none items-center gap-2 transition-colors",
                                isSelected
                                  ? LIGHT_SELECTED_ITEM_CLASSES
                                  : LIGHT_DEFAULT_ITEM_CLASSES,
                              )}
                            >
                              <Check
                                className="h-4 w-4 shrink-0"
                                style={{
                                  visibility: isSelected ? "visible" : "hidden",
                                }}
                              />
                              <span className="flex-1 break-words whitespace-normal">
                                {option.label}
                              </span>
                            </CommandItem>
                          );
                        })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            )}
          </Popover>
        );

        if (labelInline) {
          return (
            <div
              className="flex items-center"
              style={labelInlineGap ? { gap: labelInlineGap } : { gap: "8px" }}
            >
              {label && (
                <FormLabel
                  className={`font-medium text-base mb-3  text-white flex items-center justify-end pr-2 flex-shrink-0 ${labelClassName}`}
                >
                  {label}
                  {required && (
                    <span className="text-red-500 text-base font-medium  ">
                      *
                    </span>
                  )}
                  {optional && (
                    <span className="text-gray-500 text-base font-medium  ">
                      (Optional)
                    </span>
                  )}
                </FormLabel>
              )}
              <div className="flex-1">
                <FormControl>{comboboxComponent}</FormControl>
              </div>
            </div>
          );
        }

        return (
          <FormItem>
            <FormLabel
              className={`flex gap-2 text-base font-medium mb-3 text-white ${labelClassName}`}
            >
              {label}
              {required && (
                <span className="text-red-500 text-base font-medium  ">*</span>
              )}
              {optional && (
                <span className="text-gray-400 text-base font-medium  ">
                  (Optional)
                </span>
              )}
            </FormLabel>
            <FormControl>{comboboxComponent}</FormControl>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormCombobox;