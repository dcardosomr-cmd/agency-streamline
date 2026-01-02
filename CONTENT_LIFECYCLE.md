# Content Lifecycle Management

This document describes the content lifecycle states and transitions implemented in the Agency Streamline platform.

## Overview

The platform manages four types of content with distinct lifecycle states:

1. **Social Media Posts** - Posts for social media platforms
2. **Campaigns** - Marketing campaigns
3. **Blog Posts** - Blog articles
4. **Messages** - Internal/external messages

## 1. Social Media Post Lifecycle

### States

1. **Draft** - Agency creates post
2. **Pending Review** - Submitted for client approval
3. **Approved** - Client approved, ready to publish
4. **Rejected** - Client rejected, needs revision
5. **Published** - Live on platform, tracking engagement

### State Transitions

```
Draft → Pending Review: Agency submits
Pending Review → Approved: Client approves
Pending Review → Rejected: Client rejects
Rejected → Draft: Agency edits
Approved → Published: Scheduled time reached or manual publish
```

### Usage Example

```typescript
import { SocialMediaPostStatus, transitionSocialMediaPost } from "@/lib/lifecycle";
import { getNextSocialMediaPostStates } from "@/lib/lifecycle-helpers";

// Check available transitions
const nextStates = getNextSocialMediaPostStates("draft");
// Returns: ["pending_review"]

// Attempt transition
const newStatus = transitionSocialMediaPost("draft", "pending_review");
// Returns: "pending_review" if valid, null otherwise
```

## 2. Campaign Lifecycle

### States

1. **Draft** - Agency creates campaign
2. **Review** - Submitted for client approval
3. **Approved** - Client approved
4. **Rejected** - Client rejected
5. **Scheduled** - Approved and scheduled for send
6. **Sent** - Campaign sent
7. **Active** - Tracking metrics
8. **Completed** - Campaign ended

### State Transitions

```
Draft → Review: Agency submits
Review → Approved: Client approves
Review → Rejected: Client rejects
Approved → Scheduled: Set send date
Approved → Sent: Send immediately
Scheduled → Sent: Scheduled time reached
Sent → Active: Tracking metrics
Active → Completed: Campaign ends
Rejected → Draft: Agency edits
```

### Usage Example

```typescript
import { CampaignStatus, transitionCampaign } from "@/lib/lifecycle";
import { getNextCampaignStates } from "@/lib/lifecycle-helpers";

// Check available transitions
const nextStates = getNextCampaignStates("approved");
// Returns: ["scheduled", "sent"]

// Attempt transition
const newStatus = transitionCampaign("approved", "scheduled");
// Returns: "scheduled" if valid, null otherwise
```

## 3. Blog Post Lifecycle

### States

1. **Draft** - Agency creates post
2. **Pending Review** - Submitted for client approval
3. **Approved** - Client approved
4. **Rejected** - Client rejected
5. **Scheduled** - Approved and scheduled for publish
6. **Published** - Live, tracking views/engagement

### State Transitions

```
Draft → Pending Review: Agency submits
Pending Review → Approved: Client approves
Pending Review → Rejected: Client rejects
Approved → Published: Publish immediately
Approved → Scheduled: Schedule publish
Scheduled → Published: Scheduled time reached
Rejected → Draft: Agency edits
```

### Usage Example

```typescript
import { BlogPostStatus, transitionBlogPost } from "@/lib/lifecycle";
import { getNextBlogPostStates } from "@/lib/lifecycle-helpers";

// Check available transitions
const nextStates = getNextBlogPostStates("approved");
// Returns: ["published", "scheduled"]

// Attempt transition
const newStatus = transitionBlogPost("approved", "scheduled");
// Returns: "scheduled" if valid, null otherwise
```

## 4. Message Lifecycle

### States

1. **Composing** - User typing message
2. **Sent** - Message sent
3. **Delivered** - Message delivered to recipient
4. **Read** - Recipient read message
5. **Failed** - Delivery failed

### State Transitions

```
Composing → Sent: User sends
Sent → Delivered: Message delivered
Delivered → Read: Recipient reads
Sent → Failed: Delivery failed
Failed → Sent: Retry
```

### Usage Example

```typescript
import { MessageStatus, transitionMessage } from "@/lib/lifecycle";
import { getNextMessageStates } from "@/lib/lifecycle-helpers";

// Check available transitions
const nextStates = getNextMessageStates("sent");
// Returns: ["delivered", "failed"]

// Attempt transition
const newStatus = transitionMessage("sent", "delivered");
// Returns: "delivered" if valid, null otherwise
```

## Implementation Files

- **Type Definitions**: `src/lib/lifecycle.ts` - Core lifecycle state definitions and transitions
- **Helper Functions**: `src/lib/lifecycle-helpers.ts` - Utility functions for state management
- **Content Types**: `src/types/content.ts` - TypeScript interfaces for content entities

## Status Configuration

Each lifecycle state has associated configuration including:
- Display label
- Color classes (for UI)
- Background color classes (for UI)
- Allowed transitions
- Available actions

These configurations are exported from `src/lib/lifecycle.ts` and can be used directly in components for consistent styling and behavior.

## Best Practices

1. **Always validate transitions** - Use the helper functions to check if a transition is valid before applying it
2. **Use type-safe status values** - Import and use the status types instead of string literals
3. **Leverage status configs** - Use the status configuration objects for consistent UI styling
4. **Handle rejected states** - Provide clear feedback and revision paths for rejected content
5. **Track transition history** - Consider logging state transitions for audit purposes

