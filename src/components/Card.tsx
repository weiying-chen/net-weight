import { IconEdit } from "@tabler/icons-react";
import { Reading } from "../types";

type CardProps = {
  itemName: string;
  readings: Reading[];
  onAction: () => void;
};

type CardHeaderProps = {
  itemName: string;
  onAction: () => void;
};

type CardContentProps = {
  reading: Reading;
  isFirstReading?: boolean;
};

function CardHeader({ itemName, onAction }: CardHeaderProps) {
  return (
    <div className="relative">
      <img
        src="https://via.placeholder.com/600x300"
        alt="Placeholder Image"
        className="w-full h-auto rounded-t-3xl"
      />
      <h2 className="font-semibold tracking-tight text-4xl text-center pt-4 capitalize">
        {itemName}
      </h2>
      <button
        onClick={onAction}
        className="absolute bg-white p-2 top-4 right-4 rounded-full border-foreground border  shadow hover:shadow-dark"
      >
        <IconEdit size={28} />
      </button>
    </div>
  );
}

function CardContent({ reading, isFirstReading }: CardContentProps) {
  return (
    <div className="px-4 space-y-2">
      <h3
        className={
          isFirstReading ? "text-2xl font-semibold" : "text-sm font-semibold"
        }
      >
        {reading.weight.toFixed(2)} g
      </h3>
      <p className={`text-gray-400 ${isFirstReading ? "text-md" : "text-xs"}`}>
        {new Date(reading.createdAt).toLocaleString()}
      </p>
    </div>
  );
}

export function Card({ itemName, readings, onAction }: CardProps) {
  return (
    <div className="bg-white border-foreground border rounded-3xl shadow w-full max-w-2xl mb-6">
      <CardHeader itemName={itemName} onAction={onAction} />
      <div className="py-4">
        {readings.length > 0 && (
          <>
            <CardContent reading={readings[0]} isFirstReading />
            {readings.slice(1).map((reading) => (
              <div key={reading.id}>
                <hr className="my-4 border-gray-300" />
                <CardContent reading={reading} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
