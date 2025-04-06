/**
 * Calculate total amount for an order
 * @param {Object} order - Order object
 * @returns {number} Total amount for the order
 */
export const calculateOrderTotal = (order) => {
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
    console.error(`Error calculating total for order:`, error);
    return 0;
  }
};

/**
 * Calculate statistics from orders
 * @param {Object} groupedOrders - Orders grouped by date
 * @returns {Object} Calculated statistics
 */
export const calculateOrderStats = (groupedOrders) => {
  const calculatedStats = {
    totalRevenue: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    popularProducts: {},
    locations: {},
    monthlyRevenue: {},
    averageOrderValue: 0,
    ordersByStatus: {
      new: 0,
      paid: 0,
      done: 0,
    },
  };

  // Initialize monthly revenue for all months
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(i);
    return date.toLocaleString("default", { month: "short" });
  });

  months.forEach((month) => {
    calculatedStats.monthlyRevenue[month] = 0;
  });

  // Process each order in the grouped orders
  Object.entries(groupedOrders).forEach(([date, orders]) => {
    const orderMonth = new Date(date).toLocaleString("default", {
      month: "short",
    });

    console.log(`Processing date: ${date}, found ${orders.length} orders`);

    orders?.forEach((order) => {
      if (!order) return;

      // Basic stats
      calculatedStats.totalOrders++;

      // Calculate total from order
      const orderTotal = calculateOrderTotal(order);

      // Add to total revenue regardless of status
      calculatedStats.totalRevenue += orderTotal;

      // Order status counting and monthly revenue tracking
      switch (order.status) {
        case "new":
          calculatedStats.ordersByStatus.new++;
          calculatedStats.pendingOrders++;
          if (!isNaN(orderTotal)) {
            calculatedStats.monthlyRevenue[orderMonth] += orderTotal;
          }
          break;
        case "paid":
          calculatedStats.ordersByStatus.paid++;
          if (!isNaN(orderTotal)) {
            calculatedStats.monthlyRevenue[orderMonth] += orderTotal;
          }
          break;
        case "done":
          calculatedStats.ordersByStatus.done++;
          calculatedStats.completedOrders++;
          if (!isNaN(orderTotal)) {
            calculatedStats.monthlyRevenue[orderMonth] += orderTotal;
          }
          break;
      }

      // Products tracking
      if (order.selectedIds && Array.isArray(order.selectedIds)) {
        order.selectedIds.forEach((productId) => {
          const productName = `Product ${productId}`;
          calculatedStats.popularProducts[productName] = {
            count:
              (calculatedStats.popularProducts[productName]?.count || 0) + 1,
            revenue:
              (calculatedStats.popularProducts[productName]?.revenue || 0) +
              orderTotal / order.selectedIds.length, // Distribute revenue equally among products
          };
        });
      }

      // Locations tracking
      if (order.location) {
        calculatedStats.locations[order.location] = {
          count: (calculatedStats.locations[order.location]?.count || 0) + 1,
          revenue:
            (calculatedStats.locations[order.location]?.revenue || 0) +
            orderTotal,
        };
      }
    });
  });

  // Calculate average order value (from paid and completed orders)
  try {
    const paidAndCompletedOrders =
      calculatedStats.ordersByStatus.paid + calculatedStats.ordersByStatus.done;

    calculatedStats.averageOrderValue =
      paidAndCompletedOrders > 0
        ? calculatedStats.totalRevenue / paidAndCompletedOrders
        : 0;

    if (isNaN(calculatedStats.averageOrderValue)) {
      console.warn("Average order value is NaN, setting to 0");
      calculatedStats.averageOrderValue = 0;
    }
  } catch (error) {
    console.error("Error calculating average order value:", error);
    calculatedStats.averageOrderValue = 0;
  }

  return calculatedStats;
};
