import { useState, useEffect } from "react";
import supabase from "./supabaseClient";
import Card from "./Card"; // Import the MessageCard component

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
  }, []);

  return (
    <div className="p-4 flex justify-center">
      <div className="bg-white border border-gray-600 rounded-3xl [box-shadow:4px_4px_0px_rgba(0,0,0,0.1)] w-full max-w-2xl">
        <img
          src="https://via.placeholder.com/600x300"
          alt="Placeholder Image"
          className="w-full h-auto rounded-t-3xl"
        />
        <div className="py-6">
          <h2 className="font-semibold text-2xl text-center">Toast</h2>
          {data.length > 0 && (
            <>
              <Card message={data[0]} isLastMessage />
              {data.slice(1).map((message) => (
                <div key={message.id}>
                  <hr className="my-4 border-gray-300" />
                  <Card message={message} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
