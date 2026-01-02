/**
 * Content Service - Mock data generators for all content types
 * Provides realistic mock data with metrics for development
 */

import {
  SocialMediaPost,
  Campaign,
  BlogPost,
  Message,
  Conversation,
  Project,
  SocialMediaEngagement,
  CampaignMetrics,
  BlogPostMetrics,
  SEOInfo,
  ActivityItem,
  ContentComment,
  DailyCampaignMetrics,
  TrafficSource,
} from "@/types/content";
import { SocialMediaPostStatus, CampaignStatus, BlogPostStatus, MessageStatus } from "@/lib/lifecycle";

// Helper to generate random number in range
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;

// Helper to generate dates
const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const hoursAgo = (hours: number) => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

// Generate engagement metrics for social media posts
function generateSocialMediaEngagement(): SocialMediaEngagement {
  const reach = random(1000, 10000);
  const likes = random(50, reach * 0.3);
  const comments = random(5, likes * 0.1);
  const shares = random(2, likes * 0.05);
  const saves = random(1, likes * 0.03);
  const totalEngagement = likes + comments + shares + saves;
  const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;

  return {
    likes,
    comments,
    shares,
    saves,
    reach,
    engagementRate: Math.round(engagementRate * 10) / 10,
    lastSynced: hoursAgo(random(1, 24)),
  };
}

// Generate campaign metrics
function generateCampaignMetrics(): CampaignMetrics {
  const sent = random(5000, 50000);
  const delivered = Math.floor(sent * randomFloat(0.95, 0.99));
  const opened = Math.floor(delivered * randomFloat(0.20, 0.40));
  const clicked = Math.floor(opened * randomFloat(0.03, 0.08));
  const converted = Math.floor(clicked * randomFloat(0.02, 0.05));
  const revenue = converted * randomFloat(20, 100);
  const unsubscribed = random(0, 10);
  const bounced = sent - delivered;

  return {
    sent,
    delivered,
    opened,
    clicked,
    converted,
    revenue: Math.round(revenue),
    openRate: Math.round((opened / delivered) * 100 * 10) / 10,
    clickRate: Math.round((clicked / opened) * 100 * 10) / 10,
    conversionRate: Math.round((converted / clicked) * 100 * 10) / 10,
    bounceRate: Math.round((bounced / sent) * 100 * 10) / 10,
    unsubscribed,
    roi: Math.round(randomFloat(150, 300) * 10) / 10,
    lastSynced: hoursAgo(random(1, 12)),
  };
}

// Generate daily campaign metrics
function generateDailyCampaignMetrics(days: number): DailyCampaignMetrics[] {
  const metrics: DailyCampaignMetrics[] = [];
  const baseSent = random(5000, 10000);
  
  for (let i = 0; i < days; i++) {
    const date = daysAgo(days - i - 1);
    const sent = i === 0 ? baseSent : random(0, 500); // First day has most sends
    const opened = Math.floor(sent * randomFloat(0.20, 0.40));
    const clicked = Math.floor(opened * randomFloat(0.03, 0.08));
    const revenue = clicked * randomFloat(20, 100);

    metrics.push({
      date,
      sent,
      opened,
      clicked,
      revenue: Math.round(revenue),
    });
  }

  return metrics;
}

// Generate blog post metrics
function generateBlogPostMetrics(): BlogPostMetrics {
  const views = random(500, 5000);
  const averageTimeOnPage = random(120, 480); // 2-8 minutes in seconds
  const bounceRate = randomFloat(20, 50);
  const backlinks = random(0, 15);
  const likes = random(10, 100);
  const comments = random(2, 30);
  const shares = random(1, 20);

  return {
    views,
    averageTimeOnPage,
    bounceRate: Math.round(bounceRate * 10) / 10,
    backlinks,
    likes,
    comments,
    shares,
    lastSynced: hoursAgo(random(1, 24)),
  };
}

// Generate SEO info
function generateSEOInfo(): SEOInfo {
  const score = random(60, 95);
  const keywords = ["marketing", "social media", "digital", "strategy", "content", "engagement"];
  const selectedKeywords = keywords.slice(0, random(3, 6));

  return {
    score,
    metaDescription: "Discover the best practices for social media marketing and engagement strategies.",
    metaKeywords: selectedKeywords,
    ogImage: "/images/og-default.jpg",
    canonicalUrl: "https://example.com/blog/post",
    titleLength: random(40, 60),
    descriptionLength: random(120, 160),
    keywordDensity: selectedKeywords.reduce((acc, kw) => {
      acc[kw] = randomFloat(1, 5);
      return acc;
    }, {} as Record<string, number>),
  };
}

