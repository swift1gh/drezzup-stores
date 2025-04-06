import React from "react";
import PropTypes from "prop-types";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import DashboardContent from "./DashboardContent";

/**
 * Main content container for the dashboard
 */
const MainContent = ({
  isLoading,
  error,
  isSidebarOpen,
  groupedOrders,
  fetchProducts,
  setSelectedOrder,
  handleStatusChange,
  handleDeleteOrder,
  loadingOrderId,
  filter,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState errorMessage={error} />
      ) : (
        <DashboardContent
          isSidebarOpen={isSidebarOpen}
          groupedOrders={groupedOrders}
          fetchProducts={fetchProducts}
          setSelectedOrder={setSelectedOrder}
          handleStatusChange={handleStatusChange}
          handleDeleteOrder={handleDeleteOrder}
          loadingOrderId={loadingOrderId}
          filter={filter}
        />
      )}
    </div>
  );
};

MainContent.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isSidebarOpen: PropTypes.bool.isRequired,
  groupedOrders: PropTypes.object.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setSelectedOrder: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleDeleteOrder: PropTypes.func.isRequired,
  loadingOrderId: PropTypes.string,
  filter: PropTypes.string.isRequired,
};

export default MainContent;
