import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Clock,
  Image as ImageIcon,
  MoreHorizontal,
  CheckCircle2,
  Edit2,
  Trash2,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  SocialMediaPostStatus, 
  SocialMediaPostStatusConfig 
} from "@/lib/lifecycle";
import { toast } from "@/components/ui/sonner";
import { EditPostModal } from "./EditPostModal";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const platformConfig = {
  instagram: { icon: Instagram, color: "text-pink-500", bg: "bg-pink-500/10", label: "Instagram" },
  facebook: { icon: Facebook, color: "text-blue-500", bg: "bg-blue-500/10", label: "Facebook" },
  linkedin: { icon: Linkedin, color: "text-blue-600", bg: "bg-blue-600/10", label: "LinkedIn" },
  twitter: { icon: Twitter, color: "text-sky-400", bg: "bg-sky-400/10", label: "X (Twitter)" },
  tiktok: { icon: TikTokIcon, color: "text-foreground", bg: "bg-foreground/10", label: "TikTok" },
};

interface QueuedPost {
  id: number;
  content: string;
  platforms: string[];
  scheduledTime: string;
  scheduledDate: string;
  status: SocialMediaPostStatus;
  hasImage: boolean;
  imageUrl?: string;
  client: string;
}

const queuedPosts: QueuedPost[] = [
  {
    id: 1,
    content: "Exciting news! Our Q1 product launch is here 🚀 Check out our latest innovations that will transform how you work. Link in bio! #innovation #tech #2026",
    platforms: ["instagram", "facebook", "linkedin"],
    scheduledTime: "09:00",
    scheduledDate: "Jan 5, 2026",
    status: "approved",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=300&fit=crop",
    client: "TechCorp Industries",
  },
  {
    id: 2,
    content: "Sustainability tip of the week: Small changes make a big impact 🌱 Start with these 5 simple steps to reduce your carbon footprint today.",
    platforms: ["instagram", "twitter"],
    scheduledTime: "14:30",
    scheduledDate: "Jan 5, 2026",
    status: "pending_review",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=300&fit=crop",
    client: "Green Solutions Ltd",
  },
  {
    id: 3,
    content: "Behind the scenes of our latest campaign shoot 📸 Swipe to see the magic happen!",
    platforms: ["instagram", "tiktok"],
    scheduledTime: "18:00",
    scheduledDate: "Jan 6, 2026",
    status: "draft",
    hasImage: true,
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=300&fit=crop",
    client: "Atlas Media Group",
  },
  {
    id: 4,
    content: "New blog post: The Future of Fintech in 2026 💡 Discover the trends that will shape the financial industry. Read the full article →",
    platforms: ["linkedin", "twitter"],
    scheduledTime: "10:00",
    scheduledDate: "Jan 7, 2026",
    status: "approved",
    hasImage: false,
    client: "Nova Ventures",
  },
];

export function PostQueue() {
  const [posts, setPosts] = useState<QueuedPost[]>(queuedPosts);
  const [editingPost, setEditingPost] = useState<QueuedPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditPost = (post: QueuedPost) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = (postId: number, updatedData: {
    content: string;
    platforms: string[];
    scheduledTime: string;
    scheduledDate: string;
    client: string;
  }) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, ...updatedData }
          : post
      )
    );
    toast.success("Post updated", {
      description: "The post has been successfully updated.",
    });
  };

  const handleDeletePost = (post: QueuedPost) => {
    toast.error("Delete post", {
      description: `Are you sure you want to delete this post scheduled for ${post.scheduledDate}?`,
      action: {
        label: "Delete",
        onClick: () => {
          setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
          toast.success("Post deleted", {
            description: "The post has been removed from the queue.",
          });
        },
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Upcoming Posts</h3>
          <p className="text-sm text-muted-foreground">Next 7 days</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View all
        </Button>
      </div>

      <div className="space-y-3">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-xl p-4 hover:border-primary/30 transition-all group"
          >
            <div className="flex gap-4">
              {/* Image Preview */}
              {post.hasImage && post.imageUrl ? (
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-secondary">
                  <img 
                    src={post.imageUrl} 
                    alt="Post preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-secondary shrink-0 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {post.platforms.map((platform) => {
                      const config = platformConfig[platform as keyof typeof platformConfig];
                      const Icon = config.icon;
                      return (
                        <div 
                          key={platform} 
                          className={cn("p-1.5 rounded-md", config.bg)}
                          title={config.label}
                        >
                          <Icon className={cn("w-4 h-4", config.color)} />
                        </div>
                      );
                    })}
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      SocialMediaPostStatusConfig[post.status].bg,
                      SocialMediaPostStatusConfig[post.status].color
                    )}>
                      {SocialMediaPostStatusConfig[post.status].label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPost(post);
                      }}
                      className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                      aria-label="Edit post"
                    >
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePost(post);
                      }}
                      className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors"
                      aria-label="Delete post"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-foreground line-clamp-2 mb-3">{post.content}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>{post.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{post.scheduledTime}</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">{post.client}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <EditPostModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingPost(null);
        }}
        post={editingPost}
        onUpdatePost={handleUpdatePost}
      />
    </div>
  );
}
