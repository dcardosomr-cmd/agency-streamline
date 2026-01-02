import { ReactNode } from "react";
import { Permission, UserRole } from "@/types/auth";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/contexts/AuthContext";

interface PermissionGuardProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export function PermissionGuard({
  permission,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { can } = usePermissions();

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  roles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user role
 */
export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user) {
    return <>{fallback}</>;
  }

  // Check if user has any of the required roles
  const hasRequiredRole = roles.some(role => user.role === role);
  if (!hasRequiredRole) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

