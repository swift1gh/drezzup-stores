import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Product from "./Product";
import warningIcon from "../assets/warning.svg";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

// Number of products to display per page
const ITEMS_PER_PAGE = 12;

const AllProducts = ({ setSelectedProducts, selectedBrand, searchTerm }) => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [error, setError] = useState(null);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        let productsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const shuffleArray = (array) => {
          for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        };

        productsList = shuffleArray(productsList);
        setProducts(productsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSelectProduct = useCallback(
    (id) => {
      setSelectedProductIds((prevSelected) => {
        const newSelected = prevSelected.includes(id)
          ? prevSelected.filter((prodId) => prodId !== id)
          : [...prevSelected, id];

        setSelectedProducts(newSelected);
        return newSelected;
      });
    },
    [setSelectedProducts]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesBrand =
        selectedBrand === "All" ||
        prod.name.toLowerCase().includes(selectedBrand.toLowerCase());
      const matchesSearchTerm =
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.color.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesBrand && matchesSearchTerm;
    });
  }, [products, selectedBrand, searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedBrand, searchTerm]);

  const getItemsPerPage = () => {
    if (windowWidth >= 1280) {
      return 15; // xl - 5 items per row × 3 rows
    } else if (windowWidth >= 1024) {
      return 15; // lg - 5 items per row × 3 rows
    } else if (windowWidth >= 768) {
      return 12; // md - 4 items per row × 3 rows
    } else if (windowWidth >= 640) {
      return 9; // sm - 3 items per row × 3 rows
    } else {
      return 6; // xs - 2 items per row × 3 rows
    }
  };

  const visibleProducts = useMemo(() => {
    const itemsPerPage = getItemsPerPage();
    return filteredProducts.slice(0, page * itemsPerPage);
  }, [filteredProducts, page, windowWidth]);

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const hasMoreProducts = visibleProducts.length < filteredProducts.length;

  return (
    <div className="flex flex-col justify-center items-center mb-10">
      {error && <p>{error.message || error.toString()}</p>}

      {loading ? (
        <motion.div
          className="text-lg font-semibold text-gray-500 flex items-center gap-2 py-10"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
          }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-5 h-5 border-3 border-gray-300 border-t-[#BD815A] rounded-full"
          />
          Loading Sneakers...
        </motion.div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <img
            src={warningIcon}
            alt="No results"
            className="w-12 h-12 mb-3 opacity-70"
          />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            No Sneakers Found
          </h3>
          <p className="text-gray-600 max-w-md italic text-sm font-thin">
            We couldn't find any sneakers matching your search criteria. Check
            your internet connection and try adjusting your filters or search
            term.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 md:gap-5 px-2 md:px-5">
            <AnimatePresence>
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  <Product
                    Image={product.image}
                    Name={product.name}
                    Color={product.color}
                    singlePrice={`GHS ${product.singlePrice}.00`}
                    isSelected={selectedProductIds.includes(product.id)}
                    selectProduct={() => handleSelectProduct(product.id)}
                    loading={loading}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMoreProducts && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 px-6 py-2 bg-[#BD815A] text-white rounded-xl shadow-md hover:bg-[#a06b4a] transition-colors duration-200 font-medium"
              onClick={loadMore}>
              Show More
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

export default AllProducts;
