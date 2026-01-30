import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOtp from "./pages/VerifyOtp";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import OwnerOrders from "./pages/OwnerOrders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CreateShop from "./pages/CreateShop";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center" />
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Owner */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-restaurant" element={<CreateShop mode="edit" />} />
        <Route path="/orders" element={<OwnerOrders />} />
      </Routes>
    </BrowserRouter>
  );
}
