import React from "react";

// Utility component to find and highlight a sneaker for the tour
const SneakerFinder = {
  findSingleSneakerElement: () => {
    try {
      const sneakersContainer = document.querySelector("#sneakers");
      if (!sneakersContainer) {
        console.log("Sneakers container not found");
        return "#sneakers";
      }

      // First, clean up any existing tour-sneaker classes
      document.querySelectorAll(".tour-sneaker").forEach((el) => {
        el.classList.remove("tour-sneaker");
      });

      // Try to find product containers first
      const productContainers = sneakersContainer.querySelectorAll("div[class*='product-container']");
      if (productContainers && productContainers.length > 0) {
        const firstProduct = productContainers[0];
        firstProduct.classList.add("tour-sneaker");
        console.log("Found product container for tour:", firstProduct);
        return ".tour-sneaker";
      }
      
      // If no product containers, look for any div that contains product details
      const allProductDivs = sneakersContainer.querySelectorAll("div");
      for (const div of allProductDivs) {
        // Check if this is a product div (contains an image and has appropriate size)
        const hasImage = div.querySelector("img") !== null;
        const hasAppropriateSize = div.offsetWidth > 80 && div.offsetHeight > 80;
        const isVisible = window.getComputedStyle(div).display !== "none";
        
        if (hasImage && hasAppropriateSize && isVisible) {
          div.classList.add("tour-sneaker");
          console.log("Found alternative product div for tour:", div);
          return ".tour-sneaker";
        }
      }
      
      console.log("No suitable product found, using first child of sneakers container");
      // If still no suitable element found, use the first child of the sneakers container
      const firstChild = sneakersContainer.firstElementChild;
      if (firstChild) {
        firstChild.classList.add("tour-sneaker");
        return ".tour-sneaker";
      }
    } catch (error) {
      console.error("Error finding sneaker element:", error);
    }

    return "#sneakers"; // Fallback to the entire container
  },

  // Clean up any tour-sneaker classes
  cleanupTourSneaker: () => {
    const tourSneaker = document.querySelector(".tour-sneaker");
    if (tourSneaker) {
      tourSneaker.classList.remove("tour-sneaker");
    }
  }
};

export default SneakerFinder;
