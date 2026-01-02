import { motion } from "framer-motion";
import { Mail, Share2, FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "email",
    title: "Newsletter Campaign Approved",
    client: "TechCorp Industries",
    time: "2 hours ago",
    status: "approved",
  },
  {
    id: 2,
    type: "social",
    title: "Instagram Post Scheduled",
    client: "Green Solutions Ltd",
    time: "4 hours ago",
    status: "pending",
  },
  {
    id: 3,
    type: "blog",
    title: "Blog Article Rejected",
    client: "Nova Ventures",
    time: "5 hours ago",
    status: "rejected",
  },
  {
    id: 4,
    type: "social",
    title: "LinkedIn Campaign Live",
    client: "Atlas Media Group",
    time: "1 day ago",
    status: "approved",
  },
  {
    id: 5,
    type: "email",
    title: "Promo Email Sent",
    client: "TechCorp Industries",
    time: "1 day ago",
    status: "approved",
  },
];

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
        {activities.map((activity, index) => {
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
        })}
      </div>
    </motion.div>
  );
}
