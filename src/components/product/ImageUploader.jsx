import React from "react";
import { FaUpload, FaSpinner } from "react-icons/fa";
import { upload } from "../../utils/storage";
import removeBg from "../../utils/removeBg";

const ImageUploader = ({
  fileLoading,
  setFileLoading,
  showMessage,
  onImageProcessed,
}) => {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      showMessage("Please upload a valid image file (PNG or JPEG).", "error");
      return;
    }

    setFileLoading(true);
    showMessage("Processing image...", "info");

    try {
      // First try to remove background
      let processedImageUrl;
      try {
        console.log("Removing background from image...");
        processedImageUrl = await removeBg(file);
      } catch (bgError) {
        console.error("Background removal failed:", bgError);
        showMessage(
          "Background removal failed. Uploading original image...",
          "info"
        );
        processedImageUrl = null;
      }

      // If background removal fails, use the original file
      let fileToUpload = file;

      // If background removal succeeded, convert URL to File
      if (processedImageUrl) {
        try {
          const response = await fetch(processedImageUrl);
          const blob = await response.blob();
          fileToUpload = new File([blob], file.name, { type: "image/png" });
          // Resize the image after background removal
          fileToUpload = await resizeImage(fileToUpload);
        } catch (conversionError) {
          console.error("Error converting blob URL to File:", conversionError);
          fileToUpload = file; // Fallback to original file
        }
      }

      // Store the file for later upload instead of uploading immediately
      setFileLoading(false);
      showMessage(
        "Image processed successfully! Click 'Upload Product' to complete.",
        "success"
      );

      // Pass the processed file to the parent component
      onImageProcessed(fileToUpload);
    } catch (error) {
      console.error("Error processing image:", error);
      showMessage(
        `Error processing image: ${error.message}. Please try again.`,
        "error"
      );
      setFileLoading(false);
    }
  };

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 700;
        const maxHeight = 500;

        // Calculate dimensions while preserving aspect ratio
        let width = img.width;
        let height = img.height;

        // Calculate the scaling ratio to fit within our constraints
        if (width > height) {
          // Landscape orientation
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          // Portrait orientation
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }

        // Set canvas size to the new dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw image with the new dimensions
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: "image/png" }));
        }, "image/png");
      };
    });
  };

  const formatProductName = (name) => {
    return name
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/\s+/g, "");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileUpload(event);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#BD815A] transition-colors duration-200 bg-gray-100"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}>
      <label className="cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-3 text-center">
          <div className="p-3 bg-gray-100 rounded-full">
            <FaUpload className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className="font-medium text-gray-700">
              Drag & drop or click to upload
            </p>
            <p className="text-sm text-gray-500">PNG or JPG</p>
          </div>
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </div>
      </label>
      <span className="text-sm text-gray-500 text-center">
        {fileLoading
          ? "Processing..."
          : window.processedFileToUpload
          ? "File ready for upload"
          : "No file chosen"}
      </span>
    </div>
  );
};

export default ImageUploader;
