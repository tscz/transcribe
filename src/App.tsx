import { Navigate, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/AppShell";
import { useGDriveCallback } from "@/features/gdrive/useGDriveCallback";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DrumPage } from "@/pages/DrumPage";
import { GuitarPage } from "@/pages/GuitarPage";
import { HarmonyPage } from "@/pages/HarmonyPage";
import { LandingPage } from "@/pages/LandingPage";
import { PrintPage } from "@/pages/PrintPage";
import { StructurePage } from "@/pages/StructurePage";
import { useStore } from "@/store";

function RequireProject({ children }: { children: React.ReactNode }) {
  const status = useStore((s) => s.status);
  if (status === "idle") return <Navigate to="/" replace />;
  return <>{children}</>;
}

export function App() {
  useGDriveCallback();

  return (
    <TooltipProvider delayDuration={400}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/structure"
            element={
              <RequireProject>
                <StructurePage />
              </RequireProject>
            }
          />
          <Route
            path="/harmony"
            element={
              <RequireProject>
                <HarmonyPage />
              </RequireProject>
            }
          />
          <Route
            path="/guitar"
            element={
              <RequireProject>
                <GuitarPage />
              </RequireProject>
            }
          />
          <Route
            path="/drum"
            element={
              <RequireProject>
                <DrumPage />
              </RequireProject>
            }
          />
          <Route
            path="/print"
            element={
              <RequireProject>
                <PrintPage />
              </RequireProject>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}
