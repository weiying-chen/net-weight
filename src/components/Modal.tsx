import React from "react";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-6 rounded-3xl border-[#083355] border-[1.5px] [box-shadow:4px_4px_0px_rgba(0,0,0,0.1)]">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-[#ffde00] text-[#083355] px-4 py-2 rounded border-[#083355] border-[1.5px] [box-shadow:4px_4px_0px_rgba(0,0,0,0.1)] hover:[box-shadow:4px_4px_0px_rgba(0,0,0,0.2)]"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
