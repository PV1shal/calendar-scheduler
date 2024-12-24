"use client";

import { useEffect, useState } from "react";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  CalendarIcon,
} from "lucide-react";
import EventModal from "./EventModalComponent";
import { getAllEvents } from "@/services/SupabaseServices";
import { DateCard, EventCard, HourCard } from "./CustomCards";

interface Event {
  title: string;
  time: string;
  date: Date;
}

interface SupabaseEventData {
  id: string;
  create_at: string;
  time: string;
  title: string;
}

export default function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date()); // hold current date
  const startOfCurrentWeek = startOfWeek(currentDate); // to track start of current week for top header bar
  const [events, setEvents] = useState<Event[]>([]);
  const [open, setOpen] = useState(false); // Schedule Modal state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Calling fetch on schedule modal close to get latest events.
  useEffect(() => {
    const fetchEvents = async () => {
      const fetchedEvents = await getAllEvents();
      if (fetchedEvents) {
        const formattedEvents = (fetchedEvents as SupabaseEventData[]).map(
          (event) => {
            const eventDate = new Date(event.time);
            const timezoneOffset = eventDate.getTimezoneOffset();
            eventDate.setMinutes(eventDate.getMinutes() - timezoneOffset);

            return {
              id: event.id,
              title: event.title,
              time: format(eventDate, "hh:mmaaa 'PST'"),
              date: eventDate,
            };
          }
        );
        setEvents(formattedEvents);
      }
    };
    fetchEvents();
  }, [open, setOpen]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setOpen(true);
  };

  // creates an array of 24 hrs in 12hr time format
  const hours = Array.from({ length: 24 }, (_, i) => i % 12 || 12);

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "prev" ? addDays(prev, -7) : addDays(prev, 7)
    );
  };


  const shouldDisplayEvent = (eventDate: Date, columnDate: Date) => {
    return isSameDay(eventDate, columnDate);
  };

  return (
    <div className="p-6 h-[90vh]">
      <div className="mb-4">
        <h1 className="mb-4 text-2xl font-semibold">Scheduled Suites</h1>
        <div className="flex items-center gap-3">
          <EventModal
            open={open}
            setOpen={setOpen}
            eventToEdit={selectedEvent}
            onModalClose={() => setSelectedEvent(null)}
          />
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
            return <DateCard key={i} date={date} />;
          })}
        </div>

        <div className="grid grid-cols-8">
          <div className="border-r">
            <div className="h-4" />
            {hours.map((hour, i) => (
              <HourCard key={`${hour}-${i < 12 ? "AM" : "PM"}`} hour={hour} index={i} />
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
                    const style = {
                      top: `${eventHour * 80 + (eventMinute / 60) * 80 + 16}px`,
                      height: "75px",
                    };

                    return (
                      <EventCard
                        key={eventIndex}
                        event={event}
                        onClick={() => handleEventClick(event)}
                        style={style}
                      />
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