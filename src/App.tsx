import useData from "./hooks/useData";
import Card from "./components/Card";
import { groupBy } from "./utils";

function App() {
  const data = useData();
  const groupedData = groupBy(data, "item");

  return (
    <div className="p-4 flex justify-center">
      {Object.keys(groupedData).map((item) => (
        <Card key={item} item={item} readings={groupedData[item]} />
      ))}
    </div>
  );
}

export default App;
