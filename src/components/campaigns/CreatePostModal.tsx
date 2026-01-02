import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Image as ImageIcon,
  Video,
  Link2,
  Smile,
  Hash,
  Clock,
  Calendar,
  ChevronDown,
  Sparkles,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

const platforms = [
  { id: "instagram", icon: Instagram, label: "Instagram", color: "text-pink-500", bg: "bg-pink-500/10", activeBg: "bg-pink-500" },
  { id: "facebook", icon: Facebook, label: "Facebook", color: "text-blue-500", bg: "bg-blue-500/10", activeBg: "bg-blue-500" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn", color: "text-blue-600", bg: "bg-blue-600/10", activeBg: "bg-blue-600" },
  { id: "twitter", icon: Twitter, label: "X", color: "text-sky-400", bg: "bg-sky-400/10", activeBg: "bg-sky-400" },
  { id: "tiktok", icon: TikTokIcon, label: "TikTok", color: "text-foreground", bg: "bg-foreground/10", activeBg: "bg-foreground" },
];

const clients = [
  "TechCorp Industries",
  "Green Solutions Ltd",
  "Nova Ventures",
  "Atlas Media Group",
  "Urban Development Co",
];

const suggestedTimes = [
  { time: "09:00", label: "Morning", engagement: "High" },
  { time: "12:00", label: "Lunch", engagement: "Medium" },
  { time: "15:00", label: "Afternoon", engagement: "High" },
  { time: "18:00", label: "Evening", engagement: "Very High" },
  { time: "21:00", label: "Night", engagement: "Medium" },
];

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [content, setContent] = useState("");
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [selectedDate, setSelectedDate] = useState("2026-01-05");
  const [selectedTime, setSelectedTime] = useState("09:00");

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const characterLimits: Record<string, number> = {
    twitter: 280,
    instagram: 2200,
    facebook: 63206,
    linkedin: 3000,
    tiktok: 2200,
  };

  const currentLimit = Math.min(...selectedPlatforms.map(p => characterLimits[p] || 2200));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Create Post</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Client Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Client</label>
                <div className="relative">
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full h-10 px-3 pr-10 rounded-lg bg-secondary border-0 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* Platform Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => {
                    const isSelected = selectedPlatforms.includes(platform.id);
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                          isSelected
                            ? `${platform.activeBg} text-white border-transparent`
                            : "border-border bg-secondary hover:border-primary/50 text-muted-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{platform.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Content</label>
                  <span className={cn(
                    "text-xs",
                    content.length > currentLimit ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {content.length} / {currentLimit}
                  </span>
                </div>
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's on your mind? Share your message with your audience..."
                    className="w-full h-40 p-4 rounded-lg bg-secondary border-0 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1">
                    <button className="p-2 rounded-md hover:bg-muted transition-colors">
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-md hover:bg-muted transition-colors">
                      <Video className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-md hover:bg-muted transition-colors">
                      <Link2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-md hover:bg-muted transition-colors">
                      <Smile className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-md hover:bg-muted transition-colors">
                      <Hash className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <button className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Assist
                  </button>
                </div>
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full h-10 pl-10 pr-3 rounded-lg bg-secondary border-0 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>

              {/* Best Times to Post */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Suggested Best Times</label>
                <div className="flex flex-wrap gap-2">
                  {suggestedTimes.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm transition-all",
                        selectedTime === slot.time
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      <span className="font-medium">{slot.time}</span>
                      <span className="text-xs ml-1.5 opacity-70">{slot.label}</span>
                      {slot.engagement === "Very High" && (
                        <span className="ml-1.5 text-xs text-success">★</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/50">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  Save as Draft
                </Button>
                <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Send className="w-4 h-4" />
                  Schedule Post
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
