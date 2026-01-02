import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ArrowRight, Clock, CheckCircle2, AlertCircle, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  "in-progress": { icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  "review": { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10" },
  "completed": { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  "paused": { icon: PauseCircle, color: "text-muted-foreground", bg: "bg-muted" },
};

const priorityColors = {
  urgent: "border-l-destructive",
  high: "border-l-warning",
  medium: "border-l-primary",
  low: "border-l-muted-foreground",
};

export function ProjectsOverview() {
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["activeProjects"],
    queryFn: () => api.getActiveProjects(4),
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
          <h3 className="font-semibold text-foreground">Active Projects</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Track your ongoing work</p>
        </div>
        <Link to="/projects">
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
            View all
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="p-4 space-y-3">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </>
        ) : error ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-sm">Failed to load projects</p>
          </div>
        ) : projects && projects.length > 0 ? (
          projects.map((project, index) => {
          const StatusIcon = statusConfig[project.status as keyof typeof statusConfig].icon;
          const statusColor = statusConfig[project.status as keyof typeof statusConfig].color;
          const statusBg = statusConfig[project.status as keyof typeof statusConfig].bg;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              onClick={() => navigate("/projects")}
              className={cn(
                "p-4 rounded-lg bg-secondary/30 border-l-2 hover:bg-secondary/50 transition-colors cursor-pointer",
                priorityColors[project.priority as keyof typeof priorityColors]
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-foreground">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", statusBg, statusColor)}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {project.status}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.05 }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground">{project.progress}%</span>
                  <span className="text-muted-foreground">Due: {project.dueDate}</span>
                </div>
              </div>
            </motion.div>
          );
        })
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active projects</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
