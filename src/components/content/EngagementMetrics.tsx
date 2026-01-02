import { Heart, MessageCircle, Share2, Bookmark, Users, TrendingUp } from "lucide-react";
import { SocialMediaEngagement } from "@/types/content";
import { cn } from "@/lib/utils";

interface EngagementMetricsProps {
  engagement: SocialMediaEngagement;
  className?: string;
  compact?: boolean;
}

export function EngagementMetrics({ engagement, className, compact = false }: EngagementMetricsProps) {
  if (compact) {
    return (
      <div className={cn("flex items-center gap-4 text-sm", className)}>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-pink-500" />
          <span className="font-medium">{engagement.likes.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{engagement.comments}</span>
        </div>
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4 text-green-500" />
          <span className="font-medium">{engagement.shares}</span>
        </div>
        <div className="flex items-center gap-1">
          <Bookmark className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">{engagement.saves}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-sm text-muted-foreground">Likes</span>
          </div>
          <div className="text-2xl font-bold">{engagement.likes.toLocaleString()}</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Comments</span>
          </div>
          <div className="text-2xl font-bold">{engagement.comments}</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground">Shares</span>
          </div>
          <div className="text-2xl font-bold">{engagement.shares}</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">Saves</span>
          </div>
          <div className="text-2xl font-bold">{engagement.saves}</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Reach</span>
          </div>
          <div className="text-2xl font-bold">{engagement.reach.toLocaleString()}</div>
        </div>
        <div className="p-3 rounded-lg bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success" />
            <span className="text-sm text-muted-foreground">Engagement Rate</span>
          </div>
          <div className="text-2xl font-bold">{engagement.engagementRate}%</div>
        </div>
      </div>
    </div>
  );
}

