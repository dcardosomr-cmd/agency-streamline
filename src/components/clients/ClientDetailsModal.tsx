import { motion, AnimatePresence } from "framer-motion";
import { 
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  projects: number;
  revenue: string;
  lastActivity: string;
  industry: string;
}

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "bg-success/10 text-success",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-warning/10 text-warning",
  },
  inactive: {
    label: "Inactive",
    icon: XCircle,
    className: "bg-muted text-muted-foreground",
  },
};

export function ClientDetailsModal({ isOpen, onClose, client }: ClientDetailsModalProps) {
  if (!client) return null;

  const status = statusConfig[client.status];

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
                    <Building2 className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{client.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{client.industry}</p>
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
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <status.icon className="w-4 h-4" />
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      status.className
                    )}>
                      {status.label}
                    </span>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-sm font-medium text-foreground">{client.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="text-sm font-medium text-foreground">{client.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Metrics */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                      Business Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Projects</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{client.projects}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{client.revenue}</p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Information */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                      Activity
                    </h3>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Last Activity</p>
                        <p className="text-sm font-medium text-foreground">{client.lastActivity}</p>
                      </div>
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

