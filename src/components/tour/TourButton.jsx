import React from "react";
import { FaLightbulb } from "react-icons/fa";
import { motion } from "framer-motion";

const TourButton = ({ startTour, isMobile }) => {
  return (
    <motion.button
      onClick={startTour}
      className="fixed bottom-14 md:bottom-16 z-[9000] flex items-center justify-center rounded-full p-0 overflow-hidden"
      style={{
        left: isMobile ? "20px" : "auto",
        right: isMobile ? "auto" : "5px",
        width: "50px",
        height: "50px",
        background: "linear-gradient(135deg, #d29c7b 0%, #c78b6a 100%)",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        boxShadow: [
          "0 4px 8px rgba(0, 0, 0, 0.1)",
          "0 6px 20px rgba(210, 156, 123, 0.4)",
          "0 4px 8px rgba(0, 0, 0, 0.1)",
        ],
      }}
      transition={{
        duration: 0.5,
        boxShadow: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        },
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 6px 20px rgba(210, 156, 123, 0.6)",
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Start tour">
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, transparent 60%, rgba(255, 255, 255, 0.1) 70%)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
        <FaLightbulb size={22} className="text-yellow-100" />
      </motion.div>
    </motion.button>
  );
};

export default TourButton;
