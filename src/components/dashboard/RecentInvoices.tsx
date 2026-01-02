import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ArrowRight, DollarSign, CheckCircle2, Clock, AlertTriangle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  draft: { icon: FileText, color: "text-muted-foreground", bg: "bg-muted", label: "Draft" },
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending" },
  paid: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Paid" },
  overdue: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", label: "Overdue" },
};

export function RecentInvoices() {
  const navigate = useNavigate();
  const { data: invoices, isLoading, error } = useQuery({
    queryKey: ["recentInvoices"],
    queryFn: () => api.getRecentInvoices(5),
    staleTime: 60000,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Recent Invoices</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Latest billing activity</p>
        </div>
        <Link to="/billing">
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
            View all
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-border">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </>
        ) : error ? (
          <div className="p-8 text-center text-muted-foreground">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm">Failed to load invoices</p>
          </div>
        ) : invoices && invoices.length > 0 ? (
          invoices.map((invoice, index) => {
            const status = statusConfig[invoice.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                onClick={() => navigate("/billing")}
                className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{invoice.id}</p>
                    <p className="text-xs text-muted-foreground truncate">{invoice.client}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-sm">
                      ${invoice.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{invoice.dueDate}</p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                    status.bg,
                    status.color
                  )}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent invoices</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

