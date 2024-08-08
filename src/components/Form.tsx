import { useState } from "react";
import { Device } from "../types";

type FormProps = {
  device: Device;
  onClose: () => void;
  updateDevice: (
    id: number,
    name: string,
    itemWeight: number,
    extraWeight: number,
  ) => Promise<void>;
};

export function Form({ device, onClose, updateDevice }: FormProps) {
  const [name, setName] = useState(device.name);
  const [itemWeight, setItemWeight] = useState(device.itemWeight || 0);
  const [extraWeight, setExtraWeight] = useState(device.extraWeight || 0);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleItemWeightChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setItemWeight(parseFloat(event.target.value));
  };

  const handleExtraWeightChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setExtraWeight(parseFloat(event.target.value));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateDevice(device.id, name, itemWeight, extraWeight);
    onClose();
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        value={name}
        onChange={handleNameChange}
        placeholder="Enter device name"
        className="border border-foreground p-2 mt-4 w-full rounded focus:ring ring-gray-200 ring-offset-2 outline-none"
      />
      <input
        type="number"
        value={itemWeight}
        onChange={handleItemWeightChange}
        placeholder="Enter item weight"
        className="border border-foreground p-2 mt-4 w-full rounded focus:ring ring-gray-200 ring-offset-2 outline-none"
      />
      <input
        type="number"
        value={extraWeight}
        onChange={handleExtraWeightChange}
        placeholder="Enter extra weight"
        className="border border-foreground p-2 mt-4 w-full rounded focus:ring ring-gray-200 ring-offset-2 outline-none"
      />
      <div className="mt-4 space-x-2">
        <button
          type="submit"
          className="bg-primary text-foreground rounded px-4 py-2 border border-foreground shadow hover:shadow-dark"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-foreground px-4 py-2 rounded border-foreground border shadow hover:shadow-dark"
        >
          Close
        </button>
      </div>
    </form>
  );
}
