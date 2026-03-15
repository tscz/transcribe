import { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface StubPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  plannedFeatures: string[];
}

export function StubPage({ icon: Icon, title, description, plannedFeatures }: StubPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="max-w-sm space-y-5">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-secondary border border-border">
            <Icon className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl font-semibold">{title}</h1>
            <Badge variant="secondary" className="text-xs">Coming soon</Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>

        {plannedFeatures.length > 0 && (
          <div className="text-left space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Planned features
            </p>
            <ul className="space-y-1.5">
              {plannedFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
