import { format } from "date-fns";

interface DateCardProps {
  date: Date;
}

interface Event {
  id?: string;
  title: string;
  time: string;
  date: Date;
  selectedDays?: string[];
}

export const DateCard: React.FC<DateCardProps> = ({ date }) => (
  <div className="border border-gray-300 bg-gray-100 p-2 text-center">
    <div className="text-sm font-medium">{format(date, "dd")}</div>
    <div className="text-xs text-muted-foreground">{format(date, "EEE")}</div>
  </div>
);

interface HourCardProps {
  hour: number;
  index: number;
}

export const HourCard: React.FC<HourCardProps> = ({ hour, index }) => {
  const formatTimeLabel = (hour: number, index: number) => {
    if (index === 0) return "PST";
    return `${hour.toString().padStart(2, "0")}:00 ${index < 12 ? "AM" : "PM"}`;
  };

  return (
    <div className="relative h-20 text-xs text-muted-foreground">
      <span className="absolute -top-2.5 right-8">
        {formatTimeLabel(hour, index)}
      </span>
    </div>
  );
};

import { Clock3Icon } from "lucide-react";

interface EventCardProps {
  event: Event;
  onClick: () => void;
  style: React.CSSProperties;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onClick,
  style,
}) => (
  <div
    className="absolute z-10 left-0 right-0 mx-1 rounded bg-[#e5eafb] p-2 border-2 border-[#0435DD] cursor-pointer hover:bg-[#d0dafc]"
    style={style}
    onClick={onClick}
  >
    <div className="text-sm font-bold text-[#0435DD]">{event.title}</div>
    <div className="flex text-xs text-[#0435DD]">
      <Clock3Icon size={16} className="mr-1" /> {event.time}
    </div>
  </div>
);
