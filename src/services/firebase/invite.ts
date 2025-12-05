import { firebaseFirestore } from './config';
import { getCurrentUser, getCurrentUserData } from './auth';

export interface InviteData {
  inviteCode: string;
  invitedBy: string;
  inviterRole: 'A' | 'B';
  invitedRole: 'A' | 'B'; // The role the invited person will have
  used: boolean;
  usedBy?: string;
  usedAt?: any;
  createdAt: any;
  expiresAt: any;
}

/**
 * Generate a unique invite code
 */
const generateInviteCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

/**
 * Create an invite link/code
 * User A can invite User B, and vice versa
 */
export const createInvite = async (): Promise<{
  inviteCode: string;
  inviteLink: string;
  qrCodeData: string;
}> => {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error('You must be logged in to create an invite');
    }

    // Get current user's data to check their role
    const userData = await getCurrentUserData();
    const inviterRole = userData.role as 'A' | 'B';

    // Determine what role the invited person will have
    // If I'm User A, I can only invite User B (and vice versa)
    const invitedRole = inviterRole === 'A' ? 'B' : 'A';

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    
    // Check if code already exists (very unlikely but just in case)
    let codeExists = true;
    while (codeExists) {
      const existingDoc = await firebaseFirestore()
        .collection('invites')
        .doc(inviteCode)
        .get();
      
      if (!existingDoc.exists) {
        codeExists = false;
      } else {
        inviteCode = generateInviteCode();
      }
    }

    // Create invite document
    const inviteData: Omit<InviteData, 'inviteCode'> = {
      invitedBy: currentUser.uid,
      inviterRole: inviterRole,
      invitedRole: invitedRole,
      used: false,
      createdAt: firebaseFirestore.FieldValue.serverTimestamp(),
      expiresAt: firebaseFirestore.FieldValue.serverTimestamp(), // TODO: Set expiration (e.g., 7 days)
    };

    await firebaseFirestore()
      .collection('invites')
      .doc(inviteCode)
      .set(inviteData);

    // Generate invite link (deep link)
    const inviteLink = `yourapp://invite/${inviteCode}`;
    
    // For QR code - you can use the invite link or just the code
    const qrCodeData = inviteCode;

    console.log('✅ Invite created successfully:', inviteCode);

    return {
      inviteCode,
      inviteLink,
      qrCodeData,
    };
  } catch (error: any) {
    console.error('❌ Create invite error:', error);
    throw new Error(error.message || 'Failed to create invite');
  }
};

/**
 * Validate an invite code
 * Returns invite data if valid, throws error if invalid
 */
export const validateInviteCode = async (inviteCode: string): Promise<InviteData> => {
  try {
    const inviteDoc = await firebaseFirestore()
      .collection('invites')
      .doc(inviteCode)
      .get();

    if (!inviteDoc.exists) {
      throw new Error('Invalid invite code');
    }

    const inviteData = inviteDoc.data() as Omit<InviteData, 'inviteCode'>;

    // Check if already used
    if (inviteData.used) {
      throw new Error('This invite code has already been used');
    }

    // Check if expired (if you implement expiration)
    // const now = new Date();
    // const expiresAt = inviteData.expiresAt?.toDate();
    // if (expiresAt && expiresAt < now) {
    //   throw new Error('This invite code has expired');
    // }

    console.log('✅ Invite code is valid');

    return {
      inviteCode,
      ...inviteData,
    };
  } catch (error: any) {
    console.error('❌ Validate invite error:', error);
    throw error;
  }
};

/**
 * Get all invites created by current user
 */
export const getMyInvites = async (): Promise<InviteData[]> => {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error('You must be logged in');
    }

    const invitesSnapshot = await firebaseFirestore()
      .collection('invites')
      .where('invitedBy', '==', currentUser.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const invites = invitesSnapshot.docs.map(doc => ({
      inviteCode: doc.id,
      ...doc.data(),
    })) as InviteData[];

    return invites;
  } catch (error: any) {
    console.error('❌ Get invites error:', error);
    throw new Error(error.message || 'Failed to get invites');
  }
};

/**
 * Delete/cancel an invite
 */
export const deleteInvite = async (inviteCode: string): Promise<void> => {
  try {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      throw new Error('You must be logged in');
    }

    // Check if user owns this invite
    const inviteDoc = await firebaseFirestore()
      .collection('invites')
      .doc(inviteCode)
      .get();

    if (!inviteDoc.exists) {
      throw new Error('Invite not found');
    }

    const inviteData = inviteDoc.data();
    
    if (inviteData?.invitedBy !== currentUser.uid) {
      throw new Error('You do not have permission to delete this invite');
    }

    if (inviteData?.used) {
      throw new Error('Cannot delete an invite that has already been used');
    }

    await firebaseFirestore()
      .collection('invites')
      .doc(inviteCode)
      .delete();

    console.log('✅ Invite deleted successfully');
  } catch (error: any) {
    console.error('❌ Delete invite error:', error);
    throw error;
  }
};

/**
 * Get invite statistics for current user
 */
export const getInviteStats = async (): Promise<{
  totalInvites: number;
  usedInvites: number;
  pendingInvites: number;
}> => {
  try {
    const invites = await getMyInvites();
    
    const usedInvites = invites.filter(invite => invite.used).length;
    const pendingInvites = invites.filter(invite => !invite.used).length;

    return {
      totalInvites: invites.length,
      usedInvites,
      pendingInvites,
    };
  } catch (error: any) {
    console.error('❌ Get invite stats error:', error);
    throw error;
  }
};

/**
 * Check if a user can be invited (validation before creating invite)
 * This prevents User A from inviting another User A, etc.
 */
export const canCreateInvite = async (): Promise<{
  canInvite: boolean;
  invitedRole: 'A' | 'B';
  message: string;
}> => {
  try {
    const userData = await getCurrentUserData();
    const inviterRole = userData.role as 'A' | 'B';
    const invitedRole = inviterRole === 'A' ? 'B' : 'A';

    return {
      canInvite: true,
      invitedRole,
      message: `You can invite User ${invitedRole}`,
    };
  } catch (error: any) {
    return {
      canInvite: false,
      invitedRole: 'A',
      message: error.message || 'Cannot create invite',
    };
  }
};