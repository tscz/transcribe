import {
  AudioLines,
  Drum,
  Guitar,
  Music2,
  Music4,
  Printer,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { useStore } from "@/store";

const navItems = [
  { to: "/structure", label: "Structure", icon: Music4 },
  { to: "/harmony", label: "Harmony", icon: Music2 },
  { to: "/guitar", label: "Guitar", icon: Guitar },
  { to: "/drum", label: "Drums", icon: Drum },
  { to: "/print", label: "Print", icon: Printer },
];

export function Sidebar() {
  const isReady = useStore((s) => s.status === "ready");

  return (
    <aside className="hidden md:flex flex-col w-52 shrink-0 border-r border-border bg-card h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border">
        <AudioLines className="text-primary h-5 w-5" />
        <span className="font-semibold text-base tracking-tight">Transcribe</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                !isReady && "pointer-events-none opacity-40"
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Version */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs text-muted-foreground">v0.2.0</p>
      </div>
    </aside>
  );
}
