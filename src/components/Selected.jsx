import React from "react";
import Product from "./Product";
import WarningIcon from "../assets/warning.svg";
import { motion } from "framer-motion";

const Selected = ({ selectedProducts, totalComboPrice }) => {
  return (
    <div className="mb-10 mt-5">
      {selectedProducts.length === 0 ? (
        <div className="pt-28">
          <div className="flex justify-center items-center gap-2">
            <img src={WarningIcon} className="h-6" alt="Warning" />
            <span>No Product Selected</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h2 className="p-2 font-mono font-bold text-gray-600">
            Selected Sneakers
          </h2>
          <motion.div
            initial={{ opacity: 0, x: -200 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`${
              selectedProducts.length === 1
                ? "flex"
                : selectedProducts.length > 1 && selectedProducts.length < 4
                ? "md:flex"
                : "grid"
            } ${
              selectedProducts.length !== 1
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                : ""
            } p-2`}>
            {selectedProducts.map((prod) => (
              <div key={prod.id} className="scale-90">
                <React.Suspense
                  fallback={
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full mx-auto"
                    />
                  }>
                  <Product
                    Image={prod.image}
                    Color={prod.color}
                    singlePrice={`GHS ${prod.singlePrice}.00`}
                    Name={prod.name}
                  />
                </React.Suspense>
              </div>
            ))}
          </motion.div>

          {selectedProducts.length > 1 ? (
            <motion.div
              initial={{ opacity: 0, x: 200 }}
              transition={{ duration: 1 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#cbcaca] w-11/12 md:w-4/5 py-4 rounded-3xl">
              <h2 className="flex justify-center text-center items-center gap-3 text-xl font-normal font-roboto">
                Combo Price:{" "}
                <span className="text-[#cf743c] font-mono font-bold md:text-2xl">
                  GHS {totalComboPrice}.00
                </span>
              </h2>
            </motion.div>
          ) : (
            <div className="pt-5">
              <div className="flex justify-center items-center gap-2 px-8">
                <img src={WarningIcon} className="h-6" alt="Warning" />
                <span>
                  The Combo Price Cannot Be Calculated On Only One Pair Of
                  Sneakers
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Selected;
