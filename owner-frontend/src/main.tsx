import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { OwnerProvider } from "./context/OwnerContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OwnerProvider>
      <App />
    </OwnerProvider>
  </StrictMode>,
);
