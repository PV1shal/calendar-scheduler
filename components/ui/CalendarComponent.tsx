"use client";

import { useEffect, useState } from "react";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  CalendarIcon,
  PlusIcon,
} from "lucide-react";

interface Event {
  title: string;
  time: string;
  date: Date;
}

export default function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfCurrentWeek = startOfWeek(currentDate);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const events: Event[] = [
      {
        title: "Demo Suite",
        time: "11:00AM PST",
        date: new Date(2024, 11, 15, 11, 0),
      },
      {
        title: "Authentication",
        time: "8:02AM PST",
        date: new Date(2024, 11, 18, 8, 2),
      },
    ];
    setEvents(events);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i % 12 || 12);

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "prev" ? addDays(prev, -7) : addDays(prev, 7)
    );
  };

  const formatTimeLabel = (hour: number, index: number) => {
    if (index === 0) return "PST";
    return `${hour.toString().padStart(2, "0")}:00 ${index < 12 ? "AM" : "PM"}`;
  };

  const shouldDisplayEvent = (eventDate: Date, columnDate: Date) => {
    return isSameDay(eventDate, columnDate);
  };

  return (
    <div className="p-6 h-[90vh]">
      <div className="mb-4">
        <h1 className="mb-4 text-2xl font-semibold">Scheduled Suites</h1>
        <div className="flex items-center gap-3">
          <Button className="bg-[#0040FF] hover:bg-[#0040FF]/90">
            <PlusIcon className="mr-2 h-4 w-4" />
            Schedule Test
          </Button>
          <div className="flex items-center gap-2 rounded-md border bg-white p-1.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek("prev")}
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Week of {format(startOfCurrentWeek, "MM/dd/yy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek("next")}
              className="h-7 w-7"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg m-8 h-full overflow-auto">
        <div className="grid grid-cols-8 sticky top-0 z-20 bg-white">
          <div className="border-r border-transparent bg-white" />
          {Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(startOfCurrentWeek, i);
            return (
              <div
                key={i}
                className="border border-gray-300 bg-gray-100 p-2 text-center"
              >
                <div className="text-sm font-medium">{format(date, "dd")}</div>
                <div className="text-xs text-muted-foreground">
                  {format(date, "EEE")}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-8">
          <div className="border-r">
            <div className="h-4" />
            {hours.map((hour, i) => (
              <div
                key={`${hour}-${i < 12 ? "AM" : "PM"}`}
                className="relative h-20 text-xs text-muted-foreground"
              >
                <span className="absolute -top-2.5 right-8">
                  {formatTimeLabel(hour, i)}
                </span>
              </div>
            ))}
          </div>

          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const columnDate = addDays(startOfCurrentWeek, dayIndex);
            
            return (
              <div key={dayIndex} className="relative last:border-r-0">
                <div className="h-4 border-r" />
                {hours.map((hour, i) => (
                  <div
                    key={`${hour}-${i < 12 ? "AM" : "PM"}-${dayIndex}`}
                    className="h-20 border-b border-r border-gray-300 last:border-b-0"
                  />
                ))}
                {events.map((event, eventIndex) => {
                  if (shouldDisplayEvent(event.date, columnDate)) {
                    const eventHour = event.date.getHours();
                    const eventMinute = event.date.getMinutes();
                    
                    return (
                      <div
                        key={eventIndex}
                        className="absolute z-10 left-0 right-0 mx-1 rounded bg-blue-100 p-2 border border-blue-200"
                        style={{
                          top: `${(eventHour * 80) + (eventMinute / 60) * 80 + 16}px`,
                          height: "75px",
                        }}
                      >
                        <div className="text-sm font-medium text-blue-700">
                          {event.title}
                        </div>
                        <div className="text-xs text-blue-600">{event.time}</div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}