import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  FaInbox,
  FaShoppingCart,
  FaDollarSign,
  FaChartLine,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { calculateOrderStats } from "../../utils/helpers/orderHelpers";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Stats card component for better organization
const StatsCard = ({ title, value, icon, subValue, subLabel, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 bg-${color}-100 rounded-lg`}>{icon}</div>
    </div>
    {subValue && (
      <div className="text-xs text-gray-500">
        {subLabel}: {subValue}
      </div>
    )}
  </div>
);

// Item list component (for products/locations)
const ItemList = ({ items, title, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="space-y-4">
      {items.length > 0 ? (
        items.map(({ name, count, revenue, percentage }) => (
          <div key={name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className="text-gray-400" />
              <div>
                <p className="font-medium">{name}</p>
                <p className="text-sm text-gray-500">{count} orders</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">GHS {revenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{percentage}% of revenue</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  </div>
);

const StatisticsSection = ({ groupedOrders }) => {
  // Return placeholder if no data
  if (!groupedOrders || Object.keys(groupedOrders).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center animate-fadeIn">
        <FaInbox className="text-gray-400 text-6xl mx-auto mb-4" />
        <p className="text-xl text-gray-500">No data available for summary</p>
      </div>
    );
  }

  // Calculate statistics using our utility function
  const stats = useMemo(
    () => calculateOrderStats(groupedOrders),
    [groupedOrders]
  );

  // Configure chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          generateLabels: (chart) => {
            const labels = ["New Orders", "Ready for Delivery", "Completed"];
            const colors = [
              "rgba(234, 179, 8, 0.8)", // Warning yellow for new
              "rgba(59, 130, 246, 0.8)", // Blue for paid/ready
              "rgba(34, 197, 94, 0.8)", // Success green for done
            ];
            return labels.map((label, i) => ({
              text: label,
              fillStyle: colors[i],
              strokeStyle: colors[i],
              index: i,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const labels = ["New Orders", "Ready for Delivery", "Completed"];
            const total = Object.values(stats.ordersByStatus).reduce(
              (a, b) => a + b,
              0
            );
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${labels[context.dataIndex]}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Prepare chart data
  const revenueData = {
    labels: Object.keys(stats.monthlyRevenue),
    datasets: [
      {
        label: "Monthly Revenue",
        data: Object.values(stats.monthlyRevenue).map((value) =>
          isNaN(value) ? 0 : value
        ),
        backgroundColor: "rgba(129, 140, 248, 0.2)",
        borderColor: "rgb(129, 140, 248)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const orderStatusData = {
    labels: ["New", "Ready for Delivery", "Completed"],
    datasets: [
      {
        data: [
          stats.ordersByStatus.new,
          stats.ordersByStatus.paid,
          stats.ordersByStatus.done,
        ],
        backgroundColor: [
          "rgba(234, 179, 8, 0.8)", // Warning yellow for new
          "rgba(59, 130, 246, 0.8)", // Blue for paid/ready
          "rgba(34, 197, 94, 0.8)", // Success green for done
        ],
        borderWidth: 0,
      },
    ],
  };

  // Prepare data for top products and locations
  const topProducts = Object.entries(stats.popularProducts)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
      percentage: ((data.revenue / (stats.totalRevenue || 1)) * 100).toFixed(1),
    }));

  const topLocations = Object.entries(stats.locations)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([name, data]) => ({
      name,
      count: data.count,
      revenue: data.revenue,
      percentage: ((data.revenue / (stats.totalRevenue || 1)) * 100).toFixed(1),
    }));

  const mostActiveLocation =
    topLocations.length > 0 ? topLocations[0].name : "None";

  return (
    <div className="space-y-6 p-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`GHS ${(isNaN(stats.totalRevenue)
            ? 0
            : stats.totalRevenue
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          icon={<FaDollarSign className="text-2xl text-indigo-600" />}
          subValue={`GHS ${(isNaN(stats.averageOrderValue)
            ? 0
            : stats.averageOrderValue
          ).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          subLabel="Avg. Order"
          color="indigo"
        />

        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<FaShoppingCart className="text-2xl text-green-600" />}
          subValue={`${stats.completedOrders} (${(
            (stats.completedOrders / (stats.totalOrders || 1)) *
            100
          ).toFixed(1)}%)`}
          subLabel="Completed"
          color="green"
        />

        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<FaCalendarAlt className="text-2xl text-yellow-600" />}
          subValue={`${(
            (stats.pendingOrders / (stats.totalOrders || 1)) *
            100
          ).toFixed(1)}%`}
          subLabel="Pending Rate"
          color="yellow"
        />

        <StatsCard
          title="Active Locations"
          value={Object.keys(stats.locations).length}
          icon={<FaMapMarkerAlt className="text-2xl text-red-600" />}
          subValue={mostActiveLocation}
          subLabel="Most active"
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-6">Revenue Trend</h2>
          <div className="h-[300px]">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-6">
            Order Status Distribution
          </h2>
          <div className="h-[300px]">
            <Doughnut data={orderStatusData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ItemList title="Top Products" items={topProducts} icon={FaBoxOpen} />

        <ItemList
          title="Top Locations"
          items={topLocations}
          icon={FaMapMarkerAlt}
        />
      </div>
    </div>
  );
};

StatisticsSection.propTypes = {
  groupedOrders: PropTypes.object.isRequired,
};

export default StatisticsSection;
