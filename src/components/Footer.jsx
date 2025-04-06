import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#FBF4F4] py-2 md:py-3 w-full md:mt-auto border-t border-gray-200 mt-28">
      <div className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="font-sans font-semibold text-[20px]">
              <span className="text-white bg-black px-1 py-0.5 rounded-sm">
                DREZZ
              </span>
              <span className="text-[#BD815A] font-bold">UP</span>
            </h1>
          </div>

          <p className="text-sm mb-2">
            &#169;2025 DREZZUP. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
