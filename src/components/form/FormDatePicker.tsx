"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/src/lib/utils"
import { formatDate } from "@/src/lib/date-utils"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MonthSelector } from "../common/date/month-selector"
import { YearSelector } from "../common/date/year-selector"
import { CalendarGrid } from "../common/date/calender-grid"
import { Separator } from "@/components/ui/separator"



interface FormDatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  minYear?: number
  maxYear?: number
  disabled?: boolean
  className?: string
}

export function FormDatePicker({
  value,
  onChange,
  placeholder = "dd-mm-yyyy",
  minDate,
  maxDate,
  minYear,
  maxYear,
  disabled,
  className,
}: FormDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? new Date().getMonth())
  const [viewYear, setViewYear] = useState(value?.getFullYear() ?? new Date().getFullYear())

  const handleDateSelect = (date: Date) => {
    onChange?.(date)
    setIsOpen(false)
  }

  const handleMonthChange = (month: number) => {
    setViewMonth(month)
  }

  const handleYearChange = (year: number) => {
    setViewYear(year)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (viewMonth === 0) {
        setViewMonth(11)
        setViewYear(viewYear - 1)
      } else {
        setViewMonth(viewMonth - 1)
      }
    } else {
      if (viewMonth === 11) {
        setViewMonth(0)
        setViewYear(viewYear + 1)
      } else {
        setViewMonth(viewMonth + 1)
      }
    }
  }

  const handleToday = () => {
    const today = new Date()
    setViewMonth(today.getMonth())
    setViewYear(today.getFullYear())
    handleDateSelect(today)
  }

  const handleClear = () => {
    onChange?.(undefined)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger >
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex items-center justify-between text-left text-sm disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-[#8A8A8A]",
            !value ? "text-[#8A8A8A]" : "text-black",
            className,
          )}
          style={{
            width: 366,
            height: 38,
            borderRadius: 7,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "#E9E9E9",
            background: "#D2D2D2",
            paddingTop: 6,
            paddingBottom: 6,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          <span className="truncate">{value ? formatDate(value) : placeholder}</span>
          <CalendarIcon className="h-4 w-4 shrink-0 text-black" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-2">
                <MonthSelector value={viewMonth} onChange={handleMonthChange} />
                <YearSelector value={viewYear} onChange={handleYearChange} minYear={minYear} maxYear={maxYear} />
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => navigateMonth("prev")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 bg-transparent"
                  onClick={() => navigateMonth("next")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <CalendarGrid
              year={viewYear}
              month={viewMonth}
              selectedDate={value}
              onDateSelect={handleDateSelect}
              minDate={minDate}
              maxDate={maxDate}
            />
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={handleToday} className="text-xs bg-transparent">
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
