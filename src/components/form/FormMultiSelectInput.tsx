import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { ChevronDown, Plus, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
  /** Show "Select All" checkbox above the options list */
  showSelectAll?: boolean;
  /** Label for the Select All checkbox (default: "Select all") */
  selectAllLabel?: string;
  showCheckbox?: boolean;
  /** Show a trailing "+" affordance (create-new) like FormCombobox's search-and-create pattern */
  allowCreate?: boolean;
  onCreate?: (label: string) => void;
}

// ── Checkbox SVG (restyled to the POS palette) ──────────────────────────────
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
        ? "bg-[#9A3796] text-[#E6D6E8]"
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
}: formMultiSelectType) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [width, setWidth] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  const [selectedCache, setSelectedCache] = useState<Record<string, string>>(
    {},
  );

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  // Seed cache from valueLabels (edit mode)
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

  // ── Select All handler ─────────────────────────────────────────────────────
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
                className={`flex gap-2 text-base font-medium mb-3 text-white ${labelClassName}`}
              >
                {label}
                {required && (
                  <span className="text-red-500 text-base font-medium">*</span>
                )}
                {optional && (
                  <span className="text-[#A1A1A1] text-base font-normal">
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
                      rounded-[7px] border border-gray-500
                      bg-[#2D2D2DAB] text-[#E6D6E8]
                      font-poppins font-normal text-sm leading-none tracking-normal
                      pt-[6px] pr-[14px] pb-[6px] pl-[14px]
                      transition-all duration-200
                      cursor-pointer
                      focus-visible:ring-1 focus-visible:ring-gray-700 focus-visible:ring-offset-0
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
                                  className="flex items-center bg-[#9A379682] rounded-[6px] px-2 py-[3px] text-xs max-w-[200px] cursor-help text-[#E6D6E8]"
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
                        <span className="text-[#A1A1A1] text-sm font-normal">
                          {placeholder}
                        </span>
                      )}
                    </div>
                    {allowCreate ? (
                      <Plus
                        className={`h-4 w-4 shrink-0 ml-2 text-[#A1A1A1] opacity-90 transition-transform ${open ? "rotate-45" : ""}`}
                      />
                    ) : (
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 ml-2 text-[#A1A1A1] opacity-90 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                </PopoverTrigger>

                <PopoverContent
                  className="p-0 overflow-hidden bg-[#120e13] border border-[#3b2430] text-[#E6D6E8] rounded-[8px]"
                  style={{
                    width: width
                      ? `${width}px`
                      : "var(--radix-popover-trigger-width)",
                  }}
                  onWheel={(e) => e.stopPropagation()}
                >
                  {/* Search / create row */}
                  <div className="p-2 border-b border-[#3b2430]">
                    <div className="relative flex items-center gap-2">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1A1]" />
                      <input
                        autoFocus
                        type="text"
                        className="w-full pl-8 pr-8 py-2 text-sm bg-transparent border border-[#3b2430] rounded-md text-[#E6D6E8] placeholder:text-[#BBAEC0] focus:outline-none focus:ring-1 focus:ring-[#9A3796] focus:border-[#9A3796]"
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
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded text-[#E6D6E8] disabled:opacity-30 hover:text-[#9A3796]"
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
                      <div className="px-2 pt-2 pb-1 border-b border-[#3b2430]">
                        <div
                          className="flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer hover:bg-[#2a1e2a] select-none"
                          onClick={() =>
                            handleSelectAll(
                              field.onChange,
                              currentValues,
                              filteredOptions,
                            )
                          }
                        >
                          <CheckboxIcon
                            checked={allFilteredSelected}
                            indeterminate={someFilteredSelected}
                          />
                          <span className="text-sm font-medium text-[#E6D6E8]">
                            {selectAllLabel}
                          </span>
                          {currentValues.length > 0 && (
                            <span className="ml-auto text-xs text-[#A1A1A1]">
                              {currentValues.length} selected
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Options */}
                  <div
                    className="max-h-48 overflow-y-auto p-1"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    {selectLabel && (
                      <div className="px-2 py-1.5 text-sm font-semibold text-[#E6D6E8]">
                        {selectLabel}
                      </div>
                    )}

                    {filteredOptions.length === 0 ? (
                      <div className="px-2 py-3 text-sm text-[#A1A1A1] text-center">
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

                        return (
                          <div
                            key={item.value}
                            className={`relative flex cursor-pointer select-none rounded-sm px-2 py-2 text-sm transition-colors
      text-[#E6D6E8] hover:bg-[#2a1e2a]
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
                              {showCheckbox && (
                                <CheckboxIcon checked={isSelected} />
                              )}
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
              <FormDescription className="text-[#A1A1A1]">
                {description}
              </FormDescription>
            )}
            {maxSelections && (
              <FormDescription className="text-sm text-[#A1A1A1]">
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