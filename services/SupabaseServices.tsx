import { createClient } from "@supabase/supabase-js";

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
  try {
    const { data, error } = await supabase
      .from("events")
      .insert([event]); 

    if (error) {
      console.error("Error creating event:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Unexpected error creating event:", err);
    return null;
  }
};
