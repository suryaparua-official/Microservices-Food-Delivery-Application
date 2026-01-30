import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { AUTH_API_BASE_URL } from "../api/auth.api";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

// firebase
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  /* ================= Normal Login ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${AUTH_API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        return;
      }

      localStorage.setItem("token", data.token);

      toast.success("Login successful");
      navigate("/dashboard");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Google Login ================= */
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await axios.post(
        `${AUTH_API_BASE_URL}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role: "owner",
          mobile: "N/A", // login-time Google auth doesn't need mobile
        },
        { withCredentials: true },
      );

      toast.success("Logged in with Google");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Title */}
      <h2 className="auth-title mb-2">Welcome Back</h2>
      <p className="auth-subtitle mb-6">Sign in to continue</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />

        {/* Password with Eye */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input pr-10"
            autoComplete="current-password"
            required
          />
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/70"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <ClipLoader size={20} color="#fff" /> : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="auth-divider">OR</div>

      {/* Google */}
      <button
        className="btn-google"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <ClipLoader size={20} color="#000" />
        ) : (
          "Continue with Google"
        )}
      </button>

      {/* Links */}
      <div className="text-center mt-4">
        <Link to="/forgot-password" className="auth-link">
          Forgot password?
        </Link>
      </div>

      <p className="text-center mt-3 text-sm text-white/70">
        Don&apos;t have an account?
        <Link to="/signup" className="auth-link ml-1">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
