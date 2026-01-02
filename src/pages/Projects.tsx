import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { ProjectDetailsModal } from "@/components/projects/ProjectDetailsModal";
import { EditProjectModal } from "@/components/projects/EditProjectModal";
import { 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  PauseCircle,
  Calendar,
  Users,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { format, parse } from "date-fns";

const initialProjects = [
  {
    id: 1,
    name: "Q1 Brand Campaign",
    client: "TechCorp Industries",
    status: "in-progress" as const,
    progress: 65,
    dueDate: "Jan 15, 2026",
    priority: "high" as const,
    team: ["JD", "AS", "MK"],
    tasks: { completed: 12, total: 18 },
  },
  {
    id: 2,
    name: "Social Media Strategy",
    client: "Green Solutions Ltd",
    status: "in-progress" as const,
    progress: 40,
    dueDate: "Jan 22, 2026",
    priority: "medium" as const,
    team: ["AS", "RB"],
    tasks: { completed: 6, total: 15 },
  },
  {
    id: 3,
    name: "Website Redesign",
    client: "Nova Ventures",
    status: "review" as const,
    progress: 90,
    dueDate: "Jan 8, 2026",
    priority: "urgent" as const,
    team: ["JD", "MK", "LT", "AS"],
    tasks: { completed: 27, total: 30 },
  },
  {
    id: 4,
    name: "Email Marketing Series",
    client: "Atlas Media Group",
    status: "completed" as const,
    progress: 100,
    dueDate: "Dec 28, 2025",
    priority: "low" as const,
    team: ["RB"],
    tasks: { completed: 8, total: 8 },
  },
  {
    id: 5,
    name: "Product Launch Campaign",
    client: "TechCorp Industries",
    status: "planning" as const,
    progress: 15,
    dueDate: "Feb 10, 2026",
    priority: "high" as const,
    team: ["JD", "AS"],
    tasks: { completed: 3, total: 20 },
  },
  {
    id: 6,
    name: "Annual Report Design",
    client: "Urban Development Co",
    status: "in-progress" as const,
    progress: 55,
    dueDate: "Jan 30, 2026",
    priority: "medium" as const,
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

type Project = typeof initialProjects[0] & { budget?: number; spent?: number };

const STORAGE_KEY = "agency_projects_data";

// Load projects from localStorage or use default data
const loadProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load projects from localStorage:", error);
  }
  return initialProjects;
};

// Save projects to localStorage
const saveProjects = (projectsList: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsList));
  } catch (error) {
    console.error("Failed to save projects to localStorage:", error);
  }
};

const Projects = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Save to localStorage and invalidate queries whenever projects change
  useEffect(() => {
    saveProjects(projects);
    // Invalidate dashboard queries to refresh stats
    queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    queryClient.invalidateQueries({ queryKey: ["activeProjects"] });
    queryClient.invalidateQueries({ queryKey: ["upcomingDeadlines"] });
    queryClient.invalidateQueries({ queryKey: ["teamWorkload"] });
  }, [projects, queryClient]);

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.status === filter);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleAddProject = (projectData: {
    name: string;
    client: string;
    priority: "urgent" | "high" | "medium" | "low";
    status: "planning" | "in-progress" | "review" | "completed" | "paused";
    dueDate: string;
    description?: string;
    team: string[];
  }) => {
    // Convert date from "yyyy-MM-dd" to "MMM d, yyyy" format if needed
    let formattedDueDate = projectData.dueDate;
    try {
      const parsed = parse(projectData.dueDate, "yyyy-MM-dd", new Date());
      if (!isNaN(parsed.getTime())) {
        formattedDueDate = format(parsed, "MMM d, yyyy");
      }
    } catch {
      // Keep original if parsing fails
    }
    
    const newProject: Project = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      ...projectData,
      dueDate: formattedDueDate,
      progress: projectData.status === "completed" ? 100 : projectData.status === "planning" ? 0 : 50,
      tasks: { completed: 0, total: 10 },
    };
    setProjects(prev => [...prev, newProject]);
    toast.success("Project created", {
      description: `${projectData.name} has been created successfully.`,
    });
  };

  const handleUpdateProject = (projectId: number, updatedData: {
    name: string;
    client: string;
    priority: "urgent" | "high" | "medium" | "low";
    status: "planning" | "in-progress" | "review" | "completed" | "paused";
    dueDate: string;
    description?: string;
    team: string[];
  }) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId
        ? { ...project, ...updatedData }
        : project
    ));
    toast.success("Project updated", {
      description: "The project has been updated successfully.",
    });
  };

  const handleDeleteProject = () => {
    if (!selectedProject) return;
    setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
    toast.success("Project deleted", {
      description: `${selectedProject.name} has been deleted successfully.`,
    });
    setIsDeleteDialogOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

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
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-fit"
          >
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        type="button"
                        className="p-2 rounded-md hover:bg-secondary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => handleViewDetails(project)}>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleEditProject(project)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onSelect={() => handleDeleteClick(project)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onAddProject={handleAddProject}
      />

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onUpdateProject={handleUpdateProject}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{selectedProject?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedProject(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Projects;
