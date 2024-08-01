import React, { useEffect } from "react";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-3xl border-foreground border shadow">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-primary text-foreground px-4 py-2 rounded border-foreground border-[1.5px] shadow hover:shadow-dark"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
