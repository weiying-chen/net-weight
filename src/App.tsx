import useData from "./hooks/useData";
import Card from "./components/Card";

function App() {
  const data = useData();

  return (
    <div className="p-4 flex justify-center">
      <div className="bg-white border-[#083355] border-[1.5px] rounded-3xl [box-shadow:4px_4px_0px_rgba(0,0,0,0.1)] w-full max-w-2xl">
        <img
          src="https://via.placeholder.com/600x300"
          alt="Placeholder Image"
          className="w-full h-auto rounded-t-3xl"
        />
        <div className="py-6">
          <h2 className="font-semibold tracking-tight text-4xl text-center">
            Toast
          </h2>
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
