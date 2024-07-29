import React from "react";

type Message = {
  id: number;
  item: string;
  weight: number;
  createdAt: string;
};

type CardProps = {
  reading: Message;
  isLastReading?: boolean;
};

const Card: React.FC<CardProps> = ({ reading, isLastReading }) => {
  return (
    <div className="px-4 space-y-2">
      <h3
        className={
          isLastReading ? "text-2xl font-semibold" : "text-sm font-semibold"
        }
      >
        Weight: {reading.weight.toFixed(2)} g
      </h3>
      <p className={`text-gray-400 ${isLastReading ? "text-md" : "text-xs"}`}>
        {new Date(reading.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default Card;
