"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CalendarBirthdayProps {
  onChange: (date: string) => void
  selected?: string
}

// Parse YYYY-MM-DD as a local date; new Date("YYYY-MM-DD") is UTC midnight and
// shows as the previous day for users west of UTC
function parseLocalDate(value?: string): Date | undefined {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return undefined
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

export default function CalendarBirthday({ onChange, selected }: CalendarBirthdayProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(parseLocalDate(selected))

  // Mirror the parent's value both ways, including clears, so the button never shows a stale date
  React.useEffect(() => {
    setDate(parseLocalDate(selected))
  }, [selected])

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
            >
            {date ? (
              date.toLocaleDateString('en-GB')
            ) : (
              <span className="text-muted-foreground">Select a date</span>
            )}
            <ChevronDownIcon />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              onChange(date
                  ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
                  : ''
                )
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
