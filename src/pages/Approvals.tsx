import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  Clock,
  Mail,
  Share2,
  FileText,
  MessageSquare,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGuard } from "@/components/PermissionGuard";
import { Permission } from "@/types/auth";

const approvals = [
  {
    id: 1,
    title: "January Newsletter Draft",
    type: "email",
    client: "TechCorp Industries",
    status: "pending",
    submittedBy: "Sarah Anderson",
    submittedAt: "2 hours ago",
    dueDate: "Jan 5, 2026",
    description: "Monthly newsletter featuring product updates and industry news.",
  },
  {
    id: 2,
    title: "LinkedIn Campaign Posts (Week 2)",
    type: "social",
    client: "Green Solutions Ltd",
    status: "pending",
    submittedBy: "Mike Chen",
    submittedAt: "5 hours ago",
    dueDate: "Jan 4, 2026",
    description: "5 LinkedIn posts focusing on sustainability initiatives.",
  },
  {
    id: 3,
    title: "Blog: Future of Fintech",
    type: "blog",
    client: "Nova Ventures",
    status: "revision",
    submittedBy: "Lisa Turner",
    submittedAt: "1 day ago",
    dueDate: "Jan 8, 2026",
    description: "Thought leadership article on emerging fintech trends.",
    feedback: "Please add more data points and update the conclusion section.",
  },
  {
    id: 4,
    title: "Instagram Story Templates",
    type: "social",
    client: "Atlas Media Group",
    status: "approved",
    submittedBy: "Rachel Brooks",
    submittedAt: "2 days ago",
    dueDate: "Jan 3, 2026",
    description: "10 story templates for Q1 promotional content.",
    approvedAt: "1 day ago",
  },
  {
    id: 5,
    title: "Product Launch Email Sequence",
    type: "email",
    client: "TechCorp Industries",
    status: "rejected",
    submittedBy: "John Davis",
    submittedAt: "3 days ago",
    dueDate: "Jan 2, 2026",
    description: "4-part email sequence for new product launch.",
    feedback: "Tone doesn't match brand guidelines. Please revise with softer CTA.",
  },
];

const typeConfig = {
  email: { icon: Mail, color: "text-primary", bg: "bg-primary/10" },
  social: { icon: Share2, color: "text-success", bg: "bg-success/10" },
  blog: { icon: FileText, color: "text-warning", bg: "bg-warning/10" },
};

const statusConfig = {
  pending: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Pending Review" },
  approved: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Approved" },
  rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected" },
  revision: { icon: MessageSquare, color: "text-primary", bg: "bg-primary/10", label: "Revision Requested" },
};

type Approval = {
  id: number;
  title: string;
  type: string;
  client: string;
  status: string;
  submittedBy: string;
  submittedAt: string;
  dueDate: string;
  description: string;
  feedback?: string;
  approvedAt?: string;
};

const STORAGE_KEY = "agency_approvals_data";

// Load approvals from localStorage or use default data
const loadApprovals = (): Approval[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load approvals from localStorage:", error);
  }
  return approvals;
};

// Save approvals to localStorage
const saveApprovals = (approvalsList: Approval[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(approvalsList));
  } catch (error) {
    console.error("Failed to save approvals to localStorage:", error);
  }
};

