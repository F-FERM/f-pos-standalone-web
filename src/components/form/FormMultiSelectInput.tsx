import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/src/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type Status = "Active" | "Inactive" | "Pending";

export interface selectType {
  label: string;
  value: string;
}

interface formMultiSelectType {
  name: string;
  description?: string;
  placeholder: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  options: selectType[];
  selectLabel?: string;
  onInteract?: (event: React.MouseEvent) => void;
  defaultValue?: string[];
  active?: boolean;
  labelClassName?: string;
  onChange?: (values: string[]) => void;
  value?: string[];
  valueLabels?: string[];
  optional?: boolean;
  maxSelections?: number;
  searchPlaceholder?: string;
  setSearch?: Dispatch<SetStateAction<string>>;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  showCheckbox?: boolean;
  allowCreate?: boolean;
  onCreate?: (label: string) => void;
  /** "dark" (default) = existing dark-panel styling used everywhere today. "light" = light-card variant, dropdown styled like LoginFormCombobox. */
  theme?: "dark" | "light";
}

// ── Checkbox SVG (dark theme only) ───────────────────────────────────────────
const CheckboxIcon = ({
  checked,
  indeterminate,
}: {
  checked: boolean;
  indeterminate?: boolean;
}) => (
  <span
    className={`inline-flex items-center justify-center w-4 h-4 rounded shrink-0 transition-all
    ${
      checked || indeterminate
        ? "bg-[#9A3796] text-gray-500"
        : "border border-[#5a4a58] bg-transparent"
    }`}
  >
    {checked && !indeterminate && (
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
        <path
          d="M1 4L3.8 7L9 1"
          stroke="#E6D6E8"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
    {indeterminate && (
      <svg width="8" height="2" viewBox="0 0 8 2" fill="none">
        <rect x="0" y="0" width="8" height="2" rx="1" fill="#E6D6E8" />
      </svg>
    )}
  </span>
);

// classes borrowed from LoginFormCombobox, adapted to the multi-select's light theme
const LIGHT_SELECTED_ITEM_CLASSES = `w-full rounded-[8px] bg-[#D2D2D2] border border-[#9A3796]
  px-3 py-2 font-poppins font-medium text-[15px] leading-normal tracking-normal text-black`;

const LIGHT_DEFAULT_ITEM_CLASSES = `!bg-transparent !text-black
  data-[selected=true]:!bg-transparent data-[selected=true]:!text-black
  hover:!bg-[#F0F0F0]
  font-poppins font-medium text-[15px] leading-normal tracking-normal
  rounded-[8px] px-3 py-2`;

// ── Component ──────────────────────────────────────────────────────────────────
const FormMultiSelectInput = ({
  name,
  description,
  placeholder,
  label,
  disabled = false,
  required = false,
  selectLabel,
  options,
  onInteract,
  defaultValue = [],
  value,
  active = false,
  labelClassName,
  optional = false,
  onChange,
  maxSelections,
  searchPlaceholder = "Search options...",
  valueLabels,
  setSearch,
  showSelectAll = false,
  selectAllLabel = "Select all",
  showCheckbox = false,
  className,
  allowCreate = false,
  onCreate,
  theme = "dark",
}: formMultiSelectType) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [width, setWidth] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isLight = theme === "light";

  const [selectedCache, setSelectedCache] = useState<Record<string, string>>(
    {},
  );

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (!value?.length || !valueLabels?.length) return;

    setSelectedCache((prev) => {
      const next = { ...prev };
      value.forEach((id, index) => {
        if (valueLabels[index]) {
          next[id] = valueLabels[index];
        }
      });
      return next;
    });
  }, [value, valueLabels]);

  const getStatusColor = (statusType: Status) => {
    switch (statusType) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-amber-500";
      case "Pending":
        return "bg-blue-500";
      default:
        return "";
    }
  };

  const handleValueToggle = (
    optionValue: string,
    optionLabel: string,
    fieldOnChange: (value: string[]) => void,
    currentValues: string[],
  ) => {
    const isAlreadySelected = currentValues.includes(optionValue);

    const newValues = isAlreadySelected
      ? currentValues.filter((v) => v !== optionValue)
      : maxSelections && currentValues.length >= maxSelections
        ? currentValues
        : [...currentValues, optionValue];

    setSelectedCache((prev) => {
      const next = { ...prev };
      if (!isAlreadySelected) {
        next[optionValue] = optionLabel;
      } else {
        delete next[optionValue];
      }
      return next;
    });

    fieldOnChange(newValues);
    onChange?.(newValues);
  };

  const handleSelectAll = (
    fieldOnChange: (value: string[]) => void,
    currentValues: string[],
    filtered: selectType[],
  ) => {
    const filteredValues = filtered.map((o) => o.value);
    const allFilteredSelected = filteredValues.every((v) =>
      currentValues.includes(v),
    );

    let newValues: string[];

    if (allFilteredSelected) {
      newValues = currentValues.filter((v) => !filteredValues.includes(v));
      setSelectedCache((prev) => {
        const next = { ...prev };
        filteredValues.forEach((v) => delete next[v]);
        return next;
      });
    } else {
      const toAdd = filteredValues.filter((v) => !currentValues.includes(v));
      const canAdd = maxSelections
        ? toAdd.slice(0, maxSelections - currentValues.length)
        : toAdd;

      newValues = [...currentValues, ...canAdd];

      setSelectedCache((prev) => {
        const next = { ...prev };
        canAdd.forEach((v) => {
          const opt = filtered.find((o) => o.value === v);
          if (opt) next[v] = opt.label;
        });
        return next;
      });
    }

    fieldOnChange(newValues);
    onChange?.(newValues);
  };

  const removeValue = (
    valueToRemove: string,
    fieldOnChange: (value: string[]) => void,
    currentValues: string[],
  ) => {
    const newValues = currentValues.filter((v) => v !== valueToRemove);

    setSelectedCache((prev) => {
      const next = { ...prev };
      delete next[valueToRemove];
      return next;
    });

    fieldOnChange(newValues);
    onChange?.(newValues);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setSearch?.(val);
  };

  const getDisplayLabel = (selectedValue: string): string => {
    const fromOptions = options.find(
      (opt) => opt.value === selectedValue,
    )?.label;
    if (fromOptions) return fromOptions;
    return selectedCache[selectedValue] || selectedValue;
  };

  const handleCreate = (
    fieldOnChange: (value: string[]) => void,
    currentValues: string[],
  ) => {
    const label = searchTerm.trim();
    if (!label) return;
    if (maxSelections && currentValues.length >= maxSelections) return;

    onCreate?.(label);
    handleValueToggle(label, label, fieldOnChange, currentValues);
    setSearchTerm("");
    setSearch?.("");
  };

  return (
    <FormField
      name={name}
      render={({ field }) => {
        const currentValues: string[] = value || field.value || [];

        const filteredValues = filteredOptions.map((o) => o.value);
        const allFilteredSelected =
          filteredValues.length > 0 &&
          filteredValues.every((v) => currentValues.includes(v));
        const someFilteredSelected =
          filteredValues.some((v) => currentValues.includes(v)) &&
          !allFilteredSelected;

        const canCreate =
          allowCreate &&
          searchTerm.trim().length > 0 &&
          !options.some(
            (o) => o.label.toLowerCase() === searchTerm.trim().toLowerCase(),
          );

        return (
          <FormItem>
            {label && (
              <FormLabel
                className={`flex gap-2 text-base font-medium mb-3 text-black ${labelClassName ?? ""}`}
              >
                {label}
                {required && (
                  <span className="text-red-500 text-base font-medium">*</span>
                )}
                {optional && (
                  <span
                    className={`text-base font-normal ${
                      isLight ? "text-[#797979]" : "text-[#A1A1A1]"
                    }`}
                  >
                    (Optional)
                  </span>
                )}
              </FormLabel>
            )}
            <FormControl>
              <Popover
                open={open}
                onOpenChange={(next) => {
                  if (!next) {
                    setSearchTerm("");
                    setSearch?.("");
                  }
                  setOpen(next);
                }}
              >
                <PopoverTrigger className="w-full">
                  <div
                    ref={triggerRef}
                    role="button"
                    aria-expanded={open}
                    aria-haspopup="listbox"
                    onClick={(e) => {
                      if (onInteract) onInteract(e);
                    }}
                    className={cn(
                      `flex min-h-[38px] w-full items-center justify-between
                      rounded-[7px] border
                      font-poppins font-normal text-sm leading-none tracking-normal
                      pt-[6px] pr-[20px] pb-[6px] pl-[20px]
                      transition-all duration-200
                      cursor-pointer
                      focus-visible:ring-1 focus-visible:ring-offset-0
                      ${
                        isLight
                          ? "border-[#D2D2D2] bg-[#D2D2D2] text-gray-500 focus-visible:ring-gray-300"
                          : "border-gray-500 bg-[#D2D2D2] text-gray-500 focus-visible:ring-gray-700"
                      }
                      ${disabled ? "opacity-50 pointer-events-none" : ""}`,
                      className,
                    )}
                  >
                    <div className="flex flex-1 flex-wrap items-center gap-1 min-h-[20px]">
                      {currentValues.length > 0 ? (
                        currentValues.map((selectedValue) => {
                          const displayLabel = getDisplayLabel(selectedValue);

                          return (
                            <Tooltip key={selectedValue}>
                              <TooltipTrigger>
                                <div
                                  className={`flex items-center rounded-[6px] px-2 py-[3px] text-xs max-w-[200px] cursor-help ${
                                    isLight
                                      ? "bg-[#9A379633] text-[#450042]"
                                      : "bg-[#9A379682] text-[#E6D6E8]"
                                  }`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {active && (
                                    <span
                                      className={`inline-block w-2 h-2 mr-1 rounded-full shrink-0 ${getStatusColor(selectedValue as Status)}`}
                                    />
                                  )}
                                  <span className="mr-1 truncate">
                                    {displayLabel}
                                  </span>
                                  {!disabled && (
                                    <X
                                      className="h-3 w-3 cursor-pointer hover:text-red-400 shrink-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeValue(
                                          selectedValue,
                                          field.onChange,
                                          currentValues,
                                        );
                                      }}
                                    />
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{displayLabel}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })
                      ) : (
                        <span
                          className={`text-sm font-normal ${
                            isLight ? "text-[#797979]" : "text-[#A1A1A1]"
                          }`}
                        >
                          {placeholder}
                        </span>
                      )}
                    </div>
                    {allowCreate ? (
                      <Plus
                        className={`h-4 w-4 shrink-0 ml-2 opacity-90 transition-transform ${
                          isLight ? "text-[#797979]" : "text-[#A1A1A1]"
                        } ${open ? "rotate-45" : ""}`}
                      />
                    ) : (
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 ml-2 opacity-90 transition-transform ${
                          isLight ? "text-[#797979]" : "text-[#A1A1A1]"
                        } ${open ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  className={
                    isLight
                      ? "p-2 overflow-hidden rounded-[10px] border border-[#D2D2D2] bg-white text-black"
                      : "p-0 overflow-hidden rounded-[8px] border border-[#D2D2D2] bg-[#D2D2D2] text-[#E6D6E8]"
                  }
                  style={{
                    width: width
                      ? `${width}px`
                      : "var(--radix-popover-trigger-width)",
                  }}
                  onWheel={(e) => e.stopPropagation()}
                >
                  {/* Search / create row */}
                  <div className={isLight ? "pb-2" : "p-2 border-b border-[#D2D2D2]"}>
                    <div className="relative flex items-center gap-2">
                      <Search
                        className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                          isLight ? "text-[#797979]" : "text-[#A1A1A1]"
                        }`}
                      />
                      <input
                        autoFocus
                        type="text"
                        className={
                          isLight
                            ? "w-full h-9 pl-9 pr-8 rounded-[8px] border border-[#D2D2D2] bg-[#F5F5F5] font-poppins text-[14px] text-black placeholder:text-[#797979] focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                            : "w-full pl-8 pr-8 py-2 text-sm bg-transparent border border-[#D2D2D2] rounded-md text-[#E6D6E8] placeholder:text-[#BBAEC0] focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                        }
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onPointerDown={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && canCreate) {
                            e.preventDefault();
                            handleCreate(field.onChange, currentValues);
                          }
                        }}
                      />
                      {allowCreate && (
                        <button
                          type="button"
                          aria-label="Add"
                          disabled={!canCreate}
                          onClick={() =>
                            handleCreate(field.onChange, currentValues)
                          }
                          className={`absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded disabled:opacity-30 hover:text-[#9A3796] ${
                            isLight ? "text-black" : "text-gray-500"
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Select All row */}
                  {showSelectAll &&
                    filteredOptions.length > 0 &&
                    !maxSelections && (
                      <div
                        className={
                          isLight
                            ? "pb-2 mb-1 border-b border-[#EDEDED]"
                            : "px-2 pt-2 pb-1 border-b border-[#3b2430]"
                        }
                      >
                        <div
                          className={cn(
                            "flex items-center gap-2 cursor-pointer select-none",
                            isLight
                              ? LIGHT_DEFAULT_ITEM_CLASSES
                              : "px-2 py-1.5 rounded-sm hover:bg-[#2a1e2a]",
                          )}
                          onClick={() =>
                            handleSelectAll(
                              field.onChange,
                              currentValues,
                              filteredOptions,
                            )
                          }
                        >
                          {isLight ? (
                            <Check
                              className="h-4 w-4 shrink-0"
                              style={{
                                visibility:
                                  allFilteredSelected || someFilteredSelected
                                    ? "visible"
                                    : "hidden",
                              }}
                            />
                          ) : (
                            <CheckboxIcon
                              checked={allFilteredSelected}
                              indeterminate={someFilteredSelected}
                            />
                          )}
                          <span>{selectAllLabel}</span>
                          {currentValues.length > 0 && (
                            <span
                              className={`ml-auto text-xs font-normal ${
                                isLight ? "text-[#797979]" : "text-[#A1A1A1]"
                              }`}
                            >
                              {currentValues.length} selected
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Options — light theme mirrors LoginFormCombobox's item styling */}
                  <div
                    className={cn(
                      "max-h-48 overflow-y-auto",
                      isLight ? "flex flex-col gap-[6px]" : "p-1",
                    )}
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {selectLabel && (
                      <div
                        className={`px-2 py-1.5 text-sm font-semibold ${
                          isLight ? "text-black" : "text-gray-500"
                        }`}
                      >
                        {selectLabel}
                      </div>
                    )}

                    {filteredOptions.length === 0 ? (
                      <div
                        className={`px-2 py-3 text-sm text-center ${
                          isLight ? "text-[#797979]" : "text-[#A1A1A1]"
                        }`}
                      >
                        {searchTerm && !allowCreate
                          ? `No results found for "${searchTerm}"`
                          : searchTerm && allowCreate
                            ? `Press + to add "${searchTerm}"`
                            : "No options available"}
                      </div>
                    ) : (
                      filteredOptions.map((item) => {
                        const isSelected = currentValues.includes(item.value);
                        const isDisabledOption =
                          maxSelections &&
                          !isSelected &&
                          currentValues.length >= maxSelections;

                        if (isLight) {
                          return (
                            <div
                              key={item.value}
                              className={cn(
                                "flex cursor-pointer select-none items-center gap-2 transition-colors",
                                isSelected
                                  ? LIGHT_SELECTED_ITEM_CLASSES
                                  : LIGHT_DEFAULT_ITEM_CLASSES,
                                isDisabledOption && "opacity-50 cursor-not-allowed",
                              )}
                              onClick={() => {
                                if (!isDisabledOption) {
                                  handleValueToggle(
                                    item.value,
                                    item.label,
                                    field.onChange,
                                    currentValues,
                                  );
                                }
                              }}
                            >
                              <Check
                                className="h-4 w-4 shrink-0"
                                style={{ visibility: isSelected ? "visible" : "hidden" }}
                              />
                              <span className="flex-1 break-words whitespace-normal">
                                {item.label}
                              </span>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={item.value}
                            className={`relative flex cursor-pointer select-none rounded-sm px-2 py-2 text-sm transition-colors
                            text-gray-500 hover:bg-[#2a1e2a]
                            ${isSelected ? "bg-[#2a1e2a] text-white" : ""}
                            ${isDisabledOption ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => {
                              if (!isDisabledOption) {
                                handleValueToggle(
                                  item.value,
                                  item.label,
                                  field.onChange,
                                  currentValues,
                                );
                              }
                            }}
                          >
                            <div
                              className={`flex items-start w-full ${
                                showCheckbox ? "gap-3" : ""
                              }`}
                            >
                              {showCheckbox && <CheckboxIcon checked={isSelected} />}
                              <span className="flex-1 break-words whitespace-normal leading-snug">
                                {item.label}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </FormControl>

            {description && (
              <FormDescription className={isLight ? "text-[#797979]" : "text-[#A1A1A1]"}>
                {description}
              </FormDescription>
            )}
            {maxSelections && (
              <FormDescription className={`text-sm ${isLight ? "text-[#797979]" : "text-[#A1A1A1]"}`}>
                Maximum {maxSelections} selections allowed. Selected:{" "}
                {currentValues.length}
              </FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormMultiSelectInput;