import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission, UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: Permission;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

/**
 * Component that protects routes based on permissions or roles
 */
export function ProtectedRoute({
  children,
  requiredPermission,
  allowedRoles,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { can, hasRole } = usePermissions();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If no user, redirect (shouldn't happen in this app, but safety check)
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => hasRole(role));
    if (!hasAllowedRole) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    if (!can(requiredPermission)) {
      return <Navigate to={redirectTo} replace />;
    }
  }

  return <>{children}</>;
}

