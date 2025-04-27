import React, { useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const ProductNotification = ({
  showNotification,
  setShowNotification,
  message,
  messageType,
}) => {
  useEffect(() => {
    // Auto-hide notification after 5 seconds
    let timer;
    if (showNotification) {
      timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showNotification, setShowNotification]);

  if (!showNotification) return null;

  // Determine notification styles based on type
  const bgColor =
    messageType === "success"
      ? "bg-green-100 border-green-500"
      : messageType === "error"
      ? "bg-red-100 border-red-500"
      : "bg-blue-100 border-blue-500";

  const textColor =
    messageType === "success"
      ? "text-green-800"
      : messageType === "error"
      ? "text-red-800"
      : "text-blue-800";

  const iconColor =
    messageType === "success"
      ? "text-green-500"
      : messageType === "error"
      ? "text-red-500"
      : "text-blue-500";

  const Icon =
    messageType === "success"
      ? FaCheckCircle
      : messageType === "error"
      ? FaExclamationCircle
      : FaInfoCircle;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 animate-slideUp">
      <div
        className={`px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 max-w-md ${bgColor} ${textColor} border-l-4 transition-all duration-300`}>
        <Icon className={`${iconColor} text-xl flex-shrink-0`} />
        <p className="font-medium">{message}</p>
        <button
          onClick={() => setShowNotification(false)}
          className="ml-auto text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-200">
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default ProductNotification;
