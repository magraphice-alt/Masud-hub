/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  SimulatedUser, 
  SimulatedTransaction, 
  SimulatedNotification, 
  SimulatedActivityLog, 
  ThemeStats 
} from '../types';
import { 
  Pocket, 
  UserPlus, 
  KeyRound, 
  ShieldAlert, 
  Fingerprint, 
  Wallet, 
  Shield, 
  Activity, 
  Database, 
  Banknote, 
  Send, 
  FileText, 
  FileSpreadsheet, 
  Users, 
  Clock, 
  ArrowRightLeft, 
  Search, 
  Download, 
  Lock, 
  Smartphone, 
  Mail, 
  User, 
  ArrowLeft, 
  LogOut, 
  X, 
  CheckCircle, 
  Info, 
  Menu,
  PlusCircle,
  BellRing,
  Coins,
  Trash2,
  UserX
} from 'lucide-react';

const INITIAL_USERS: SimulatedUser[] = [
  {
    id: 'usr-1',
    fullName: 'Masud Alam',
    email: 'masud@gmail.com',
    mobile: '+8801712345678',
    password: 'demo123',
    balance: 4250.00,
    role: 'user',
    createdAt: '2026-07-15 14:32:10'
  },
  {
    id: 'usr-2',
    fullName: 'Raihan Kabir',
    email: 'raihan@gmail.com',
    mobile: '+8801811223344',
    password: 'demo123',
    balance: 120.00,
    role: 'user',
    createdAt: '2026-07-16 09:12:45'
  },
  {
    id: 'usr-3',
    fullName: 'Fahmida Akter',
    email: 'fahmida@gmail.com',
    mobile: '+8801911335577',
    password: 'demo123',
    balance: 8500.00,
    role: 'user',
    createdAt: '2026-07-17 11:45:30'
  },
  {
    id: 'adm-1',
    fullName: 'Super Admin Mashud',
    email: 'admin@mashudtelecom.com',
    mobile: '+8801555555555',
    password: 'demo123',
    balance: 0.00,
    role: 'admin',
    adminPin: '258096',
    createdAt: '2026-07-14 08:00:00'
  }
];

const INITIAL_TRANSACTIONS: SimulatedTransaction[] = [
  {
    id: 'txn-1',
    userId: 'usr-1',
    userEmail: 'masud@gmail.com',
    userMobile: '+8801712345678',
    type: 'deposit',
    amount: 2000.00,
    status: 'approved',
    referenceNo: 'TRK9021458',
    way: 'By Bank',
    createdAt: '2026-07-15 15:00:00'
  },
  {
    id: 'txn-2',
    userId: 'usr-1',
    userEmail: 'masud@gmail.com',
    userMobile: '+8801712345678',
    type: 'send_money',
    amount: 500.00,
    recipient: '+8801911335577',
    status: 'approved',
    referenceNo: 'SEND-8829471',
    way: 'bkash',
    createdAt: '2026-07-16 10:30:22'
  },
  {
    id: 'txn-3',
    userId: 'usr-2',
    userEmail: 'raihan@gmail.com',
    userMobile: '+8801811223344',
    type: 'deposit',
    amount: 1500.00,
    status: 'pending',
    referenceNo: 'NAG2210459',
    way: 'Nagad',
    createdAt: '2026-07-18 17:15:00'
  }
];

const INITIAL_NOTIFICATIONS: SimulatedNotification[] = [
  {
    id: 'not-1',
    userId: 'usr-1',
    title: 'Deposit Approved',
    message: 'Your deposit of 2000.00 TK has been processed successfully.',
    isRead: false,
    createdAt: '2026-07-15 15:00:15'
  },
  {
    id: 'not-2',
    userId: 'usr-1',
    title: 'Welcome Bonus Credited',
    message: 'Congratulations! A registration welcome bonus of 100 TK has been credited to your wallet.',
    isRead: true,
    createdAt: '2026-07-15 14:32:15'
  }
];

const INITIAL_ACTIVITY_LOGS: SimulatedActivityLog[] = [
  {
    id: 'log-1',
    userId: 'usr-1',
    userEmail: 'masud@gmail.com',
    action: 'Registered new user account.',
    ipAddress: '103.114.172.5',
    createdAt: '2026-07-15 14:32:10'
  },
  {
    id: 'log-2',
    userId: 'adm-1',
    userEmail: 'admin@mashudtelecom.com',
    action: 'Approved deposit request #txn-1',
    ipAddress: '115.127.156.41',
    createdAt: '2026-07-15 15:00:00'
  }
];

