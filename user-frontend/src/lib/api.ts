import axios from "axios";

/* ================= AXIOS INSTANCE ================= */
export const api = axios.create({
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      // token invalid / expired
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

/* ================= SERVICE URLS ================= */
export const AUTH_URL = "http://localhost:5000/api/auth";
export const USER_URL = "http://localhost:5001/api/user";
export const RESTAURANT_URL = "http://localhost:5004/api/restaurant";
export const ITEM_URL = "http://localhost:5004/api/item";
export const ORDER_URL = "http://localhost:5002/api/order";
export const PAYMENT_URL = "http://localhost:5003/api/payment";
