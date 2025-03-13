"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

interface MonthYearPickerProps {
  value: { month: string; year: string }
  onChange: (value: { month: string; year: string }) => void
}

export function MonthYearPicker({ value, onChange }: MonthYearPickerProps) {
  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ]

  // Generate years array (5 years back from current year)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => 
    (currentYear - 4 + i).toString()
  ).reverse() // Reverse to show oldest first

  return (
    <div className="flex gap-2">
      <Select
        value={value.month}
        onValueChange={(month) => onChange({ ...value, month })}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Pilih bulan" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={value.year}
        onValueChange={(year) => onChange({ ...value, year })}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Tahun" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}