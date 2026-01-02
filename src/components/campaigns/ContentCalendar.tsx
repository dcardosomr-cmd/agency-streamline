import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Clock,
  Image as ImageIcon,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const platformConfig = {
  instagram: { icon: Instagram, color: "text-pink-500", bg: "bg-pink-500/10" },
  facebook: { icon: Facebook, color: "text-blue-500", bg: "bg-blue-500/10" },
  linkedin: { icon: Linkedin, color: "text-blue-600", bg: "bg-blue-600/10" },
  twitter: { icon: Twitter, color: "text-sky-400", bg: "bg-sky-400/10" },
  tiktok: { icon: TikTokIcon, color: "text-foreground", bg: "bg-foreground/10" },
};

interface ScheduledPost {
  id: number;
  content: string;
  platforms: string[];
  scheduledTime: string;
  scheduledDate: string;
  status: "scheduled" | "published" | "draft";
  hasImage: boolean;
  client: string;
}

const scheduledPosts: ScheduledPost[] = [
  {
    id: 1,
    content: "Exciting news! Our Q1 product launch is here 🚀 Check out our latest innovations...",
    platforms: ["instagram", "facebook", "linkedin"],
    scheduledTime: "09:00",
    scheduledDate: "2026-01-05",
    status: "scheduled",
    hasImage: true,
    client: "TechCorp Industries",
  },
  {
    id: 2,
    content: "Sustainability tip of the week: Small changes make a big impact 🌱",
    platforms: ["instagram", "twitter"],
    scheduledTime: "14:30",
    scheduledDate: "2026-01-05",
    status: "scheduled",
    hasImage: true,
    client: "Green Solutions Ltd",
  },
  {
    id: 3,
    content: "Behind the scenes of our latest campaign shoot 📸",
    platforms: ["instagram", "tiktok"],
    scheduledTime: "18:00",
    scheduledDate: "2026-01-06",
    status: "draft",
    hasImage: true,
    client: "Atlas Media Group",
  },
  {
    id: 4,
    content: "New blog post: The Future of Fintech in 2026 💡 Read more...",
    platforms: ["linkedin", "twitter"],
    scheduledTime: "10:00",
    scheduledDate: "2026-01-07",
    status: "scheduled",
    hasImage: false,
    client: "Nova Ventures",
  },
  {
    id: 5,
    content: "Happy New Year from our team! 🎉 Here's to an amazing 2026",
    platforms: ["instagram", "facebook", "twitter", "linkedin"],
    scheduledTime: "12:00",
    scheduledDate: "2026-01-01",
    status: "published",
    hasImage: true,
    client: "TechCorp Industries",
  },
  {
    id: 6,
    content: "Weekly motivation: Dream big, work hard, stay focused 💪",
    platforms: ["instagram"],
    scheduledTime: "07:00",
    scheduledDate: "2026-01-08",
    status: "scheduled",
    hasImage: true,
    client: "Urban Development Co",
  },
];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface ContentCalendarProps {
  onCreatePost: () => void;
}

