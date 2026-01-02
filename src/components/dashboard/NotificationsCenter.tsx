import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Bell, Check, X, Mail, FileText, Calendar, Share2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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

export function NotificationsCenter() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => api.getNotifications(),
    staleTime: 30000,
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  const markAsRead = (id: number) => {
    queryClient.setQueryData<typeof notifications>(["notifications"], (old) => {
      if (!old) return old;
      return old.map(n => n.id === id ? { ...n, read: true } : n);
    });
  };

  const markAllAsRead = () => {
    queryClient.setQueryData<typeof notifications>(["notifications"], (old) => {
      if (!old) return old;
      return old.map(n => ({ ...n, read: true }));
    });
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary"
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification, index) => {
                const Icon = typeIcons[notification.type];
                const color = typeColors[notification.type];

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-secondary/30 transition-colors",
                      !notification.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-lg bg-secondary/50", color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={cn(
                            "text-sm font-medium text-foreground",
                            !notification.read && "font-semibold"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>

        {notifications && notifications.length > 0 && (
          <div className="p-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center gap-2 text-sm"
              onClick={() => {
                navigate("/notifications");
                setIsOpen(false);
              }}
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

