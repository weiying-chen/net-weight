import useMessages from "./hooks/useData";
import Card from "./components/Card";

type Message = {
  id: number;
  item: string;
  weight: number;
  createdAt: string;
};

function App() {
  const data = useMessages();

  // Group data by item
  const groupedData = data.reduce(
    (acc: Record<string, Message[]>, message: Message) => {
      if (!acc[message.item]) {
        acc[message.item] = [];
      }
      acc[message.item].push(message);
      return acc;
    },
    {},
  );

  return (
    <div className="p-4 flex justify-center">
      {Object.keys(groupedData).map((item) => (
        <div
          key={item}
          className="bg-white border-[#083355] border-[1.5px] rounded-3xl [box-shadow:4px_4px_0px_rgba(0,0,0,0.1)] w-full max-w-2xl mb-6"
        >
          <img
            src="https://via.placeholder.com/600x300"
            alt="Placeholder Image"
            className="w-full h-auto rounded-t-3xl"
          />
          <div className="py-6">
            <h2 className="font-semibold tracking-tight text-4xl text-center">
              {item}
            </h2>
            {groupedData[item].length > 0 && (
              <>
                <Card message={groupedData[item][0]} isLastMessage />
                {groupedData[item].slice(1).map((message) => (
                  <div key={message.id}>
                    <hr className="my-4 border-gray-300" />
                    <Card message={message} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
