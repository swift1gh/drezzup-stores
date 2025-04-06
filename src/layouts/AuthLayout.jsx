import React from "react";
import { Outlet } from "react-router-dom";
import bgImage from "../assets/7.jpg";

const AuthLayout = () => {
  return (
    <div
      className="h-full"
      style={{
        height: "100vh", // Ensure the div takes the full viewport height
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
