import { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Bell, Check, FileText, Calendar, Share2, Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@/types/notifications";

const typeIcons = {
  approval: FileText,
  invoice: FileText,
  deadline: Calendar,
  campaign: Share2,
};

const typeColors = {
  approval: "text-primary",
  invoice: "text-warning",
  deadline: "text-destructive",
  campaign: "text-success",
};

const typeBgColors = {
  approval: "bg-primary/10",
  invoice: "bg-warning/10",
  deadline: "bg-destructive/10",
  campaign: "bg-success/10",
};

export default function Notifications() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.getNotifications(),
    staleTime: 30000,
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const markAsRead = (id: number) => {
    queryClient.setQueryData<Notification[]>(["notifications"], (old) => {
      if (!old) return old;
      return old.map(n => n.id === id ? { ...n, read: true } : n);
    });
  };

  const markAllAsRead = () => {
    queryClient.setQueryData<Notification[]>(["notifications"], (old) => {
      if (!old) return old;
      return old.map(n => ({ ...n, read: true }));
    });
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const filteredNotifications = filter === "all"
    ? notifications
    : notifications?.filter(n => !n.read);

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
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with all your activities
              {unreadCount > 0 && (
                <span className="text-primary font-medium ml-1">• {unreadCount} unread</span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark all as read
            </Button>
          )}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2"
        >
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              filter === "unread"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="glass-card rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNotifications && filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => {
              const Icon = typeIcons[notification.type];
              const color = typeColors[notification.type];
              const bgColor = typeBgColors[notification.type];

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "glass-card rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-all",
                    !notification.read && "bg-primary/5 border-primary/20"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-lg shrink-0", bgColor)}>
                      <Icon className={cn("w-5 h-5", color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={cn(
                          "text-sm font-medium text-foreground",
                          !notification.read && "font-semibold"
                        )}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-2 shrink-0">
                          {!notification.read && (
                            <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                          )}
                          {notification.actionUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(notification.actionUrl!);
                              }}
                            >
                              View
                            </Button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-xl p-12 text-center"
            >
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {filter === "unread" ? "No unread notifications" : "No notifications"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

