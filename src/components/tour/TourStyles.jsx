// Tour styling configuration
const TourStyles = {
  options: {
    arrowColor: "#d29c7b",
    backgroundColor: "#222",
    primaryColor: "#d29c7b",
    textColor: "#fff",
    zIndex: 10000,
    overlayColor: "rgba(0, 0, 0, 0.7)",
  },
  tooltip: {
    borderRadius: "8px",
    padding: "15px",
    fontSize: "16px",
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
  },
  buttonNext: {
    backgroundColor: "#d29c7b",
    borderRadius: "6px",
    padding: "8px 15px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#e3ad8c",
    },
  },
  buttonBack: {
    color: "#d29c7b",
    fontSize: "14px",
    fontWeight: "500",
    marginRight: "10px",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#e3ad8c",
    },
  },
  buttonSkip: {
    color: "#999",
    fontSize: "14px",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#ccc",
    },
  },
  buttonClose: {
    color: "#999",
    transition: "all 0.2s ease",
    "&:hover": {
      color: "#ccc",
    },
  },
  spotlight: {
    borderRadius: "8px",
    boxShadow:
      "0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 15px rgba(210, 156, 123, 0.5)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
};

export default TourStyles;
