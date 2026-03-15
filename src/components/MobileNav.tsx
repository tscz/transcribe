import { Drum, Guitar, Music2, Music4, Printer } from "lucide-react";
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

export function MobileNav() {
  const isReady = useStore((s) => s.status === "ready");

  return (
    <nav className="md:hidden flex items-center justify-around border-t border-border bg-card h-14 shrink-0">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
              !isReady && "pointer-events-none opacity-40"
            )
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
