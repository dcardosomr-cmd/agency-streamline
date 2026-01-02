import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Users,
  Mail,
  Key,
  UserCog
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, ROLE_DISPLAY_NAMES } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePermissions } from "@/hooks/usePermissions";
import { AgencyDetailsForm, loadAgencyDetails } from "@/components/settings/AgencyDetailsForm";
import { toast } from "@/components/ui/sonner";

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
  const [openSetting, setOpenSetting] = useState<string | null>(null);
  const { user, setUser } = useAuth();
  const { isAgencyUser } = usePermissions();

  const handleSettingClick = (settingName: string) => {
    setOpenSetting(settingName);
  };

  const handleCloseDialog = () => {
    setOpenSetting(null);
  };

  const getSettingContent = (settingName: string) => {
    const allItems = settingsSections.flatMap(section => section.items);
    const setting = allItems.find(item => item.name === settingName);
    return setting || null;
  };

  const handleRoleChange = (newRole: UserRole) => {
    if (user) {
      setUser({
        ...user,
        role: newRole,
      });
    }
  };

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

        {/* Role Switcher (Demo Only) */}
        {isAgencyUser() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-6 border-2 border-primary/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <UserCog className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Role Switcher (Demo)</h3>
                <p className="text-sm text-muted-foreground">Switch roles to test permissions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-foreground">Current Role:</label>
              <Select
                value={user?.role}
                onValueChange={(value) => handleRoleChange(value as UserRole)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(UserRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_DISPLAY_NAMES[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Note: This is for demonstration purposes only. In production, roles would be managed by administrators.
            </p>
          </motion.div>
        )}

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
                    onClick={() => handleSettingClick(item.name)}
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

      {/* Settings Dialog */}
      <Dialog open={openSetting !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl">
          {openSetting && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {(() => {
                    const setting = getSettingContent(openSetting);
                    if (setting) {
                      const Icon = setting.icon;
                      return (
                        <>
                          <Icon className="w-5 h-5" />
                          {setting.name}
                        </>
                      );
                    }
                    return openSetting;
                  })()}
                </DialogTitle>
                <DialogDescription>
                  {getSettingContent(openSetting)?.description}
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {openSetting === "Agency Details" ? (
                  <AgencyDetailsForm
                    initialData={loadAgencyDetails() || undefined}
                    onSave={() => {
                      toast.success("Agency details updated successfully");
                      handleCloseDialog();
                    }}
                    onCancel={handleCloseDialog}
                    showActions={true}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>This setting is currently being developed.</p>
                    <p className="text-sm mt-2">Settings content for "{openSetting}" will be available soon.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Settings;
