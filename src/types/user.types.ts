import { UserType } from './auth.types';
import { Location } from './location.types';
import { Notification } from './notification.types';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthday: Date;
  userType: UserType;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
  location?: Location;
  locationSharingEnabled?: boolean;
}

export interface Parent extends User {
  userType: UserType.PARENT;
  linkedChildren: string[]; // Array of child IDs
}

export interface Child extends User {
  userType: UserType.CHILD;
  linkedParents: string[]; // Array of parent IDs
  currentLocation?: Location;
  locationSharingEnabled: boolean;
}

export interface ChildProfile {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  position?: Location;
  lastNotification?: Notification;
}

export interface ParentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
}

export interface InviteData {
  email: string;
  inviterType: UserType;
  inviterId: string;
  inviterName: string;
}

export interface Invitation {
  id: string;
  inviterId: string;
  inviterName: string;
  inviterType: UserType;
  inviteeEmail: string;
  status: InvitationStatus;
  createdAt: Date;
  expiresAt: Date;
}

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  birthday?: Date;
  profileImage?: string;
  locationSharingEnabled?: boolean;
}