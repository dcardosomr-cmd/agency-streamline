import { useMemo } from "react";
import {
  Permission,
  UserRole,
  hasPermission,
  canEditContent,
  canDeleteContent,
  canApproveContent,
  canRejectContent,
  canViewAllClients,
  canManageUsers,
} from "@/types/auth";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook to check user permissions
 */
export function usePermissions() {
  const { user } = useAuth();

  const permissions = useMemo(() => {
    if (!user) {
      return {
        can: () => false,
        canEditContent: () => false,
        canDeleteContent: () => false,
        canApproveContent: () => false,
        canRejectContent: () => false,
        canViewAllClients: () => false,
        canManageUsers: () => false,
        hasRole: () => false,
      };
    }

    return {
      /**
       * Check if user has a specific permission
       */
      can: (permission: Permission): boolean => {
        return hasPermission(user.role, permission);
      },

      /**
       * Check if user can edit content
       */
      canEditContent: (
        contentAuthorId?: string,
        contentStatus?: string
      ): boolean => {
        return canEditContent(
          user.role,
          contentAuthorId,
          user.id,
          contentStatus
        );
      },

      /**
       * Check if user can delete content
       */
      canDeleteContent: (
        contentAuthorId?: string,
        contentStatus?: string
      ): boolean => {
        return canDeleteContent(
          user.role,
          contentAuthorId,
          user.id,
          contentStatus
        );
      },

      /**
       * Check if user can approve content
       */
      canApproveContent: (): boolean => {
        return canApproveContent(user.role);
      },

      /**
       * Check if user can reject content
       */
      canRejectContent: (): boolean => {
        return canRejectContent(user.role);
      },

      /**
       * Check if user can view all clients
       */
      canViewAllClients: (): boolean => {
        return canViewAllClients(user.role);
      },

      /**
       * Check if user can manage users
       */
      canManageUsers: (targetClientId?: string): boolean => {
        return canManageUsers(user.role, targetClientId, user.clientId);
      },

      /**
       * Check if user has a specific role
       */
      hasRole: (role: UserRole): boolean => {
        return user.role === role;
      },

      /**
       * Check if user is agency user (admin or staff)
       */
      isAgencyUser: (): boolean => {
        return (
          user.role === UserRole.AGENCY_ADMIN ||
          user.role === UserRole.AGENCY_STAFF
        );
      },

      /**
       * Check if user is client user (admin or regular)
       */
      isClientUser: (): boolean => {
        return (
          user.role === UserRole.CLIENT_ADMIN ||
          user.role === UserRole.CLIENT_USER
        );
      },
    };
  }, [user]);

  return permissions;
}