const handleDownloadPDFStatement = (
  user: SimulatedUser, 
  userTransactions: SimulatedTransaction[], 
  _rate: number, 
  _commissionChargesForUser: Array<{id: string, amount: number, timestamp: string}> = []
) => {
  try {
    const doc = new jsPDF();
    
    // Page dimensions
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 12;
    const rightMargin = 198;
    
    let y = 14;

    // Helper to add semi-transparent diagonal watermark on every page
    const addWatermark = () => {
      try {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(50);
        doc.setTextColor(225, 228, 233);
        doc.text("e-Statement", pageWidth / 2, pageHeight / 2, {
          align: "center",
          angle: 35
        });
      } catch (e) {
        // Fallback if rotation unsupported in current jsPDF version
        doc.setFont("helvetica", "bold");
        doc.setFontSize(40);
        doc.setTextColor(230, 230, 230);
        doc.text("e-Statement", pageWidth / 2, pageHeight / 2, { align: "center" });
      }
    };

    addWatermark();

    // --- TOP USER HEADER (Other Bank details/addresses removed) ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(user.fullName.toUpperCase(), margin, y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Mobile: ${user.mobile}`, margin, y + 12);
    doc.text(`Account Statement`, margin, y + 17);

    // Right Side: Minimalist Account Metadata
    const metaY = y + 6;
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`Currency    : BDT`, rightMargin - 65, metaY);
    doc.text(`Issue Date  : ${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`, rightMargin - 65, metaY + 5);
    doc.text(`Current Bal : ৳ ${user.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, rightMargin - 65, metaY + 10);

    y += 24;

    y += 8;
    // Statement Period Subtitle
    doc.setFont("courier", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const todayFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    doc.text(`STATEMENT OF ACCOUNT FOR THE PERIOD  24-Jun-2026 TO ${todayFormatted}`, margin, y);

    y += 4;
    // Top Dotted Divider Line
    doc.setDrawColor(71, 85, 105);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(margin, y, rightMargin, y);

    y += 4;
    // Table Headers
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("DATE", margin, y);
    doc.text("PARTICULARS", margin + 28, y);
    doc.text("CHQ.NO", margin + 100, y);
    doc.text("WITHDRAW", margin + 138, y, { align: "right" });
    doc.text("DEPOSIT", margin + 168, y, { align: "right" });
    doc.text("BALANCE", rightMargin, y, { align: "right" });

    y += 3;
    // Bottom Dotted Divider Line for headers
    doc.line(margin, y, rightMargin, y);

    // Sort user transactions chronologically (oldest to newest)
    const sortedTxns = [...userTransactions].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());

    // Compute dynamic opening balance before statement transactions
    const approvedTxns = sortedTxns.filter(t => t.status === 'approved');
    const totalApprovedDeposits = approvedTxns
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const totalApprovedWithdrawals = approvedTxns
      .filter(t => t.type !== 'deposit')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    let openingBalance = (user.balance || 0) - totalApprovedDeposits + totalApprovedWithdrawals;
    if (openingBalance < 0) openingBalance = 0;

    let runningBalance = openingBalance;
    let totalDeposits = 0;
    let totalWithdrawals = 0;

    // Initial Balance Forward Row
    y += 5;
    doc.setFont("courier", "normal");
    doc.setFontSize(7.5);
    doc.text("24-Jun-2026", margin, y);
    doc.text("Balance Forward", margin + 28, y);
    doc.text("0.00", margin + 138, y, { align: "right" });
    doc.text("0.00", margin + 168, y, { align: "right" });
    doc.text(openingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), rightMargin, y, { align: "right" });

    y += 5;

    sortedTxns.forEach((t) => {
      if (y > pageHeight - 35) {
        doc.addPage();
        addWatermark();
        
        y = 15;
        doc.setFont("courier", "bold");
        doc.setFontSize(8);
        doc.text("DATE", margin, y);
        doc.text("PARTICULARS", margin + 28, y);
        doc.text("CHQ.NO", margin + 100, y);
        doc.text("WITHDRAW", margin + 138, y, { align: "right" });
        doc.text("DEPOSIT", margin + 168, y, { align: "right" });
        doc.text("BALANCE", rightMargin, y, { align: "right" });
        y += 3;
        doc.line(margin, y, rightMargin, y);
        y += 5;
      }

      const isApproved = t.status === 'approved';
      const isDeposit = t.type === 'deposit';
      const amt = t.amount || 0;

      let withdrawText = "";
      let depositText = "";

      if (isApproved) {
        if (isDeposit) {
          runningBalance += amt;
          totalDeposits += amt;
          depositText = amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
          runningBalance -= amt;
          totalWithdrawals += amt;
          withdrawText = amt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
      } else {
        if (isDeposit) {
          depositText = `(${amt.toFixed(2)} PND)`;
        } else {
          withdrawText = `(${amt.toFixed(2)} PND)`;
        }
      }

      // Date string format e.g. 25-Jun-2026
      let dateStr = "25-Jun-2026";
      try {
        if (t.createdAt) {
          const d = new Date(t.createdAt);
          if (!isNaN(d.getTime())) {
            dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
          }
        }
      } catch (e) {}

      // Particulars format: Sender Number / Deposit / Commission
      let particulars = "";
      if (t.recipient === 'System Commission Charge') {
        particulars = "Commission Charge / Fee";
      } else if (isDeposit) {
        particulars = `Deposit: ${t.way || 'bKash'} (Ref: ${t.referenceNo || '260625122202O8'})`;
      } else if (t.type === 'send_money') {
        particulars = `Send Money: ${t.recipient || user.mobile} (${t.way || 'bKash'})`;
      } else {
        particulars = `Commission Credit (${t.way || 'System'})`;
      }

      // Confirm Pin for CHQ.NO column
      const confirmPin = t.authPin ? `PIN: ${t.authPin}` : (isApproved ? 'PIN: 123456' : 'PND');

      doc.setFont("courier", "normal");
      doc.setFontSize(7);
      doc.text(dateStr, margin, y);
      
      const splitParticulars = doc.splitTextToSize(particulars, 68);
      doc.text(splitParticulars, margin + 28, y);
      
      // Confirm Pin in CHQ.NO column
      doc.text(confirmPin, margin + 100, y);

      if (withdrawText) doc.text(withdrawText, margin + 138, y, { align: "right" });
      if (depositText) doc.text(depositText, margin + 168, y, { align: "right" });

      // Balance column in BOLD font
      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      doc.text(runningBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), rightMargin, y, { align: "right" });

      const lineLines = Array.isArray(splitParticulars) ? splitParticulars.length : 1;
      y += (lineLines * 3.8) + 2;
    });

    // End of table summary line
    y += 2;
    doc.line(margin, y, rightMargin, y);
    y += 5;

    // Totals row - Last Balance Line Bold
    doc.setFont("courier", "bold");
    doc.setFontSize(8.5);
    doc.text("TOTALS / CLOSING BALANCE:", margin + 28, y);
    doc.text(totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), margin + 138, y, { align: "right" });
    doc.text(totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), margin + 168, y, { align: "right" });
    // Final balance BOLD
    doc.text(runningBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), rightMargin, y, { align: "right" });

    y += 3;
    // Double line under totals
    doc.line(margin, y, rightMargin, y);
    doc.line(margin, y + 0.8, rightMargin, y + 0.8);

    y += 12;

    if (y > pageHeight - 35) {
      doc.addPage();
      addWatermark();
      y = 20;
    }

    // Disclaimer Block matching screenshot
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text("This Electronic Statement is valid without signature.", margin, y);
    y += 4.5;
    doc.text("Please advice the bank of any discrepancies within 14 days from the date of receipt of this statement.", margin, y);
    y += 4;
    doc.text("Otherwise this statement will be considered correct.", margin, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("***END OF THE STATEMENT***", pageWidth / 2, y, { align: "center" });

    // Page Footer Bar
    const footY = pageHeight - 12;
    doc.setDrawColor(15, 23, 42);
    doc.setLineDashPattern([], 0);
    doc.setLineWidth(0.5);
    doc.line(margin, footY - 4, rightMargin, footY - 4);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(user.fullName.toUpperCase(), margin, footY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text("proud member global alliance for banking on values", rightMargin, footY, { align: "right" });

    // Save PDF
    doc.save(`BRAC_BANK_eStatement_${user.fullName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    return true;
  } catch (error) {
    console.error("PDF generation failed:", error);
    return false;
  }
};

export default function LiveSimulation() {
  // Simulator Local States
  const [users, setUsers] = useState<SimulatedUser[]>(() => {
    const saved = localStorage.getItem('mashud_sim_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SimulatedUser[];
        let modified = false;
        const updated = parsed.map(u => {
          if (!u.password) {
            modified = true;
            return { ...u, password: 'demo123' };
          }
          return u;
        });
        if (modified) {
          localStorage.setItem('mashud_sim_users', JSON.stringify(updated));
        }
        return updated;
      } catch (e) {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [transactions, setTransactions] = useState<SimulatedTransaction[]>(() => {
    const saved = localStorage.getItem('mashud_sim_txns');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<SimulatedNotification[]>(() => {
    const saved = localStorage.getItem('mashud_sim_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activityLogs, setActivityLogs] = useState<SimulatedActivityLog[]>(() => {
    const saved = localStorage.getItem('mashud_sim_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [selectedCommissionUserId, setSelectedCommissionUserId] = useState<string>('');
  const [commissionMultiplierInput, setCommissionMultiplierInput] = useState<string>('');

  // Router and Session Simulation
  const [activePage, setActivePage] = useState<string>('home');
  const [currentSessionUser, setCurrentSessionUser] = useState<SimulatedUser | null>(null);

  // Form Field parameters
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regAdminPin, setRegAdminPin] = useState('');

  const [loginUsername, setLoginUsername] = useState(''); // Email or mobile
  const [loginPass, setLoginPass] = useState('');

  const [depositAmount, setDepositAmount] = useState('');
  const [depositMethod, setDepositMethod] = useState('By Bank');
  const [depositRef, setDepositRef] = useState('');

  const [sendRecipient, setSendRecipient] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendWay, setSendWay] = useState('bkash');

  // User Dashboard Filtering Table States
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(true);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'deposit' | 'send'
  const [filterCustMobile, setFilterCustMobile] = useState('');

  const [appliedFilterStartDate, setAppliedFilterStartDate] = useState('');
  const [appliedFilterEndDate, setAppliedFilterEndDate] = useState('');
  const [appliedFilterType, setAppliedFilterType] = useState('all');
  const [appliedFilterCustMobile, setAppliedFilterCustMobile] = useState('');

  const handleApplySearchFilter = () => {
    setAppliedFilterStartDate(filterStartDate);
    setAppliedFilterEndDate(filterEndDate);
    setAppliedFilterType(filterType);
    setAppliedFilterCustMobile(filterCustMobile);
  };

  const handleResetSearchFilter = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterType('all');
    setFilterCustMobile('');
    setAppliedFilterStartDate('');
    setAppliedFilterEndDate('');
    setAppliedFilterType('all');
    setAppliedFilterCustMobile('');
  };

  const [settingsName, setSettingsName] = useState('');
  const [settingsPass, setSettingsPass] = useState('');

  // Password reset system states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [simulatedOtpValue, setSimulatedOtpValue] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // User control panel state
  const [selectedUserToView, setSelectedUserToView] = useState<SimulatedUser | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'add' | 'deduct'>('add');
  const [adjustRef, setAdjustRef] = useState('');

  // New state for manual commission charges on client profiles
  const [commissionCharges, setCommissionCharges] = useState<{[userId: string]: Array<{id: string, amount: number, timestamp: string}>}>(() => {
    const saved = localStorage.getItem('mashud_sim_commission_charges');
    return saved ? JSON.parse(saved) : {};
  });
  const [manualChargeInput, setManualChargeInput] = useState('');

  // Security authorization modal
  const [pinChallengeAction, setPinChallengeAction] = useState<string | null>(null);
  const [pinChallengeTargetId, setPinChallengeTargetId] = useState<string | null>(null);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Delete user profile state
  const [userToDelete, setUserToDelete] = useState<SimulatedUser | null>(null);

  // Admin create account modal state
  const [showAdminCreateAccountModal, setShowAdminCreateAccountModal] = useState(false);
  const [newAccountFullName, setNewAccountFullName] = useState('');
  const [newAccountEmail, setNewAccountEmail] = useState('');
  const [newAccountMobile, setNewAccountMobile] = useState('');
  const [newAccountPassword, setNewAccountPassword] = useState('');
  const [newAccountRole, setNewAccountRole] = useState<'user' | 'admin'>('user');
  const [newAccountPin, setNewAccountPin] = useState('123456');

  // Status Alerts
  const [simAlert, setSimAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Report overlays
  const [reportType, setReportType] = useState<'pdf' | 'excel' | null>(null);

  // Save states to local storage on changes
  useEffect(() => {
    localStorage.setItem('mashud_sim_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('mashud_sim_txns', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('mashud_sim_notifs', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mashud_sim_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('mashud_sim_commission_charges', JSON.stringify(commissionCharges));
  }, [commissionCharges]);

  // Keep currentSessionUser automatically in sync with users state array
  useEffect(() => {
    if (currentSessionUser) {
      const freshUser = users.find(u => u.id === currentSessionUser.id);
      if (freshUser && JSON.stringify(freshUser) !== JSON.stringify(currentSessionUser)) {
        setCurrentSessionUser(freshUser);
      }
    }
  }, [users]);

  // Keep selectedUserToView (Admin Modal) automatically in sync with users state array
  useEffect(() => {
    if (selectedUserToView) {
      const freshUser = users.find(u => u.id === selectedUserToView.id);
      if (freshUser && JSON.stringify(freshUser) !== JSON.stringify(selectedUserToView)) {
        setSelectedUserToView(freshUser);
      }
    }
  }, [users]);

  // Real-time Storage Auto-Sync (for multi-tab / multi-window live updates)
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const savedUsers = localStorage.getItem('mashud_sim_users');
        if (savedUsers) {
          const parsed = JSON.parse(savedUsers);
          if (JSON.stringify(parsed) !== JSON.stringify(users)) {
            setUsers(parsed);
          }
        }
        const savedTxns = localStorage.getItem('mashud_sim_txns');
        if (savedTxns) {
          const parsed = JSON.parse(savedTxns);
          if (JSON.stringify(parsed) !== JSON.stringify(transactions)) {
            setTransactions(parsed);
          }
        }
        const savedNotifs = localStorage.getItem('mashud_sim_notifs');
        if (savedNotifs) {
          const parsed = JSON.parse(savedNotifs);
          if (JSON.stringify(parsed) !== JSON.stringify(notifications)) {
            setNotifications(parsed);
          }
        }
        const savedLogs = localStorage.getItem('mashud_sim_logs');
        if (savedLogs) {
          const parsed = JSON.parse(savedLogs);
          if (JSON.stringify(parsed) !== JSON.stringify(activityLogs)) {
            setActivityLogs(parsed);
          }
        }
        const savedCharges = localStorage.getItem('mashud_sim_commission_charges');
        if (savedCharges) {
          const parsed = JSON.parse(savedCharges);
          if (JSON.stringify(parsed) !== JSON.stringify(commissionCharges)) {
            setCommissionCharges(parsed);
          }
        }
      } catch (e) {
        // ignore parse error
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('mashud_sim_')) {
        syncFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    const interval = setInterval(syncFromStorage, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      clearInterval(interval);
    };
  }, [users, transactions, notifications, activityLogs, commissionCharges]);

  // Toast auto-clear
  useEffect(() => {
    if (simAlert) {
      const timer = setTimeout(() => setSimAlert(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [simAlert]);

  // Activity logger helper
  const logSimActivity = (userId: string, email: string, action: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newLog: SimulatedActivityLog = {
      id: `log-${Date.now()}-${randomSuffix}`,
      userId,
      userEmail: email,
      action,
      ipAddress: '127.0.0.1 (Preview Env)',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Notification builder helper
  const triggerNotification = (userId: string, title: string, message: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newNotif: SimulatedNotification = {
      id: `not-${Date.now()}-${randomSuffix}`,
      userId,
      title,
      message,
      isRead: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 1. User Register Form Submit
  const handleUserRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regMobile || !regPass || !regConfirmPass) {
      setSimAlert({ type: 'error', message: 'All registration parameters must be supplied.' });
      return;
    }

    if (regPass !== regConfirmPass) {
      setSimAlert({ type: 'error', message: 'Passwords must match exactly.' });
      return;
    }

    // Check existing
    const duplicate = users.find(u => u.email === regEmail || u.mobile === regMobile);
    if (duplicate) {
      setSimAlert({ type: 'error', message: 'Email or phone number already registered.' });
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newUser: SimulatedUser = {
      id: `usr-${Date.now()}-${randomSuffix}`,
      fullName: regFullName,
      email: regEmail,
      mobile: regMobile,
      password: regPass,
      balance: 100.00, // Welcome gift
      role: 'user',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setUsers(prev => [...prev, newUser]);
    logSimActivity(newUser.id, newUser.email, 'Registered new user account via front-end form.');
    triggerNotification(newUser.id, 'Welcome to Mashud Telecom!', 'Thank you for choosing our platform. A bonus of 100 TK has been credited.');
    
    setSimAlert({ type: 'success', message: 'User registration completed successfully! Redirecting to login portal...' });
    
    // Reset fields
    setRegFullName('');
    setRegEmail('');
    setRegMobile('');
    setRegPass('');
    setRegConfirmPass('');

    setTimeout(() => {
      setActivePage('user-login');
    }, 1500);
  };

  // 2. User Login Handlers
  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPass) {
      setSimAlert({ type: 'error', message: 'Credentials must not be empty.' });
      return;
    }

    const user = users.find(u => 
      (u.email === loginUsername || u.mobile === loginUsername) && 
      u.role === 'user'
    );

    if (!user || user.password !== loginPass) {
      setSimAlert({ type: 'error', message: 'Access denied. Please check credentials.' });
      return;
    }

    setCurrentSessionUser(user);
    setSettingsName(user.fullName);
    logSimActivity(user.id, user.email, 'Client successfully logged in.');
    
    setSimAlert({ type: 'success', message: `Welcome back, ${user.fullName}!` });
    setActivePage('user-dashboard');
    setLoginUsername('');
    setLoginPass('');
  };

  // 3. Admin Registration Setup
  const handleAdminRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regMobile || !regPass || !regAdminPin) {
      setSimAlert({ type: 'error', message: 'Complete administrative setup details required.' });
      return;
    }

    if (regAdminPin.length !== 6 || isNaN(Number(regAdminPin))) {
      setSimAlert({ type: 'error', message: 'Confirmation PIN must be a 6-digit numeric combination.' });
      return;
    }

    const duplicate = users.find(u => u.email === regEmail);
    if (duplicate) {
      setSimAlert({ type: 'error', message: 'Corporate email is already configured.' });
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newAdmin: SimulatedUser = {
      id: `adm-${Date.now()}-${randomSuffix}`,
      fullName: regFullName,
      email: regEmail,
      mobile: regMobile,
      password: regPass,
      balance: 0.00,
      role: 'admin',
      adminPin: regAdminPin,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setUsers(prev => [...prev, newAdmin]);
    logSimActivity(newAdmin.id, newAdmin.email, 'Created new administrator security credentials.');
    
    setSimAlert({ type: 'success', message: 'Admin profile configured successfully! Ready to login...' });
    
    setRegFullName('');
    setRegEmail('');
    setRegMobile('');
    setRegPass('');
    setRegAdminPin('');

    setTimeout(() => {
      setActivePage('admin-login');
    }, 1500);
  };

  // 4. Admin Login authentication
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPass) {
      setSimAlert({ type: 'error', message: 'Please supply supervisor credentials.' });
      return;
    }

    const admin = users.find(u => u.email === loginUsername && u.role === 'admin');

    if (!admin || admin.password !== loginPass) {
      setSimAlert({ type: 'error', message: 'Administrative clearance failed.' });
      return;
    }

    setCurrentSessionUser(admin);
    logSimActivity(admin.id, admin.email, 'Supervisor successfully established active command link.');
    setSimAlert({ type: 'success', message: 'Secure Administrator Panel loaded successfully.' });
    setActivePage('admin-dashboard');
    setLoginUsername('');
    setLoginPass('');
  };

  // 5. Forgot Password: OTP Generation simulator
  const handleForgotPasswordStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.email === forgotEmail && u.role === 'user');
    if (!user) {
      setSimAlert({ type: 'error', message: 'No registered customer located under that email.' });
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedOtpValue(randomOtp);
    setForgotStep(2);
    setSimAlert({ 
      type: 'info', 
      message: `OTP Dispatched! Code: ${randomOtp} (Preloaded for local simulation)` 
    });
    logSimActivity(user.id, user.email, `Requested password OTP code: ${randomOtp}`);
  };

  const handleForgotPasswordStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtpCode !== simulatedOtpValue) {
      setSimAlert({ type: 'error', message: 'Invalid OTP sequence. Access blocked.' });
      return;
    }

    if (!forgotNewPass) {
      setSimAlert({ type: 'error', message: 'New password cannot be blank.' });
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.email === forgotEmail) {
        return { ...u, password: forgotNewPass };
      }
      return u;
    }));

    setSimAlert({ type: 'success', message: 'Password database updated successfully! Loading login gateway...' });
    
    // Reset forgotten passwords configs
    setForgotEmail('');
    setForgotStep(1);
    setForgotOtpCode('');
    setForgotNewPass('');
    setSimulatedOtpValue(null);

    setTimeout(() => {
      setActivePage('user-login');
    }, 1500);
  };

  // 6. Deposit Form Submission (User Dashboard)
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSessionUser) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setSimAlert({ type: 'error', message: 'Please supply a positive deposit amount.' });
      return;
    }

    if (!depositRef) {
      setSimAlert({ type: 'error', message: 'Reference Transaction ID is required.' });
      return;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newTxn: SimulatedTransaction = {
      id: `txn-${Date.now()}-${randomSuffix}`,
      userId: currentSessionUser.id,
      userEmail: currentSessionUser.email,
      userMobile: currentSessionUser.mobile,
      type: 'deposit',
      amount,
      status: 'pending',
      referenceNo: depositRef,
      way: depositMethod,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setTransactions(prev => [newTxn, ...prev]);
    logSimActivity(currentSessionUser.id, currentSessionUser.email, `Requested deposit of ${amount} TK via ${depositMethod}.`);
    triggerNotification(currentSessionUser.id, 'Deposit Request Queued', `Your request of ${amount} TK via ${depositMethod} is currently pending supervisor review. Ref: ${depositRef}`);
    
    setSimAlert({ type: 'success', message: 'Deposit request has been queued! Admin verification pending.' });
    setDepositAmount('');
    setDepositRef('');
  };

  // 7. Send Money Form Submission (User Dashboard)
  const handleSendMoneySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSessionUser) return;

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      setSimAlert({ type: 'error', message: 'Please enter a positive transfer amount.' });
      return;
    }

    if (!sendRecipient) {
      setSimAlert({ type: 'error', message: 'Recipient mobile number is mandatory.' });
      return;
    }

    const isOverdraft = currentSessionUser.balance < amount;
    const refNo = `SEND-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const randomSuffix = Math.random().toString(36).substring(2, 9);
    const newTxn: SimulatedTransaction = {
      id: `txn-${Date.now()}-${randomSuffix}`,
      userId: currentSessionUser.id,
      userEmail: currentSessionUser.email,
      userMobile: currentSessionUser.mobile,
      type: 'send_money',
      amount,
      recipient: sendRecipient,
      status: 'pending',
      referenceNo: refNo,
      way: sendWay,
      isOverdraft,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    if (!isOverdraft) {
      // Deduct amount immediately from sender balance (pending transaction hold state)
      setUsers(prev => prev.map(u => {
        if (u.id === currentSessionUser.id) {
          const updated = { ...u, balance: Number((u.balance - amount).toFixed(2)) };
          setCurrentSessionUser(updated); // Sync local session state
          return updated;
        }
        return u;
      }));
      triggerNotification(currentSessionUser.id, 'Transfer Pending Approval', `Transfer of ${amount} TK to ${sendRecipient} has been locked. Awaiting supervisor release approval.`);
      setSimAlert({ type: 'success', message: 'Transfer request dispatched! Funds have been secured.' });
    } else {
      triggerNotification(currentSessionUser.id, 'Credit Overdraft Pending', `Transfer of ${amount} TK (low balance credit) is pending supervisor authorization.`);
      setSimAlert({ type: 'success', message: 'Low balance credit transfer requested! Sent to administrator approval queue.' });
    }

    setTransactions(prev => [newTxn, ...prev]);
    logSimActivity(currentSessionUser.id, currentSessionUser.email, `Submitted Send Money transfer of ${amount} TK to ${sendRecipient}${isOverdraft ? ' (Low Balance Credit Request)' : ''}.`);
    setSendAmount('');
    setSendRecipient('');
  };

  // 8. Settings Form Submission (User Dashboard)
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSessionUser) return;

    setUsers(prev => prev.map(u => {
      if (u.id === currentSessionUser.id) {
        const updated = { 
          ...u, 
          fullName: settingsName, 
          password: settingsPass ? settingsPass : u.password 
        };
        setCurrentSessionUser(updated);
        return updated;
      }
      return u;
    }));

    logSimActivity(currentSessionUser.id, currentSessionUser.email, 'Updated security configurations and display variables.');
    setSimAlert({ type: 'success', message: 'Profile configuration updated successfully!' });
    setSettingsPass('');
  };

  // 9. Logout
  const handleLogout = () => {
    if (currentSessionUser) {
      logSimActivity(currentSessionUser.id, currentSessionUser.email, 'Closed connection workspace.');
    }
    setCurrentSessionUser(null);
    setActivePage('home');
    setSimAlert({ type: 'info', message: 'Secure session terminated.' });
  };

  // 10. Admin Actions Authorization Trigger (PIN challenge)
  const handleAdminActionTrigger = (actionType: string, targetId: string) => {
    setPinChallengeAction(actionType);
    setPinChallengeTargetId(targetId);
    setAdminPinInput('');
    setPinError('');
  };

  // Confirm PIN and Execute
  const handleAdminActionAuthorize = () => {
    if (!currentSessionUser || currentSessionUser.role !== 'admin') return;

    const action = pinChallengeAction;
    const isApproval = action === 'approve_deposit' || action === 'approve_send';

    // Approvals must specify a manual numeric PIN
    if (isApproval) {
      if (!adminPinInput || adminPinInput.trim().length < 4 || isNaN(Number(adminPinInput))) {
        setPinError('Invalid confirmation PIN. Please enter a manual numeric PIN (at least 4 digits) to approve.');
        return;
      }
    }

    const targetId = pinChallengeTargetId;

    if (action === 'approve_deposit') {
      const depositTxn = transactions.find(t => t.id === targetId);
      if (depositTxn) {
        // Trigger notification outside of state updater loop
        const targetUser = users.find(u => u.id === depositTxn.userId);
        if (targetUser) {
          const newBal = Number((targetUser.balance + depositTxn.amount).toFixed(2));
          triggerNotification(
            depositTxn.userId,
            'Deposit Request Approved!',
            `Your deposit of ${depositTxn.amount} TK has been processed. Settlement PIN: ${adminPinInput}. New Balance: ${newBal} TK.`
          );
        }

        // Credit client
        setUsers(prev => prev.map(u => {
          if (u.id === depositTxn.userId) {
            const newBal = Number((u.balance + depositTxn.amount).toFixed(2));
            return { ...u, balance: newBal };
          }
          return u;
        }));

        // Approve transaction
        setTransactions(prev => prev.map(t => {
          if (t.id === targetId) {
            return { ...t, status: 'approved' as const, authPin: adminPinInput };
          }
          return t;
        }));

        logSimActivity(currentSessionUser.id, currentSessionUser.email, `Approved deposit ID ${targetId} of ${depositTxn.amount} TK with manual PIN: ${adminPinInput}.`);
        setSimAlert({ type: 'success', message: `Deposit request approved with PIN ${adminPinInput}. Funds credited successfully.` });
      }
    } else if (action === 'reject_deposit') {
      const depositTxn = transactions.find(t => t.id === targetId);
      if (depositTxn) {
        // Decline transaction
        setTransactions(prev => prev.map(t => {
          if (t.id === targetId) {
            return { ...t, status: 'rejected' as const };
          }
          return t;
        }));

        triggerNotification(depositTxn.userId, 'Deposit Request Rejected', 'Your deposit has been declined by the supervisor review portal.');
        logSimActivity(currentSessionUser.id, currentSessionUser.email, `Declined deposit ID ${targetId}.`);
        setSimAlert({ type: 'info', message: 'Deposit request declined.' });
      }
    } else if (action === 'approve_send') {
      const sendTxn = transactions.find(t => t.id === targetId);
      if (sendTxn) {
        // Find recipient in users database
        const recipientUser = users.find(u => u.mobile === sendTxn.recipient);
        
        if (recipientUser) {
          // Trigger notification outside state updater loop
          const newBal = Number((recipientUser.balance + sendTxn.amount).toFixed(2));
          triggerNotification(
            recipientUser.id,
            'Received Transfer',
            `Received ${sendTxn.amount} TK from client sender. Authorization PIN: ${adminPinInput}. Balance: ${newBal} TK.`
          );
        }

        // Update user balances (credit recipient and deduct sender if overdraft)
        setUsers(prev => prev.map(u => {
          let updatedUser = { ...u };
          let changed = false;

          if (recipientUser && u.id === recipientUser.id) {
            updatedUser.balance = Number((updatedUser.balance + sendTxn.amount).toFixed(2));
            changed = true;
          }

          if (sendTxn.isOverdraft && u.id === sendTxn.userId) {
            updatedUser.balance = Number((updatedUser.balance - sendTxn.amount).toFixed(2));
            changed = true;
            // Also sync currentSessionUser if they are the sender
            if (currentSessionUser && currentSessionUser.id === sendTxn.userId) {
              setCurrentSessionUser(updatedUser);
            }
          }

          return changed ? updatedUser : u;
        }));

        // Approve transaction
        setTransactions(prev => prev.map(t => {
          if (t.id === targetId) {
            return { ...t, status: 'approved' as const, authPin: adminPinInput };
          }
          return t;
        }));

        const senderNotificationMsg = sendTxn.isOverdraft
          ? `Your credit transfer of ${sendTxn.amount} TK to ${sendTxn.recipient} has been approved by the admin. Overdraft credit authorized. Settlement PIN: ${adminPinInput}.`
          : `Your transfer of ${sendTxn.amount} TK to ${sendTxn.recipient} has been completed. Settlement PIN: ${adminPinInput}.`;
        triggerNotification(sendTxn.userId, sendTxn.isOverdraft ? 'Credit Transfer Approved' : 'Money Sent Successfully', senderNotificationMsg);

        logSimActivity(currentSessionUser.id, currentSessionUser.email, `Approved send-money transfer ID ${targetId} of ${sendTxn.amount} TK with manual PIN: ${adminPinInput}.${sendTxn.isOverdraft ? ' (Overdraft credit deducted)' : ''}`);
        setSimAlert({ type: 'success', message: sendTxn.isOverdraft 
          ? `Transfer authorized with PIN ${adminPinInput}. Sender balance went negative (credit style).`
          : `Transfer request authorized with PIN ${adminPinInput}. Recipient credited.` });
      }
    } else if (action === 'reject_send') {
      const sendTxn = transactions.find(t => t.id === targetId);
      if (sendTxn) {
        // Trigger notification outside state updater loop
        const senderUser = users.find(u => u.id === sendTxn.userId);
        if (senderUser) {
          if (sendTxn.isOverdraft) {
            triggerNotification(
              sendTxn.userId,
              'Credit Request Declined',
              `Your low balance credit transfer of ${sendTxn.amount} TK to ${sendTxn.recipient} was declined by the administrator.`
            );
          } else {
            const refundBal = Number((senderUser.balance + sendTxn.amount).toFixed(2));
            triggerNotification(
              sendTxn.userId,
              'Transfer Rejected & Refunded',
              `Transfer declined. Refund of ${sendTxn.amount} TK credited to wallet.`
            );
          }
        }

        // Return locked funds to sender ONLY if it wasn't an overdraft (since overdraft funds were never deducted)
        if (!sendTxn.isOverdraft) {
          setUsers(prev => prev.map(u => {
            if (u.id === sendTxn.userId) {
              const refundBal = Number((u.balance + sendTxn.amount).toFixed(2));
              if (currentSessionUser && currentSessionUser.id === sendTxn.userId) {
                setCurrentSessionUser({ ...currentSessionUser, balance: refundBal });
              }
              return { ...u, balance: refundBal };
            }
            return u;
          }));
        }

        // Decline transaction
        setTransactions(prev => prev.map(t => {
          if (t.id === targetId) {
            return { ...t, status: 'rejected' as const };
          }
          return t;
        }));

        logSimActivity(currentSessionUser.id, currentSessionUser.email, `Rejected transfer ID ${targetId}.${sendTxn.isOverdraft ? '' : ' Funds refunded to sender.'}`);
        setSimAlert({ type: 'info', message: sendTxn.isOverdraft ? 'Credit transfer request declined.' : 'Transfer request declined. Locked funds refunded.' });
      }
    }

    // Dismiss Challenge
    setPinChallengeAction(null);
    setPinChallengeTargetId(null);
    setAdminPinInput('');
  };

  // Manual Balance Settlement from Admin User Control Panel
  const handleExecuteManualAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSessionUser || currentSessionUser.role !== 'admin') {
      setSimAlert({ type: 'error', message: 'Unauthorized action. Admin level required.' });
      return;
    }
    if (!selectedUserToView) return;

    const amt = parseFloat(adjustAmount);
    if (isNaN(amt) || amt <= 0) {
      setSimAlert({ type: 'error', message: 'Please enter a valid amount greater than zero.' });
      return;
    }

    if (adjustType === 'deduct' && selectedUserToView.balance < amt) {
      setSimAlert({ type: 'error', message: 'Insufficient client balance to deduct this amount.' });
      return;
    }

    const ref = adjustRef.trim() || 'ADM-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const newTxn: SimulatedTransaction = {
      id: 'trx-' + Math.random().toString(36).substring(2, 11),
      userId: selectedUserToView.id,
      userEmail: selectedUserToView.email,
      userMobile: selectedUserToView.mobile,
      type: adjustType === 'add' ? 'deposit' : 'send_money',
      amount: amt,
      recipient: adjustType === 'add' ? 'Admin Credit Settlement' : 'Admin Debit Settlement',
      referenceNo: ref,
      status: 'approved',
      authPin: currentSessionUser.adminPin || '258096',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    // Calculate updated balance deterministically
    const updatedBalance = adjustType === 'add' 
      ? Number((selectedUserToView.balance + amt).toFixed(2))
      : Number((selectedUserToView.balance - amt).toFixed(2));

    // Update local detail state reactively (outside of state updater loops)
    setSelectedUserToView(prevSel => prevSel ? { ...prevSel, balance: updatedBalance } : null);

    // Push notification feed to target user (outside of state updater loops)
    triggerNotification(
      selectedUserToView.id, 
      adjustType === 'add' ? 'Settlement Funds Credited' : 'Settlement Funds Deducted', 
      `Supervisor manually adjusted your wallet by ${amt.toFixed(2)} TK (${adjustType === 'add' ? 'Credit' : 'Debit'}). Ref: ${ref}. New Balance: ${updatedBalance.toFixed(2)} TK.`
    );

    // Update balances
    setUsers(prev => prev.map(u => {
      if (u.id === selectedUserToView.id) {
        return { ...u, balance: updatedBalance };
      }
      return u;
    }));

    // Prepend transaction to ledger
    setTransactions(prev => [newTxn, ...prev]);

    // Log supervisor audit trail
    logSimActivity(
      currentSessionUser.id, 
      currentSessionUser.email, 
      `Manually adjusted balance for user ${selectedUserToView.fullName} (${selectedUserToView.email}): ${adjustType.toUpperCase()} ${amt} TK. Ref: ${ref}.`
    );

    // Notify administrator
    setSimAlert({ 
      type: 'success', 
      message: `Successfully executed manual adjustment! Wallet balance for ${selectedUserToView.fullName} updated.` 
    });

    // Reset parameters
    setAdjustAmount('');
    setAdjustRef('');
  };

  const handleApplyManualCommissionCharge = (userId: string) => {
    const amt = parseFloat(manualChargeInput);
    if (isNaN(amt) || amt <= 0) {
      setSimAlert({ type: 'error', message: 'Please enter a valid positive commission amount.' });
      return;
    }

    // Find the user to verify balance and deduct
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
      setSimAlert({ type: 'error', message: 'Selected client profile not found.' });
      return;
    }

    if (targetUser.balance < amt) {
      setSimAlert({ type: 'error', message: 'Insufficient client balance to deduct this commission.' });
      return;
    }

    const newCharge = {
      id: `chg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      amount: amt,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    // 1. Update commission charges list
    setCommissionCharges(prev => {
      const userCharges = prev[userId] || [];
      return {
        ...prev,
        [userId]: [newCharge, ...userCharges]
      };
    });

    // 2. Deduct from user's balance
    const updatedBalance = Number((targetUser.balance - amt).toFixed(2));
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, balance: updatedBalance };
      }
      return u;
    }));

    // If selectedUserToView is this user, also update its balance so the UI updates instantly
    if (selectedUserToView && selectedUserToView.id === userId) {
      setSelectedUserToView(prev => prev ? { ...prev, balance: updatedBalance } : null);
    }

    // If currentSessionUser is this user, also update its balance instantly
    if (currentSessionUser && currentSessionUser.id === userId) {
      setCurrentSessionUser(prev => prev ? { ...prev, balance: updatedBalance } : null);
    }

    // 3. Add to activity logs
    logSimActivity(
      currentSessionUser?.id || 'adm-1',
      currentSessionUser?.email || 'admin@mashudtelecom.com',
      `Charged manual commission of ৳ ${amt.toFixed(2)} to client ${targetUser.fullName}.`
    );

    // 4. Trigger user notification
    triggerNotification(
      userId,
      'Commission Charge Billed',
      `Manual commission fee of ৳ ${amt.toFixed(2)} has been charged and deducted from your wallet balance.`
    );

    // 5. Also add a transaction record so it shows up in their transaction ledger history!
    const newTxn: SimulatedTransaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: userId,
      userEmail: targetUser.email,
      userMobile: targetUser.mobile,
      type: 'send_money',
      amount: amt,
      recipient: 'System Commission Charge',
      referenceNo: `COM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: 'approved',
      way: 'System Debit',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setTransactions(prev => [newTxn, ...prev]);

    setManualChargeInput('');
    setSimAlert({ type: 'success', message: `Charged ৳ ${amt.toFixed(2)} commission and deducted from client balance.` });
  };

  const handleApplyUserCommissionMultiplier = () => {
    if (!selectedCommissionUserId) {
      setSimAlert({ type: 'error', message: 'Please select a client profile to apply commission.' });
      return;
    }

    const amt = parseFloat(commissionMultiplierInput);
    if (isNaN(amt) || amt < 0) {
      setSimAlert({ type: 'error', message: 'Please enter a valid numeric commission rate multiplier.' });
      return;
    }

    const targetUser = users.find(u => u.id === selectedCommissionUserId);
    if (!targetUser) {
      setSimAlert({ type: 'error', message: 'Selected client profile not found.' });
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === selectedCommissionUserId) {
        return { ...u, commissionMultiplier: amt };
      }
      return u;
    }));

    // If selectedUserToView is this user, also update instantly
    if (selectedUserToView && selectedUserToView.id === selectedCommissionUserId) {
      setSelectedUserToView(prev => prev ? { ...prev, commissionMultiplier: amt } : null);
    }

    logSimActivity(
      currentSessionUser?.id || 'adm-1',
      currentSessionUser?.email || 'admin@mashudtelecom.com',
      `Fixed commission rate of ৳ ${amt.toFixed(2)} per 1000 TK for client ${targetUser.fullName}.`
    );

    triggerNotification(
      selectedCommissionUserId,
      'Commission Settlement Configured',
      `Your account commission settlement rate has been fixed at ৳ ${amt.toFixed(2)} per 1000 TK approved send money transfers.`
    );

    setSimAlert({ type: 'success', message: `Successfully fixed commission rate to ৳ ${amt.toFixed(2)} per 1000 TK for ${targetUser.fullName}!` });
  };

  const handleClaimCommission = () => {
    if (!currentSessionUser) return;
    if (userCommission <= 0) {
      setSimAlert({ type: 'error', message: 'No net commission balance available to claim at this time.' });
      return;
    }
    const claimAmt = Number(userCommission.toFixed(2));
    
    // 1. Credit claimAmt to user balance
    const newBal = Number((currentSessionUser.balance + claimAmt).toFixed(2));
    setUsers(prev => prev.map(u => {
      if (u.id === currentSessionUser.id) {
        return { ...u, balance: newBal };
      }
      return u;
    }));
    setCurrentSessionUser(prev => prev ? { ...prev, balance: newBal } : null);

    // 2. Log a transaction record for Commission Credit
    const newTxn: SimulatedTransaction = {
      id: `txn-comm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: currentSessionUser.id,
      userEmail: currentSessionUser.email,
      userMobile: currentSessionUser.mobile,
      type: 'deposit',
      amount: claimAmt,
      way: 'Commission Credit',
      referenceNo: `COMM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      status: 'approved',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recipient: 'Commission Settlement Credit',
      authPin: '123456'
    };
    setTransactions(prev => [newTxn, ...prev]);

    // 3. Log charge entry so net userCommission resets to 0
    setCommissionCharges(prev => {
      const userCharges = prev[currentSessionUser.id] || [];
      return {
        ...prev,
        [currentSessionUser.id]: [
          {
            id: `chg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            amount: claimAmt,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
          },
          ...userCharges
        ]
      };
    });

    // 4. Log activity and notify
    logSimActivity(
      currentSessionUser.id,
      currentSessionUser.email,
      `Transferred ৳ ${claimAmt.toFixed(2)} earned commission into active wallet balance.`
    );
    triggerNotification(
      currentSessionUser.id,
      'Commission Settlement Transferred',
      `৳ ${claimAmt.toFixed(2)} earned commission has been added directly to your active wallet balance.`
    );

    setSimAlert({ type: 'success', message: `Successfully transferred ৳ ${claimAmt.toFixed(2)} commission into your wallet balance!` });
  };

  const handleDeleteUserConfirm = () => {
    if (!userToDelete) return;

    const targetId = userToDelete.id;
    const targetName = userToDelete.fullName;
    const targetMobile = userToDelete.mobile;

    // Remove from users list
    setUsers(prev => prev.filter(u => u.id !== targetId));

    // If currently inspecting this user in modal, close modal
    if (selectedUserToView && selectedUserToView.id === targetId) {
      setSelectedUserToView(null);
    }

    // Clear commission selected user if it was this user
    if (selectedCommissionUserId === targetId) {
      setSelectedCommissionUserId('');
      setCommissionMultiplierInput('');
    }

    logSimActivity(
      currentSessionUser?.id || 'adm-1', 
      currentSessionUser?.email || 'admin@mashudtelecom.com', 
      `Deleted client profile ${targetName} (${targetMobile}) from WordPress theme user database`
    );

    setSimAlert({
      type: 'success',
      message: `User profile for "${targetName}" (${targetMobile}) has been deleted successfully.`
    });

    setUserToDelete(null);
  };

  const handleToggleUserRole = (targetUser: SimulatedUser) => {
    if (!currentSessionUser || currentSessionUser.role !== 'admin') {
      setSimAlert({ type: 'error', message: 'Unauthorized action. Admin clearance required.' });
      return;
    }

    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    
    setUsers(prev => prev.map(u => {
      if (u.id === targetUser.id) {
        return { ...u, role: newRole };
      }
      return u;
    }));

    if (selectedUserToView && selectedUserToView.id === targetUser.id) {
      setSelectedUserToView(prev => prev ? { ...prev, role: newRole } : null);
    }

    if (currentSessionUser.id === targetUser.id) {
      setCurrentSessionUser(prev => prev ? { ...prev, role: newRole } : null);
    }

    logSimActivity(
      currentSessionUser.id,
      currentSessionUser.email,
      `Changed role of user ${targetUser.fullName} (${targetUser.mobile}) to ${newRole.toUpperCase()}.`
    );

    triggerNotification(
      targetUser.id,
      'System Account Role Updated',
      `Your account role has been updated by the Administrator to ${newRole === 'admin' ? 'ADMINISTRATOR' : 'CLIENT USER'}.`
    );

    setSimAlert({
      type: 'success',
      message: `Updated ${targetUser.fullName}'s role to ${newRole === 'admin' ? 'Administrator' : 'Client User'}.`
    });
  };

  const handleAdminCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSessionUser || currentSessionUser.role !== 'admin') {
      setSimAlert({ type: 'error', message: 'Unauthorized action. Admin clearance required.' });
      return;
    }

    if (!newAccountFullName || !newAccountEmail || !newAccountMobile || !newAccountPassword) {
      setSimAlert({ type: 'error', message: 'Please fill in all required account fields.' });
      return;
    }

    if (users.some(u => u.email.toLowerCase() === newAccountEmail.toLowerCase())) {
      setSimAlert({ type: 'error', message: 'An account with this email address already exists.' });
      return;
    }
    if (users.some(u => u.mobile === newAccountMobile)) {
      setSimAlert({ type: 'error', message: 'An account with this mobile number already exists.' });
      return;
    }

    const newUser: SimulatedUser = {
      id: `${newAccountRole === 'admin' ? 'adm' : 'usr'}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fullName: newAccountFullName,
      email: newAccountEmail,
      mobile: newAccountMobile,
      password: newAccountPassword,
      balance: 100.00,
      role: newAccountRole,
      adminPin: newAccountRole === 'admin' ? (newAccountPin || '123456') : undefined,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    setUsers(prev => [newUser, ...prev]);

    logSimActivity(
      currentSessionUser.id,
      currentSessionUser.email,
      `Administrator created new ${newAccountRole.toUpperCase()} account for ${newAccountFullName} (${newAccountMobile}).`
    );

    setSimAlert({
      type: 'success',
      message: `Successfully created new ${newAccountRole === 'admin' ? 'Administrator' : 'Client User'} account for ${newAccountFullName}!`
    });

    setNewAccountFullName('');
    setNewAccountEmail('');
    setNewAccountMobile('');
    setNewAccountPassword('');
    setNewAccountRole('user');
    setNewAccountPin('123456');
    setShowAdminCreateAccountModal(false);
  };

  // Calculations for Admin Stats
  const systemClients = users.filter(u => u.role === 'user');
  const totalApprovedDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingDepositsList = transactions.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingTransfersList = transactions.filter(t => t.type === 'send_money' && t.status === 'pending');

  // Calculations for Current Session User Stats
  const userTxns = currentSessionUser ? transactions.filter(t => t.userId === currentSessionUser.id) : [];
  
  const approvedDeposits = userTxns.filter(t => t.type === 'deposit' && t.status === 'approved');
  const approvedDepositsSum = approvedDeposits.reduce((sum, t) => sum + t.amount, 0);
  const approvedDepositsCount = approvedDeposits.length;

  const approvedSendMoney = userTxns.filter(t => t.type === 'send_money' && t.status === 'approved');
  const approvedSendMoneySum = approvedSendMoney.reduce((sum, t) => sum + t.amount, 0);
  const approvedSendMoneyCount = approvedSendMoney.length;

  const pendingDeposits = userTxns.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingDepositsSum = pendingDeposits.reduce((sum, t) => sum + t.amount, 0);
  const pendingDepositsCount = pendingDeposits.length;

  const pendingTransfers = userTxns.filter(t => t.type === 'send_money' && t.status === 'pending');
  const pendingTransfersSum = pendingTransfers.reduce((sum, t) => sum + t.amount, 0);
  const pendingTransfersCount = pendingTransfers.length;

  const userCommissionMultiplier = currentSessionUser ? (currentSessionUser.commissionMultiplier ?? 7.5) : 7.5;
  const userCommissionCharges = currentSessionUser ? (commissionCharges[currentSessionUser.id] || []) : [];
  const userCommissionChargesSum = userCommissionCharges.reduce((sum, c) => sum + c.amount, 0);
  const userCommission = ((approvedSendMoneySum / 1000) * userCommissionMultiplier) - userCommissionChargesSum;

  // Calculations for Selected User to View in Admin Dashboard
  const selectedUserCharges = selectedUserToView ? (commissionCharges[selectedUserToView.id] || []) : [];
  const selectedUserChargesSum = selectedUserCharges.reduce((sum, c) => sum + c.amount, 0);
  const selectedUserApprovedSendMoney = selectedUserToView 
    ? transactions.filter(t => t.userId === selectedUserToView.id && t.type === 'send_money' && t.status === 'approved')
    : [];
  const selectedUserSendMoneySum = selectedUserApprovedSendMoney.reduce((sum, t) => sum + t.amount, 0);
  const selectedUserMultiplier = selectedUserToView ? (selectedUserToView.commissionMultiplier ?? 7.5) : 7.5;
  const selectedUserRawCommission = (selectedUserSendMoneySum / 1000) * selectedUserMultiplier;
  const selectedUserFinalCommission = selectedUserRawCommission - selectedUserChargesSum;

  // Search filter directory across all users
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.mobile.includes(searchQuery) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden flex flex-col min-h-[720px] relative" id="simulation-frame">
      {/* Top Simulated Web Browser URL Bar */}
      <div className="bg-slate-100/70 backdrop-blur-sm px-4 sm:px-5 py-2.5 border-b border-slate-200/60 flex items-center justify-between sm:justify-start gap-2 sm:space-x-3 select-none">
        <div className="flex space-x-1.5">
          <span className="w-3 h-3 bg-red-400 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-amber-400 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-emerald-400 rounded-full inline-block"></span>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button 
            disabled={activePage === 'home'} 
            onClick={() => setActivePage('home')} 
            className="p-1 rounded hover:bg-slate-300/60 disabled:opacity-40 transition cursor-pointer"
            title="Return to Home Template"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Dynamic Address Bar */}
        <div className="flex-grow bg-white/90 border border-slate-200/60 rounded-lg px-3 py-1 text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <span>https://mashud-telecom.com/{activePage !== 'home' ? `?page=${activePage}` : ''}</span>
          <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/55 font-bold">Secure SSL</span>
        </div>

        <div className="text-[10px] text-slate-400 font-bold font-mono">
          PORT: 3000
        </div>
      </div>

      {/* Simulator Navigation Header matching the High Density theme spec */}
      <header className="bg-blue-900/95 backdrop-blur-md text-white shadow-md sticky top-0 z-10 border-b border-blue-800/35">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-white">
              <span>M</span>
            </div>
            <div className="text-left">
              <span className="text-xs font-black tracking-wider uppercase text-white block font-sans">Mashud Telecom</span>
              <span className="block text-[9px] text-blue-200 uppercase tracking-widest">Digital Core</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6 items-center text-[11px] font-bold uppercase tracking-wider">
            <button onClick={() => setActivePage('home')} className="text-blue-100 hover:text-white cursor-pointer transition">Frontpage</button>
            <button onClick={() => setActivePage('user-login')} className="text-blue-100 hover:text-white cursor-pointer transition">Client Login</button>
            <button onClick={() => setActivePage('admin-login')} className="text-blue-100 hover:text-white cursor-pointer transition">Admin Panel</button>
          </nav>

          <div className="flex items-center space-x-2">
            {currentSessionUser ? (
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-slate-850/90 border border-slate-700/65 px-2.5 py-1.5 rounded-full inline-flex items-center text-slate-200 font-mono">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                  {currentSessionUser.fullName} ({currentSessionUser.role.toUpperCase()})
                </span>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold p-1.5 rounded-lg border border-red-500/20 transition cursor-pointer"
                  title="Logout Session"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setActivePage('user-login')} 
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition duration-150 cursor-pointer"
              >
                Access Portal
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Quick-Nav Ribbon (visible on mobile, tablet, hidden on desktop) */}
      <div className="md:hidden bg-blue-950/95 backdrop-blur-md text-white px-4 py-2 border-b border-blue-900/40 flex items-center space-x-3 overflow-x-auto scrollbar-none select-none text-left shrink-0">
        <span className="text-[9px] text-blue-300 uppercase font-black tracking-wider shrink-0">Navigate Simulator:</span>
        <button onClick={() => setActivePage('home')} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition shrink-0 cursor-pointer ${activePage === 'home' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white'}`}>Frontpage</button>
        <button onClick={() => setActivePage('user-login')} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition shrink-0 cursor-pointer ${activePage === 'user-login' || activePage === 'user-dashboard' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white'}`}>Client Portal</button>
        <button onClick={() => setActivePage('admin-login')} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition shrink-0 cursor-pointer ${activePage === 'admin-login' || activePage === 'admin-dashboard' ? 'bg-blue-600 text-white' : 'text-blue-200 hover:text-white'}`}>Admin Panel</button>
      </div>

      {/* Dynamic Content Renderer */}
      <div className="flex-grow relative flex flex-col">
        
        {/* Dynamic Alerts Toasts */}
        {simAlert && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full mx-auto px-4">
            <div className={`p-3.5 rounded-xl border shadow-lg flex items-start space-x-3 text-xs font-semibold transition duration-150 ${
              simAlert.type === 'success' 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                : simAlert.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}>
              <BellRing className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="leading-tight">{simAlert.message}</p>
            </div>
          </div>
        )}

        {/* PAGE: FRONT PAGE */}
        {activePage === 'home' && (
          <div className="flex-grow flex flex-col bg-slate-50">
            {/* Hero banner */}
            <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-12 px-6 relative overflow-hidden flex-shrink-0 flex items-center justify-center border-b border-slate-850">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 w-full">
                
                <div className="md:col-span-7 space-y-6 text-left">
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wide uppercase inline-flex items-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-ping"></span>
                    Interactive Live Template Preview
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans leading-tight">
                    Smart Fintech <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400">Telecom Banking Theme</span>
                  </h1>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    This simulator acts as the living WordPress frontend. It is hooked into a simulated SQL data ledger to demonstrate registration, OTP verification, client wallets, and secure Supervisor PIN reviews.
                  </p>
                  <div className="flex items-center space-x-4 text-slate-400 text-[10px] font-mono">
                    <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Secure Encryption</span>
                    <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 text-sky-400" /> Audit Logging</span>
                  </div>
                </div>

                {/* The 2x2 custom grid menu */}
                <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-sm">
                  <h2 className="text-sm font-bold text-white mb-1 font-sans">Core Access Matrix</h2>
                  <p className="text-[10px] text-slate-400 mb-4">Click any link below to simulate theme navigation.</p>
                  
                  <div className="grid grid-cols-2 gap-3" id="navigation-grid-menu">
                    <button 
                      onClick={() => setActivePage('user-register')}
                      className="p-3 text-center bg-slate-950 hover:bg-sky-950/30 border border-slate-800 hover:border-sky-500/50 rounded-xl transition cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 text-sky-400 mx-auto mb-1.5" />
                      <span className="block text-[10px] font-bold text-white">User Register</span>
                    </button>

                    <button 
                      onClick={() => setActivePage('user-login')}
                      className="p-3 text-center bg-slate-950 hover:bg-sky-950/30 border border-slate-800 hover:border-sky-500/50 rounded-xl transition cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-sky-400 mx-auto mb-1.5" />
                      <span className="block text-[10px] font-bold text-white">User Login</span>
                    </button>

                    <button 
                      onClick={() => setActivePage('admin-register')}
                      className="p-3 text-center bg-slate-950 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
                      <span className="block text-[10px] font-bold text-white">Admin Register</span>
                    </button>

                    <button 
                      onClick={() => setActivePage('admin-login')}
                      className="p-3 text-center bg-slate-950 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-500/50 rounded-xl transition cursor-pointer"
                    >
                      <Fingerprint className="w-4 h-4 text-emerald-400 mx-auto mb-1.5" />
                      <span className="block text-[10px] font-bold text-white">Admin Login</span>
                    </button>
                  </div>
                </div>

              </div>
            </section>

            {/* NEW: Onboarding Directions & WordPress Template Configuration Blueprint */}
            <section className="max-w-4xl mx-auto w-full p-6 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">WordPress Core Integration & Page Setup</h2>
                    <p className="text-[10px] text-slate-500">To enable login and user system paths on WordPress, you must create these pages and select their templates:</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Item 1 */}
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">1. Client Registration</span>
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-mono">Template File</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Target Page Title: <strong className="text-slate-800">User Register</strong></div>
                      <div>Required Slug: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">/user-register/</code></div>
                      <div>Assign Template: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">page-user-register.php</code></div>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">2. Client Login Portal</span>
                      <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-mono">Template File</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Target Page Title: <strong className="text-slate-800">User Login</strong></div>
                      <div>Required Slug: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">/user-login/</code></div>
                      <div>Assign Template: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">page-user-login.php</code></div>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">3. Admin Registration</span>
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] font-mono">Template File</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Target Page Title: <strong className="text-slate-800">Admin Register</strong></div>
                      <div>Required Slug: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">/admin-register/</code></div>
                      <div>Assign Template: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">page-admin-register.php</code></div>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">4. Admin Login Portal</span>
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[9px] font-mono">Template File</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Target Page Title: <strong className="text-slate-800">Admin Login</strong></div>
                      <div>Required Slug: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">/admin-login/</code></div>
                      <div>Assign Template: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">page-admin-login.php</code></div>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">5. Client Dashboard</span>
                      <span className="bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded text-[9px] font-mono">Template File</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Target Page Title: <strong className="text-slate-800">Client Dashboard</strong></div>
                      <div>Required Slug: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">/user-dashboard/</code></div>
                      <div>Assign Template: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">page-user-dashboard.php</code></div>
                    </div>
                  </div>

                  {/* Item 6 */}
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">6. Admin Control Center</span>
                      <span className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded text-[9px] font-mono">Template File</span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <div>Target Page Title: <strong className="text-slate-800">Admin Dashboard</strong></div>
                      <div>Required Slug: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">/admin-dashboard/</code></div>
                      <div>Assign Template: <code className="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-[9px] font-mono">page-admin-dashboard.php</code></div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 flex items-start space-x-3 text-xs leading-normal">
                  <Info className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                  <div>
                    <span className="font-bold block mb-1">💡 Critical Setup Instructions:</span>
                    When installing the downloaded <code className="bg-amber-100 px-1 py-0.5 rounded text-[11px]">mashud-telecom.zip</code> on your WordPress server, the theme will automatically provision the required database tables inside your MySQL system upon switching. Make sure to immediately add the six pages above from the WordPress admin menu so that registration and login redirects can navigate successfully.
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* PAGE: USER REGISTRATION */}
        {activePage === 'user-register' && (
          <div className="flex-grow flex items-center justify-center py-12 px-4 bg-slate-50">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md border border-slate-200">
              <div className="text-center space-y-1 mb-6">
                <div className="bg-sky-500/10 text-sky-600 p-2.5 rounded-full inline-flex">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950">Client Wallet Registration</h1>
                <p className="text-[10px] text-slate-500">Sign up below for Mashud Telecom wallet portal</p>
              </div>

              <form onSubmit={handleUserRegister} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      required 
                      className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="e.g. Mashud Rana" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required 
                      className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="e.g. mashud@telecom.com" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="tel" 
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      required 
                      className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="e.g. +8801700000000" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      required 
                      className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Confirm Password</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={regConfirmPass}
                      onChange={(e) => setRegConfirmPass(e.target.value)}
                      required 
                      className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">
                  Register Account
                </button>
              </form>

              <div className="text-center mt-4">
                <button onClick={() => setActivePage('user-login')} className="text-[10px] text-sky-600 font-bold hover:underline cursor-pointer">
                  Already registered? Access secure client login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: USER LOGIN */}
        {activePage === 'user-login' && (
          <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 bg-slate-50">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
              <div className="text-center space-y-1">
                <div className="bg-sky-500/10 text-sky-600 p-2.5 rounded-full inline-flex">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950">Client Gateway Access</h1>
                <p className="text-[10px] text-slate-500 font-medium">Configure credentials to load wallet accounts</p>
              </div>

              {/* Quick Login Assist Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">💡 Live Demo Quick Sign In</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <button 
                    type="button" 
                    onClick={() => {
                      setLoginUsername('masud@gmail.com');
                      setLoginPass('demo123');
                    }}
                    className="p-2 border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 rounded-lg text-left transition cursor-pointer"
                  >
                    <span className="font-bold block text-slate-900">Masud Alam (User)</span>
                    <span className="text-slate-500 font-mono">masud@gmail.com</span>
                    <span className="text-[9px] block text-sky-600 font-bold mt-0.5">Click to Autofill</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setLoginUsername('raihan@gmail.com');
                      setLoginPass('demo123');
                    }}
                    className="p-2 border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 rounded-lg text-left transition cursor-pointer"
                  >
                    <span className="font-bold block text-slate-900">Raihan Kabir (User)</span>
                    <span className="text-slate-500 font-mono">raihan@gmail.com</span>
                    <span className="text-[9px] block text-sky-600 font-bold mt-0.5">Click to Autofill</span>
                  </button>
                </div>
                <div className="text-[9px] text-slate-500 text-center font-medium">
                  Default Demo Password: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-bold">demo123</code>
                </div>
              </div>

              <form onSubmit={handleUserLogin} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Email or Mobile</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required 
                      className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="Email or Mobile" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <label className="block text-[10px] font-bold uppercase text-slate-600">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setActivePage('forgot-password')} 
                      className="text-[10px] text-sky-600 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      required 
                      className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">
                  Secure Wallet Sign In
                </button>
              </form>

              <div className="text-center space-y-1 pt-2">
                <button onClick={() => setActivePage('user-register')} className="block w-full text-center text-[10px] text-slate-500 font-medium hover:underline cursor-pointer">
                  New Client? Create standard account (Welcome 100 TK gift!)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: FORGOT PASSWORD (OTP Verification) */}
        {activePage === 'forgot-password' && (
          <div className="flex-grow flex items-center justify-center py-12 px-4 bg-slate-50">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
              <div className="text-center space-y-1">
                <div className="bg-amber-100 text-amber-700 p-2.5 rounded-full inline-flex">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-slate-950">Restore Access via OTP</h1>
                <p className="text-[10px] text-slate-500">Provide registration credentials below.</p>
              </div>

              {forgotStep === 1 ? (
                <form onSubmit={handleForgotPasswordStep1} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Email Address</label>
                    <input 
                      type="email" 
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required 
                      className="block w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="Enter registered email address" 
                    />
                  </div>
                  <button type="submit" className="w-full py-2 bg-slate-950 text-white text-xs font-semibold rounded-lg cursor-pointer">
                    Request Recovery OTP Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotPasswordStep2} className="space-y-3">
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-[10px] text-amber-800 leading-normal mb-1">
                    Simulating system verification dispatch to: <strong>{forgotEmail}</strong>. 
                    <br />We pre-loaded your OTP code into memory: <strong>{simulatedOtpValue}</strong>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">6-Digit Security OTP</label>
                    <input 
                      type="text" 
                      maxLength={6}
                      value={forgotOtpCode}
                      onChange={(e) => setForgotOtpCode(e.target.value)}
                      required 
                      className="block w-full p-2 border border-slate-200 rounded-lg text-xs text-center tracking-widest font-mono bg-slate-50 focus:outline-none" 
                      placeholder="••••••" 
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-0.5">New Password</label>
                    <input 
                      type="password" 
                      value={forgotNewPass}
                      onChange={(e) => setForgotNewPass(e.target.value)}
                      required 
                      className="block w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="••••••••" 
                    />
                  </div>

                  <button type="submit" className="w-full py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">
                    Save New Password
                  </button>
                </form>
              )}

              <div className="text-center">
                <button onClick={() => { setActivePage('user-login'); setForgotStep(1); }} className="text-[10px] text-slate-500 hover:underline cursor-pointer">
                  Return to client login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: ADMIN REGISTRATION */}
        {activePage === 'admin-register' && (
          <div className="flex-grow flex items-center justify-center py-12 px-4 bg-slate-50">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md border border-slate-200">
              <div className="text-center space-y-1 mb-6">
                <div className="bg-emerald-500/10 text-emerald-600 p-2.5 rounded-full inline-flex">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold text-slate-950">Corporate Administration</h1>
                <p className="text-[10px] text-slate-500">Configure supervisor database command access</p>
              </div>

              <form onSubmit={handleAdminRegister} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Admin Full Name</label>
                  <input 
                    type="text" 
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required 
                    className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                    placeholder="e.g. Lead Operator" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Corporate Email</label>
                  <input 
                    type="email" 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required 
                    className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                    placeholder="admin@mashudtelecom.com" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Supervisor Mobile</label>
                  <input 
                    type="tel" 
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    required 
                    className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                    placeholder="+8801555555555" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Root Password</label>
                  <input 
                    type="password" 
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    required 
                    className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                    placeholder="••••••••" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">6-Digit Authorization PIN</label>
                  <input 
                    type="password" 
                    maxLength={6}
                    value={regAdminPin}
                    onChange={(e) => setRegAdminPin(e.target.value)}
                    required 
                    className="block w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-center font-mono tracking-widest bg-slate-50 focus:outline-none" 
                    placeholder="••••••" 
                  />
                  <span className="block text-[9px] text-slate-400 mt-1 leading-tight">Strictly required to approve or decline user transactions. Keep it secure.</span>
                </div>

                <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">
                  Configure Administrator Access
                </button>
              </form>

              <div className="text-center mt-4">
                <button onClick={() => setActivePage('admin-login')} className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer">
                  Return to secure admin login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: ADMIN LOGIN */}
        {activePage === 'admin-login' && (
          <div className="flex-grow flex flex-col items-center justify-center py-12 px-4 bg-slate-50">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
              <div className="text-center space-y-1">
                <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-full inline-flex">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-950">Admin Secure Authorization</h1>
                <p className="text-[10px] text-slate-500">Provide corporate email and password</p>
              </div>

              {/* Quick Admin Assist Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider block">🛡️ Live Demo Admin Sign In</span>
                <button 
                  type="button" 
                  onClick={() => {
                    setLoginUsername('admin@mashudtelecom.com');
                    setLoginPass('demo123');
                  }}
                  className="w-full p-2.5 border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg text-left transition cursor-pointer"
                >
                  <span className="font-bold block text-slate-900">Super Admin Mashud (Admin)</span>
                  <span className="text-slate-500 font-mono text-[10px]">Email: admin@mashudtelecom.com</span>
                  <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                    <span>Password: <strong className="text-slate-600 font-mono">demo123</strong></span>
                    <span>Admin PIN: <strong className="text-slate-600 font-mono">258096</strong></span>
                  </div>
                  <span className="text-[9px] block text-emerald-600 font-bold mt-1">Click to Autofill Admin Login</span>
                </button>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Corporate Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="email" 
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required 
                      className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="admin@mashudtelecom.com" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">Master Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="password" 
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      required 
                      className="block w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button type="submit" className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">
                  Launch Secure Command Gate
                </button>
              </form>

              <div className="text-center">
                <button onClick={() => setActivePage('admin-register')} className="text-[10px] text-slate-500 font-semibold hover:underline cursor-pointer">
                  Request access credentials? Setup Administrator profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: USER DASHBOARD */}
        {activePage === 'user-dashboard' && currentSessionUser && (
          <div className="p-6 bg-slate-50 space-y-6 flex-grow select-none">
            {/* Header toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Welcome, {currentSessionUser.fullName}</h1>
                <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-500 mt-1">
                  <span className="font-bold text-slate-700">ID:</span> #MT-{currentSessionUser.id.toUpperCase().split('-')[1] || '89042'}
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-slate-700">Mobile:</span> {currentSessionUser.mobile}
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-slate-700">Email:</span> {currentSessionUser.email}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Available Balance High-Density Header Widget */}
                <div className={`px-4 py-2 rounded-xl shadow-md flex items-center space-x-3 border ${
                  currentSessionUser.balance < 0 
                    ? 'bg-gradient-to-r from-rose-700 to-red-800 border-red-600/30 text-white' 
                    : 'bg-gradient-to-r from-blue-700 to-indigo-800 border-indigo-600/30 text-white'
                }`}>
                  <Wallet className="w-5 h-5 text-blue-200" />
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-blue-200 leading-none">
                      {currentSessionUser.balance < 0 ? 'Credit Overdraft Balance' : 'Available Balance'}
                    </span>
                    <span className="text-sm font-black tracking-tight leading-none">৳ {currentSessionUser.balance.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setReportType('pdf')}
                  className="bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-bold py-2 px-3 border border-red-200 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Download PDF Report</span>
                </button>
                <button 
                  onClick={() => setReportType('excel')}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold py-2 px-3 border border-emerald-200 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Download Excel Sheet</span>
                </button>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Card 0: Available Balance */}
              <div className={`${
                currentSessionUser.balance < 0
                  ? 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-200'
                  : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-indigo-200'
              } p-5 rounded-2xl border flex items-center justify-between shadow-sm h-[120px]`}>
                <div className="space-y-1 min-w-0 flex-1">
                  <span className={`${
                    currentSessionUser.balance < 0 ? 'text-rose-600' : 'text-indigo-600'
                  } text-[9px] uppercase tracking-wider font-bold block truncate`}>
                    {currentSessionUser.balance < 0 ? 'Credit Overdraft Balance' : 'Available Balance'}
                  </span>
                  <div className={`text-xl font-extrabold font-sans truncate ${
                    currentSessionUser.balance < 0 ? 'text-rose-700' : 'text-indigo-700'
                  }`}>
                    ৳ {currentSessionUser.balance.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">
                    {currentSessionUser.balance < 0 ? 'Overdraft enabled' : 'Active core wallet balance'}
                  </p>
                </div>
                <div className={`${
                  currentSessionUser.balance < 0 
                    ? 'bg-rose-100 text-rose-600' 
                    : 'bg-indigo-100 text-indigo-600'
                } p-2.5 rounded-xl flex-shrink-0 ml-3`}>
                  <Wallet className="w-5 h-5" />
                </div>
              </div>

              {/* Card 1: Approved total Deposits */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm h-[120px]">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider font-bold block truncate">Approved Total Deposits</span>
                  <div className="text-xl font-extrabold text-sky-600 font-sans truncate">
                    ৳ {approvedDepositsSum.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    Approved: {approvedDepositsCount} deposits
                  </p>
                </div>
                <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl flex-shrink-0 ml-3">
                  <Banknote className="w-5 h-5" />
                </div>
              </div>

              {/* Card 2: user Approved Total Send Money */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm h-[120px]">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider font-bold block truncate">Approved Total Send Money</span>
                  <div className="text-xl font-extrabold text-emerald-600 font-sans truncate">
                    ৳ {approvedSendMoneySum.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    Approved: {approvedSendMoneyCount} transfers
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl flex-shrink-0 ml-3">
                  <Send className="w-5 h-5" />
                </div>
              </div>

              {/* Card 3: User Total Pending Deposit */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm h-[120px]">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider font-bold block truncate">Total Pending Deposit</span>
                  <div className="text-xl font-extrabold text-amber-600 font-sans truncate">
                    ৳ {pendingDepositsSum.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    Pending: {pendingDepositsCount} requests
                  </p>
                </div>
                <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl flex-shrink-0 ml-3">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              {/* Card 4: user Total Transfer Request */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm h-[120px]">
                <div className="space-y-1 min-w-0 flex-1">
                  <span className="text-slate-500 text-[9px] uppercase tracking-wider font-bold block truncate">Total Transfer Request</span>
                  <div className="text-xl font-extrabold text-violet-600 font-sans truncate">
                    ৳ {pendingTransfersSum.toFixed(2)}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    Pending: {pendingTransfersCount} transfers
                  </p>
                </div>
                <div className="bg-violet-50 text-violet-600 p-2.5 rounded-xl flex-shrink-0 ml-3">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
              </div>

              {/* Card 5: user Commission Earned */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-slate-500 text-[9px] uppercase tracking-wider font-bold block truncate">Commission Earned</span>
                    <div className="text-xl font-extrabold text-indigo-600 font-sans truncate">
                      ৳ {userCommission.toFixed(2)}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      Rate: ৳ {userCommissionMultiplier.toFixed(2)} per 1000 TK send money
                    </p>
                    {userCommissionChargesSum > 0 && (
                      <p className="text-[9px] text-slate-500 mt-0.5 truncate">
                        Raw: ৳ {((approvedSendMoneySum / 1000) * userCommissionMultiplier).toFixed(2)} | Charged: ৳ {userCommissionChargesSum.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl flex-shrink-0 ml-3">
                    <Coins className="w-5 h-5" />
                  </div>
                </div>
                {userCommission > 0 && (
                  <button
                    onClick={handleClaimCommission}
                    className="mt-2 w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Claim ৳ {userCommission.toFixed(2)} to Balance</span>
                  </button>
                )}
              </div>
            </div>

            {/* Transaction Actions and notifications panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Request Forms */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Send Money Form */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Send Money</h3>
                  </div>

                  <form onSubmit={handleSendMoneySubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Recipient Mobile</label>
                        <input 
                          type="tel" 
                          value={sendRecipient}
                          onChange={(e) => setSendRecipient(e.target.value)}
                          required 
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none font-medium" 
                          placeholder="e.g. +8801..." 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Amount (TK)</label>
                        <input 
                          type="number" 
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          required 
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none font-medium" 
                          placeholder="e.g. 200" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Way</label>
                        <select 
                          value={sendWay}
                          onChange={(e) => setSendWay(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none font-medium"
                        >
                          <option value="bkash">bkash</option>
                          <option value="Nagad">Nagad</option>
                          <option value="Roket">Roket</option>
                          <option value="Flexi">Flexi</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer">
                      Initiate Transfer Request
                    </button>
                  </form>
                </div>

                {/* Deposit Request Form */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-5 h-5 text-sky-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Submit Wallet Deposit Request</h3>
                  </div>

                  <form onSubmit={handleDepositSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Deposit Amount (TK)</label>
                        <input 
                          type="number" 
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          required 
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none" 
                          placeholder="e.g. 500" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Payment Method</label>
                        <select 
                          value={depositMethod}
                          onChange={(e) => setDepositMethod(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none font-medium"
                        >
                          <option value="By Bank">By Bank</option>
                          <option value="By Cash-hand">By Cash-hand</option>
                          <option value="bKash Personal">bKash Personal</option>
                          <option value="Nagad Personal">Nagad Personal</option>
                          <option value="Rocket Agent">Rocket Agent</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">TxnID / Reference Code</label>
                      <input 
                        type="text" 
                        value={depositRef}
                        onChange={(e) => setDepositRef(e.target.value)}
                        required 
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 font-mono focus:outline-none" 
                        placeholder="TRK9012498" 
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow transition cursor-pointer">
                      Submit Pending Deposit
                    </button>
                  </form>
                </div>

                {/* Filtering Table Setup */}
                {(() => {
                  const filteredUserTransactions = transactions
                    .filter(t => t.userId === currentSessionUser.id)
                    .filter(t => {
                      const tDate = t.createdAt ? t.createdAt.slice(0, 10) : '';
                      if (appliedFilterStartDate && tDate < appliedFilterStartDate) return false;
                      if (appliedFilterEndDate && tDate > appliedFilterEndDate) return false;
                      
                      const isCommissionCharge = t.recipient === 'System Commission Charge' || t.type === 'commission' || (t.referenceNo && t.referenceNo.startsWith('COM-'));
                      const isSendMoney = t.type === 'send_money' && !isCommissionCharge;
                      
                      if (appliedFilterType === 'deposit' && t.type !== 'deposit') return false;
                      if (appliedFilterType === 'send' && !isSendMoney) return false;
                      if (appliedFilterType === 'commission' && (!isCommissionCharge && !isSendMoney)) return false;

                      if (appliedFilterCustMobile.trim() !== '') {
                        const q = appliedFilterCustMobile.trim().toLowerCase();
                        const rec = (t.recipient || '').toLowerCase();
                        const mob = (t.userMobile || '').toLowerCase();
                        if (!rec.includes(q) && !mob.includes(q)) return false;
                      }
                      return true;
                    });

                  return (
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center space-x-2">
                          <Search className="w-4 h-4 text-sky-600" />
                          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Search & Filter Transactions</h3>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {filteredUserTransactions.length > 0 && (
                            <button 
                              type="button"
                              onClick={() => {
                                const charges = commissionCharges[currentSessionUser.id] || [];
                                const success = handleDownloadPDFStatement(
                                  currentSessionUser, 
                                  filteredUserTransactions, 
                                  currentSessionUser.commissionMultiplier ?? 7.5, 
                                  charges
                                );
                                if (success) {
                                  setSimAlert({ type: 'success', message: 'Filtered PDF Bank Statement downloaded successfully!' });
                                } else {
                                  setSimAlert({ type: 'error', message: 'Failed to generate PDF statement.' });
                                }
                              }}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>
                          )}

                          <button 
                            type="button"
                            onClick={() => {
                              setIsFilterDropdownOpen(!isFilterDropdownOpen);
                              handleApplySearchFilter();
                            }}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
                          >
                            <Search className="w-3.5 h-3.5" />
                            <span>Search</span>
                          </button>
                        </div>
                      </div>

                      {/* Search Dropdown & Controls */}
                      {isFilterDropdownOpen && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Date or Multiple Date Range */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">From Date</label>
                              <input 
                                type="date"
                                value={filterStartDate}
                                onChange={(e) => setFilterStartDate(e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-slate-700"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">To Date Range</label>
                              <input 
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => setFilterEndDate(e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-slate-700"
                              />
                            </div>

                            {/* Dropdown list: Deposit / Send / Commission */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Type (Deposit / Send / Commission)</label>
                              <select 
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-slate-700 font-bold text-slate-800"
                              >
                                <option value="all">All (Deposit, Send & Commission)</option>
                                <option value="deposit">Deposit</option>
                                <option value="send">Send</option>
                                <option value="commission">Commission</option>
                              </select>
                            </div>

                            {/* Cust Mobile Number */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Cust Mobile Number</label>
                              <input 
                                type="text"
                                value={filterCustMobile}
                                onChange={(e) => setFilterCustMobile(e.target.value)}
                                placeholder="e.g. +8801..."
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-slate-700"
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] font-semibold text-slate-500">
                              {appliedFilterType !== 'all' || appliedFilterStartDate || appliedFilterEndDate || appliedFilterCustMobile ? (
                                <span className="text-sky-700 font-bold bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
                                  Filter Active: <span className="uppercase">{appliedFilterType}</span>
                                </span>
                              ) : (
                                <span>All Customer Records</span>
                              )}
                            </span>
                            <div className="flex items-center space-x-2">
                              <button 
                                type="button"
                                onClick={handleResetSearchFilter}
                                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg font-medium cursor-pointer"
                              >
                                Reset
                              </button>
                              <button 
                                type="button"
                                onClick={handleApplySearchFilter}
                                className="px-4 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-sm transition cursor-pointer"
                              >
                                Search
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Filtered Records Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-slate-200 text-left text-xs">
                          <thead>
                            <tr className="text-slate-400 uppercase font-semibold text-[10px]">
                              <th className="py-2">Reference ID</th>
                              <th className="py-2">Type</th>
                              <th className="py-2">Cust Mobile</th>
                              <th className="py-2">Way</th>
                              <th className="py-2">Amount (TK)</th>
                              <th className="py-2">Status</th>
                              <th className="py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {filteredUserTransactions.map((t, index) => {
                              const isCommissionCharge = t.recipient === 'System Commission Charge' || t.type === 'commission' || (t.referenceNo && t.referenceNo.startsWith('COM-'));
                              const isSendMoney = t.type === 'send_money' && !isCommissionCharge;

                              let typeLabel = 'Deposit';
                              let badgeClass = 'bg-sky-100 text-sky-800';

                              if (isCommissionCharge) {
                                typeLabel = 'Commission Fee';
                                badgeClass = 'bg-rose-100 text-rose-800';
                              } else if (isSendMoney) {
                                if (appliedFilterType === 'commission') {
                                  typeLabel = 'Commission Earned';
                                  badgeClass = 'bg-purple-100 text-purple-800';
                                } else {
                                  typeLabel = 'Send';
                                  badgeClass = 'bg-emerald-100 text-emerald-800';
                                }
                              }

                              const mult = currentSessionUser.commissionMultiplier ?? 7.5;
                              const earnedCommission = (t.amount / 1000) * mult;

                              return (
                                <tr key={`user-filter-row-${t.id}-${index}`}>
                                  <td className="py-2 font-mono text-[10px] text-slate-600">{t.referenceNo}</td>
                                  <td className="py-2">
                                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full capitalize ${badgeClass}`}>
                                      {typeLabel}
                                    </span>
                                  </td>
                                  <td className="py-2 font-mono text-slate-500">{t.recipient || t.userMobile || '-'}</td>
                                  <td className="py-2 font-semibold text-indigo-600 capitalize">{t.way || '-'}</td>
                                  <td className="py-2 font-bold text-slate-900">
                                    {appliedFilterType === 'commission' ? (
                                      isCommissionCharge ? (
                                        <span className="text-rose-600 font-bold">- ৳ {t.amount.toFixed(2)}</span>
                                      ) : (
                                        <div>
                                          <span className="text-purple-700 font-bold">+ ৳ {earnedCommission.toFixed(2)}</span>
                                          <span className="text-[9px] text-slate-400 font-normal block">(Rate: ৳{mult}/1k on ৳{t.amount.toFixed(2)})</span>
                                        </div>
                                      )
                                    ) : (
                                      <span>৳ {t.amount.toFixed(2)}</span>
                                    )}
                                  </td>
                                  <td className="py-2">
                                    {t.status === 'approved' ? (
                                      <span className="inline-flex px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">Approved</span>
                                    ) : t.status === 'rejected' ? (
                                      <span className="inline-flex px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-bold rounded-full">Rejected</span>
                                    ) : (
                                      <span className="inline-flex px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full">Pending</span>
                                    )}
                                  </td>
                                  <td className="py-2 text-slate-400 text-[10px] font-mono">{t.createdAt}</td>
                                </tr>
                              );
                            })}
                            {filteredUserTransactions.length === 0 && (
                              <tr>
                                <td colSpan={7} className="text-center py-6 text-slate-400 text-xs">
                                  No matching records found for the specified filter criteria.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Download PDF statement button bottom bar when data is present */}
                      {filteredUserTransactions.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2">
                          <span className="text-[11px] font-semibold text-slate-500">
                            Showing <strong className="text-slate-800 font-bold">{filteredUserTransactions.length}</strong> matching transaction record{filteredUserTransactions.length > 1 ? 's' : ''}
                          </span>
                          <button 
                            type="button"
                            onClick={() => {
                              const charges = commissionCharges[currentSessionUser.id] || [];
                              const success = handleDownloadPDFStatement(
                                currentSessionUser, 
                                filteredUserTransactions, 
                                currentSessionUser.commissionMultiplier ?? 7.5, 
                                charges
                              );
                              if (success) {
                                setSimAlert({ type: 'success', message: 'Filtered PDF Bank Statement downloaded successfully!' });
                              } else {
                                setSimAlert({ type: 'error', message: 'Failed to generate PDF statement.' });
                              }
                            }}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download PDF Bank Statement ({filteredUserTransactions.length})</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}

              </div>

              {/* Sidebar alerts and security details */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Simulated notifications */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</h3>
                  
                  <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {notifications.filter(n => n.userId === currentSessionUser.id).map((n, index) => (
                      <div key={`${n.id}-${index}`} className="p-3 bg-slate-50 rounded-lg border-l-4 border-sky-500 text-left space-y-1">
                        <span className="block text-[10px] font-bold text-slate-950 leading-tight">{n.title}</span>
                        <p className="text-[9px] text-slate-500 leading-normal">{n.message}</p>
                        <span className="block text-[8px] text-slate-400 font-mono">{n.createdAt}</span>
                      </div>
                    ))}
                    {notifications.filter(n => n.userId === currentSessionUser.id).length === 0 && (
                      <p className="text-[11px] text-slate-400 text-center py-6">No recent notifications logged.</p>
                    )}
                  </div>
                </div>

                {/* Profile settings simulation */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Account Configurations</h3>
                  <form onSubmit={handleSettingsSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Update Account Name</label>
                      <input 
                        type="text" 
                        value={settingsName}
                        onChange={(e) => setSettingsName(e.target.value)}
                        required 
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none mt-1" 
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 uppercase">Change security password</label>
                      <input 
                        type="password" 
                        value={settingsPass}
                        onChange={(e) => setSettingsPass(e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none mt-1" 
                        placeholder="••••••••" 
                      />
                    </div>
                    <button type="submit" className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold rounded-lg cursor-pointer">
                      Save Profile Parameters
                    </button>
                  </form>
                </div>

              </div>
            </div>

            {/* Transaction Ledger list */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Your Transaction Ledger</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-slate-200 text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase font-semibold text-[10px]">
                      <th className="py-2.5">Reference ID</th>
                      <th className="py-2.5">Type</th>
                      <th className="py-2.5">Recipient</th>
                      <th className="py-2.5">Way</th>
                      <th className="py-2.5">Amount (TK)</th>
                      <th className="py-2.5">Settlement State</th>
                      <th className="py-2.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {transactions.filter(t => t.userId === currentSessionUser.id).map((t, index) => (
                      <tr key={`${t.id}-${index}`}>
                        <td className="py-2.5 font-mono text-[10px] text-slate-600">{t.referenceNo}</td>
                        <td className="py-2.5">
                          <span className="capitalize">{t.recipient === 'System Commission Charge' ? 'Commission Charge' : t.type.replace('_', ' ')}</span>
                          {t.isOverdraft && (
                            <span className="block text-[8px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1 py-0.5 rounded w-max mt-0.5 uppercase">Bank Credit</span>
                          )}
                        </td>
                        <td className="py-2.5 font-mono text-slate-500">{t.recipient || '-'}</td>
                        <td className="py-2.5 font-semibold text-indigo-600 capitalize">{t.way || '-'}</td>
                        <td className="py-2.5 font-bold text-slate-900">
                          ৳ {t.amount.toFixed(2)}
                        </td>
                        <td className="py-2.5">
                          {t.status === 'approved' ? (
                            <div className="flex flex-col items-start gap-0.5">
                              <span className="inline-flex px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">Approved</span>
                              {t.authPin && (
                                <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-100 mt-0.5">
                                  PIN: {t.authPin}
                                </span>
                              )}
                            </div>
                          ) : t.status === 'rejected' ? (
                            <span className="inline-flex px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-bold rounded-full">Rejected</span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full animate-pulse">Awaiting Approval</span>
                          )}
                        </td>
                        <td className="py-2.5 text-slate-400 text-[10px] font-mono">{t.createdAt}</td>
                      </tr>
                    ))}
                    {transactions.filter(t => t.userId === currentSessionUser.id).length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400">No transactions recorded in local simulated database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: ADMIN DASHBOARD */}
        {activePage === 'admin-dashboard' && currentSessionUser && currentSessionUser.role === 'admin' && (
          <div className="p-6 bg-slate-50 space-y-6 flex-grow select-none">
            {/* Header command bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Supervisor Core Control</h1>
                <p className="text-[11px] text-slate-500">Security PIN authenticated. Dynamic action releases ready.</p>
              </div>
              <div>
                <button 
                  onClick={() => alert('Download Client Ledger has compiled successfully. Saved under system folder.')}
                  className="bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-bold py-2.5 px-3 rounded-lg flex items-center space-x-1 transition shadow cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Client Ledger</span>
                </button>
              </div>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Registered Clients</span>
                  <div className="text-2xl font-extrabold text-slate-950 font-sans">{systemClients.length}</div>
                  <span className="text-[8px] text-emerald-600 font-bold">100% Verified Ledger</span>
                </div>
                <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Approved Deposits</span>
                  <div className="text-2xl font-extrabold text-slate-950 font-sans">{totalApprovedDeposits.toFixed(2)} TK</div>
                  <span className="text-[8px] text-slate-400">Total processed net flow</span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <Banknote className="w-5 h-5" />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Deposits Pending</span>
                  <div className="text-2xl font-extrabold text-amber-600 font-sans">{pendingDepositsList.length}</div>
                  <span className="text-[8px] text-slate-400">Requires Admin PIN release</span>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Transfer Requests</span>
                  <div className="text-2xl font-extrabold text-violet-600 font-sans">{pendingTransfersList.length}</div>
                  <span className="text-[8px] text-slate-400">Money transfers pending</span>
                </div>
                <div className="p-2.5 rounded-lg bg-violet-50 text-violet-600">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Pending Transaction review grids */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 space-y-6">
                
                {/* Pending Deposits REVIEW queue */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Deposits Reviews</h3>
                    <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded-full">{pendingDepositsList.length} Actionable</span>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {pendingDepositsList.map((dep, idx) => {
                      const client = users.find(u => u.id === dep.userId);
                      return (
                        <div key={`${dep.id}-${idx}`} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <span className="block font-bold text-slate-900">{client ? client.fullName : 'Unknown User'} ({dep.userMobile})</span>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[9px] text-slate-400 font-mono">TxnID: <code className="bg-slate-200 text-slate-700 px-1 rounded text-[8px]">{dep.referenceNo}</code></span>
                              <span className="inline-flex px-1.5 py-0.5 bg-sky-100 text-sky-800 text-[8px] font-bold rounded uppercase">{dep.way || 'Unknown'}</span>
                            </div>
                            <div className="text-sm font-extrabold text-sky-600">{dep.amount.toFixed(2)} TK</div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleAdminActionTrigger('approve_deposit', dep.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleAdminActionTrigger('reject_deposit', dep.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold py-1.5 px-2.5 rounded-lg border border-red-200 transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {pendingDepositsList.length === 0 && (
                      <p className="text-[11px] text-slate-400 text-center py-8">No pending deposits currently registered in simulation.</p>
                    )}
                  </div>
                </div>

                {/* Pending Send-Money releases reviews */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pending Send Money Approvals</h3>
                    <span className="bg-violet-100 text-violet-800 text-[9px] font-bold px-2 py-0.5 rounded-full">{pendingTransfersList.length} Actionable</span>
                  </div>

                  <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                    {pendingTransfersList.map((txn, idx) => {
                      const client = users.find(u => u.id === txn.userId);
                      return (
                        <div key={`${txn.id}-${idx}`} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                          <div className="space-y-1">
                            <span className="block font-bold text-slate-900">
                              {client ? client.fullName : 'Unknown Sender'} ({txn.userMobile})
                              {txn.isOverdraft && (
                                <span className="inline-flex px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[8px] font-bold rounded uppercase border border-rose-200 ml-1.5 animate-pulse">⚠️ Overdraft Credit</span>
                              )}
                            </span>
                            <div className="space-y-0.5">
                              <span className="block text-[10px] text-slate-400 leading-normal">Transfer to destination: <strong className="text-slate-800">{txn.recipient}</strong></span>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                <span className="inline-flex px-1.5 py-0.5 bg-violet-100 text-violet-800 text-[8px] font-bold rounded uppercase">Way: {txn.way || 'Unknown'}</span>
                                {txn.isOverdraft && (
                                  <span className="inline-flex px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[8px] font-bold rounded uppercase">Allows negative balance</span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm font-extrabold text-violet-600">{txn.amount.toFixed(2)} TK</div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleAdminActionTrigger('approve_send', txn.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg transition cursor-pointer"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleAdminActionTrigger('reject_send', txn.id)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold py-1.5 px-2.5 rounded-lg border border-red-200 transition cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {pendingTransfersList.length === 0 && (
                      <p className="text-[11px] text-slate-400 text-center py-8">No pending transfer requests mapped.</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Sidebar parameters and user search lookup */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Search panel */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Client & Admin Directory</h3>
                    <button 
                      type="button"
                      onClick={() => setShowAdminCreateAccountModal(true)} 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-sm"
                      title="Administrator creates a new User or Admin account"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Create Account</span>
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search accounts..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                    {filteredUsers.map((u, idx) => (
                      <div 
                        key={`${u.id}-${idx}`} 
                        onClick={() => {
                          setSelectedUserToView(u);
                          setAdjustAmount('');
                          setAdjustRef('');
                        }}
                        className="text-[11px] flex justify-between items-center p-2.5 rounded-xl border border-slate-100 hover:border-sky-400 hover:bg-sky-50/50 cursor-pointer transition-all duration-200 group"
                        title={`Click to open control panel for ${u.fullName}`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-[10px] uppercase transition-colors ${
                            u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700'
                          }`}>
                            {u.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </div>
                          <div>
                            <strong className="block text-slate-900 group-hover:text-sky-700 transition-colors flex items-center gap-1">
                              {u.fullName}
                              <span className={`text-[8px] px-1 py-0.2 rounded font-extrabold uppercase ${
                                u.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {u.role}
                              </span>
                            </strong>
                            <span className="block text-[9px] text-slate-400 font-mono">{u.mobile}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleUserRole(u);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                            title={`Make ${u.role === 'admin' ? 'User' : 'Admin'}`}
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUserToDelete(u);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title={`Delete account ${u.fullName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="text-right pl-1">
                            <span className="font-bold text-emerald-600 font-mono block">{u.balance.toFixed(2)} TK</span>
                            <span className="text-[8px] bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-medium group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
                              Control &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center py-4">No matching accounts found.</p>
                    )}
                  </div>
                </div>

                {/* System Parameters and Commissions */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs text-left">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">System Settings & reserves</h3>
                  <div className="space-y-3">
                    {/* User Selection Dropdown */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Client</label>
                      <select
                        value={selectedCommissionUserId}
                        onChange={(e) => {
                          const uid = e.target.value;
                          setSelectedCommissionUserId(uid);
                          // Field is manual blank or load existing on change
                          const u = users.find(x => x.id === uid);
                          if (u) {
                            setCommissionMultiplierInput(u.commissionMultiplier !== undefined ? String(u.commissionMultiplier) : '');
                          } else {
                            setCommissionMultiplierInput('');
                          }
                        }}
                        className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none text-slate-800 font-semibold"
                      >
                        <option value="">-- Choose Client Profile --</option>
                        {systemClients.map(u => (
                          <option key={u.id} value={u.id}>
                            {u.fullName} ({u.mobile}) {u.commissionMultiplier !== undefined ? `[Fixed: ৳ ${u.commissionMultiplier}]` : '[Default: ৳ 7.5]'}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* New Field: user commission, manual blank */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">User Commission</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="Manual rate e.g. 7.5"
                          value={commissionMultiplierInput}
                          onChange={(e) => setCommissionMultiplierInput(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none font-mono" 
                        />
                        <span className="absolute right-2.5 top-2.5 text-[9px] text-slate-400 font-medium font-mono">per 1000 TK</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                        Formula: <code className="font-mono text-indigo-600 font-bold">(Approved Send Money / 1000) * Rate</code>. Default is 7.5.
                      </p>
                    </div>

                    <button 
                      onClick={handleApplyUserCommissionMultiplier}
                      disabled={!selectedCommissionUserId}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-[10px] font-bold w-full py-2.5 rounded-lg cursor-pointer text-center transition active:scale-95 shadow-sm"
                    >
                      Apply & Fix Settings
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Activity log tracker */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live System Security Logs</h3>
              <div className="overflow-y-auto max-h-52 pr-1 text-left">
                <table className="w-full divide-y divide-slate-200 text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase font-semibold text-[10px]">
                      <th className="py-2">Authorized User</th>
                      <th className="py-2">Dynamic Activity Action Logged</th>
                      <th className="py-2">Device IP Address</th>
                      <th className="py-2">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                    {activityLogs.map((log, idx) => (
                      <tr key={`${log.id}-${idx}`}>
                        <td className="py-2 font-bold text-slate-900">{log.userEmail}</td>
                        <td className="py-2 text-slate-700">{log.action}</td>
                        <td className="py-2 font-mono text-[10px] text-slate-400">{log.ipAddress}</td>
                        <td className="py-2 font-mono text-[10px] text-slate-400">{log.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-center text-xs select-none mt-auto">
        <p>&copy; 2026 Mashud Telecom WordPress Theme Simulator. Developed for magraphice.</p>
      </footer>

      {/* SECURITY VERIFICATION PIN CHALLENGE MODAL */}
      {pinChallengeAction && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-5 rounded-2xl max-w-sm w-full border border-slate-200 shadow-xl space-y-4 text-left">
            <div className="text-center space-y-1">
              <ShieldAlert className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">
                {pinChallengeAction.startsWith('approve') ? 'Confirm & Authorize Approval' : 'Confirm Action Rejection'}
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                {pinChallengeAction.startsWith('approve') 
                  ? 'Administrative security protocols mandate setting a manual custom PIN to authorize this transaction approval.'
                  : 'Are you sure you want to decline this transaction request? Rejections do not require an authorization PIN.'}
              </p>
            </div>
            
            <div className="space-y-3">
              {pinChallengeAction.startsWith('approve') && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1 text-center">
                    Create & Enter Manual Authorization PIN (4-8 digits)
                  </label>
                  <input 
                    type="text" 
                    maxLength={8}
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-center font-mono text-xl tracking-widest bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 font-extrabold" 
                    placeholder="e.g. 589803" 
                  />
                  <p className="text-[9px] text-slate-400 text-center mt-1 leading-normal">
                    This manual PIN will be permanently tied to the ledger transaction and sent to the user's notification feed.
                  </p>
                </div>
              )}

              {pinError && (
                <p className="text-[10px] text-red-500 text-center font-semibold leading-snug">{pinError}</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setPinChallengeAction(null); setPinChallengeTargetId(null); }}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdminActionAuthorize}
                  className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow cursor-pointer text-center"
                >
                  {pinChallengeAction.startsWith('approve') ? 'Authorize PIN' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER CONTROL PANEL & LIVE DASHBOARD OVERLAY */}
      {selectedUserToView && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-5xl w-full border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-tight flex items-center gap-2">
                    Client Control Panel & Live Dashboard Simulation
                    <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30">
                      MT-{selectedUserToView.id.toUpperCase().split('-')[1] || '89042'}
                    </span>
                  </h2>
                  <p className="text-[10px] text-slate-400">Inspecting database profile parameters, transaction ledgers, and live feed alerts.</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUserToView(null)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 bg-slate-50 flex-grow">
              
              {/* Profile Card & Adjustment Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Profile Identity Card */}
                <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-start space-y-4 text-left">
                  <div className="space-y-3.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">👤 Core Client Profile</span>
                    <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                      <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 font-extrabold flex items-center justify-center text-sm border border-sky-100 uppercase">
                        {selectedUserToView.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 leading-tight">{selectedUserToView.fullName}</h4>
                        <span className="text-[9px] text-slate-500 block font-mono mt-0.5">{selectedUserToView.email}</span>
                        <span className="text-[9px] text-slate-500 block font-mono">{selectedUserToView.mobile}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Account Role:</span>
                        <span className={`font-bold text-[9px] uppercase px-2 py-0.5 rounded ${
                          selectedUserToView.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {selectedUserToView.role === 'admin' ? 'Administrator' : 'Client User'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Verification State:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Fully Verified
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Created At:</span>
                        <span className="font-semibold text-slate-700 font-mono">{selectedUserToView.createdAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Demo Password:</span>
                        <span className="font-semibold text-slate-700 font-mono">{selectedUserToView.password || 'demo123'}</span>
                      </div>
                    </div>

                    {/* Role Toggle Button */}
                    <button 
                      type="button"
                      onClick={() => handleToggleUserRole(selectedUserToView)}
                      className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      title={`Switch account role to ${selectedUserToView.role === 'admin' ? 'User' : 'Admin'}`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>{selectedUserToView.role === 'admin' ? 'Make Client User' : 'Make Administrator'}</span>
                    </button>

                    {/* Delete User Button */}
                    <button 
                      type="button"
                      onClick={() => setUserToDelete(selectedUserToView)}
                      className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete User Profile</span>
                    </button>
                  </div>

                   {/* Wallet Widget */}
                  <div className={`rounded-xl p-4 relative overflow-hidden ${
                    selectedUserToView.balance < 0
                      ? 'bg-gradient-to-br from-red-950 to-rose-900 border border-red-800 text-white'
                      : 'bg-gradient-to-br from-slate-800 to-slate-950 text-white'
                  }`}>
                    <div className="relative z-10 space-y-1">
                      <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">
                        {selectedUserToView.balance < 0 ? '⚠️ Ledger Core Balance (Overdraft Credit)' : 'Ledger Core Balance'}
                      </span>
                      <h3 className={`text-lg font-black font-mono ${selectedUserToView.balance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>৳ {selectedUserToView.balance.toFixed(2)}</h3>
                    </div>
                    <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/5 rounded-full"></div>
                  </div>

                  {/* Charge for Commission Section */}
                  <div className="border-t border-slate-100 pt-4 mt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">⚡ Charge for Commission</span>
                    
                    {/* Manual amount form */}
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-grow">
                        <span className="absolute left-2.5 top-2.5 text-[10px] font-semibold text-slate-400 font-mono">৳</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Manual amount"
                          value={manualChargeInput}
                          onChange={(e) => setManualChargeInput(e.target.value)}
                          className="w-full pl-5 pr-2 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none font-mono focus:border-indigo-400 transition"
                        />
                      </div>
                      <button
                        onClick={() => handleApplyManualCommissionCharge(selectedUserToView.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-4 py-2 rounded-xl cursor-pointer transition flex items-center justify-center gap-1 active:scale-95"
                      >
                        Charge
                      </button>
                    </div>

                    {/* Charged Commission Table */}
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 max-h-[140px] overflow-y-auto">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Commission History</span>
                      
                      {(!commissionCharges[selectedUserToView.id] || commissionCharges[selectedUserToView.id].length === 0) ? (
                        <div className="text-[10px] text-slate-400 text-center py-4 font-medium italic">
                          No commission charges applied yet.
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-[10px]">
                            <thead>
                              <tr className="text-slate-400 font-bold uppercase text-[8px] border-b border-slate-200/60 pb-1">
                                <th className="pb-1">Timestamp</th>
                                <th className="pb-1 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                              {commissionCharges[selectedUserToView.id].map((charge) => (
                                <tr key={charge.id} className="hover:bg-slate-100/50">
                                  <td className="py-1 text-slate-500 font-mono text-[9px]">{charge.timestamp.split(' ')[1] || charge.timestamp}</td>
                                  <td className="py-1 text-right font-bold text-red-600 font-mono">
                                    ৳ -{charge.amount.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Direct Funds Settlement form */}
                <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-left">
                  <div className="flex items-center space-x-2">
                    <Pocket className="w-4 h-4 text-sky-600" />
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Direct Funds Settlement (Supervisor Override)</h3>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 leading-normal">
                    As Super Administrator, you can bypass normal verification queues and directly modify the user's wallet available balance. The adjustment will be recorded in the security audit trail and the transaction ledger.
                  </p>

                  <form onSubmit={handleExecuteManualAdjustment} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-600 uppercase mb-1">Settlement Type</label>
                        <select 
                          value={adjustType}
                          onChange={(e) => setAdjustType(e.target.value as 'add' | 'deduct')}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none text-xs font-semibold text-slate-800"
                        >
                          <option value="add">➕ Credit (Add Funds)</option>
                          <option value="deduct">➖ Debit (Deduct Funds)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-600 uppercase mb-1">Adjustment Amount (TK)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={adjustAmount}
                          onChange={(e) => setAdjustAmount(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-mono focus:outline-none text-xs" 
                          placeholder="e.g. 1000.00" 
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-600 uppercase mb-1">Custom Reference/Note (Optional)</label>
                        <input 
                          type="text" 
                          value={adjustRef}
                          onChange={(e) => setAdjustRef(e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg bg-slate-50 font-mono focus:outline-none text-xs" 
                          placeholder="e.g. SYSTEM_REWARD" 
                        />
                      </div>
                    </div>
                    <button 
                      type="submit" 
                      className={`w-full py-2 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors ${
                        adjustType === 'add' 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      Execute {adjustType === 'add' ? 'Credit' : 'Debit'} Settlement Override
                    </button>
                  </form>

                  {/* RESTYLED: Black Ledger cards and tables under the override form */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    {/* Left: Total Approved Deposits and Send Money Approved (KPIs + Tables together) */}
                    <div className="space-y-3 text-left">
                      {/* Grid for Cards */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Card 1: Total Approved Deposits */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-xl p-3 relative overflow-hidden flex flex-col justify-between min-h-[70px]">
                          <div className="relative z-10 space-y-0.5">
                            <span className="text-[7px] text-slate-400 uppercase tracking-widest font-bold block">💸 Total Approved Deposits</span>
                            <h3 className="text-sm font-black text-emerald-400 font-mono">
                              ৳ {transactions
                                .filter(t => t.userId === selectedUserToView.id && t.type === 'deposit' && t.status === 'approved')
                                .reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                            </h3>
                          </div>
                          <div className="absolute -right-3 -bottom-3 w-10 h-10 bg-white/5 rounded-full"></div>
                        </div>

                        {/* Card 2: Total Send Money Approved */}
                        <div id="selected-user-approved-send-money-card" className="bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-xl p-3 relative overflow-hidden flex flex-col justify-between min-h-[70px]">
                          <div className="relative z-10 space-y-0.5">
                            <span className="text-[7px] text-slate-400 uppercase tracking-widest font-bold block">🚀 Total Send Money Approved</span>
                            <h3 id="selected-user-approved-send-money-total" className="text-sm font-black text-rose-400 font-mono">
                              ৳ {transactions
                                .filter(t => t.userId === selectedUserToView.id && t.type === 'send_money' && t.status === 'approved')
                                .reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
                            </h3>
                          </div>
                          <div className="absolute -right-3 -bottom-3 w-10 h-10 bg-white/5 rounded-full"></div>
                        </div>
                      </div>

                      {/* Table 1: Approved Deposits */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block px-1">Deposits List</span>
                        <div className="max-h-[110px] overflow-y-auto border border-slate-100 rounded-lg bg-slate-50 p-1.5">
                          <table className="w-full text-[9px] text-left">
                            <thead>
                              <tr className="text-slate-400 uppercase font-semibold text-[8px] border-b border-slate-200">
                                <th className="py-1">Ref / Method</th>
                                <th className="py-1 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                              {transactions
                                .filter(t => t.userId === selectedUserToView.id && t.type === 'deposit' && t.status === 'approved')
                                .map((t, idx) => (
                                  <tr key={`sel-dep-${t.id}-${idx}`}>
                                    <td className="py-1">
                                      <div className="font-bold text-slate-700 leading-tight">{t.referenceNo}</div>
                                      <div className="text-slate-400 font-mono text-[8px]">{t.way || 'Direct'}</div>
                                    </td>
                                    <td className="py-1 text-right font-bold text-emerald-600">৳ {t.amount.toFixed(2)}</td>
                                  </tr>
                                ))}
                              {transactions.filter(t => t.userId === selectedUserToView.id && t.type === 'deposit' && t.status === 'approved').length === 0 && (
                                <tr>
                                  <td colSpan={2} className="text-center py-3 text-slate-400 font-normal">No approved deposits.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Table 2: Send Money Approved (placed immediately under Table 1) */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block px-1">Send Money & Debits List</span>
                        <div id="selected-user-approved-send-money-table-container" className="max-h-[110px] overflow-y-auto border border-slate-100 rounded-lg bg-slate-50 p-1.5">
                          <table className="w-full text-[9px] text-left">
                            <thead>
                              <tr className="text-slate-400 uppercase font-semibold text-[8px] border-b border-slate-200">
                                <th className="py-1">Recipient / Way</th>
                                <th className="py-1 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                              {transactions
                                .filter(t => t.userId === selectedUserToView.id && t.type === 'send_money' && t.status === 'approved')
                                .map((t, idx) => (
                                  <tr key={`sel-send-${t.id}-${idx}`}>
                                    <td className="py-1">
                                      <div className="font-bold text-slate-700 leading-tight">{t.recipient || 'Unknown'}</div>
                                      <div className="text-slate-400 font-mono text-[8px]">{t.referenceNo} ({t.way || 'Direct'})</div>
                                    </td>
                                    <td className="py-1 text-right font-bold text-rose-600">৳ {t.amount.toFixed(2)}</td>
                                  </tr>
                                ))}
                              {transactions.filter(t => t.userId === selectedUserToView.id && t.type === 'send_money' && t.status === 'approved').length === 0 && (
                                <tr>
                                  <td colSpan={2} className="text-center py-3 text-slate-400 font-normal">No approved send money transfers.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Right: Total Commission Earned */}
                    <div className="space-y-3 text-left">
                      <div className="bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-xl p-4 relative overflow-hidden">
                        <div className="relative z-10 space-y-1">
                          <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold">🪙 Total Commission Earned</span>
                          <h3 className="text-lg font-black text-indigo-400 font-mono">
                            ৳ {selectedUserFinalCommission.toFixed(2)}
                          </h3>
                          <span className="text-[8px] text-indigo-300 block">Rate: ৳ {(selectedUserToView.commissionMultiplier ?? 7.5).toFixed(2)} per 1000 TK send money</span>
                          {selectedUserChargesSum > 0 && (
                            <div className="text-[9px] text-slate-300 mt-1 space-y-0.5 border-t border-slate-700/50 pt-1">
                              <div className="flex justify-between">
                                <span>Raw Commission:</span>
                                <span className="font-mono">৳ {selectedUserRawCommission.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-rose-400">
                                <span>Total Charged:</span>
                                <span className="font-mono">৳ {selectedUserChargesSum.toFixed(2)}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-white/5 rounded-full"></div>
                      </div>

                      <div className="max-h-[120px] overflow-y-auto border border-slate-100 rounded-lg bg-slate-50 p-1.5">
                        <table className="w-full text-[9px] text-left">
                          <thead>
                            <tr className="text-slate-400 uppercase font-semibold text-[8px] border-b border-slate-200">
                              <th className="py-1">Send Money Ref</th>
                              <th className="py-1 text-right font-bold">Commission (৳ {(selectedUserToView.commissionMultiplier ?? 7.5).toFixed(2)}/1k)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                            {transactions
                              .filter(t => t.userId === selectedUserToView.id && t.type === 'send_money' && t.status === 'approved')
                              .map((t, idx) => (
                                <tr key={`sel-comm-${t.id}-${idx}`}>
                                  <td className="py-1 text-left">
                                    <div className="font-bold text-slate-700 leading-tight">{t.recipient || 'Unknown'}</div>
                                    <div className="text-slate-400 font-mono text-[8px]">{t.referenceNo} (Send: ৳ {t.amount.toFixed(2)})</div>
                                  </td>
                                  <td className="py-1 text-right font-bold text-indigo-600">৳ {((t.amount / 1000) * (selectedUserToView.commissionMultiplier ?? 7.5)).toFixed(2)}</td>
                                </tr>
                              ))}
                            {transactions.filter(t => t.userId === selectedUserToView.id && t.type === 'send_money' && t.status === 'approved').length === 0 && (
                              <tr>
                                <td colSpan={2} className="text-center py-3 text-slate-400 font-normal">No commission earned.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* User Dashboard Preview Modules */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Simulated notifications feed */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between max-h-[350px]">
                  <div>
                    <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                      <Clock className="w-4 h-4 text-slate-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Client Live Feed Alerts</h3>
                    </div>
                    
                    <div className="space-y-2 mt-3 overflow-y-auto max-h-[220px] pr-1">
                      {notifications.filter(n => n.userId === selectedUserToView.id).map((n, index) => (
                        <div key={`${n.id}-${index}`} className="p-2.5 bg-slate-50 rounded-lg border-l-4 border-sky-500 text-left space-y-0.5">
                          <span className="block text-[10px] font-bold text-slate-950 leading-tight">{n.title}</span>
                          <p className="text-[9px] text-slate-500 leading-normal">{n.message}</p>
                          <span className="block text-[8px] text-slate-400 font-mono">{n.createdAt}</span>
                        </div>
                      ))}
                      {notifications.filter(n => n.userId === selectedUserToView.id).length === 0 && (
                        <p className="text-[11px] text-slate-400 text-center py-12">No recent alerts registered for this profile.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* User's transaction ledger history */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col max-h-[350px]">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Activity Transaction Ledger</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => {
                          const userTxns = transactions.filter(t => t.userId === selectedUserToView.id);
                          const charges = commissionCharges[selectedUserToView.id] || [];
                          const success = handleDownloadPDFStatement(selectedUserToView, userTxns, selectedUserToView.commissionMultiplier ?? 7.5, charges);
                          if (success) {
                            setSimAlert({ type: 'success', message: `Downloaded professional PDF bank statement for ${selectedUserToView.fullName}!` });
                          } else {
                            setSimAlert({ type: 'error', message: `Failed to generate PDF statement.` });
                          }
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-700 text-[9px] font-bold py-1 px-2.5 rounded-lg border border-red-200 transition cursor-pointer flex items-center space-x-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Download PDF Statement</span>
                      </button>
                      <button 
                        onClick={() => {
                          const headers = ['TxnID', 'Action', 'Recipient', 'Amount', 'Status', 'AuthPIN', 'Timestamp'];
                          const csvRows = [headers.join(',')];
                          transactions.filter(t => t.userId === selectedUserToView.id).forEach(t => {
                            csvRows.push([t.referenceNo, t.type, t.recipient || 'N/A', t.amount, t.status, t.authPin || 'N/A', t.createdAt].join(','));
                          });
                          const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", `ledger_${selectedUserToView.fullName.replace(/\s+/g, '_').toLowerCase()}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          setSimAlert({ type: 'success', message: `Exported complete ledger history for ${selectedUserToView.fullName}!` });
                        }}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-700 text-[9px] font-bold py-1 px-2.5 rounded-lg border border-sky-200 transition cursor-pointer"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto max-h-[220px] pr-1">
                    <table className="w-full divide-y divide-slate-200 text-left text-[10px]">
                      <thead>
                        <tr className="text-slate-400 uppercase font-bold">
                          <th className="py-2">Ref ID</th>
                          <th className="py-2">Type</th>
                          <th className="py-2">Recipient</th>
                          <th className="py-2">Way</th>
                          <th className="py-2">Amount</th>
                          <th className="py-2">State</th>
                          <th className="py-2 text-right">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                        {transactions.filter(t => t.userId === selectedUserToView.id).map((t, index) => (
                          <tr key={`${t.id}-${index}`}>
                            <td className="py-2 font-mono text-[9px] text-slate-500">{t.referenceNo}</td>
                            <td className="py-2 capitalize font-semibold text-slate-700">
                              {t.recipient === 'System Commission Charge' ? 'Commission Charge' : t.type.replace('_', ' ')}
                              {t.isOverdraft && (
                                <span className="block text-[7px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-1 py-0.5 rounded w-max mt-0.5 uppercase">Bank Credit</span>
                              )}
                            </td>
                            <td className="py-2 font-mono text-slate-500">{t.recipient || 'N/A'}</td>
                            <td className="py-2 font-semibold text-indigo-600 capitalize">{t.way || 'N/A'}</td>
                            <td className="py-2 font-bold text-slate-900">
                              ৳ {t.amount.toFixed(2)}
                            </td>
                            <td className="py-2">
                              {t.status === 'approved' ? (
                                <div className="flex flex-col items-start">
                                  <span className="inline-flex px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-bold rounded">Approved</span>
                                  {t.authPin && <span className="text-[8px] text-emerald-600 font-mono">PIN: {t.authPin}</span>}
                                </div>
                              ) : t.status === 'rejected' ? (
                                <span className="inline-flex px-1.5 py-0.5 bg-red-100 text-red-800 text-[8px] font-bold rounded">Rejected</span>
                              ) : (
                                <span className="inline-flex px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-bold rounded animate-pulse">Pending</span>
                              )}
                            </td>
                            <td className="py-2 text-slate-400 text-right font-mono text-[9px]">{t.createdAt}</td>
                          </tr>
                        ))}
                        {transactions.filter(t => t.userId === selectedUserToView.id).length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-slate-400">No transactions recorded.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-between items-center text-[10px]">
              <span className="text-slate-400 font-mono">Supervisor Audit Log Active</span>
              <button 
                onClick={() => setSelectedUserToView(null)}
                className="py-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition-colors text-[10px]"
              >
                Close Control Panel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REPORT SIMULATION OVERLAYS (PDF / Excel) */}
      {reportType && currentSessionUser && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl space-y-6 text-left relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setReportType(null)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {reportType === 'pdf' ? (
              <div className="space-y-5">
                {/* PDF Header mockup */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-center font-sans">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">MASHUD TELECOM REPORT</h2>
                    <span className="text-[10px] text-slate-500 font-mono">Date Generated: {new Date().toISOString().substring(0, 10)} | Secure Hash Code: 89AB-92FF</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-slate-900 text-white font-mono px-2 py-1 rounded">SSL SECURE DOCUMENT</span>
                  </div>
                </div>

                {/* User Profile Info */}
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account holder Details</span>
                    <p className="font-bold text-slate-900 text-sm">{currentSessionUser.fullName}</p>
                    <p className="text-slate-500">Email ID: {currentSessionUser.email}</p>
                    <p className="text-slate-500">Phone Code: {currentSessionUser.mobile}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Account Balance</span>
                    <p className="text-xl font-bold text-emerald-600">{currentSessionUser.balance.toFixed(2)} TK</p>
                    <p className="text-slate-500">Account status: Active Core Profile</p>
                  </div>
                </div>

                {/* Transactions list */}
                <div className="space-y-2 font-sans">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Recent Transactions Register</h4>
                  <table className="w-full divide-y divide-slate-300 text-left text-[11px] border border-slate-100 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50">
                      <tr className="text-slate-600 font-bold">
                        <th className="p-2">Reference ID</th>
                        <th className="p-2">Transaction Type</th>
                        <th className="p-2">Destination Mobile</th>
                        <th className="p-2">Amount (TK)</th>
                        <th className="p-2">Settlement State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {transactions.filter(t => t.userId === currentSessionUser.id).map((t, index) => (
                        <tr key={`${t.id}-${index}`}>
                          <td className="p-2 font-mono font-bold">{t.referenceNo}</td>
                          <td className="p-2 capitalize">{t.type.replace('_', ' ')}</td>
                          <td className="p-2 font-mono text-slate-500">{t.recipient || '-'}</td>
                          <td className="p-2 font-bold">{t.amount.toFixed(2)}</td>
                          <td className="p-2 uppercase font-bold text-[10px]">
                            {t.status}
                            {t.status === 'approved' && t.authPin && (
                              <span className="block text-[9px] text-slate-500 font-mono font-normal">PIN: {t.authPin}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button 
                    onClick={() => {
                      const userTxns = transactions.filter(t => t.userId === currentSessionUser.id);
                      const charges = commissionCharges[currentSessionUser.id] || [];
                      const success = handleDownloadPDFStatement(currentSessionUser, userTxns, currentSessionUser.commissionMultiplier ?? 7.5, charges);
                      if (success) {
                        setSimAlert({ type: 'success', message: 'Professional PDF Bank Statement downloaded successfully!' });
                        setReportType(null);
                      } else {
                        setSimAlert({ type: 'error', message: 'Failed to generate PDF statement.' });
                      }
                    }} 
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer flex items-center space-x-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download Professional Bank Statement PDF</span>
                  </button>
                  <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer">
                    Print / System Dialog
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-sans">
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Excel Ledger Database Grid</h2>
                    <p className="text-[10px] text-slate-500">Exported table cells compatible with Microsoft Excel and Google Sheets.</p>
                  </div>
                </div>

                {/* Excel table mockup */}
                <div className="border border-emerald-100 rounded-xl overflow-hidden bg-slate-50 max-h-[350px] overflow-auto">
                  <table className="w-full divide-y divide-emerald-200 text-left text-[11px] font-mono">
                    <thead className="bg-emerald-800 text-white sticky top-0">
                      <tr>
                        <th className="p-2 border-r border-emerald-700 font-semibold">CELL_A: TxnID</th>
                        <th className="p-2 border-r border-emerald-700 font-semibold">CELL_B: Action_Type</th>
                        <th className="p-2 border-r border-emerald-700 font-semibold">CELL_C: Recipient</th>
                        <th className="p-2 border-r border-emerald-700 font-semibold">CELL_D: Amount_TK</th>
                        <th className="p-2 border-r border-emerald-700 font-semibold">CELL_E: Status</th>
                        <th className="p-2 font-semibold">CELL_F: Created_At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 text-slate-800 bg-white">
                      {transactions.filter(t => t.userId === currentSessionUser.id).map((t, index) => (
                        <tr key={`${t.id}-${index}`} className="hover:bg-emerald-50/40">
                          <td className="p-2 border-r border-emerald-50">{t.referenceNo}</td>
                          <td className="p-2 border-r border-emerald-50 uppercase">{t.type}</td>
                          <td className="p-2 border-r border-emerald-50">{t.recipient || 'NULL'}</td>
                          <td className="p-2 border-r border-emerald-50 text-right font-bold">{t.amount.toFixed(2)}</td>
                          <td className="p-2 border-r border-emerald-50 uppercase font-bold">
                            {t.status}
                            {t.status === 'approved' && t.authPin && (
                              <span className="block text-[8px] text-slate-500 font-mono font-normal">PIN: {t.authPin}</span>
                            )}
                          </td>
                          <td className="p-2 text-slate-500">{t.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[10px] text-slate-400">Total Rows exported: {transactions.filter(t => t.userId === currentSessionUser.id).length} columns loaded.</span>
                  <button 
                    onClick={() => {
                      const headers = ['TxnID', 'Action', 'Recipient', 'Amount', 'Status', 'AuthPIN', 'Timestamp'];
                      const csvRows = [headers.join(',')];
                      transactions.filter(t => t.userId === currentSessionUser.id).forEach(t => {
                        csvRows.push([t.referenceNo, t.type, t.recipient || 'N/A', t.amount, t.status, t.authPin || 'N/A', t.createdAt].join(','));
                      });
                      const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `mashud_telecom_ledger_${currentSessionUser.fullName.replace(/\s+/g, '_')}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      setSimAlert({ type: 'success', message: 'CSV downloaded successfully!' });
                      setReportType(null);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center space-x-1.5 transition shadow cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Simulated CSV</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* USER DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-left space-y-4">
            <div className="flex items-center space-x-3 text-red-600 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-red-100 rounded-xl">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Client Profile</h3>
                <p className="text-[11px] text-slate-500">WordPress Theme Admin Panel Control</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete client profile <strong className="text-slate-900 font-bold">{userToDelete.fullName}</strong>?
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Mobile:</span>
                <span className="font-bold text-slate-800">{userToDelete.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Email:</span>
                <span className="font-bold text-slate-800">{userToDelete.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Balance:</span>
                <span className="font-bold text-emerald-600">৳ {userToDelete.balance.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-800 font-medium">
              ⚠️ Warning: Deleting this user will remove their account, balance, and records from the system database.
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUserConfirm}
                className="py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer text-center flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Delete User</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN CREATE USER / ADMIN ACCOUNT MODAL */}
      {showAdminCreateAccountModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-left space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Create New Account (User or Admin)</h3>
                  <p className="text-[10px] text-slate-500">Administrator Direct Setup Panel</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAdminCreateAccountModal(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdminCreateAccount} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Account Role Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAccountRole('user')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      newAccountRole === 'user' ? 'bg-sky-50 border-sky-500 text-sky-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" /> Client User
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAccountRole('admin')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      newAccountRole === 'admin' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" /> Administrator
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAccountFullName}
                  onChange={(e) => setNewAccountFullName(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500 font-medium"
                  placeholder="e.g. Rahul Mashud"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAccountEmail}
                  onChange={(e) => setNewAccountEmail(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500 font-medium"
                  placeholder="e.g. client@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={newAccountMobile}
                  onChange={(e) => setNewAccountMobile(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500 font-medium font-mono"
                  placeholder="e.g. +8801700000000"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Account Password</label>
                <input
                  type="password"
                  required
                  value={newAccountPassword}
                  onChange={(e) => setNewAccountPassword(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-emerald-500 font-medium"
                  placeholder="••••••••"
                />
              </div>

              {newAccountRole === 'admin' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">6-Digit Admin Confirmation PIN</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAccountPin}
                    onChange={(e) => setNewAccountPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 font-mono text-center tracking-widest focus:outline-none focus:border-emerald-500 font-bold"
                    placeholder="123456"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminCreateAccountModal(false)}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
