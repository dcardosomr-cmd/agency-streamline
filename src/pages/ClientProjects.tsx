import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Project } from "@/types/content";
import { contentService } from "@/services/contentService";
import { Eye, Clock, Users, FileDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function ClientProjects() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const projects = useMemo(() => {
    const all = contentService.getProjects();
    if (user?.role === "CLIENT_ADMIN" && user.clientId) {
      return all.filter(p => p.clientId === user.clientId);
    }
    return all;
  }, [user]);

  const statusConfig = {
    "planning": { label: "Planning", color: "text-muted-foreground", bg: "bg-muted" },
    "in-progress": { label: "In Progress", color: "text-primary", bg: "bg-primary/10" },
    "review": { label: "In Review", color: "text-warning", bg: "bg-warning/10" },
    "completed": { label: "Completed", color: "text-success", bg: "bg-success/10" },
    "on-hold": { label: "On Hold", color: "text-muted-foreground", bg: "bg-muted" },
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your company's projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-medium",
                    statusConfig[project.status]?.bg,
                    statusConfig[project.status]?.color
                  )}>
                    {statusConfig[project.status]?.label}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Due: {format(new Date(project.dueDate), "MMM d, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Tasks: {project.tasks.completed}/{project.tasks.total}</span>
                  </div>
                  {project.budget && (
                    <div className="text-muted-foreground">
                      Budget: ${project.budget.toLocaleString()}
                      {project.spent !== undefined && (
                        <span className="ml-1">
                          (${project.spent.toLocaleString()} spent)
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {project.files && project.files.length > 0 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileDown className="w-4 h-4" />
                    <span>{project.files.length} file(s) available</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/projects/${project.id}/client`)}
                  className="w-full gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

