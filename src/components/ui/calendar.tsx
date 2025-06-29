import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  selectedDates?: Date[];
};

function Calendar({
                    className,
                    classNames,
                    showOutsideDays = true,
                    selectedDates = [],
                    ...props
                  }: CalendarProps) {

  const modifiers = {
    apiSelected: selectedDates,
    otherMonthWeekdays: (day: Date) =>
        day.getMonth() !== new Date().getMonth() && day.getDay() !== -7 && day.getDay() !== 7, // Weekdays from other months
  };

  return (
      <DayPicker
          showOutsideDays={showOutsideDays}
          className={cn("p-3", className)}
          modifiers={modifiers}
          modifiersClassNames={{
            apiSelected: "bg-green-600 text-white hover:bg-green-400",
            otherMonthWeekdays: "text-gray-400",
          }}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: cn(
                "relative p-0 w-full text-center text-sm focus-within:relative focus-within:z-20",
                "[&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                props.mode === "range"
                    ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
                    : "[&:has([aria-selected])]:rounded-md"
            ),
            day: cn(
                buttonVariants({ variant: "ghost" }),
                "h-8 w-8 p-0 text-[17px] font-normal aria-selected:opacity-100"
            ),
            day_selected:
                "bg-green-400 text-white hover:text-stone-950 hover:bg-green-100",
            // day_today: "bg-accent text-accent-foreground",
            day_today: "border border-green-400 rounded-[50%] text-accent-foreground ",
            day_outside: "day-outside text-muted-foreground",
            day_disabled: "text-muted-foreground opacity-50",
            ...classNames,
          }}
          components={{
            IconLeft: ({ className, ...props }) => (
                <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
            ),
            IconRight: ({ className, ...props }) => (
                <ChevronRight className={cn("h-4 w-4", className)} {...props} />
            ),
          }}
          {...props}
      />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
