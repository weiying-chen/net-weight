import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

// Define the type for the data structure
type Message = {
  id: number;
  content: string;
  createdAt: string;
};

const useMessages = () => {
  const [data, setData] = useState<Message[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("messages") // Use the type for the table
          .select("*")
          .order("createdAt", { ascending: false }); // Order by createdAt in descending order

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
      .channel("realtime:public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          console.log("New message received!", payload);
          const newMessage = payload.new as Message; // Type assertion
          setData((prevData) => [newMessage, ...prevData]);
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

export default useMessages;
