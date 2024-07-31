import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

type Reading = {
  id: number;
  weight: number;
  created_at: string;
  device_id: string;
};

const useData = () => {
  const [data, setData] = useState<Reading[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("readings") // Use the type for the table
          .select("*")
          .order("created_at", { ascending: false }); // Order by createdAt in descending order

        if (error) {
          throw error;
        }

        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Subscribe to changes in the 'messages' table
    const subscription = supabase
      .channel("realtime:public:readings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "readings" },
        (payload) => {
          console.log("New message received!", payload);
          const newReading = payload.new as Reading; // Type assertion
          setData((prevData) => [newReading, ...prevData]);
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return data;
};

export default useData;
