import { motion, AnimatePresence } from "framer-motion";
import { 
  X,
  FolderOpen,
  Building2,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
  Flag,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Project {
  id: number;
  name: string;
  client: string;
  status: "planning" | "in-progress" | "review" | "completed" | "paused";
  progress: number;
  dueDate: string;
  priority: "urgent" | "high" | "medium" | "low";
  team: string[];
  tasks: { completed: number; total: number };
}

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

const statusConfig = {
  "planning": { 
    label: "Planning", 
    icon: Clock, 
    className: "bg-muted text-muted-foreground" 
  },
  "in-progress": { 
    label: "In Progress", 
    icon: Clock, 
    className: "bg-primary/10 text-primary" 
  },
  "review": { 
    label: "In Review", 
    icon: AlertCircle, 
    className: "bg-warning/10 text-warning" 
  },
  "completed": { 
    label: "Completed", 
    icon: CheckCircle2, 
    className: "bg-success/10 text-success" 
  },
  "paused": { 
    label: "Paused", 
    icon: PauseCircle, 
    className: "bg-muted text-muted-foreground" 
  },
};

const priorityConfig = {
  urgent: { label: "Urgent", className: "bg-destructive/10 text-destructive" },
  high: { label: "High", className: "bg-warning/10 text-warning" },
  medium: { label: "Medium", className: "bg-primary/10 text-primary" },
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
};

export function ProjectDetailsModal({ isOpen, onClose, project }: ProjectDetailsModalProps) {
  if (!project) return null;

  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];
  const StatusIcon = status.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FolderOpen className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{project.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{project.client}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-md hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Status and Priority Badges */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-4 h-4" />
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        status.className
                      )}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-muted-foreground" />
                      <span className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        priority.className
                      )}>
                        {priority.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                      Progress
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Completion</span>
                        <span className="text-sm font-medium text-foreground">{project.progress}%</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Project Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                      Project Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Client</p>
                          <p className="text-sm font-medium text-foreground">{project.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className="text-sm font-medium text-foreground">{project.dueDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <Target className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Tasks</p>
                          <p className="text-sm font-medium text-foreground">
                            {project.tasks.completed} / {project.tasks.total} completed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                      Team Members
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {project.team.map((member, index) => (
                        <div
                          key={index}
                          className="w-10 h-10 rounded-full bg-secondary border-2 border-border flex items-center justify-center text-sm font-medium text-foreground"
                        >
                          {member}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-secondary/50">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

