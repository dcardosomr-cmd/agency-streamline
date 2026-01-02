import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRangePreset, DateRange } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  preset: DateRangePreset;
  dateRange: DateRange;
  onPresetChange: (preset: DateRangePreset) => void;
  onCustomRangeChange: (range: DateRange) => void;
}

export function DateRangeFilter({
  preset,
  dateRange,
  onPresetChange,
  onCustomRangeChange,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presets: { value: DateRangePreset; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "thisWeek", label: "This Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
        {presets.slice(0, 4).map((p) => (
          <button
            key={p.value}
            onClick={() => onPresetChange(p.value)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
              preset === p.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange ? (
              <>
                {format(dateRange.start, "MMM d")} - {format(dateRange.end, "MMM d, yyyy")}
              </>
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.start}
            selected={{
              from: dateRange.start,
              to: dateRange.end,
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                onCustomRangeChange({
                  start: range.from,
                  end: range.to,
                });
                onPresetChange("custom");
                setIsOpen(false);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

