import React from "react";
import PropTypes from "prop-types";
import { FaCheck, FaTruck, FaSpinner } from "react-icons/fa";
import { calculateOrderTotal } from "../../utils/helpers/orderHelpers";

/**
 * Reusable OrderCard component for displaying order information
 */
const OrderCard = ({
  order,
  setSelectedOrder,
  loadingOrderId,
  handleStatusChange,
  handleDeleteOrder,
}) => {
  if (!order) {
    console.warn("OrderCard received null or undefined order");
    return null;
  }

  const isLoading = loadingOrderId === order.id;
  const orderTotal = calculateOrderTotal(order);

  const getStatusButton = () => {
    if (isLoading) {
      return (
        <button
          disabled
          className="flex items-center gap-1.5 bg-gray-400 text-white px-3 py-1.5 rounded-lg cursor-not-allowed text-sm">
          <FaSpinner className="animate-spin text-xs" />
          <span className="sm:hidden">Loading...</span>
          <span className="hidden sm:inline">Processing...</span>
        </button>
      );
    }

    switch (order.status) {
      case "new":
        return (
          <button
            onClick={() => handleStatusChange(order.id, "paid")}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            <FaCheck className="text-xs" />
            <span className="sm:hidden">Paid</span>
            <span className="hidden sm:inline">Mark as Paid</span>
          </button>
        );
      case "paid":
        return (
          <button
            onClick={() => handleStatusChange(order.id, "done")}
            disabled={isLoading}
            className="flex items-center gap-1.5 bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            <FaTruck className="text-xs" />
            <span className="sm:hidden">Delivered</span>
            <span className="hidden sm:inline">Mark as Delivered</span>
          </button>
        );
      case "done":
        return null;
      default:
        console.warn(`Unknown order status: ${order.status}`);
        return null;
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case "new":
        return "bg-yellow-100 text-yellow-800";
      case "paid":
        return "bg-green-100 text-green-800";
      case "done":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`backdrop-blur-md bg-white/90 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200/50 ${
        isLoading ? "opacity-75" : ""
      }`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-medium text-gray-800 text-lg">
              {order.fullName || "No Name"}
            </h3>
            <p className="text-sm text-gray-600">
              {order.contact || "No Contact"}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#BD815A]"></span>
              {order.location || "No Location"}
            </p>
            <p className="text-sm font-medium text-[#BD815A] mt-2">
              GHS{" "}
              {orderTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
          <button
            onClick={() => setSelectedOrder(order)}
            disabled={isLoading}
            className="text-[#BD815A] hover:text-[#a06b4a] transition-colors font-medium flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            <span className="sm:hidden">Details</span>
            <span className="hidden sm:inline">View Details</span>
          </button>
          {getStatusButton()}
        </div>
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string,
    contact: PropTypes.string,
    location: PropTypes.string,
    status: PropTypes.oneOf(["new", "paid", "done"]).isRequired,
    comboPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    addBox: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  setSelectedOrder: PropTypes.func.isRequired,
  loadingOrderId: PropTypes.string,
  handleStatusChange: PropTypes.func.isRequired,
  handleDeleteOrder: PropTypes.func.isRequired,
};

export default OrderCard;
