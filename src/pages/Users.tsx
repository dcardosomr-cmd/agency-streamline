import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  UserPlus,
  Mail,
  Shield,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { UserRole } from "@/types/auth";
import { ROLE_DISPLAY_NAMES } from "@/types/auth";

// Mock client users data
const initialUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@client.com",
    role: UserRole.CLIENT_USER,
    status: "active",
    lastActive: "2 hours ago",
    joinedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@client.com",
    role: UserRole.CLIENT_USER,
    status: "active",
    lastActive: "1 day ago",
    joinedDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@client.com",
    role: UserRole.CLIENT_ADMIN,
    status: "active",
    lastActive: "Just now",
    joinedDate: "2024-01-10",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@client.com",
    role: UserRole.CLIENT_USER,
    status: "inactive",
    lastActive: "2 weeks ago",
    joinedDate: "2024-03-05",
  },
];

type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive";
  lastActive: string;
  joinedDate: string;
};

const statusStyles = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
};

const Users = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { canManageUsers } = usePermissions();

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: UserRole.CLIENT_USER,
  });

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const user: User = {
      id: Math.max(...users.map(u => u.id), 0) + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      lastActive: "Just now",
      joinedDate: new Date().toISOString().split('T')[0],
    };

    setUsers([...users, user]);
    setNewUser({ name: "", email: "", role: UserRole.CLIENT_USER });
    setIsCreateModalOpen(false);
    toast.success("User created successfully", {
      description: `${user.name} has been added to your team.`,
    });
  };

  const handleEditUser = () => {
    if (!userToEdit || !newUser.name || !newUser.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setUsers(users.map(user => 
      user.id === userToEdit.id
        ? { ...user, name: newUser.name, email: newUser.email, role: newUser.role }
        : user
    ));
    
    setUserToEdit(null);
    setNewUser({ name: "", email: "", role: UserRole.CLIENT_USER });
    setIsEditModalOpen(false);
    toast.success("User updated successfully");
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success("User deleted", {
        description: `${user.name} has been removed from your team.`,
      });
    }
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ));
  };

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    setNewUser({ name: user.name, email: user.email, role: user.role });
    setIsEditModalOpen(true);
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
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground mt-1">Manage your company's users and permissions</p>
          </div>
          {canManageUsers() && (
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-fit"
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          )}
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
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "active", "inactive"] as const).map((status) => (
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

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-foreground">{ROLE_DISPLAY_NAMES[user.role]}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        statusStyles[user.status]
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {canManageUsers() && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(user)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(user.id)}>
                              {user.status === "active" ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Invite a new user to your company's portal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john.doe@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.CLIENT_USER}>
                    {ROLE_DISPLAY_NAMES[UserRole.CLIENT_USER]}
                  </SelectItem>
                  <SelectItem value={UserRole.CLIENT_ADMIN}>
                    {ROLE_DISPLAY_NAMES[UserRole.CLIENT_ADMIN]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john.doe@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.CLIENT_USER}>
                    {ROLE_DISPLAY_NAMES[UserRole.CLIENT_USER]}
                  </SelectItem>
                  <SelectItem value={UserRole.CLIENT_ADMIN}>
                    {ROLE_DISPLAY_NAMES[UserRole.CLIENT_ADMIN]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Users;

