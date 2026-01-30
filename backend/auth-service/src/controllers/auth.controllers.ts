import bcrypt, { hash } from "bcryptjs";
import genToken from "../utils/token.js";
import { sendOtpNotification } from "../services/notification.service.js";
import type { Request, Response } from "express";
import {
  getUserByEmail,
  createUser,
  updateUserOtp,
  resetUserPassword,
} from "../services/user.service.js";

{
  /*==========================SignUp Controller Logic==============================*/
}
export const signUp = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    let user = await getUserByEmail(email).catch(() => null);
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await createUser({
      fullName,
      email,
      role,
      mobile,
      password: hashedPassword,
    });

    const token = await genToken(user._id.toString());

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.status(201).json({ user, token });
  } catch (error) {
    return res.status(500).json({ message: "signup error" });
  }
};

{
  /*==========================SignIn Controller Logic==============================*/
}
export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email).catch(() => null);

    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await genToken(user._id.toString());

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.status(200).json({ user, token });
  } catch {
    return res.status(500).json({ message: "signin error" });
  }
};

{
  /*==========================SignOut Controller Logic==============================*/
}
export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "log out successfully" });
  } catch {
    return res.status(500).json({ message: "signout error" });
  }
};

{
  /*==========================Send OTP Controller Logic==============================*/
}
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await getUserByEmail(email).catch(() => null);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    await updateUserOtp({
      email,
      resetOtp: otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isOtpVerified: false,
    });

    await sendOtpNotification(email, otp);

    return res.status(200).json({ message: "otp sent successfully" });
  } catch {
    return res.status(500).json({ message: "send otp error" });
  }
};

{
  /*==========================Verify OTP Controller Logic==============================*/
}
export const verifyOtp = async (req: Request, res: Response) => {
  const email = req.body.email?.trim().toLowerCase();
  const otp = String(req.body.otp || "").trim();

  console.log("VERIFY DEBUG =>", {
    receivedOtp: req.body.otp,
    normalizedOtp: otp,
    type: typeof req.body.otp,
  });
  const user = await getUserByEmail(email).catch(() => null);
  console.log("USER FETCH RESULT =>", user);
  console.log("VERIFY EMAIL =>", email);

  if (
    !user ||
    !user.resetOtp ||
    String(user.resetOtp) !== String(otp) ||
    !user.otpExpires ||
    user.otpExpires < Date.now()
  ) {
    return res.status(400).json({ message: "invalid or expired otp" });
  }

  await updateUserOtp({
    email,
    resetOtp: null,
    otpExpires: null,
    isOtpVerified: true,
  });

  return res.status(200).json({ message: "otp verify successfully" });
};

{
  /*==========================Reset Password Controller Logic==============================*/
}
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters." });
    }

    const user = await getUserByEmail(email).catch(() => null);
    if (!user || !user.isOtpVerified) {
      return res.status(400).json({ message: "otp not verified" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 1️⃣ Update password
    await resetUserPassword({
      email,
      password: hashedPassword,
    });

    // 2️⃣ IMPORTANT: Clear OTP state after reset
    await updateUserOtp({
      email,
      resetOtp: null,
      otpExpires: null,
      isOtpVerified: false,
    });

    return res.status(200).json({ message: "password reset successfully" });
  } catch {
    return res.status(500).json({ message: "reset password error" });
  }
};

{
  /*==========================Google Auth Controller Logic==============================*/
}
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { fullName, email, mobile, role } = req.body;

    let user = await getUserByEmail(email).catch(() => null);
    if (!user) {
      user = await createUser({ fullName, email, mobile, role });
    }

    const token = await genToken(user._id.toString());

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "none",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    return res.status(200).json({ user, token });
  } catch {
    return res.status(500).json({ message: "google auth error" });
  }
};
