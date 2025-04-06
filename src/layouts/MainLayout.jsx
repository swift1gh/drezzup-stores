import React from "react";
import { Outlet } from "react-router-dom";
import bgImage from "../assets/7.jpg";

const MainLayout = () => {
  return (
    <div
      className="h-full"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}>
      <Outlet />
      {/* The Outlet is a natural component shows what is inside the MainLayout Router in the App.jsx */}
    </div>
  );
};

export default MainLayout;
