import React from "react";
import TourStepContent from "./TourStepContent";

// Utility component to generate tour steps
const TourStepGenerator = {
  generateSteps: (isMobile) => {
    const currentIsMobile = isMobile || window.innerWidth < 768;
    console.log("Generating steps, mobile detection:", currentIsMobile);

    // Decide which search element to highlight
    const searchStep = currentIsMobile
      ? {
          target: "#mobile-search",
          content: <TourStepContent type="search" isMobile={currentIsMobile} />,
          placement: "bottom",
          spotlightPadding: 10,
          disableBeacon: true,
        }
      : {
          target: "#search-bar",
          content: <TourStepContent type="search" isMobile={currentIsMobile} />,
          placement: "bottom",
          spotlightPadding: 10,
          disableBeacon: true,
        };

    return [
      {
        target: "#logo",
        content: <TourStepContent type="welcome" isMobile={currentIsMobile} />,
        placement: "bottom",
        spotlightPadding: 10,
        disableBeacon: true,
      },
      searchStep,
      {
        target: "#filters",
        content: <TourStepContent type="filter" isMobile={currentIsMobile} />,
        placement: "bottom",
        spotlightPadding: 10,
        disableBeacon: true,
      },
      {
        target: "#calculate-btn",
        content: <TourStepContent type="calculate" isMobile={currentIsMobile} />,
        placement: "bottom",
        spotlightPadding: 10,
        disableBeacon: true,
      },
    ];
  },

  // Check if all required elements are present in the DOM
  checkElementsExist: () => {
    const elements = [
      document.querySelector("#logo"),
      document.querySelector(
        window.innerWidth < 768 ? "#mobile-search" : "#search-bar"
      ),
      document.querySelector("#filters"),
      document.querySelector("#calculate-btn"),
    ];

    const allExist = elements.every((el) => el !== null);
    console.log(
      "Tour elements check:",
      elements.map((el) => el !== null),
      "All exist:",
      allExist
    );
    return allExist;
  }
};

export default TourStepGenerator;
