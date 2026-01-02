import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EngagementMetrics } from "@/components/content/EngagementMetrics";
import { PerformanceChart } from "@/components/content/PerformanceChart";
import { TimelineActivity } from "@/components/content/TimelineActivity";
import { CommentsSection } from "@/components/content/CommentsSection";
import { SocialMediaPost, ContentComment } from "@/types/content";
import { contentService } from "@/services/contentService";
import { SocialMediaPostStatusConfig } from "@/lib/lifecycle";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Download, 
  RefreshCw,
  Image as ImageIcon,
  Video,
  Calendar,
  Clock,
  Globe,
  User
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/auth";

const platformConfig = {
  instagram: { icon: "📷", label: "Instagram", color: "text-pink-500" },
  facebook: { icon: "📘", label: "Facebook", color: "text-blue-500" },
  linkedin: { icon: "💼", label: "LinkedIn", color: "text-blue-600" },
  twitter: { icon: "🐦", label: "X (Twitter)", color: "text-sky-400" },
  tiktok: { icon: "🎵", label: "TikTok", color: "text-foreground" },
};

export default function SocialMediaPostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [post, setPost] = useState<SocialMediaPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch post from content service
    const posts = contentService.getSocialMediaPosts();
    const foundPost = posts.find(p => p.id === parseInt(id || "0"));
    setPost(foundPost || null);
    setIsLoading(false);
  }, [id]);

  const handleSyncMetrics = () => {
    if (!post) return;
    toast.success("Syncing metrics from platform...");
    // In a real app, this would call an API
    setTimeout(() => {
      if (post.engagement) {
        post.engagement.lastSynced = new Date().toISOString();
        setPost({ ...post });
        toast.success("Metrics synced successfully");
      }
    }, 1500);
  };

  const handleAddComment = (content: string) => {
    if (!post) return;
    const newComment: ContentComment = {
      id: `comment-${Date.now()}`,
      author: "Current User",
      authorId: "current-user",
      content,
      timestamp: new Date().toISOString(),
    };
    setPost({
      ...post,
      comments: [...(post.comments || []), newComment],
    });
  };

  const handleExport = () => {
    toast.success("Exporting post report...");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">Post Not Found</h3>
            <p className="text-muted-foreground mb-4">The post you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/campaigns")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Generate chart data from engagement metrics over time
  const chartData = post.engagement ? [
    { date: daysAgo(7), likes: Math.floor(post.engagement.likes * 0.3), comments: Math.floor(post.engagement.comments * 0.3), shares: Math.floor(post.engagement.shares * 0.3) },
    { date: daysAgo(6), likes: Math.floor(post.engagement.likes * 0.4), comments: Math.floor(post.engagement.comments * 0.4), shares: Math.floor(post.engagement.shares * 0.4) },
    { date: daysAgo(5), likes: Math.floor(post.engagement.likes * 0.5), comments: Math.floor(post.engagement.comments * 0.5), shares: Math.floor(post.engagement.shares * 0.5) },
    { date: daysAgo(4), likes: Math.floor(post.engagement.likes * 0.6), comments: Math.floor(post.engagement.comments * 0.6), shares: Math.floor(post.engagement.shares * 0.6) },
    { date: daysAgo(3), likes: Math.floor(post.engagement.likes * 0.7), comments: Math.floor(post.engagement.comments * 0.7), shares: Math.floor(post.engagement.shares * 0.7) },
    { date: daysAgo(2), likes: Math.floor(post.engagement.likes * 0.85), comments: Math.floor(post.engagement.comments * 0.85), shares: Math.floor(post.engagement.shares * 0.85) },
    { date: daysAgo(1), likes: post.engagement.likes, comments: post.engagement.comments, shares: post.engagement.shares },
  ] : [];

  function daysAgo(days: number) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/campaigns")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Post Details</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {post.title || "Social Media Post"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.status === "published" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncMetrics}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Sync Metrics
              </Button>
            )}
            {can(Permission.CREATE_CONTENT) && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Post Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {post.platforms.map((platform) => {
                    const config = platformConfig[platform as keyof typeof platformConfig];
                    return (
                      <span
                        key={platform}
                        className={cn(
                          "px-3 py-1 rounded-lg text-sm font-medium",
                          config.color,
                          "bg-secondary"
                        )}
                      >
                        {config.label}
                      </span>
                    );
                  })}
                  <span
                    className={cn(
                      "px-3 py-1 rounded-lg text-sm font-medium",
                      SocialMediaPostStatusConfig[post.status].bg,
                      SocialMediaPostStatusConfig[post.status].color
                    )}
                  >
                    {SocialMediaPostStatusConfig[post.status].label}
                  </span>
                </div>

                {post.imageUrl && (
                  <div className="rounded-lg overflow-hidden bg-secondary">
                    <img
                      src={post.imageUrl}
                      alt="Post media"
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {post.videoUrl && (
                  <div className="rounded-lg overflow-hidden bg-secondary">
                    <video
                      src={post.videoUrl}
                      controls
                      className="w-full h-auto"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                  {post.title && (
                    <p className="text-sm font-medium text-foreground">{post.title}</p>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                  {post.scheduledDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.scheduledDate}</span>
                    </div>
                  )}
                  {post.scheduledTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.scheduledTime}</span>
                    </div>
                  )}
                  {post.timezone && (
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{post.timezone}</span>
                    </div>
                  )}
                  {post.createdBy && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.createdBy}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            {post.status === "published" && post.engagement && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Performance Metrics</CardTitle>
                        <CardDescription>
                          Last synced: {post.engagement.lastSynced 
                            ? format(new Date(post.engagement.lastSynced), "MMM d, yyyy 'at' h:mm a")
                            : "Never"}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSyncMetrics}
                        className="gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Sync Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <EngagementMetrics engagement={post.engagement} />
                  </CardContent>
                </Card>

                {/* Engagement Trend Chart */}
                {chartData.length > 0 && (
                  <PerformanceChart
                    data={chartData}
                    metrics={["likes", "comments", "shares"]}
                    title="Engagement Over Time"
                    description="Track how your post performs over time"
                    chartType="line"
                  />
                )}
              </>
            )}

            {/* Timeline & Activity */}
            {post.timeline && post.timeline.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <TimelineActivity timeline={post.timeline} />
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            {post.comments !== undefined && (
              <Card>
                <CardContent className="pt-6">
                  <CommentsSection
                    comments={post.comments}
                    onAddComment={handleAddComment}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Info */}
            <Card>
              <CardHeader>
                <CardTitle>Post Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Client</div>
                  <div className="font-medium text-foreground">{post.client}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Content Type</div>
                  <div className="font-medium text-foreground capitalize">
                    {post.contentType || "Post"}
                  </div>
                </div>
                {post.publishedAt && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Published</div>
                    <div className="font-medium text-foreground">
                      {format(new Date(post.publishedAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                )}
                {post.approvedAt && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Approved</div>
                    <div className="font-medium text-foreground">
                      {format(new Date(post.approvedAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                )}
                {post.rejectedAt && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Rejected</div>
                    <div className="font-medium text-foreground">
                      {format(new Date(post.rejectedAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                    {post.rejectionReason && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {post.rejectionReason}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

