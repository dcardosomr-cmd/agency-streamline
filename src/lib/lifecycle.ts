/**
 * Content Lifecycle Management
 * Defines states and transitions for different content types
 */

// ============================================================================
// Social Media Post Lifecycle
// ============================================================================

export type SocialMediaPostStatus = 
  | "draft"           // Agency creates post
  | "pending_review"  // Submitted for client approval
  | "approved"        // Client approved, ready to publish
  | "rejected"        // Client rejected, needs revision
  | "published";      // Live on platform, tracking engagement

export const SocialMediaPostStatusLabels: Record<SocialMediaPostStatus, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  published: "Published",
};

export const SocialMediaPostStatusConfig: Record<
  SocialMediaPostStatus,
  { label: string; color: string; bg: string; icon?: string }
> = {
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-muted" },
  pending_review: { label: "Pending Review", color: "text-warning", bg: "bg-warning/10" },
  approved: { label: "Approved", color: "text-success", bg: "bg-success/10" },
  rejected: { label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
  published: { label: "Published", color: "text-primary", bg: "bg-primary/10" },
};

export type SocialMediaPostTransition = 
  | "submit_for_review"    // Draft → Pending Review: Agency submits
  | "approve"               // Pending Review → Approved: Client approves
  | "reject"                // Pending Review → Rejected: Client rejects
  | "edit_after_rejection"  // Rejected → Draft: Agency edits
  | "publish";              // Approved → Published: Scheduled time reached or manual publish

export const SocialMediaPostTransitions: Record<
  SocialMediaPostStatus,
  { allowed: SocialMediaPostStatus[]; actions: SocialMediaPostTransition[] }
> = {
  draft: {
    allowed: ["pending_review"],
    actions: ["submit_for_review"],
  },
  pending_review: {
    allowed: ["approved", "rejected"],
    actions: ["approve", "reject"],
  },
  approved: {
    allowed: ["published"],
    actions: ["publish"],
  },
  rejected: {
    allowed: ["draft"],
    actions: ["edit_after_rejection"],
  },
  published: {
    allowed: [],
    actions: [],
  },
};

export function canTransitionSocialMediaPost(
  currentStatus: SocialMediaPostStatus,
  targetStatus: SocialMediaPostStatus
): boolean {
  return SocialMediaPostTransitions[currentStatus].allowed.includes(targetStatus);
}

// ============================================================================
// Campaign Lifecycle
// ============================================================================

export type CampaignStatus = 
  | "draft"      // Agency creates campaign
  | "review"     // Submitted for client approval
  | "approved"   // Client approved
  | "rejected"   // Client rejected
  | "scheduled"  // Approved and scheduled for send
  | "sent"       // Campaign sent
  | "active"     // Tracking metrics
  | "completed"; // Campaign ended

export const CampaignStatusLabels: Record<CampaignStatus, string> = {
  draft: "Draft",
  review: "Review",
  approved: "Approved",
  rejected: "Rejected",
  scheduled: "Scheduled",
  sent: "Sent",
  active: "Active",
  completed: "Completed",
};

export const CampaignStatusConfig: Record<
  CampaignStatus,
  { label: string; color: string; bg: string; icon?: string }
> = {
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-muted" },
  review: { label: "Review", color: "text-warning", bg: "bg-warning/10" },
  approved: { label: "Approved", color: "text-success", bg: "bg-success/10" },
  rejected: { label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
  scheduled: { label: "Scheduled", color: "text-primary", bg: "bg-primary/10" },
  sent: { label: "Sent", color: "text-blue-500", bg: "bg-blue-500/10" },
  active: { label: "Active", color: "text-primary", bg: "bg-primary/10" },
  completed: { label: "Completed", color: "text-success", bg: "bg-success/10" },
};

export type CampaignTransition = 
  | "submit_for_review"   // Draft → Review: Agency submits
  | "approve"              // Review → Approved: Client approves
  | "reject"               // Review → Rejected: Client rejects
  | "schedule"             // Approved → Scheduled: Set send date
  | "send_immediately"     // Approved → Sent: Send immediately
  | "send_scheduled"       // Scheduled → Sent: Scheduled time reached
  | "activate"             // Sent → Active: Tracking metrics
  | "complete"             // Active → Completed: Campaign ends
  | "edit_after_rejection"; // Rejected → Draft: Agency edits

export const CampaignTransitions: Record<
  CampaignStatus,
  { allowed: CampaignStatus[]; actions: CampaignTransition[] }
> = {
  draft: {
    allowed: ["review"],
    actions: ["submit_for_review"],
  },
  review: {
    allowed: ["approved", "rejected"],
    actions: ["approve", "reject"],
  },
  approved: {
    allowed: ["scheduled", "sent"],
    actions: ["schedule", "send_immediately"],
  },
  rejected: {
    allowed: ["draft"],
    actions: ["edit_after_rejection"],
  },
  scheduled: {
    allowed: ["sent"],
    actions: ["send_scheduled"],
  },
  sent: {
    allowed: ["active"],
    actions: ["activate"],
  },
  active: {
    allowed: ["completed"],
    actions: ["complete"],
  },
  completed: {
    allowed: [],
    actions: [],
  },
};

export function canTransitionCampaign(
  currentStatus: CampaignStatus,
  targetStatus: CampaignStatus
): boolean {
  return CampaignTransitions[currentStatus].allowed.includes(targetStatus);
}

// ============================================================================
// Blog Post Lifecycle
// ============================================================================

export type BlogPostStatus = 
  | "draft"          // Agency creates post
  | "pending_review" // Submitted for client approval
  | "approved"       // Client approved
  | "rejected"       // Client rejected
  | "scheduled"      // Approved and scheduled for publish
  | "published";     // Live, tracking views/engagement

export const BlogPostStatusLabels: Record<BlogPostStatus, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  scheduled: "Scheduled",
  published: "Published",
};

export const BlogPostStatusConfig: Record<
  BlogPostStatus,
  { label: string; color: string; bg: string; icon?: string }
> = {
  draft: { label: "Draft", color: "text-muted-foreground", bg: "bg-muted" },
  pending_review: { label: "Pending Review", color: "text-warning", bg: "bg-warning/10" },
  approved: { label: "Approved", color: "text-success", bg: "bg-success/10" },
  rejected: { label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
  scheduled: { label: "Scheduled", color: "text-primary", bg: "bg-primary/10" },
  published: { label: "Published", color: "text-primary", bg: "bg-primary/10" },
};

export type BlogPostTransition = 
  | "submit_for_review"    // Draft → Pending Review: Agency submits
  | "approve"               // Pending Review → Approved: Client approves
  | "reject"                // Pending Review → Rejected: Client rejects
  | "publish_immediately"   // Approved → Published: Publish immediately
  | "schedule_publish"      // Approved → Scheduled: Schedule publish
  | "publish_scheduled"     // Scheduled → Published: Scheduled time reached
  | "edit_after_rejection"; // Rejected → Draft: Agency edits

export const BlogPostTransitions: Record<
  BlogPostStatus,
  { allowed: BlogPostStatus[]; actions: BlogPostTransition[] }
> = {
  draft: {
    allowed: ["pending_review"],
    actions: ["submit_for_review"],
  },
  pending_review: {
    allowed: ["approved", "rejected"],
    actions: ["approve", "reject"],
  },
  approved: {
    allowed: ["published", "scheduled"],
    actions: ["publish_immediately", "schedule_publish"],
  },
  rejected: {
    allowed: ["draft"],
    actions: ["edit_after_rejection"],
  },
  scheduled: {
    allowed: ["published"],
    actions: ["publish_scheduled"],
  },
  published: {
    allowed: [],
    actions: [],
  },
};

export function canTransitionBlogPost(
  currentStatus: BlogPostStatus,
  targetStatus: BlogPostStatus
): boolean {
  return BlogPostTransitions[currentStatus].allowed.includes(targetStatus);
}

// ============================================================================
// Message Lifecycle
// ============================================================================

export type MessageStatus = 
  | "composing"  // User typing message
  | "sent"       // Message sent
  | "delivered"  // Message delivered to recipient
  | "read"       // Recipient read message
  | "failed";    // Delivery failed

export const MessageStatusLabels: Record<MessageStatus, string> = {
  composing: "Composing",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Failed",
};

export const MessageStatusConfig: Record<
  MessageStatus,
  { label: string; color: string; bg: string; icon?: string }
> = {
  composing: { label: "Composing", color: "text-muted-foreground", bg: "bg-muted" },
  sent: { label: "Sent", color: "text-primary", bg: "bg-primary/10" },
  delivered: { label: "Delivered", color: "text-primary", bg: "bg-primary/10" },
  read: { label: "Read", color: "text-success", bg: "bg-success/10" },
  failed: { label: "Failed", color: "text-destructive", bg: "bg-destructive/10" },
};

export type MessageTransition = 
  | "send"      // Composing → Sent: User sends
  | "deliver"   // Sent → Delivered: Message delivered
  | "read"      // Delivered → Read: Recipient reads
  | "fail"      // Sent → Failed: Delivery failed
  | "retry";    // Failed → Sent: Retry

export const MessageTransitions: Record<
  MessageStatus,
  { allowed: MessageStatus[]; actions: MessageTransition[] }
> = {
  composing: {
    allowed: ["sent"],
    actions: ["send"],
  },
  sent: {
    allowed: ["delivered", "failed"],
    actions: ["deliver", "fail"],
  },
  delivered: {
    allowed: ["read"],
    actions: ["read"],
  },
  read: {
    allowed: [],
    actions: [],
  },
  failed: {
    allowed: ["sent"],
    actions: ["retry"],
  },
};

export function canTransitionMessage(
  currentStatus: MessageStatus,
  targetStatus: MessageStatus
): boolean {
  return MessageTransitions[currentStatus].allowed.includes(targetStatus);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Generic state transition helper
 */
export function getNextStates<T extends string>(
  transitions: Record<T, { allowed: T[]; actions: string[] }>,
  currentStatus: T
): T[] {
  return transitions[currentStatus]?.allowed || [];
}

/**
 * Generic action helper
 */
export function getAvailableActions<T extends string>(
  transitions: Record<T, { allowed: T[]; actions: string[] }>,
  currentStatus: T
): string[] {
  return transitions[currentStatus]?.actions || [];
}

