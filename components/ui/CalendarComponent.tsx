"use client";

import { useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  CalendarIcon,
  PlusIcon
} from "lucide-react";

export default function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date()); // To track the current date
  const startOfCurrentWeek = startOfWeek(currentDate);  // To track the start date of the current week

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) =>
      direction === "prev" ? addDays(prev, -7) : addDays(prev, 7)
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Scheduled Suites</h1>
        <div className="flex items-center gap-2">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon /> Schedule Test
          </Button>
          <div className="flex items-center gap-2 rounded-md border p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateWeek("prev")}
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
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
