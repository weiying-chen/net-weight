import { useState } from "react";
import { Device, Reading } from "./types";
import { useReadings } from "./hooks/useReadings";
import { useDevices } from "./hooks/useDevices";
import { Card } from "./components/Card";
import { Modal } from "./components/Modal";
import { Form } from "./components/Form";
import { groupBy, toCamelCase } from "./utils";
import { getDeviceName } from "./helpers";

export default function App() {
  const readings = useReadings();
  const devices = useDevices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  const camelCaseReadings = toCamelCase(readings) as Reading[];
  const camelCaseDevices = toCamelCase(devices) as Device[];
  const groupedReadings = groupBy(camelCaseReadings, "deviceId");

  const handleOpenModal = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDeviceId(null);
  };

  return (
    <div className="p-4 flex justify-center flex-col items-center">
      {Object.keys(groupedReadings).map((deviceId) => (
        <Card
          key={deviceId}
          itemName={getDeviceName(camelCaseDevices, deviceId)}
          readings={groupedReadings[deviceId]}
          onAction={() => handleOpenModal(deviceId)}
        />
      ))}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold">Device Details</h2>
        <p>Details for device: {selectedDeviceId}</p>
        {selectedDeviceId && (
          <Form
            deviceName={getDeviceName(camelCaseDevices, selectedDeviceId)}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
}
