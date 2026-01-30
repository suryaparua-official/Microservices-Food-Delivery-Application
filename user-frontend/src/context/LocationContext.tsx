"use client";

import { createContext, useContext, useState } from "react";

type LocationType = {
  city: string;
  lat: number;
  lng: number;
};

const LocationContext = createContext<{
  location: LocationType | null;
  setLocation: (loc: LocationType | null) => void;
}>({
  location: null,
  setLocation: () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<LocationType | null>(null);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => useContext(LocationContext);