// Generate traffic sources
function generateTrafficSources(): TrafficSource[] {
  const total = random(1000, 5000);
  const sources = [
    { source: "organic", percentage: 45 },
    { source: "social", percentage: 30 },
    { source: "direct", percentage: 15 },
    { source: "referral", percentage: 10 },
  ];

  return sources.map(s => ({
    source: s.source,
    visits: Math.floor(total * (s.percentage / 100)),
    percentage: s.percentage,
  }));
}

// Generate activity timeline
function generateTimeline(user: string, actions: string[]): ActivityItem[] {
  const timeline: ActivityItem[] = [];
  let daysAgoCount = 7;

  actions.forEach((action, index) => {
    timeline.push({
      id: `activity-${index}`,
      timestamp: daysAgo(daysAgoCount),
      action,
      user,
      details: action.includes("approved") ? "Content approved for publishing" : undefined,
    });
    daysAgoCount -= random(1, 2);
  });

  return timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// Generate comments
function generateComments(count: number = random(2, 5)): ContentComment[] {
  const authors = ["John Doe", "Jane Smith", "Mike Chen", "Sarah Johnson"];
  const comments: ContentComment[] = [];

  for (let i = 0; i < count; i++) {
    comments.push({
      id: `comment-${i}`,
      author: authors[random(0, authors.length - 1)],
      authorId: `user-${random(1, 10)}`,
      content: [
        "Great work on this!",
        "Looks perfect, thanks!",
        "Can we make a small adjustment?",
        "This is exactly what we needed.",
        "Let's monitor engagement closely.",
      ][random(0, 4)],
      timestamp: hoursAgo(random(1, 48)),
    });
  }

  return comments;
}

// Mock clients
const mockClients = [
  "TechCorp Industries",
  "Green Solutions Ltd",
  "Atlas Media Group",
  "Nova Ventures",
  "Urban Development Co",
];

const mockPlatforms = ["instagram", "facebook", "linkedin", "twitter", "tiktok"];

// Generate social media posts
export function generateSocialMediaPosts(count: number = 45): SocialMediaPost[] {
  const posts: SocialMediaPost[] = [];
  const statuses: SocialMediaPostStatus[] = ["draft", "pending_review", "approved", "published", "rejected"];
  const contentTypes = ["post", "story", "reel"];

  for (let i = 1; i <= count; i++) {
    const status = statuses[random(0, statuses.length - 1)];
    const platforms = [mockPlatforms[random(0, mockPlatforms.length - 1)]];
    const client = mockClients[random(0, mockClients.length - 1)];
    const createdBy = "John Doe";
    const contentType = contentTypes[random(0, contentTypes.length - 1)];

    const post: SocialMediaPost = {
      id: i,
      title: `${contentType === "reel" ? "Behind the Scenes" : contentType === "story" ? "Product Launch" : "Summer Sale Campaign"}`,
      content: `Check out our amazing ${contentType} content for ${client}!`,
      platforms,
      scheduledDate: daysAgo(random(0, 30)),
      scheduledTime: `${random(9, 17)}:00`,
      status,
      hasImage: true,
      imageUrl: `/images/post-${i}.jpg`,
      client,
      createdBy,
      timezone: "America/New_York",
      contentType: contentType as "post" | "story" | "reel",
    };

    if (status === "published") {
      post.publishedAt = daysAgo(random(0, 7));
      post.engagement = generateSocialMediaEngagement();
      post.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
        "Approved by Client Admin",
        "Published automatically",
        "Metrics synced from Instagram API",
      ]);
      post.comments = generateComments();
    } else if (status === "approved") {
      post.approvedAt = daysAgo(random(1, 3));
      post.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
        "Approved by Client Admin",
      ]);
    } else if (status === "pending_review") {
      post.submittedAt = daysAgo(random(0, 2));
      post.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
      ]);
    } else if (status === "rejected") {
      post.rejectedAt = daysAgo(random(1, 3));
      post.rejectionReason = "Please adjust the tone to be more professional.";
      post.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
        "Rejected by Client Admin",
      ]);
    } else {
      post.timeline = generateTimeline(createdBy, ["Created"]);
    }

    posts.push(post);
  }

  return posts;
}

