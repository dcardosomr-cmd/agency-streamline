import { useState, useCallback } from "react";
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  subMonths,
  startOfToday 
} from "date-fns";
import { DateRange, DateRangePreset } from "@/types/dashboard";

export function useDateRange() {
  const today = startOfToday();
  
  const getPresetRange = useCallback((preset: DateRangePreset): DateRange => {
    switch (preset) {
      case "today":
        return {
          start: startOfDay(today),
          end: endOfDay(today),
        };
      case "thisWeek":
        return {
          start: startOfWeek(today, { weekStartsOn: 1 }),
          end: endOfWeek(today, { weekStartsOn: 1 }),
        };
      case "thisMonth":
        return {
          start: startOfMonth(today),
          end: endOfMonth(today),
        };
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        };
      case "custom":
        // Return current month as default for custom
        return {
          start: startOfMonth(today),
          end: endOfMonth(today),
        };
      default:
        return {
          start: startOfMonth(today),
          end: endOfMonth(today),
        };
    }
  }, [today]);

  const [preset, setPreset] = useState<DateRangePreset>("thisMonth");
  const [customRange, setCustomRange] = useState<DateRange | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(getPresetRange("thisMonth"));

  const updatePreset = useCallback((newPreset: DateRangePreset) => {
    setPreset(newPreset);
    if (newPreset !== "custom") {
      setCustomRange(null);
      setDateRange(getPresetRange(newPreset));
    }
  }, [getPresetRange]);

  const updateCustomRange = useCallback((range: DateRange) => {
    setPreset("custom");
    setCustomRange(range);
    setDateRange(range);
  }, []);

  return {
    preset,
    dateRange,
    customRange,
    updatePreset,
    updateCustomRange,
  };
}