const Approvals = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [approvalsList, setApprovalsList] = useState<Approval[]>(() => loadApprovals());
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [viewChangesDialogOpen, setViewChangesDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const { canApproveContent, canRejectContent } = usePermissions();

  // Save to localStorage and invalidate queries whenever approvalsList changes
  useEffect(() => {
    saveApprovals(approvalsList);
    // Invalidate dashboard queries to refresh stats
    queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [approvalsList, queryClient]);

  const filteredApprovals = filter === "all" 
    ? approvalsList 
    : approvalsList.filter(a => a.status === filter);

  const pendingCount = approvalsList.filter(a => a.status === "pending").length;

  const handlePreview = (approval: Approval) => {
    setSelectedApproval(approval);
    setPreviewDialogOpen(true);
  };

  const handleViewChanges = (approval: Approval) => {
    setSelectedApproval(approval);
    setViewChangesDialogOpen(true);
  };

  const handleReject = (approval: Approval) => {
    setSelectedApproval(approval);
    setRejectFeedback("");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (!selectedApproval) return;
    
    setApprovalsList(prev => prev.map(approval => 
      approval.id === selectedApproval.id
        ? { ...approval, status: "rejected" as const, feedback: rejectFeedback || "No feedback provided." }
        : approval
    ));
    
    setRejectDialogOpen(false);
    setSelectedApproval(null);
    setRejectFeedback("");
    toast.success("Content rejected", {
      description: "The content has been rejected and feedback has been recorded.",
    });
  };

  const handleApprove = (approval: Approval) => {
    setApprovalsList(prev => prev.map(a => 
      a.id === approval.id
        ? { ...a, status: "approved" as const, approvedAt: "Just now" }
        : a
    ));
    
    toast.success("Content approved", {
      description: `${approval.title} has been approved successfully.`,
    });
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
            <h1 className="text-2xl font-bold text-foreground">Content Approvals</h1>
            <p className="text-muted-foreground mt-1">
              Review and approve client content • 
              <span className="text-warning font-medium ml-1">{pendingCount} pending</span>
            </p>
          </div>
        </motion.div>

        {/* Status Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2"
        >
          {["all", "pending", "revision", "approved", "rejected"].map((status) => (
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
              {status === "all" ? "All Items" : statusConfig[status as keyof typeof statusConfig]?.label}
            </button>
          ))}
        </motion.div>

        {/* Approvals List */}
        <div className="space-y-4">
          {filteredApprovals.map((approval, index) => {
            const type = typeConfig[approval.type as keyof typeof typeConfig];
            const status = statusConfig[approval.status as keyof typeof statusConfig];
            const TypeIcon = type.icon;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Content Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className={cn("p-3 rounded-lg shrink-0", type.bg)}>
                      <TypeIcon className={cn("w-5 h-5", type.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground">{approval.title}</h3>
                        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", status.bg, status.color)}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{approval.client}</p>
                      <p className="text-sm text-foreground/80">{approval.description}</p>
                      
                      {approval.feedback && (
                        <div className="mt-3 p-3 rounded-lg bg-secondary/50 border-l-2 border-warning">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Feedback:</span> {approval.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meta & Actions */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Submitted by <span className="text-foreground">{approval.submittedBy}</span></p>
                      <p className="text-muted-foreground">{approval.submittedAt}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Due: <span className="text-foreground">{approval.dueDate}</span></p>

                    {approval.status === "pending" && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1.5"
                          onClick={() => handlePreview(approval)}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                        <PermissionGuard permission={Permission.REJECT_CONTENT}>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleReject(approval)}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard permission={Permission.APPROVE_CONTENT}>
                          <Button 
                            size="sm" 
                            className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
                            onClick={() => handleApprove(approval)}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve
                          </Button>
                        </PermissionGuard>
                      </div>
                    )}

                    {approval.status === "revision" && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1.5"
                          onClick={() => handleViewChanges(approval)}
                        >
                          <Eye className="w-4 h-4" />
                          View Changes
                        </Button>
                        <PermissionGuard permission={Permission.APPROVE_CONTENT}>
                          <Button 
                            size="sm" 
                            className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
                            onClick={() => handleApprove(approval)}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Approve Revision
                          </Button>
                        </PermissionGuard>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedApproval?.title}</DialogTitle>
            <DialogDescription>
              Preview content for {selectedApproval?.client}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{selectedApproval?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 font-medium capitalize">{selectedApproval?.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted by:</span>
                <span className="ml-2 font-medium">{selectedApproval?.submittedBy}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted:</span>
                <span className="ml-2 font-medium">{selectedApproval?.submittedAt}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Due date:</span>
                <span className="ml-2 font-medium">{selectedApproval?.dueDate}</span>
              </div>
            </div>
            <div className="p-4 bg-secondary rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground text-center">
                Content preview would be displayed here
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Provide feedback for rejecting {selectedApproval?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter feedback for the rejection (optional but recommended)..."
              value={rejectFeedback}
              onChange={(e) => setRejectFeedback(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectConfirm}
            >
              Reject Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Changes Dialog */}
      <Dialog open={viewChangesDialogOpen} onOpenChange={setViewChangesDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Changes - {selectedApproval?.title}</DialogTitle>
            <DialogDescription>
              Review the changes made after revision request for {selectedApproval?.client}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <h4 className="font-semibold mb-2">Original Feedback</h4>
              <div className="p-3 rounded-lg bg-secondary/50 border-l-2 border-warning">
                <p className="text-sm text-muted-foreground">
                  {selectedApproval?.feedback || "No feedback provided"}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Updated Content</h4>
              <div className="p-4 bg-secondary rounded-lg border border-dashed">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Title:</span>
                    <p className="text-sm text-foreground mt-1">{selectedApproval?.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Description:</span>
                    <p className="text-sm text-foreground mt-1">{selectedApproval?.description}</p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground text-center">
                      Content preview would be displayed here showing the updated version
                    </p>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Changes made based on feedback: {selectedApproval?.feedback}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 font-medium capitalize">{selectedApproval?.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted by:</span>
                <span className="ml-2 font-medium">{selectedApproval?.submittedBy}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Submitted:</span>
                <span className="ml-2 font-medium">{selectedApproval?.submittedAt}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Due date:</span>
                <span className="ml-2 font-medium">{selectedApproval?.dueDate}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewChangesDialogOpen(false)}>
              Close
            </Button>
            {canApproveContent() && (
              <Button 
                className="bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => {
                  if (selectedApproval) {
                    handleApprove(selectedApproval);
                    setViewChangesDialogOpen(false);
                  }
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Approve Revision
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Approvals;