// Generate campaigns
export function generateCampaigns(count: number = 28): Campaign[] {
  const campaigns: Campaign[] = [];
  const statuses: CampaignStatus[] = ["draft", "review", "approved", "scheduled", "sent", "active", "completed"];
  const types: Array<"email" | "social" | "display"> = ["email", "social", "display"];

  for (let i = 1; i <= count; i++) {
    const status = statuses[random(0, statuses.length - 1)];
    const type = types[random(0, types.length - 1)] as "email" | "social" | "display";
    const client = mockClients[random(0, mockClients.length - 1)];
    const createdBy = "John Doe";

    const campaign: Campaign = {
      id: i,
      name: type === "email" ? "Summer Newsletter" : type === "social" ? "Product Launch Campaign" : "Display Ad Campaign",
      description: `${type} campaign for ${client}`,
      client,
      status,
      type,
      progress: status === "completed" ? 100 : random(0, 90),
      dueDate: daysAgo(random(-30, 30)),
      priority: ["urgent", "high", "medium", "low"][random(0, 3)] as any,
      team: ["John Doe", "Alice Smith"],
      tasks: {
        completed: random(5, 15),
        total: 20,
      },
      createdBy,
      budget: random(10000, 50000),
    };

    if (type === "email") {
      campaign.emailDetails = {
        subject: "Summer Sale - Up to 50% Off!",
        fromEmail: "marketing@example.com",
        fromName: "Marketing Team",
        replyTo: "support@example.com",
        previewText: "Don't miss out on our biggest sale of the year!",
      };
    }

    if (status === "sent" || status === "active" || status === "completed") {
      campaign.sentAt = daysAgo(random(0, 10));
      campaign.metrics = generateCampaignMetrics();
      campaign.dailyMetrics = generateDailyCampaignMetrics(7);
      campaign.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
        "Approved by Client Admin",
        "Scheduled for send",
        "Campaign sent",
      ]);
      campaign.comments = generateComments();
    } else if (status === "approved" || status === "scheduled") {
      campaign.approvedAt = daysAgo(random(1, 3));
      campaign.scheduledSendDate = daysAgo(random(-7, 7));
      campaign.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
        "Approved by Client Admin",
      ]);
    } else if (status === "review") {
      campaign.submittedAt = daysAgo(random(0, 2));
      campaign.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
      ]);
    }

    campaigns.push(campaign);
  }

  return campaigns;
}

// Generate blog posts
export function generateBlogPosts(count: number = 35): BlogPost[] {
  const posts: BlogPost[] = [];
  const statuses: BlogPostStatus[] = ["draft", "pending_review", "approved", "published"];
  const titles = [
    "10 Tips for Better Social Media Marketing",
    "How to Optimize Your Email Campaigns",
    "The Future of Digital Marketing",
    "Content Strategy Best Practices",
    "Building Your Brand Online",
  ];
  const tags = ["marketing", "social-media", "tips", "best-practices", "digital", "strategy"];
  const categories = ["Marketing", "Best Practices", "Social Media", "Content Strategy"];

  for (let i = 1; i <= count; i++) {
    const status = statuses[random(0, statuses.length - 1)];
    const client = mockClients[random(0, mockClients.length - 1)];
    const createdBy = "John Doe";
    const title = titles[random(0, titles.length - 1)];

    const post: BlogPost = {
      id: i,
      title,
      content: `Full blog post content for ${title}...`,
      excerpt: `Discover the best practices for ${title.toLowerCase()}.`,
      author: createdBy,
      client,
      status,
      featuredImage: `/images/blog-${i}.jpg`,
      tags: tags.slice(0, random(2, 4)),
      categories: [categories[random(0, categories.length - 1)]],
      readingTime: random(3, 10),
    };

    if (status === "published") {
      post.publishedAt = daysAgo(random(0, 30));
      post.metrics = generateBlogPostMetrics();
      post.seo = generateSEOInfo();
      post.trafficSources = generateTrafficSources();
      post.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
        "Approved by Client Admin",
        "Published",
      ]);
      post.comments = generateComments();
    } else if (status === "approved") {
      post.approvedAt = daysAgo(random(1, 3));
      post.seo = generateSEOInfo();
      post.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
        "Approved by Client Admin",
      ]);
    } else if (status === "pending_review") {
      post.submittedAt = daysAgo(random(0, 2));
      post.seo = generateSEOInfo();
      post.timeline = generateTimeline(createdBy, [
        "Created",
        "Submitted for review",
      ]);
    } else {
      post.timeline = generateTimeline(createdBy, ["Created"]);
    }

    posts.push(post);
  }

  return posts;
}

// Generate messages/conversations
export function generateConversations(count: number = 5): Conversation[] {
  const conversations: Conversation[] = [];

  for (let i = 1; i <= count; i++) {
    const client = mockClients[random(0, mockClients.length - 1)];
    conversations.push({
      id: `conv-${i}`,
      clientName: client,
      agencyUserName: "John Doe",
      lastMessageAt: hoursAgo(random(1, 48)),
      unreadCount: random(0, 3),
      participants: ["agency-user-1", `client-${i}`],
    });
  }

  return conversations;
}

