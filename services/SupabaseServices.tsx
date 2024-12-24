import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { addDays, setHours, setMinutes, isBefore, isSameDay } from 'date-fns';

const supabaseUrl = "https://oxkgqjyymfahoqoelmqn.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const getAllEvents = async () => {
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

export const createEvent = async (event) => {
  const { title, time, selectedDays } = event;
  const groupId = uuidv4();
  const eventsToInsert = [];
  
  // Calculate events for 8 weeks (2 months)
  for (let week = 0; week < 8; week++) {
    const weekStartDate = new Date(time);
    weekStartDate.setDate(weekStartDate.getDate() + (week * 7));
    
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
    const { data, error } = await supabase
      .from('events')
      .insert(eventsToInsert)
      .select('id');
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Error creating recurring events:', err);
    return null;
  }
};

const getNextOccurrence = (startDate, targetDay) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDayIndex = startDate.getDay();
  const targetDayIndex = daysOfWeek.indexOf(targetDay);
  let daysToAdd = targetDayIndex - currentDayIndex;
  
  // If target day is before or same as current day, move to next week
  if (daysToAdd < 0) {
    daysToAdd += 7;
  }
  
  const nextOccurrence = new Date(startDate);
  nextOccurrence.setDate(startDate.getDate() + daysToAdd);
  nextOccurrence.setHours(startDate.getHours());
  nextOccurrence.setMinutes(startDate.getMinutes());
  
  return nextOccurrence;
};