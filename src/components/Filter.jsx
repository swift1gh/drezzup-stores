import React from "react";
import FilterButton from "./FilterButton";

const Filter = ({ selectedBrand, setSelectedBrand }) => {
  const brands = [
    "All",
    "Air Jordan",
    "Nike",
    "Timberland",
    "Amiri",
    "Adidas",
    "Asics",
    "Balenciaga",
    "Converse",
    "New Balance",
    "Puma",
    "Reebok",
    "Vans",
    "Yeezy",
    "Bape",
    "Dr. Martens",
    "Louis Vuitton",
    "Rick Owens",
    "Christian Dior",
  ];

  const sortedBrands = ["All", ...brands.slice(1).sort()];

  return (
    <nav className="px-3 pb-4 mb-7 pt-2 bg-gradient-to-b from-[#FBF4F4] to-[#ffffff00] flex justify-center items-center sticky w-full z-40 overflow-x-auto">
      <div className="relative w-full max-w-6xl md:max-w-7xl overflow-x-auto md:overflow-x-hidden scroll-smooth">
        {/* Left shadow gradient for scroll indication */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#FBF4F4] to-transparent z-10 pointer-events-none rounded-2xl"></div>

        <div
          id="filters"
          className="flex gap-2 overflow-x-auto scrollbar-hide p-3 scroll-smooth">
          {sortedBrands.map((brand) => (
            <FilterButton
              key={brand}
              Name={brand}
              isActive={selectedBrand === brand}
              onClick={() => setSelectedBrand(brand)}
            />
          ))}
        </div>

        {/* Right shadow gradient for scroll indication */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FBF4F4] to-transparent z-10 pointer-events-none rounded-2xl"></div>
      </div>
    </nav>
  );
};

export default Filter;
