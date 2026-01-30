"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { auth } from "@/src/firebase";
import { AUTH_API_BASE_URL } from "@/src/lib/authApi";

import "./Signup.css";

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
        body: JSON.stringify({ ...form, role: "user" }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user?.fullName || "User");

      toast.success("Account created successfully");
      router.push("/");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= Google Signup ================= */
  const handleGoogleSignup = async () => {
    if (!form.mobile) {
      toast.error("Mobile number is required");
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
          role: "user",
          mobile: form.mobile,
        },
        { withCredentials: true },
      );

      toast.success("Signed up with Google");
      router.push("/");
    } catch {
      toast.error("Google signup failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <input
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
          required
        />

        <div className="password-field">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignup}
          disabled={googleLoading}
        >
          {googleLoading ? "Please wait..." : "Sign up with Google"}
        </button>

        <p className="switch-text">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
