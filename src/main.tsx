import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Normalise /sell-site → /sell-site/ so query-param links always keep the slash
if (window.location.pathname === "/sell-site") {
  window.history.replaceState(
    null,
    "",
    "/sell-site/" + window.location.search + window.location.hash,
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/sell-site">
      <App />
    </BrowserRouter>
  </StrictMode>
);
