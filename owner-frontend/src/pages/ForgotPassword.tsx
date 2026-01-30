import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { AUTH_API_BASE_URL } from "../api/auth.api";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${AUTH_API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to send OTP");
        return;
      }

      // 🔥 Store email for next steps
      localStorage.setItem("resetEmail", normalizedEmail);

      toast.success("OTP sent to your email");
      navigate("/verify-otp");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Title */}
      <h2 className="auth-title mb-2">Forgot Password</h2>
      <p className="auth-subtitle mb-6">
        Enter your email to receive a verification code
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <ClipLoader size={20} color="#fff" /> : "Send OTP"}
        </button>
      </form>
    </AuthLayout>
  );
}
