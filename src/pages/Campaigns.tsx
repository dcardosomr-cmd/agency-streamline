import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ContentCalendar } from "@/components/campaigns/ContentCalendar";
import { PostQueue } from "@/components/campaigns/PostQueue";
import { PlatformStats } from "@/components/campaigns/PlatformStats";
import { CreatePostModal } from "@/components/campaigns/CreatePostModal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Plus, 
  Calendar,
  ListTodo,
  BarChart3,
  Filter,
  X,
  List,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Send,
  Download,
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Users,
  TrendingUp,
  Clock,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SocialMediaPostStatus, SocialMediaPostStatusConfig } from "@/lib/lifecycle";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/auth";
import { PermissionGuard } from "@/components/PermissionGuard";
import { StatusTabs } from "@/components/content/StatusTabs";
import { BulkActionsToolbar } from "@/components/content/BulkActionsToolbar";
import { EngagementMetrics } from "@/components/content/EngagementMetrics";
import { SocialMediaPost } from "@/types/content";
import { contentService } from "@/services/contentService";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/components/ui/sonner";

type ViewType = "calendar" | "queue" | "list" | "analytics";

const platforms = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "twitter", label: "X (Twitter)" },
  { id: "tiktok", label: "TikTok" },
];

const clients = [
  "TechCorp Industries",
  "Green Solutions Ltd",
  "Atlas Media Group",
  "Nova Ventures",
  "Urban Development Co",
];

