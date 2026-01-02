import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { 
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Users,
  Mail,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  {
    title: "Account",
    items: [
      { name: "Profile", description: "Manage your personal information", icon: User },
      { name: "Agency Details", description: "Update agency name, logo, and info", icon: Building2 },
      { name: "Notifications", description: "Configure email and push notifications", icon: Bell },
    ],
  },
  {
    title: "Security",
    items: [
      { name: "Password & Security", description: "Update password and 2FA settings", icon: Shield },
      { name: "API Keys", description: "Manage API access and integrations", icon: Key },
    ],
  },
  {
    title: "Workspace",
    items: [
      { name: "Team Members", description: "Invite and manage team access", icon: Users },
      { name: "Branding", description: "Customize client portal appearance", icon: Palette },
      { name: "Email Templates", description: "Configure automated email templates", icon: Mail },
    ],
  },
  {
    title: "Billing",
    items: [
      { name: "Subscription", description: "Manage your plan and usage", icon: CreditCard },
      { name: "Payment Methods", description: "Update payment information", icon: CreditCard },
    ],
  },
];

const Settings = () => {
  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and workspace preferences</p>
        </motion.div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.title}
              </h2>
              <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
                {section.items.map((item, itemIndex) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                    className="w-full flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors text-left group"
                  >
                    <div className="p-2.5 rounded-lg bg-secondary group-hover:bg-primary/10 transition-colors">
                      <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <svg
                      className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
