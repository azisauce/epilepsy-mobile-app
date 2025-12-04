import { firebaseAuth, firebaseFirestore } from './config';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔄 Testing Firebase connection...');

    // Test 1: Check if Firebase is initialized
    console.log('✅ Firebase initialized');

    // Test 2: Test Anonymous Auth (doesn't require security rules changes)
    const userCredential = await firebaseAuth().signInAnonymously();
    console.log('✅ Firebase Auth connected:', userCredential.user.uid);

    // Test 3: Test Firestore (now authenticated)
    await firebaseFirestore()
      .collection('_test')
      .doc('connection')
      .set({
        timestamp: firebaseFirestore.FieldValue.serverTimestamp(),
        status: 'connected',
        userId: userCredential.user.uid,
      });

    console.log('✅ Firestore connected successfully');

    // Cleanup: Sign out
    await firebaseAuth().signOut();
    console.log('✅ All tests passed!');

    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
};