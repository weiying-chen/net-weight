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
    <div className="px-4 space-y-2">
      <h3
        className={
          isLastMessage ? "text-2xl font-semibold" : "text-sm font-semibold"
        }
      >
        {message.content}
      </h3>
      <p className={`text-gray-400 ${isLastMessage ? "text-md" : "text-xs"}`}>
        {new Date(message.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

export default Card;
