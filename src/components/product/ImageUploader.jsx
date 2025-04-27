import React, { useState } from "react";
import { FaUpload, FaSpinner, FaTimes } from "react-icons/fa";
import removeBg from "../../utils/removeBg";

const ImageUploader = ({
  fileLoading,
  setFileLoading,
  showMessage,
  onImageProcessed,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Only log component initialization in development
  if (process.env.NODE_ENV === "development") {
    console.log("[ImageUploader] Component rendered");
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Log important file info
    console.log("[ImageUploader] Processing file:", file.name, file.size);

    const validImageTypes = ["image/jpeg", "image/png"];
    if (!validImageTypes.includes(file.type)) {
      showMessage("Please upload a valid image file (PNG or JPEG).", "error");
      return;
    }

    setFileLoading(true);
    showMessage("Processing image...", "info");

    try {
      // Background removal process
      let processedImageUrl;
      try {
        console.log("[ImageUploader] Removing background...");
        processedImageUrl = await removeBg(file);
      } catch (bgError) {
        console.error(
          "[ImageUploader] Background removal failed:",
          bgError.message
        );
        showMessage(
          "Background removal failed. Uploading original image...",
          "info"
        );
        processedImageUrl = null;
      }

      let fileToUpload = file;

      if (processedImageUrl) {
        try {
          const response = await fetch(processedImageUrl);
          const blob = await response.blob();
          fileToUpload = new File([blob], file.name, { type: "image/png" });
          fileToUpload = await resizeImage(fileToUpload);
          console.log("[ImageUploader] Image processed successfully");
        } catch (conversionError) {
          console.error(
            "[ImageUploader] Processing error:",
            conversionError.message
          );
          fileToUpload = file;
        }
      }

      const preview = URL.createObjectURL(fileToUpload);
      setPreviewUrl(preview);

      setFileLoading(false);
      showMessage(
        "Image processed successfully! Click 'Upload Product' to complete.",
        "success"
      );

      onImageProcessed(fileToUpload);
    } catch (error) {
      console.error("[ImageUploader] Error:", error.message);
      showMessage(
        `Error processing image: ${error.message}. Please try again.`,
        "error"
      );
      setFileLoading(false);
    }
  };

  const handleCancel = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    onImageProcessed(null);
    window.processedFileToUpload = null;
    showMessage("Image removed", "info");
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

        let width = img.width;
        let height = img.height;

        // Calculate dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, {
            type: "image/png",
          });
          resolve(resizedFile);
        }, "image/png");
      };

      img.onerror = (error) => {
        console.error("[ImageUploader] Image load error:", error);
        resolve(file); // Return original file on error
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

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const event = { target: { files: [file] } };
      handleFileUpload(event);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 p-6 border-2 ${
        isDragging
          ? "border-[#BD815A] bg-[#f5ece7]"
          : "border-dashed border-gray-300 bg-gray-100"
      } rounded-lg hover:border-[#BD815A] transition-colors duration-300`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}>
      {previewUrl ? (
        <div className="relative">
          <div className="relative rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-contain"
            />
            <button
              onClick={handleCancel}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg z-10"
              title="Remove image">
              <FaTimes />
            </button>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600 font-medium">
            Image ready for upload
          </p>
        </div>
      ) : (
        <>
          <label className="cursor-pointer">
            <div className="flex flex-col items-center justify-center gap-3 text-center">
              <div
                className={`p-3 ${
                  isDragging ? "bg-[#f5ece7]" : "bg-gray-100"
                } rounded-full transition-colors duration-300`}>
                {fileLoading ? (
                  <FaSpinner className="w-6 h-6 text-[#BD815A] animate-spin" />
                ) : (
                  <FaUpload
                    className={`w-6 h-6 ${
                      isDragging ? "text-[#BD815A]" : "text-gray-500"
                    } transition-colors duration-300`}
                  />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-700">
                  {isDragging
                    ? "Drop image here"
                    : "Drag & drop or click to upload"}
                </p>
                <p className="text-sm text-gray-500">PNG or JPG</p>
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/png,image/jpeg"
              />
            </div>
          </label>
          <span className="text-sm text-center font-medium">
            {fileLoading ? (
              <span className="text-[#BD815A]">Processing image...</span>
            ) : (
              <span className="text-gray-500">No file chosen</span>
            )}
          </span>
        </>
      )}
    </div>
  );
};

export default ImageUploader;
