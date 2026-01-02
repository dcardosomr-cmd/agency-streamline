import { motion } from "framer-motion";
import { ArrowRight, Building2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const clients = [
  {
    id: 1,
    name: "TechCorp Industries",
    email: "contact@techcorp.com",
    status: "active",
    projects: 5,
    revenue: "$24,500",
  },
  {
    id: 2,
    name: "Green Solutions Ltd",
    email: "info@greensolutions.com",
    status: "active",
    projects: 3,
    revenue: "$18,200",
  },
  {
    id: 3,
    name: "Nova Ventures",
    email: "hello@novaventures.io",
    status: "pending",
    projects: 2,
    revenue: "$12,800",
  },
  {
    id: 4,
    name: "Atlas Media Group",
    email: "team@atlasmedia.com",
    status: "active",
    projects: 7,
    revenue: "$45,600",
  },
];

export function RecentClients() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">Recent Clients</h3>
          <p className="text-sm text-muted-foreground mt-0.5">Your latest client activity</p>
        </div>
        <Link to="/clients">
          <Button variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary">
            View all
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-border">
        {clients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
            className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="font-medium text-foreground">{client.revenue}</p>
                <p className="text-xs text-muted-foreground">{client.projects} projects</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                client.status === "active" 
                  ? "bg-success/10 text-success" 
                  : "bg-warning/10 text-warning"
              }`}>
                {client.status}
              </span>
              <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
