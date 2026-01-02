import { DashboardStats, DeadlineItem, TeamMember, DateRange } from "@/types/dashboard";
import { Notification } from "@/types/notifications";
import { subDays, subMonths, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format, parse, differenceInDays, isPast } from "date-fns";

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random errors (5% chance)
const shouldError = () => Math.random() < 0.05;

// Mock data
const mockClients = [
  { id: 1, name: "TechCorp Industries", email: "contact@techcorp.com", status: "active", projects: 5, revenue: 24500 },
  { id: 2, name: "Green Solutions Ltd", email: "info@greensolutions.com", status: "active", projects: 3, revenue: 18200 },
  { id: 3, name: "Nova Ventures", email: "hello@novaventures.io", status: "pending", projects: 2, revenue: 12800 },
  { id: 4, name: "Atlas Media Group", email: "team@atlasmedia.com", status: "active", projects: 7, revenue: 45600 },
  { id: 5, name: "Urban Development Co", email: "contact@urbandev.com", status: "active", projects: 4, revenue: 31200 },
];

const mockProjects = [
  { id: 1, name: "Q1 Brand Campaign", client: "TechCorp Industries", status: "in-progress", progress: 65, dueDate: "2026-01-15", priority: "high", team: ["JD", "AS", "MK"] },
  { id: 2, name: "Social Media Strategy", client: "Green Solutions Ltd", status: "in-progress", progress: 40, dueDate: "2026-01-22", priority: "medium", team: ["AS", "RB"] },
  { id: 3, name: "Website Redesign", client: "Nova Ventures", status: "review", progress: 90, dueDate: "2026-01-08", priority: "urgent", team: ["JD", "MK", "LT", "AS"] },
  { id: 4, name: "Email Marketing Series", client: "Atlas Media Group", status: "completed", progress: 100, dueDate: "2025-12-28", priority: "low", team: ["RB"] },
  { id: 5, name: "Product Launch Campaign", client: "TechCorp Industries", status: "planning", progress: 15, dueDate: "2026-02-10", priority: "high", team: ["JD", "AS"] },
  { id: 6, name: "Annual Report Design", client: "Urban Development Co", status: "in-progress", progress: 55, dueDate: "2026-01-30", priority: "medium", team: ["MK", "LT"] },
];

// Load projects from localStorage or use default data
const loadProjects = () => {
  try {
    const stored = localStorage.getItem("agency_projects_data");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load projects from localStorage:", error);
  }
  return mockProjects;
};

// Load approvals from localStorage or use default data
const loadApprovals = () => {
  try {
    const stored = localStorage.getItem("agency_approvals_data");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load approvals from localStorage:", error);
  }
  return [];
};

const mockInvoices = [
  { id: "INV-2026-001", client: "TechCorp Industries", amount: 12500, status: "paid", dueDate: "2026-01-15", paidDate: "2026-01-12" },
  { id: "INV-2026-002", client: "Green Solutions Ltd", amount: 8200, status: "pending", dueDate: "2026-01-20", paidDate: null },
  { id: "INV-2025-089", client: "Nova Ventures", amount: 4500, status: "overdue", dueDate: "2025-12-28", paidDate: null },
  { id: "INV-2025-088", client: "Atlas Media Group", amount: 18750, status: "paid", dueDate: "2025-12-20", paidDate: "2025-12-18" },
  { id: "INV-2026-003", client: "Urban Development Co", amount: 15600, status: "draft", dueDate: "2026-01-25", paidDate: null },
  { id: "INV-2025-087", client: "TechCorp Industries", amount: 9800, status: "paid", dueDate: "2025-12-10", paidDate: "2025-12-08" },
];

const mockActivities = [
  { id: 1, type: "email", title: "Newsletter Campaign Approved", client: "TechCorp Industries", time: "2 hours ago", status: "approved" },
  { id: 2, type: "social", title: "Instagram Post Scheduled", client: "Green Solutions Ltd", time: "4 hours ago", status: "pending" },
  { id: 3, type: "blog", title: "Blog Article Rejected", client: "Nova Ventures", time: "5 hours ago", status: "rejected" },
  { id: 4, type: "social", title: "LinkedIn Campaign Live", client: "Atlas Media Group", time: "1 day ago", status: "approved" },
  { id: 5, type: "email", title: "Promo Email Sent", client: "TechCorp Industries", time: "1 day ago", status: "approved" },
];

