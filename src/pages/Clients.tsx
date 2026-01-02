import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Filter, 
  Building2, 
  Mail, 
  Phone, 
  MoreHorizontal,
  ExternalLink,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateClientModal } from "@/components/clients/CreateClientModal";
import { ClientDetailsModal } from "@/components/clients/ClientDetailsModal";
import { EditClientModal } from "@/components/clients/EditClientModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/auth";
import { PermissionGuard } from "@/components/PermissionGuard";

const initialClients = [
  {
    id: 1,
    name: "TechCorp Industries",
    email: "contact@techcorp.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    projects: 5,
    revenue: "$124,500",
    lastActivity: "2 hours ago",
    industry: "Technology",
  },
  {
    id: 2,
    name: "Green Solutions Ltd",
    email: "info@greensolutions.com",
    phone: "+1 (555) 234-5678",
    status: "active",
    projects: 3,
    revenue: "$78,200",
    lastActivity: "1 day ago",
    industry: "Sustainability",
  },
  {
    id: 3,
    name: "Nova Ventures",
    email: "hello@novaventures.io",
    phone: "+1 (555) 345-6789",
    status: "pending",
    projects: 2,
    revenue: "$32,800",
    lastActivity: "3 days ago",
    industry: "Finance",
  },
  {
    id: 4,
    name: "Atlas Media Group",
    email: "team@atlasmedia.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    projects: 7,
    revenue: "$245,600",
    lastActivity: "5 hours ago",
    industry: "Media",
  },
  {
    id: 5,
    name: "Pinnacle Health",
    email: "contact@pinnaclehealth.com",
    phone: "+1 (555) 567-8901",
    status: "inactive",
    projects: 0,
    revenue: "$15,000",
    lastActivity: "2 weeks ago",
    industry: "Healthcare",
  },
  {
    id: 6,
    name: "Urban Development Co",
    email: "info@urbandev.com",
    phone: "+1 (555) 678-9012",
    status: "active",
    projects: 4,
    revenue: "$156,300",
    lastActivity: "12 hours ago",
    industry: "Real Estate",
  },
];

const statusStyles = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  inactive: "bg-muted text-muted-foreground",
};

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  projects: number;
  revenue: string;
  lastActivity: string;
  industry: string;
};

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "inactive">("all");
  const [isCreateClientModalOpen, setIsCreateClientModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const { canViewAllClients, canManageUsers } = usePermissions();

  const handleAddClient = (newClient: {
    name: string;
    email: string;
    phone: string;
    address: string;
    industry: string;
  }) => {
    const client = {
      id: Math.max(...clients.map(c => c.id), 0) + 1,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone || "N/A",
      status: "active" as const,
      projects: 0,
      revenue: "$0",
      lastActivity: "Just now",
      industry: newClient.industry,
    };
    setClients([...clients, client]);
    toast.success("Client added successfully", {
      description: `${client.name} has been added to your clients list.`,
    });
  };

  const handleDeleteClient = (clientId: number) => {
    setClients(clients.filter(client => client.id !== clientId));
  };

  const handleUpdateClient = (clientId: number, updatedData: {
    name: string;
    email: string;
    phone: string;
    industry: string;
    status: "active" | "pending" | "inactive";
  }) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { ...client, ...updatedData }
        : client
    ));
    toast.success("Client updated successfully", {
      description: `${updatedData.name} has been updated.`,
    });
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || client.status === filter;
    return matchesSearch && matchesFilter;
  });

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
            <h1 className="text-2xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1">Manage your client relationships</p>
          </div>
          <PermissionGuard permission={Permission.MANAGE_USERS}>
            <Button 
              onClick={() => setIsCreateClientModalOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-fit"
            >
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          </PermissionGuard>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "pending", "inactive"] as const).map((status) => (
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
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {client.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">{client.industry}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      type="button"
                      className="p-1.5 rounded-md hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onSelect={() => {
                        setSelectedClient(client);
                        setIsClientDetailsModalOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {canManageUsers() && (
                      <>
                        <DropdownMenuItem 
                          onSelect={() => {
                            setClientToEdit(client);
                            setIsEditClientModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Client
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onSelect={() => {
                            const clientToDelete = client;
                            toast.error("Delete client", {
                              description: `Are you sure you want to delete ${clientToDelete.name}?`,
                              action: {
                                label: "Delete",
                                onClick: () => {
                                  handleDeleteClient(clientToDelete.id);
                                  toast.success("Client deleted", {
                                    description: `${clientToDelete.name} has been deleted.`,
                                  });
                                },
                              },
                            });
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Client
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{client.phone}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{client.revenue}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{client.projects}</p>
                    <p className="text-xs text-muted-foreground">Projects</p>
                  </div>
                </div>
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium",
                  statusStyles[client.status as keyof typeof statusStyles]
                )}>
                  {client.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Client Modal */}
      <CreateClientModal 
        isOpen={isCreateClientModalOpen} 
        onClose={() => setIsCreateClientModalOpen(false)}
        onAddClient={handleAddClient}
      />

      {/* Client Details Modal */}
      <ClientDetailsModal
        isOpen={isClientDetailsModalOpen}
        onClose={() => {
          setIsClientDetailsModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />

      {/* Edit Client Modal */}
      <EditClientModal
        isOpen={isEditClientModalOpen}
        onClose={() => {
          setIsEditClientModalOpen(false);
          setClientToEdit(null);
        }}
        client={clientToEdit}
        onUpdateClient={handleUpdateClient}
      />
    </AppLayout>
  );
};

export default Clients;
