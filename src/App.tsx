import { Device, Reading } from "./types";
import { useReadings } from "./hooks/useReadings";
import { useDevices } from "./hooks/useDevices"; // Import the new hook
import Card from "./components/Card";
import { groupBy, toCamelCase } from "./utils";
import { getDeviceName } from "./helpers";

function App() {
  const readings = useReadings();
  const devices = useDevices();
  const camelCaseReadings = toCamelCase(readings) as Reading[];
  const camelCaseDevices = toCamelCase(devices) as Device[];
  const groupedReadings = groupBy(camelCaseReadings, "deviceId");

  return (
    <div className="p-4 flex justify-center">
      {Object.keys(groupedReadings).map((deviceId) => (
        <Card
          key={deviceId}
          itemName={getDeviceName(camelCaseDevices, deviceId)}
          readings={groupedReadings[deviceId]}
        />
      ))}
    </div>
  );
}

export default App;
