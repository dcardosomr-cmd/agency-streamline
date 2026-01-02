import { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentClients } from "@/components/dashboard/RecentClients";
import { ProjectsOverview } from "@/components/dashboard/ProjectsOverview";
import { CampaignActivity } from "@/components/dashboard/CampaignActivity";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { TeamWorkload } from "@/components/dashboard/TeamWorkload";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { PerformanceChart } from "@/components/content/PerformanceChart";
import { useDateRange } from "@/hooks/useDateRange";
import { useDashboardData } from "@/hooks/useDashboardData";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/types/auth";
import { contentService } from "@/services/contentService";
import { useAuth } from "@/contexts/AuthContext";
import { DollarSign, Users, FolderKanban, FileCheck, BarChart3, UserCog, TrendingUp, Eye, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preset, dateRange, updatePreset, updateCustomRange } = useDateRange();
  const { stats } = useDashboardData(dateRange);
  const { isAgencyUser, canApproveContent, canViewAllClients, canManageUsers, can } = usePermissions();

  // Get client-specific data
  const clientPosts = useMemo(() => {
    if (!user || isAgencyUser()) return [];
    const allPosts = contentService.getSocialMediaPosts();
    return allPosts.filter(p => p.clientId === user.clientId && p.status === "published");
  }, [user, isAgencyUser]);

  const clientCampaigns = useMemo(() => {
    if (!user || isAgencyUser()) return [];
    const allCampaigns = contentService.getCampaigns();
    return allCampaigns.filter(c => c.clientId === user.clientId && c.metrics);
  }, [user, isAgencyUser]);

  const clientProjects = useMemo(() => {
    if (!user || isAgencyUser()) return [];
    const allProjects = contentService.getProjects();
    return allProjects.filter(p => p.clientId === user.clientId);
  }, [user, isAgencyUser]);

  // Calculate client metrics
  const clientMetrics = useMemo(() => {
    const totalEngagements = clientPosts.reduce((sum, p) => 
      sum + (p.engagement?.likes || 0) + (p.engagement?.comments || 0) + (p.engagement?.shares || 0), 0
    );
    const totalReach = clientPosts.reduce((sum, p) => sum + (p.engagement?.reach || 0), 0);
    const totalSpending = clientCampaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
    const engagementRate = totalReach > 0 ? (totalEngagements / totalReach) * 100 : 0;

    return {
      posts: clientPosts.length,
      campaigns: clientCampaigns.length,
      projects: clientProjects.length,
      spending: totalSpending,
      engagements: totalEngagements,
      reach: totalReach,
      engagementRate: Math.round(engagementRate * 10) / 10,
    };
  }, [clientPosts, clientCampaigns, clientProjects]);

  // Generate chart data for client
  const clientChartData = useMemo(() => {
    return clientPosts.slice(0, 7).map((post, idx) => ({
      date: post.publishedAt || new Date(Date.now() - (7 - idx) * 24 * 60 * 60 * 1000).toISOString(),
      likes: post.engagement?.likes || 0,
      comments: post.engagement?.comments || 0,
      shares: post.engagement?.shares || 0,
    }));
  }, [clientPosts]);

  const formatChange = (change: number): { value: string; type: "positive" | "negative" | "neutral" } => {
    if (change > 0) return { value: `+${change.toFixed(1)}%`, type: "positive" };
    if (change < 0) return { value: `${change.toFixed(1)}%`, type: "negative" };
    return { value: "0%", type: "neutral" };
  };

  const formatChangeCount = (change: number): { value: string; type: "positive" | "negative" | "neutral" } => {
    if (change > 0) return { value: `+${change}`, type: "positive" };
    if (change < 0) return { value: `${change}`, type: "negative" };
    return { value: "0", type: "neutral" };
  };

  // Build stat cards based on user permissions
  const statCards = stats.data ? [
    // Monthly Revenue - Only for agency users
    ...(isAgencyUser() ? [{
      title: "Monthly Revenue",
      value: `$${stats.data.monthlyRevenue.toLocaleString()}`,
      ...formatChange(stats.data.revenueChange),
      icon: DollarSign,
      onClick: () => navigate("/billing"),
    }] : []),
    // Active Clients - Only for agency users
    ...(canViewAllClients() ? [{
      title: "Active Clients",
      value: stats.data.activeClients.toString(),
      ...formatChangeCount(stats.data.clientsChange),
      icon: Users,
      onClick: () => navigate("/clients"),
    }] : []),
    // Active Projects - Only for agency users
    ...(canViewAllClients() ? [{
      title: "Active Projects",
      value: stats.data.activeProjects.toString(),
      ...formatChangeCount(stats.data.projectsChange),
      icon: FolderKanban,
      onClick: () => navigate("/projects"),
    }] : []),
    // Pending Approvals - For CLIENT_ADMIN and agency users
    ...(canApproveContent() ? [{
      title: "Pending Approvals",
      value: stats.data.pendingApprovals.toString(),
      ...formatChangeCount(stats.data.approvalsChange),
      icon: FileCheck,
      onClick: () => navigate("/approvals"),
    }] : []),
  ] : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Here's your agency overview</p>
          </div>
          <DateRangeFilter
            preset={preset}
            dateRange={dateRange}
            onPresetChange={updatePreset}
            onCustomRangeChange={updateCustomRange}
          />
        </motion.div>

        {/* Quick Actions - Only for agency users */}
        {isAgencyUser() && <QuickActions />}

        {/* Stats Grid */}
        {statCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, index) => (
              <StatCard
                key={stat.title}
                {...stat}
                delay={index * 0.05}
                isLoading={stats.isLoading}
                error={stats.error}
              />
            ))}
          </div>
        )}

        {/* Main Content Grid - Only show for agency users */}
        {isAgencyUser() && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Clients, Projects & Invoices */}
            <div className="lg:col-span-2 space-y-6">
              <RecentClients />
              <ProjectsOverview />
              <RecentInvoices />
            </div>

            {/* Right Column - Activity, Revenue, Deadlines & Team */}
            <div className="space-y-6">
              <CampaignActivity />
              <RevenueChart dateRange={dateRange} />
              <UpcomingDeadlines />
              <TeamWorkload />
            </div>
          </div>
        )}

        {/* Client Admin View - Enhanced dashboard with analytics */}
        {!isAgencyUser() && (
          <div className="space-y-6">
            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {canApproveContent() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all"
                  onClick={() => navigate("/approvals")}
                >
                  <FileCheck className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Content Approvals</h3>
                  <p className="text-sm text-muted-foreground">Review and approve content</p>
                </motion.div>
              )}
              {can(Permission.VIEW_ANALYTICS) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all"
                  onClick={() => navigate("/analytics")}
                >
                  <BarChart3 className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Analytics</h3>
                  <p className="text-sm text-muted-foreground">View performance metrics</p>
                </motion.div>
              )}
              {canManageUsers() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card rounded-xl p-6 cursor-pointer hover:border-primary/30 transition-all"
                  onClick={() => navigate("/users")}
                >
                  <UserCog className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">Team Management</h3>
                  <p className="text-sm text-muted-foreground">Manage your team users</p>
                </motion.div>
              )}
            </div>

            {/* Client Performance Metrics */}
            {can(Permission.VIEW_ANALYTICS) && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Published Posts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-muted-foreground" />
                        <div className="text-2xl font-bold">{clientMetrics.posts}</div>
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
                        <div className="text-2xl font-bold">{clientMetrics.engagements.toLocaleString()}</div>
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
                        <div className="text-2xl font-bold">{clientMetrics.engagementRate}%</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Reach</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-muted-foreground" />
                        <div className="text-2xl font-bold">{clientMetrics.reach.toLocaleString()}</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Chart */}
                {clientChartData.length > 0 && (
                  <PerformanceChart
                    data={clientChartData}
                    metrics={["likes", "comments", "shares"]}
                    title="Content Performance"
                    description="Engagement metrics for your published content"
                    chartType="line"
                  />
                )}

                {/* Spending Overview */}
                {clientMetrics.spending > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Spending Overview</CardTitle>
                      <CardDescription>Total budget allocated to campaigns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-foreground">
                        ${clientMetrics.spending.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Across {clientMetrics.campaigns} active campaign{clientMetrics.campaigns !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
