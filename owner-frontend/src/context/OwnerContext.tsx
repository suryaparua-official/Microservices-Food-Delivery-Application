import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

interface OwnerContextType {
  shop: any;
  setShop: (shop: any) => void;
  loading: boolean;
  refetchShop: () => Promise<void>;
}

const OwnerContext = createContext<OwnerContextType | null>(null);

export const OwnerProvider = ({ children }: { children: React.ReactNode }) => {
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMyShop = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/restaurant/get-my");
      setShop(res.data); // null or shop both OK
    } catch (error: any) {
      // backend returns 200 null when no shop
      setShop(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyShop();
  }, []);

  return (
    <OwnerContext.Provider
      value={{
        shop,
        setShop,
        loading,
        refetchShop: fetchMyShop,
      }}
    >
      {children}
    </OwnerContext.Provider>
  );
};

export const useOwner = () => {
  const ctx = useContext(OwnerContext);
  if (!ctx) {
    throw new Error("useOwner must be used inside OwnerProvider");
  }
  return ctx;
};
