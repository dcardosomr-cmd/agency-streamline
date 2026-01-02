/**
 * User Roles
 * 
 * Agency Roles:
 * - AGENCY_ADMIN: Full system access, manage all clients and users
 * - AGENCY_STAFF: Create and manage content for all clients, limited user management
 * 
 * Client Roles:
 * - CLIENT_ADMIN: Full access to their company's portal, approve/reject content
 * - CLIENT_USER: Read-only access to most features, no approval permissions
 */
export enum UserRole {
  AGENCY_ADMIN = "AGENCY_ADMIN",
  AGENCY_STAFF = "AGENCY_STAFF",
  CLIENT_ADMIN = "CLIENT_ADMIN",
  CLIENT_USER = "CLIENT_USER",
}

/**
 * Permission Actions
 */
export enum Permission {
  // Content Management
  CREATE_CONTENT = "CREATE_CONTENT",
  EDIT_CONTENT = "EDIT_CONTENT",
  DELETE_CONTENT = "DELETE_CONTENT",
  
  // Approval Actions
  APPROVE_CONTENT = "APPROVE_CONTENT",
  REJECT_CONTENT = "REJECT_CONTENT",
  
  // View Permissions
  VIEW_ALL_CLIENTS = "VIEW_ALL_CLIENTS",
  VIEW_OWN_CLIENT = "VIEW_OWN_CLIENT",
  VIEW_ANALYTICS = "VIEW_ANALYTICS",
  
  // User Management
  MANAGE_USERS = "MANAGE_USERS",
  
  // System
  SYSTEM_CONFIG = "SYSTEM_CONFIG",
  BILLING_MANAGEMENT = "BILLING_MANAGEMENT",
}

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clientId?: string; // For client users, the ID of their client company
  initials?: string;
  hasCompletedOnboarding?: boolean;
}

/**
 * Permission Matrix
 * Maps each role to its allowed permissions
 */
export const PERMISSION_MATRIX: Record<UserRole, Permission[]> = {
  [UserRole.AGENCY_ADMIN]: [
    Permission.CREATE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.APPROVE_CONTENT,
    Permission.REJECT_CONTENT,
    Permission.VIEW_ALL_CLIENTS,
    Permission.VIEW_OWN_CLIENT,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_USERS,
    Permission.SYSTEM_CONFIG,
    Permission.BILLING_MANAGEMENT,
  ],
  [UserRole.AGENCY_STAFF]: [
    Permission.CREATE_CONTENT,
    Permission.EDIT_CONTENT,
    Permission.DELETE_CONTENT, // Only own content, before approval
    Permission.VIEW_ALL_CLIENTS,
    Permission.VIEW_OWN_CLIENT,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_USERS, // Limited user management
  ],
  [UserRole.CLIENT_ADMIN]: [
    Permission.APPROVE_CONTENT,
    Permission.REJECT_CONTENT,
    Permission.VIEW_OWN_CLIENT,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_USERS, // Only client users
    Permission.BILLING_MANAGEMENT, // Access billing information
  ],
  [UserRole.CLIENT_USER]: [
    Permission.VIEW_OWN_CLIENT,
    Permission.VIEW_ANALYTICS,
  ],
};

/**
 * Role display names
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.AGENCY_ADMIN]: "Agency Admin",
  [UserRole.AGENCY_STAFF]: "Agency Staff",
  [UserRole.CLIENT_ADMIN]: "Client Admin",
  [UserRole.CLIENT_USER]: "Client User",
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return PERMISSION_MATRIX[role]?.includes(permission) ?? false;
}

/**
 * Check if a role can perform an action on content
 * Special handling for AGENCY_STAFF who can only edit/delete their own content before approval
 */
export function canEditContent(
  role: UserRole,
  contentAuthorId?: string,
  currentUserId?: string,
  contentStatus?: string
): boolean {
  if (role === UserRole.AGENCY_ADMIN) {
    return true;
  }
  
  if (role === UserRole.AGENCY_STAFF) {
    // Can edit own content, and only before approval
    if (contentAuthorId && currentUserId && contentAuthorId === currentUserId) {
      // Can edit/delete only if status is draft or rejected (before approval)
      return contentStatus === "draft" || contentStatus === "rejected";
    }
    return false;
  }
  
  return false;
}

/**
 * Check if a role can delete content
 * Similar to edit, but with additional restrictions
 */
export function canDeleteContent(
  role: UserRole,
  contentAuthorId?: string,
  currentUserId?: string,
  contentStatus?: string
): boolean {
  if (role === UserRole.AGENCY_ADMIN) {
    return true;
  }
  
  if (role === UserRole.AGENCY_STAFF) {
    // Can delete own content, and only before approval
    if (contentAuthorId && currentUserId && contentAuthorId === currentUserId) {
      return contentStatus === "draft" || contentStatus === "rejected";
    }
    return false;
  }
  
  return false;
}

/**
 * Check if a role can approve content
 */
export function canApproveContent(role: UserRole): boolean {
  return role === UserRole.AGENCY_ADMIN || role === UserRole.CLIENT_ADMIN;
}

/**
 * Check if a role can reject content
 */
export function canRejectContent(role: UserRole): boolean {
  return role === UserRole.AGENCY_ADMIN || role === UserRole.CLIENT_ADMIN;
}

/**
 * Check if a role can view all clients
 */
export function canViewAllClients(role: UserRole): boolean {
  return role === UserRole.AGENCY_ADMIN || role === UserRole.AGENCY_STAFF;
}

/**
 * Check if a role can manage users
 */
export function canManageUsers(role: UserRole, targetClientId?: string, currentUserClientId?: string): boolean {
  if (role === UserRole.AGENCY_ADMIN) {
    return true; // Can manage all users
  }
  
  if (role === UserRole.CLIENT_ADMIN) {
    // Can only manage users from their own client
    return targetClientId === currentUserClientId;
  }
  
  return false;
}

