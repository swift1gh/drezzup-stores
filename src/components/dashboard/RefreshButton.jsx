import React from "react";
import PropTypes from "prop-types";
import { FaSyncAlt } from "react-icons/fa";

const RefreshButton = ({ isRefreshing, handleRefresh }) => {
  return (
    <button
      onClick={handleRefresh}
      className="flex items-center gap-1.5 bg-[#BD815A] text-white rounded-lg hover:bg-[#a06b4a] transition-colors shadow-md text-sm sm:px-3 sm:py-1.5 p-2">
      <FaSyncAlt className={`text-xs ${isRefreshing ? "animate-spin" : ""}`} />
      <span className="hidden sm:inline">Refresh</span>
    </button>
  );
};

RefreshButton.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
};

export default RefreshButton;
