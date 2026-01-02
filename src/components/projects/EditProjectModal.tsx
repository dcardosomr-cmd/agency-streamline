import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X,
  Calendar,
  Users,
  Flag,
  FileText,
  ChevronDown,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const clients = [
  "TechCorp Industries",
  "Green Solutions Ltd",
  "Nova Ventures",
  "Atlas Media Group",
  "Urban Development Co",
];

const priorities = [
  { id: "urgent", label: "Urgent", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive" },
  { id: "high", label: "High", color: "text-warning", bg: "bg-warning/10", border: "border-warning" },
  { id: "medium", label: "Medium", color: "text-primary", bg: "bg-primary/10", border: "border-primary" },
  { id: "low", label: "Low", color: "text-muted-foreground", bg: "bg-muted", border: "border-muted-foreground" },
];

const statuses = [
  { id: "planning", label: "Planning" },
  { id: "in-progress", label: "In Progress" },
  { id: "review", label: "In Review" },
  { id: "completed", label: "Completed" },
  { id: "paused", label: "Paused" },
];

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

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdateProject: (projectId: number, updatedData: {
    name: string;
    client: string;
    priority: "urgent" | "high" | "medium" | "low";
    status: "planning" | "in-progress" | "review" | "completed" | "paused";
    dueDate: string;
    description?: string;
    team: string[];
  }) => void;
}

export function EditProjectModal({ isOpen, onClose, project, onUpdateProject }: EditProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [selectedPriority, setSelectedPriority] = useState<"urgent" | "high" | "medium" | "low">("medium");
  const [selectedStatus, setSelectedStatus] = useState<"planning" | "in-progress" | "review" | "completed" | "paused">("planning");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  const availableTeamMembers = ["JD", "AS", "MK", "LT", "RB"];

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setProjectName(project.name);
      setSelectedClient(project.client);
      setSelectedPriority(project.priority);
      setSelectedStatus(project.status);
      setDueDate(project.dueDate);
      setTeamMembers([...project.team]);
      setDescription("");
    }
  }, [project]);

  const toggleTeamMember = (member: string) => {
    setTeamMembers(prev => 
      prev.includes(member)
        ? prev.filter(m => m !== member)
        : [...prev, member]
    );
  };

  const handleSubmit = () => {
    if (!projectName.trim() || !project) {
      return;
    }
    
    onUpdateProject(project.id, {
      name: projectName,
      client: selectedClient,
      priority: selectedPriority,
      status: selectedStatus,
      dueDate,
      description,
      team: teamMembers,
    });
    
    onClose();
  };

  if (!project) return null;

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
              className="w-full max-w-2xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
            >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Edit Project</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Project Name */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Project Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="w-full h-10 px-3 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Client Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Client <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-secondary border-0 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Priority and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Priority</label>
                  <div className="flex flex-wrap gap-2">
                    {priorities.map((priority) => {
                      const isSelected = selectedPriority === priority.id;
                      return (
                        <button
                          key={priority.id}
                          onClick={() => setSelectedPriority(priority.id as "urgent" | "high" | "medium" | "low")}
                          className={cn(
                            "px-3 py-1.5 rounded-lg border text-sm transition-all",
                            isSelected
                              ? `${priority.bg} ${priority.color} ${priority.border} border-2`
                              : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                          )}
                        >
                          {priority.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as "planning" | "in-progress" | "review" | "completed" | "paused")}
                      className="w-full h-10 px-3 pr-10 rounded-lg bg-secondary border-0 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {statuses.map(status => (
                        <option key={status.id} value={status.id}>{status.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter project description..."
                  className="w-full h-32 p-3 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Team Members */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Team Members</label>
                <div className="flex flex-wrap gap-2">
                  {availableTeamMembers.map((member) => {
                    const isSelected = teamMembers.includes(member);
                    return (
                      <button
                        key={member}
                        onClick={() => toggleTeamMember(member)}
                        className={cn(
                          "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center text-sm font-medium",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-muted-foreground border-border hover:border-primary/50"
                        )}
                      >
                        {member}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/50">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!projectName.trim()}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

