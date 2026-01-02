import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SocialMediaPost } from "@/types/content";
import { contentService } from "@/services/contentService";
import { SocialMediaPostStatusConfig } from "@/lib/lifecycle";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks, startOfMonth, endOfMonth, eachWeekOfInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

const platformConfig = {
  instagram: { icon: "📷", color: "bg-pink-500" },
  facebook: { icon: "📘", color: "bg-blue-500" },
  linkedin: { icon: "💼", color: "bg-blue-600" },
  twitter: { icon: "🐦", color: "bg-sky-400" },
  tiktok: { icon: "🎵", color: "bg-foreground" },
};

export default function ClientSocialMediaCalendar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter posts for current client
  const allPosts = useMemo(() => {
    const posts = contentService.getSocialMediaPosts();
    // Filter by client if user is CLIENT_ADMIN
    if (user?.role === "CLIENT_ADMIN" && user.clientId) {
      return posts.filter(p => p.clientId === user.clientId);
    }
    return posts;
  }, [user]);

  const handleApprove = (postId: number) => {
    toast.success("Post approved");
  };

  const handleReject = (postId: number) => {
    toast.error("Post rejected");
  };

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthWeeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 0 });
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPostsForDate = (date: Date) => {
    return allPosts.filter(post => {
      if (!post.scheduledDate) return false;
      const postDate = new Date(post.scheduledDate);
      return isSameDay(postDate, date);
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Content Calendar</h1>
            <p className="text-sm text-muted-foreground mt-1">Review and approve scheduled posts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(viewMode === "week" ? subWeeks(currentDate, 1) : subWeeks(currentDate, 4))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="text-lg font-semibold text-foreground">
            {viewMode === "week" 
              ? `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`
              : format(currentDate, "MMMM yyyy")
            }
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(viewMode === "week" ? addWeeks(currentDate, 1) : addWeeks(currentDate, 4))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        {viewMode === "week" ? (
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayPosts = getPostsForDate(day);
              return (
                <Card key={day.toISOString()} className="min-h-[200px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {format(day, "EEE")}
                      <span className="text-muted-foreground ml-1">{format(day, "d")}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className={cn(
                          "p-2 rounded-lg text-xs cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all",
                          SocialMediaPostStatusConfig[post.status].bg,
                          "border border-border"
                        )}
                        onClick={() => navigate(`/campaigns/post/${post.id}/client`)}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {post.platforms.slice(0, 2).map((platform) => (
                            <span key={platform} className="text-xs">
                              {platformConfig[platform as keyof typeof platformConfig]?.icon}
                            </span>
                          ))}
                        </div>
                        <p className="line-clamp-2 text-foreground mb-2">{post.content}</p>
                        {post.status === "pending_review" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(post.id);
                              }}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 px-2 text-xs text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(post.id);
                              }}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day) => {
                const dayPosts = getPostsForDate(day);
                const isCurrentMonth = format(day, "M") === format(currentDate, "M");
                return (
                  <Card
                    key={day.toISOString()}
                    className={cn(
                      "min-h-[120px]",
                      !isCurrentMonth && "opacity-50"
                    )}
                  >
                    <CardContent className="p-2">
                      <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
                      <div className="space-y-1">
                        {dayPosts.slice(0, 2).map((post) => (
                          <div
                            key={post.id}
                            className={cn(
                              "p-1 rounded text-xs cursor-pointer hover:ring-1 hover:ring-primary/50",
                              SocialMediaPostStatusConfig[post.status].bg
                            )}
                            onClick={() => navigate(`/campaigns/post/${post.id}/client`)}
                          >
                            <div className="flex items-center gap-1">
                              {post.platforms[0] && (
                                <span className="text-xs">
                                  {platformConfig[post.platforms[0] as keyof typeof platformConfig]?.icon}
                                </span>
                              )}
                              <span className={cn("text-xs", SocialMediaPostStatusConfig[post.status].color)}>
                                {SocialMediaPostStatusConfig[post.status].label}
                              </span>
                            </div>
                          </div>
                        ))}
                        {dayPosts.length > 2 && (
                          <div className="text-xs text-muted-foreground">+{dayPosts.length - 2} more</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Scheduled Posts List */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allPosts
                .filter(p => p.status === "pending_review" || p.status === "approved")
                .slice(0, 10)
                .map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {post.platforms.map((platform) => (
                          <span key={platform} className="text-sm">
                            {platformConfig[platform as keyof typeof platformConfig]?.icon}
                          </span>
                        ))}
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs",
                          SocialMediaPostStatusConfig[post.status].bg,
                          SocialMediaPostStatusConfig[post.status].color
                        )}>
                          {SocialMediaPostStatusConfig[post.status].label}
                        </span>
                      </div>
                      <p className="text-sm text-foreground line-clamp-1">{post.content}</p>
                      {post.scheduledDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {post.scheduledDate} {post.scheduledTime}
                        </p>
                      )}
                    </div>
                    {post.status === "pending_review" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(post.id)}
                          className="gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(post.id)}
                          className="gap-1 text-destructive"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

