import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Mail, 
  Share2, 
  FileText,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  TrendingUp,
  Eye,
  MousePointer
} from "lucide-react";
import { cn } from "@/lib/utils";

const campaigns = [
  {
    id: 1,
    name: "Q1 Newsletter Series",
    client: "TechCorp Industries",
    type: "email",
    status: "active",
    startDate: "Jan 1, 2026",
    endDate: "Mar 31, 2026",
    metrics: { sent: 12500, opened: 4800, clicked: 890 },
  },
  {
    id: 2,
    name: "Product Launch Social",
    client: "Green Solutions Ltd",
    type: "social",
    status: "active",
    startDate: "Jan 5, 2026",
    endDate: "Jan 25, 2026",
    metrics: { impressions: 45000, engagement: 2300, clicks: 560 },
  },
  {
    id: 3,
    name: "Industry Insights Blog",
    client: "Nova Ventures",
    type: "blog",
    status: "draft",
    startDate: "Jan 10, 2026",
    endDate: "Ongoing",
    metrics: { views: 8200, shares: 340, comments: 45 },
  },
  {
    id: 4,
    name: "Holiday Promo Campaign",
    client: "Atlas Media Group",
    type: "email",
    status: "completed",
    startDate: "Dec 1, 2025",
    endDate: "Dec 31, 2025",
    metrics: { sent: 25000, opened: 12400, clicked: 3200 },
  },
  {
    id: 5,
    name: "Brand Awareness Push",
    client: "Urban Development Co",
    type: "social",
    status: "paused",
    startDate: "Dec 15, 2025",
    endDate: "Jan 15, 2026",
    metrics: { impressions: 78000, engagement: 4500, clicks: 1200 },
  },
];

const typeConfig = {
  email: { icon: Mail, color: "text-primary", bg: "bg-primary/10", label: "Email" },
  social: { icon: Share2, color: "text-success", bg: "bg-success/10", label: "Social" },
  blog: { icon: FileText, color: "text-warning", bg: "bg-warning/10", label: "Blog" },
};

const statusConfig = {
  active: { icon: Play, color: "text-success", bg: "bg-success/10", label: "Active" },
  draft: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted", label: "Draft" },
  paused: { icon: Pause, color: "text-warning", bg: "bg-warning/10", label: "Paused" },
  completed: { icon: CheckCircle2, color: "text-primary", bg: "bg-primary/10", label: "Completed" },
};

const Campaigns = () => {
  const [filter, setFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesStatus = filter === "all" || c.status === filter;
    const matchesType = typeFilter === "all" || c.type === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Campaigns</h1>
            <p className="text-muted-foreground mt-1">Multi-channel marketing management</p>
          </div>
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground w-fit">
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Type Filter */}
          <div className="flex gap-2">
            {["all", "email", "social", "blog"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  typeFilter === type
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {type !== "all" && (
                  <span className={typeConfig[type as keyof typeof typeConfig]?.color}>
                    {(() => {
                      const Icon = typeConfig[type as keyof typeof typeConfig]?.icon;
                      return Icon ? <Icon className="w-4 h-4" /> : null;
                    })()}
                  </span>
                )}
                {type === "all" ? "All Types" : typeConfig[type as keyof typeof typeConfig]?.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {["all", "active", "draft", "paused", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  filter === status
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {status === "all" ? "All" : statusConfig[status as keyof typeof statusConfig]?.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCampaigns.map((campaign, index) => {
            const type = typeConfig[campaign.type as keyof typeof typeConfig];
            const status = statusConfig[campaign.status as keyof typeof statusConfig];
            const TypeIcon = type.icon;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-lg", type.bg)}>
                      <TypeIcon className={cn("w-5 h-5", type.color)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {campaign.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{campaign.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", status.bg, status.color)}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </div>
                    <button className="p-1.5 rounded-md hover:bg-secondary transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{campaign.startDate}</span>
                  <span>→</span>
                  <span>{campaign.endDate}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  {campaign.type === "email" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{campaign.metrics.sent?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Sent</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{campaign.metrics.opened?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Opened</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MousePointer className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{campaign.metrics.clicked?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Clicked</p>
                        </div>
                      </div>
                    </>
                  ) : campaign.type === "social" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{campaign.metrics.impressions?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Impressions</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{campaign.metrics.engagement?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MousePointer className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{campaign.metrics.clicks?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Clicks</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{campaign.metrics.views?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{campaign.metrics.shares?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Shares</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{campaign.metrics.comments?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Comments</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Campaigns;
