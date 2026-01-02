import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PauseCircle,
  Calendar,
  Users,
  MoreHorizontal
} from "lucide-react";
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
    team: ["JD", "AS", "MK"],
    tasks: { completed: 12, total: 18 },
  },
  {
    id: 2,
    name: "Social Media Strategy",
    client: "Green Solutions Ltd",
    status: "in-progress",
    progress: 40,
    dueDate: "Jan 22, 2026",
    priority: "medium",
    team: ["AS", "RB"],
    tasks: { completed: 6, total: 15 },
  },
  {
    id: 3,
    name: "Website Redesign",
    client: "Nova Ventures",
    status: "review",
    progress: 90,
    dueDate: "Jan 8, 2026",
    priority: "urgent",
    team: ["JD", "MK", "LT", "AS"],
    tasks: { completed: 27, total: 30 },
  },
  {
    id: 4,
    name: "Email Marketing Series",
    client: "Atlas Media Group",
    status: "completed",
    progress: 100,
    dueDate: "Dec 28, 2025",
    priority: "low",
    team: ["RB"],
    tasks: { completed: 8, total: 8 },
  },
  {
    id: 5,
    name: "Product Launch Campaign",
    client: "TechCorp Industries",
    status: "planning",
    progress: 15,
    dueDate: "Feb 10, 2026",
    priority: "high",
    team: ["JD", "AS"],
    tasks: { completed: 3, total: 20 },
  },
  {
    id: 6,
    name: "Annual Report Design",
    client: "Urban Development Co",
    status: "in-progress",
    progress: 55,
    dueDate: "Jan 30, 2026",
    priority: "medium",
    team: ["MK", "LT"],
    tasks: { completed: 11, total: 20 },
  },
];

const statusConfig = {
  "planning": { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Planning" },
  "in-progress": { icon: Clock, color: "text-primary", bg: "bg-primary/10", label: "In Progress" },
  "review": { icon: AlertCircle, color: "text-warning", bg: "bg-warning/10", label: "In Review" },
  "completed": { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Completed" },
  "paused": { icon: PauseCircle, color: "text-muted-foreground", bg: "bg-muted", label: "Paused" },
};

const priorityStyles = {
  urgent: { border: "border-l-destructive", badge: "bg-destructive/10 text-destructive" },
  high: { border: "border-l-warning", badge: "bg-warning/10 text-warning" },
  medium: { border: "border-l-primary", badge: "bg-primary/10 text-primary" },
  low: { border: "border-l-muted-foreground", badge: "bg-muted text-muted-foreground" },
};

const Projects = () => {
  const [filter, setFilter] = useState<string>("all");

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.status === filter);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground mt-1">Track and manage your deliverables</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-fit">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </motion.div>

        {/* Status Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {["all", "planning", "in-progress", "review", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                filter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {status === "all" ? "All Projects" : statusConfig[status as keyof typeof statusConfig]?.label}
            </button>
          ))}
        </motion.div>

        {/* Projects List */}
        <div className="space-y-4">
          {filteredProjects.map((project, index) => {
            const status = statusConfig[project.status as keyof typeof statusConfig];
            const priority = priorityStyles[project.priority as keyof typeof priorityStyles];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "glass-card rounded-xl p-5 border-l-4 hover:border-primary/30 transition-all cursor-pointer",
                  priority.border
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Project Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium", priority.badge)}>
                        {project.priority}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.client}</p>
                  </div>

                  {/* Progress */}
                  <div className="w-full lg:w-48">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium text-foreground">{project.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-foreground font-medium">{project.tasks.completed}</span>
                    <span className="text-muted-foreground">/ {project.tasks.total} tasks</span>
                  </div>

                  {/* Due Date */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{project.dueDate}</span>
                  </div>

                  {/* Team */}
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium text-foreground"
                        >
                          {member}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium text-primary">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium", status.bg, status.color)}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </div>

                  {/* Actions */}
                  <button className="p-2 rounded-md hover:bg-secondary transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Projects;
