import { FirebaseApp, initializeApp } from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';

// Firebase is auto-initialized with google-services.json / GoogleService-Info.plist
// No need to call initializeApp() manually in React Native Firebase

// Export Firebase services
export const firebaseAuth = auth;
export const firebaseFirestore = firestore;
export const firebaseMessaging = messaging;
export const firebaseStorage = storage;

// Export types
export type {
  FirebaseAuthTypes,
  FirebaseFirestoreTypes,
  FirebaseMessagingTypes,
  FirebaseStorageTypes,
};

// Initialize Firestore settings (optional)
firestore().settings({
  persistence: true, // Enable offline persistence
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
});

console.log('Firebase initialized successfully');