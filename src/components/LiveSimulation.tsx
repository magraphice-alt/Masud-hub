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
  ThemeStats,
  SimulatedInquiry,
  SimulatedInquiryMessage
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
  XCircle,
  Info, 
  Menu,
  PlusCircle,
  BellRing,
  Coins,
  Trash2,
  UserX,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  HelpCircle,
  Paperclip,
  MessageSquare,
  Image as ImageIcon,
  FileUp,
  MessageCircle,
  SendHorizontal,
  Eye,
  Check,
  Printer,
  Share2,
  Copy,
  ExternalLink,
  RotateCcw,
  Zap
} from 'lucide-react';

// --- Bangladeshi Timezone Date Utilities (Asia/Dhaka) ---
export const getTodayBDDate = (): string => {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date()); // Returns "YYYY-MM-DD"
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

export const getFormattedTodayBDDate = (): string => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date()); // Returns e.g. "25 Jul 2026"
  } catch {
    return new Date().toLocaleDateString();
  }
};

export const getBDDateFromStr = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    let clean = dateStr;
    if (clean.includes(' ') && !clean.includes('T')) {
      clean = clean.replace(' ', 'T') + 'Z';
    }
    const d = new Date(clean);
    if (isNaN(d.getTime())) {
      return dateStr.slice(0, 10);
    }
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(d);
  } catch {
    return dateStr.slice(0, 10);
  }
};

export const isTransactionTodayBD = (createdAtStr?: string): boolean => {
  if (!createdAtStr) return false;
  const today = getTodayBDDate();
  const txDate = getBDDateFromStr(createdAtStr);
  return today === txDate;
};

