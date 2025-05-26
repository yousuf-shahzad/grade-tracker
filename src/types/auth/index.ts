import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  nickname?: string;
  createdAt: Timestamp;
} 