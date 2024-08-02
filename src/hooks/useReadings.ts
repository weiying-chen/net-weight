import { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import { Reading } from "../types";

function toCamelCaseReading(reading: any): Reading {
  return {
    id: reading.id,
    weight: reading.weight,
    createdAt: reading.created_at,
    deviceId: reading.device_id,
  };
}

export function useReadings() {
  const [reading, setReading] = useState<Reading[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("readings")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        const camelCaseReadings = data.map(toCamelCaseReading);
        setReading(camelCaseReadings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    // Subscribe to changes in the 'readings' table
    const subscription = supabase
      .channel("realtime:public:readings")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "readings" },
        (payload) => {
          console.log("New reading received!", payload);
          const newReading = toCamelCaseReading(payload.new);
          setReading((prevReading) => [newReading, ...prevReading]);
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return reading;
}
