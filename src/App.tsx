import { Reading } from "./types";
import { useReadings } from "./hooks/useReadings";
import { useDevices } from "./hooks/useDevices"; // Import the new hook
import Card from "./components/Card";
import { groupBy, toCamelCase } from "./utils";
import { getDeviceName } from "./helpers";

function App() {
  const readings = useReadings();
  const devices = useDevices();
  const camelCaseData = toCamelCase(readings) as Reading[];
  const groupedReadings = groupBy(camelCaseData, "deviceId");

  return (
    <div className="p-4 flex justify-center">
      {Object.keys(groupedReadings).map((deviceId) => (
        <Card
          key={deviceId}
          itemName={getDeviceName(devices, deviceId)}
          readings={groupedReadings[deviceId]}
        />
      ))}
    </div>
  );
}

export default App;
