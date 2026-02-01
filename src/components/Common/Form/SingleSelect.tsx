"use client";

import { useEffect, useRef, useState } from "react";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/helpers";
import { ChevronDown } from "lucide-react";

type Option = {
  value: string;
  label: string;
};

type SelectFieldProps = {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  icon?: boolean;
  error?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
};

export default function SelectField({
  options,
  value: controlledValue,
  defaultValue = "",
  onChange,
  placeholder = "Pilih campaign",
  className,
  disabled = false,
  icon: iconProp,
  error,
  onLoadMore,
  hasMore = false,
}: SelectFieldProps) {
  const icon = iconProp ?? true;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [width, setWidth] = useState<string>("100%");
  const textMeasureRef = useRef<HTMLSpanElement>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (val: string) => {
    if (isControlled && onChange) onChange(val);
    else setInternalValue(val);
    onChange?.(val);
    setOpen(false);
  };

  useEffect(() => {
    if (!textMeasureRef.current) return;
    setWidth("100%");
  }, []);

  const listRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore || !onLoadMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isAtBottom) {
      onLoadMore();
    }
  };
  const generateUniqueKey = (option: Option, index: number) => {
    return `${option.value}-${option.label}-${index}`;
  };
  return (
    <div className={cn("relative inline-block w-full",  className ? className : "")}>
      <span
        ref={textMeasureRef}
        className="absolute invisible whitespace-nowrap text-sm font-normal px-3"
      />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "w-full inline-flex items-center justify-between border-2 bg-neutral-white border-neutral-gray2 rounded-md text-sm focus:ring-2 text-neutral-gray1 focus:ring-primary-main appearance-none overflow-hidden truncate transition-all duration-150 pr-8 pl-3 h-10 cursor-pointer",
              disabled ?  "opacity-50 cursor-not-allowed" : "",
              error ? "border-semantic-red1 focus:ring-semantic-red1" : "",
              value && "text-neutral-black"
            )}
            style={{ width }}
          >
            <span className="overflow-hidden whitespace-nowrap text-ellipsis block">
              {options.find((opt) => opt.value === value)?.label || placeholder}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0"
          align="start"
          style={{ width: "var(--radix-popover-trigger-width)" }}
        >
          <Command>
            <CommandList
              ref={listRef}
              onScroll={handleScroll}
              className="max-h-52 overflow-auto"
            >
              {options.map((o, index) => (
                <CommandItem
                  key={generateUniqueKey(o, index)}
                  value={o.value}
                  onSelect={() => handleChange(o.value)}
                  className="text-neutral-black bg-neutral-white hover:bg-neutral-gray2 cursor-pointer px-3 py-2"
                >
                  {o.label}
                </CommandItem>
              ))}

              {hasMore && (
                <div className="text-center flex justify-center py-2 text-xs text-neutral-gray2">
                  <ChevronDown className="animate-bounce" />
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {icon && (
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-black w-4 h-4 pointer-events-none" />
      )}
    </div>
  );
}
