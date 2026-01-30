import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { AUTH_API_BASE_URL } from "../api/auth.api";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Email not found. Please restart password reset.");
      navigate("/forgot-password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${AUTH_API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, // 🔥 REQUIRED
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Password reset failed");
        return;
      }

      // cleanup
      localStorage.removeItem("resetEmail");

      toast.success("Password reset successful. Please login.");
      navigate("/");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Title */}
      <h2 className="auth-title mb-2">Reset Password</h2>
      <p className="auth-subtitle mb-6">
        Choose a strong password for your account
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input pr-10"
            autoComplete="new-password"
            required
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/70"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="input pr-10"
            autoComplete="new-password"
            required
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/70"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <ClipLoader size={20} color="#fff" /> : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}
