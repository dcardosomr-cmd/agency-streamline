import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatusTab {
  id: string;
  label: string;
  count?: number;
}

interface StatusTabsProps {
  tabs: StatusTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function StatusTabs({ tabs, activeTab, onTabChange, className }: StatusTabsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "ml-2 px-1.5 py-0.5 rounded-full text-xs",
              activeTab === tab.id
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

