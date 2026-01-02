export interface Notification {
  id: number;
  type: 'approval' | 'invoice' | 'deadline' | 'campaign';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export type NotificationType = Notification['type'];

