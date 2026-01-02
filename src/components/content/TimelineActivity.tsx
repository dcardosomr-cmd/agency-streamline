import { ActivityItem } from "@/types/content";
import { Clock, CheckCircle2, XCircle, FileText, Send, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TimelineActivityProps {
  timeline: ActivityItem[];
  className?: string;
}

const getActivityIcon = (action: string) => {
  if (action.toLowerCase().includes("approved")) return CheckCircle2;
  if (action.toLowerCase().includes("rejected")) return XCircle;
  if (action.toLowerCase().includes("created")) return FileText;
  if (action.toLowerCase().includes("submitted") || action.toLowerCase().includes("sent")) return Send;
  if (action.toLowerCase().includes("published") || action.toLowerCase().includes("synced")) return Eye;
  return Clock;
};

export function TimelineActivity({ timeline, className }: TimelineActivityProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="font-semibold text-foreground mb-4">Timeline & Activity</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {timeline.map((item, index) => {
            const Icon = getActivityIcon(item.action);
            const isLast = index === timeline.length - 1;
            
            return (
              <div key={item.id} className="relative flex items-start gap-4">
                {/* Timeline dot */}
                <div className={cn(
                  "relative z-10 w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center",
                  !isLast && "mb-4"
                )}>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{item.action}</span>
                    <span className="text-sm text-muted-foreground">by {item.user}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(item.timestamp), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                  {item.details && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {item.details}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

