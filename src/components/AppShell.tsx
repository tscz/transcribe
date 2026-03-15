import { Outlet } from "react-router-dom";

import { MobileNav } from "./MobileNav";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { DialogManager } from "@/features/project/DialogManager";

export function AppShell() {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
      <MobileNav />
      <DialogManager />
    </div>
  );
}
