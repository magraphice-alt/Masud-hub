/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WPThemeFile {
  name: string;
  path: string;
  description: string;
  code: string;
}

export interface SimulatedUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  password?: string;
  balance: number;
  role: 'user' | 'admin';
  createdAt: string;
  adminPin?: string; // Set during admin registration
  commissionMultiplier?: number;
}

export interface SimulatedTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userMobile: string;
  type: 'deposit' | 'send_money';
  amount: number;
  recipient?: string; // mobile number for send_money
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt?: string;
  referenceNo: string;
  authPin?: string; // Manual authorization PIN submitted by admin
  way?: string; // bkash, Nagad, Roket, Flexi, Other or deposit method
  isOverdraft?: boolean; // True if submitted with low balance and pending admin credit authorization
}

export interface SimulatedNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SimulatedActivityLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  ipAddress: string;
  createdAt: string;
}

export interface ThemeStats {
  totalUsers: number;
  totalDeposits: number;
  pendingDeposits: number;
  pendingSendMoneys: number;
  systemCommissionRate: number; // e.g. 1.5%
  totalCommissionEarned: number;
}
