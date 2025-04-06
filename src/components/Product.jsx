import React, { useState } from "react";
import { motion } from "framer-motion";

const Product = ({
  Image,
  Name,
  Color,
  singlePrice,
  comboPrice,
  isSelected,
  selectProduct,
  loading,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`flex justify-center items-center cursor-pointer ${
        isSelected ? "scale-105" : "scale-100"
      } transition-transform duration-200 hover:scale-[1.02]`}
      onClick={selectProduct}>
      <div
        className={`border md:hover:shadow-lg rounded-2xl p-[6px] md:p-3 bg-white w-[10rem] md:w-[12rem] h-auto transition-all duration-200 ${
          isSelected
            ? "border-b-4 border-2 border-[#bd815a] shadow-md"
            : "border-[#e0e0e0] hover:border-gray-400"
        }`}>
        <div className="p-1 bg-gray-200 w-auto h-[7rem] md:h-[8rem] flex justify-center items-center rounded-2xl shadow-inner border border-[#e5e5e5] relative overflow-hidden">
          {(!imageLoaded || loading) && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-10 h-10 border-4 border-gray-300 border-t-[#BD815A] rounded-full absolute"
            />
          )}
          <img
            src={Image}
            alt={Name}
            className={`h-full object-contain w-full transition-all duration-500 mx-auto ${
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        </div>
        <div className="flex flex-col py-2">
          <h2 className="uppercase font-bold font-robotoCondensed text-[12px] md:text-[16px] text-gray-800 line-clamp-1">
            {Name}
          </h2>
          <span className="font-thin text-[10px] md:text-[12px] text-gray-600">
            {Color}
          </span>
        </div>
        <div className="w-full justify-center items-center text-center py-1 bg-[#f9f6f4] rounded-lg">
          <span className="font-mono font-semibold text-[12px] md:text-[16px] text-[#BD815A]">
            {singlePrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Product;
