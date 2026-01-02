import { useState, useRef, useEffect } from "react";
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
  Send,
  Upload,
  Trash2,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

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
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error("Please select image files only");
      return;
    }

    // Limit to 10 images
    const newImages = [...uploadedImages, ...imageFiles].slice(0, 10);
    setUploadedImages(newImages);

    // Create preview URLs
    const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 10));

    toast.success(`${imageFiles.length} image(s) uploaded`);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    
    if (videoFiles.length === 0) {
      toast.error("Please select video files only");
      return;
    }

    // Limit to 1 video (most platforms only support one video per post)
    if (uploadedVideos.length > 0) {
      toast.error("Only one video per post is supported");
      return;
    }

    setUploadedVideos(videoFiles);
    const newPreviews = videoFiles.map(file => URL.createObjectURL(file));
    setVideoPreviews(newPreviews);

    toast.success("Video uploaded");
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setImagePreviews(newPreviews);
    // Revoke object URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const removeVideo = (index: number) => {
    URL.revokeObjectURL(videoPreviews[index]);
    setUploadedVideos([]);
    setVideoPreviews([]);
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error("Please enter post content");
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }
    // In a real app, you would upload files to a server here
    toast.success("Post created successfully!");
    // Reset form
    setContent("");
    setUploadedImages([]);
    setUploadedVideos([]);
    // Clean up object URLs
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    videoPreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setVideoPreviews([]);
    onClose();
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      videoPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews, videoPreviews]);

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

          {/* Modal Container - Centers the modal */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl max-h-[90vh] bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
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
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Form */}
                <div className="space-y-6">
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

              {/* Media Upload Section */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Upload Creatives</label>
                <div className="space-y-3">
                  {/* Image Upload */}
                  <div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}
                      className="w-full gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Images ({uploadedImages.length}/10)
                    </Button>
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border border-border"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full gap-2"
                      disabled={uploadedVideos.length > 0}
                    >
                      <Video className="w-4 h-4" />
                      Upload Video {uploadedVideos.length > 0 && "(1/1)"}
                    </Button>
                    {videoPreviews.length > 0 && (
                      <div className="mt-3 relative">
                        <video
                          src={videoPreviews[0]}
                          controls
                          className="w-full h-48 rounded-lg border border-border"
                        />
                        <button
                          onClick={() => removeVideo(0)}
                          className="absolute top-2 right-2 p-2 rounded-full bg-destructive text-destructive-foreground"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
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
                    <button 
                      onClick={() => imageInputRef.current?.click()}
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      title="Upload image"
                    >
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => videoInputRef.current?.click()}
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      title="Upload video"
                    >
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

                {/* Right Column - Platform-Specific Previews */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Platform Previews</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {showPreview ? "Hide" : "Show"} Preview
                    </Button>
                  </div>
                  
                  {showPreview && (
                    <div className="sticky top-4 space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
                      {selectedPlatforms.map((platformId) => {
                        const platform = platforms.find(p => p.id === platformId);
                        if (!platform) return null;
                        const Icon = platform.icon;
                        
                        // Platform-specific styling
                        const getPlatformPreviewStyle = () => {
                          switch (platformId) {
                            case "instagram":
                              return {
                                container: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
                                contentBg: "bg-white",
                                textColor: "text-gray-900",
                                imageAspect: "aspect-square",
                                maxImages: 10,
                                showCarousel: imagePreviews.length > 1,
                              };
                            case "facebook":
                              return {
                                container: "bg-blue-50",
                                contentBg: "bg-white",
                                textColor: "text-gray-900",
                                imageAspect: "aspect-video",
                                maxImages: 10,
                                showCarousel: imagePreviews.length > 1,
                              };
                            case "linkedin":
                              return {
                                container: "bg-gray-50",
                                contentBg: "bg-white",
                                textColor: "text-gray-900",
                                imageAspect: "aspect-video",
                                maxImages: 4,
                                showCarousel: imagePreviews.length > 1,
                              };
                            case "twitter":
                              return {
                                container: "bg-black",
                                contentBg: "bg-gray-900",
                                textColor: "text-white",
                                imageAspect: "aspect-video",
                                maxImages: 4,
                                showCarousel: imagePreviews.length > 1,
                              };
                            case "tiktok":
                              return {
                                container: "bg-black",
                                contentBg: "bg-gray-900",
                                textColor: "text-white",
                                imageAspect: "aspect-[9/16]",
                                maxImages: 1,
                                showCarousel: false,
                              };
                            default:
                              return {
                                container: "bg-secondary",
                                contentBg: "bg-card",
                                textColor: "text-foreground",
                                imageAspect: "aspect-video",
                                maxImages: 10,
                                showCarousel: false,
                              };
                          }
                        };

                        const style = getPlatformPreviewStyle();
                        const displayImages = imagePreviews.slice(0, style.maxImages);
                        const hasMedia = imagePreviews.length > 0 || videoPreviews.length > 0;

                        return (
                          <div key={platformId} className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <Icon className={cn("w-4 h-4", platform.color)} />
                              <span className="text-sm font-medium text-foreground">{platform.label}</span>
                            </div>
                            
                            <div className={cn(
                              "rounded-lg overflow-hidden border border-border shadow-sm",
                              style.container
                            )}>
                              {/* Platform Header */}
                              <div className={cn("p-3 border-b border-border/50", style.contentBg)}>
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-primary">
                                      {selectedClient.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                    </span>
                                  </div>
                                  <div>
                                    <div className={cn("text-sm font-semibold", style.textColor)}>
                                      {selectedClient}
                                    </div>
                                    {platformId === "twitter" && (
                                      <div className="text-xs text-gray-500">@{selectedClient.toLowerCase().replace(/\s+/g, '')}</div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Media Preview - Platform Specific */}
                              {hasMedia && (
                                <div className={cn("relative", style.contentBg)}>
                                  {videoPreviews.length > 0 && platformId === "tiktok" ? (
                                    <div className={style.imageAspect}>
                                      <video
                                        src={videoPreviews[0]}
                                        controls
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : videoPreviews.length > 0 ? (
                                    <div className="aspect-video">
                                      <video
                                        src={videoPreviews[0]}
                                        controls
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : displayImages.length > 0 ? (
                                    <div className={cn(
                                      displayImages.length === 1 
                                        ? style.imageAspect 
                                        : displayImages.length === 2
                                        ? "grid grid-cols-2"
                                        : displayImages.length === 3
                                        ? "grid grid-cols-2"
                                        : "grid grid-cols-2"
                                    )}>
                                      {displayImages.map((preview, index) => (
                                        <div
                                          key={index}
                                          className={cn(
                                            "relative overflow-hidden",
                                            displayImages.length === 1 ? style.imageAspect : "aspect-square",
                                            displayImages.length === 3 && index === 0 && "col-span-2"
                                          )}
                                        >
                                          <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                          {displayImages.length > 4 && index === 3 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                              <span className={cn("text-white font-semibold", style.textColor === "text-white" ? "text-white" : "text-white")}>
                                                +{imagePreviews.length - 4}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              )}

                              {/* Content Preview */}
                              <div className={cn("p-3 space-y-2", style.contentBg)}>
                                {content ? (
                                  <p className={cn(
                                    "text-sm whitespace-pre-wrap break-words",
                                    style.textColor,
                                    platformId === "twitter" && content.length > 280 && "text-red-500"
                                  )}>
                                    {content}
                                    {platformId === "twitter" && (
                                      <span className="block mt-2 text-xs text-gray-500">
                                        {content.length}/280 characters
                                      </span>
                                    )}
                                  </p>
                                ) : (
                                  <p className={cn("text-sm italic opacity-50", style.textColor)}>
                                    Your post content will appear here...
                                  </p>
                                )}

                                {/* Platform-specific features */}
                                {platformId === "instagram" && (
                                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-border/50">
                                    <span>❤️ Like</span>
                                    <span>💬 Comment</span>
                                    <span>📤 Share</span>
                                    <span>🔖 Save</span>
                                  </div>
                                )}

                                {platformId === "linkedin" && (
                                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-border/50">
                                    <span>👍 Like</span>
                                    <span>💬 Comment</span>
                                    <span>🔄 Repost</span>
                                    <span>📤 Send</span>
                                  </div>
                                )}

                                {platformId === "facebook" && (
                                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-border/50">
                                    <span>👍 Like</span>
                                    <span>💬 Comment</span>
                                    <span>📤 Share</span>
                                  </div>
                                )}

                                {platformId === "twitter" && (
                                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-border/50">
                                    <span>💬 Reply</span>
                                    <span>🔄 Retweet</span>
                                    <span>❤️ Like</span>
                                    <span>📤 Share</span>
                                  </div>
                                )}
                              </div>

                              {/* Schedule Info */}
                              <div className={cn(
                                "px-3 py-2 border-t border-border/50 flex items-center gap-4 text-xs",
                                style.contentBg,
                                style.textColor === "text-white" ? "text-gray-400" : "text-muted-foreground"
                              )}>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{selectedDate}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{selectedTime}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-secondary/50">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleSubmit}>
                  Save as Draft
                </Button>
                <Button 
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={handleSubmit}
                >
                  <Send className="w-4 h-4" />
                  Schedule Post
                </Button>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
