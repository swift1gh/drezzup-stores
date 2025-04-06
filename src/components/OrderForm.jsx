import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { calculateOrderTotal } from "../utils/helpers/orderHelpers";

const getDefaultFormState = (selectedIds = [], comboPrice = 0) => ({
  fullName: "",
  contact: "",
  location: "",
  size: "",
  guarantorName: "",
  guarantorContact: "",
  addBox: "0",
  selectedIds,
  comboPrice,
});

const OrderForm = ({ selectedIds = [], comboPrice = 0 }) => {
  const [formData, setFormData] = useState(
    getDefaultFormState(selectedIds, comboPrice)
  );
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (Object.values(formData).some((value) => value === "")) {
        setError("Please fill out all required fields.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        // Use the utility function to calculate total
        const orderDataWithNumericValues = {
          ...formData,
          comboPrice: parseFloat(formData.comboPrice) || 0,
          addBox: parseInt(formData.addBox) || 0,
        };

        const total = calculateOrderTotal(orderDataWithNumericValues);

        const orderData = {
          ...formData,
          date: Timestamp.now(),
          selectedIds,
          comboPrice: parseFloat(formData.comboPrice) || 0,
          addBox: parseInt(formData.addBox) || 0,
          TOTAL: total.toString(), // Store the calculated total amount
        };

        const result = await addDoc(collection(db, "customers"), orderData);
        console.log("Order created with ID:", result.id);

        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
          navigate("/");
        }, 2000);

        setFormData(getDefaultFormState());
      } catch (error) {
        console.error("Error placing order:", error.message);
        setError("Failed to place order. Try again later.");
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate, selectedIds, comboPrice]
  );

  const formFields = [
    { label: "Full Name", name: "fullName", icon: "👤" },
    { label: "Contact", name: "contact", icon: "📱" },
    { label: "Location", name: "location", icon: "📍" },
    { label: "Size", name: "size", icon: "📏" },
    { label: "Guarantor's Name", name: "guarantorName", icon: "👥" },
    { label: "Guarantor's Contact", name: "guarantorContact", icon: "📞" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex justify-center items-center py-6 px-4">
      <div
        className={`w-full flex justify-center items-center ${
          isPopupVisible ? "blur-md" : ""
        }`}>
        <motion.div
          className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          transition={{ duration: 0.3 }}>
          <div className="bg-gradient-to-r from-[#bd815a] to-[#d29c7b] p-4 text-white">
            <h2 className="text-2xl font-bold">Place Your Order</h2>
            <p className="text-sm opacity-90 mt-1">
              Please fill out the form below
            </p>
          </div>

          <form className="p-4 md:p-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r">
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <div className="md:grid md:grid-cols-2 md:gap-6 space-y-4 md:space-y-0">
              {formFields.map(({ label, name, icon }) => (
                <motion.div
                  className="relative"
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: formFields.findIndex((f) => f.name === name) * 0.05,
                  }}>
                  <div className="flex items-center mb-1">
                    <span className="mr-2">{icon}</span>
                    <label
                      htmlFor={name}
                      className="text-sm font-medium text-gray-700">
                      {label}
                    </label>
                  </div>
                  <input
                    type="text"
                    name={name}
                    id={name}
                    className={`w-full p-2.5 border rounded-lg transition-all duration-200 outline-none ${
                      focusedField === name
                        ? "border-[#bd815a] ring-2 ring-[#bd815a]/20"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    value={formData[name]}
                    onChange={handleChange}
                    onFocus={() => handleFocus(name)}
                    onBlur={handleBlur}
                    required
                  />
                </motion.div>
              ))}
            </div>

            <div className="mt-6">
              <motion.div
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}>
                <div className="flex items-center mb-1">
                  <span className="mr-2">📦</span>
                  <label
                    htmlFor="addBox"
                    className="text-sm font-medium text-gray-700">
                    Number of Boxes
                  </label>
                </div>
                <div className="md:w-1/3">
                  <select
                    name="addBox"
                    id="addBox"
                    className={`w-full p-2.5 border rounded-lg bg-white transition-all duration-200 outline-none appearance-none ${
                      focusedField === "addBox"
                        ? "border-[#bd815a] ring-2 ring-[#bd815a]/20"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    value={formData.addBox}
                    onChange={handleChange}
                    onFocus={() => handleFocus("addBox")}
                    onBlur={handleBlur}>
                    {Array.from({ length: 6 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
                    <svg
                      className="h-4 w-4 fill-current text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r text-sm mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}>
                <div className="flex">
                  <span className="text-amber-500 mr-2">⚠️</span>
                  <p className="text-amber-700">
                    Kindly note that these deals don't come in boxes. A box
                    costs 20 cedis. It can be added by your choice and the price
                    factored in.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.button
              type="submit"
              className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#bd815a] hover:bg-[#a06b4a] shadow-lg hover:shadow-xl hover:shadow-[#bd815a]/20"
              }`}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Processing...
                </div>
              ) : (
                "Place Order"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {isPopupVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}>
          <motion.div
            className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Order Placed Successfully!
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for your order. You will be redirected shortly.
            </p>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
              <motion.div
                className="bg-green-500 h-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderForm;
