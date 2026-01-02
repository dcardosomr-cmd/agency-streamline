import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  delay?: number;
  onClick?: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  delay = 0,
  onClick,
  isLoading = false,
  error = null,
}: StatCardProps) {
  const handleClick = () => {
    if (onClick && !isLoading && !error) {
      onClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "stat-card",
        onClick && !isLoading && !error && "cursor-pointer hover:border-primary/30 transition-all"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {!isLoading && !error && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground"
          )}>
            {changeType === "positive" && <TrendingUp className="w-3.5 h-3.5" />}
            {changeType === "negative" && <TrendingDown className="w-3.5 h-3.5" />}
            {change}
          </div>
        )}
      </div>
      
      {isLoading ? (
        <>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </>
      ) : error ? (
        <>
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Error loading data</span>
          </div>
          <p className="text-sm text-muted-foreground">{title}</p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </>
      )}
    </motion.div>
  );
}
