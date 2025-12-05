import { UserData } from '../../types/user.types';
import { firebaseAuth, firebaseFirestore, FirebaseAuthTypes } from './config';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: 'A' | 'B';
  inviteCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<FirebaseAuthTypes.User> => {
  try {
    // 1. Create authentication account
    const userCredential = await firebaseAuth().createUserWithEmailAndPassword(
      data.email,
      data.password
    );

    const user = userCredential.user;

    // 2. Create user document in Firestore
    await firebaseFirestore()
      .collection('users')
      .doc(user.uid)
      .set({
        id: user.uid,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: data.role,
        createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });

    // 3. If User B, create initial location document
    if (data.role === 'B') {
      await firebaseFirestore()
        .collection('user_b_locations')
        .doc(user.uid)
        .set({
          userId: user.uid,
          latitude: 0,
          longitude: 0,
          accuracy: 0,
          timestamp: firebaseFirestore.FieldValue.serverTimestamp(),
          updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
        });
    }

    // 4. If registered with invite code, create connection
    if (data.inviteCode) {
      await processInviteCode(data.inviteCode, user.uid, data.role);
    }

    console.log('✅ User registered successfully:', user.uid);
    return user;
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<FirebaseAuthTypes.User> => {
  try {
    const userCredential = await firebaseAuth().signInWithEmailAndPassword(
      data.email,
      data.password
    );

    console.log('✅ User logged in successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    // Provide user-friendly error messages
    if (error.code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('Invalid email address');
    } else {
      throw new Error(error.message || 'Login failed');
    }
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await firebaseAuth().signOut();
    console.log('✅ User logged out successfully');
  } catch (error: any) {
    console.error('❌ Logout error:', error);
    throw new Error(error.message || 'Logout failed');
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return firebaseAuth().currentUser;
};

/**
 * Get current user's data from Firestore
 */
export const getCurrentUserData = async () => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('No user is currently logged in');
  }

  const userDoc = await firebaseFirestore()
    .collection('users')
    .doc(currentUser.uid)
    .get();

  if (!userDoc.exists) {
    throw new Error('User data not found');
  }

  return { id: userDoc.id, ...(userDoc.data() as UserData) };
};

/**
 * Reset password
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await firebaseAuth().sendPasswordResetEmail(email);
    console.log('✅ Password reset email sent');
  } catch (error: any) {
    console.error('❌ Password reset error:', error);
    throw new Error(error.message || 'Password reset failed');
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (data: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}): Promise<void> => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    throw new Error('No user is currently logged in');
  }

  try {
    await firebaseFirestore()
      .collection('users')
      .doc(currentUser.uid)
      .update({
        ...data,
        updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });

    console.log('✅ User profile updated');
  } catch (error: any) {
    console.error('❌ Profile update error:', error);
    throw new Error(error.message || 'Profile update failed');
  }
};

/**
 * Process invite code (creates connection)
 */
const processInviteCode = async (
  inviteCode: string,
  newUserId: string,
  newUserRole: 'A' | 'B'
): Promise<void> => {
  try {
    // Get invite document
    const inviteDoc = await firebaseFirestore()
      .collection('invites')
      .doc(inviteCode)
      .get();

    if (!inviteDoc.exists) {
      throw new Error('Invalid invite code');
    }

    const inviteData = inviteDoc.data();

    // Check if invite is still valid
    if (inviteData?.used) {
      throw new Error('This invite has already been used');
    }

    // Check if roles match (A can only invite B and vice versa)
    if (inviteData?.inviterRole === newUserRole) {
      throw new Error('Cannot connect users of the same type');
    }

    // Create connection
    const connectionData: any = {
      createdBy: inviteData?.invitedBy,
      status: 'active',
      createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
      updatedAt: firebaseFirestore.FieldValue.serverTimestamp(),
    };

    // Assign correct roles to connection
    if (newUserRole === 'A') {
      connectionData.userAId = newUserId;
      connectionData.userBId = inviteData?.invitedBy;
    } else {
      connectionData.userAId = inviteData?.invitedBy;
      connectionData.userBId = newUserId;
    }

    await firebaseFirestore()
      .collection('connections')
      .add(connectionData);

    // Mark invite as used
    await firebaseFirestore()
      .collection('invites')
      .doc(inviteCode)
      .update({
        used: true,
        usedBy: newUserId,
        usedAt: firebaseFirestore.FieldValue.serverTimestamp(),
      });

    console.log('✅ Connection created via invite code');
  } catch (error: any) {
    console.error('❌ Invite processing error:', error);
    throw error;
  }
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChanged = (callback: (user: FirebaseAuthTypes.User | null) => void) => {
  return firebaseAuth().onAuthStateChanged(callback);
};