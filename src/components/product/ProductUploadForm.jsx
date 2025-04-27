import React, { useState, useEffect } from "react";
import {
  FaSpinner,
  FaTrash,
  FaUpload,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { upload } from "../../utils/storage";
import ImageUploader from "./ImageUploader";

const ProductUploadForm = ({
  productId,
  productName,
  setProductName,
  productSinglePrice,
  setProductSinglePrice,
  productComboPrice,
  setProductComboPrice,
  productColor,
  setProductColor,
  productImageUrl,
  setProductImageUrl,
  setProductId,
  fileLoading,
  setFileLoading,
  showMessage,
  toggleForm,
}) => {
  const [processedFile, setProcessedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("[ProductUploadForm] Initialized with product ID:", productId);

  const handleImageProcessed = (file) => {
    setProcessedFile(file);
    window.processedFileToUpload = file;
    if (file) {
      console.log("[ProductUploadForm] Image processed:", file.name);
    }
  };

  const handleRemoveImage = () => {
    if (processedFile) {
      URL.revokeObjectURL(URL.createObjectURL(processedFile));
    }

    setProcessedFile(null);
    window.processedFileToUpload = null;
    setProductImageUrl("");

    showMessage("Image removed", "info");
  };

  const formatText = (text) => {
    const formatted = text
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
    return formatted;
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleProductColorChange = (e) => {
    setProductColor(e.target.value);
  };

  const handleUpload = async () => {
    if (isSubmitting) return;

    const formattedName = formatText(productName);
    const formattedColor = formatText(productColor);

    setProductName(formattedName);
    setProductColor(formattedColor);

    if (!formattedName) {
      showMessage("Please enter a valid product name.", "error");
      return;
    }

    if (!productSinglePrice || productSinglePrice.trim() === "") {
      showMessage("Please enter a valid single price.", "error");
      return;
    }

    if (!productComboPrice || productComboPrice.trim() === "") {
      showMessage("Please enter a valid combo price.", "error");
      return;
    }

    if (!formattedColor) {
      showMessage("Please enter a valid product color.", "error");
      return;
    }

    if (!processedFile && !productImageUrl) {
      showMessage("Please select an image file.", "error");
      return;
    }

    const parsedSinglePrice = parseFloat(productSinglePrice);
    const parsedComboPrice = parseFloat(productComboPrice);

    if (isNaN(parsedSinglePrice) || isNaN(parsedComboPrice)) {
      showMessage("Prices must be valid numbers.", "error");
      return;
    }

    if (parsedSinglePrice <= 0 || parsedComboPrice <= 0) {
      showMessage("Prices must be greater than zero.", "error");
      return;
    }

    setFileLoading(true);
    setIsSubmitting(true);

    try {
      showMessage("Uploading product...", "info");
      console.log("[ProductUploadForm] Uploading product:", productId);

      let imageUrl = productImageUrl;
      if (processedFile) {
        try {
          console.log("[ProductUploadForm] Uploading image to storage...");
          const uploadResponse = await upload(processedFile);

          imageUrl =
            uploadResponse.cloudinaryUrl ||
            uploadResponse.firebaseUrl ||
            uploadResponse.url;

          console.log("[ProductUploadForm] Image uploaded:", imageUrl);

          setProcessedFile(null);
          window.processedFileToUpload = null;
        } catch (uploadError) {
          console.error(
            "[ProductUploadForm] Upload error:",
            uploadError.message
          );
          showMessage(`Error uploading image: ${uploadError.message}`, "error");
          setFileLoading(false);
          setIsSubmitting(false);
          return;
        }
      }

      const productData = {
        id: productId,
        name: formattedName,
        color: formattedColor,
        image: imageUrl,
        singlePrice: parsedSinglePrice,
        comboPrice: parsedComboPrice,
        createdAt: new Date().toISOString(),
      };

      console.log("[ProductUploadForm] Saving to database...");
      const docRef = await addDoc(collection(db, "products"), productData);
      console.log("[ProductUploadForm] Saved with ID:", docRef.id);

      showMessage("Product uploaded successfully!", "success");

      setProductName("");
      setProductId((prevId) => prevId + 1);
      setProductSinglePrice("");
      setProductComboPrice("");
      setProductColor("");
      setProductImageUrl("");
    } catch (error) {
      console.error("[ProductUploadForm] Error:", error.message);
      showMessage(`Error uploading product: ${error.message}`, "error");
    } finally {
      setFileLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setProductName("");
    setProductSinglePrice("");
    setProductComboPrice("");
    setProductColor("");
    setProductImageUrl("");
    setProcessedFile(null);
    window.processedFileToUpload = null;
  };

  return (
    <div>
      <div className="bg-gray-200 p-3 rounded-lg text-center mb-4">
        <span className="font-medium">Product {productId}</span>
      </div>

      <form className="flex flex-col gap-5">
        <div className="relative group">
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={handleProductNameChange}
            className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-300 hover:border-[#BD815A]"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#BD815A] transition-colors duration-300">
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

        <div className="relative group">
          <input
            type="text"
            placeholder="Color"
            value={productColor}
            onChange={handleProductColorChange}
            className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-300 hover:border-[#BD815A]"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#BD815A] transition-colors duration-300">
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

        <div className="grid grid-cols-2 gap-4">
          <div className="relative group">
            <input
              type="text"
              placeholder="Single Price"
              value={productSinglePrice}
              onChange={(e) => setProductSinglePrice(e.target.value)}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-300 hover:border-[#BD815A]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#BD815A] transition-colors duration-300">
              ₵
            </span>
          </div>
          <div className="relative group">
            <input
              type="text"
              placeholder="Combo Price"
              value={productComboPrice}
              onChange={(e) => setProductComboPrice(e.target.value)}
              className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-300 hover:border-[#BD815A]"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-[#BD815A] transition-colors duration-300">
              ₵
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm hover:border-[#BD815A] transition-colors duration-300">
          <div className="flex flex-col gap-4">
            {processedFile ? (
              ""
            ) : (
              <div className="flex flex-col gap-4 justify-center">
                <ImageUploader
                  fileLoading={fileLoading}
                  setFileLoading={setFileLoading}
                  showMessage={showMessage}
                  onImageProcessed={handleImageProcessed}
                />
              </div>
            )}

            {(productImageUrl || processedFile) && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-center bg-gray-200 rounded-lg shadow-sm border border-gray-300 relative overflow-hidden transition-all duration-300 hover:shadow-md">
                  <img
                    src={
                      processedFile
                        ? URL.createObjectURL(processedFile)
                        : productImageUrl
                    }
                    alt="Product Preview"
                    className="w-full h-64 object-cover rounded-lg"
                    style={{ aspectRatio: "7/5" }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg z-10 transform hover:scale-110"
                    title="Remove image"
                    aria-label="Remove image">
                    <FaTimes size={16} />
                  </button>
                </div>
                <p className="text-center text-sm text-gray-600 font-medium">
                  Image Preview
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleUpload}
          disabled={isSubmitting}
          className={`flex-1 bg-[#BD815A] text-white font-medium p-3 rounded-lg hover:bg-[#a06b4a] transition-all duration-300 shadow-md text-center flex items-center justify-center gap-2 ${
            isSubmitting ? "opacity-75 cursor-not-allowed" : ""
          }`}>
          {fileLoading || isSubmitting ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaUpload />
          )}
          {isSubmitting ? "Uploading..." : "Upload Product"}
        </button>

        <hr className="my-1" />

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={handleClearForm}
            className="flex-1 bg-gray-500 text-white font-medium p-3 rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md text-center flex items-center justify-center gap-2">
            <FaTrash />
            Clear Form
          </button>

          <button
            type="button"
            onClick={toggleForm}
            className="flex-1 bg-red-800 text-white font-medium p-3 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md text-center flex items-center justify-center gap-2">
            Delete Product
            <FaArrowRight className="text-xs" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductUploadForm;
