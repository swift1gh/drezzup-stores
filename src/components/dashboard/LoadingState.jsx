import React from "react";

/**
 * Loading state component for the dashboard
 */
const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="backdrop-blur-md bg-white/80 rounded-xl p-8 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD815A] mb-4"></div>
        <p className="text-lg text-gray-700">Loading orders...</p>
      </div>
    </div>
  );
};

export default LoadingState;
