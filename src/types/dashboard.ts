export interface DashboardStats {
  monthlyRevenue: number;
  activeClients: number;
  activeProjects: number;
  pendingApprovals: number;
  revenueChange: number; // percentage
  clientsChange: number;
  projectsChange: number;
  approvalsChange: number;
}

export interface DeadlineItem {
  id: number;
  type: 'project' | 'invoice' | 'approval';
  title: string;
  dueDate: string;
  client: string;
  isOverdue: boolean;
  daysUntilDue: number;
  url?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  projectCount: number;
  capacity: number; // max projects
  utilization: number; // percentage
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type DateRangePreset = 'today' | 'thisWeek' | 'thisMonth' | 'lastMonth' | 'custom';

