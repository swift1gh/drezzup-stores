import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaSpinner, FaArrowLeft } from "react-icons/fa";
import {
  collection,
  getDocs,
  query,
  deleteDoc,
  doc,
  orderBy,
  limit,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "../../utils/firebase";

const ProductDeleteForm = ({
  deleteProductName,
  setDeleteProductName,
  deleteProductColor,
  setDeleteProductColor,
  deleteProductImageUrl,
  setDeleteProductImageUrl,
  deleteProductId,
  setDeleteProductId,
  deleteLoading,
  setDeleteLoading,
  showMessage,
  toggleForm,
  setProductId,
}) => {
  const formatText = (text) => {
    return text
      .trim() // Remove spaces from beginning and end
      .replace(/\s+/g, " "); // Replace multiple spaces with a single space
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!deleteProductName || !deleteProductColor) {
        return;
      }

      setDeleteLoading(true);

      try {
        const productsRef = collection(db, "products");
        // Case insensitive search
        const productQuery = query(productsRef);
        const querySnapshot = await getDocs(productQuery);

        // Perform case-insensitive filtering in JavaScript
        const matchingDocs = querySnapshot.docs.filter((doc) => {
          const data = doc.data();
          return (
            data.name.toLowerCase() === deleteProductName.toLowerCase() &&
            data.color.toLowerCase() === deleteProductColor.toLowerCase()
          );
        });

        if (matchingDocs.length > 0) {
          const product = matchingDocs[0].data();
          setDeleteProductId(matchingDocs[0].id);
          setDeleteProductImageUrl(product.image);
          showMessage("Product found. Confirm deletion.", "info");
        } else {
          showMessage("Product not found.", "error");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        showMessage(`Error fetching product: ${error.message}`, "error");
      } finally {
        setDeleteLoading(false);
      }
    };

    fetchProduct();
  }, [deleteProductName, deleteProductColor]);

  const handleSearch = async () => {
    if (!deleteProductName || !deleteProductColor) {
      showMessage("Please fill in both fields.", "error");
      return;
    }

    setDeleteLoading(true);

    try {
      const productsRef = collection(db, "products");
      // Case insensitive search
      const productQuery = query(productsRef);
      const querySnapshot = await getDocs(productQuery);

      // Perform case-insensitive filtering in JavaScript
      const matchingDocs = querySnapshot.docs.filter((doc) => {
        const data = doc.data();
        return (
          data.name.toLowerCase() ===
            formatText(deleteProductName).toLowerCase() &&
          data.color.toLowerCase() ===
            formatText(deleteProductColor).toLowerCase()
        );
      });

      if (matchingDocs.length > 0) {
        const product = matchingDocs[0].data();
        setDeleteProductId(matchingDocs[0].id);
        setDeleteProductImageUrl(product.image);
        showMessage("Product found. Confirm deletion.", "info");
      } else {
        showMessage("Product not found.", "error");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      showMessage(`Error fetching product: ${error.message}`, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Extract image path from Firebase Storage URL
  const getImagePathFromUrl = (url) => {
    try {
      // Extract the path after /o/ and before the query parameters
      const parsedUrl = new URL(url);
      const pathSegment = parsedUrl.pathname.split("/o/")[1];

      // Decode the URL-encoded path
      if (pathSegment) {
        return decodeURIComponent(pathSegment);
      }
      return null;
    } catch (error) {
      console.error("Error parsing image URL:", error);
      return null;
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) {
      showMessage("No product selected for deletion.", "error");
      return;
    }

    setDeleteLoading(true);
    try {
      console.log("Deleting product with ID:", deleteProductId);

      // Delete the image from Firebase Storage if we have an image URL
      if (deleteProductImageUrl) {
        try {
          const storage = getStorage();
          const imagePath = getImagePathFromUrl(deleteProductImageUrl);

          if (imagePath) {
            const imageRef = ref(storage, imagePath);
            await deleteObject(imageRef);
            console.log("Product image deleted successfully from Storage");
          } else {
            console.warn("Could not parse image path from URL");
          }
        } catch (imageError) {
          console.error("Error deleting product image:", imageError);
          showMessage(
            `Warning: Product deleted but image deletion failed: ${imageError.message}`,
            "warning"
          );
        }
      }

      // Delete the product document from Firestore
      await deleteDoc(doc(db, "products", deleteProductId));
      showMessage("Product deleted successfully!", "success");
      setDeleteProductName("");
      setDeleteProductColor("");
      setDeleteProductImageUrl("");
      setDeleteProductId(null);

      // Update product number after deletion
      // Fetch the highest ID and set the next ID
      try {
        const productsRef = collection(db, "products");
        const highestIdQuery = query(
          productsRef,
          orderBy("id", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(highestIdQuery);

        const highestId = !querySnapshot.empty
          ? querySnapshot.docs[0].data().id
          : 0;
        console.log("Highest ID after deletion:", highestId);
        setProductId(highestId + 1);
      } catch (error) {
        console.error("Error updating product ID after deletion:", error);
        showMessage(
          "Product deleted, but failed to update product number.",
          "info"
        );
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showMessage(`Error deleting product: ${error.message}`, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBackToUpload = () => {
    setDeleteProductName("");
    setDeleteProductColor("");
    setDeleteProductImageUrl("");
    setDeleteProductId(null);
    toggleForm();
  };

  return (
    <div>
      <form className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Product Name"
            value={deleteProductName}
            onChange={(e) => setDeleteProductName(e.target.value)}
            className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-200"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Product Color"
            value={deleteProductColor}
            onChange={(e) => setDeleteProductColor(e.target.value)}
            className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-200"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="bg-gray-700 text-white font-medium p-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 shadow-md flex items-center justify-center gap-2">
          <FaSearch className="mr-1" />
          Search Product
        </button>

        {deleteProductImageUrl && (
          <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <div className="flex justify-center mb-2">
              <img
                src={deleteProductImageUrl}
                alt={deleteProductName}
                className="h-32 object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="text-center space-y-1">
              <p className="font-medium text-gray-800">{deleteProductName}</p>
              <p className="text-sm text-gray-500">{deleteProductColor}</p>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className={`w-full mt-4 bg-red-500 text-white font-medium p-3 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md flex items-center justify-center gap-2 ${
                deleteLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}>
              {deleteLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <FaTrash className="mr-1" />
                  Delete Product
                </>
              )}
            </button>
          </div>
        )}
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={handleBackToUpload}
          className="text-[#BD815A] hover:text-[#a06b4a] transition-colors duration-200 text-sm underline flex items-center justify-center gap-1 mx-auto">
          <FaArrowLeft className="text-xs" />
          Back to Upload
        </button>
      </div>
    </div>
  );
};

export default ProductDeleteForm;
