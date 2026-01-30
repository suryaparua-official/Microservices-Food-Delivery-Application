"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AUTH_API_BASE_URL } from "@/src/lib/authApi";
import "./VerifyOtp.css";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  /* ⏱️ Countdown */
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleChange = (val: string, i: number) => {
    if (!/^\d?$/.test(val)) return;
    const copy = [...otp];
    copy[i] = val;
    setOtp(copy);
    if (val && i < 3) inputsRef.current[i + 1]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      toast.error("OTP expired");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Restart password reset");
      router.push("/forgot-password");
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      toast.error("Enter 4 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${AUTH_API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Invalid OTP");
        return;
      }

      toast.success("OTP verified");
      router.push("/reset-password");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Verify OTP</h2>
      <p>OTP expires in {formatTime(timeLeft)}</p>

      <form onSubmit={handleSubmit}>
        <div className="otp-box">
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(e.target.value, i)}
            />
          ))}
        </div>

        <button className="primary-btn" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
