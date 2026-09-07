"use client"

import { DAYS, getDaysInMonth, getFirstDayOfMonth, isSameDay, isToday } from "@/src/lib/date-utils"
import { Button } from "../../ui/button"
import { cn } from "@/src/lib/utils"




interface CalendarGridProps {
  year: number
  month: number
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

export function CalendarGrid({
  year,
  month,
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  disabled,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  const days = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="p-2" />)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const isSelected = selectedDate && isSameDay(date, selectedDate)
    const isTodayDate = isToday(date)
    const isDisabled = disabled || (minDate && date < minDate) || (maxDate && date > maxDate)

    days.push(
      <Button
        key={day}
        variant={isSelected ? "default" : "ghost"}
        size="sm"
        className={cn(
          "h-9 w-9 p-0 font-normal",
          isTodayDate && !isSelected && "bg-accent text-accent-foreground",
          isSelected && "bg-primary text-primary-foreground hover:bg-primary/90",
          isDisabled && "opacity-50 cursor-not-allowed",
        )}
        onClick={() => !isDisabled && onDateSelect(date)}
        disabled={isDisabled}
      >
        {day}
      </Button>,
    )
  }

  return (
    <div className="space-y-3">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div key={day} className="h-9 w-9 flex items-center justify-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  )
}
