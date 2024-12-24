import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";

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
  console.log(time, new Date(time).toISOString())
  const groupId = uuidv4();

  if (selectedDays.length === 1) {
    try {
      const { data, error } = await supabase.from("events").insert([
        {
          title,
          time: new Date(time).toISOString(),
          group_id: groupId,
        },
      ])
      .select("id");

      if (error) {
        console.error("Error creating non-recurring event:", error);
        return null;
      }

      console.log("Created non-recurring event:", data);
      return data;
    } catch (err) {
      console.error("Unexpected error creating non-recurring event:", err);
      return null;
    }
  }
};
