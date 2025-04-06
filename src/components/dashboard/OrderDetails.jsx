import React from "react";
import PropTypes from "prop-types";
import Product from "../Product";
import { calculateOrderTotal } from "../../utils/helpers/orderHelpers";

/**
 * OrderDetails component to display detailed order information
 */
const OrderDetails = ({ selectedOrder, setSelectedOrder, products }) => {
  if (!selectedOrder) return null;

  const total = calculateOrderTotal(selectedOrder);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-200 rounded-xl shadow-xl w-[90%] max-w-xl max-h-[90vh] overflow-hidden">
        <div className="bg-[#1a202c] text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button
            onClick={() => setSelectedOrder(null)}
            className="text-white hover:text-gray-300 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoField label="Name" value={selectedOrder.fullName} />
              <InfoField label="Contact" value={selectedOrder.contact} />
              <InfoField label="Location" value={selectedOrder.location} />
              <InfoField label="Number of Boxes" value={selectedOrder.addBox} />
              <InfoField
                label="Guarantor's Name"
                value={selectedOrder.guarantorName}
              />
              <InfoField
                label="Guarantor's Contact"
                value={selectedOrder.guarantorContact}
              />
              <InfoField label="Shoe Size" value={selectedOrder.size} />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                    selectedOrder.status === "new"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedOrder.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                  {selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">
              Selected Products
            </h3>
            {products && selectedOrder.selectedIds ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
                {products
                  .filter((product) =>
                    selectedOrder.selectedIds.includes(product.id.toString())
                  )
                  .map((product) => (
                    <Product
                      key={product.id}
                      Image={product.image}
                      Name={product.name}
                      Color={product.color}
                    />
                  ))}
              </div>
            ) : (
              <p className="text-gray-500">No products selected</p>
            )}
          </div>

          <div className="md:mt-6 mt-4 py-3 border-t border-gray-200 bg-white px-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg text-gray-800 uppercase font-bold">
                Total
              </h3>
              <p className="text-xl font-semibold text-[#BD815A]">
                GHS{" "}
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper component for displaying field info
 */
const InfoField = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "—"}</p>
  </div>
);

InfoField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

OrderDetails.propTypes = {
  selectedOrder: PropTypes.object,
  setSelectedOrder: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default OrderDetails;
