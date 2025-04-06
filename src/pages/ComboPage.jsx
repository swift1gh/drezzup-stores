import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Selected from "../components/Selected";
import Footer from "../components/Footer";
import OrderForm from "../components/OrderForm";
import { motion } from "framer-motion"; 
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import bgImage from "../assets/7.jpg";

const ComboPage = () => {
  const location = useLocation();
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const selectedIds = useMemo(
    () => (queryParams.get("ids") ? queryParams.get("ids").split(",") : []),
    [queryParams]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Prevent state updates after unmount

    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const products = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((product) => selectedIds.includes(product.id.toString()));

        if (isMounted) {
          setSelectedProducts(products);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false; // Cleanup function to avoid memory leaks
    };
  }, [selectedIds]);

  // Calculate totalComboPrice
  const totalComboPrice = useMemo(() => {
    const productTotal = selectedProducts.reduce(
      (total, prod) => total + (prod.comboPrice || 0),
      0
    );
    return productTotal + selectedIds.length * 100;
  }, [selectedProducts, selectedIds]);

  if (loading) {
    return (
      <div 
        className="flex justify-center items-center h-screen"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex justify-center items-center h-screen"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <p className="bg-white p-4 rounded-lg shadow-md">Error fetching products: {error.message}</p>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <Navbar Btn={"Home"} Destination="/" />

      <main className="flex-grow">
        <Selected
          totalComboPrice={totalComboPrice}
          selectedProducts={selectedProducts}
        />

        {selectedIds.length > 1 && (
          <OrderForm selectedIds={selectedIds} comboPrice={totalComboPrice} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ComboPage;
