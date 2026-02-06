"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Calendar, DateRange } from "react-date-range";
import { createPortal } from "react-dom";
import { cn, formatDate, formatFilterDate } from "@/utils/helpers";
import { ChevronDown, XCircle } from "lucide-react";
import Button from "../Button/Button";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "@/styles/react-date-range.override.css";
import { useIsMobile } from "@/components/hooks/useIsMobile";
import BottomSheetModal from "../BottomSheet";

interface CustomDatePickerProps {
  placeholder: string;
  className?: string;
  icon?: React.ReactElement;
  mode?: "single" | "range";
  value?: string;
  isFutureDisabled?: boolean;
  onChange?: (value: { start?: string | null; end?: string | null }) => void;
  isFilter?: boolean;
}

function useDateState(value: string | undefined, isFilter: boolean) {
  const [savedStart, setSavedStart] = useState<Date | null>(null);
  const [savedEnd, setSavedEnd] = useState<Date | null>(null);
  const [savedTime, setSavedTime] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    if (!value) {
      setSavedStart(null);
      setSavedEnd(null);
      if (!isFilter) {
        setSavedTime({ hours: "00", minutes: "00", seconds: "00" });
      }
      return;
    }

    try {
      const parsed = JSON.parse(value);
      const start = parsed.start ? new Date(parsed.start) : null;
      const end = parsed.end ? new Date(parsed.end) : null;

      if (start && !Number.isNaN(start.getTime())) {
        setSavedStart(start);
        setSavedTime({
          hours: String(start.getHours()).padStart(2, "0"),
          minutes: String(start.getMinutes()).padStart(2, "0"),
          seconds: String(start.getSeconds()).padStart(2, "0"),
        });
      }

      if (end && !Number.isNaN(end.getTime())) setSavedEnd(end);
    } catch {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) setSavedStart(d);
    }
  }, [value, isFilter]);

  const buildValue = (date: Date | null, customTime?: typeof savedTime) => {
    if (!date) return null;

    const d = new Date(date);
    const t = customTime ?? savedTime;

    if (!isFilter) {
      d.setHours(+t.hours, +t.minutes, +t.seconds, 0);
    } else {
      d.setHours(0, 0, 0, 0);
    }

    return d;
  };

  return {
    savedStart,
    savedEnd,
    savedTime,
    setSavedStart,
    setSavedEnd,
    setSavedTime,
    buildValue,
  };
}

function useDisplayValue(isFilter: boolean, mode: "single" | "range", savedStart: Date | null, savedEnd: Date | null, formatDateTime: (d: Date | null, isValue: boolean) => string) {
  if (isFilter) {
    if (mode === "range" && savedStart && savedEnd) {
      return `${formatFilterDate(savedStart)} / ${formatFilterDate(savedEnd)}`;
    }
    return savedStart ? formatFilterDate(savedStart) : "";
  }

  if (mode === "range" && savedStart && savedEnd) {
    return `${formatDateTime(savedStart, false)} / ${formatDateTime(savedEnd, false)}`;
  }

  return savedStart ? formatDateTime(savedStart, false) : "";
}

