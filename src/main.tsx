import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { emitToast } from "./components/ui/toast";
import "./index.css";

// ── Global error handlers ────────────────────────────────────────────────────

window.addEventListener("error", (e) => {
  console.error("[unhandled error]", e.error ?? e.message);
  emitToast(e.error?.message ?? e.message ?? "An unexpected error occurred.");
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("[unhandled rejection]", e.reason);
  const message =
    e.reason instanceof Error ? e.reason.message : String(e.reason ?? "Unhandled promise rejection");
  emitToast(message);
});

// ── Render ───────────────────────────────────────────────────────────────────

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <BrowserRouter basename="/transcribe">
      <App />
    </BrowserRouter>
  </StrictMode>
);
