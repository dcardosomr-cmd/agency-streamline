import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChart } from "@/components/content/PerformanceChart";
import { TimelineActivity } from "@/components/content/TimelineActivity";
import { CommentsSection } from "@/components/content/CommentsSection";
import { BlogPost, ContentComment } from "@/types/content";
import { contentService } from "@/services/contentService";
import { BlogPostStatusConfig } from "@/lib/lifecycle";
import { ArrowLeft, Edit, Trash2, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/auth";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const posts = contentService.getBlogPosts();
    const foundPost = posts.find(p => p.id === parseInt(id || "0"));
    setPost(foundPost || null);
    setIsLoading(false);
  }, [id]);

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

  if (isLoading || !post) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  const chartData = post.metrics ? [
    { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), views: Math.floor(post.metrics.views * 0.3), likes: Math.floor(post.metrics.likes * 0.3) },
    { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), views: Math.floor(post.metrics.views * 0.4), likes: Math.floor(post.metrics.likes * 0.4) },
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), views: Math.floor(post.metrics.views * 0.5), likes: Math.floor(post.metrics.likes * 0.5) },
    { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), views: Math.floor(post.metrics.views * 0.6), likes: Math.floor(post.metrics.likes * 0.6) },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), views: Math.floor(post.metrics.views * 0.7), likes: Math.floor(post.metrics.likes * 0.7) },
    { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), views: Math.floor(post.metrics.views * 0.85), likes: Math.floor(post.metrics.likes * 0.85) },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), views: post.metrics.views, likes: post.metrics.likes },
  ] : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/blogs")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {can(Permission.CREATE_CONTENT) && (
              <>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                {post.excerpt && <CardDescription>{post.excerpt}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-4">
                {post.featuredImage && (
                  <div className="rounded-lg overflow-hidden bg-secondary">
                    <img src={post.featuredImage} alt={post.title} className="w-full h-auto" />
                  </div>
                )}
                <div className="prose max-w-none text-foreground">
                  {post.content}
                </div>
              </CardContent>
            </Card>

            {post.metrics && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <div className="text-sm text-muted-foreground mb-1">Views</div>
                      <div className="text-2xl font-bold">{post.metrics.views.toLocaleString()}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <div className="text-sm text-muted-foreground mb-1">Avg. Time</div>
                      <div className="text-2xl font-bold">{Math.floor(post.metrics.averageTimeOnPage / 60)}m</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <div className="text-sm text-muted-foreground mb-1">Bounce Rate</div>
                      <div className="text-2xl font-bold">{post.metrics.bounceRate}%</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <div className="text-sm text-muted-foreground mb-1">Backlinks</div>
                      <div className="text-2xl font-bold">{post.metrics.backlinks}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <div className="text-sm text-muted-foreground mb-1">Likes</div>
                      <div className="text-xl font-bold">{post.metrics.likes}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <div className="text-sm text-muted-foreground mb-1">Comments</div>
                      <div className="text-xl font-bold">{post.metrics.comments}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/30">
                      <div className="text-sm text-muted-foreground mb-1">Shares</div>
                      <div className="text-xl font-bold">{post.metrics.shares}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {chartData.length > 0 && (
              <PerformanceChart
                data={chartData}
                metrics={["views", "likes"]}
                title="Traffic & Engagement Over Time"
                chartType="line"
              />
            )}

            {post.seo && (
              <Card>
                <CardHeader>
                  <CardTitle>SEO Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">SEO Score</div>
                    <div className="text-2xl font-bold">{post.seo.score}/100</div>
                  </div>
                  {post.seo.metaDescription && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Meta Description</div>
                      <div className="text-foreground">{post.seo.metaDescription}</div>
                    </div>
                  )}
                  {post.seo.metaKeywords && post.seo.metaKeywords.length > 0 && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Keywords</div>
                      <div className="flex flex-wrap gap-2">
                        {post.seo.metaKeywords.map((kw) => (
                          <span key={kw} className="px-2 py-1 rounded bg-secondary text-foreground text-sm">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {post.trafficSources && post.trafficSources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {post.trafficSources.map((source) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <span className="text-foreground capitalize">{source.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground">{source.visits.toLocaleString()}</span>
                          <span className="text-muted-foreground text-sm">({source.percentage}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {post.timeline && post.timeline.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <TimelineActivity timeline={post.timeline} />
                </CardContent>
              </Card>
            )}

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

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <span className={cn(
                    "px-2 py-1 rounded text-sm font-medium",
                    BlogPostStatusConfig[post.status]?.bg,
                    BlogPostStatusConfig[post.status]?.color
                  )}>
                    {BlogPostStatusConfig[post.status]?.label}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Client</div>
                  <div className="font-medium text-foreground">{post.client}</div>
                </div>
                {post.author && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Author</div>
                    <div className="font-medium text-foreground">{post.author}</div>
                  </div>
                )}
                {post.publishedAt && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Published</div>
                    <div className="font-medium text-foreground">
                      {format(new Date(post.publishedAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Tags</div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 rounded bg-secondary text-foreground text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {post.categories && post.categories.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Categories</div>
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((cat) => (
                        <span key={cat} className="px-2 py-1 rounded bg-secondary text-foreground text-sm">
                          {cat}
                        </span>
                      ))}
                    </div>
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

