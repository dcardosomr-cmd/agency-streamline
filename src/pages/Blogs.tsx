import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusTabs } from "@/components/content/StatusTabs";
import { BulkActionsToolbar } from "@/components/content/BulkActionsToolbar";
import { BlogPost } from "@/types/content";
import { contentService } from "@/services/contentService";
import { BlogPostStatusConfig } from "@/lib/lifecycle";
import { Plus, Eye, Edit, Download, MoreHorizontal, Search, Clock, User, Tag, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/components/ui/sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Blogs() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [selectedPosts, setSelectedPosts] = useState<Set<number>>(new Set());
  const [activeStatusTab, setActiveStatusTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const allPosts = useMemo(() => {
    return contentService.getBlogPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = allPosts;
    
    if (activeStatusTab !== "all") {
      filtered = filtered.filter(p => p.status === activeStatusTab);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [allPosts, activeStatusTab, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allPosts.length,
      draft: 0,
      pending_review: 0,
      approved: 0,
      published: 0,
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
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your blog content</p>
          </div>
          {can(Permission.CREATE_CONTENT) && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Post
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground"
            />
          </div>
        </div>

        <StatusTabs
          tabs={statusTabs}
          activeTab={activeStatusTab}
          onTabChange={setActiveStatusTab}
        />

        <BulkActionsToolbar
          selectedCount={selectedPosts.size}
          onSelectAll={() => setSelectedPosts(new Set(filteredPosts.map(p => p.id)))}
          onExport={() => toast.success("Exporting posts...")}
        />

        <div className="space-y-2">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="glass-card rounded-xl p-4 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedPosts.has(post.id)}
                  onCheckedChange={() => {
                    const newSet = new Set(selectedPosts);
                    if (newSet.has(post.id)) {
                      newSet.delete(post.id);
                    } else {
                      newSet.add(post.id);
                    }
                    setSelectedPosts(newSet);
                  }}
                />
                {post.featuredImage && (
                  <div className="w-24 h-24 rounded-lg bg-secondary overflow-hidden shrink-0">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{post.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt || post.content}</p>
                    </div>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-medium shrink-0",
                      BlogPostStatusConfig[post.status]?.bg,
                      BlogPostStatusConfig[post.status]?.color
                    )}>
                      {BlogPostStatusConfig[post.status]?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    {post.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </span>
                    )}
                    {post.readingTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min read
                      </span>
                    )}
                    {post.views !== undefined && (
                      <span>{post.views.toLocaleString()} views</span>
                    )}
                    {post.metrics && (
                      <>
                        <span>{post.metrics.likes} likes</span>
                        <span>{post.metrics.comments} comments</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {post.tags && post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs bg-secondary text-foreground flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {post.categories && post.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded text-xs bg-secondary text-foreground flex items-center gap-1"
                      >
                        <Folder className="w-3 h-3" />
                        {cat}
                      </span>
                    ))}
                    {post.seo && (
                      <span className="px-2 py-0.5 rounded text-xs bg-success/10 text-success">
                        SEO: {post.seo.score}/100
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/blogs/${post.id}`)}
                      className="gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    {can(Permission.CREATE_CONTENT) && (
                      <>
                        <Button variant="ghost" size="sm" className="gap-1.5">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        {post.metrics && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/blogs/${post.id}/analytics`)}
                            className="gap-1.5"
                          >
                            View Analytics
                          </Button>
                        )}
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/blogs/${post.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

