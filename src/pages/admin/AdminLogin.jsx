import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/7.jpg";

const AdminLogin = () => {
  const [email] = useState("drezzup@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Set the login timestamp in local storage
      localStorage.setItem("loginTimestamp", new Date().getTime());
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
      // Set user-friendly error messages
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="bg-white shadow-xl rounded-xl p-8 w-96 backdrop-blur-sm bg-opacity-95 border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="font-sans font-semibold text-[28px] mb-2">
            <span className="text-white bg-black px-1 py-0.5 rounded-sm">
              DREZZ
            </span>
            <span className="text-[#BD815A] font-bold">UP</span>
          </h1>
          <h2 className="text-xl font-medium text-gray-700">Admin Login</h2>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col">
          <div className="relative mb-5">
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full border border-gray-300 p-3 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BD815A] focus:border-transparent transition-all duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#BD815A] text-white font-medium p-3 rounded-lg transition-colors duration-200 shadow-md ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#a06b4a]"
            }`}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
