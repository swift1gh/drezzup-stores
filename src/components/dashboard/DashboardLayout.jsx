import React from "react";
import PropTypes from "prop-types";

/**
 * Base layout component for the dashboard
 */
const DashboardLayout = ({ children, backgroundImage }) => {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}>
      {children}
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  backgroundImage: PropTypes.string.isRequired,
};

export default DashboardLayout;
