import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ArrowRight, Calendar, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function UpcomingDeadlines() {
  const navigate = useNavigate();
  const { data: deadlines, isLoading, error } = useQuery({
    queryKey: ["upcomingDeadlines"],
    queryFn: () => api.getUpcomingDeadlines(7),
    staleTime: 30000,
  });

  const overdueCount = deadlines?.filter(d => d.isOverdue).length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Next 7 days {overdueCount > 0 && (
              <span className="text-destructive font-medium">• {overdueCount} overdue</span>
            )}
          </p>
        </div>
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
            View all
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm">Failed to load deadlines</p>
          </div>
        ) : deadlines && deadlines.length > 0 ? (
          deadlines.map((deadline, index) => {
            const urgencyColor = deadline.isOverdue
              ? "border-l-destructive bg-destructive/5"
              : deadline.daysUntilDue === 0
              ? "border-l-warning bg-warning/5"
              : deadline.daysUntilDue <= 2
              ? "border-l-warning bg-warning/5"
              : "border-l-primary bg-primary/5";

            return (
              <motion.div
                key={deadline.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + index * 0.05 }}
                onClick={() => deadline.url && navigate(deadline.url)}
                className={cn(
                  "p-3 rounded-lg border-l-2 cursor-pointer hover:bg-secondary/30 transition-colors",
                  urgencyColor
                )}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.client}</p>
                  </div>
                  {deadline.isOverdue && (
                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 ml-2" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {deadline.isOverdue
                      ? `${deadline.daysUntilDue} days overdue`
                      : deadline.daysUntilDue === 0
                      ? "Due today"
                      : `${deadline.daysUntilDue} day${deadline.daysUntilDue !== 1 ? "s" : ""} left`}
                  </span>
                  <span className="text-xs text-muted-foreground">• {deadline.dueDate}</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No upcoming deadlines</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

