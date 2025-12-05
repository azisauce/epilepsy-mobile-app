export type UserRole = 'A' | 'B';

export interface User extends UserData {
  id: string;
}

export interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: any;
  updatedAt: any;
}

export interface UserBLocation {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: any;
  updatedAt: any;
}

export interface Connection {
  id: string;
  userAId: string;
  userBId: string;
  createdBy: string;
  status: 'active' | 'pending' | 'removed';
  createdAt: any;
  updatedAt: any;
}

export interface Notification {
  id: string;
  fromUserId: string;
  toUserId: string;
  type: 'shake_alert';
  location: {
    latitude: number;
    longitude: number;
  };
  message: string;
  read: boolean;
  timestamp: any;
  createdAt: any;
}