const INITIAL_USERS: SimulatedUser[] = [
  {
    id: 'usr-1',
    fullName: 'Masud Alam',
    email: 'masud@gmail.com',
    mobile: '+8801712345678',
    password: 'demo123',
    balance: 4250.00,
    role: 'user',
    status: 'active',
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
  },
  {
    id: 'txn-today-1',
    userId: 'usr-1',
    userEmail: 'masud@gmail.com',
    userMobile: '+8801712345678',
    type: 'send_money',
    amount: 1200.00,
    recipient: '+8801811223344',
    status: 'approved',
    referenceNo: 'SEND-BD-9012',
    way: 'bkash',
    createdAt: `${getTodayBDDate()} 10:15:00`
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

const INITIAL_INQUIRIES: SimulatedInquiry[] = [
  {
    id: 'inq-101',
    userId: 'usr-1',
    userEmail: 'masud@gmail.com',
    userMobile: '+8801712345678',
    userName: 'Masud Alam',
    subject: 'Deposit Verification & Receipt Confirmation',
    category: 'Deposit Query',
    status: 'in_progress',
    createdAt: '2026-07-26 09:15:00',
    updatedAt: '2026-07-26 09:45:00',
    messages: [
      {
        id: 'msg-101-1',
        senderRole: 'user',
        senderName: 'Masud Alam',
        message: 'Assalamu Alaikum Admin, I completed a bKash deposit of 5100 TK. I am attaching the digital transaction receipt snippet for verification.',
        attachmentName: 'bKash_Deposit_Receipt_5100TK.png',
        attachmentDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="360" height="180" viewBox="0 0 360 180"><rect width="100%" height="100%" fill="%23f0fdf4" stroke="%2316a34a" stroke-width="4"/><text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" fill="%2315803d" font-size="18">bKash Settlement Receipt</text><text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-weight="bold" fill="%23166534" font-size="14">TxnID: SEND-8922372 | ৳ 5,100.00</text></svg>',
        createdAt: '2026-07-26 09:15:00'
      },
      {
        id: 'msg-101-2',
        senderRole: 'admin',
        senderName: 'Mashud Telecom Admin',
        message: 'Thank you for attaching the payment receipt! Your deposit of 5,100.00 TK has been verified and credited to your wallet balance.',
        createdAt: '2026-07-26 09:45:00'
      }
    ]
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
        let updated = [...parsed];

        // Ensure default initial users are always present in state
        INITIAL_USERS.forEach(initUser => {
          const exists = updated.some(u => u.id === initUser.id || u.email.toLowerCase() === initUser.email.toLowerCase());
          if (!exists) {
            updated.push(initUser);
            modified = true;
          }
        });

        updated = updated.map(u => {
          let item = u;
          if (!item.password) {
            modified = true;
            item = { ...item, password: 'demo123' };
          }
          if (item.id === 'usr-1') {
            if (item.status === 'denied' || item.status === 'blocked') {
              modified = true;
              item = { ...item, status: 'active' };
            }
          }
          return item;
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

  // User Dashboard Filtering & Ledger Table States
  const [userLedgerLimit, setUserLedgerLimit] = useState<number>(15);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(true);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterType, setFilterType] = useState('none'); // 'none' | 'all' | 'deposit' | 'send' | 'commission'
  const [filterCustMobile, setFilterCustMobile] = useState('');

  const [appliedFilterStartDate, setAppliedFilterStartDate] = useState('');
  const [appliedFilterEndDate, setAppliedFilterEndDate] = useState('');
  const [appliedFilterType, setAppliedFilterType] = useState('none');
  const [appliedFilterCustMobile, setAppliedFilterCustMobile] = useState('');

  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<SimulatedTransaction | null>(null);
  const [isReceiptCopied, setIsReceiptCopied] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  // User Header Profile & Notification Dropdown States
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [profileNameInput, setProfileNameInput] = useState('');
  const [profileMobileInput, setProfileMobileInput] = useState('');

  const handleOpenProfileModal = () => {
    if (currentSessionUser) {
      setProfileNameInput(currentSessionUser.fullName);
      setProfileMobileInput(currentSessionUser.mobile);
    }
    setIsProfileModalOpen(true);
  };

  const handleSaveProfileDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSessionUser) return;
    if (!profileNameInput.trim()) {
      setSimAlert({ type: 'error', message: 'Name cannot be empty.' });
      return;
    }

    const updatedUser = {
      ...currentSessionUser,
      fullName: profileNameInput.trim(),
      mobile: profileMobileInput.trim()
    };

    setCurrentSessionUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentSessionUser.id ? updatedUser : u));
    setSimAlert({ type: 'success', message: 'Profile details updated successfully!' });
    setIsProfileModalOpen(false);
  };

  const handleMarkNotificationAsRead = (notifId: string) => {
    const updated = notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n);
    setNotifications(updated);
    localStorage.setItem('mashud_sim_notifs', JSON.stringify(updated));
  };

  const handleMarkAllNotificationsAsRead = () => {
    if (!currentSessionUser) return;
    const updated = notifications.map(n => 
      (n.userId === currentSessionUser.id || n.userId === 'all') ? { ...n, isRead: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('mashud_sim_notifs', JSON.stringify(updated));
    setSimAlert({ type: 'info', message: 'All notifications marked as read!' });
  };

  const handleClearUserNotifications = () => {
    if (!currentSessionUser) return;
    const updated = notifications.filter(n => n.userId !== currentSessionUser.id && n.userId !== 'all');
    setNotifications(updated);
    localStorage.setItem('mashud_sim_notifs', JSON.stringify(updated));
    setSimAlert({ type: 'info', message: 'Notifications cleared.' });
  };

  const handleNotificationClick = (notif: SimulatedNotification) => {
    handleMarkNotificationAsRead(notif.id);
    const refMatch = notif.message.match(/(SEND-[\w-]+|TRK[\w-]+|NAG[\w-]+|BKASH-[\w-]+)/i) || notif.title.match(/(SEND-[\w-]+|TRK[\w-]+|NAG[\w-]+|BKASH-[\w-]+)/i);
    if (refMatch) {
      const foundTxn = transactions.find(t => t.referenceNo === refMatch[0] || t.id === refMatch[0]);
      if (foundTxn) {
        setSelectedReceiptTxn(foundTxn);
      }
    }
    setIsNotificationDropdownOpen(false);
  };

  const handleChangeUserPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSessionUser) return;
    if (!newPasswordInput || newPasswordInput.length < 4) {
      setSimAlert({ type: 'error', message: 'Password must be at least 4 characters long.' });
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      setSimAlert({ type: 'error', message: 'New password and confirm password do not match.' });
      return;
    }

    setUsers(prev => prev.map(u => u.id === currentSessionUser.id ? { ...u, password: newPasswordInput } : u));
    setSimAlert({ type: 'success', message: 'Account security password updated successfully!' });
    setNewPasswordInput('');
    setConfirmNewPasswordInput('');
    setIsChangePasswordModalOpen(false);
  };

  const getReceiptShareText = (t: SimulatedTransaction, user: SimulatedUser | null) => {
    const statusText = t.status === 'approved' ? 'Taka already send' : t.status.toUpperCase();
    const sendAmtText = t.status === 'rejected' ? '0000 (0.00 TK)' : `TK ${t.amount.toFixed(2)}`;
    const pinText = t.status === 'rejected' ? '' : (t.authPin || '123456');
    let text = `*MASHUD TELECOM OFFICIAL PAYMENT RECEIPT*
--------------------------------
📄 *Ref ID:* ${t.referenceNo}
✅ *Status:* ${statusText}
📅 *Date & Time:* ${t.createdAt}
📞 *Recipient Mobile:* ${t.recipient || t.userMobile || 'N/A'}
💸 *Send Money Amount:* ${sendAmtText}
📲 *Way:* ${(t.way || 'BKASH').toUpperCase()}
🔐 *Security PIN:* ${pinText}\n`;

    if (t.rejectionComment) {
      text += `💬 *Rejection Comment:* ${t.rejectionComment}\n`;
    }

    text += `--------------------------------\nThank You`;
    return text;
  };

  const copyTextToClipboard = (text: string): boolean => {
    let success = false;
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
        success = true;
      }
    } catch (e) {
      console.warn("Clipboard API write failed, trying execCommand fallback", e);
    }

    if (!success) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textArea);
      } catch (err) {
        console.error("Fallback execCommand copy failed", err);
        success = false;
      }
    }
    return success;
  };

  const handleCopyReceiptText = (t: SimulatedTransaction, user: SimulatedUser | null, showNotification: boolean = true) => {
    const rawText = getReceiptShareText(t, user);
    copyTextToClipboard(rawText);
    setIsReceiptCopied(true);
    setTimeout(() => setIsReceiptCopied(false), 3000);

    if (showNotification) {
      setSimAlert({ type: 'success', message: '✓ Receipt summary copied to clipboard!' });
    }
  };

  const handleShareWhatsApp = (t: SimulatedTransaction, user: SimulatedUser | null) => {
    const rawText = getReceiptShareText(t, user);
    const encodedText = encodeURIComponent(rawText);
    
    // Auto-copy text as backup
    handleCopyReceiptText(t, user, false);

    // Try wa.me URL via anchor tag
    const waUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSimAlert({ type: 'success', message: 'WhatsApp opened & receipt text copied to clipboard!' });
  };

  const handleShareEmail = (t: SimulatedTransaction, user: SimulatedUser | null) => {
    // 1. Automatically generate and download receipt PDF so user can attach it directly
    handleDownloadSingleReceiptPDF(t, user);

    // 2. Format email body & subject
    const rawText = getReceiptShareText(t, user);
    const subject = encodeURIComponent(`Payment Receipt Voucher - ${t.referenceNo}`);
    const emailBody = `${rawText}\n\n📎 [PDF Receipt Voucher "Receipt_${t.referenceNo}.pdf" downloaded automatically to attach to email]`;
    const body = encodeURIComponent(emailBody);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;

    // Auto-copy text as backup
    handleCopyReceiptText(t, user, false);

    const link = document.createElement('a');
    link.href = mailtoUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSimAlert({ type: 'success', message: `Email composer opened & Receipt_${t.referenceNo}.pdf downloaded to attach!` });
  };

  const handleNumberCorrectionAndResend = (t: SimulatedTransaction) => {
    setSelectedReceiptTxn(null);
    setActivePage('user-dashboard');
    setSendAmount(t.amount.toString());
    setSendRecipient(t.recipient || t.userMobile || '');
    if (t.way) {
      setSendWay(t.way);
    }

    setTimeout(() => {
      const formEl = document.getElementById('send-money-form');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      const inputEl = document.getElementById('send-recipient-input') as HTMLInputElement | null;
      if (inputEl) {
        inputEl.focus();
        inputEl.select();
      }
    }, 120);

    setSimAlert({
      type: 'info',
      message: `Send Money form pre-filled with previous amount (৳ ${t.amount.toFixed(2)}). Correct the recipient mobile number and tap "Initiate Transfer Request".`
    });
  };

  const handlePrintReceipt = (t: SimulatedTransaction) => {
    const printElement = document.getElementById('printable-receipt-card');
    if (!printElement) {
      window.print();
      return;
    }
    const printWindow = window.open('', '_blank', 'width=650,height=850');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt Voucher - ${t.referenceNo}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; background: #fff; padding: 20px; }
            @page { size: auto; margin: 10mm; }
          </style>
        </head>
        <body onload="setTimeout(() => { window.print(); window.close(); }, 300)">
          <div style="max-width: 420px; margin: 0 auto;">
            ${printElement.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadSingleReceiptPDF = (t: SimulatedTransaction, user: SimulatedUser | null) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150]
      });

      const statusText = t.status === 'approved' ? 'Taka already send' : t.status.toUpperCase();

      // Outer Border
      doc.setDrawColor(37, 99, 235);
      doc.setLineWidth(1);
      doc.rect(3, 3, 94, 144);

      // Header
      doc.setFillColor(240, 249, 255);
      doc.rect(4, 4, 92, 18, 'F');
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(29, 78, 216);
      doc.text("MASHUD TELECOM", 50, 11, { align: "center" });
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text("ELECTRONIC PAYMENT RECEIPT VOUCHER", 50, 17, { align: "center" });

      // Status Banner
      doc.setFillColor(220, 252, 231);
      doc.rect(4, 23, 92, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(22, 101, 52);
      doc.text(`STATUS: ${statusText.toUpperCase()}`, 50, 28.5, { align: "center" });

      // Details Grid
      let y = 39;
      const addRow = (label: string, value: string, isBold: boolean = false) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(label, 8, y);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(15, 23, 42);
        doc.text(value, 92, y, { align: "right" });
        y += 6;
      };

      addRow("Receipt Ref:", t.referenceNo, true);
      addRow("Date & Time:", t.createdAt || getFormattedTodayBDDate());
      addRow("Recipient Mobile:", t.recipient || t.userMobile || 'N/A', true);
      addRow("Transaction Type:", (t.type || 'send_money').replace('_', ' ').toUpperCase());
      addRow("Payment Way:", (t.way || 'BKASH').toUpperCase(), true);

      // Divider Line
      doc.setDrawColor(226, 232, 240);
      doc.line(8, y, 92, y);
      y += 6;

      // Amount & PIN
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(185, 28, 28);
      doc.text("Send Money Amount:", 8, y);
      const pdfAmtText = t.status === 'rejected' ? '0000 (0.00 TK)' : `TK ${t.amount.toFixed(2)}`;
      doc.text(pdfAmtText, 92, y, { align: "right" });
      y += 7;

      doc.setFillColor(236, 253, 245);
      doc.rect(8, y - 4, 84, 9, 'F');
      doc.setFontSize(9);
      doc.setTextColor(4, 120, 87);
      doc.text("Security Auth PIN:", 12, y + 2);
      doc.setFont("courier", "bold");
      doc.setFontSize(11);
      const pdfPinText = t.status === 'rejected' ? '' : (t.authPin || '123456');
      doc.text(pdfPinText, 88, y + 2, { align: "right" });
      y += 12;

      if (t.rejectionComment) {
        doc.setFillColor(254, 242, 242);
        doc.rect(8, y - 4, 84, 14, 'F');
        doc.setFontSize(8);
        doc.setTextColor(185, 28, 28);
        doc.setFont("helvetica", "bold");
        doc.text("Rejection Comment:", 12, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(30, 41, 59);
        const splitComment = doc.splitTextToSize(t.rejectionComment, 76);
        doc.text(splitComment, 12, y + 4.5);
        y += 16;
      }

      // Footer Security Notice
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text("Thank You", 50, y, { align: "center" });

      doc.save(`Receipt_${t.referenceNo}.pdf`);
      setSimAlert({ type: 'success', message: `Receipt_${t.referenceNo}.pdf downloaded!` });
    } catch (err) {
      console.error("PDF generation error", err);
      setSimAlert({ type: 'error', message: 'Failed to download receipt PDF.' });
    }
  };

  const handleApplySearchFilter = () => {
    setAppliedFilterStartDate(filterStartDate);
    setAppliedFilterEndDate(filterEndDate);
    setAppliedFilterType(filterType);
    setAppliedFilterCustMobile(filterCustMobile);
  };

  const handleResetSearchFilter = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterType('none');
    setFilterCustMobile('');
    setAppliedFilterStartDate('');
    setAppliedFilterEndDate('');
    setAppliedFilterType('none');
    setAppliedFilterCustMobile('');
    setSimAlert({ type: 'info', message: 'Filters reset to default (None).' });
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
  const [adminModalTxnSearch, setAdminModalTxnSearch] = useState('');

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

  // --- Inquiry & Ticket System States ---
  const [inquiries, setInquiries] = useState<SimulatedInquiry[]>(() => {
    const saved = localStorage.getItem('mashud_sim_inquiries');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_INQUIRIES; }
    }
    return INITIAL_INQUIRIES;
  });

  useEffect(() => {
    localStorage.setItem('mashud_sim_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // New Ticket Form State
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState<'Transaction Issue' | 'Deposit Query' | 'Send Money Problem' | 'Account / Security' | 'General Inquiry'>('Transaction Issue');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryFile, setInquiryFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [isCreatingInquiry, setIsCreatingInquiry] = useState(false);

  // Reply State
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replyFile, setReplyFile] = useState<{ name: string; dataUrl: string } | null>(null);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');

  // File upload reader helper
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFileState: (val: { name: string; dataUrl: string } | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setSimAlert({ type: 'error', message: 'Attachment file size exceeds 5MB limit.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFileState({
          name: file.name,
          dataUrl: event.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Quick sample payment receipt generator for testing
  const handleAttachSampleReceipt = (setFileState: (val: { name: string; dataUrl: string } | null) => void) => {
    const sampleSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="340" height="170" viewBox="0 0 340 170"><rect width="100%" height="100%" fill="%23eff6ff" stroke="%232563eb" stroke-width="4"/><text x="50%" y="35%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="900" fill="%231d4ed8" font-size="16">Payment Receipt Screenshot</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-weight="bold" fill="%231e40af" font-size="12">Ref: REF-${Math.floor(100000 + Math.random() * 900000)} | Date: ${getFormattedTodayBDDate()}</text></svg>`;
    setFileState({
      name: `Payment_Slip_${Date.now().toString().slice(-4)}.png`,
      dataUrl: sampleSvg
    });
    setSimAlert({ type: 'info', message: 'Sample payment receipt attached successfully!' });
  };

  // Submit new inquiry (User or Admin)
  const handleCreateInquirySubmit = (e: React.FormEvent, targetUser?: SimulatedUser) => {
    e.preventDefault();
    const activeUser = targetUser || currentSessionUser;
    if (!activeUser) return;

    if (!inquirySubject.trim() || !inquiryMessage.trim()) {
      setSimAlert({ type: 'error', message: 'Subject and Message cannot be empty.' });
      return;
    }

    const newInquiryId = `inq-${Date.now().toString().slice(-6)}`;
    const timestamp = `${getTodayBDDate()} ${new Date().toTimeString().slice(0, 8)}`;

    const newInquiry: SimulatedInquiry = {
      id: newInquiryId,
      userId: activeUser.id,
      userEmail: activeUser.email,
      userMobile: activeUser.mobile,
      userName: activeUser.fullName,
      subject: inquirySubject.trim(),
      category: inquiryCategory,
      status: 'open',
      createdAt: timestamp,
      updatedAt: timestamp,
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          senderRole: currentSessionUser?.role === 'admin' ? 'admin' : 'user',
          senderName: currentSessionUser?.role === 'admin' ? 'Mashud Telecom Admin' : activeUser.fullName,
          message: inquiryMessage.trim(),
          attachmentName: inquiryFile?.name,
          attachmentDataUrl: inquiryFile?.dataUrl,
          createdAt: timestamp
        }
      ]
    };

    setInquiries(prev => [newInquiry, ...prev]);
    setInquirySubject('');
    setInquiryMessage('');
    setInquiryFile(null);
    setIsCreatingInquiry(false);
    setSelectedInquiryId(newInquiryId);

    if (currentSessionUser?.role === 'user') {
      logSimActivity(activeUser.id, activeUser.email, `Submitted inquiry ticket #${newInquiryId}: ${inquirySubject}`);
      setSimAlert({ type: 'success', message: `Inquiry #${newInquiryId} submitted successfully with attached file!` });
    } else {
      const notifId = `notif-${Date.now()}`;
      setNotifications(prev => [
        {
          id: notifId,
          userId: activeUser.id,
          title: 'New Support Ticket Created by Admin',
          message: `Admin opened support ticket #${newInquiryId}: ${inquirySubject}`,
          isRead: false,
          createdAt: timestamp
        },
        ...prev
      ]);
      setSimAlert({ type: 'success', message: `Inquiry ticket created for ${activeUser.fullName}!` });
    }
  };

  // Reply to an Inquiry
  const handleReplyInquirySubmit = (e: React.FormEvent, inquiryId: string) => {
    e.preventDefault();
    if (!replyMessage.trim() && !replyFile) {
      setSimAlert({ type: 'error', message: 'Please enter a message or attach a file.' });
      return;
    }

    const timestamp = `${getTodayBDDate()} ${new Date().toTimeString().slice(0, 8)}`;
    const isSenderAdmin = currentSessionUser?.role === 'admin';

    const newMessage: SimulatedInquiryMessage = {
      id: `msg-${Date.now()}`,
      senderRole: isSenderAdmin ? 'admin' : 'user',
      senderName: isSenderAdmin ? 'Mashud Telecom Admin' : (currentSessionUser?.fullName || 'Client'),
      message: replyMessage.trim() || 'Attached document file.',
      attachmentName: replyFile?.name,
      attachmentDataUrl: replyFile?.dataUrl,
      createdAt: timestamp
    };

    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: isSenderAdmin && inq.status === 'open' ? 'in_progress' : inq.status,
          updatedAt: timestamp,
          messages: [...inq.messages, newMessage]
        };
      }
      return inq;
    }));

    setReplyMessage('');
    setReplyFile(null);

    const targetInq = inquiries.find(i => i.id === inquiryId);
    if (targetInq) {
      const recipientUserId = isSenderAdmin ? targetInq.userId : 'adm-1';
      if (isSenderAdmin) {
        setNotifications(prev => [
          {
            id: `notif-${Date.now()}`,
            userId: recipientUserId,
            title: 'Admin Replied to Support Ticket',
            message: `New message on ticket #${inquiryId}: "${replyMessage.slice(0, 40)}..."`,
            isRead: false,
            createdAt: timestamp
          },
          ...prev
        ]);
      }
    }
    setSimAlert({ type: 'success', message: 'Reply and file attachment posted to ticket successfully!' });
  };

  // Update Ticket Status
  const handleUpdateInquiryStatus = (inquiryId: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    const timestamp = `${getTodayBDDate()} ${new Date().toTimeString().slice(0, 8)}`;
    setInquiries(prev => prev.map(inq => {
      if (inq.id === inquiryId) {
        return { ...inq, status: newStatus, updatedAt: timestamp };
      }
      return inq;
    }));
    setSimAlert({ type: 'info', message: `Ticket #${inquiryId} status updated to ${newStatus.toUpperCase()}` });
  };

  // Security authorization modal
  const [pinChallengeAction, setPinChallengeAction] = useState<string | null>(null);
  const [pinChallengeTargetId, setPinChallengeTargetId] = useState<string | null>(null);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [rejectionCommentInput, setRejectionCommentInput] = useState('');
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

    const cleanInput = loginUsername.trim().toLowerCase();
    const cleanPass = loginPass.trim();
    const cleanDigits = cleanInput.replace(/\D/g, '');

    // Find user by email, mobile, or name (case-insensitive and trimmed)
    const user = users.find(u => {
      if (u.role !== 'user') return false;
      const uEmail = (u.email || '').trim().toLowerCase();
      const uMobile = (u.mobile || '').trim().toLowerCase();
      const uMobileDigits = uMobile.replace(/\D/g, '');
      const uName = (u.fullName || '').trim().toLowerCase();

      const matchEmail = uEmail === cleanInput;
      const matchMobile = uMobile === cleanInput || (cleanDigits.length >= 8 && uMobileDigits.endsWith(cleanDigits.slice(-10)));
      const matchName = uName === cleanInput;

      return matchEmail || matchMobile || matchName;
    });

    if (!user) {
      setSimAlert({ type: 'error', message: 'Access denied. Account not found. Please check credentials.' });
      return;
    }

    const userPass = (user.password || 'demo123').trim();
    const isPassCorrect = cleanPass === userPass || (user.id === 'usr-1' && cleanPass === 'demo123');

    if (!isPassCorrect) {
      setSimAlert({ type: 'error', message: 'Access denied. Please check password.' });
      return;
    }

    if (user.status === 'denied' || user.status === 'blocked') {
      setSimAlert({ type: 'error', message: `Access Denied: Account for ${user.fullName} (${user.email}) has been denied access by administrator.` });
      logSimActivity(user.id, user.email, 'Attempted login, but account access was denied (Access Denied / Suspended).');
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

    if (currentSessionUser.status === 'denied' || currentSessionUser.status === 'blocked') {
      setSimAlert({ type: 'error', message: 'Access Denied: Your account is suspended/denied by administrator.' });
      return;
    }

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

    if (currentSessionUser.status === 'denied' || currentSessionUser.status === 'blocked') {
      setSimAlert({ type: 'error', message: 'Access Denied: Your account is suspended/denied by administrator.' });
      return;
    }

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
        const comment = rejectionCommentInput.trim();
        // Decline transaction
        setTransactions(prev => prev.map(t => {
          if (t.id === targetId) {
            return { ...t, status: 'rejected' as const, rejectionComment: comment || undefined };
          }
          return t;
        }));

        const notifMsg = comment 
          ? `Your deposit request has been declined. Reason: ${comment}` 
          : 'Your deposit has been declined by the supervisor review portal.';
        triggerNotification(depositTxn.userId, 'Deposit Request Rejected', notifMsg);
        logSimActivity(currentSessionUser.id, currentSessionUser.email, `Declined deposit ID ${targetId}${comment ? ` with comment: "${comment}"` : ''}.`);
        setSimAlert({ type: 'info', message: 'Deposit request declined & user notified.' });
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
        const comment = rejectionCommentInput.trim();

        // Trigger notification outside state updater loop
        const senderUser = users.find(u => u.id === sendTxn.userId);
        if (senderUser) {
          if (sendTxn.isOverdraft) {
            const notifMsg = comment
              ? `Your low balance credit transfer of ${sendTxn.amount} TK to ${sendTxn.recipient} was declined by admin. Reason: ${comment}`
              : `Your low balance credit transfer of ${sendTxn.amount} TK to ${sendTxn.recipient} was declined by the administrator.`;
            triggerNotification(
              sendTxn.userId,
              'Credit Request Declined',
              notifMsg
            );
          } else {
            const notifMsg = comment
              ? `Transfer declined and ${sendTxn.amount} TK refunded to wallet. Reason: ${comment}`
              : `Transfer declined. Refund of ${sendTxn.amount} TK credited to wallet.`;
            triggerNotification(
              sendTxn.userId,
              'Transfer Rejected & Refunded',
              notifMsg
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
            return { ...t, status: 'rejected' as const, rejectionComment: comment || undefined };
          }
          return t;
        }));

        logSimActivity(currentSessionUser.id, currentSessionUser.email, `Rejected transfer ID ${targetId}.${sendTxn.isOverdraft ? '' : ' Funds refunded to sender.'}${comment ? ` Comment: "${comment}"` : ''}`);
        setSimAlert({ type: 'info', message: sendTxn.isOverdraft ? 'Credit transfer request declined.' : 'Transfer request declined & refunded. User notified with comment.' });
      }
    }

    // Dismiss Challenge
    setPinChallengeAction(null);
    setPinChallengeTargetId(null);
    setAdminPinInput('');
    setRejectionCommentInput('');
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

    // Calculate updated balance deterministically (allows overdraft / negative balance)
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

  const handleToggleUserStatus = (targetUser: SimulatedUser) => {
    if (!currentSessionUser || currentSessionUser.role !== 'admin') {
      setSimAlert({ type: 'error', message: 'Unauthorized action. Admin clearance required.' });
      return;
    }

    const isCurrentlyDenied = targetUser.status === 'denied' || targetUser.status === 'blocked';
    const newStatus: 'active' | 'denied' = isCurrentlyDenied ? 'active' : 'denied';

    setUsers(prev => prev.map(u => {
      if (u.id === targetUser.id) {
        return { ...u, status: newStatus };
      }
      return u;
    }));

    if (selectedUserToView && selectedUserToView.id === targetUser.id) {
      setSelectedUserToView(prev => prev ? { ...prev, status: newStatus } : null);
    }

    if (currentSessionUser && currentSessionUser.id === targetUser.id) {
      setCurrentSessionUser(prev => prev ? { ...prev, status: newStatus } : null);
    }

    logSimActivity(
      currentSessionUser.id,
      currentSessionUser.email,
      `${newStatus === 'denied' ? 'Denied access for' : 'Restored active access for'} user ${targetUser.fullName} (${targetUser.email}).`
    );

    triggerNotification(
      targetUser.id,
      newStatus === 'denied' ? 'Account Access Denied' : 'Account Access Restored',
      newStatus === 'denied'
        ? 'Your account access has been restricted by supervisor.'
        : 'Your account access has been reactivated by supervisor.'
    );

    setSimAlert({
      type: newStatus === 'denied' ? 'info' : 'success',
      message: `${targetUser.fullName}'s account status set to: ${newStatus === 'denied' ? 'Access Denied' : 'Active'}`
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

  // Helper to identify pure approved send_money transactions (excluding system commission charges)
  const isPureSendMoney = (t: SimulatedTransaction) => 
    t.type === 'send_money' && 
    t.recipient !== 'System Commission Charge' && 
    (!t.referenceNo || !t.referenceNo.startsWith('COM-'));

  const approvedSendMoney = userTxns.filter(t => isPureSendMoney(t) && t.status === 'approved');
  const approvedSendMoneySum = approvedSendMoney.reduce((sum, t) => sum + t.amount, 0);
  const approvedSendMoneyCount = approvedSendMoney.length;

  const pendingDeposits = userTxns.filter(t => t.type === 'deposit' && t.status === 'pending');
  const pendingDepositsSum = pendingDeposits.reduce((sum, t) => sum + t.amount, 0);
  const pendingDepositsCount = pendingDeposits.length;

  const pendingTransfers = userTxns.filter(t => isPureSendMoney(t) && t.status === 'pending');
  const pendingTransfersSum = pendingTransfers.reduce((sum, t) => sum + t.amount, 0);
  const pendingTransfersCount = pendingTransfers.length;

  const userCommissionMultiplier = currentSessionUser ? (currentSessionUser.commissionMultiplier ?? 7.5) : 7.5;
  const userCommissionCharges = currentSessionUser ? (commissionCharges[currentSessionUser.id] || []) : [];
  const userCommissionChargesSum = userCommissionCharges.reduce((sum, c) => sum + c.amount, 0);
  const userCommission = Math.max(0, ((approvedSendMoneySum / 1000) * userCommissionMultiplier) - userCommissionChargesSum);

  // Today's Send Money & Debit transactions for current session user (Asia/Dhaka)
  // Includes approved, pending, and rejected transactions as requested
  const todayUserSendAndDebitTxns = userTxns.filter(t => 
    (t.type === 'send_money' || t.recipient === 'System Commission Charge' || t.type === 'debit') &&
    isTransactionTodayBD(t.createdAt)
  );

  const todayUserSendAndDebitApprovedSum = todayUserSendAndDebitTxns
    .filter(t => t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayUserSendAndDebitPendingSum = todayUserSendAndDebitTxns
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  // Today's total count/sum ONLY counts admin approved transactions (rejected count as 0)
  const todayUserSendAndDebitTotalSum = todayUserSendAndDebitApprovedSum;

  // Calculations for Selected User to View in Admin Dashboard
  const selectedUserCharges = selectedUserToView ? (commissionCharges[selectedUserToView.id] || []) : [];
  const selectedUserChargesSum = selectedUserCharges.reduce((sum, c) => sum + c.amount, 0);
  const selectedUserApprovedSendMoney = selectedUserToView 
    ? transactions.filter(t => t.userId === selectedUserToView.id && isPureSendMoney(t) && t.status === 'approved')
    : [];
  const selectedUserSendMoneySum = selectedUserApprovedSendMoney.reduce((sum, t) => sum + t.amount, 0);
  const selectedUserMultiplier = selectedUserToView ? (selectedUserToView.commissionMultiplier ?? 7.5) : 7.5;
  const selectedUserRawCommission = (selectedUserSendMoneySum / 1000) * selectedUserMultiplier;
  const selectedUserFinalCommission = Math.max(0, selectedUserRawCommission - selectedUserChargesSum);

  // Search filter directory across all users
  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.mobile.includes(searchQuery) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderInquirySystem = (targetUser: SimulatedUser | null, isAdminView: boolean = false) => {
    const userInquiries = isAdminView
      ? inquiries
      : inquiries.filter(i => i.userId === (targetUser?.id || ''));

    const filteredInquiries = userInquiries.filter(i => {
      if (inquiryStatusFilter === 'all') return true;
      return i.status === inquiryStatusFilter;
    });

    const selectedInquiry = inquiries.find(i => 
      i.id === selectedInquiryId && (isAdminView || i.userId === (targetUser?.id || ''))
    );

    return (
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5 text-left my-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                Inquiry & Support Ticket System
                <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full border border-sky-200">
                  File Attachment Enabled
                </span>
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Submit support tickets, dispute transactions, upload receipt proof files, and receive administrator assistance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCreatingInquiry && (
              <button
                type="button"
                onClick={() => {
                  setIsCreatingInquiry(true);
                  setSelectedInquiryId(null);
                }}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isAdminView ? 'Open Ticket for User' : 'New Inquiry / Ticket'}</span>
              </button>
            )}
            {isCreatingInquiry && (
              <button
                type="button"
                onClick={() => setIsCreatingInquiry(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* New Ticket Form Panel */}
        {isCreatingInquiry && (
          <form onSubmit={(e) => handleCreateInquirySubmit(e, targetUser || currentSessionUser || undefined)} className="bg-slate-50 p-4 rounded-xl border border-sky-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                Create Support Ticket {targetUser ? `(${targetUser.fullName})` : currentSessionUser ? `(${currentSessionUser.fullName})` : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Subject / Reference</label>
                <input
                  type="text"
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  placeholder="e.g. Deposit #SEND-8922372 Receipt Verification"
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-sky-500 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Category</label>
                <select
                  value={inquiryCategory}
                  onChange={(e) => setInquiryCategory(e.target.value as any)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-slate-800"
                >
                  <option value="Transaction Issue">Transaction Issue</option>
                  <option value="Deposit Query">Deposit Query</option>
                  <option value="Send Money Problem">Send Money Problem</option>
                  <option value="Account / Security">Account / Security</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Detailed Inquiry Message</label>
              <textarea
                rows={3}
                value={inquiryMessage}
                onChange={(e) => setInquiryMessage(e.target.value)}
                placeholder="Type your message or inquiry details..."
                required
                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-sky-500 font-medium text-slate-800"
              />
            </div>

            {/* File Attachment Upload */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-slate-700 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5 text-sky-600" />
                  Attach File / Document / Screenshot
                </label>
                <button
                  type="button"
                  onClick={() => handleAttachSampleReceipt(setInquiryFile)}
                  className="text-[10px] font-bold text-sky-600 hover:text-sky-800 underline flex items-center gap-1 cursor-pointer"
                >
                  <ImageIcon className="w-3 h-3" />
                  Attach Sample Receipt
                </button>
              </div>

              <div className="flex items-center gap-3">
                <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer flex items-center space-x-1.5 transition">
                  <FileUp className="w-3.5 h-3.5 text-slate-600" />
                  <span>Choose Attachment File</span>
                  <input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, setInquiryFile)}
                  />
                </label>

                {inquiryFile ? (
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-sky-50 border border-sky-200 rounded-lg text-xs">
                    <Paperclip className="w-3 h-3 text-sky-600" />
                    <span className="font-mono text-[10px] text-sky-900 font-bold truncate max-w-[180px]">
                      {inquiryFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setInquiryFile(null)}
                      className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">No file selected (Max 5MB)</span>
                )}
              </div>

              {inquiryFile && inquiryFile.dataUrl && (
                <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg max-w-[280px]">
                  <p className="text-[9px] font-bold text-slate-500 mb-1 uppercase">File Preview:</p>
                  <img src={inquiryFile.dataUrl} alt="Attachment" className="max-h-24 w-auto rounded border border-slate-200 object-contain bg-white" />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCreatingInquiry(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        )}

        {/* Ticket Thread List & Message Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Left: Ticket Cards List */}
          <div className="md:col-span-5 border-r border-slate-100 pr-0 md:pr-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Submitted Tickets ({userInquiries.length})
              </span>
              <select
                value={inquiryStatusFilter}
                onChange={(e) => setInquiryStatusFilter(e.target.value as any)}
                className="text-[10px] p-1 border border-slate-200 rounded-md bg-slate-50 font-bold text-slate-700"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredInquiries.map((inq) => {
                const isSelected = inq.id === selectedInquiryId;
                const hasAttachment = inq.messages.some(m => !!m.attachmentName);

                return (
                  <div
                    key={inq.id}
                    onClick={() => {
                      setSelectedInquiryId(inq.id);
                      setIsCreatingInquiry(false);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50 border-sky-300 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="font-mono text-[10px] font-black text-sky-800 uppercase">
                        #{inq.id}
                      </span>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded-full border uppercase ${
                        inq.status === 'open' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        inq.status === 'in_progress' ? 'bg-sky-100 text-sky-800 border-sky-200' :
                        inq.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        'bg-slate-200 text-slate-700 border-slate-300'
                      }`}>
                        {inq.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate mb-1">{inq.subject}</h4>
                    
                    {isAdminView && (
                      <p className="text-[10px] font-bold text-sky-800 truncate mb-1 bg-sky-100/70 px-1.5 py-0.5 rounded border border-sky-200/60 w-max">
                        👤 {inq.userName} ({inq.userMobile})
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      <span className="bg-slate-200/60 px-1.5 py-0.2 rounded font-medium">{inq.category}</span>
                      <span className="font-mono">{inq.updatedAt.slice(5, 16)}</span>
                    </div>

                    {hasAttachment && (
                      <div className="mt-1.5 flex items-center gap-1 text-[9px] text-sky-700 font-bold">
                        <Paperclip className="w-3 h-3 text-sky-600" />
                        <span>Attached Document/File</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredInquiries.length === 0 && (
                <div className="p-6 text-center text-slate-400 space-y-1">
                  <HelpCircle className="w-6 h-6 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No tickets found.</p>
                  <p className="text-[10px]">Click "New Inquiry / Ticket" to submit a question with file attachment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Selected Ticket Messages & Reply Form */}
          <div className="md:col-span-7 space-y-3 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200/80">
            {selectedInquiry ? (
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-sky-700">#{selectedInquiry.id}</span>
                      <span className="text-xs font-bold text-slate-900">{selectedInquiry.subject}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      User: <strong className="text-slate-800">{selectedInquiry.userName}</strong> ({selectedInquiry.userMobile}) | Category: <strong>{selectedInquiry.category}</strong>
                    </p>
                  </div>

                  {isAdminView && (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500">Status:</span>
                      <select
                        value={selectedInquiry.status}
                        onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value as any)}
                        className="text-[10px] font-extrabold p-1 rounded border border-slate-300 bg-white text-slate-800"
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Messages stream */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {selectedInquiry.messages.map((msg) => {
                    const isAdminMsg = msg.senderRole === 'admin';
                    return (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl border max-w-[90%] text-xs space-y-1 ${
                          isAdminMsg
                            ? 'bg-indigo-50/90 border-indigo-200 ml-auto text-left'
                            : 'bg-white border-slate-200 mr-auto text-left'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100/60 pb-1">
                          <span className={`font-bold text-[10px] ${isAdminMsg ? 'text-indigo-800' : 'text-slate-800'}`}>
                            {msg.senderName} ({isAdminMsg ? 'Admin' : 'Client'})
                          </span>
                          <span className="text-[8px] text-slate-400 font-mono">{msg.createdAt}</span>
                        </div>

                        <p className="text-slate-800 leading-relaxed font-medium whitespace-pre-wrap">{msg.message}</p>

                        {/* File Attachment Chip */}
                        {msg.attachmentName && (
                          <div className="mt-2 p-2 bg-slate-100/80 rounded-lg border border-slate-200 flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center space-x-1.5 truncate">
                                <Paperclip className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                                <span className="text-[10px] font-bold text-slate-800 font-mono truncate">
                                  {msg.attachmentName}
                                </span>
                              </div>
                              {msg.attachmentDataUrl && (
                                <a
                                  href={msg.attachmentDataUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  download={msg.attachmentName}
                                  className="px-2 py-0.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-[9px] font-bold flex items-center gap-1 transition cursor-pointer"
                                >
                                  <Download className="w-2.5 h-2.5" />
                                  <span>Download</span>
                                </a>
                              )}
                            </div>

                            {msg.attachmentDataUrl && msg.attachmentDataUrl.startsWith('data:image') && (
                              <img
                                src={msg.attachmentDataUrl}
                                alt="Attachment preview"
                                className="max-h-28 w-auto rounded border border-slate-200 object-contain bg-white"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Reply Form */}
                {selectedInquiry.status !== 'closed' ? (
                  <form onSubmit={(e) => handleReplyInquirySubmit(e, selectedInquiry.id)} className="space-y-2 pt-2 border-t border-slate-200">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-600">
                      <span>Post Reply to Ticket #{selectedInquiry.id}:</span>
                      <button
                        type="button"
                        onClick={() => handleAttachSampleReceipt(setReplyFile)}
                        className="text-sky-600 hover:text-sky-800 underline flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3" />
                        Attach Receipt
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder={isAdminView ? "Type admin reply..." : "Type response..."}
                        className="flex-grow p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:border-sky-500 font-medium text-slate-800"
                      />

                      <label className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 cursor-pointer transition flex items-center justify-center" title="Attach file">
                        <Paperclip className="w-4 h-4 text-slate-600" />
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, setReplyFile)}
                        />
                      </label>

                      <button
                        type="submit"
                        className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                      >
                        <SendHorizontal className="w-3.5 h-3.5" />
                        <span>Send</span>
                      </button>
                    </div>

                    {replyFile && (
                      <div className="flex items-center gap-2 px-2.5 py-1 bg-sky-50 border border-sky-200 rounded-lg text-xs w-max">
                        <Paperclip className="w-3 h-3 text-sky-600" />
                        <span className="font-mono text-[10px] text-sky-900 font-bold max-w-[180px] truncate">
                          Attached: {replyFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setReplyFile(null)}
                          className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="p-2 bg-slate-200/60 rounded-lg text-center text-[10px] font-bold text-slate-600">
                    This ticket is closed. Change status to reopen.
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <MessageCircle className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Select a ticket from the left panel to inspect messages and reply with file attachments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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

      {/* Website Navigation Header */}
      <header className="bg-blue-900/95 backdrop-blur-md text-white shadow-md sticky top-0 z-10 border-b border-blue-800/35">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-3 flex justify-between items-center">
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center space-x-3 cursor-pointer group"
            title="Mashud Telecom Homepage"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-white shadow-sm group-hover:scale-105 transition">
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
                className="bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition duration-150 cursor-pointer shadow-sm"
              >
                Sign In
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
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold block text-slate-900">Masud Alam (User)</span>
                      <span className="text-[8px] px-1 py-0.2 bg-emerald-100 text-emerald-800 font-extrabold rounded uppercase">Active</span>
                    </div>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">Welcome, {currentSessionUser.fullName}</h1>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shadow-2xs">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified User
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-500 mt-1">
                  <span className="font-bold text-slate-700">ID:</span> #MT-{currentSessionUser.id.toUpperCase().split('-')[1] || '89042'}
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-slate-700">Mobile:</span> {currentSessionUser.mobile}
                  <span className="text-slate-300">|</span>
                  <span className="font-bold text-slate-700">Email:</span> {currentSessionUser.email}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* NOTIFICATION MENU DROPDOWN */}
                {(() => {
                  const userNotifs = notifications.filter(n => n.userId === currentSessionUser.id || n.userId === 'all');
                  const unreadCount = userNotifs.filter(n => !n.isRead).length;

                  return (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
                          setIsProfileDropdownOpen(false);
                        }}
                        className="relative p-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl shadow-xs transition flex items-center justify-center cursor-pointer active:scale-95"
                        title="Notifications Menu"
                      >
                        <BellRing className={`w-5 h-5 ${unreadCount > 0 ? 'text-blue-600 animate-bounce' : 'text-slate-600'}`} />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Dropdown Box */}
                      {isNotificationDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setIsNotificationDropdownOpen(false)} />
                          <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <BellRing className="w-4 h-4 text-sky-400" />
                                <span className="font-bold text-xs uppercase tracking-wider">Notifications Menu</span>
                                {unreadCount > 0 && (
                                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {unreadCount} New
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                {userNotifs.length > 0 && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={handleMarkAllNotificationsAsRead}
                                      className="text-[10px] font-semibold text-sky-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                                      title="Mark all as read"
                                    >
                                      Mark all read
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleClearUserNotifications}
                                      className="p-1 text-slate-400 hover:text-rose-300 rounded hover:bg-slate-800 transition cursor-pointer"
                                      title="Clear notifications"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                                <button
                                  type="button"
                                  onClick={() => setIsNotificationDropdownOpen(false)}
                                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                              {userNotifs.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 space-y-1">
                                  <BellRing className="w-8 h-8 text-slate-300 mx-auto opacity-50" />
                                  <p className="text-xs font-semibold">No notifications available</p>
                                  <p className="text-[10px] text-slate-400">Transaction updates and notices will appear here.</p>
                                </div>
                              ) : (
                                userNotifs.map(n => (
                                  <div
                                    key={n.id}
                                    onClick={() => handleNotificationClick(n)}
                                    className={`p-3 transition cursor-pointer flex items-start space-x-3 hover:bg-slate-50 ${
                                      !n.isRead ? 'bg-sky-50/70 border-l-4 border-l-sky-500' : 'bg-white'
                                    }`}
                                  >
                                    <div className={`p-2 rounded-xl flex-shrink-0 mt-0.5 ${
                                      n.title.toLowerCase().includes('approved') ? 'bg-emerald-100 text-emerald-700' :
                                      n.title.toLowerCase().includes('reject') || n.title.toLowerCase().includes('denied') ? 'bg-rose-100 text-rose-700' :
                                      'bg-blue-100 text-blue-700'
                                    }`}>
                                      {n.title.toLowerCase().includes('approved') ? <CheckCircle className="w-4 h-4" /> :
                                       n.title.toLowerCase().includes('reject') ? <XCircle className="w-4 h-4" /> :
                                       <Info className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-slate-900 truncate">{n.title}</h4>
                                        {!n.isRead && (
                                          <span className="w-2 h-2 rounded-full bg-sky-600 flex-shrink-0 ml-1" />
                                        )}
                                      </div>
                                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                                      <span className="text-[9px] text-slate-400 font-mono mt-1 block">{n.createdAt}</span>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })()}

                {/* USER PROFILE MENU DROPDOWN */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(!isProfileDropdownOpen);
                      setIsNotificationDropdownOpen(false);
                    }}
                    className="p-1.5 pl-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl shadow-xs transition flex items-center space-x-2.5 cursor-pointer active:scale-95"
                    title="User Profile Menu"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black flex items-center justify-center text-xs shadow-xs">
                      {currentSessionUser.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left hidden sm:block">
                      <span className="block text-xs font-bold text-slate-900 leading-none">{currentSessionUser.fullName}</span>
                      <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-wider leading-tight">Profile Menu</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsProfileDropdownOpen(false)} />
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-black text-lg flex items-center justify-center shadow-md border border-white/20">
                              {currentSessionUser.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-sm text-white truncate">{currentSessionUser.fullName}</h3>
                              <span className="inline-block text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.2 rounded-full border border-emerald-500/30">
                                ✓ Verified Active Profile
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] bg-white/10 p-2.5 rounded-xl backdrop-blur-xs">
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase">User ID</span>
                              <span className="font-mono font-bold text-sky-200">#MT-{currentSessionUser.id.toUpperCase().split('-')[1] || '89042'}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase">Wallet Balance</span>
                              <span className="font-mono font-bold text-emerald-300">৳ {currentSessionUser.balance.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Menu options */}
                        <div className="p-2 space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleOpenProfileModal();
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition flex items-center space-x-2.5 cursor-pointer"
                          >
                            <User className="w-4 h-4 text-blue-600" />
                            <span>View Profile Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setIsChangePasswordModalOpen(true);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition flex items-center space-x-2.5 cursor-pointer"
                          >
                            <Lock className="w-4 h-4 text-amber-600" />
                            <span>Change Security Password</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              handleDownloadPDFStatement(
                                currentSessionUser,
                                transactions.filter(t => t.userId === currentSessionUser.id),
                                userCommissionMultiplier
                              );
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition flex items-center space-x-2.5 cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span>Download e-Statement PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsProfileDropdownOpen(false);
                              setActivePage('user-inquiries');
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition flex items-center space-x-2.5 cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4 text-violet-600" />
                            <span>Support & Help Tickets</span>
                          </button>

                          <div className="pt-1 border-t border-slate-100 mt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsProfileDropdownOpen(false);
                                setCurrentSessionUser(null);
                                setActivePage('home');
                                setSimAlert({ type: 'info', message: 'Signed out successfully.' });
                              }}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition flex items-center space-x-2.5 cursor-pointer"
                            >
                              <LogOut className="w-4 h-4 text-rose-600" />
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Today Total Send & Debit High-Density Header Widget */}
                <div className="px-4 py-2 rounded-xl shadow-md flex items-center space-x-3 border bg-gradient-to-r from-rose-600 to-orange-600 border-rose-500/30 text-white">
                  <TrendingDown className="w-5 h-5 text-rose-200" />
                  <div>
                    <span className="block text-[8px] uppercase tracking-wider font-extrabold text-rose-200 leading-none">
                      Today total send and Debit
                    </span>
                    <span className="text-sm font-black tracking-tight leading-none">৳ {todayUserSendAndDebitTotalSum.toFixed(2)}</span>
                  </div>
                </div>

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
              </div>

              {/* Card 6: Today Total Send and Debit */}
              <div className="bg-gradient-to-br from-rose-50 to-orange-50 p-5 rounded-2xl border border-rose-200 flex flex-col justify-between shadow-sm min-h-[120px]">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-rose-700 text-[9px] uppercase tracking-wider font-extrabold block truncate">
                        Today total send and Debit
                      </span>
                      <span className="text-[8px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full border border-rose-200">
                        Asia/Dhaka
                      </span>
                    </div>
                    <div className="text-xl font-black text-rose-700 font-sans truncate">
                      ৳ {todayUserSendAndDebitTotalSum.toFixed(2)}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      Date: {getFormattedTodayBDDate()} | Approved: ৳{todayUserSendAndDebitApprovedSum.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-rose-100 text-rose-600 p-2.5 rounded-xl flex-shrink-0 ml-3">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Actions and notifications panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Request Forms */}
              <div className="lg:col-span-12 space-y-6">
                
                {/* Side-by-Side Forms Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Send Money Form */}
                  <div id="send-money-form" className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Send Money</h3>
                    </div>

                    <form onSubmit={handleSendMoneySubmit} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Recipient Mobile</label>
                          <input 
                            id="send-recipient-input"
                            type="tel" 
                            value={sendRecipient}
                            onChange={(e) => setSendRecipient(e.target.value)}
                            required 
                            className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" 
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
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Deposit Request</h3>
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
                </div>

                {/* Dedicated Table: Today total send and Debit */}
                <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm space-y-4 text-left">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-rose-100 text-rose-700 rounded-xl">
                        <TrendingDown className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Today total send and Debit</h3>
                        <p className="text-[10px] text-slate-500 font-medium">
                          Current Date (Asia/Dhaka): <strong className="text-slate-800 font-bold">{getFormattedTodayBDDate()}</strong>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-rose-50 border border-rose-200 rounded-xl text-[11px] font-extrabold text-rose-800">
                        Today Total: ৳ {todayUserSendAndDebitTotalSum.toFixed(2)}
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-extrabold text-emerald-800">
                        Approved: ৳ {todayUserSendAndDebitApprovedSum.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Table of Today's Send and Debit Transactions */}
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-slate-200 text-left text-xs">
                      <thead>
                        <tr className="text-slate-400 uppercase font-semibold text-[10px] bg-slate-50">
                          <th className="py-2.5 px-3">Reference ID</th>
                          <th className="py-2.5 px-3">Type</th>
                          <th className="py-2.5 px-3">Recipient / Mobile</th>
                          <th className="py-2.5 px-3">Way</th>
                          <th className="py-2.5 px-3 text-right">Debit Amount (TK)</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Receipt</th>
                          <th className="py-2.5 px-3">Date & Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {todayUserSendAndDebitTxns.map((t, idx) => {
                          const isCommissionCharge = t.recipient === 'System Commission Charge' || t.type === 'commission' || (t.referenceNo && t.referenceNo.startsWith('COM-'));
                          return (
                            <tr key={`today-debit-row-${t.id}-${idx}`} className="hover:bg-rose-50/40 transition-colors">
                              <td className="py-2.5 px-3 font-mono text-[10px] text-slate-800 font-bold">{t.referenceNo}</td>
                              <td className="py-2.5 px-3">
                                {isCommissionCharge ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                    Commission Fee
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                    Send Money
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-600">{t.recipient || t.userMobile || '-'}</td>
                              <td className="py-2.5 px-3 font-semibold text-indigo-600 uppercase">{t.way || 'bkash'}</td>
                              <td className="py-2.5 px-3 text-right font-black text-rose-700 font-mono text-sm">
                                {t.status === 'rejected' ? '- ৳ 0000 (0.00)' : `- ৳ ${t.amount.toFixed(2)}`}
                              </td>
                              <td className="py-2.5 px-3">
                                {t.status === 'approved' ? (
                                  <div className="flex flex-col items-start gap-1">
                                    <span className="inline-flex px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full border border-emerald-200">
                                      Approved
                                    </span>
                                    <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                      PIN: {t.authPin || '123456'}
                                    </span>
                                  </div>
                                ) : t.status === 'rejected' ? (
                                  <span className="inline-flex px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-bold rounded-full border border-red-200">
                                    Rejected
                                  </span>
                                ) : (
                                  <span className="inline-flex px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full border border-amber-200">Pending</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                <button
                                  type="button"
                                  onClick={() => setSelectedReceiptTxn(t)}
                                  className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1 rounded-full transition cursor-pointer shadow-2xs border ${
                                    t.status === 'approved'
                                      ? 'text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border-sky-200'
                                      : t.status === 'rejected'
                                      ? 'text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border-rose-200'
                                      : 'text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border-amber-200'
                                  }`}
                                  title="Tap to View, Share & Print Voucher Receipt"
                                >
                                  <FileText className="w-2.5 h-2.5 text-current" />
                                  <span>{t.status === 'rejected' ? 'Receipt / Comment 📄' : 'Receipt PDF 📄'}</span>
                                </button>
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 text-[10px] font-mono">{t.createdAt}</td>
                            </tr>
                          );
                        })}
                        {todayUserSendAndDebitTxns.length === 0 && (
                          <tr>
                            <td colSpan={8} className="text-center py-6 text-slate-400 text-xs">
                              <div className="space-y-1">
                                <p className="font-semibold text-slate-600">No Send Money or Debit transactions logged for today ({getFormattedTodayBDDate()}).</p>
                                <p className="text-[10px] text-slate-400">Any Send Money or debit transactions completed today on Bangladeshi date will appear here automatically.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {todayUserSendAndDebitTxns.length > 0 && (
                        <tfoot>
                          <tr className="bg-rose-50/60 font-bold text-slate-800 border-t border-rose-200 text-xs">
                            <td colSpan={4} className="py-2.5 px-3 uppercase text-[10px] text-slate-600">
                              Today Total Send & Debit ({todayUserSendAndDebitTxns.length} record{todayUserSendAndDebitTxns.length > 1 ? 's' : ''}):
                            </td>
                            <td className="py-2.5 px-3 text-right text-rose-800 font-mono text-sm font-black">
                              - ৳ {todayUserSendAndDebitTotalSum.toFixed(2)}
                            </td>
                            <td colSpan={3} className="py-2.5 px-3 text-[10px] text-slate-500 font-normal">
                              Approved: ৳{todayUserSendAndDebitApprovedSum.toFixed(2)} | Pending: ৳{todayUserSendAndDebitPendingSum.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
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
                      
                      if (appliedFilterType === 'none') return false;
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
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFilterStartDate(val);
                                  setAppliedFilterStartDate(val);
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-slate-700"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">To Date Range</label>
                              <input 
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFilterEndDate(val);
                                  setAppliedFilterEndDate(val);
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-slate-700"
                              />
                            </div>

                            {/* Dropdown list: Deposit / Send / Commission */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Type (Deposit / Send / Commission)</label>
                              <select 
                                value={filterType}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFilterType(val);
                                  setAppliedFilterType(val);
                                }}
                                className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none font-medium text-slate-700 font-bold text-slate-800"
                              >
                                <option value="none">None</option>
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
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFilterCustMobile(val);
                                  setAppliedFilterCustMobile(val);
                                }}
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
                                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium cursor-pointer transition shadow-sm"
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
                              <th className="py-2">Receipt</th>
                              <th className="py-2">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {filteredUserTransactions.slice(0, userLedgerLimit).map((t, index) => {
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
                                      <div className="flex flex-col items-start gap-0.5">
                                        <span className="inline-flex px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">Approved</span>
                                        <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-100 mt-0.5">
                                          PIN: {t.authPin || '123456'}
                                        </span>
                                      </div>
                                    ) : t.status === 'rejected' ? (
                                      <span className="inline-flex px-2 py-0.5 bg-red-100 text-red-800 text-[9px] font-bold rounded-full">Rejected</span>
                                    ) : (
                                      <span className="inline-flex px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-bold rounded-full">Pending</span>
                                    )}
                                  </td>
                                  <td className="py-2">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedReceiptTxn(t)}
                                      className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1 rounded-full transition cursor-pointer shadow-2xs border ${
                                        t.status === 'approved'
                                          ? 'text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border-sky-200'
                                          : t.status === 'rejected'
                                          ? 'text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border-rose-200'
                                          : 'text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border-amber-200'
                                      }`}
                                      title="Tap to View, Share & Print Voucher Receipt"
                                    >
                                      <FileText className="w-2.5 h-2.5 text-current" />
                                      <span>{t.status === 'rejected' ? 'Receipt / Comment 📄' : 'Receipt PDF 📄'}</span>
                                    </button>
                                  </td>
                                  <td className="py-2 text-slate-400 text-[10px] font-mono">{t.createdAt}</td>
                                </tr>
                              );
                            })}
                            {filteredUserTransactions.length === 0 && (
                              <tr>
                                <td colSpan={8} className="text-center py-6 text-slate-400 text-xs">
                                  {appliedFilterType === 'none'
                                    ? 'No transaction type selected (None). Select Deposit, Send, Commission, or All to display records.'
                                    : 'No matching records found for the specified filter criteria.'}
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Download PDF statement & Show More bottom bar when data is present */}
                      {filteredUserTransactions.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 mt-2">
                          <span className="text-[11px] font-semibold text-slate-500">
                            Showing <strong className="text-slate-800 font-bold">{Math.min(userLedgerLimit, filteredUserTransactions.length)}</strong> of <strong className="text-slate-800 font-bold">{filteredUserTransactions.length}</strong> matching transaction record{filteredUserTransactions.length > 1 ? 's' : ''}
                          </span>
                          <div className="flex items-center space-x-2">
                            {filteredUserTransactions.length > 15 && (
                              userLedgerLimit === 15 ? (
                                <button
                                  type="button"
                                  onClick={() => setUserLedgerLimit(50)}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-lg transition cursor-pointer"
                                >
                                  <span>Show More (50)</span>
                                  <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setUserLedgerLimit(15)}
                                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition cursor-pointer"
                                >
                                  <span>Show Less (15)</span>
                                  <ChevronUp className="w-3.5 h-3.5" />
                                </button>
                              )
                            )}
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
                      </div>
                    )}
                    </div>
                  );
                })()}

              </div>
            </div>

            {/* Transaction Ledger list */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Your Transaction Ledger</h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  Showing <strong className="text-slate-800 font-bold">{Math.min(userLedgerLimit, userTxns.length)}</strong> of <strong className="text-slate-800 font-bold">{userTxns.length}</strong> records
                </span>
              </div>
              
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
                      <th className="py-2.5">Receipt</th>
                      <th className="py-2.5">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {userTxns.slice(0, userLedgerLimit).map((t, index) => (
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
                        <td className="py-2.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReceiptTxn(t)}
                            className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1 rounded-full transition cursor-pointer shadow-2xs border ${
                              t.status === 'approved'
                                ? 'text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border-sky-200'
                                : t.status === 'rejected'
                                ? 'text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border-rose-200'
                                : 'text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border-amber-200'
                            }`}
                            title="Tap to View, Share & Print Voucher Receipt"
                          >
                            <FileText className="w-2.5 h-2.5 text-current" />
                            <span>{t.status === 'rejected' ? 'Receipt / Comment 📄' : 'Receipt PDF 📄'}</span>
                          </button>
                        </td>
                        <td className="py-2.5 text-slate-400 text-[10px] font-mono">{t.createdAt}</td>
                      </tr>
                    ))}
                    {userTxns.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-slate-400">No transactions recorded in local simulated database.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {userTxns.length > 15 && (
                <div className="pt-3 flex justify-center border-t border-slate-100">
                  {userLedgerLimit === 15 ? (
                    <button
                      type="button"
                      onClick={() => setUserLedgerLimit(50)}
                      className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition cursor-pointer flex items-center space-x-1.5 shadow-sm"
                    >
                      <span>Show More (Display 50 Data)</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setUserLedgerLimit(15)}
                      className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition cursor-pointer flex items-center space-x-1.5"
                    >
                      <span>Show Less (Display 15 Data)</span>
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Inquiry & Support System for User */}
            {renderInquirySystem(currentSessionUser, false)}
          </div>
        )}

        {/* PAGE: USER SUPPORT & HELP TICKETS */}
        {activePage === 'user-inquiries' && (
          <div className="p-6 bg-slate-50 space-y-6 flex-grow select-none">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActivePage('user-dashboard')}
                    className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-100 transition cursor-pointer"
                    title="Return to User Dashboard"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h1 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Support & Help Tickets</h1>
                </div>
                <p className="text-[11px] text-slate-500">
                  Submit new support inquiries, attach receipts or screenshot evidence, and message directly with site administrators.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('user-dashboard')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Client Portal</span>
              </button>
            </div>

            {currentSessionUser ? (
              renderInquirySystem(currentSessionUser, false)
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md mx-auto my-8">
                <HelpCircle className="w-10 h-10 text-sky-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Sign in to Access Support Tickets</h3>
                <p className="text-xs text-slate-500">Please sign in to your client account to view existing tickets or submit a new inquiry.</p>
                <button
                  type="button"
                  onClick={() => setActivePage('user-login')}
                  className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Sign In Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* PAGE: ADMIN SUPPORT & HELP TICKETS */}
        {activePage === 'admin-inquiries' && (
          <div className="p-6 bg-slate-50 space-y-6 flex-grow select-none">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActivePage('admin-dashboard')}
                    className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-2xs hover:bg-slate-100 transition cursor-pointer"
                    title="Return to Admin Dashboard"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <h1 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Admin Support & Help Tickets Operations</h1>
                </div>
                <p className="text-[11px] text-slate-500">
                  Manage, reply to, attach proof files, and update status for all client support inquiries across the platform.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActivePage('admin-dashboard')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Admin Panel</span>
              </button>
            </div>

            {currentSessionUser && currentSessionUser.role === 'admin' ? (
              renderInquirySystem(currentSessionUser, true)
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4 max-w-md mx-auto my-8">
                <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Admin Clearance Required</h3>
                <p className="text-xs text-slate-500">Please sign in as an Administrator to access the Support Ticket Operations Center.</p>
                <button
                  type="button"
                  onClick={() => setActivePage('admin-login')}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Admin Login
                </button>
              </div>
            )}
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
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePage('admin-inquiries')}
                  className="bg-sky-600 hover:bg-sky-700 text-white text-[10px] font-bold py-2.5 px-3.5 rounded-lg flex items-center space-x-1.5 transition shadow cursor-pointer relative"
                  title="Open User Support & Help Messages Box"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-sky-200" />
                  <span>Support & Help Message Box</span>
                  {inquiries.filter(i => i.status === 'open' || i.status === 'in_progress').length > 0 && (
                    <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-amber-300 ml-1">
                      {inquiries.filter(i => i.status === 'open' || i.status === 'in_progress').length}
                    </span>
                  )}
                </button>

                <button 
                  onClick={() => {
                    try {
                      let csvContent = "data:text/csv;charset=utf-8,";
                      csvContent += "User ID,Full Name,Email,Mobile,Role,Status,Balance (BDT),Commission Rate,Registered At\n";

                      users.forEach(u => {
                        const row = [
                          `"${u.id}"`,
                          `"${u.fullName}"`,
                          `"${u.email}"`,
                          `"${u.mobile}"`,
                          `"${u.role}"`,
                          `"${u.status || 'Active'}"`,
                          `"${u.balance.toFixed(2)}"`,
                          `"${u.commissionMultiplier ?? 7.5}"`,
                          `"${u.createdAt || ''}"`
                        ].join(",");
                        csvContent += row + "\n";
                      });

                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `client_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      setSimAlert({ type: 'success', message: 'Client Ledger CSV downloaded successfully!' });
                    } catch (err) {
                      console.error("Ledger download error:", err);
                      setSimAlert({ type: 'error', message: 'Failed to download Client Ledger CSV.' });
                    }
                  }}
                  className="bg-slate-950 hover:bg-slate-800 text-white text-[10px] font-bold py-2.5 px-3 rounded-lg flex items-center space-x-1 transition shadow cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Client Ledger</span>
                </button>
              </div>
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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

              {/* Stat 5: Support Tickets */}
              <div 
                onClick={() => setActivePage('admin-inquiries')}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-sky-300 hover:shadow-md transition"
              >
                <div className="space-y-0.5">
                  <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Support Tickets</span>
                  <div className="text-2xl font-extrabold text-sky-600 font-sans">
                    {inquiries.filter(i => i.status === 'open' || i.status === 'in_progress').length}
                  </div>
                  <span className="text-[8px] text-sky-600 font-bold">Active tickets pending</span>
                </div>
                <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600">
                  <MessageSquare className="w-5 h-5" />
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
                            <strong className="block text-slate-900 group-hover:text-sky-700 transition-colors flex flex-wrap items-center gap-1">
                              {u.fullName}
                              <span className={`text-[8px] px-1 py-0.2 rounded font-extrabold uppercase ${
                                u.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {u.role}
                              </span>
                              {u.status === 'denied' || u.status === 'blocked' ? (
                                <span className="text-[8px] bg-red-100 text-red-700 font-extrabold px-1 py-0.2 rounded uppercase border border-red-200">
                                  Access Denied
                                </span>
                              ) : (
                                <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-1 py-0.2 rounded uppercase">
                                  Active
                                </span>
                              )}
                            </strong>
                            <span className="block text-[9px] text-slate-400 font-mono">{u.mobile}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const userInq = inquiries.find(i => i.userId === u.id);
                              if (userInq) {
                                setSelectedInquiryId(userInq.id);
                              }
                              setActivePage('admin-inquiries');
                            }}
                            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition cursor-pointer relative"
                            title={`Open Support & Help Message Box for ${u.fullName}`}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            {inquiries.some(i => i.userId === u.id && (i.status === 'open' || i.status === 'in_progress')) && (
                              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleUserStatus(u);
                            }}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              u.status === 'denied' || u.status === 'blocked'
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title={u.status === 'denied' || u.status === 'blocked' ? `Allow Access for ${u.fullName}` : `Deny Access for ${u.fullName}`}
                          >
                            <UserX className="w-3.5 h-3.5" />
                          </button>
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
                            <span className={`font-mono block text-xs ${u.balance < 0 ? 'text-red-600 font-black' : 'text-emerald-600 font-bold'}`}>
                              ৳ {u.balance.toFixed(2)}
                            </span>
                            {u.balance < 0 && (
                              <span className="text-[7px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-black uppercase block text-center mt-0.5">
                                Minus Balance
                              </span>
                            )}
                            <span className="text-[8px] bg-slate-100 px-1 py-0.5 rounded text-slate-500 font-medium group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors block mt-0.5">
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

            {/* Support & Help Tickets Operations in Admin Dashboard */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Support & Help Tickets Control Panel</h3>
                    <p className="text-[10px] text-slate-500">Real-time client ticket inbox, file attachment inspection & status releases</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage('admin-inquiries')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Full Support Portal</span>
                </button>
              </div>
              {renderInquirySystem(currentSessionUser, true)}
            </div>

            {/* Supervisor Core Control Bottom Navigation Menu Card */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-md space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">Supervisor Quick Switch Menu</span>
                <span className="text-[9px] text-slate-400 font-mono">Admin | Client | Commission</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setActivePage('admin-dashboard')}
                  className={`p-3 rounded-xl border transition flex items-center justify-center space-x-2 text-xs font-bold cursor-pointer ${
                    activePage === 'admin-dashboard' || activePage === 'admin-inquiries'
                      ? 'bg-blue-600 border-blue-400 text-white shadow'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Shield className="w-4 h-4 text-sky-300" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentSessionUser) setActivePage('user-dashboard');
                    else setActivePage('user-login');
                  }}
                  className={`p-3 rounded-xl border transition flex items-center justify-center space-x-2 text-xs font-bold cursor-pointer ${
                    activePage === 'user-dashboard' || activePage === 'user-login' || activePage === 'user-inquiries'
                      ? 'bg-blue-600 border-blue-400 text-white shadow'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <User className="w-4 h-4 text-sky-300" />
                  <span>Client</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePage('commission-apply')}
                  className={`p-3 rounded-xl border transition flex items-center justify-center space-x-2 text-xs font-bold cursor-pointer ${
                    activePage === 'commission-apply'
                      ? 'bg-emerald-600 border-emerald-400 text-white shadow font-black'
                      : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Commission</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE: COMMISSION APPLY & SETTLEMENT */}
        {activePage === 'commission-apply' && (
          <div className="p-6 bg-slate-50 space-y-6 flex-grow select-none text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 font-sans tracking-tight">Commission Apply & Settlement Portal</h1>
                    <p className="text-[11px] text-slate-500">
                      Directly charge, deduct, and settle commission fees on client available balances in real time.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentSessionUser?.role === 'admin') setActivePage('admin-dashboard');
                    else setActivePage('admin-login');
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (currentSessionUser) setActivePage('user-dashboard');
                    else setActivePage('user-login');
                  }}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Client Portal</span>
                </button>
              </div>
            </div>

            {/* Quick Charge Commission Form Box */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="border-b border-slate-100 pb-2 flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Charge Commission Fee</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Client Profile</label>
                    <select
                      value={selectedCommissionUserId}
                      onChange={(e) => {
                        const uid = e.target.value;
                        setSelectedCommissionUserId(uid);
                        const u = users.find(x => x.id === uid);
                        if (u) {
                          setCommissionMultiplierInput(u.commissionMultiplier !== undefined ? String(u.commissionMultiplier) : '');
                        } else {
                          setCommissionMultiplierInput('');
                        }
                      }}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none text-slate-800 font-bold"
                    >
                      <option value="">-- Choose Client Profile --</option>
                      {systemClients.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.fullName} ({u.mobile}) - ৳ {u.balance.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(() => {
                    const selUser = users.find(u => u.id === selectedCommissionUserId);
                    if (!selUser) return null;
                    return (
                      <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 font-mono text-xs">
                        <div className="text-[10px] text-slate-400 font-extrabold uppercase">Available Balance</div>
                        <div className={`text-xl font-black ${selUser.balance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          ৳ {selUser.balance.toFixed(2)}
                        </div>
                        {selUser.balance < 0 && (
                          <div className="text-[8px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-bold uppercase w-max">
                            Minus Balance (Overdraft Active)
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Manual Commission Amount (TK)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="৳ Manual amount"
                        value={manualChargeInput}
                        onChange={(e) => setManualChargeInput(e.target.value)}
                        className="flex-grow p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none font-bold text-slate-900 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!selectedCommissionUserId) {
                            setSimAlert({ type: 'error', message: 'Please choose a client profile first.' });
                            return;
                          }
                          handleApplyManualCommissionCharge(selectedCommissionUserId);
                        }}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition shadow-sm cursor-pointer"
                      >
                        Charge
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Set Custom Multiplier Rate (per 1000 TK)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 7.5"
                        value={commissionMultiplierInput}
                        onChange={(e) => setCommissionMultiplierInput(e.target.value)}
                        className="flex-grow p-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleApplyUserCommissionMultiplier}
                        disabled={!selectedCommissionUserId}
                        className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                      >
                        Save Rate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Clients Available Balance & Commission Apply Overview Table */}
              <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">All Clients Available Balance & Rates</h3>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">{systemClients.length} Client Profiles Registered</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-slate-200 text-left text-xs">
                    <thead>
                      <tr className="text-slate-400 uppercase font-bold text-[10px]">
                        <th className="py-2.5 px-3">Client</th>
                        <th className="py-2.5 px-3">Mobile Number</th>
                        <th className="py-2.5 px-3">Available Balance</th>
                        <th className="py-2.5 px-3">Rate / 1k</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {systemClients.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2.5 px-3 font-bold text-slate-900">{u.fullName}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">{u.mobile}</td>
                          <td className="py-2.5 px-3 font-mono">
                            <span className={`font-black ${u.balance < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                              ৳ {u.balance.toFixed(2)}
                            </span>
                            {u.balance < 0 && (
                              <span className="ml-1 text-[7px] bg-red-100 text-red-700 px-1 py-0.2 rounded font-black uppercase inline-block">
                                Minus
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-600 font-bold">
                            ৳ {u.commissionMultiplier !== undefined ? u.commissionMultiplier : 7.5}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCommissionUserId(u.id);
                                setCommissionMultiplierInput(u.commissionMultiplier !== undefined ? String(u.commissionMultiplier) : '');
                              }}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-extrabold transition cursor-pointer"
                            >
                              Select & Charge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Recent Commission Charges History Log */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Platform Commission Charges Settlement Stream</h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {(() => {
                      const allCharges: Array<{userId: string, userName: string, amount: number, timestamp: string}> = [];
                      Object.entries(commissionCharges).forEach(([uid, chgArr]) => {
                        const usr = users.find(x => x.id === uid);
                        chgArr.forEach(c => {
                          allCharges.push({
                            userId: uid,
                            userName: usr ? usr.fullName : uid,
                            amount: c.amount,
                            timestamp: c.timestamp
                          });
                        });
                      });

                      if (allCharges.length === 0) {
                        return <p className="text-[10px] text-slate-400 text-center py-3">No manual commission charges applied yet.</p>;
                      }

                      return allCharges.map((c, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-slate-400 font-mono">{c.timestamp.slice(11, 19)}</span>
                            <span className="font-bold text-slate-800">{c.userName}</span>
                          </div>
                          <span className="font-mono font-black text-rose-600 text-xs">
                            - ৳ {c.amount.toFixed(2)}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
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
              {pinChallengeAction.startsWith('approve') ? (
                <ShieldAlert className="w-8 h-8 text-emerald-600 mx-auto" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-600 mx-auto" />
              )}
              <h3 className="text-sm font-bold text-slate-900">
                {pinChallengeAction.startsWith('approve') ? 'Confirm & Authorize Approval' : 'Confirm Action Rejection'}
              </h3>
              <p className="text-[11px] text-slate-500 leading-normal">
                {pinChallengeAction.startsWith('approve') 
                  ? 'Administrative security protocols mandate setting a manual custom PIN to authorize this transaction approval.'
                  : 'Specify a rejection reason or comment below. This comment will be notified to the user and attached to their receipt.'}
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

              {pinChallengeAction.startsWith('reject') && (
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-700 mb-1">
                    Rejection Comment / Reason (Paragraph):
                  </label>
                  <textarea
                    rows={3}
                    value={rejectionCommentInput}
                    onChange={(e) => setRejectionCommentInput(e.target.value)}
                    placeholder="Type the rejection reason or details for the user (e.g. Invalid account details, duplicate request, etc.)..."
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-slate-800 font-medium leading-relaxed"
                  />
                  <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                    This note will be automatically sent in the user's notification feed and saved on the transaction receipt.
                  </p>
                </div>
              )}

              {pinError && (
                <p className="text-[10px] text-red-500 text-center font-semibold leading-snug">{pinError}</p>
              )}

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { setPinChallengeAction(null); setPinChallengeTargetId(null); setRejectionCommentInput(''); }}
                  className="py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdminActionAuthorize}
                  className={`py-2 text-white text-xs font-bold rounded-lg shadow cursor-pointer text-center transition ${
                    pinChallengeAction.startsWith('approve') 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
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
                        <span className="text-slate-400">Account Access:</span>
                        <span className={`font-bold text-[9px] uppercase px-2 py-0.5 rounded ${
                          selectedUserToView.status === 'denied' || selectedUserToView.status === 'blocked'
                            ? 'bg-red-100 text-red-800 border border-red-300 font-black'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {selectedUserToView.status === 'denied' || selectedUserToView.status === 'blocked' ? 'Access Denied' : 'Active'}
                        </span>
                      </div>
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

                    {/* Access Toggle Button */}
                    <button 
                      type="button"
                      onClick={() => handleToggleUserStatus(selectedUserToView)}
                      className={`w-full py-2 px-3 border rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        selectedUserToView.status === 'denied' || selectedUserToView.status === 'blocked'
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-red-50 hover:bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>{selectedUserToView.status === 'denied' || selectedUserToView.status === 'blocked' ? 'Allow Access (Reactivate Account)' : 'Deny Access (Suspend Account)'}</span>
                    </button>

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

                    {/* Support & Help User Message Box Section */}
                    <div className="border-t border-slate-100 pt-4 mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                          <span>User Message Box (Support & Help)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const userInq = inquiries.find(i => i.userId === selectedUserToView.id);
                            if (userInq) setSelectedInquiryId(userInq.id);
                            setIsCreatingInquiry(true);
                          }}
                          className="text-[9px] font-bold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-2 py-0.5 rounded border border-sky-200 transition cursor-pointer"
                        >
                          + New Message Thread
                        </button>
                      </div>

                      {/* Display tickets for this user */}
                      {(() => {
                        const userInqs = inquiries.filter(i => i.userId === selectedUserToView.id);
                        if (userInqs.length === 0) {
                          return (
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center text-slate-400 space-y-1">
                              <HelpCircle className="w-5 h-5 mx-auto text-slate-300" />
                              <p className="text-[11px] font-medium">No support messages from this user yet.</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setIsCreatingInquiry(true);
                                }}
                                className="text-[10px] text-sky-600 font-bold hover:underline"
                              >
                                Create message thread as admin
                              </button>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-2">
                            {userInqs.map((inq) => {
                              const isSelected = inq.id === selectedInquiryId;
                              return (
                                <div
                                  key={inq.id}
                                  onClick={() => {
                                    setSelectedInquiryId(inq.id);
                                    setActivePage('admin-inquiries');
                                  }}
                                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition ${
                                    isSelected
                                      ? 'bg-sky-50 border-sky-300 shadow-xs'
                                      : 'bg-white hover:bg-slate-50 border-slate-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-mono text-[9px] font-bold text-sky-700 uppercase">
                                      #{inq.id}
                                    </span>
                                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                                      inq.status === 'open' ? 'bg-amber-100 text-amber-800' :
                                      inq.status === 'in_progress' ? 'bg-sky-100 text-sky-800' :
                                      inq.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                      'bg-slate-200 text-slate-700'
                                    }`}>
                                      {inq.status.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <h5 className="text-[11px] font-bold text-slate-800 truncate mb-1">{inq.subject}</h5>
                                  <div className="flex items-center justify-between text-[9px] text-slate-500">
                                    <span>Category: {inq.category}</span>
                                    <span className="font-mono">{inq.updatedAt.slice(11, 16)}</span>
                                  </div>
                                  <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-[9px]">
                                    <span className="text-slate-500 font-medium">{inq.messages.length} message(s)</span>
                                    <span className="text-sky-600 font-bold flex items-center gap-0.5">
                                      Open Chat &rarr;
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
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
                <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 flex flex-col max-h-[380px]">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <ArrowRightLeft className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Activity Transaction Ledger</h3>
                    </div>

                    {/* Admin Search Filter Input */}
                    <div className="relative flex-grow max-w-[200px]">
                      <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search Ref, recipient, way, status..." 
                        value={adminModalTxnSearch}
                        onChange={(e) => setAdminModalTxnSearch(e.target.value)}
                        className="w-full pl-8 pr-6 py-1 border border-slate-200 rounded-xl text-[10px] bg-slate-50 focus:outline-none focus:bg-white text-slate-800 font-medium placeholder:text-slate-400"
                      />
                      {adminModalTxnSearch && (
                        <button 
                          onClick={() => setAdminModalTxnSearch('')}
                          className="absolute right-2 top-1.5 text-[10px] text-slate-400 hover:text-slate-700 font-bold"
                          title="Clear search"
                        >
                          ✕
                        </button>
                      )}
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
                          <th className="py-2">Receipt</th>
                          <th className="py-2 text-right">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                        {(() => {
                          const rawTxns = transactions.filter(t => t.userId === selectedUserToView.id);
                          const filteredModalTxns = rawTxns.filter(t => {
                            if (!adminModalTxnSearch.trim()) return true;
                            const q = adminModalTxnSearch.toLowerCase().trim();
                            return (
                              t.referenceNo.toLowerCase().includes(q) ||
                              (t.recipient && t.recipient.toLowerCase().includes(q)) ||
                              (t.way && t.way.toLowerCase().includes(q)) ||
                              t.type.toLowerCase().includes(q) ||
                              t.status.toLowerCase().includes(q) ||
                              t.amount.toString().includes(q) ||
                              (t.authPin && t.authPin.toLowerCase().includes(q)) ||
                              (t.createdAt && t.createdAt.toLowerCase().includes(q))
                            );
                          });

                          if (filteredModalTxns.length === 0) {
                            return (
                              <tr>
                                <td colSpan={8} className="text-center py-8 text-slate-400">
                                  {adminModalTxnSearch.trim() ? `No transactions matching "${adminModalTxnSearch}".` : 'No transactions recorded.'}
                                </td>
                              </tr>
                            );
                          }

                          return filteredModalTxns.map((t, index) => (
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
                                  <div className="flex flex-col items-start gap-0.5">
                                    <span className="inline-flex px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[8px] font-bold rounded">Approved</span>
                                    <span className="text-[8px] text-emerald-600 font-mono font-bold">PIN: {t.authPin || '123456'}</span>
                                  </div>
                                ) : t.status === 'rejected' ? (
                                  <span className="inline-flex px-1.5 py-0.5 bg-red-100 text-red-800 text-[8px] font-bold rounded">Rejected</span>
                                ) : (
                                  <span className="inline-flex px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[8px] font-bold rounded animate-pulse">Pending</span>
                                )}
                              </td>
                              <td className="py-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedReceiptTxn(t)}
                                  className={`inline-flex items-center gap-0.5 text-[8px] font-extrabold px-2 py-0.5 rounded-full transition cursor-pointer border ${
                                    t.status === 'approved'
                                      ? 'text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border-sky-200'
                                      : t.status === 'rejected'
                                      ? 'text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border-rose-200'
                                      : 'text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border-amber-200'
                                  }`}
                                  title="Tap to View, Share & Print Voucher Receipt"
                                >
                                  <FileText className="w-2.5 h-2.5 text-current" />
                                  <span>{t.status === 'rejected' ? 'Receipt / Comment 📄' : 'Receipt PDF 📄'}</span>
                                </button>
                              </td>
                              <td className="py-2 text-slate-400 text-right font-mono text-[9px]">{t.createdAt}</td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inquiry & Support Ticket System for Admin inspecting User Dashboard */}
                <div className="lg:col-span-12">
                  {renderInquirySystem(selectedUserToView, true)}
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
                        <th className="p-2">Receipt</th>
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
                          <td className="p-2">
                            <button
                              type="button"
                              onClick={() => setSelectedReceiptTxn(t)}
                              className="inline-flex items-center gap-1 text-[9px] font-extrabold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full transition cursor-pointer"
                              title="Tap to View Voucher Receipt"
                            >
                              <FileText className="w-2.5 h-2.5 text-sky-600" />
                              <span>Receipt 📄</span>
                            </button>
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

      {/* SINGLE TRANSACTION RECEIPT / PDF VOUCHER MODAL */}
      {selectedReceiptTxn && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[70] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-left my-8">
            
            {/* Modal Navigation Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold tracking-tight">Official Payment Voucher Slip</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptTxn(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt Paper Card */}
            <div id="printable-receipt-card" className="p-6 space-y-4 bg-slate-50 border-b border-slate-200">
              
              {/* Header Branding */}
              <div className="text-center pb-3 border-b border-slate-200/80 space-y-1">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-black text-lg mb-1 shadow-sm">
                  ✓
                </div>
                <h2 className="text-base font-black text-slate-900 tracking-tight">MASHUD TELECOM</h2>
                <p className="text-[10px] font-extrabold text-sky-700 uppercase tracking-widest pt-0.5">Electronic Payment Receipt Voucher</p>
                <span className={`inline-block mt-1 px-3 py-0.5 border text-[10px] font-black rounded-full uppercase tracking-wider ${
                  selectedReceiptTxn.status === 'approved' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : selectedReceiptTxn.status === 'rejected'
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  ✓ {selectedReceiptTxn.status === 'approved' ? 'Taka already send' : selectedReceiptTxn.status.toUpperCase()}
                </span>
              </div>

              {/* Voucher Metadata */}
              <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-[11px] font-medium">Reference ID:</span>
                  <span className="font-mono font-black text-slate-900 text-xs">{selectedReceiptTxn.referenceNo}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-[11px] font-medium">Date & Time:</span>
                  <span className="font-mono text-slate-700 font-semibold text-[11px]">{selectedReceiptTxn.createdAt}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-[11px] font-medium">Recipient Mobile:</span>
                  <span className="font-mono font-black text-slate-900 text-xs">{selectedReceiptTxn.recipient || selectedReceiptTxn.userMobile || 'N/A'}</span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-[11px] font-medium">Transaction Type:</span>
                  <span className="font-bold text-slate-800 capitalize text-[11px]">
                    {selectedReceiptTxn.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-slate-100">
                  <span className="text-slate-500 text-[11px] font-medium">Payment Way:</span>
                  <span className="font-extrabold text-indigo-600 uppercase text-[11px]">{selectedReceiptTxn.way || 'BKASH'}</span>
                </div>

                <div className="flex justify-between items-center pt-2 text-rose-700 font-bold">
                  <span className="text-slate-800 text-xs font-black uppercase">Send Money Amount:</span>
                  <span className="font-mono text-base font-black text-rose-700">
                    {selectedReceiptTxn.status === 'rejected' ? '0000 (৳ 0.00 TK)' : `- ৳ ${selectedReceiptTxn.amount.toFixed(2)} TK`}
                  </span>
                </div>

                {/* Security PIN Code Box */}
                <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 block uppercase">Authorization PIN Code</span>
                    <span className="text-[9px] text-emerald-600 font-medium">Official Security Verification Key</span>
                  </div>
                  <span className="font-mono text-sm font-black text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-300 shadow-2xs min-w-[50px] inline-block text-center min-h-[26px]">
                    {selectedReceiptTxn.status === 'rejected' ? '' : (selectedReceiptTxn.authPin || '123456')}
                  </span>
                </div>

                {/* Rejection Comment Box */}
                {selectedReceiptTxn.rejectionComment && (
                  <div className="mt-2 bg-rose-50 border border-rose-200 rounded-lg p-2.5 space-y-1 text-left">
                    <span className="text-[10px] font-bold text-rose-800 block uppercase">Rejection Reason / Comment</span>
                    <p className="text-[11px] font-medium text-rose-950 leading-relaxed font-sans bg-white p-2 rounded border border-rose-100">
                      {selectedReceiptTxn.rejectionComment}
                    </p>
                  </div>
                )}

                {/* Number Correction & Re-Send Button */}
                {selectedReceiptTxn.status === 'rejected' && (
                  <div className="mt-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleNumberCorrectionAndResend(selectedReceiptTxn)}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-600 hover:via-orange-600 hover:to-rose-700 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer active:scale-98 border border-amber-300/40"
                    >
                      <RotateCcw className="w-4 h-4 text-white" />
                      <span className="tracking-wide">Number Correction & Re-Send</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Note */}
              <div className="text-center text-xs font-bold text-slate-700 pt-1 tracking-wide">
                Thank You
              </div>
            </div>

            {/* Action Sharing Buttons */}
            <div className="p-4 bg-white space-y-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Share & Printable Options</p>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* WhatsApp Share */}
                <button
                  type="button"
                  onClick={() => {
                    const userObj = users.find(u => u.id === selectedReceiptTxn.userId) || currentSessionUser;
                    handleShareWhatsApp(selectedReceiptTxn, userObj);
                  }}
                  className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp</span>
                </button>

                {/* Email Share */}
                <button
                  type="button"
                  onClick={() => {
                    const userObj = users.find(u => u.id === selectedReceiptTxn.userId) || currentSessionUser;
                    handleShareEmail(selectedReceiptTxn, userObj);
                  }}
                  className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email</span>
                </button>

                {/* Download PDF */}
                <button
                  type="button"
                  onClick={() => {
                    const userObj = users.find(u => u.id === selectedReceiptTxn.userId) || currentSessionUser;
                    handleDownloadSingleReceiptPDF(selectedReceiptTxn, userObj);
                  }}
                  className="p-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Save PDF Slip</span>
                </button>

                {/* Print Receipt */}
                <button
                  type="button"
                  onClick={() => handlePrintReceipt(selectedReceiptTxn)}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center space-x-1.5 transition cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
              </div>

              {/* Copy Text Summary */}
              <button
                type="button"
                onClick={() => {
                  const userObj = users.find(u => u.id === selectedReceiptTxn.userId) || currentSessionUser;
                  handleCopyReceiptText(selectedReceiptTxn, userObj);
                }}
                className={`w-full py-2.5 font-bold rounded-xl flex items-center justify-center space-x-1.5 text-xs transition cursor-pointer border shadow-xs ${
                  isReceiptCopied
                    ? 'bg-emerald-600 text-white border-emerald-700 font-extrabold scale-[0.99]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
              >
                {isReceiptCopied ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>✓ COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy Full Receipt Text</span>
                  </>
                )}
              </button>

              {/* Toggle Manual Text View */}
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => setShowRawText(!showRawText)}
                  className="text-[10px] text-slate-500 hover:text-slate-800 underline font-semibold cursor-pointer"
                >
                  {showRawText ? 'Hide Raw Receipt Text' : 'View / Manual Copy Raw Text Box'}
                </button>
              </div>

              {showRawText && (
                <div className="space-y-1.5 animate-fade-in pt-1">
                  <textarea
                    readOnly
                    rows={8}
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    value={getReceiptShareText(selectedReceiptTxn, users.find(u => u.id === selectedReceiptTxn.userId) || currentSessionUser)}
                    className="w-full p-2.5 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 select-all"
                  />
                  <p className="text-[9px] text-slate-400 text-center">Tap inside text area to select all & copy manually.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* USER PROFILE DETAILS MODAL */}
      {isProfileModalOpen && currentSessionUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">User Profile Details</h3>
                  <p className="text-[10px] text-slate-300">View and update your personal account info</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md border-2 border-white">
                  {currentSessionUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-extrabold text-slate-900 text-base truncate">{currentSessionUser.fullName}</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{currentSessionUser.email}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Role: <span className="font-bold text-slate-700 uppercase">{currentSessionUser.role}</span> | Wallet ID: <span className="font-mono font-bold text-blue-600">#MT-{currentSessionUser.id.toUpperCase().split('-')[1] || '89042'}</span></p>
                </div>
              </div>

              {/* Form to edit details */}
              <form onSubmit={handleSaveProfileDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profileNameInput}
                      onChange={(e) => setProfileNameInput(e.target.value)}
                      required
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={profileMobileInput}
                      onChange={(e) => setProfileMobileInput(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Current Balance</span>
                    <span className="font-extrabold text-emerald-700 font-mono text-sm">৳ {currentSessionUser.balance.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Security PIN</span>
                    <span className="font-mono font-extrabold text-blue-700 text-sm">123456</span>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              {/* Quick Actions inside Profile Modal */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Account Tools</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      setIsChangePasswordModalOpen(true);
                    }}
                    className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>Change Password</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileModalOpen(false);
                      handleDownloadPDFStatement(
                        currentSessionUser,
                        transactions.filter(t => t.userId === currentSessionUser.id),
                        userCommissionMultiplier
                      );
                    }}
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Download e-Statement</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isChangePasswordModalOpen && currentSessionUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/30 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Change Security Password</h3>
                  <p className="text-[10px] text-slate-300">Update password for account security</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleChangeUserPassword} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Security Password</label>
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  required
                  placeholder="At least 4 characters"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPasswordInput}
                  onChange={(e) => setConfirmNewPasswordInput(e.target.value)}
                  required
                  placeholder="Re-enter new password"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-md transition cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
