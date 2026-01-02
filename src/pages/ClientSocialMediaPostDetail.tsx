import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SocialMediaPost } from "@/types/content";
import { contentService } from "@/services/contentService";
import { SocialMediaPostStatusConfig } from "@/lib/lifecycle";
import { ArrowLeft, CheckCircle2, XCircle, BarChart3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/sonner";
import { EngagementMetrics } from "@/components/content/EngagementMetrics";

export default function ClientSocialMediaPostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<SocialMediaPost | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const posts = contentService.getSocialMediaPosts();
    const foundPost = posts.find(p => p.id === parseInt(id || "0"));
    setPost(foundPost || null);
    setIsLoading(false);
  }, [id]);

  const handleApprove = () => {
    if (!post) return;
    toast.success("Post approved successfully");
    navigate("/campaigns/calendar");
  };

  const handleReject = () => {
    if (!post || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    toast.error("Post rejected");
    navigate("/campaigns/calendar");
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

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/campaigns/calendar")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Calendar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.imageUrl && (
                  <div className="rounded-lg overflow-hidden bg-secondary">
                    <img src={post.imageUrl} alt="Post" className="w-full h-auto" />
                  </div>
                )}
                <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-sm font-medium",
                    SocialMediaPostStatusConfig[post.status].bg,
                    SocialMediaPostStatusConfig[post.status].color
                  )}>
                    {SocialMediaPostStatusConfig[post.status].label}
                  </span>
                </div>
              </CardContent>
            </Card>

            {post.status === "published" && post.engagement && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <EngagementMetrics engagement={post.engagement} />
                  <Button
                    variant="outline"
                    className="mt-4 gap-2"
                    onClick={() => navigate(`/analytics?post=${post.id}`)}
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Performance Chart
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {post.status === "pending_review" && (
              <Card>
                <CardHeader>
                  <CardTitle>Review Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full gap-2"
                    onClick={handleApprove}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </Button>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Rejection reason (required)"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={handleReject}
                      disabled={!rejectionReason.trim()}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Post Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Scheduled Date</div>
                  <div className="font-medium text-foreground">
                    {post.scheduledDate} {post.scheduledTime}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

