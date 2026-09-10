import { cn } from "@/src/lib/utils";
import { Check } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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


const TRIGGER_CLASSES = `h-[42px]! sm:h-[46px]! md:h-[50px]!
  w-full max-w-[365px] rounded-[10px] border border-[#C0C0C0]
  bg-[#ACACAC99] text-white hover:bg-[#ACACAC99] hover:text-white
  font-inter font-medium text-[14px] sm:text-[15px] md:text-[16px] leading-normal tracking-normal
  pt-[9px]! pr-[16px]! pb-[8px]! pl-[16px]!
  sm:pt-[10px]! sm:pr-[18px]! sm:pb-[9px]! sm:pl-[18px]!
  md:pt-[12px]! md:pr-[22px]! md:pb-[11px]! md:pl-[22px]!
  whitespace-nowrap overflow-visible
  transition-all duration-200
  focus-visible:ring-1 focus-visible:ring-white/50 focus-visible:ring-offset-0
  disabled:border-white/10 disabled:bg-white/10 disabled:text-white/40`;

const DROPDOWN_CLASSES = " border-white/20 bg-[#3F3F3F] text-white";

const CHEVRON_CLASSES = "text-[#212121] opacity-100 h-5 w-5 sm:h-6 sm:w-6";


const SELECTED_ITEM_CLASSES = `w-full h-[36px] rounded-t-[12px]
  bg-[#D2D2D2] border border-white
  pl-[15px] pr-[43px] pb-[4px]
  font-poppins font-medium text-[16px] sm:text-[17px] md:text-[18px] leading-none tracking-normal text-white`;

const DEFAULT_ITEM_CLASSES = `!bg-transparent !text-white
  data-[selected=true]:!bg-transparent data-[selected=true]:!text-white
  aria-selected:!bg-transparent aria-selected:!text-white
  hover:!bg-white/10
  font-poppins font-medium text-[16px] sm:text-[17px] md:text-[18px] leading-none tracking-normal`;

const LoginFormCombobox = ({
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

  const [selectedOption, setSelectedOption] = useState<selectType | null>(null);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (buttonRef.current) {
        setWidth(buttonRef.current.offsetWidth);
      }
    };

    updateWidth();

  
    const resizeObserver = new ResizeObserver(updateWidth);
    if (buttonRef.current) {
      resizeObserver.observe(buttonRef.current);
    }
    window.addEventListener("resize", updateWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <FormField
      name={name}
      render={({ field }) => {
        const currentValue = value || field.value || "";

        const getDisplayValue = () => {
          if (!currentValue) return null;

          if (selectedOption && selectedOption.value === currentValue) {
            if (displayValueOnly) {
              return currentValue;
            }
            return selectedOption.label;
          }

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
              onClick={() => {
                if (!open) {
                  setSearch?.("");
                }
              }}
              render={
                <FormControl>
                  <Button
                    ref={buttonRef}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                      "flex items-center justify-between gap-[10px]",
                      TRIGGER_CLASSES,
                      className
                    )}
                  >
                    <span className="truncate flex-1 text-left">
                      {!options?.length
                        ? "No options Available"
                        : displayValue || placeholder}
                    </span>
                    {open ? (
                      <svg
                        className={cn("shrink-0", CHEVRON_CLASSES)}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 15L12 9L18 15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        className={cn("shrink-0", CHEVRON_CLASSES)}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M6 9L12 15L18 9"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </Button>
                </FormControl>
              }
            />
            {!readonly && (
              <PopoverContent
                className={cn("p-0", DROPDOWN_CLASSES)}
                style={{ width: width ? `${width}px` : undefined, maxWidth: "365px" }}
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                <Command className={cn(DROPDOWN_CLASSES, "bg-transparent")}>
                  <CommandInput
                    placeholder="Search..."
                    onValueChange={(search) => setSearch?.(search)}
                    className="font-poppins text-[15px] sm:text-[16px] md:text-[18px] leading-normal text-white placeholder:text-white/60"
                    wrapperClassName="h-9! sm:h-10! py-2 rounded-lg! border-white/20 bg-white/5"
                    containerClassName="p-2"
                  />
                  <CommandList
                    className="max-h-[300px] overflow-y-auto"
                    onWheel={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <CommandEmpty>
                      {!options?.length
                        ? "No options available"
                        : "No results found."}
                    </CommandEmpty>
                    <CommandGroup className="flex flex-col gap-[10px] bg-transparent">
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
                                setSelectedOption(option);
                                field.onChange(option.value);
                                onChange?.(option.value);
                                setOpen(false);
                                setSearch?.("");
                              }}
                              disabled={disabled || readonly}
                              className={cn(
                                "cursor-pointer select-none flex items-center gap-2 p-2",
                                isSelected
                                  ? SELECTED_ITEM_CLASSES
                                  : DEFAULT_ITEM_CLASSES
                              )}
                            >
                              <Check
                                className="mr-2 h-4 w-4"
                                style={{
                                  visibility: isSelected ? "visible" : "hidden",
                                }}
                              />
                              {option.label}
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
                  className={`font-medium text-sm text-white flex items-center justify-end pr-2 flex-shrink-0 ${labelClassName}`}
                >
                  {label}
                  {required && (
                    <span className="text-red-500 text-base font-medium">*</span>
                  )}
                  {optional && (
                    <span className="text-gray-500 text-base font-medium">
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
              className={cn(
                "flex gap-2 mb-1 text-base font-medium text-white",
                labelClassName
              )}
            >
              {label}
              {required && (
                <span className="text-red-500 text-base font-medium">*</span>
              )}
              {optional && (
                <span className="text-gray-400 text-base font-medium">
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

export default LoginFormCombobox;