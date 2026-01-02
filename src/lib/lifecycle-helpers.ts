/**
 * Lifecycle Helper Functions
 * Utilities for managing content lifecycle transitions
 */

import {
  SocialMediaPostStatus,
  SocialMediaPostTransitions,
  canTransitionSocialMediaPost,
  CampaignStatus,
  CampaignTransitions,
  canTransitionCampaign,
  BlogPostStatus,
  BlogPostTransitions,
  canTransitionBlogPost,
  MessageStatus,
  MessageTransitions,
  canTransitionMessage,
} from "./lifecycle";

// ============================================================================
// Social Media Post Helpers
// ============================================================================

export function getNextSocialMediaPostStates(currentStatus: SocialMediaPostStatus): SocialMediaPostStatus[] {
  return SocialMediaPostTransitions[currentStatus].allowed;
}

export function getAvailableSocialMediaPostActions(currentStatus: SocialMediaPostStatus): string[] {
  return SocialMediaPostTransitions[currentStatus].actions;
}

export function transitionSocialMediaPost(
  currentStatus: SocialMediaPostStatus,
  targetStatus: SocialMediaPostStatus
): SocialMediaPostStatus | null {
  if (canTransitionSocialMediaPost(currentStatus, targetStatus)) {
    return targetStatus;
  }
  return null;
}

// ============================================================================
// Campaign Helpers
// ============================================================================

export function getNextCampaignStates(currentStatus: CampaignStatus): CampaignStatus[] {
  return CampaignTransitions[currentStatus].allowed;
}

export function getAvailableCampaignActions(currentStatus: CampaignStatus): string[] {
  return CampaignTransitions[currentStatus].actions;
}

export function transitionCampaign(
  currentStatus: CampaignStatus,
  targetStatus: CampaignStatus
): CampaignStatus | null {
  if (canTransitionCampaign(currentStatus, targetStatus)) {
    return targetStatus;
  }
  return null;
}

// ============================================================================
// Blog Post Helpers
// ============================================================================

export function getNextBlogPostStates(currentStatus: BlogPostStatus): BlogPostStatus[] {
  return BlogPostTransitions[currentStatus].allowed;
}

export function getAvailableBlogPostActions(currentStatus: BlogPostStatus): string[] {
  return BlogPostTransitions[currentStatus].actions;
}

export function transitionBlogPost(
  currentStatus: BlogPostStatus,
  targetStatus: BlogPostStatus
): BlogPostStatus | null {
  if (canTransitionBlogPost(currentStatus, targetStatus)) {
    return targetStatus;
  }
  return null;
}

// ============================================================================
// Message Helpers
// ============================================================================

export function getNextMessageStates(currentStatus: MessageStatus): MessageStatus[] {
  return MessageTransitions[currentStatus].allowed;
}

export function getAvailableMessageActions(currentStatus: MessageStatus): string[] {
  return MessageTransitions[currentStatus].actions;
}

export function transitionMessage(
  currentStatus: MessageStatus,
  targetStatus: MessageStatus
): MessageStatus | null {
  if (canTransitionMessage(currentStatus, targetStatus)) {
    return targetStatus;
  }
  return null;
}

