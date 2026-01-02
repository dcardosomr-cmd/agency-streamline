import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, FolderKanban, FileText, Share2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { CreateInvoiceModal } from "@/components/billing/CreateInvoiceModal";
import { CreatePostModal } from "@/components/campaigns/CreatePostModal";
import { CreateClientModal } from "@/components/clients/CreateClientModal";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    id: "project",
    label: "New Project",
    icon: FolderKanban,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "invoice",
    label: "New Invoice",
    icon: FileText,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: "post",
    label: "New Post",
    icon: Share2,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: "client",
    label: "New Client",
    icon: Building2,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export function QuickActions() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (actionId: string) => {
    switch (actionId) {
      case "project":
        setIsProjectModalOpen(true);
        break;
      case "invoice":
        setIsInvoiceModalOpen(true);
        break;
      case "post":
        setIsPostModalOpen(true);
        break;
      case "client":
        setIsClientModalOpen(true);
        break;
    }
  };

  const handleClientAdded = (clientData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    industry: string;
  }) => {
    // This will be handled by the modal's callback
    setIsClientModalOpen(false);
    navigate("/clients");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">Quick Actions</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Create new items quickly</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                onClick={() => handleAction(action.id)}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-lg 
                  bg-secondary/30 hover:bg-secondary/50 
                  transition-all cursor-pointer
                  border border-transparent hover:border-primary/30
                `}
              >
                <div className={`p-2.5 rounded-lg ${action.bgColor}`}>
                  <Icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />

      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />

      <CreateClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onAddClient={handleClientAdded}
      />
    </>
  );
}

