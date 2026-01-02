import { motion } from "framer-motion";
import { 
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  TrendingUp,
  Users,
  Heart,
  MessageCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const platformStats = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    bg: "bg-gradient-to-br from-pink-500/20 to-purple-500/20",
    borderColor: "border-pink-500/30",
    followers: "24.5K",
    engagement: "4.8%",
    posts: 12,
    growth: "+2.3%",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-500",
    bg: "bg-gradient-to-br from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/30",
    followers: "18.2K",
    engagement: "2.1%",
    posts: 8,
    growth: "+1.2%",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-600",
    bg: "bg-gradient-to-br from-blue-600/20 to-blue-700/20",
    borderColor: "border-blue-600/30",
    followers: "12.8K",
    engagement: "3.5%",
    posts: 6,
    growth: "+4.1%",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "text-sky-400",
    bg: "bg-gradient-to-br from-sky-400/20 to-sky-500/20",
    borderColor: "border-sky-400/30",
    followers: "8.9K",
    engagement: "1.8%",
    posts: 15,
    growth: "-0.5%",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: TikTokIcon,
    color: "text-foreground",
    bg: "bg-gradient-to-br from-foreground/10 to-foreground/20",
    borderColor: "border-foreground/30",
    followers: "45.2K",
    engagement: "8.2%",
    posts: 5,
    growth: "+12.4%",
  },
];

export function PlatformStats() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">Platform Overview</h3>
        <p className="text-sm text-muted-foreground">Connected accounts performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {platformStats.map((platform, index) => {
          const Icon = platform.icon;
          const isPositive = platform.growth.startsWith("+");
          
          return (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "rounded-xl p-4 border transition-all hover:scale-[1.02] cursor-pointer",
                platform.bg,
                platform.borderColor
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={cn("w-6 h-6", platform.color)} />
                <span className={cn(
                  "text-xs font-medium flex items-center gap-0.5",
                  isPositive ? "text-success" : "text-destructive"
                )}>
                  <TrendingUp className={cn("w-3 h-3", !isPositive && "rotate-180")} />
                  {platform.growth}
                </span>
              </div>

              <h4 className="font-medium text-foreground text-sm mb-3">{platform.name}</h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Followers
                  </span>
                  <span className="text-sm font-semibold text-foreground">{platform.followers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Engagement
                  </span>
                  <span className="text-sm font-semibold text-foreground">{platform.engagement}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    This Month
                  </span>
                  <span className="text-sm font-semibold text-foreground">{platform.posts} posts</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
