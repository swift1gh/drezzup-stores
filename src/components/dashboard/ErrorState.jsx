import React from "react";
import PropTypes from "prop-types";

/**
 * Error state component for the dashboard
 */
const ErrorState = ({ errorMessage }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="backdrop-blur-md bg-red-50/90 rounded-xl p-8 text-red-600">
        <p className="font-bold text-lg mb-2">Error loading orders</p>
        <p>{errorMessage}</p>
      </div>
    </div>
  );
};

ErrorState.propTypes = {
  errorMessage: PropTypes.string.isRequired,
};

export default ErrorState;
