import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { AUTH_API_BASE_URL } from "../api/auth.api";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function VerifyOtp() {
  // OTP state
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // ⏱️ 5 minutes = 300 seconds
  const [timeLeft, setTimeLeft] = useState(300);

  // input refs
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  /* ================= Countdown Timer ================= */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  /* ================= OTP Input Handling ================= */
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* ================= Verify OTP ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      toast.error("OTP expired. Please request a new one.");
      return;
    }

    const email = localStorage.getItem("resetEmail");
    const otpValue = otp.join("");

    if (!email) {
      toast.error("Email missing. Please restart password reset.");
      navigate("/forgot-password");
      return;
    }

    if (otpValue.length !== 4) {
      toast.error("Enter complete 4-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${AUTH_API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp: otpValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid OTP");
        return;
      }

      toast.success("OTP verified successfully");
      navigate("/reset-password");
    } catch {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Title */}
      <h2 className="auth-title mb-2">Verify OTP</h2>
      <p className="auth-subtitle mb-4">
        Enter the 4-digit code sent to your email
      </p>

      {/* ⏱️ Countdown */}
      <p className="text-center text-sm text-white/70 mb-6">
        OTP expires in{" "}
        <span
          className={
            timeLeft <= 30 ? "text-red-400 font-semibold" : "text-green-400"
          }
        >
          {formatTime(timeLeft)}
        </span>
      </p>

      {/* OTP Form */}
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input"
              required
            />
          ))}
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || timeLeft <= 0}
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : "Verify"}
        </button>
      </form>

      {/* Resend Section */}
      {timeLeft <= 0 && (
        <p className="text-center mt-4 text-sm text-white/70">
          OTP expired.{" "}
          <span
            className="auth-link cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Resend OTP
          </span>
        </p>
      )}
    </AuthLayout>
  );
}
