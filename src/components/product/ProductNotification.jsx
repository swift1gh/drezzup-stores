import React from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

const ProductNotification = ({
  showNotification,
  setShowNotification,
  message,
  messageType,
}) => {
  if (!showNotification) return null;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
      <div
        className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md ${
          messageType === "success"
            ? "bg-green-100 text-green-800 border-l-4 border-green-500"
            : messageType === "error"
            ? "bg-red-100 text-red-800 border-l-4 border-red-500"
            : "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
        }`}>
        {messageType === "success" ? (
          <FaCheckCircle className="text-green-500 text-xl flex-shrink-0" />
        ) : messageType === "error" ? (
          <FaExclamationCircle className="text-red-500 text-xl flex-shrink-0" />
        ) : (
          <FaInfoCircle className="text-blue-500 text-xl flex-shrink-0" />
        )}
        <p>{message}</p>
        <button
          onClick={() => setShowNotification(false)}
          className="ml-auto text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
    </div>
  );
};

export default ProductNotification;
