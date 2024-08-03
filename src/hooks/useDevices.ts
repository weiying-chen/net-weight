import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

export type Device = {
  id: number;
  createdAt: string;
  deviceId: string;
  name: string;
};

function toCamelCaseDevice(device: any): Device {
  return {
    id: device.id,
    createdAt: device.created_at,
    deviceId: device.device_id,
    name: device.name,
  };
}

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);

  const updateDevice = async (id: number, name: string) => {
    try {
      const { error } = await supabase
        .from("devices")
        .update({ name })
        .eq("id", id);

      if (error) {
        throw error;
      }

      console.log("Device updated");
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const { data, error } = await supabase.from("devices").select("*");

        if (error) {
          throw error;
        }

        const camelCaseDevices = data.map(toCamelCaseDevice);
        setDevices(camelCaseDevices);
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
          const updatedDevice = toCamelCaseDevice(payload.new);
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

  return { devices, updateDevice };
}
