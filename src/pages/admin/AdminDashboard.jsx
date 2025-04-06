import { useState, useEffect } from "react";
import OrderDetails from "../../components/dashboard/OrderDetails";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import Sidebar from "../../components/dashboard/Sidebar";
import MainContent from "../../components/dashboard/MainContent";
import bgImage from "../../assets/7.jpg";

// Import custom hooks
import { useOrders } from "../../hooks/useOrders";
import { useProducts } from "../../hooks/useProducts";

const AdminDashboard = () => {
  // Add title change effect
  useEffect(() => {
    const originalTitle = document.title;
    document.title = "DrezzUp | Combo Admin Dashboard";
    return () => {
      document.title = originalTitle;
    };
  }, []);

  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
    loadingOrderId,
    getFilteredOrders,
    getGroupedOrders,
    updateOrderStatus,
    deleteOrder,
  } = useOrders();

  const {
    products,
    loading: productsLoading,
    error: productsError,
    fetchProducts,
  } = useProducts();

  const [filter, setFilter] = useState("new");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(orderId);
    }
  };

  const filteredOrders = getFilteredOrders(filter);
  const groupedOrders = getGroupedOrders(filteredOrders);

  console.log("Current filter:", filter);
  console.log("Filtered orders:", filteredOrders.length);
  console.log("Grouped orders dates:", Object.keys(groupedOrders).length);

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarButtonClick = (newFilter) => {
    setFilter(newFilter);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  return (
    <DashboardLayout backgroundImage={bgImage}>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        handleToggleSidebar={handleToggleSidebar}
        filter={filter}
        handleSidebarButtonClick={handleSidebarButtonClick}
      />

      <MainContent
        isLoading={ordersLoading}
        error={ordersError}
        isSidebarOpen={isSidebarOpen}
        groupedOrders={groupedOrders}
        fetchProducts={fetchProducts}
        setSelectedOrder={setSelectedOrder}
        handleStatusChange={handleStatusChange}
        handleDeleteOrder={handleDeleteOrder}
        loadingOrderId={loadingOrderId}
        filter={filter}
      />

      {selectedOrder && (
        <OrderDetails
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
          products={products}
        />
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
