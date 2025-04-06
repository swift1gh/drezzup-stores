import React, { useState, useEffect, useRef } from "react";
import Joyride, { STATUS, EVENTS } from "react-joyride";

// Import tour components
import TourButton from "./tour/TourButton";
import TourStepGenerator from "./tour/TourStepGenerator";
import TourStyles from "./tour/TourStyles";

const UserTour = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const joyrideRef = useRef(null);
  const [elementsReady, setElementsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Check if elements are ready for the tour
  useEffect(() => {
    let checkInterval;

    if (run && !elementsReady) {
      checkInterval = setInterval(() => {
        if (TourStepGenerator.checkElementsExist()) {
          console.log("All tour elements are ready");
          setElementsReady(true);
          clearInterval(checkInterval);

          // Regenerate steps now that elements are ready
          const newSteps = TourStepGenerator.generateSteps(isMobile);
          setSteps(newSteps);
        } else {
          console.log("Waiting for tour elements to be ready...");
        }
      }, 500);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [run, elementsReady, isMobile]);

  // Initialize tour on component mount and handle window resize
  useEffect(() => {
    console.log("UserTour component mounted");

    // Handle window resize
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      if (run) {
        // Regenerate steps and restart tour on significant resize
        console.log("Window resized, regenerating steps");
        const newSteps = TourStepGenerator.generateSteps(newIsMobile);
        setSteps(newSteps);
      }
    };

    // Add resize listener with debounce
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 300);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [run]);

  // Start the tour
  const startTour = () => {
    console.log("Starting tour");
    setStepIndex(0);
    setElementsReady(false);

    // Initial steps generation
    const newSteps = TourStepGenerator.generateSteps(isMobile);
    setSteps(newSteps);
    setRun(true);
  };

  // Handle tour callback events
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    console.log("Tour callback:", { action, index, status, type });

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      console.log("Tour finished or skipped");
      setRun(false);
    } else if (type === EVENTS.STEP_AFTER && action === "next") {
      // Update step index for controlled tour
      setStepIndex(index + 1);
    } else if (type === EVENTS.STEP_AFTER && action === "prev") {
      // Update step index for controlled tour
      setStepIndex(index - 1);
    } else if (type === EVENTS.TARGET_NOT_FOUND) {
      console.error(`Target not found for step ${index + 1}`);

      // Skip the problematic step
      if (index < steps.length - 1) {
        setStepIndex(index + 1);
      } else {
        setRun(false);
      }
    }
  };

  return (
    <>
      {!run && <TourButton startTour={startTour} isMobile={isMobile} />}

      {run && steps.length > 0 && (
        <Joyride
          ref={joyrideRef}
          steps={steps}
          run={run && elementsReady}
          stepIndex={stepIndex}
          continuous
          showSkipButton
          showCloseButton
          disableOverlayClose
          disableScrolling={false}
          scrollToFirstStep={true}
          scrollToSteps={true}
          spotlightClicks={false}
          callback={handleJoyrideCallback}
          styles={TourStyles}
          floaterProps={{
            disableAnimation: true,
          }}
          spotlightPadding={10}
          hideBackButton={false}
          locale={{
            last: "Finish",
          }}
        />
      )}
    </>
  );
};

export default UserTour;
