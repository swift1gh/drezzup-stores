import React from "react";
import PropTypes from "prop-types";
import {
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
  FaCheckDouble,
  FaCloudUploadAlt,
  FaFileAlt,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";

/**
 * Dashboard sidebar navigation component
 */
const Sidebar = ({
  isSidebarOpen,
  handleToggleSidebar,
  filter,
  handleSidebarButtonClick,
}) => {
  return (
    <div
      className={`backdrop-blur-md bg-[#1a202c]/90 text-white transition-all duration-300 ease-in-out h-screen ${
        isSidebarOpen ? "w-64" : "w-20"
      } flex flex-col flex-shrink-0 border-r border-gray-700/30`}>
      <div className="p-4 flex items-center justify-between border-b border-gray-700/30">
        {isSidebarOpen && (
          <div className="font-sans font-semibold text-[20px]">
            <span className="text-white bg-black px-1 py-0.5 rounded-sm">
              DREZZ
            </span>
            <span className="text-[#BD815A] font-bold">UP</span>
          </div>
        )}
        <button
          onClick={handleToggleSidebar}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors">
          {isSidebarOpen ? (
            <FaAngleDoubleLeft size={20} />
          ) : (
            <FaAngleDoubleRight size={20} />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div>
          <button
            onClick={() => handleSidebarButtonClick("new")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors mt-2 ${
              filter === "new" ? "bg-gray-700" : ""
            }`}>
            {isSidebarOpen ? (
              <>
                <FaFileAlt size={24} className="text-[#BD815A]" />
                <span>New</span>
              </>
            ) : (
              <FaFileAlt size={24} className="mx-auto text-[#BD815A]" />
            )}
          </button>

          <button
            onClick={() => handleSidebarButtonClick("paid")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors mt-2 ${
              filter === "paid" ? "bg-gray-700" : ""
            }`}>
            {isSidebarOpen ? (
              <>
                <FaMoneyBillWave size={24} className="text-[#BD815A]" />
                <span>Paid</span>
              </>
            ) : (
              <FaMoneyBillWave size={24} className="mx-auto text-[#BD815A]" />
            )}
          </button>

          <button
            onClick={() => handleSidebarButtonClick("done")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors mt-2 ${
              filter === "done" ? "bg-gray-700" : ""
            }`}>
            {isSidebarOpen ? (
              <>
                <FaCheckDouble size={24} className="text-[#BD815A]" />
                <span>Done</span>
              </>
            ) : (
              <FaCheckDouble size={24} className="mx-auto text-[#BD815A]" />
            )}
          </button>
        </div>

        <div className="mt-auto mb-2 fixed bottom-0">
          <a
            href="/admin/product-upload"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (window.innerWidth < 768) {
                handleSidebarButtonClick("upload");
              }
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors ${
              filter === "upload" ? "bg-gray-700" : ""
            }`}>
            {isSidebarOpen ? (
              <>
                <FaCloudUploadAlt size={24} className="text-[#BD815A]" />
                <span>Products</span>
              </>
            ) : (
              <FaCloudUploadAlt size={24} className="mx-auto text-[#BD815A]" />
            )}
          </a>

          <button
            onClick={() => handleSidebarButtonClick("summary")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 transition-colors mt-2 ${
              filter === "summary" ? "bg-gray-700" : ""
            }`}>
            {isSidebarOpen ? (
              <>
                <FaChartLine size={24} className="text-[#BD815A]" />
                <span>Summary</span>
              </>
            ) : (
              <FaChartLine size={24} className="mx-auto text-[#BD815A]" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  handleToggleSidebar: PropTypes.func.isRequired,
  filter: PropTypes.string.isRequired,
  handleSidebarButtonClick: PropTypes.func.isRequired,
};

export default Sidebar;