// Calculate revenue for a date range
const calculateRevenue = (dateRange: DateRange): number => {
  const { start, end } = dateRange;
  // Simulate revenue calculation based on invoices paid in range
  return mockInvoices
    .filter(inv => {
      if (!inv.paidDate) return false;
      const paidDate = parse(inv.paidDate, "yyyy-MM-dd", new Date());
      return paidDate >= start && paidDate <= end;
    })
    .reduce((sum, inv) => sum + inv.amount, 0);
};

// Calculate previous period revenue for comparison
const calculatePreviousPeriodRevenue = (dateRange: DateRange): number => {
  const daysDiff = differenceInDays(dateRange.end, dateRange.start);
  const prevStart = subDays(dateRange.start, daysDiff + 1);
  const prevEnd = subDays(dateRange.start, 1);
  return calculateRevenue({ start: prevStart, end: prevEnd });
};

export const api = {
  // Dashboard Stats
  async getDashboardStats(dateRange: DateRange): Promise<DashboardStats> {
    await delay(300 + Math.random() * 500);
    if (shouldError()) throw new Error("Failed to fetch dashboard stats");

    const currentRevenue = calculateRevenue(dateRange);
    const previousRevenue = calculatePreviousPeriodRevenue(dateRange);
    const revenueChange = previousRevenue > 0 
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    const activeClients = mockClients.filter(c => c.status === "active").length;
    const projects = loadProjects();
    const activeProjects = projects.filter(p => p.status === "in-progress" || p.status === "review").length;
    const approvals = loadApprovals();
    const pendingApprovals = approvals.filter((a: any) => a.status === "pending").length;

    // Calculate approvalsChange: track change from previous count
    // If no pending approvals, change should be 0 (can't show negative when count is 0)
    let approvalsChange = 0;
    if (pendingApprovals > 0) {
      try {
        const previousCount = localStorage.getItem("agency_approvals_previous_count");
        if (previousCount !== null) {
          const prevCount = parseInt(previousCount, 10);
          approvalsChange = pendingApprovals - prevCount;
        }
        // Store current count for next calculation
        localStorage.setItem("agency_approvals_previous_count", pendingApprovals.toString());
      } catch {
        // If error, just use 0
        approvalsChange = 0;
      }
    } else {
      // If pendingApprovals is 0, change is always 0
      approvalsChange = 0;
      // Clear the stored count since we're at 0
      try {
        localStorage.setItem("agency_approvals_previous_count", "0");
      } catch {
        // Ignore errors
      }
    }

    return {
      monthlyRevenue: currentRevenue,
      activeClients,
      activeProjects,
      pendingApprovals,
      revenueChange: Math.round(revenueChange * 10) / 10,
      clientsChange: 3,
      projectsChange: 5,
      approvalsChange,
    };
  },

  // Recent Clients
  async getRecentClients(limit: number = 4) {
    await delay(200 + Math.random() * 300);
    if (shouldError()) throw new Error("Failed to fetch clients");
    return mockClients.slice(0, limit).map(client => ({
      ...client,
      revenue: `$${client.revenue.toLocaleString()}`,
      lastActivity: "Just now",
    }));
  },

  // Active Projects
  async getActiveProjects(limit: number = 4) {
    await delay(250 + Math.random() * 350);
    if (shouldError()) throw new Error("Failed to fetch projects");
    const projects = loadProjects();
    return projects
      .filter(p => p.status === "in-progress" || p.status === "review")
      .slice(0, limit)
      .map(project => {
        // If dueDate is already in "MMM d, yyyy" format, keep it; otherwise format it
        let formattedDueDate = project.dueDate;
        try {
          // Try parsing as "yyyy-MM-dd" first
          const parsed = parse(project.dueDate, "yyyy-MM-dd", new Date());
          if (!isNaN(parsed.getTime())) {
            formattedDueDate = format(parsed, "MMM d, yyyy");
          }
          // If that fails, try parsing as "MMM d, yyyy" and keep it
          else {
            const parsed2 = parse(project.dueDate, "MMM d, yyyy", new Date());
            if (!isNaN(parsed2.getTime())) {
              formattedDueDate = project.dueDate; // Already formatted
            }
          }
        } catch {
          // Keep original if parsing fails
          formattedDueDate = project.dueDate;
        }
        return {
          ...project,
          dueDate: formattedDueDate,
        };
      });
  },

  // Campaign Activities
  async getCampaignActivities(limit: number = 5) {
    await delay(200 + Math.random() * 300);
    if (shouldError()) throw new Error("Failed to fetch activities");
    return mockActivities.slice(0, limit);
  },

  // Revenue Data
  async getRevenueData(dateRange: DateRange, comparePeriod: boolean = false) {
    await delay(300 + Math.random() * 400);
    if (shouldError()) throw new Error("Failed to fetch revenue data");

    const months: { month: string; revenue: number; previousRevenue?: number }[] = [];
    const start = startOfMonth(dateRange.start);
    const end = endOfMonth(dateRange.end);
    
    let current = start;
    while (current <= end) {
      const monthStart = startOfMonth(current);
      const monthEnd = endOfMonth(current);
      const monthRevenue = calculateRevenue({ start: monthStart, end: monthEnd });
      
      const data: { month: string; revenue: number; previousRevenue?: number } = {
        month: format(current, "MMM"),
        revenue: monthRevenue,
      };

      if (comparePeriod) {
        const prevMonth = subMonths(current, 1);
        const prevMonthStart = startOfMonth(prevMonth);
        const prevMonthEnd = endOfMonth(prevMonth);
        data.previousRevenue = calculateRevenue({ start: prevMonthStart, end: prevMonthEnd });
      }

      months.push(data);
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    return months;
  },

  // Upcoming Deadlines
  async getUpcomingDeadlines(days: number = 7): Promise<DeadlineItem[]> {
    await delay(250 + Math.random() * 300);
    if (shouldError()) throw new Error("Failed to fetch deadlines");

    const today = startOfDay(new Date());
    const deadlineDate = new Date(today);
    deadlineDate.setDate(deadlineDate.getDate() + days);

    const deadlines: DeadlineItem[] = [];

    // Add project deadlines
    const projects = loadProjects();
    projects.forEach(project => {
      // Handle both "yyyy-MM-dd" and "MMM d, yyyy" formats
      let dueDate: Date;
      try {
        dueDate = parse(project.dueDate, "yyyy-MM-dd", new Date());
        if (isNaN(dueDate.getTime())) {
          dueDate = parse(project.dueDate, "MMM d, yyyy", new Date());
        }
      } catch {
        dueDate = parse(project.dueDate, "MMM d, yyyy", new Date());
      }
      if (dueDate >= today && dueDate <= deadlineDate) {
        const daysUntilDue = differenceInDays(dueDate, today);
        deadlines.push({
          id: project.id,
          type: "project",
          title: project.name,
          dueDate: format(dueDate, "MMM d, yyyy"),
          client: project.client,
          isOverdue: false,
          daysUntilDue,
          url: `/projects`,
        });
      }
    });

    // Add invoice deadlines
    mockInvoices.forEach(invoice => {
      const dueDate = parse(invoice.dueDate, "yyyy-MM-dd", new Date());
      if (dueDate <= deadlineDate) {
        const daysUntilDue = differenceInDays(dueDate, today);
        deadlines.push({
          id: parseInt(invoice.id.split("-")[2]),
          type: "invoice",
          title: invoice.id,
          dueDate: format(dueDate, "MMM d, yyyy"),
          client: invoice.client,
          isOverdue: isPast(dueDate) && invoice.status !== "paid",
          daysUntilDue,
          url: `/billing`,
        });
      }
    });

    return deadlines.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  },

  // Overdue Items
  async getOverdueItems(): Promise<DeadlineItem[]> {
    await delay(200 + Math.random() * 250);
    if (shouldError()) throw new Error("Failed to fetch overdue items");

    const today = startOfDay(new Date());
    const overdue: DeadlineItem[] = [];

    // Overdue projects
    const projects = loadProjects();
    projects.forEach(project => {
      // Handle both "yyyy-MM-dd" and "MMM d, yyyy" formats
      let dueDate: Date;
      try {
        dueDate = parse(project.dueDate, "yyyy-MM-dd", new Date());
        if (isNaN(dueDate.getTime())) {
          dueDate = parse(project.dueDate, "MMM d, yyyy", new Date());
        }
      } catch {
        dueDate = parse(project.dueDate, "MMM d, yyyy", new Date());
      }
      if (isPast(dueDate) && project.status !== "completed") {
        overdue.push({
          id: project.id,
          type: "project",
          title: project.name,
          dueDate: format(dueDate, "MMM d, yyyy"),
          client: project.client,
          isOverdue: true,
          daysUntilDue: differenceInDays(today, dueDate),
          url: `/projects`,
        });
      }
    });

    // Overdue invoices
    mockInvoices.forEach(invoice => {
      const dueDate = parse(invoice.dueDate, "yyyy-MM-dd", new Date());
      if (isPast(dueDate) && invoice.status !== "paid") {
        overdue.push({
          id: parseInt(invoice.id.split("-")[2]),
          type: "invoice",
          title: invoice.id,
          dueDate: format(dueDate, "MMM d, yyyy"),
          client: invoice.client,
          isOverdue: true,
          daysUntilDue: differenceInDays(today, dueDate),
          url: `/billing`,
        });
      }
    });

    return overdue;
  },

  // Recent Invoices
  async getRecentInvoices(limit: number = 5) {
    await delay(200 + Math.random() * 300);
    if (shouldError()) throw new Error("Failed to fetch invoices");
    return mockInvoices
      .sort((a, b) => {
        const dateA = parse(a.dueDate, "yyyy-MM-dd", new Date());
        const dateB = parse(b.dueDate, "yyyy-MM-dd", new Date());
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit)
      .map(invoice => ({
        ...invoice,
        dueDate: format(parse(invoice.dueDate, "yyyy-MM-dd", new Date()), "MMM d, yyyy"),
        paidDate: invoice.paidDate 
          ? format(parse(invoice.paidDate, "yyyy-MM-dd", new Date()), "MMM d, yyyy")
          : null,
      }));
  },

  // Team Workload
  async getTeamWorkload(): Promise<TeamMember[]> {
    await delay(250 + Math.random() * 300);
    if (shouldError()) throw new Error("Failed to fetch team workload");

    const teamMembers: { [key: string]: { name: string; initials: string; projects: number } } = {
      "JD": { name: "John Doe", initials: "JD", projects: 0 },
      "AS": { name: "Alice Smith", initials: "AS", projects: 0 },
      "MK": { name: "Mike Kim", initials: "MK", projects: 0 },
      "LT": { name: "Lisa Turner", initials: "LT", projects: 0 },
      "RB": { name: "Rachel Brooks", initials: "RB", projects: 0 },
    };

    // Count projects per team member
    const projects = loadProjects();
    projects.forEach(project => {
      const team = project.team || [];
      team.forEach((member: string) => {
        if (teamMembers[member]) {
          teamMembers[member].projects++;
        }
      });
    });

    return Object.values(teamMembers).map((member, index) => ({
      id: `member-${index + 1}`,
      name: member.name,
      initials: member.initials,
      projectCount: member.projects,
      capacity: 5, // Max projects per member
      utilization: (member.projects / 5) * 100,
    }));
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    await delay(200 + Math.random() * 300);
    if (shouldError()) throw new Error("Failed to fetch notifications");

    const notifications: Notification[] = [];

    // Pending approvals
    const approvals = loadApprovals();
    const pendingCount = approvals.filter((a: any) => a.status === "pending").length;
    if (pendingCount > 0) {
      notifications.push({
        id: 1,
        type: "approval",
        title: "Content Pending Review",
        message: `${pendingCount} item${pendingCount === 1 ? '' : 's'} ${pendingCount === 1 ? 'is' : 'are'} waiting for your approval`,
        timestamp: "2 hours ago",
        read: false,
        actionUrl: "/approvals",
      });
    }

    // Overdue invoices
    const overdueInvoices = mockInvoices.filter(inv => {
      const dueDate = parse(inv.dueDate, "yyyy-MM-dd", new Date());
      return isPast(dueDate) && inv.status !== "paid";
    });
    if (overdueInvoices.length > 0) {
      notifications.push({
        id: 2,
        type: "invoice",
        title: "Overdue Invoices",
        message: `${overdueInvoices.length} invoice(s) are overdue`,
        timestamp: "1 day ago",
        read: false,
        actionUrl: "/billing",
      });
    }

    // Upcoming deadlines
    notifications.push({
      id: 3,
      type: "deadline",
      title: "Deadlines Approaching",
      message: "2 projects have deadlines in the next 3 days",
      timestamp: "3 hours ago",
      read: true,
      actionUrl: "/projects",
    });

    // Campaign updates
    notifications.push({
      id: 4,
      type: "campaign",
      title: "Campaign Published",
      message: "LinkedIn campaign for Atlas Media Group is now live",
      timestamp: "5 hours ago",
      read: false,
      actionUrl: "/campaigns",
    });

    return notifications;
  },
};

