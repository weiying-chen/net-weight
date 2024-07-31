import { Reading } from "./types";
import { useReadings } from "./hooks/useReadings";
import { useDevices } from "./hooks/useDevices"; // Import the new hook
import Card from "./components/Card";
import { groupBy, toCamelCase } from "./utils";

function App() {
  const readings = useReadings();
  const devices = useDevices();
  const camelCaseData = toCamelCase(readings) as Reading[];
  const groupedReadings = groupBy(camelCaseData, "deviceId");

  const getDeviceName = (deviceId: string) => {
    const device = devices.find((d) => d.device_id === deviceId);
    return device ? device.name : deviceId;
  };

  return (
    <div className="p-4 flex justify-center">
      {Object.keys(groupedReadings).map((deviceId) => (
        <Card
          key={deviceId}
          item={getDeviceName(deviceId)}
          readings={groupedReadings[deviceId]}
        />
      ))}
    </div>
  );
}

export default App;