const Campaigns = () => {
  const [view, setView] = useState<ViewType>("calendar");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatuses, setFilterStatuses] = useState<Set<SocialMediaPostStatus>>(new Set());
  const [filterPlatforms, setFilterPlatforms] = useState<Set<string>>(new Set());
  const [filterClients, setFilterClients] = useState<Set<string>>(new Set());
  const { can } = usePermissions();

  const navigate = useNavigate();
  const [selectedPosts, setSelectedPosts] = useState<Set<number>>(new Set());
  const [activeStatusTab, setActiveStatusTab] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Fetch posts from content service
  const allPosts = useMemo(() => {
    return contentService.getSocialMediaPosts();
  }, []);

  // Filter posts based on active status tab
  const filteredPosts = useMemo(() => {
    let filtered = allPosts;
    
    if (activeStatusTab !== "all") {
      filtered = filtered.filter(p => p.status === activeStatusTab);
    }
    
    if (filterStatuses.size > 0) {
      filtered = filtered.filter(p => filterStatuses.has(p.status));
    }
    
    if (filterPlatforms.size > 0) {
      filtered = filtered.filter(p => 
        p.platforms.some(platform => filterPlatforms.has(platform))
      );
    }
    
    if (filterClients.size > 0) {
      filtered = filtered.filter(p => filterClients.has(p.client));
    }
    
    return filtered;
  }, [allPosts, activeStatusTab, filterStatuses, filterPlatforms, filterClients]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(start, start + postsPerPage);
  }, [filteredPosts, currentPage]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allPosts.length,
      draft: 0,
      pending_review: 0,
      approved: 0,
      published: 0,
      rejected: 0,
    };
    
    allPosts.forEach(post => {
      if (post.status in counts) {
        counts[post.status]++;
      }
    });
    
    return counts;
  }, [allPosts]);

  const statusTabs = [
    { id: "all", label: "All", count: statusCounts.all },
    { id: "draft", label: "Draft", count: statusCounts.draft },
    { id: "pending_review", label: "Pending", count: statusCounts.pending_review },
    { id: "approved", label: "Approved", count: statusCounts.approved },
    { id: "published", label: "Published", count: statusCounts.published },
    { id: "rejected", label: "Rejected", count: statusCounts.rejected },
  ];

  const platformConfig = {
    instagram: { icon: "📷", color: "text-pink-500", bg: "bg-pink-500/10", label: "Instagram" },
    facebook: { icon: "📘", color: "text-blue-500", bg: "bg-blue-500/10", label: "Facebook" },
    linkedin: { icon: "💼", color: "text-blue-600", bg: "bg-blue-600/10", label: "LinkedIn" },
    twitter: { icon: "🐦", color: "text-sky-400", bg: "bg-sky-400/10", label: "X (Twitter)" },
    tiktok: { icon: "🎵", color: "text-foreground", bg: "bg-foreground/10", label: "TikTok" },
  };

  const togglePostSelection = (postId: number) => {
    const newSet = new Set(selectedPosts);
    if (newSet.has(postId)) {
      newSet.delete(postId);
    } else {
      newSet.add(postId);
    }
    setSelectedPosts(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === paginatedPosts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(paginatedPosts.map(p => p.id)));
    }
  };

  const handleBulkApprove = () => {
    toast.success(`Approved ${selectedPosts.size} post(s)`);
    setSelectedPosts(new Set());
  };

  const handleBulkReject = () => {
    toast.success(`Rejected ${selectedPosts.size} post(s)`);
    setSelectedPosts(new Set());
  };

  const handleBulkDelete = () => {
    toast.success(`Deleted ${selectedPosts.size} post(s)`);
    setSelectedPosts(new Set());
  };

  const handleBulkExport = () => {
    toast.success(`Exporting ${selectedPosts.size} post(s)`);
  };

  const views = [
    { id: "calendar" as const, label: "Calendar", icon: Calendar },
    { id: "list" as const, label: "List View", icon: List },
    { id: "queue" as const, label: "Queue", icon: ListTodo },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  ];

  const activeFilterCount = filterStatuses.size + filterPlatforms.size + filterClients.size;

  const toggleStatus = (status: SocialMediaPostStatus) => {
    const newSet = new Set(filterStatuses);
    if (newSet.has(status)) {
      newSet.delete(status);
    } else {
      newSet.add(status);
    }
    setFilterStatuses(newSet);
  };

  const togglePlatform = (platform: string) => {
    const newSet = new Set(filterPlatforms);
    if (newSet.has(platform)) {
      newSet.delete(platform);
    } else {
      newSet.add(platform);
    }
    setFilterPlatforms(newSet);
  };

  const toggleClient = (client: string) => {
    const newSet = new Set(filterClients);
    if (newSet.has(client)) {
      newSet.delete(client);
    } else {
      newSet.add(client);
    }
    setFilterClients(newSet);
  };

  const clearAllFilters = () => {
    setFilterStatuses(new Set());
    setFilterPlatforms(new Set());
    setFilterClients(new Set());
  };


  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Content Planner</h1>
            <p className="text-muted-foreground mt-1">Schedule and manage your social media content</p>
          </div>
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Filters</h4>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Clear all
                      </button>
                    )}
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <div className="space-y-2">
                      {(["draft", "pending_review", "approved", "rejected", "published"] as SocialMediaPostStatus[]).map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={filterStatuses.has(status)}
                            onCheckedChange={() => toggleStatus(status)}
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="text-sm text-foreground cursor-pointer flex-1 flex items-center gap-2"
                          >
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full",
                                SocialMediaPostStatusConfig[status].bg
                              )}
                            />
                            {SocialMediaPostStatusConfig[status].label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platform Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Platform</label>
                    <div className="space-y-2">
                      {platforms.map((platform) => (
                        <div key={platform.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`platform-${platform.id}`}
                            checked={filterPlatforms.has(platform.id)}
                            onCheckedChange={() => togglePlatform(platform.id)}
                          />
                          <label
                            htmlFor={`platform-${platform.id}`}
                            className="text-sm text-foreground cursor-pointer"
                          >
                            {platform.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Client</label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {clients.map((client) => (
                        <div key={client} className="flex items-center space-x-2">
                          <Checkbox
                            id={`client-${client}`}
                            checked={filterClients.has(client)}
                            onCheckedChange={() => toggleClient(client)}
                          />
                          <label
                            htmlFor={`client-${client}`}
                            className="text-sm text-foreground cursor-pointer"
                          >
                            {client}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <PermissionGuard permission={Permission.CREATE_CONTENT}>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="w-4 h-4" />
                Create Post
              </Button>
            </PermissionGuard>
          </div>
        </motion.div>

        {/* View Tabs */}
        <div className="flex items-center gap-2">
          {views.map((v) => {
            const Icon = v.icon;
            const isActive = view === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => {
                  console.log('Button clicked, setting view to:', v.id);
                  setView(v.id);
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {v.label}
              </button>
            );
          })}
        </div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <PlatformStats />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {view === "calendar" && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <ContentCalendar onCreatePost={() => setIsCreateModalOpen(true)} />
              </div>
              <div className="xl:col-span-1">
                <PostQueue />
              </div>
            </div>
          )}

          {view === "list" && (
            <div className="space-y-4">
              {/* Status Tabs */}
              <StatusTabs
                tabs={statusTabs}
                activeTab={activeStatusTab}
                onTabChange={setActiveStatusTab}
              />

              {/* Bulk Actions Toolbar */}
              <BulkActionsToolbar
                selectedCount={selectedPosts.size}
                onSelectAll={toggleSelectAll}
                onApprove={can(Permission.APPROVE_CONTENT) ? handleBulkApprove : undefined}
                onReject={can(Permission.APPROVE_CONTENT) ? handleBulkReject : undefined}
                onDelete={can(Permission.CREATE_CONTENT) ? handleBulkDelete : undefined}
                onExport={handleBulkExport}
              />

              {/* Posts List */}
              <div className="space-y-2">
                {paginatedPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-xl p-4 hover:border-primary/30 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      {/* Checkbox */}
                      <div className="flex items-center gap-3 shrink-0">
                        <Checkbox
                          checked={selectedPosts.has(post.id)}
                          onCheckedChange={() => togglePostSelection(post.id)}
                        />
                        {post.hasImage && (
                          <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden">
                            <img
                              src={post.imageUrl || "/placeholder.svg"}
                              alt="Post preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              {post.platforms.map((platform) => {
                                const config = platformConfig[platform as keyof typeof platformConfig];
                                return (
                                  <span
                                    key={platform}
                                    className={cn(
                                      "px-2 py-0.5 rounded text-xs font-medium",
                                      config.bg,
                                      config.color
                                    )}
                                  >
                                    {config.label}
                                  </span>
                                );
                              })}
                              {post.timezone && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  {post.timezone.split("/")[1]}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-foreground line-clamp-2 mb-2">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{post.client}</span>
                              {post.scheduledDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {post.scheduledDate} {post.scheduledTime}
                                </span>
                              )}
                              {post.createdBy && (
                                <span>Created by {post.createdBy}</span>
                              )}
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2 shrink-0">
                            <span
                              className={cn(
                                "px-2 py-1 rounded text-xs font-medium",
                                SocialMediaPostStatusConfig[post.status].bg,
                                SocialMediaPostStatusConfig[post.status].color
                              )}
                            >
                              {SocialMediaPostStatusConfig[post.status].label}
                            </span>
                          </div>
                        </div>

                        {/* Engagement Metrics (if published) */}
                        {post.status === "published" && post.engagement && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <EngagementMetrics engagement={post.engagement} compact />
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/campaigns/post/${post.id}`)}
                            className="gap-1.5"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Button>
                          {can(Permission.CREATE_CONTENT) && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Button>
                              {post.status === "draft" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-1.5"
                                >
                                  <Send className="w-4 h-4" />
                                  Submit for Review
                                </Button>
                              )}
                            </>
                          )}
                          {post.status === "published" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Sync Metrics
                            </Button>
                          )}
                          {can(Permission.CREATE_CONTENT) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-1.5 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/campaigns/post/${post.id}`)}>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="w-4 h-4 mr-2" />
                                Export
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(p => Math.max(1, p - 1));
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(p => Math.min(totalPages, p + 1));
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}

              {paginatedPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No posts found matching your filters.</p>
                </div>
              )}
            </div>
          )}

          {view === "queue" && (
            <div className="max-w-4xl">
              <PostQueue />
            </div>
          )}

          {view === "analytics" && (
            <div className="glass-card rounded-xl p-8 text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Detailed analytics for your social media performance, including engagement rates, 
                reach, and best performing content.
              </p>
            </div>
          )}
        </motion.div>

        {/* Create Post Modal */}
        <CreatePostModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      </div>
    </AppLayout>
  );
};

export default Campaigns;
