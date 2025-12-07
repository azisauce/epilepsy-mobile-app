export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  data?: NotificationData;
  read: boolean;
  createdAt: Date;
  readAt?: Date;
}

export interface NotificationData {
  lessonId?: string;
  childId?: string;
  parentId?: string;
  invitationId?: string;
  locationId?: string;
  achievementId?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface PushNotificationToken {
  userId: string;
  token: string;
  platform: 'ios' | 'android';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  data?: NotificationData;
}

export interface NotificationFilter {
  userId: string;
  read?: boolean;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}