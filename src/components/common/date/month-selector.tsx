"use client"

import { MONTHS } from "@/src/lib/date-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"



interface MonthSelectorProps {
  value: number
  onChange: (month: number) => void
  disabled?: boolean
}

export function MonthSelector({ value, onChange, disabled }: MonthSelectorProps) {
  return (
    <Select value={String(value)} onValueChange={(val) => onChange(Number.parseInt(val ?? String(value)))} disabled={disabled}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Month" />
      </SelectTrigger>
      <SelectContent>
        {MONTHS.map((month, index) => (
          <SelectItem key={index} value={index.toString()}>
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
