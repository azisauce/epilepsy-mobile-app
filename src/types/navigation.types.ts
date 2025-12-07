// src/types/navigation.types.ts

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Stack (for both parent and child)
export type MainStackParamList = {
  ParentTabs: NavigatorScreenParams<ParentTabParamList>;
  ChildTabs: NavigatorScreenParams<ChildTabParamList>;
  Profile: undefined;
  LessonDetail: { lessonId: string; themeId: string };
  ChildDetail: { childId: string };
};

// Parent Bottom Tabs
export type ParentTabParamList = {
  Home: undefined;
  Themes: undefined;
  LinkedChildren: undefined;
  Notifications: undefined;
};

// Child Bottom Tabs
export type ChildTabParamList = {
  Home: undefined;
  Themes: undefined;
  LocationTracking: undefined;
  Parents: undefined;
  Notifications: undefined;
};

// Screen Props Types

// Auth Screens
export type WelcomeScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Welcome'
>;

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Login'
>;

export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

export type ForgotPasswordScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

// Parent Tab Screens
export type ParentHomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ParentTabParamList, 'Home'>,
  NativeStackScreenProps<MainStackParamList>
>;

export type ParentThemesScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ParentTabParamList, 'Themes'>,
  NativeStackScreenProps<MainStackParamList>
>;

export type LinkedChildrenScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ParentTabParamList, 'LinkedChildren'>,
  NativeStackScreenProps<MainStackParamList>
>;

export type ParentNotificationsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ParentTabParamList, 'Notifications'>,
  NativeStackScreenProps<MainStackParamList>
>;

// Child Tab Screens
export type ChildHomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ChildTabParamList, 'Home'>,
  NativeStackScreenProps<MainStackParamList>
>;

export type ChildThemesScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ChildTabParamList, 'Themes'>,
  NativeStackScreenProps<MainStackParamList>
>;

export type LocationTrackingScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ChildTabParamList, 'LocationTracking'>,
  NativeStackScreenProps<MainStackParamList>
>;

export type ParentsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ChildTabParamList, 'Parents'>,
  NativeStackScreenProps<MainStackParamList>
>;

export type ChildNotificationsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<ChildTabParamList, 'Notifications'>,
  NativeStackScreenProps<MainStackParamList>
>;

// Shared Screens
export type ProfileScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'Profile'
>;

export type LessonDetailScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'LessonDetail'
>;

export type ChildDetailScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'ChildDetail'
>;

// Navigation Props
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}