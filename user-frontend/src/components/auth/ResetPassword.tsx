"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { AUTH_API_BASE_URL } from "@/src/lib/authApi";
import "./ResetPassword.css";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password too short");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Restart reset process");
      router.push("/forgot-password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${AUTH_API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Reset failed");
        return;
      }

      localStorage.removeItem("resetEmail");
      toast.success("Password reset successful");
      router.push("/login");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="password-field">
          <input
            type={show1 ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span onClick={() => setShow1(!show1)}>
            {show1 ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        <div className="password-field">
          <input
            type={show2 ? "text" : "password"}
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <span onClick={() => setShow2(!show2)}>
            {show2 ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        <button className="primary-btn" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
