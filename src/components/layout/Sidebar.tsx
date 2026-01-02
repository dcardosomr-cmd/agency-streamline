import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Megaphone,
  FileCheck,
  Receipt,
  Settings,
  ChevronLeft,
  Building2,
  LogOut,
  BarChart3,
  UserCog,
  FileText,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission, UserRole } from "@/types/auth";
import { ROLE_DISPLAY_NAMES } from "@/types/auth";

// Navigation items with required permissions
// CLIENT_ADMIN should see: Approvals, Billing, Analytics, Users
const navigationItems = [
  { 
    name: "Dashboard", 
    href: "/", 
    icon: LayoutDashboard, 
    permission: null, // Everyone can see dashboard, but content will be filtered
  },
  { 
    name: "Clients", 
    href: "/clients", 
    icon: Users, 
    permission: Permission.VIEW_ALL_CLIENTS // Only agency users can see all clients
  },
  { 
    name: "Projects", 
    href: "/projects", 
    icon: FolderKanban, 
    permission: Permission.VIEW_ALL_CLIENTS // Only agency users
  },
  { 
    name: "Campaigns", 
    href: "/campaigns", 
    icon: Megaphone, 
    permission: Permission.CREATE_CONTENT // Only agency users can create content
  },
  { 
    name: "Blogs", 
    href: "/blogs", 
    icon: FileText, 
    permission: Permission.CREATE_CONTENT // Only agency users
  },
  { 
    name: "Messages", 
    href: "/messages", 
    icon: MessageSquare, 
    permission: null // All authenticated users
  },
  { 
    name: "Approvals", 
    href: "/approvals", 
    icon: FileCheck, 
    permission: Permission.APPROVE_CONTENT 
  },
  { 
    name: "Analytics", 
    href: "/analytics", 
    icon: BarChart3, 
    permission: Permission.VIEW_ANALYTICS // CLIENT_ADMIN and agency users
  },
  { 
    name: "Team", 
    href: "/users", 
    icon: UserCog, 
    permission: Permission.MANAGE_USERS // CLIENT_ADMIN and agency users
  },
  { 
    name: "Billing", 
    href: "/billing", 
    icon: Receipt, 
    permission: Permission.BILLING_MANAGEMENT 
  },
];

// Filter navigation based on permissions
function getNavigation(can: (permission: Permission) => boolean, userRole: UserRole) {
  return navigationItems.filter(item => {
    // If item has no permission requirement, check if it should be hidden for this role
    if (item.permission === null) {
      // CLIENT_ADMIN and CLIENT_USER should not see Dashboard in navigation
      // (They can still access it, but it will show limited content)
      if (userRole === UserRole.CLIENT_ADMIN || userRole === UserRole.CLIENT_USER) {
        return false;
      }
      return true;
    }
    // Check if user has the required permission
    return can(item.permission as Permission);
  });
}

// Bottom navigation - Settings only for agency users
const bottomNavItems = [
  { name: "Settings", href: "/settings", icon: Settings, permission: Permission.SYSTEM_CONFIG },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, setUser } = useAuth();
  const { can } = usePermissions();

  const handleLogout = () => {
    setUser(null);
    // Clear any additional user data
    localStorage.removeItem("agency_user");
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.2 }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-semibold text-lg text-foreground"
            >
              AgencyHub
            </motion.span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {getNavigation(can, user?.role || UserRole.CLIENT_USER).map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "nav-link group",
                isActive && "active"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        {bottomNavItems
          .filter(item => can(item.permission))
          .map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "nav-link group",
                  isActive && "active"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}

        {/* User Profile */}
        {user && (
          <div className={cn(
            "flex items-center gap-3 px-3 py-3 mt-2 rounded-lg bg-secondary/50",
            collapsed && "justify-center px-2"
          )}>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
              {user.initials || user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{ROLE_DISPLAY_NAMES[user.role]}</p>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