function TimeColumn({ value, onChange, range }: { value: string; onChange: (val: string) => void; range: number }) {
  const items = Array.from({ length: range }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="flex flex-col h-[335px] overflow-y-auto rounded no-scrollbar">
      {items.map((item) => (
        <button
          type="button"
          key={item}
          onClick={() => onChange(item)}
          className={`py-2 px-3 min-w-[40px] ${value === item ? "border-2 border-primary-main rounded-md text-white bg-primary-main" : "text-neutral-gray1 hover:bg-neutral-gray2 cursor-pointer"}`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export default function CustomDatePicker(props: CustomDatePickerProps) {
  const { placeholder, className, icon, mode = "single", onChange, value, isFilter = false, isFutureDisabled = false } = props;

  const { savedStart, savedEnd, savedTime, setSavedStart, setSavedEnd, setSavedTime, buildValue } = useDateState(value, isFilter);

  const [tempStart, setTempStart] = useState<Date | null>(null);
  const [tempEnd, setTempEnd] = useState<Date | null>(null);
  const [tempTime, setTempTime] = useState(savedTime);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isOpen) {
      setTempStart(savedStart);
      setTempEnd(savedEnd);
      setTempTime(savedTime);
    }
  }, [isOpen, savedStart, savedEnd, savedTime]);

  useLayoutEffect(() => {
    if (!isOpen || isMobile || !inputRef.current || !modalRef.current) return;

    const raf = requestAnimationFrame(() => {
      const inputRect = inputRef.current!.getBoundingClientRect();
      const modalRect = modalRef.current!.getBoundingClientRect();

      let top = inputRect.bottom + 8;
      let left = inputRect.left + inputRect.width / 2 - modalRect.width / 2;

      // clamp horizontal
      if (left < 10) left = 10;
      if (left + modalRect.width > window.innerWidth) {
        left = window.innerWidth - modalRect.width - 10;
      }

      // flip vertical
      if (top + modalRect.height > window.innerHeight) {
        top = inputRect.top - modalRect.height - 8;
      }

      // fallback
      if (top < 10) {
        top = inputRect.bottom + 8;
      }

      setPosition({ top, left });
    });

    const handleOutside = (e: MouseEvent) => {
      if (modalRef.current?.contains(e.target as Node) || inputRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [isOpen, isMobile]);

  const handleCalendarSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setTempStart(startDate);
    setTempEnd(mode === "single" ? null : endDate);
  };

  const formatDateTime = (date: Date | null, isValue: boolean) => {
    if (!date) return "";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return !isFilter ? `${formatDate({ date, isValue })}${hours}:${minutes}:${seconds}` : formatDate({ date, isValue });
  };

  const displayValue = useDisplayValue(isFilter, mode, savedStart, savedEnd, formatDateTime);

  const handleSave = () => {
    setIsOpen(false);
    setSavedStart(tempStart);
    setSavedEnd(tempEnd);
    setSavedTime(tempTime);

    if (!onChange) return;

    onChange({
      start: formatDateTime(buildValue(tempStart, tempTime), true),
      end: mode === "range" ? formatDateTime(buildValue(tempEnd, tempTime), true) : null,
    });
  };

  const selectionRange = {
    startDate: tempStart || new Date(),
    endDate: tempEnd || tempStart || new Date(),
    key: "selection",
  };

  const disabledApply = mode === "range" ? !tempStart || !tempEnd : !tempStart;

  const CalendarContent = (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {mode === "range" ? (
            <DateRange ranges={[selectionRange]} onChange={handleCalendarSelect} moveRangeOnFirstSelection={false} months={1} direction="vertical" maxDate={isFutureDisabled ? new Date() : undefined} />
          ) : (
            <Calendar date={tempStart || new Date()} onChange={(d: any) => setTempStart(d)} maxDate={isFutureDisabled ? new Date() : undefined} />
          )}
        </div>

        {!isFilter && !isMobile && (
          <div className="flex flex-col items-center justify-center min-w-[150px] py-3">
            <div className="flex gap-3 text-center h-full py-2">
              <TimeColumn value={tempTime.hours} onChange={(hours) => setTempTime((prev) => ({ ...prev, hours }))} range={24} />
              <span className="text-lg font-bold">:</span>
              <TimeColumn value={tempTime.minutes} onChange={(min) => setTempTime((prev) => ({ ...prev, minutes: min }))} range={60} />
              <span className="text-lg font-bold">:</span>
              <TimeColumn value={tempTime.seconds} onChange={(sec) => setTempTime((prev) => ({ ...prev, seconds: sec }))} range={60} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center w-full mt-4 gap-2">
        <Button text="Batal" className="w-1/2" variant="PLAIN" size="SMALL" onClick={() => setIsOpen(false)} />
        <Button text="Simpan" className="w-1/2" variant="PRIMARY" size="SMALL" onClick={handleSave} disabled={disabledApply} />
      </div>
    </>
  );

  return (
    <>
      <div className="relative">
        <input
          ref={inputRef}
          readOnly
          value={displayValue}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn("w-full border px-3 py-2 rounded-md cursor-pointer truncate overflow-x-hidden", "focus:outline-none focus:ring-1 focus:ring-primary-main focus:border-primary-main", className ?? "")}
        />

        <div className="absolute inset-y-0 right-3 flex items-center text-neutral-black">
          {displayValue ? (
            <button
              type="button"
              onClick={() => {
                setSavedStart(null);
                setSavedEnd(null);
                setSavedTime({
                  hours: "00",
                  minutes: "00",
                  seconds: "00",
                });
                onChange?.({ start: null, end: null });
              }}
              className="cursor-pointer"
            >
              <XCircle />
            </button>
          ) : (
            <div className="pointer-events-none">{icon || <ChevronDown />}</div>
          )}
        </div>
      </div>
      {isOpen &&
        createPortal(
          isMobile ? (
            <BottomSheetModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Pilih Tanggal">
       {CalendarContent}
       </BottomSheetModal>
          ) : (
            <div ref={modalRef} style={{ position: "absolute", ...position, zIndex: 9999 }} className="bg-white rounded-lg p-6 max-w-[720px] shadow-lg border overflow-hidden">
              {CalendarContent}
            </div>
          ),
          document.body,
        )}
    </>
  );
}
