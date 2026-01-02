import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ArrowRight, Building2, MoreHorizontal, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentClients() {
  const navigate = useNavigate();
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["recentClients"],
    queryFn: () => api.getRecentClients(4),
    staleTime: 60000,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Recent Clients</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Your latest client activity</p>
        </div>
        <Link to="/clients">
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
            View all
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-border">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : error ? (
          <div className="p-8 text-center text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm">Failed to load clients</p>
          </div>
        ) : clients && clients.length > 0 ? (
          clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{client.name}</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-medium text-foreground">{client.revenue}</p>
                  <p className="text-xs text-muted-foreground">{client.projects} projects</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  client.status === "active" 
                    ? "bg-success/10 text-success" 
                    : "bg-warning/10 text-warning"
                }`}>
                  {client.status}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      type="button"
                      className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onSelect={() => navigate("/clients")}
                      className="flex items-center cursor-pointer"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <Building2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No clients found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
