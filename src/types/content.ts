/**
 * Content Type Definitions
 * These types use the lifecycle states defined in @/lib/lifecycle
 */

import {
  SocialMediaPostStatus,
  CampaignStatus,
  BlogPostStatus,
  MessageStatus,
} from "@/lib/lifecycle";

// ============================================================================
// Social Media Post
// ============================================================================

// Engagement metrics for social media posts
export interface SocialMediaEngagement {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  engagementRate: number; // percentage
  lastSynced?: string;
}

// Activity timeline item
export interface ActivityItem {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details?: string;
}

// Comment on content
export interface ContentComment {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
  editedAt?: string;
}

export interface SocialMediaPost {
  id: number;
  title?: string; // Post title/caption
  content: string;
  platforms: string[];
  scheduledTime?: string;
  scheduledDate?: string;
  publishedAt?: string;
  status: SocialMediaPostStatus;
  hasImage: boolean;
  imageUrl?: string;
  videoUrl?: string;
  client: string;
  clientId?: string;
  createdBy?: string;
  createdById?: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  timezone?: string; // e.g., "America/New_York"
  contentType?: "post" | "story" | "reel"; // Content style
  // Engagement metrics (only for published posts)
  engagement?: SocialMediaEngagement;
  // Activity timeline
  timeline?: ActivityItem[];
  // Comments
  comments?: ContentComment[];
}

// ============================================================================
// Campaign
// ============================================================================

// Campaign types
export type CampaignType = "email" | "social" | "display" | "other";

// Email campaign specific fields
export interface EmailCampaignDetails {
  subject: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  previewText?: string;
  htmlContent?: string;
  textContent?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
}

// Campaign performance metrics
export interface CampaignMetrics {
  sent?: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
  converted?: number;
  revenue?: number;
  openRate?: number; // percentage
  clickRate?: number; // CTR percentage
  conversionRate?: number; // percentage
  bounceRate?: number; // percentage
  unsubscribed?: number;
  roi?: number; // ROI percentage
  lastSynced?: string;
}

// Daily campaign metrics
export interface DailyCampaignMetrics {
  date: string;
  sent?: number;
  opened?: number;
  clicked?: number;
  revenue?: number;
}

export interface Campaign {
  id: number;
  name: string;
  description?: string;
  client: string;
  clientId?: string;
  status: CampaignStatus;
  type?: CampaignType; // Email, Social, etc.
  progress: number;
  dueDate: string;
  scheduledSendDate?: string;
  sentAt?: string;
  startedAt?: string;
  completedAt?: string;
  priority: "urgent" | "high" | "medium" | "low";
  team: string[];
  tasks: { completed: number; total: number };
  createdBy?: string;
  createdById?: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  budget?: number;
  // Email campaign specific
  emailDetails?: EmailCampaignDetails;
  // Performance metrics
  metrics?: CampaignMetrics;
  dailyMetrics?: DailyCampaignMetrics[];
  // Activity timeline
  timeline?: ActivityItem[];
  // Comments
  comments?: ContentComment[];
}

// ============================================================================
// Blog Post
// ============================================================================

// Blog post performance metrics
export interface BlogPostMetrics {
  views: number;
  averageTimeOnPage: number; // in seconds
  bounceRate: number; // percentage
  backlinks: number;
  likes: number;
  comments: number;
  shares: number;
  lastSynced?: string;
}

// SEO information
export interface SEOInfo {
  score: number; // 0-100
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  titleLength?: number;
  descriptionLength?: number;
  keywordDensity?: Record<string, number>;
}

// Traffic source
export interface TrafficSource {
  source: string; // e.g., "organic", "social", "direct", "referral"
  visits: number;
  percentage: number;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  authorId?: string;
  client: string;
  clientId?: string;
  status: BlogPostStatus;
  publishedAt?: string;
  scheduledPublishDate?: string;
  featuredImage?: string;
  tags?: string[];
  categories?: string[]; // Changed from single category to array
  createdBy?: string;
  createdById?: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  readingTime?: number; // in minutes
  // Performance metrics
  metrics?: BlogPostMetrics;
  // SEO information
  seo?: SEOInfo;
  // Traffic sources
  trafficSources?: TrafficSource[];
  // Activity timeline
  timeline?: ActivityItem[];
  // Comments
  comments?: ContentComment[];
}

// ============================================================================
// Message
// ============================================================================

// Message attachment
export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

// Conversation
export interface Conversation {
  id: string;
  clientId?: string;
  clientName: string;
  agencyUserId?: string;
  agencyUserName?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  participants: string[];
}

export interface Message {
  id: number;
  content: string;
  sender: string;
  senderId: string;
  senderRole?: "agency" | "client";
  recipient: string;
  recipientId: string;
  status: MessageStatus;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  failureReason?: string;
  conversationId: string;
  attachments?: MessageAttachment[];
  // Read receipt status
  isRead?: boolean;
  readBy?: string[];
}

// ============================================================================
// Project
// ============================================================================

export interface Project {
  id: number;
  name: string;
  description?: string;
  client: string;
  clientId?: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  progress: number; // 0-100
  budget?: number;
  spent?: number;
  dueDate: string;
  startDate?: string;
  completedAt?: string;
  priority: "urgent" | "high" | "medium" | "low";
  team: string[];
  tasks: { completed: number; total: number };
  createdBy?: string;
  createdById?: string;
  // Files/deliverables
  files?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    uploadedAt: string;
    uploadedBy: string;
  }>;
  // Activity timeline
  timeline?: ActivityItem[];
  // Comments
  comments?: ContentComment[];
}

