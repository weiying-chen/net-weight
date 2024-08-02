import { useState } from "react";
import supabase from "../supabaseClient"; // import supabase client
import { Device } from "../types";

type FormProps = {
  device: Device;
  onClose: () => void;
};

export function Form({ device, onClose }: FormProps) {
  const [inputValue, setInputValue] = useState(device.name);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase
        .from("devices")
        .update({ name: inputValue })
        .eq("id", device.id)
        .select();

      if (error) {
        throw error;
      }

      console.log("Device updated:", data);
      onClose();
    } catch (error) {
      console.error("Error updating device:", error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter device name"
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
