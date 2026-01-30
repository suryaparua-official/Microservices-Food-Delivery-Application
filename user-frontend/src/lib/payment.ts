import { api, PAYMENT_URL } from "@/src/lib/api";

export const createPayment = async (orderId: string, amount: number) => {
  const res = await api.post(`${PAYMENT_URL}/create`, {
    orderId,
    amount,
  });

  return res.data;
};

export const verifyPayment = async (payload: {
  orderId: string;
  paymentId: string;
  signature?: string;
}) => {
  const res = await api.post(`${PAYMENT_URL}/verify`, payload);
  return res.data;
};
