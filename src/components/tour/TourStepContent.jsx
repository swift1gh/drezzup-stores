import React from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaFilter,
  FaCalculator,
  FaStore,
  FaArrowRight,
} from "react-icons/fa";

// Component to render the content of each tour step
const TourStepContent = ({ type, isMobile }) => {
  switch (type) {
    case "welcome":
      return (
        <div>
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <FaStore className="text-[#d29c7b] mr-2" /> Welcome to DREZZUP
            Store!
          </h3>
          <p>
            This website was designed to help you create stunning sneaker combos
            and place orders with ease. Let's take a quick tour to get you
            started!
          </p>
        </div>
      );

    case "search":
      return (
        <div>
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <FaSearch className="text-[#d29c7b] mr-2" /> Search for Sneakers
          </h3>
          <p>Use this search bar to find your favorite sneakers by name!</p>
        </div>
      );

    case "filter":
      return (
        <div>
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <FaFilter className="text-[#d29c7b] mr-2" /> Filter by Brand
          </h3>
          <p>
            Use these filters to browse sneakers by your favorite brands. Click
            on any brand to instantly see their collection!
          </p>
        </div>
      );

    case "sneaker":
      return (
        <div>
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <FaShoppingCart className="text-[#d29c7b] mr-2" /> Select a Sneaker
          </h3>
          <p>
            Select a sneaker to add to your combo. Click on this sneaker to add
            it to your selection!
          </p>
        </div>
      );

    case "calculate":
      return (
        <div>
          <h3 className="text-lg font-bold mb-2 flex items-center">
            <FaCalculator className="text-[#d29c7b] mr-2" /> Calculate Your
            Combo
          </h3>
          <p>
            Click Calculate Combo to see your total price instantly after
            selecting two or more sneakers! Our system will calculate the best
            price for your selected items.
          </p>
        </div>
      );

    default:
      return null;
  }
};

export default TourStepContent;
