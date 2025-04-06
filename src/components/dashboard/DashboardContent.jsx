import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import StatisticsSection from "../stats/StatisticsSection";
import OrderCard from "./OrderCard";
import NoDataPlaceholder from "./NoDataPlaceholder";

/**
 * Refresh button component
 */
const RefreshButton = ({ isRefreshing, handleRefresh }) => (
  <button
    onClick={handleRefresh}
    disabled={isRefreshing}
    className="flex items-center gap-2 bg-[#BD815A] text-white px-4 py-2 rounded-lg hover:bg-[#a06b4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
    {isRefreshing ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Refreshing...
      </>
    ) : (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </>
    )}
  </button>
);

/**
 * DashboardContent component renders the correct content based on the current filter
 */
const DashboardContent = ({
  groupedOrders,
  fetchProducts,
  setSelectedOrder,
  handleStatusChange,
  handleDeleteOrder,
  loadingOrderId,
  filter,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [filter]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await fetchProducts();
    } catch (err) {
      console.error("Error refreshing products:", err);
      setError("Failed to refresh products. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    return (
      <div className="flex-1 h-full p-3 sm:p-6 overflow-y-auto">
        <div className="backdrop-blur-md bg-red-50/90 rounded-2xl p-6 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (filter === "summary") {
      return <StatisticsSection groupedOrders={groupedOrders} />;
    }

    if (!groupedOrders || Object.keys(groupedOrders).length === 0) {
      return (
        <div className="backdrop-blur-md bg-white/80 rounded-2xl p-8">
          <NoDataPlaceholder message={`No ${filter} orders found`} />
        </div>
      );
    }

    return Object.entries(groupedOrders)
      .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
      .map(([dateKey, orders]) => (
        <div
          key={dateKey}
          className="mb-8 backdrop-blur-md bg-white/80 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            {dateKey}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                setSelectedOrder={setSelectedOrder}
                loadingOrderId={loadingOrderId}
                handleStatusChange={handleStatusChange}
                handleDeleteOrder={handleDeleteOrder}
              />
            ))}
          </div>
        </div>
      ));
  };

  return (
    <div className="flex-1 h-full p-3 sm:p-6 overflow-y-auto">
      <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {filter === "new"
              ? "New Orders"
              : filter === "paid"
              ? "Paid Orders"
              : filter === "done"
              ? "Completed Orders"
              : "Combo Summary"}
          </h1>
          <RefreshButton
            isRefreshing={isRefreshing}
            handleRefresh={handleRefresh}
          />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

RefreshButton.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
};

DashboardContent.propTypes = {
  groupedOrders: PropTypes.object.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setSelectedOrder: PropTypes.func.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
  handleDeleteOrder: PropTypes.func.isRequired,
  loadingOrderId: PropTypes.string,
  filter: PropTypes.string.isRequired,
};

export default DashboardContent;
