import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Mail, Share2, FileText, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const typeConfig = {
  email: { icon: Mail, color: "text-primary" },
  social: { icon: Share2, color: "text-success" },
  blog: { icon: FileText, color: "text-warning" },
};

const statusConfig = {
  approved: { icon: CheckCircle, color: "text-success" },
  pending: { icon: Clock, color: "text-warning" },
  rejected: { icon: XCircle, color: "text-destructive" },
};

export function CampaignActivity() {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ["campaignActivities"],
    queryFn: () => api.getCampaignActivities(5),
    staleTime: 30000,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl overflow-hidden h-full"
    >
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Campaign Activity</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Recent content updates</p>
      </div>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm">Failed to load activities</p>
          </div>
        ) : activities && activities.length > 0 ? (
          activities.map((activity, index) => {
          const TypeIcon = typeConfig[activity.type as keyof typeof typeConfig].icon;
          const typeColor = typeConfig[activity.type as keyof typeof typeConfig].color;
          const StatusIcon = statusConfig[activity.status as keyof typeof statusConfig].icon;
          const statusColor = statusConfig[activity.status as keyof typeof statusConfig].color;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className={cn("p-2 rounded-lg bg-secondary/50", typeColor)}>
                <TypeIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.client}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusIcon className={cn("w-4 h-4", statusColor)} />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            </motion.div>
          );
        })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Share2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
