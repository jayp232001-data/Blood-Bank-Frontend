export enum BloodGroup {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

export interface Donor {
  id: string;
  name: string;
  age: number;
  bloodGroup: BloodGroup;
  lastDonationDate: string;
  contact: string;
  status: 'Active' | 'Deferred';
}

export interface BloodUnit {
  id: string;
  bloodGroup: BloodGroup;
  collectionDate: string;
  expiryDate: string;
  volume: number; // in ml
  status: 'Available' | 'Reserved' | 'Expired';
}

export interface DashboardStats {
  totalUnits: number;
  totalDonors: number;
  criticalLowStock: BloodGroup[];
  recentRequests: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}