export function generateMessages(conversationId: string, count: number = random(5, 15)): Message[] {
  const messages: Message[] = [];
  const senders = [
    { name: "John Doe", id: "agency-user-1", role: "agency" as const },
    { name: "Jane Smith", id: "client-user-1", role: "client" as const },
  ];

  for (let i = 0; i < count; i++) {
    const sender = senders[i % 2];
    const recipient = senders[(i + 1) % 2];
    const sentAt = hoursAgo(count - i);
    const deliveredAt = sentAt;
    const readAt = i % 2 === 0 ? undefined : hoursAgo(count - i - 1);

    messages.push({
      id: i + 1,
      content: [
        "Here's the updated campaign proposal...",
        "Thanks! We'll review and get back to you.",
        "Great! Let me know if you have any questions.",
        "The content looks perfect, approved!",
        "Can we make a small adjustment?",
      ][i % 5],
      sender: sender.name,
      senderId: sender.id,
      senderRole: sender.role,
      recipient: recipient.name,
      recipientId: recipient.id,
      status: readAt ? "read" : "delivered",
      sentAt,
      deliveredAt,
      readAt,
      conversationId,
      isRead: !!readAt,
      attachments: i === 0 ? [{
        id: "file-1",
        name: "campaign-proposal.pdf",
        url: "/files/campaign-proposal.pdf",
        type: "application/pdf",
        size: 2400000,
        uploadedAt: sentAt,
      }] : undefined,
    });
  }

  return messages;
}

// Generate projects
export function generateProjects(count: number = 10): Project[] {
  const projects: Project[] = [];
  const statuses = ["planning", "in-progress", "review", "completed", "on-hold"];

  for (let i = 1; i <= count; i++) {
    const status = statuses[random(0, statuses.length - 1)] as Project["status"];
    const client = mockClients[random(0, mockClients.length - 1)];

    projects.push({
      id: i,
      name: ["Website Redesign", "Brand Identity Package", "Marketing Campaign", "SEO Optimization"][random(0, 3)],
      description: `Project description for ${client}`,
      client,
      status,
      progress: status === "completed" ? 100 : random(10, 90),
      budget: random(20000, 100000),
      spent: status === "completed" ? random(18000, 95000) : undefined,
      dueDate: daysAgo(random(-30, 30)),
      startDate: daysAgo(random(30, 60)),
      priority: ["urgent", "high", "medium", "low"][random(0, 3)] as any,
      team: ["John Doe", "Alice Smith"],
      tasks: {
        completed: random(5, 18),
        total: 20,
      },
      createdBy: "John Doe",
      files: random(0, 1) === 1 ? [{
        id: "file-1",
        name: "project-deliverable.pdf",
        url: "/files/project-deliverable.pdf",
        type: "application/pdf",
        size: 1500000,
        uploadedAt: daysAgo(random(1, 7)),
        uploadedBy: "John Doe",
      }] : undefined,
      timeline: generateTimeline("John Doe", [
        "Project created",
        "Kickoff meeting completed",
        "First milestone reached",
      ]),
      comments: generateComments(random(1, 3)),
    });
  }

  return projects;
}

// Export all mock data generators
export const contentService = {
  getSocialMediaPosts: (filters?: { client?: string; platform?: string; status?: SocialMediaPostStatus }) => {
    let posts = generateSocialMediaPosts();
    if (filters?.client) {
      posts = posts.filter(p => p.client === filters.client);
    }
    if (filters?.platform) {
      posts = posts.filter(p => p.platforms.includes(filters.platform!));
    }
    if (filters?.status) {
      posts = posts.filter(p => p.status === filters.status);
    }
    return posts;
  },

  getCampaigns: (filters?: { client?: string; type?: string; status?: CampaignStatus }) => {
    let campaigns = generateCampaigns();
    if (filters?.client) {
      campaigns = campaigns.filter(c => c.client === filters.client);
    }
    if (filters?.type) {
      campaigns = campaigns.filter(c => c.type === filters.type);
    }
    if (filters?.status) {
      campaigns = campaigns.filter(c => c.status === filters.status);
    }
    return campaigns;
  },

  getBlogPosts: (filters?: { client?: string; status?: BlogPostStatus }) => {
    let posts = generateBlogPosts();
    if (filters?.client) {
      posts = posts.filter(p => p.client === filters.client);
    }
    if (filters?.status) {
      posts = posts.filter(p => p.status === filters.status);
    }
    return posts;
  },

  getConversations: () => generateConversations(),

  getMessages: (conversationId: string) => generateMessages(conversationId),

  getProjects: (filters?: { client?: string; status?: string }) => {
    let projects = generateProjects();
    if (filters?.client) {
      projects = projects.filter(p => p.client === filters.client);
    }
    if (filters?.status) {
      projects = projects.filter(p => p.status === filters.status);
    }
    return projects;
  },
};

