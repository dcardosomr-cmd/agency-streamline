import { useState } from "react";
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

const Approvals = () => {
  const [filter, setFilter] = useState<string>("all");

  const filteredApprovals = filter === "all" 
    ? approvals 
    : approvals.filter(a => a.status === filter);

  const pendingCount = approvals.filter(a => a.status === "pending").length;

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
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10">
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                        <Button size="sm" className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground">
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </Button>
                      </div>
                    )}

                    {approval.status === "revision" && (
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Eye className="w-4 h-4" />
                          View Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Approvals;
