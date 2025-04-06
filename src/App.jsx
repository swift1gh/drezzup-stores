import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import React from "react";
import HomePage from "./pages/HomePage.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import ComboPage from "./pages/ComboPage.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import { AuthProvider } from "./hooks/useAuth.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import ProductUpload from "./pages/ProductUpload.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx"; // Import AuthLayout
import NotFound from "./pages/NotFound.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="combo" element={<ComboPage />} />
      </Route>

      <Route path="login" element={<AdminLogin />} />

      {/* Protecting Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AuthLayout />}>
          {" "}
          {/* Wrap with AuthLayout */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="product-upload" element={<ProductUpload />} />
        </Route>
      </Route>

      {/* Catch all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </>
  )
);

function App() {
  return (
    <div className="app-container">
      <header>{/* Your header content */}</header>

      <main>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </main>

      <footer>{/* Your footer content */}</footer>
    </div>
  );
}

export default App;
