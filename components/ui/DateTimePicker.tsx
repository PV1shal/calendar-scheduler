import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DateTimePickerProps {
  date: Date | null;
  setDate: (date: Date) => void;
}

export default function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date ? new Date(date) : undefined);
  const [hour, setHour] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");
  const [amPm, setAmPm] = useState<"AM" | "PM">("AM");

  // Update selected date whenever hour, minute, or am/pm changes
  useEffect(() => {
    if (selectedDate) {
      const updatedDate = new Date(selectedDate);
      let hourIn24 = parseInt(hour) % 12;
      if (amPm === "PM") hourIn24 += 12;

      updatedDate.setHours(hourIn24);
      updatedDate.setMinutes(parseInt(minute));
      setDate(updatedDate);
      console.log("Selected Time:", updatedDate, updatedDate.toISOString());
    }
  }, [hour, minute, amPm, selectedDate, setDate]);

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setHour("");
      return;
    }

    let numValue = parseInt(value, 10);
    if (numValue > 12) numValue = 12;
    if (numValue < 1) numValue = 12;

    const formattedHour = numValue.toString().padStart(2, "0");
    setHour(formattedHour);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value === "") {
      setMinute("");
      return;
    }

    let numValue = parseInt(value, 10);
    if (numValue > 59) numValue = 59;
    if (numValue < 0) numValue = 0;

    const formattedMinute = numValue.toString().padStart(2, "0");
    setMinute(formattedMinute);
  };

  const handleAmPmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAmPm = e.target.value as "AM" | "PM";
    setAmPm(newAmPm);
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="w-full">
        <Button variant="ghost">
          {selectedDate
            ? `${selectedDate.toLocaleDateString()} ${hour}:${minute} ${amPm}`
            : "Select Date & Time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Select Date and Time</h4>
          </div>

          {/* Calendar */}
          <div className="w-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>

          {/* Time Inputs */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="hour">Hour</Label>
              <Input
                id="hour"
                value={hour}
                onChange={handleHourChange}
                className="h-8"
                type="text"
                placeholder="01-12"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="minute">Minute</Label>
              <Input
                id="minute"
                value={minute}
                onChange={handleMinuteChange}
                className="h-8"
                type="text"
                placeholder="00-59"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="amPm">AM/PM</Label>
              <select
                id="amPm"
                value={amPm}
                onChange={handleAmPmChange}
                className="h-8 w-full rounded-md border border-input bg-transparent px-3 py-1"
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