export function ContentCalendar({ onCreatePost }: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // January 2026
  const [view, setView] = useState<"week" | "month">("week");

  const getWeekDates = () => {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const dates = [];
    const startPad = (firstDay.getDay() + 6) % 7;
    
    for (let i = startPad; i > 0; i--) {
      const date = new Date(year, month, 1 - i);
      dates.push({ date, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    const remaining = 42 - dates.length;
    for (let i = 1; i <= remaining; i++) {
      dates.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return dates;
  };

  const formatDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getPostsForDate = (date: Date) => {
    const dateKey = formatDateKey(date);
    return scheduledPosts.filter(post => post.scheduledDate === dateKey);
  };

  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (view === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date(2026, 0, 2); // Mock today
    return formatDateKey(date) === formatDateKey(today);
  };

  const weekDates = getWeekDates();
  const monthDates = getMonthDates();

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={navigatePrev}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={navigateNext}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-secondary rounded-lg p-1">
            <button
              onClick={() => setView("week")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                view === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                view === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      {view === "week" ? (
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {weekDates.map((date, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 text-center border-r border-border last:border-r-0",
                  isToday(date) && "bg-primary/5"
                )}
              >
                <p className="text-xs text-muted-foreground">{daysOfWeek[index]}</p>
                <p className={cn(
                  "text-lg font-semibold mt-1",
                  isToday(date) ? "text-primary" : "text-foreground"
                )}>
                  {date.getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-7 min-h-[400px]">
            {weekDates.map((date, index) => {
              const posts = getPostsForDate(date);
              return (
                <div
                  key={index}
                  className={cn(
                    "p-2 border-r border-border last:border-r-0 min-h-[400px]",
                    isToday(date) && "bg-primary/5"
                  )}
                >
                  <div className="space-y-2">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} compact />
                    ))}
                    <button
                      onClick={onCreatePost}
                      className="w-full p-2 rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-1 text-muted-foreground hover:text-primary"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-xs">Add</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {daysOfWeek.map((day) => (
              <div key={day} className="p-3 text-center border-r border-border last:border-r-0">
                <p className="text-xs text-muted-foreground font-medium">{day}</p>
              </div>
            ))}
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7">
            {monthDates.map(({ date, isCurrentMonth }, index) => {
              const posts = getPostsForDate(date);
              return (
                <div
                  key={index}
                  className={cn(
                    "p-2 border-r border-b border-border min-h-[120px]",
                    !isCurrentMonth && "bg-secondary/30",
                    isToday(date) && "bg-primary/5"
                  )}
                >
                  <p className={cn(
                    "text-sm font-medium mb-1",
                    isCurrentMonth ? (isToday(date) ? "text-primary" : "text-foreground") : "text-muted-foreground"
                  )}>
                    {date.getDate()}
                  </p>
                  <div className="space-y-1">
                    {posts.slice(0, 2).map((post) => (
                      <div
                        key={post.id}
                        className={cn(
                          "px-2 py-1 rounded text-xs truncate cursor-pointer hover:opacity-80 transition-opacity",
                          post.status === "published" ? "bg-success/20 text-success" :
                          post.status === "draft" ? "bg-muted text-muted-foreground" :
                          "bg-primary/20 text-primary"
                        )}
                      >
                        {post.scheduledTime} · {post.platforms.length} platforms
                      </div>
                    ))}
                    {posts.length > 2 && (
                      <p className="text-xs text-muted-foreground">+{posts.length - 2} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, compact = false }: { post: ScheduledPost; compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-lg p-2.5 cursor-pointer group transition-all hover:ring-2 hover:ring-primary/50",
        post.status === "published" ? "bg-success/10 border border-success/20" :
        post.status === "draft" ? "bg-muted border border-border" :
        "bg-secondary border border-border"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1">
          {post.platforms.slice(0, 3).map((platform) => {
            const config = platformConfig[platform as keyof typeof platformConfig];
            const Icon = config.icon;
            return (
              <div key={platform} className={cn("p-1 rounded", config.bg)}>
                <Icon className={cn("w-3 h-3", config.color)} />
              </div>
            );
          })}
          {post.platforms.length > 3 && (
            <span className="text-xs text-muted-foreground">+{post.platforms.length - 3}</span>
          )}
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-secondary rounded">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <p className="text-xs text-foreground line-clamp-2 mb-2">{post.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{post.scheduledTime}</span>
        </div>
        {post.hasImage && (
          <div className="p-1 rounded bg-secondary">
            <ImageIcon className="w-3 h-3 text-muted-foreground" />
          </div>
        )}
      </div>

      {!compact && (
        <p className="text-xs text-muted-foreground mt-2 truncate">{post.client}</p>
      )}
    </motion.div>
  );
}
