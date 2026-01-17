import axios from "axios";

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:5001/api/user";

/* ================= Get User By Email ================= */
export const getUserByEmail = async (email: string) => {
  const res = await axios.get(`${USER_SERVICE_URL}/by-email/${email}`);
  return res.data;
};

/* ================= Create User ================= */
export const createUser = async (data: {
  fullName: string;
  email: string;
  password?: string;
  mobile: string;
  role: string;
}) => {
  const res = await axios.post(`${USER_SERVICE_URL}`, data);
  return res.data;
};

/* ================= Update OTP ================= */
export const updateUserOtp = async (data: {
  email: string;
  resetOtp: string | null;
  otpExpires: Number | null;
  isOtpVerified: boolean;
}) => {
  const res = await axios.patch(`${USER_SERVICE_URL}/otp`, data);
  return res.data;
};

/* ================= Reset Password ================= */
export const resetUserPassword = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.patch(`${USER_SERVICE_URL}/reset-password`, data);
  return res.data;
};
