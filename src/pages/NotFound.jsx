import { useNavigate } from "react-router-dom";
import bgImage from "../assets/7.jpg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        height: "100vh",
        backgroundImage: `url(${bgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}>
      <div className="bg-white shadow-xl rounded-xl p-8 w-[90%] max-w-md backdrop-blur-sm bg-opacity-95 border border-gray-100 text-center">
        <div className="mb-6">
          <h1 className="font-sans font-semibold text-[28px] mb-2">
            <span className="text-white bg-black px-1 py-0.5 rounded-sm">
              DREZZ
            </span>
            <span className="text-[#BD815A] font-bold">UP</span>
          </h1>
          <h2 className="text-6xl font-bold text-[#BD815A] mb-4">404</h2>
          <h3 className="text-2xl font-medium text-gray-700 mb-4">
            Page Not Found
          </h3>
          <p className="text-gray-600 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="bg-[#BD815A] text-white font-medium px-8 py-3 rounded-lg hover:bg-[#a06b4a] transition-colors duration-200 shadow-md">
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
