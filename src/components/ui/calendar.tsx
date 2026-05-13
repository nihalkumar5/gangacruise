"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 sm:p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-3",
        month_caption: "relative mb-2 flex items-center justify-center py-0.5",
        caption_label:
          "pointer-events-none flex h-11 min-w-[5.75rem] items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-2 text-[0.95rem] font-semibold tracking-[0.01em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        nav: "absolute right-0 top-0 flex items-center gap-1.5",
        dropdowns: "flex items-center justify-center gap-2",
        dropdown_root: "relative block",
        dropdown:
          "absolute inset-0 z-10 h-full w-full cursor-pointer appearance-none opacity-0 outline-none",
        months_dropdown: "min-w-[9.5rem]",
        years_dropdown: "min-w-[5.75rem]",
        chevron: "shrink-0 text-white/45",
        button_previous: cn(
          "grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-cyan-200 transition-all hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-100"
        ),
        button_next: cn(
          "grid size-8 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-cyan-200 transition-all hover:border-cyan-300/25 hover:bg-cyan-300/10 hover:text-cyan-100"
        ),
        month_grid: "w-full border-collapse",
        weekdays: "mb-1.5 grid grid-cols-7 gap-1",
        weekday:
          "grid h-8 place-items-center text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-white/34",
        weeks: "space-y-1",
        week: "grid w-full grid-cols-7 gap-1",
        day: cn(
          "grid h-9 w-9 place-items-center rounded-2xl p-0 text-center text-[0.92rem] font-medium text-white/72 transition-all duration-200 hover:bg-white/10 hover:text-white focus-within:relative focus-within:z-20 sm:h-10 sm:w-10"
        ),
        day_button:
          "grid size-full place-items-center rounded-[inherit] font-inherit text-inherit disabled:cursor-not-allowed disabled:opacity-100",
        today:
          "border border-cyan-300/35 bg-cyan-300/10 text-cyan-100 shadow-[0_0_0_1px_rgba(103,232,249,0.08)_inset]",
        selected:
          "bg-gradient-to-br from-cyan-200 via-cyan-300 to-sky-300 !text-slate-950 shadow-[0_12px_30px_-14px_rgba(103,232,249,0.95)] hover:from-cyan-200 hover:via-cyan-300 hover:to-sky-300 hover:!text-slate-950 focus:from-cyan-200 focus:via-cyan-300 focus:to-sky-300 focus:!text-slate-950",
        outside: "text-white/10 opacity-60 pointer-events-none",
        disabled: "text-white/15 opacity-50 pointer-events-none",
        hidden: "invisible",
        ...classNames,
      }}
      disabled={{ before: new Date() }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") return <ChevronLeft className="h-4 w-4" />
          if (props.orientation === "down") return <ChevronRight className="h-4 w-4 rotate-90" />
          return <ChevronRight className="h-4 w-4" />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
