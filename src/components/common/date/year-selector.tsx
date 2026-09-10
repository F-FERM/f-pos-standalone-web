"use client"

import { generateYearRange } from "@/src/lib/date-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"


interface YearSelectorProps {
  value: number
  onChange: (year: number) => void
  minYear?: number
  maxYear?: number
  disabled?: boolean
}

export function YearSelector({ value, onChange, minYear, maxYear, disabled }: YearSelectorProps) {
  const years = generateYearRange(minYear, maxYear)

  return (
    <Select value={String(value)} onValueChange={(val) => onChange(Number.parseInt(val ?? String(value)))} disabled={disabled}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Year" />
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
