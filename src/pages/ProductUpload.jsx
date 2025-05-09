import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../utils/firebase";
import bgImage from "../assets/7.jpg";
import ProductUploadForm from "../components/product/ProductUploadForm";
import ProductDeleteForm from "../components/product/ProductDeleteForm";
import ProductNotification from "../components/product/ProductNotification";

const ProductUpload = () => {
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState(null);
  const [productSinglePrice, setProductSinglePrice] = useState("");
  const [productComboPrice, setProductComboPrice] = useState("");
  const [productColor, setProductColor] = useState("");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [fileLoading, setFileLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [deleteProductName, setDeleteProductName] = useState("");
  const [deleteProductColor, setDeleteProductColor] = useState("");
  const [deleteProductImageUrl, setDeleteProductImageUrl] = useState("");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isDeleteForm, setIsDeleteForm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Custom message function
  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setShowNotification(true);
  };

  // Fetch the highest ID and set the next ID
  useEffect(() => {
    const fetchHighestId = async () => {
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
        console.log("Next product ID:", highestId + 1);
        setProductId(highestId + 1);
      } catch (error) {
        console.error("Error fetching product ID:", error.message);
        showMessage("Failed to fetch highest product ID.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighestId();
  }, []);

  const toggleForm = () => {
    setIsDeleteForm(!isDeleteForm);
    setMessage("");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10 px-4 sm:px-0"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
      }}>
      <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-md backdrop-blur-sm bg-opacity-95 border border-gray-100 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-6">
          <h1 className="font-sans font-semibold text-[28px] mb-2">
            <span className="text-white bg-black px-1 py-0.5 rounded-sm">
              DREZZ
            </span>
            <span className="text-[#BD815A] font-bold">UP</span>
          </h1>
          <h2 className="text-xl font-medium text-gray-700 mb-1">
            {isDeleteForm ? "Delete Product" : "Upload Product"}
          </h2>
          <div className="w-20 h-1 bg-[#BD815A] mx-auto rounded-full"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BD815A]"></div>
          </div>
        ) : !isDeleteForm ? (
          <ProductUploadForm
            productId={productId}
            productName={productName}
            setProductName={setProductName}
            productSinglePrice={productSinglePrice}
            setProductSinglePrice={setProductSinglePrice}
            productComboPrice={productComboPrice}
            setProductComboPrice={setProductComboPrice}
            productColor={productColor}
            setProductColor={setProductColor}
            productImageUrl={productImageUrl}
            setProductImageUrl={setProductImageUrl}
            setProductId={setProductId}
            fileLoading={fileLoading}
            setFileLoading={setFileLoading}
            showMessage={showMessage}
            toggleForm={toggleForm}
          />
        ) : (
          <ProductDeleteForm
            deleteProductName={deleteProductName}
            setDeleteProductName={setDeleteProductName}
            deleteProductColor={deleteProductColor}
            setDeleteProductColor={setDeleteProductColor}
            deleteProductImageUrl={deleteProductImageUrl}
            setDeleteProductImageUrl={setDeleteProductImageUrl}
            deleteProductId={deleteProductId}
            setDeleteProductId={setDeleteProductId}
            deleteLoading={deleteLoading}
            setDeleteLoading={setDeleteLoading}
            showMessage={showMessage}
            toggleForm={toggleForm}
            setProductId={setProductId}
          />
        )}
      </div>

      {/* Popup Notification */}
      <ProductNotification
        showNotification={showNotification}
        setShowNotification={setShowNotification}
        message={message}
        messageType={messageType}
      />
    </div>
  );
};

export default ProductUpload;
