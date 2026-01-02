import { motion } from "framer-motion";
import { ArrowRight, Clock, CheckCircle2, AlertCircle, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: 1,
    name: "Q1 Brand Campaign",
    client: "TechCorp Industries",
    status: "in-progress",
    progress: 65,
    dueDate: "Jan 15, 2026",
    priority: "high",
  },
  {
    id: 2,
    name: "Social Media Strategy",
    client: "Green Solutions Ltd",
    status: "in-progress",
    progress: 40,
    dueDate: "Jan 22, 2026",
    priority: "medium",
  },
  {
    id: 3,
    name: "Website Redesign",
    client: "Nova Ventures",
    status: "review",
    progress: 90,
    dueDate: "Jan 8, 2026",
    priority: "urgent",
  },
  {
    id: 4,
    name: "Email Marketing Series",
    client: "Atlas Media Group",
    status: "completed",
    progress: 100,
    dueDate: "Dec 28, 2025",
    priority: "low",
  },
];

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
        {projects.map((project, index) => {
          const StatusIcon = statusConfig[project.status as keyof typeof statusConfig].icon;
          const statusColor = statusConfig[project.status as keyof typeof statusConfig].color;
          const statusBg = statusConfig[project.status as keyof typeof statusConfig].bg;

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
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
        })}
      </div>
    </motion.div>
  );
}
