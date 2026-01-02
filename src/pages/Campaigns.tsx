import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { ContentCalendar } from "@/components/campaigns/ContentCalendar";
import { PostQueue } from "@/components/campaigns/PostQueue";
import { PlatformStats } from "@/components/campaigns/PlatformStats";
import { CreatePostModal } from "@/components/campaigns/CreatePostModal";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calendar,
  ListTodo,
  BarChart3,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

type ViewType = "calendar" | "queue" | "analytics";

const Campaigns = () => {
  const [view, setView] = useState<ViewType>("calendar");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const views = [
    { id: "calendar" as const, label: "Calendar", icon: Calendar },
    { id: "queue" as const, label: "Queue", icon: ListTodo },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Content Planner</h1>
            <p className="text-muted-foreground mt-1">Schedule and manage your social media content</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </Button>
          </div>
        </motion.div>

        {/* View Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2"
        >
          {views.map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  view === v.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {v.label}
              </button>
            );
          })}
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <PlatformStats />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {view === "calendar" && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              <div className="xl:col-span-3">
                <ContentCalendar onCreatePost={() => setIsCreateModalOpen(true)} />
              </div>
              <div className="xl:col-span-1">
                <PostQueue />
              </div>
            </div>
          )}

          {view === "queue" && (
            <div className="max-w-4xl">
              <PostQueue />
            </div>
          )}

          {view === "analytics" && (
            <div className="glass-card rounded-xl p-8 text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Analytics Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Detailed analytics for your social media performance, including engagement rates, 
                reach, and best performing content.
              </p>
            </div>
          )}
        </motion.div>

        {/* Create Post Modal */}
        <CreatePostModal 
          isOpen={isCreateModalOpen} 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      </div>
    </AppLayout>
  );
};

export default Campaigns;
