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
}

export default function CalendarBirthday({ onChange }: CalendarBirthdayProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(undefined)

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
              date.toLocaleDateString()
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
              onChange(date ? date.toISOString().split('T')[0] : '')
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
