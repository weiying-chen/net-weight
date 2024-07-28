import { useState, useEffect } from "react";
import supabase from "./supabaseClient";

// Define the type for the data structure
type Message = {
  id: number;
  content: string;
  createdAt: string;
};

function App() {
  // Initialize state with the correct type
  const [data, setData] = useState<Message[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("messages") // Use the type for the table
          .select("*");

        if (error) {
          throw error;
        }

        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 flex justify-center">
      <div className="bg-white border border-gray-400 rounded-2xl p-6 [box-shadow:4px_4px_0px_rgba(0,0,0,0.1)] w-full max-w-2xl space-y-6">
        {data.length > 0 && (
          <>
            <div>
              <h2 className="text-2xl font-semibold">
                Message ID: {data[data.length - 1].id}
              </h2>
              <p className="text-lg text-gray-800">
                {data[data.length - 1].content}
              </p>
              <p className="text-gray-500 text-sm">
                Created at:{" "}
                {new Date(data[data.length - 1].createdAt).toLocaleString()}
              </p>
            </div>
            <div className="border-t border-gray-300 pt-4 space-y-4">
              {data.slice(0, -1).map((message) => (
                <div key={message.id} className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Message ID: {message.id}
                  </p>
                  <p className="text-sm text-gray-500">{message.content}</p>
                  <p className="text-xs text-gray-400">
                    Created at: {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
