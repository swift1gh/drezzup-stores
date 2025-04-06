import { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";

/**
 * Custom hook to manage products from Firestore
 * @returns {Object} Products state and management functions
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from Firestore
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching products...");
      const querySnapshot = await getDocs(collection(db, "products"));

      if (querySnapshot.empty) {
        console.warn("No products found in Firestore.");
      }

      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Fetched Products:", productList);
      setProducts(productList);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again.");
      setLoading(false);
      return false;
    }
  }, []);

  // Load products on initial hook mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Get products by IDs
  const getProductsByIds = (productIds) => {
    if (!productIds || !Array.isArray(productIds)) return [];

    return products.filter((product) =>
      productIds.includes(product.id.toString())
    );
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProductsByIds,
  };
}
