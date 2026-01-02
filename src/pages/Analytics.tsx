import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { PerformanceChart } from "@/components/content/PerformanceChart";
import { useDateRange } from "@/hooks/useDateRange";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/auth";
import { contentService } from "@/services/contentService";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  Share2, 
  Users,
  Calendar,
  Filter,
  Mail,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock analytics data for client company
const mockAnalytics = {
  overview: {
    totalViews: 125000,
    totalEngagements: 8500,
    engagementRate: 6.8,
    totalReach: 98000,
    followers: 12500,
  },
  platformStats: [
    { platform: "Instagram", posts: 45, engagements: 3200, reach: 42000, engagementRate: 7.6 },
    { platform: "LinkedIn", posts: 28, engagements: 2100, reach: 35000, engagementRate: 6.0 },
    { platform: "Facebook", posts: 32, engagements: 1800, reach: 15000, engagementRate: 12.0 },
    { platform: "Twitter", posts: 67, engagements: 1400, reach: 6000, engagementRate: 23.3 },
  ],
  topContent: [
    { title: "Q1 Product Launch", type: "Campaign", engagements: 2500, reach: 18000 },
    { title: "Company Culture Post", type: "Social", engagements: 1800, reach: 12000 },
    { title: "Industry Insights", type: "Blog", engagements: 1500, reach: 10000 },
    { title: "Customer Success Story", type: "Case Study", engagements: 1200, reach: 8000 },
  ],
  recentActivity: [
    { date: "2026-01-15", action: "Campaign Published", platform: "LinkedIn", performance: "+15% engagement" },
    { date: "2026-01-14", action: "Post Scheduled", platform: "Instagram", performance: "Scheduled" },
    { date: "2026-01-13", action: "Content Approved", platform: "Facebook", performance: "Approved" },
    { date: "2026-01-12", action: "Campaign Completed", platform: "Twitter", performance: "+8% reach" },
  ],
};

const Analytics = () => {
  const { preset, dateRange, updatePreset, updateCustomRange } = useDateRange();
  const { can, isAgencyUser } = usePermissions();
  const [selectedMetric, setSelectedMetric] = useState("all");

  // Get data from content service
  const socialMediaPosts = useMemo(() => contentService.getSocialMediaPosts(), []);
  const campaigns = useMemo(() => contentService.getCampaigns(), []);
  const blogPosts = useMemo(() => contentService.getBlogPosts(), []);

  // Generate chart data for social media performance
  const socialMediaChartData = useMemo(() => {
    const publishedPosts = socialMediaPosts.filter(p => p.status === "published" && p.engagement);
    return publishedPosts.slice(0, 7).map((post, idx) => ({
      date: post.publishedAt || new Date(Date.now() - (7 - idx) * 24 * 60 * 60 * 1000).toISOString(),
      likes: post.engagement?.likes || 0,
      comments: post.engagement?.comments || 0,
      shares: post.engagement?.shares || 0,
      reach: post.engagement?.reach || 0,
    }));
  }, [socialMediaPosts]);

  // Generate chart data for campaign performance
  const campaignChartData = useMemo(() => {
    const activeCampaigns = campaigns.filter(c => c.metrics && (c.status === "sent" || c.status === "active"));
    return activeCampaigns.slice(0, 7).map((campaign, idx) => ({
      date: campaign.sentAt || new Date(Date.now() - (7 - idx) * 24 * 60 * 60 * 1000).toISOString(),
      opened: campaign.metrics?.opened || 0,
      clicked: campaign.metrics?.clicked || 0,
      revenue: campaign.metrics?.revenue || 0,
    }));
  }, [campaigns]);

  // Generate chart data for blog performance
  const blogChartData = useMemo(() => {
    const publishedBlogs = blogPosts.filter(b => b.status === "published" && b.metrics);
    return publishedBlogs.slice(0, 7).map((blog, idx) => ({
      date: blog.publishedAt || new Date(Date.now() - (7 - idx) * 24 * 60 * 60 * 1000).toISOString(),
      views: blog.metrics?.views || 0,
      likes: blog.metrics?.likes || 0,
      comments: blog.metrics?.comments || 0,
    }));
  }, [blogPosts]);

  if (!can(Permission.VIEW_ANALYTICS)) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Access Denied</h3>
            <p className="text-muted-foreground">You don't have permission to view analytics.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

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
            <h1 className="text-2xl font-bold text-foreground">Analytics & Performance</h1>
            <p className="text-muted-foreground mt-1">Track your company's content performance and engagement</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="reach">Reach</SelectItem>
                <SelectItem value="views">Views</SelectItem>
              </SelectContent>
            </Select>
            <DateRangeFilter
              preset={preset}
              dateRange={dateRange}
              onPresetChange={updatePreset}
              onCustomRangeChange={updateCustomRange}
            />
          </div>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Views</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{mockAnalytics.overview.totalViews.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Engagements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{mockAnalytics.overview.totalEngagements.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Engagement Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <div className="text-2xl font-bold">{mockAnalytics.overview.engagementRate}%</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Reach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{mockAnalytics.overview.totalReach.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Followers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div className="text-2xl font-bold">{mockAnalytics.overview.followers.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Chart - Only for agency users */}
        {isAgencyUser() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RevenueChart dateRange={dateRange} />
          </motion.div>
        )}

        {/* Social Media Performance Chart */}
        {socialMediaChartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <PerformanceChart
              data={socialMediaChartData}
              metrics={["likes", "comments", "shares", "reach"]}
              title="Social Media Performance"
              description="Engagement metrics across all social media platforms"
              chartType="line"
            />
          </motion.div>
        )}

        {/* Campaign Performance Chart */}
        {isAgencyUser() && campaignChartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PerformanceChart
              data={campaignChartData}
              metrics={["opened", "clicked", "revenue"]}
              title="Campaign Performance"
              description="Email and marketing campaign metrics"
              chartType="area"
            />
          </motion.div>
        )}

        {/* Blog Performance Chart */}
        {blogChartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <PerformanceChart
              data={blogChartData}
              metrics={["views", "likes", "comments"]}
              title="Blog Performance"
              description="Blog post views and engagement metrics"
              chartType="line"
            />
          </motion.div>
        )}

        {/* Platform Performance & Top Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance</CardTitle>
              <CardDescription>Performance metrics by platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.platformStats.map((platform, index) => (
                  <motion.div
                    key={platform.platform}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-foreground mb-1">{platform.platform}</div>
                      <div className="text-sm text-muted-foreground">
                        {platform.posts} posts • {platform.engagements.toLocaleString()} engagements
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{platform.engagementRate}%</div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Content */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your best performing content pieces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.topContent.map((content, index) => (
                  <motion.div
                    key={content.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-foreground mb-1">{content.title}</div>
                      <div className="text-sm text-muted-foreground">{content.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{content.engagements.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">engagements</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest content activities and performance updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAnalytics.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">{activity.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {activity.platform} • {activity.date}
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "text-sm font-medium",
                    activity.performance.includes("+") ? "text-success" : "text-muted-foreground"
                  )}>
                    {activity.performance}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Analytics;

