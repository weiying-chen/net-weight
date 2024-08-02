import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

export type Device = {
  id: number;
  created_at: string;
  device_id: string;
  name: string;
};

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data, error } = await supabase.from("devices").select("*");

        if (error) {
          throw error;
        }

        setDevices(data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();

    // Subscribe to changes in the 'devices' table
    const subscription = supabase
      .channel("realtime:public:devices")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "devices" },
        (payload) => {
          console.log("Device updated!", payload);
          const updatedDevice = payload.new as Device; // Type assertion
          setDevices((prevDevices) =>
            prevDevices.map((d) =>
              d.id === updatedDevice.id ? updatedDevice : d,
            ),
          );
        },
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return devices;
}
