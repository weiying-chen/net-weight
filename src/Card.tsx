import React from "react";

type Message = {
  id: number;
  content: string;
  createdAt: string;
};

type CardProps = {
  message: Message;
  isLastMessage?: boolean;
};

const Card: React.FC<CardProps> = ({ message, isLastMessage }) => {
  return (
    <div className={`px-4 space-y-2 ${isLastMessage ? "text-lg" : "text-sm"}`}>
      <h3
        className={
          isLastMessage ? "text-lg font-semibold" : "text-sm font-semibold"
        }
      >
        {message.content}
      </h3>
      <p className="text-gray-400 text-sm">
        {new Date(message.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default Card;
