export interface Invite {
  inviteCode: string;
  invitedBy: string;
  inviterRole: 'A' | 'B';
  invitedRole: 'A' | 'B';
  used: boolean;
  usedBy?: string;
  usedAt?: any;
  createdAt: any;
  expiresAt: any;
}

export interface InviteResponse {
  inviteCode: string;
  inviteLink: string;
  qrCodeData: string;
}