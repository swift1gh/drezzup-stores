import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../utils/firebase";

/**
 * Custom hook to manage orders from Firestore
 * @returns {Object} Orders state and management functions
 */
export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  // Listen to Firestore orders
  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      collection(db, "customers"),
      (snapshot) => {
        console.log(
          "Raw Firestore data:",
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );

        try {
          const orderList = snapshot.docs
            .map((doc) => {
              const data = doc.data();
              // Convert Firestore Timestamp to Date; if not available, default to now
              const dateObj = data.date?.toDate
                ? data.date.toDate()
                : new Date(data.date || Date.now());

              // Validate comboPrice and addBox fields
              if (data.comboPrice === undefined || data.comboPrice === null) {
                console.warn(`Order ${doc.id} has no comboPrice, setting to 0`);
                data.comboPrice = 0;
              }

              if (data.addBox === undefined || data.addBox === null) {
                console.warn(`Order ${doc.id} has no addBox, setting to 0`);
                data.addBox = 0;
              }

              // Try to ensure comboPrice is always a valid number
              try {
                if (typeof data.comboPrice !== "number") {
                  const parsed = parseFloat(data.comboPrice);
                  if (isNaN(parsed)) {
                    console.warn(
                      `Order ${doc.id} has invalid comboPrice: ${data.comboPrice}, setting to 0`
                    );
                    data.comboPrice = 0;
                  } else {
                    data.comboPrice = parsed;
                  }
                }
              } catch (error) {
                console.error(
                  `Error parsing comboPrice for order ${doc.id}:`,
                  error
                );
                data.comboPrice = 0;
              }

              // Try to ensure addBox is always a valid number
              try {
                if (typeof data.addBox !== "number") {
                  const parsed = parseInt(data.addBox);
                  if (isNaN(parsed)) {
                    console.warn(
                      `Order ${doc.id} has invalid addBox: ${data.addBox}, setting to 0`
                    );
                    data.addBox = 0;
                  } else {
                    data.addBox = parsed;
                  }
                }
              } catch (error) {
                console.error(
                  `Error parsing addBox for order ${doc.id}:`,
                  error
                );
                data.addBox = 0;
              }

              const order = {
                id: doc.id,
                ...data,
                status: data.status || "new", // Ensure status is set
                date: dateObj,
                dateString: !isNaN(dateObj)
                  ? dateObj.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Invalid Date",
              };
              console.log("Processed order:", order);
              return order;
            })
            .sort((a, b) => b.date - a.date);

          console.log("Final processed orders:", orderList);
          setOrders(orderList);
          setLoading(false);
        } catch (err) {
          console.error("Error processing orders:", err);
          setError("Failed to process orders data. Please try again.");
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        setError("Failed to load orders. Please check your connection.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter orders based on status
  const getFilteredOrders = (filter) => {
    return orders.filter((order) => {
      if (!order || !order.status) {
        console.warn("Invalid order or missing status:", order);
        return false;
      }

      switch (filter) {
        case "new":
          return order.status === "new";
        case "paid":
          return order.status === "paid";
        case "done":
          return order.status === "done";
        case "summary":
          return true; // Include all orders for summary view
        default:
          return order.status === "new";
      }
    });
  };

  // Group orders by their formatted date string
  const getGroupedOrders = (filteredOrders) => {
    return filteredOrders.reduce((acc, order) => {
      if (!order.dateString) {
        console.warn("Order missing dateString:", order);
        return acc;
      }
      const key = order.dateString;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(order);
      return acc;
    }, {});
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    setLoadingOrderId(orderId);
    try {
      const orderRef = doc(db, "customers", orderId);
      await updateDoc(orderRef, { status: newStatus });
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Failed to update order status. Please try again.");
      return false;
    } finally {
      setLoadingOrderId(null);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    setLoadingOrderId(orderId);
    try {
      const orderRef = doc(db, "customers", orderId);
      await deleteDoc(orderRef);
      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      setError("Failed to delete order. Please try again.");
      return false;
    } finally {
      setLoadingOrderId(null);
    }
  };

  // Calculate order total (reusable calculation function)
  const calculateOrderTotal = (order) => {
    if (!order) return 0;

    try {
      const comboPrice = order.comboPrice ? parseFloat(order.comboPrice) : 0;
      const addBoxCount = order.addBox ? parseInt(order.addBox) : 0;

      // Validate inputs
      const validComboPrice = isNaN(comboPrice) ? 0 : comboPrice;
      const validAddBoxCount = isNaN(addBoxCount) ? 0 : addBoxCount;

      const total = validComboPrice + validAddBoxCount * 20;
      return isNaN(total) ? 0 : total;
    } catch (error) {
      console.error(`Error calculating total for order ${order.id}:`, error);
      return 0;
    }
  };

  return {
    orders,
    loading,
    error,
    loadingOrderId,
    getFilteredOrders,
    getGroupedOrders,
    updateOrderStatus,
    deleteOrder,
    calculateOrderTotal,
  };
}
