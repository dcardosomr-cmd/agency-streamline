import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost } from "@/types/content";
import { contentService } from "@/services/contentService";
import { ArrowLeft } from "lucide-react";

export default function ClientBlogDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const posts = contentService.getBlogPosts();
    const found = posts.find(p => p.id === parseInt(id || "0"));
    setPost(found || null);
  }, [id]);

  if (!post) {
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/blogs")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
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
            {post.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Views</div>
                  <div className="text-xl font-bold">{post.metrics.views.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Likes</div>
                  <div className="text-xl font-bold">{post.metrics.likes}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Comments</div>
                  <div className="text-xl font-bold">{post.metrics.comments}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Shares</div>
                  <div className="text-xl font-bold">{post.metrics.shares}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

