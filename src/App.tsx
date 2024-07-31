import { Reading } from "./types";
import useData from "./hooks/useData";
import Card from "./components/Card";
import { groupBy, toCamelCase } from "./utils";

function App() {
  const data = useData();
  const camelCaseData = toCamelCase(data) as Reading[];
  const groupedData = groupBy(camelCaseData, "deviceId");

  return (
    <div className="p-4 flex justify-center">
      {Object.keys(groupedData).map((item) => (
        <Card key={item} item={item} readings={groupedData[item]} />
      ))}
    </div>
  );
}

export default App;
