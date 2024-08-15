import { useState } from "react";
import { Device } from "./types";
import { useReadings } from "./hooks/useReadings";
import { useDevices } from "./hooks/useDevices";
import { Card } from "./components/Card";
import { Modal } from "./components/Modal";
import { Form } from "./components/Form";
import { groupBy } from "./utils";

const findDeviceById = (
  devices: Device[],
  deviceId: string,
): Device | undefined => {
  return devices.find((d) => d.deviceId === deviceId);
};

export default function App() {
  const readings = useReadings();
  const { devices, updateDevice } = useDevices();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const groupedReadings = groupBy(readings, "deviceId");

  const handleOpenModal = (deviceId: string) => {
    const device = findDeviceById(devices, deviceId);

    if (!device) return;
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  if (devices.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <h2 className="text-2xl font-bold">No Devices Found</h2>
        <p>Please add a device to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-6 flex justify-center md:flex-row flex-col gap-4 items-start">
      {Object.keys(groupedReadings).map((deviceId) => {
        const device = findDeviceById(devices, deviceId);

        if (!device) return null;

        return (
          <Card
            key={deviceId}
            readings={groupedReadings[deviceId]}
            device={device}
            onAction={() => handleOpenModal(deviceId)}
          />
        );
      })}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <h2 className="text-2xl font-bold">Device Details</h2>
        <p>Details for device: {selectedDevice?.deviceId}</p>
        {selectedDevice && (
          <Form
            device={selectedDevice}
            updateDevice={updateDevice}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
}
