import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { DateRange } from "@/types/dashboard";

export function useDashboardData(dateRange: DateRange) {
  const stats = useQuery({
    queryKey: ["dashboardStats", dateRange],
    queryFn: () => api.getDashboardStats(dateRange),
    staleTime: 30000, // 30 seconds
  });

  const recentClients = useQuery({
    queryKey: ["recentClients"],
    queryFn: () => api.getRecentClients(4),
    staleTime: 60000, // 1 minute
  });

  const activeProjects = useQuery({
    queryKey: ["activeProjects"],
    queryFn: () => api.getActiveProjects(4),
    staleTime: 60000,
  });

  const campaignActivities = useQuery({
    queryKey: ["campaignActivities"],
    queryFn: () => api.getCampaignActivities(5),
    staleTime: 30000,
  });

  const revenueData = useQuery({
    queryKey: ["revenueData", dateRange],
    queryFn: () => api.getRevenueData(dateRange, false),
    staleTime: 60000,
  });

  const revenueDataWithComparison = useQuery({
    queryKey: ["revenueDataWithComparison", dateRange],
    queryFn: () => api.getRevenueData(dateRange, true),
    enabled: false, // Only fetch when comparison is requested
    staleTime: 60000,
  });

  const upcomingDeadlines = useQuery({
    queryKey: ["upcomingDeadlines"],
    queryFn: () => api.getUpcomingDeadlines(7),
    staleTime: 30000,
  });

  const overdueItems = useQuery({
    queryKey: ["overdueItems"],
    queryFn: () => api.getOverdueItems(),
    staleTime: 30000,
  });

  const recentInvoices = useQuery({
    queryKey: ["recentInvoices"],
    queryFn: () => api.getRecentInvoices(5),
    staleTime: 60000,
  });

  const teamWorkload = useQuery({
    queryKey: ["teamWorkload"],
    queryFn: () => api.getTeamWorkload(),
    staleTime: 60000,
  });

  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.getNotifications(),
    staleTime: 30000,
  });

  return {
    stats,
    recentClients,
    activeProjects,
    campaignActivities,
    revenueData,
    revenueDataWithComparison,
    upcomingDeadlines,
    overdueItems,
    recentInvoices,
    teamWorkload,
    notifications,
  };
}

