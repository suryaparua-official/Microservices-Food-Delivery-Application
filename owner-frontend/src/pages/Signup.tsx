import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { AUTH_API_BASE_URL } from "../api/auth.api";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { toast } from "react-toastify";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

// 🔽 firebase imports (assumed already configured)
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* ================= Input Change ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= Normal Signup ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${AUTH_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, role: "owner" }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);

      toast.success("Account created successfully!");
      navigate("/");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Google Signup ================= */
  const handleGoogleAuth = async () => {
    if (!form.mobile) {
      toast.error("Mobile number is required for Google signup");
      return;
    }

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
          mobile: form.mobile,
        },
        { withCredentials: true },
      );

      toast.success("Signed up with Google successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error("Google signup failed");
      console.log(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Title */}
      <h2 className="auth-title mb-2">Create an account</h2>
      <p className="auth-subtitle mb-6">Sign up to get started</p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="input"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="input"
          required
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          className="input"
          required
        />

        {/* Password with Eye */}
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            className="input pr-10"
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
          {loading ? <ClipLoader size={20} color="#fff" /> : "Sign Up"}
        </button>
      </form>

      {/* Divider */}
      <div className="auth-divider">OR</div>

      {/* Google */}
      <button
        className="btn-google"
        onClick={handleGoogleAuth}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <ClipLoader size={20} color="#000" />
        ) : (
          "Continue with Google"
        )}
      </button>

      {/* Footer */}
      <p className="text-center mt-4 text-sm text-white/70">
        Already have an account?
        <Link to="/" className="auth-link ml-1">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
