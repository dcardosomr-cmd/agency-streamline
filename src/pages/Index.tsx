import { AppLayout } from "@/components/layout/AppLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentClients } from "@/components/dashboard/RecentClients";
import { ProjectsOverview } from "@/components/dashboard/ProjectsOverview";
import { CampaignActivity } from "@/components/dashboard/CampaignActivity";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { DollarSign, Users, FolderKanban, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Monthly Revenue",
    value: "$127,450",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Active Clients",
    value: "24",
    change: "+3",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Active Projects",
    value: "18",
    change: "+5",
    changeType: "positive" as const,
    icon: FolderKanban,
  },
  {
    title: "Pending Approvals",
    value: "7",
    change: "-2",
    changeType: "neutral" as const,
    icon: FileCheck,
  },
];

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, John. Here's your agency overview.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} delay={index * 0.05} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Clients & Projects */}
          <div className="lg:col-span-2 space-y-6">
            <RecentClients />
            <ProjectsOverview />
          </div>

          {/* Right Column - Activity & Revenue */}
          <div className="space-y-6">
            <CampaignActivity />
            <RevenueChart />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
