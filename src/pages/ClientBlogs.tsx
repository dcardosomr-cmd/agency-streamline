import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPost } from "@/types/content";
import { contentService } from "@/services/contentService";
import { BlogPostStatusConfig } from "@/lib/lifecycle";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function ClientBlogs() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const posts = useMemo(() => {
    const all = contentService.getBlogPosts();
    if (user?.role === "CLIENT_ADMIN" && user.clientId) {
      return all.filter(p => p.clientId === user.clientId);
    }
    return all;
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">View your company's blog content</p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:border-primary/30 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {post.featuredImage && (
                    <div className="w-24 h-24 rounded-lg bg-secondary overflow-hidden shrink-0">
                      <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-medium shrink-0",
                        BlogPostStatusConfig[post.status]?.bg,
                        BlogPostStatusConfig[post.status]?.color
                      )}>
                        {BlogPostStatusConfig[post.status]?.label}
                      </span>
                    </div>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                    )}
                    {post.metrics && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span>{post.metrics.views.toLocaleString()} views</span>
                        <span>{post.metrics.likes} likes</span>
                        <span>{post.metrics.comments} comments</span>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/blogs/${post.id}/client`)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

