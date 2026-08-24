import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export interface selectType {
  label: string;
  value: string;
}

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
                    rounded-[7px] border border-gray-500
                    bg-[#2D2D2DAB] text-[#E6D6E8]
                    font-poppins font-normal text-sm leading-none tracking-normal
                    pt-[6px] pr-[20px] pb-[6px] pl-[20px]
                    transition-all duration-200
                    opacity-100
                    focus-visible:ring-1 focus-visible:ring-gray-700 focus-visible:ring-offset-0
                    disabled:border-gray-700 disabled:bg-[#0f0f0f] disabled:text-gray-600`,
                    className,
                  )}
                >
                  <span
                    className={`truncate flex-1 text-left ${
                      displayValue ? "text-[#E6D6E8]" : "text-[#A1A1A1]"
                    }`}
                  >
                    {!options?.length
                      ? "No options Available"
                      : displayValue || placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-[#A1A1A1] opacity-90" />
                </Button>
            </PopoverTrigger>
            {!readonly && (
              <PopoverContent
                className="p-0 bg-[#120e13] border border-[#3b2430] text-[#E6D6E8] rounded-[8px] overflow-hidden"
                style={{ width: `${width}px` }}
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                {label && (
                  <div className="px-3 py-2 bg-[#5a2060] text-white font-medium">
                    {label}
                  </div>
                )}
                <Command className="bg-[#120e13] text-[#E6D6E8]">
                  <CommandInput
                    placeholder="Search..."
                    onValueChange={(search) => setSearch?.(search)}
                    className="font-poppins text-sm text-[#E6D6E8] placeholder:text-[#BBAEC0] bg-transparent px-3 py-2"
                  />
                  <CommandList
                    className="max-h-[300px] overflow-y-auto bg-[#120e13]"
                    onWheel={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <CommandEmpty>
                      {!options?.length
                        ? "No options available"
                        : "No results found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {(options || [])
                        .filter(
                          (option) => option && option.value && option.label,
                        )
                        .map((option, index) => (
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
                            className={`cursor-pointer select-none flex items-center gap-2 p-2 font-poppins text-sm
                              text-[#E6D6E8] hover:bg-[#2a1e2a] aria-selected:bg-[#2a1e2a] aria-selected:text-[#E6D6E8] ${
                                option.value === currentValue
                                  ? "bg-[#2a1e2a] text-white"
                                  : ""
                              }`}
                          >
                            <Check
                              className="mr-2 h-4 w-4 text-[#E6D6E8]"
                              style={{
                                visibility:
                                  currentValue === option.value
                                    ? "visible"
                                    : "hidden",
                              }}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
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
                  className={`font-medium text-sm text-white flex items-center justify-end pr-2 flex-shrink-0 ${labelClassName}`}
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
              className={`flex gap-2 text-base font-medium text-white ${labelClassName}`}
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