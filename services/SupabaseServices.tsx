import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabaseUrl = "https://oxkgqjyymfahoqoelmqn.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Define types for event data
interface Event {
  title: string;
  time: string; // ISO string format
  selectedDays: string[]; // Days like ["Mon", "Tue"]
}

interface EventWithId extends Event {
  id: string;
}

export const getAllEvents = async (): Promise<unknown[] | null> => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("time", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return null;
    }

    console.log(data);
    return data;
  } catch (err) {
    console.error("Unexpected error fetching events:", err);
    return null;
  }
};

export const createEvent = async (event: Event): Promise<unknown[] | null> => {
  const { title, time, selectedDays } = event;
  const groupId = uuidv4();
  const eventsToInsert = [];

  // Calculate events for 8 weeks (2 months)
  for (let week = 0; week < 8; week++) {
    const weekStartDate = new Date(time);
    weekStartDate.setDate(weekStartDate.getDate() + week * 7);

    for (const day of selectedDays) {
      const nextOccurrence = getNextOccurrence(weekStartDate, day);
      eventsToInsert.push({
        title,
        time: nextOccurrence.toISOString(),
        group_id: groupId,
      });
    }
  }

  try {
    const { error } = await supabase
      .from("events")
      .insert(eventsToInsert)
      .select("id");

    if (error) throw error;
    return eventsToInsert;
  } catch (err) {
    console.error("Error creating recurring events:", err);
    return null;
  }
};

const getNextOccurrence = (startDate: Date, targetDay: string): Date => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDayIndex = startDate.getDay();
  const targetDayIndex = daysOfWeek.indexOf(targetDay);
  let daysToAdd = targetDayIndex - currentDayIndex;

  if (daysToAdd < 0) {
    daysToAdd += 7;
  }

  const nextOccurrence = new Date(startDate);
  nextOccurrence.setDate(startDate.getDate() + daysToAdd);
  nextOccurrence.setHours(startDate.getHours());
  nextOccurrence.setMinutes(startDate.getMinutes());

  return nextOccurrence;
};

export const updateEvent = async (
  event: EventWithId
): Promise<unknown[] | null> => {
  console.log("Updating event: ", event);
  const { id, title, time, selectedDays } = event;

  try {
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("group_id, time")
      .eq("id", id)
      .single();

    if (eventError) throw eventError;
    if (!eventData?.group_id) {
      console.error("No group_id found for event");
      return null;
    }

    const nextOccurrence = getNextOccurrence(
      new Date(eventData.time),
      selectedDays[0]
    );

    nextOccurrence.setHours(new Date(time).getHours());
    nextOccurrence.setMinutes(new Date(time).getMinutes());

    const { data, error } = await supabase
      .from("events")
      .update({
        title,
        time: nextOccurrence.toISOString(),
      })
      .eq("id", id)
      .select("id");

    if (error) throw error;

    return data;
  } catch (err) {
    console.error("Error updating event:", err);
    return null;
  }
};

export const deleteEvent = async (eventId: string): Promise<boolean | null> => {
  try {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) throw error;

    return true;
  } catch (err) {
    console.error("Error deleting recurring events:", err);
    return null;
  }
};
