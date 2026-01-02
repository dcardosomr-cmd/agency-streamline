import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Users, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export function TeamWorkload() {
  const navigate = useNavigate();
  const { data: teamMembers, isLoading, error } = useQuery({
    queryKey: ["teamWorkload"],
    queryFn: () => api.getTeamWorkload(),
    staleTime: 60000,
  });

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-destructive";
    if (utilization >= 70) return "text-warning";
    return "text-success";
  };

  const getUtilizationBg = (utilization: number) => {
    if (utilization >= 90) return "bg-destructive";
    if (utilization >= 70) return "bg-warning";
    return "bg-success";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Team Workload</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Current capacity utilization</p>
        </div>
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
            View all
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm">Failed to load team workload</p>
          </div>
        ) : teamMembers && teamMembers.length > 0 ? (
          teamMembers.map((member, index) => {
            const utilizationColor = getUtilizationColor(member.utilization);
            const utilizationBg = getUtilizationBg(member.utilization);

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + index * 0.05 }}
                onClick={() => navigate("/projects")}
                className="cursor-pointer hover:bg-secondary/30 p-3 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">{member.initials}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.projectCount} / {member.capacity} projects
                      </p>
                    </div>
                  </div>
                  <span className={cn("text-sm font-semibold", utilizationColor)}>
                    {Math.round(member.utilization)}%
                  </span>
                </div>
                <Progress 
                  value={member.utilization} 
                  className="h-2"
                />
                {member.utilization >= 90 && (
                  <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Over capacity
                  </p>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No team data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

