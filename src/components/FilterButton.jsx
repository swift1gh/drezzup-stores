import React from "react";
import { motion } from "framer-motion";

const FilterButton = ({ Name, isActive, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-3 md:px-4 py-1.5 whitespace-nowrap shadow-md border text-sm md:text-base rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-[#BD815A] text-white border-[#BD815A] font-medium"
          : "bg-white text-gray-700 border-[#e0e0e0] hover:border-[#BD815A] hover:text-[#BD815A]"
      }`}
      onClick={onClick}>
      {Name}
    </motion.button>
  );
};

export default FilterButton;
