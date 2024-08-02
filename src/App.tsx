import { useState } from "react";
import { Device } from "./types";
import { useReadings } from "./hooks/useReadings";
import { useDevices } from "./hooks/useDevices";
import { Card } from "./components/Card";
import { Modal } from "./components/Modal";
import { Form } from "./components/Form";
import { groupBy } from "./utils";

export default function App() {
  const readings = useReadings();
  const devices = useDevices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const groupedReadings = groupBy(readings, "deviceId");

  const handleOpenModal = (deviceId: string) => {
    const device = devices.find((d) => d.deviceId === deviceId) || null;
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  return (
    <div className="p-4 flex justify-center flex-col items-center">
      {Object.keys(groupedReadings).map((deviceId) => (
        <Card
          key={deviceId}
          itemName={
            devices.find((d) => d.deviceId === deviceId)?.name || "Unknown"
          }
          readings={groupedReadings[deviceId]}
          onAction={() => handleOpenModal(deviceId)}
        />
      ))}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold">Device Details</h2>
        <p>Details for device: {selectedDevice?.deviceId}</p>
        {selectedDevice && (
          <Form device={selectedDevice} onClose={handleCloseModal} />
        )}
      </Modal>
    </div>
  );
}
