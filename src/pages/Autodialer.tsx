import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Clock,
  User,
  AlertCircle,
  AlertTriangle,
  Upload,
  FileText,
  Download,
  BarChart3,
  Users,
  Star,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  X,
  Calendar,
  Smartphone,
  ChevronRight,
  LogOut,
  Sparkles,
  Mail,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Filter,
  Activity,
  Zap,
  Check,
  UserPlus,
  Share2,
  PlusSquare,
  Copy,
  Send,
  Bell
} from 'lucide-react';

interface Lead {
  id?: string;
  name: string;
  phone: string;
  status?: 'pending' | 'dialing' | 'called' | 'skipped';
  call_count?: number;
}

interface Campaign {
  id: string;
  name: string;
  sales_email: string;
  total_leads: number;
  completed_leads: number;
  status: string;
  created_at: string;
}

interface FraudFlag {
  code: 'GHOST_CALL' | 'INSTANT_QUALIFIED_SPOOF' | 'RAPID_BURST' | 'REPETITIVE_NOTES';
  severity: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  description: string;
}

interface CallLog {
  id: string;
  lead_name: string;
  phone: string;
  sales_email: string;
  duration_seconds: number;
  feedback_status: string;
  feedback_notes: string;
  is_qualified: boolean;
  redirected_at: string;
  returned_at?: string;
  created_at?: string;
  fraud_flags?: FraudFlag[];
  is_flagged?: boolean;
  risk_severity?: 'clean' | 'low' | 'medium' | 'high' | 'critical';
}

interface RepPerformance {
  email: string;
  totalCalls: number;
  totalDurationSeconds: number;
  avgDurationSeconds: number;
  qualifiedCount: number;
  conversionRate: number;
  ghostCalls: number;
  instantSpoofs: number;
  flaggedCount: number;
  fraudScore: number;
  riskLevel: 'clean' | 'moderate' | 'high' | 'critical';
}

interface FraudTelemetry {
  totalFlaggedCalls: number;
  ghostCallsCount: number;
  instantSpoofsCount: number;
  highRiskRepsCount: number;
  flaggedCallsSample: CallLog[];
}

interface QualifiedLead {
  id: string;
  name: string;
  phone: string;
  sales_email: string;
  duration_seconds?: number;
  notes: string;
  feedback_status: string;
  callback_at?: string;
  created_at: string;
}

interface SalesMember {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface ScheduledCallback {
  id: string;
  call_log_id?: string;
  lead_id?: string;
  campaign_id?: string;
  sales_email: string;
  lead_name: string;
  phone: string;
  callback_time: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

type AutodialerTab = 'queue' | 'upload' | 'qualified' | 'callbacks' | 'analytics' | 'admin_overview' | 'admin_fraud' | 'admin_team';

export default function Autodialer() {
  // Configuration
  const rawApiUrl = import.meta.env.VITE_BLOG_API_URL || 'https://bloggfeature.certifyied.workers.dev';
  let resolvedBase = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
  if (resolvedBase.endsWith('/adminApiBlog')) {
    resolvedBase = resolvedBase.slice(0, -'/adminApiBlog'.length);
  }
  const apiBase = resolvedBase;
  const endpointBase = `${apiBase}/adminApiBlog/api/autodialer`;

  // Auth State
  const [authToken, setAuthToken] = useState<string>(() => localStorage.getItem('certifyied_autodialer_token') || '');
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(() => localStorage.getItem('certifyied_autodialer_email') || '');
  const [currentUserRole, setCurrentUserRole] = useState<string>(() => localStorage.getItem('certifyied_autodialer_role') || 'sales');
  const [loginEmail, setLoginEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [magicLinkSentTo, setMagicLinkSentTo] = useState<string | null>(null);
  const [devMagicLink, setDevMagicLink] = useState<string | null>(null);
  const [isVerifyingMagicToken, setIsVerifyingMagicToken] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'global';

  // App & Navigation State
  const [activeTab, setActiveTab] = useState<AutodialerTab>('queue');
  const [isChrome, setIsChrome] = useState(true);
  const [showChromeAlert, setShowChromeAlert] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showInstallSheet, setShowInstallSheet] = useState(false);
  const [installBannerDismissed, setInstallBannerDismissed] = useState<boolean>(() => {
    try {
      return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('autodialer_install_dismissed') === 'true' : false;
    } catch (e) {
      return false;
    }
  });

  const isIOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  // Sales Team Directory State (Admin)
  const [salesTeamList, setSalesTeamList] = useState<SalesMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);
  const [showAddSalesForm, setShowAddSalesForm] = useState(false);
  const [newSalesEmail, setNewSalesEmail] = useState('');
  const [newSalesRole, setNewSalesRole] = useState<'sales' | 'admin'>('sales');
  const [isAddingSalesEmail, setIsAddingSalesEmail] = useState(false);
  const [sendInviteOnAdd, setSendInviteOnAdd] = useState(true);
  const [sendingInviteEmail, setSendingInviteEmail] = useState<string | null>(null);
  const [lastGeneratedInvite, setLastGeneratedInvite] = useState<{ email: string; link: string } | null>(null);
  const [copiedLinkEmail, setCopiedLinkEmail] = useState<string | null>(null);

  // Campaign & Leads State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentLeadIndex, setCurrentLeadIndex] = useState(0);

  // CSV Upload State
  const [csvFileName, setCsvFileName] = useState('');
  const [parsedLeads, setParsedLeads] = useState<Lead[]>([]);
  const [campaignTitle, setCampaignTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Calling & Timing State (with activeCallLead persistence)
  const [callingState, setCallingState] = useState<'idle' | 'dialing' | 'feedback'>('idle');
  const [activeCallLead, setActiveCallLead] = useState<Lead | null>(null);
  const [activeCallLogId, setActiveCallLogId] = useState<string | null>(null);
  const activeCallLogIdRef = useRef<string | null>(null);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const callStartTimeRef = useRef<Date | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const callDurationRef = useRef<number>(0);
  const timerIntervalRef = useRef<any>(null);

  // Feedback Form State
  const [feedbackStatus, setFeedbackStatus] = useState<'Qualified Lead' | 'Interested' | 'Call Back' | 'Busy / No Answer' | 'Not Interested' | 'Wrong Number'>('Qualified Lead');
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [callbackTime, setCallbackTime] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Analytics & Fraud State
  const [analyticsStats, setAnalyticsStats] = useState<any>(null);
  const [repLeaderboard, setRepLeaderboard] = useState<RepPerformance[]>([]);
  const [fraudTelemetry, setFraudTelemetry] = useState<FraudTelemetry | null>(null);
  const [recentCallLogs, setRecentCallLogs] = useState<CallLog[]>([]);
  const [feedbackBreakdown, setFeedbackBreakdown] = useState<Record<string, number>>({});
  const [qualifiedLeadsList, setQualifiedLeadsList] = useState<QualifiedLead[]>([]);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Callbacks State
  const [callbacksList, setCallbacksList] = useState<ScheduledCallback[]>([]);
  const [isLoadingCallbacks, setIsLoadingCallbacks] = useState(false);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const scheduledTimeoutsRef = useRef<{ [key: string]: any }>({});

  // Admin Drilldown & Fraud Filtering
  const [selectedRepFilter, setSelectedRepFilter] = useState<string>('all');
  const [fraudLedgerFilter, setFraudLedgerFilter] = useState<'all' | 'flagged' | 'spoof' | 'ghost'>('flagged');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState<boolean>(false);

  // UI Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Safe Telephone Trigger (prevents top-level window.location reload)
  const triggerPhoneDial = (phone: string) => {
    const sanitized = phone.replace(/[^\d+]/g, '');
    const a = document.createElement('a');
    a.href = `tel:${sanitized}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
      } catch (e) {}
    }, 500);
  };

  // Set default view based on role
  useEffect(() => {
    if (isAdmin) {
      setActiveTab((prev) => (prev === 'queue' ? 'admin_overview' : prev));
    } else {
      setActiveTab((prev) => (prev.startsWith('admin_') ? 'queue' : prev));
    }
  }, [isAdmin]);

  // --- 1. DETECT BROWSER & PWA ---
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const chromeDetected = /Chrome/.test(userAgent) && !/Edg/.test(userAgent) && !/OPR/.test(userAgent);
    setIsChrome(chromeDetected);

    try {
      if ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (window.navigator as any)?.standalone) {
        setIsAppInstalled(true);
      }
    } catch (e) {}

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      showToast('Autodialer App installed to Home Screen!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Check URL for magic_token on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const magicToken = params.get('magic_token');
    if (magicToken) {
      handleVerifyMagicToken(magicToken);
    }
  }, []);

  // --- 2. AUTHENTICATION & SESSION VERIFICATION ---
  const handleVerifyMagicToken = async (token: string) => {
    setIsVerifyingMagicToken(true);
    setAuthError(null);
    try {
      const res = await fetch(`${apiBase}/adminApiBlog/auth/verify-magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        let decodedEmail = '';
        let decodedRole = 'sales';
        try {
          const payloadBase64 = data.token.split('.')[1];
          const payloadJson = JSON.parse(atob(payloadBase64));
          decodedEmail = payloadJson.email || '';
          decodedRole = payloadJson.role || 'sales';
        } catch (e) {}

        setAuthToken(data.token);
        setCurrentUserEmail(decodedEmail);
        setCurrentUserRole(decodedRole);
        localStorage.setItem('certifyied_autodialer_token', data.token);
        localStorage.setItem('certifyied_autodialer_email', decodedEmail);
        localStorage.setItem('certifyied_autodialer_role', decodedRole);

        window.history.replaceState({}, document.title, window.location.pathname);
        showToast(`Authenticated as ${decodedEmail} (${decodedRole.toUpperCase()})`);
      } else {
        setAuthError(data.error || 'Invalid or expired login link. Please request a new one.');
      }
    } catch (err) {
      setAuthError('Could not verify login link. Please check your connection.');
    } finally {
      setIsVerifyingMagicToken(false);
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    setIsLoggingIn(true);
    setAuthError(null);
    const normalizedEmail = loginEmail.trim().toLowerCase();

    try {
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;
      const res = await fetch(`${apiBase}/adminApiBlog/auth/send-magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalizedEmail,
          redirectUrl,
          portalType: 'sales',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMagicLinkSentTo(normalizedEmail);
        if (data.devMagicLink) {
          setDevMagicLink(data.devMagicLink);
        }
        if (data.emailSent) {
          showToast(`Magic login link sent to ${normalizedEmail}`);
        } else if (data.emailDelivery?.error) {
          showToast(`Direct login link ready below. (Email: ${data.emailDelivery.error})`);
        } else {
          showToast(`Magic login link generated for ${normalizedEmail}`);
        }
      } else {
        setAuthError(
          data.error || 'Unauthorized email. This email is not in the database. Ask an admin to add it.'
        );
      }
    } catch (err: any) {
      setAuthError('Connection error. Could not send magic link.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthToken('');
    setCurrentUserEmail('');
    setMagicLinkSentTo(null);
    setDevMagicLink(null);
    localStorage.removeItem('certifyied_autodialer_token');
    localStorage.removeItem('certifyied_autodialer_email');
    localStorage.removeItem('certifyied_autodialer_role');
    showToast('Signed out');
  };

  // --- 3. FETCH ANALYTICS (DUAL VIEWS + FRAUD ENGINE) ---
  const loadAnalytics = async (
    repOverride?: string,
    dateFilterOverride?: 'all' | 'today' | 'yesterday' | '7d' | '30d' | 'month' | 'custom',
    startOverride?: string,
    endOverride?: string
  ) => {
    if (!authToken) return;
    setIsLoadingAnalytics(true);
    try {
      const rep = repOverride !== undefined ? repOverride : selectedRepFilter;
      const df = dateFilterOverride !== undefined ? dateFilterOverride : dateFilter;
      const sd = startOverride !== undefined ? startOverride : customStartDate;
      const ed = endOverride !== undefined ? endOverride : customEndDate;

      const url = new URL(`${endpointBase}/analytics`);
      if (rep && rep !== 'all') {
        url.searchParams.set('rep', rep);
      }
      if (df && df !== 'all') {
        url.searchParams.set('timeRange', df);
        if (df === 'custom') {
          if (sd) url.searchParams.set('startDate', sd);
          if (ed) url.searchParams.set('endDate', ed);
        }
      }
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();

      if (data.isAdmin) {
        setAnalyticsStats(data.stats);
        setRepLeaderboard(data.repLeaderboard || []);
        setFraudTelemetry(data.fraudTelemetry || null);
        setRecentCallLogs(data.recentCalls || []);
        setFeedbackBreakdown(data.feedbackBreakdown || {});
      } else {
        setAnalyticsStats(data.myStats || null);
        setRecentCallLogs(data.recentCalls || []);
        setFeedbackBreakdown(data.feedbackBreakdown || {});
      }
    } catch (e) {
      console.warn('Analytics fetch error:', e);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const loadQualifiedLeads = async () => {
    if (!authToken) return;
    try {
      const res = await fetch(`${endpointBase}/qualified-leads`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.qualifiedLeads) {
        setQualifiedLeadsList(data.qualifiedLeads);
      }
    } catch (e) {
      console.warn('Qualified leads fetch error:', e);
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false;
    try {
      if (Notification.permission === 'granted') {
        setHasNotificationPermission(true);
        return true;
      }
      const perm = await Notification.requestPermission();
      const granted = perm === 'granted';
      setHasNotificationPermission(granted);
      if (granted) {
        showToast('🔔 Browser notifications enabled for scheduled callbacks!');
      }
      return granted;
    } catch (e) {
      return false;
    }
  };

  const triggerDesktopNotification = (title: string, body: string, phone?: string) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      const notif = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
      notif.onclick = () => {
        window.focus();
        if (phone) triggerPhoneDial(phone);
        notif.close();
      };
    } catch (e) {
      console.warn('Desktop notification error:', e);
    }
  };

  const scheduleCallbackAlarms = (callbacksToSchedule: ScheduledCallback[]) => {
    Object.values(scheduledTimeoutsRef.current).forEach((t) => clearTimeout(t));
    scheduledTimeoutsRef.current = {};

    const now = Date.now();
    callbacksToSchedule.forEach((cb) => {
      if (cb.status !== 'pending') return;
      const targetTime = new Date(cb.callback_time).getTime();
      const diff = targetTime - now;

      if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
        scheduledTimeoutsRef.current[cb.id] = setTimeout(() => {
          triggerDesktopNotification(
            `📞 Callback Due: ${cb.lead_name}`,
            `Scheduled call with ${cb.phone} is due now. Click to dial!`,
            cb.phone
          );
        }, diff);
      }
    });
  };

  const loadCallbacks = async () => {
    if (!authToken) return;
    setIsLoadingCallbacks(true);
    try {
      const res = await fetch(`${endpointBase}/callbacks?status=pending`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.callbacks) {
        setCallbacksList(data.callbacks);
        scheduleCallbackAlarms(data.callbacks);
      }
    } catch (e) {
      console.warn('Callbacks fetch error:', e);
    } finally {
      setIsLoadingCallbacks(false);
    }
  };

  const handleUpdateCallbackStatus = async (callbackId: string, status: 'completed' | 'cancelled') => {
    if (!authToken) return;
    try {
      const res = await fetch(`${endpointBase}/callbacks/${callbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(status === 'completed' ? '✅ Callback completed!' : 'Callback dismissed');
        loadCallbacks();
      }
    } catch (e) {
      showToast('Could not update callback status');
    }
  };

  const handleDialCallback = (cb: ScheduledCallback) => {
    const leadObj: Lead = {
      id: cb.lead_id || crypto.randomUUID(),
      campaign_id: cb.campaign_id || '',
      name: cb.lead_name,
      phone: cb.phone,
      status: 'pending',
      call_count: 0,
    };
    setActiveTab('queue');
    handleStartCall(leadObj);
  };

  const fetchSalesTeam = async () => {
    if (!authToken) return;
    setIsLoadingTeam(true);
    try {
      const res = await fetch(`${endpointBase}/sales-team`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.members) {
        setSalesTeamList(data.members);
      }
    } catch (e) {
      console.warn('Failed to fetch sales team:', e);
    } finally {
      setIsLoadingTeam(false);
    }
  };

  const handleAddSalesEmailToDb = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSalesEmail.trim()) return;

    setIsAddingSalesEmail(true);
    const normalized = newSalesEmail.trim().toLowerCase();
    const redirectUrl = `${window.location.origin}${window.location.pathname}`;

    try {
      const res = await fetch(`${endpointBase}/sales-team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          email: normalized,
          role: newSalesRole,
          sendInvite: sendInviteOnAdd,
          redirectUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.inviteSent) {
          showToast(`Registered & sent login link to ${normalized}!`);
        } else if (sendInviteOnAdd) {
          // Explicitly trigger send-magic-link as guarantee
          try {
            const mlRes = await fetch(`${apiBase}/adminApiBlog/auth/send-magic-link`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: normalized,
                redirectUrl,
                portalType: 'sales',
              }),
            });
            const mlData = await mlRes.json();
            if (mlRes.ok && mlData.success) {
              showToast(`Login link dispatched to ${normalized}`);
              if (mlData.devMagicLink) {
                setLastGeneratedInvite({ email: normalized, link: mlData.devMagicLink });
              }
            } else {
              showToast(`Registered ${normalized}. Email: ${data.inviteError || 'Check settings'}`);
            }
          } catch (mlErr) {
            showToast(`Registered ${normalized} as ${newSalesRole.toUpperCase()}`);
          }
        } else {
          showToast(`Registered ${normalized} as ${newSalesRole.toUpperCase()}`);
        }

        if (data.inviteLink) {
          setLastGeneratedInvite({ email: normalized, link: data.inviteLink });
        }

        setNewSalesEmail('');
        setShowAddSalesForm(false);
        fetchSalesTeam();
        loadAnalytics();
      } else {
        showToast(data.error || 'Failed to add sales email.');
      }
    } catch (e: any) {
      showToast('Error connecting to database.');
    } finally {
      setIsAddingSalesEmail(false);
    }
  };

  const handleSendMemberInvite = async (memberEmail: string) => {
    setSendingInviteEmail(memberEmail);
    const redirectUrl = `${window.location.origin}${window.location.pathname}`;
    try {
      const res = await fetch(`${endpointBase}/sales-team/send-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          email: memberEmail,
          redirectUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.emailSent) {
          showToast(`Login email dispatched to ${memberEmail}!`);
        } else {
          showToast(`Invite generated for ${memberEmail}. Email: ${data.emailError || 'Failed'}`);
        }
        if (data.magicLink) {
          setLastGeneratedInvite({ email: memberEmail, link: data.magicLink });
        }
      } else {
        // Direct send-magic-link fallback
        const fallbackRes = await fetch(`${apiBase}/adminApiBlog/auth/send-magic-link`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: memberEmail,
            redirectUrl,
            portalType: 'sales',
          }),
        });
        const fbData = await fallbackRes.json();
        if (fallbackRes.ok && fbData.success) {
          showToast(`Login email dispatched to ${memberEmail}!`);
          if (fbData.devMagicLink) {
            setLastGeneratedInvite({ email: memberEmail, link: fbData.devMagicLink });
          }
        } else {
          showToast(data.error || fbData.error || 'Failed to trigger invite email.');
        }
      }
    } catch (e: any) {
      showToast('Network error triggering invite email.');
    } finally {
      setSendingInviteEmail(null);
    }
  };

  const handleCopyMemberInviteLink = async (memberEmail: string) => {
    const redirectUrl = `${window.location.origin}${window.location.pathname}`;
    try {
      const res = await fetch(`${endpointBase}/sales-team/send-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          email: memberEmail,
          redirectUrl,
        }),
      });
      const data = await res.json();
      const link = data.magicLink;
      if (link) {
        await navigator.clipboard.writeText(link);
        setCopiedLinkEmail(memberEmail);
        setTimeout(() => setCopiedLinkEmail(null), 2500);
        showToast(`Magic login link copied to clipboard!`);
        setLastGeneratedInvite({ email: memberEmail, link });
      } else {
        showToast('Could not generate magic link.');
      }
    } catch (e) {
      showToast('Failed to copy login link.');
    }
  };

  const handleDeleteSalesMember = async (email: string) => {
    if (!confirm(`Revoke database access for ${email}?`)) return;
    try {
      const res = await fetch(`${endpointBase}/sales-team/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        showToast(`Access revoked for ${email}`);
        fetchSalesTeam();
        loadAnalytics();
      }
    } catch (e) {
      showToast('Failed to remove sales member.');
    }
  };

  // Initial Load & Auth verification
  useEffect(() => {
    if (authToken) {
      fetch(`${endpointBase}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((res) => {
          if (res.status === 401 || res.status === 403) {
            handleLogout();
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (!data) return;
          if (data.authenticated && data.role) {
            setCurrentUserRole(data.role);
            localStorage.setItem('certifyied_autodialer_role', data.role);
            if (data.email) {
              setCurrentUserEmail(data.email);
              localStorage.setItem('certifyied_autodialer_email', data.email);
            }
          } else {
            handleLogout();
          }
        })
        .catch(() => {});

      loadAnalytics();
      loadQualifiedLeads();
      loadCallbacks();
      fetchCampaigns();
      if (isAdmin) fetchSalesTeam();
    }
  }, [authToken]);

  // Tab change effects
  useEffect(() => {
    if (activeTab === 'analytics' || activeTab === 'admin_overview' || activeTab === 'admin_fraud') {
      loadAnalytics();
    }
    if (activeTab === 'qualified') {
      loadQualifiedLeads();
    }
    if (activeTab === 'callbacks') {
      loadCallbacks();
    }
    if (activeTab === 'admin_team') {
      fetchSalesTeam();
    }
  }, [activeTab]);

  // --- 4. CAMPAIGNS & LEADS ---
  const fetchCampaigns = async () => {
    try {
      const res = await fetch(`${endpointBase}/campaigns`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.campaigns && data.campaigns.length > 0) {
        setCampaigns(data.campaigns);
        if (!activeCampaign) {
          setActiveCampaign(data.campaigns[0]);
          fetchCampaignLeads(data.campaigns[0].id);
        }
      }
    } catch (e) {
      console.warn('Could not load campaigns:', e);
    }
  };

  const fetchCampaignLeads = async (campaignId: string) => {
    try {
      const res = await fetch(`${endpointBase}/campaigns/${campaignId}/leads`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      if (data.leads && data.leads.length > 0) {
        setLeads(data.leads);
        const firstPendingIdx = data.leads.findIndex((l: Lead) => l.status === 'pending');
        setCurrentLeadIndex(firstPendingIdx !== -1 ? firstPendingIdx : 0);
      }
    } catch (e) {
      console.warn('Could not load leads:', e);
    }
  };

  // --- 5. CSV PARSING & SCHEDULING ---
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    setCampaignTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') + ' Task');

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r\n|\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) {
        showToast('CSV must contain a header and at least one contact row.');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
      let nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('client') || h.includes('contact') || h.includes('customer'));
      let phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('mobile') || h.includes('tel') || h.includes('number') || h.includes('cell'));

      if (phoneIdx === -1) phoneIdx = 1;
      if (nameIdx === -1) nameIdx = 0;

      const parsed: Lead[] = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
        if (row.length > phoneIdx && row[phoneIdx]) {
          const leadName = row[nameIdx] || `Contact #${i}`;
          const leadPhone = row[phoneIdx].replace(/[^\d+]/g, '');
          if (leadPhone.length >= 7) {
            parsed.push({
              name: leadName,
              phone: leadPhone,
              status: 'pending',
              call_count: 0,
            });
          }
        }
      }

      if (parsed.length === 0) {
        showToast('No valid phone numbers found in CSV.');
      } else {
        setParsedLeads(parsed);
        showToast(`Parsed ${parsed.length} contacts from CSV.`);
      }
    };
    reader.readAsText(file);
  };

  const handleScheduleCampaign = async () => {
    if (parsedLeads.length === 0) {
      showToast('Please select a CSV file with contacts first.');
      return;
    }

    setIsUploading(true);
    try {
      const res = await fetch(`${endpointBase}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: campaignTitle.trim() || 'New Outbound Campaign',
          leads: parsedLeads,
        }),
      });

      const data = await res.json();
      if (res.ok && data.campaign) {
        showToast(`Campaign scheduled with ${parsedLeads.length} leads!`);
        setParsedLeads([]);
        setCsvFileName('');
        await fetchCampaigns();
        setActiveTab('queue');
      } else {
        const newCamp: Campaign = {
          id: 'camp_' + Date.now(),
          name: campaignTitle || 'Scheduled Campaign',
          sales_email: currentUserEmail,
          total_leads: parsedLeads.length,
          completed_leads: 0,
          status: 'active',
          created_at: new Date().toISOString(),
        };
        setCampaigns([newCamp, ...campaigns]);
        setActiveCampaign(newCamp);
        setLeads(parsedLeads);
        setCurrentLeadIndex(0);
        setParsedLeads([]);
        setActiveTab('queue');
        showToast(`Campaign ready with ${parsedLeads.length} leads!`);
      }
    } catch (e: any) {
      const newCamp: Campaign = {
        id: 'camp_' + Date.now(),
        name: campaignTitle || 'Scheduled Campaign',
        sales_email: currentUserEmail,
        total_leads: parsedLeads.length,
        completed_leads: 0,
        status: 'active',
        created_at: new Date().toISOString(),
      };
      setCampaigns([newCamp, ...campaigns]);
      setActiveCampaign(newCamp);
      setLeads(parsedLeads);
      setCurrentLeadIndex(0);
      setParsedLeads([]);
      setActiveTab('queue');
      showToast('Campaign ready with leads!');
    } finally {
      setIsUploading(false);
    }
  };

  // --- 6. CALLING ENGINE: DIALER REDIRECTION & TIMER ---
  const handleStartCall = async (leadToCall?: Lead) => {
    const targetLead = leadToCall || leads[currentLeadIndex];
    if (!targetLead) {
      showToast('No pending leads in queue.');
      return;
    }

    // Auto-close any dangling in-progress call if activeCallLogIdRef was already active
    if (activeCallLogIdRef.current && callingState === 'dialing' && callStartTimeRef.current) {
      const prevElapsed = Math.max(1, Math.round((Date.now() - callStartTimeRef.current.getTime()) / 1000));
      fetch(`${endpointBase}/calls/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          callLogId: activeCallLogIdRef.current,
          leadId: activeCallLead?.id,
          phone: activeCallLead?.phone,
          leadName: activeCallLead?.name,
          campaignId: activeCampaign?.id,
          durationSeconds: prevElapsed,
          returnedAt: new Date().toISOString(),
          feedbackStatus: 'Busy / No Answer',
          feedbackNotes: 'Auto-closed on subsequent call dial',
          isQualified: false,
        }),
      }).catch(() => {});
    }

    // Pre-generate guaranteed UUID synchronously so frontend & backend share the exact same ID
    const newCallLogId = crypto.randomUUID();
    activeCallLogIdRef.current = newCallLogId;
    setActiveCallLogId(newCallLogId);

    const now = new Date();
    callStartTimeRef.current = now;
    setCallStartTime(now);
    setCallingState('dialing');
    callDurationRef.current = 0;
    setCallDuration(0);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.max(1, Math.round((Date.now() - now.getTime()) / 1000));
      callDurationRef.current = elapsed;
      setCallDuration(elapsed);
    }, 1000);

    // Persist active lead in dedicated state
    setActiveCallLead(targetLead);

    // Asynchronously dispatch start call logging with shared UUID
    try {
      fetch(`${endpointBase}/calls/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          callLogId: newCallLogId,
          leadId: targetLead.id,
          campaignId: activeCampaign?.id,
          phone: targetLead.phone,
          leadName: targetLead.name,
        }),
      }).catch((e) => console.warn('Start call logging error:', e));
    } catch (e) {}

    // Safely trigger telephone dialer without navigating window.location
    triggerPhoneDial(targetLead.phone);
  };

  // Auto-detect browser return (only if call has been active for at least 4s to prevent instant drop on system dialog)
  useEffect(() => {
    if (callingState !== 'dialing' || !callStartTime) return;

    const handleWindowReturn = () => {
      if (document.visibilityState === 'visible' && callingState === 'dialing' && callStartTimeRef.current) {
        const returnedTime = new Date();
        const durationSec = Math.max(1, Math.round((returnedTime.getTime() - callStartTimeRef.current.getTime()) / 1000));

        // Don't auto-cut on initial micro focus shift (e.g. system Open Phone prompt)
        if (durationSec >= 4) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          callDurationRef.current = durationSec;
          setCallDuration(durationSec);
          setCallingState('feedback');
        }
      }
    };

    window.addEventListener('focus', handleWindowReturn);
    document.addEventListener('visibilitychange', handleWindowReturn);

    return () => {
      window.removeEventListener('focus', handleWindowReturn);
      document.removeEventListener('visibilitychange', handleWindowReturn);
    };
  }, [callingState, callStartTime]);

  const handleManualCutCall = () => {
    if (callStartTimeRef.current) {
      const returnedTime = new Date();
      const durationSec = Math.max(1, Math.round((returnedTime.getTime() - callStartTimeRef.current.getTime()) / 1000));
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      callDurationRef.current = durationSec;
      setCallDuration(durationSec);
      setCallingState('feedback');
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setCallingState('feedback');
    }
  };

  // --- 7. SUBMIT POST-CALL FEEDBACK ---
  const handleSubmitFeedback = async () => {
    const leadToSubmit = activeCallLead || leads[currentLeadIndex];
    if (!leadToSubmit) {
      setCallingState('idle');
      return;
    }

    if (feedbackStatus === 'Call Back' && !callbackTime) {
      showToast('⚠️ Please select a date and time for the scheduled callback!');
      return;
    }

    setIsSubmittingFeedback(true);
    const isQualified = feedbackStatus === 'Qualified Lead';

    // Compute duration from ref, state, or timestamp fallback (never 0)
    const finalDuration = Math.max(
      1,
      callDurationRef.current ||
      callDuration ||
      (callStartTimeRef.current ? Math.round((Date.now() - callStartTimeRef.current.getTime()) / 1000) : 1)
    );

    const logIdToUse = activeCallLogIdRef.current || activeCallLogId || crypto.randomUUID();

    try {
      await fetch(`${endpointBase}/calls/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          callLogId: logIdToUse,
          leadId: leadToSubmit.id,
          campaignId: activeCampaign?.id,
          phone: leadToSubmit.phone,
          leadName: leadToSubmit.name,
          durationSeconds: finalDuration,
          returnedAt: new Date().toISOString(),
          feedbackStatus,
          feedbackNotes,
          isQualified,
          callbackAt: callbackTime || null,
        }),
      });

      const updatedLeads = [...leads];
      const targetIdx = leads.findIndex((l) => (l.id && l.id === leadToSubmit.id) || l.phone === leadToSubmit.phone);
      const indexToUpdate = targetIdx !== -1 ? targetIdx : currentLeadIndex;

      if (updatedLeads[indexToUpdate]) {
        updatedLeads[indexToUpdate] = {
          ...updatedLeads[indexToUpdate],
          status: 'called',
          call_count: (updatedLeads[indexToUpdate].call_count || 0) + 1,
        };
        setLeads(updatedLeads);
      }

      if (feedbackStatus === 'Call Back' && callbackTime) {
        requestNotificationPermission();
        showToast('📅 Callback scheduled! Email confirmation sent.');
        loadCallbacks();
      } else {
        showToast(isQualified ? '🌟 Added to Qualified Leads vault!' : 'Call log saved');
      }

      setFeedbackNotes('');
      setCallbackTime('');
      setFeedbackStatus('Qualified Lead');
      setActiveCallLead(null);
      activeCallLogIdRef.current = null;
      setActiveCallLogId(null);
      callDurationRef.current = 0;
      setCallingState('idle');

      // Refresh background analytics & qualified list
      loadAnalytics();
      if (isQualified) loadQualifiedLeads();

      const nextPendingIndex = updatedLeads.findIndex((l, idx) => idx > indexToUpdate && l.status === 'pending');
      if (nextPendingIndex !== -1) {
        setCurrentLeadIndex(nextPendingIndex);
      } else {
        const anyPendingIndex = updatedLeads.findIndex((l) => l.status === 'pending');
        if (anyPendingIndex !== -1) {
          setCurrentLeadIndex(anyPendingIndex);
        } else {
          showToast('🎉 All leads in this campaign have been dialed!');
        }
      }
    } catch (err: any) {
      showToast('Saved call record locally.');
      setActiveCallLead(null);
      activeCallLogIdRef.current = null;
      setActiveCallLogId(null);
      setCallingState('idle');
      if (currentLeadIndex < leads.length - 1) {
        setCurrentLeadIndex(currentLeadIndex + 1);
      }
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const s = Math.max(0, parseInt(sec as any, 10) || 0);
    const mins = Math.floor(s / 60);
    const remainder = s % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const exportQualifiedLeadsCSV = () => {
    if (qualifiedLeadsList.length === 0) {
      showToast('No qualified leads to export.');
      return;
    }
    const headers = isAdmin
      ? ['Name', 'Phone', 'Duration (sec)', 'Sales Rep', 'Notes', 'Date Qualified']
      : ['Name', 'Phone', 'Sales Rep', 'Notes', 'Date Qualified'];
    const rows = qualifiedLeadsList.map((q) => {
      const row = [
        `"${q.name.replace(/"/g, '""')}"`,
        `"${q.phone}"`,
      ];
      if (isAdmin) {
        row.push(String(q.duration_seconds ?? 0));
      }
      row.push(
        `"${q.sales_email}"`,
        `"${(q.notes || '').replace(/"/g, '""')}"`,
        `"${new Date(q.created_at).toLocaleDateString()}"`
      );
      return row;
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Certifyied_Qualified_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Qualified leads exported successfully!');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsAppInstalled(true);
          showToast('App installed successfully to Home Screen!');
        }
        setDeferredPrompt(null);
      } catch (e) {
        setShowInstallSheet(true);
      }
    } else {
      setShowInstallSheet(true);
    }
  };

  const renderInstallModal = () => {
    if (!showInstallSheet) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="apple-glass-white max-w-md w-full rounded-3xl p-6 border border-black/10 shadow-2xl bg-white/95 text-[#1d1d1f] animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#0071e3]">
              {isIOS ? <Smartphone className="w-6 h-6" /> : <Download className="w-6 h-6" />}
            </div>
            <button
              onClick={() => setShowInstallSheet(false)}
              className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-lg font-bold text-[#1d1d1f] tracking-tight">
            {isIOS ? 'Add to iPhone Home Screen' : 'Install Autodialer App'}
          </h3>
          <p className="text-xs text-[#86868b] mt-1.5 leading-relaxed">
            {isIOS
              ? 'Install directly on your iPhone home screen for instant single-tap launch, standalone fullscreen workflow, and quick dialing:'
              : 'Install Certifyied Autodialer on your device for single-click access and fullscreen workflow:'}
          </p>

          {isIOS ? (
            <div className="mt-4 space-y-2.5 text-xs text-zinc-700">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0 mt-0.5">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#1d1d1f] font-semibold mb-0.5">1. Tap the Share Button</strong>
                  <span className="text-zinc-500">In Safari, tap the <strong>Share icon</strong> (box with arrow pointing up) at the bottom of your screen.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0 mt-0.5">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#1d1d1f] font-semibold mb-0.5">2. Tap "Add to Home Screen"</strong>
                  <span className="text-zinc-500">Scroll down in the menu and tap <strong>Add to Home Screen</strong>.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-black/5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-[#1d1d1f] font-semibold mb-0.5">3. Tap "Add"</strong>
                  <span className="text-zinc-500">Tap <strong>Add</strong> in the top-right corner. The Autodialer app icon will appear on your iPhone!</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-2.5 text-xs text-zinc-700">
              {deferredPrompt ? (
                <button
                  onClick={async () => {
                    try {
                      deferredPrompt.prompt();
                      const { outcome } = await deferredPrompt.userChoice;
                      if (outcome === 'accepted') {
                        setIsAppInstalled(true);
                        showToast('Autodialer App installed successfully!');
                        setShowInstallSheet(false);
                      }
                      setDeferredPrompt(null);
                    } catch (e) {}
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] active:scale-98 text-white font-medium text-sm transition-all shadow-md shadow-[#0071e3]/25 flex items-center justify-center gap-2 mb-3"
                >
                  <Download className="w-4 h-4" />
                  <span>Install App Directly</span>
                </button>
              ) : null}

              <div className="p-3 rounded-2xl bg-zinc-50 border border-black/5 flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center font-bold text-[10px]">1</span>
                <span>In Google Chrome, click the <strong>Install icon</strong> in the address bar or the 3-dot menu.</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-black/5 flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center font-bold text-[10px]">2</span>
                <span>On Android: tap the menu → <strong>Install App</strong> or <strong>Add to Home Screen</strong>.</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowInstallSheet(false)}
            className="mt-5 w-full py-3 px-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-[#1d1d1f] font-medium text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const renderInstallBanner = () => {
    if (isAppInstalled || installBannerDismissed) return null;
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300">
        <div className="apple-glass-white bg-white/95 rounded-3xl p-4 border border-black/10 shadow-2xl flex items-center justify-between gap-3 text-[#1d1d1f]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#0071e3] flex items-center justify-center text-white shrink-0 shadow-md shadow-[#0071e3]/20">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#1d1d1f] truncate">Install Autodialer App</h4>
              <p className="text-[11px] text-[#86868b] truncate">
                {isIOS ? 'Add to iPhone Home Screen for 1-tap dialer' : 'Install for fullscreen calling workstation'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="py-2 px-3.5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              {isIOS ? <Share2 className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isIOS ? 'Add to Home' : 'Install'}</span>
            </button>
            <button
              onClick={() => {
                setInstallBannerDismissed(true);
                try {
                  sessionStorage.setItem('autodialer_install_dismissed', 'true');
                } catch (e) {}
              }}
              className="w-8 h-8 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- RENDER LOADING SCREEN ---
  if (isVerifyingMagicToken) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-apple flex flex-col justify-center items-center px-4">
        <div className="apple-glass-white rounded-3xl p-8 border border-black/10 shadow-xl max-w-sm w-full text-center bg-white/95">
          <RefreshCw className="w-8 h-8 text-[#0071e3] animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#1d1d1f]">Verifying Magic Link...</h2>
          <p className="text-xs text-[#86868b] mt-2">Checking authorization credentials.</p>
        </div>
      </div>
    );
  }

  // --- RENDER LOGIN VIEW ---
  if (!authToken) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-apple flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#0071e3] selection:text-white">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#0071e3]/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <a href="/" className="inline-block focus:outline-none">
                <img
                  src="/certifyied_logo.png"
                  alt="Certifyied"
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </a>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">Autodialer</h1>
            <p className="text-sm text-[#86868b] mt-1 font-normal">Magic Link Login</p>
          </div>

          {magicLinkSentTo ? (
            <div className="apple-glass-white rounded-3xl p-8 border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white/95 text-center animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-[#0071e3]/10 text-[#0071e3] border border-[#0071e3]/20 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Check Your Inbox</h3>
              <p className="text-xs text-[#86868b] mt-2 leading-relaxed">
                We sent a secure Magic Login link to:
              </p>
              <div className="my-3 py-2 px-3 rounded-xl bg-zinc-100 border border-black/5 text-xs font-mono font-semibold text-[#0071e3]">
                {magicLinkSentTo}
              </div>
              <p className="text-[11px] text-[#86868b]">
                Click the link in your email to log in automatically. The link expires in 15 minutes.
              </p>

              {devMagicLink && (
                <div className="mt-5 p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-left">
                  <div className="flex items-center gap-1.5 text-blue-800 mb-1">
                    <Zap className="w-4 h-4 text-[#0071e3]" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Instant Access</span>
                  </div>
                  <p className="text-xs text-blue-700/90 mb-3 leading-relaxed">
                    Email dispatched! You can also enter the Autodialer immediately with one click:
                  </p>
                  <a
                    href={devMagicLink}
                    className="w-full py-3 px-4 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.98] text-white font-medium text-xs transition-all shadow-md shadow-[#0071e3]/25 flex items-center justify-center gap-2"
                  >
                    <span>Enter Autodialer Instantly</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-black/10 flex flex-col gap-2">
                <button
                  onClick={() => setMagicLinkSentTo(null)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-700 transition-all"
                >
                  Use a Different Email
                </button>
              </div>
            </div>
          ) : (
            <div className="apple-glass-white rounded-3xl p-8 border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white/95">
              {authError && (
                <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSendMagicLink} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-2">
                    Email ID
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. rep@certifyied.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 border border-black/10 rounded-2xl text-sm text-[#1d1d1f] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.98] text-white font-medium text-sm transition-all duration-200 shadow-md shadow-[#0071e3]/20 flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Send Magic Login Link</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
        {renderInstallBanner()}
        {renderInstallModal()}
      </div>
    );
  }

  const currentLead = activeCallLead || leads[currentLeadIndex] || (leads.length > 0 ? leads[0] : null);
  const pendingLeadsCount = leads.filter((l) => l.status === 'pending').length;

  // Filter flagged logs for fraud ledger tab
  const filteredRecentCalls = recentCallLogs.filter((log) => {
    if (fraudLedgerFilter === 'flagged') return log.is_flagged;
    if (fraudLedgerFilter === 'spoof') return log.fraud_flags?.some((f) => f.code === 'INSTANT_QUALIFIED_SPOOF');
    if (fraudLedgerFilter === 'ghost') return log.fraud_flags?.some((f) => f.code === 'GHOST_CALL');
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-apple flex flex-col selection:bg-[#0071e3] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="apple-glass-white bg-white/95 px-5 py-3 rounded-2xl border border-black/10 shadow-2xl flex items-center gap-2.5 text-sm text-[#1d1d1f]">
            <Sparkles className="w-4 h-4 text-[#0071e3]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* PWA Install Banner & Device Guide Modal */}
      {renderInstallBanner()}
      {renderInstallModal()}

      {/* --- APPLE TOP NAVIGATION BAR --- */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-black/10 px-6 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center focus:outline-none" title="Certifyied Home">
              <img
                src="/certifyied_logo.png"
                alt="Certifyied"
                className="h-7 sm:h-8 w-auto object-contain"
              />
            </a>
          </div>

          {/* Center Segmented Control */}
          <div className="hidden lg:flex items-center bg-zinc-100/90 p-1 rounded-2xl border border-black/5 shadow-inner">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setActiveTab('admin_overview')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'admin_overview'
                      ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                      : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[#0071e3]" />
                  Team Overview
                </button>
                <button
                  onClick={() => setActiveTab('admin_fraud')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'admin_fraud'
                      ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                      : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                  Fraud & Integrity
                  {fraudTelemetry && fraudTelemetry.highRiskRepsCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('qualified')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'qualified'
                      ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                      : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  Qualified Leads
                </button>
                <button
                  onClick={() => setActiveTab('admin_team')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'admin_team'
                      ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                      : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-zinc-700" />
                  Sales Team
                </button>
                <button
                  onClick={() => { setActiveTab('callbacks'); loadCallbacks(); }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'callbacks'
                      ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                      : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Callbacks
                  {callbacksList.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                      {callbacksList.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'queue'
                      ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold'
                      : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Dialer Queue
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('queue')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'queue' ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold' : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  Dialer Queue
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'upload' ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold' : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload CSV
                </button>
                <button
                  onClick={() => setActiveTab('qualified')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'qualified' ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold' : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  My Qualified Leads
                </button>
                <button
                  onClick={() => { setActiveTab('callbacks'); loadCallbacks(); }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'callbacks' ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold' : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  Callbacks
                  {callbacksList.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                      {callbacksList.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeTab === 'analytics' ? 'bg-white text-[#1d1d1f] shadow-sm font-semibold' : 'text-zinc-500 hover:text-[#1d1d1f]'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  My Performance
                </button>
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {!isAppInstalled && (
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 rounded-2xl bg-white hover:bg-zinc-50 border border-black/10 text-xs text-zinc-700 font-medium flex items-center gap-1.5 transition-all shadow-sm"
                title={isIOS ? 'Add to iPhone Home Screen' : 'Install PWA App'}
              >
                {isIOS ? <Share2 className="w-3.5 h-3.5 text-[#0071e3]" /> : <Download className="w-3.5 h-3.5 text-[#0071e3]" />}
                <span className="hidden sm:inline">{isIOS ? 'Add to Home' : 'Install App'}</span>
              </button>
            )}

            <div className="h-6 w-px bg-black/10" />

            <div className="flex items-center gap-2">
              <div className="text-right hidden sm:block">
                <div className="text-xs text-[#1d1d1f] font-medium">{currentUserEmail}</div>
                {isAdmin && (
                  <div className="text-[10px] text-purple-600 font-medium uppercase tracking-wide">Admin</div>
                )}
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="w-8 h-8 rounded-full bg-white hover:bg-red-50 hover:text-red-600 border border-black/10 flex items-center justify-center text-zinc-500 transition-colors shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden items-center justify-around mt-2.5 pt-2 border-t border-black/5 overflow-x-auto">
          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('admin_overview')}
                className={`text-xs font-medium py-1 px-2 whitespace-nowrap ${
                  activeTab === 'admin_overview' ? 'text-[#0071e3] font-semibold' : 'text-zinc-500'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('admin_fraud')}
                className={`text-xs font-medium py-1 px-2 whitespace-nowrap ${
                  activeTab === 'admin_fraud' ? 'text-red-600 font-semibold' : 'text-zinc-500'
                }`}
              >
                Fraud Engine
              </button>
              <button
                onClick={() => setActiveTab('qualified')}
                className={`text-xs font-medium py-1 px-2 whitespace-nowrap ${
                  activeTab === 'qualified' ? 'text-amber-600 font-semibold' : 'text-zinc-500'
                }`}
              >
                Qualified
              </button>
              <button
                onClick={() => { setActiveTab('callbacks'); loadCallbacks(); }}
                className={`text-xs font-medium py-1 px-2 whitespace-nowrap flex items-center gap-1 ${
                  activeTab === 'callbacks' ? 'text-blue-600 font-semibold' : 'text-zinc-500'
                }`}
              >
                Callbacks {callbacksList.length > 0 && `(${callbacksList.length})`}
              </button>
              <button
                onClick={() => setActiveTab('admin_team')}
                className={`text-xs font-medium py-1 px-2 whitespace-nowrap ${
                  activeTab === 'admin_team' ? 'text-[#0071e3] font-semibold' : 'text-zinc-500'
                }`}
              >
                Team
              </button>
              <button
                onClick={() => setActiveTab('queue')}
                className={`text-xs font-medium py-1 px-2 whitespace-nowrap ${
                  activeTab === 'queue' ? 'text-[#0071e3] font-semibold' : 'text-zinc-500'
                }`}
              >
                Dialer
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('queue')}
                className={`text-xs font-medium py-1 px-2 ${activeTab === 'queue' ? 'text-[#0071e3] font-semibold' : 'text-zinc-500'}`}
              >
                Queue
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`text-xs font-medium py-1 px-2 ${activeTab === 'upload' ? 'text-[#0071e3] font-semibold' : 'text-zinc-500'}`}
              >
                Upload
              </button>
              <button
                onClick={() => setActiveTab('qualified')}
                className={`text-xs font-medium py-1 px-2 ${activeTab === 'qualified' ? 'text-amber-600 font-semibold' : 'text-zinc-500'}`}
              >
                Qualified
              </button>
              <button
                onClick={() => { setActiveTab('callbacks'); loadCallbacks(); }}
                className={`text-xs font-medium py-1 px-2 flex items-center gap-1 ${
                  activeTab === 'callbacks' ? 'text-blue-600 font-semibold' : 'text-zinc-500'
                }`}
              >
                Callbacks {callbacksList.length > 0 && `(${callbacksList.length})`}
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`text-xs font-medium py-1 px-2 ${activeTab === 'analytics' ? 'text-[#0071e3] font-semibold' : 'text-zinc-500'}`}
              >
                My Stats
              </button>
            </>
          )}
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* ======================================================== */}
        {/* SALES REP VIEW: PERSONAL STATS TOP BANNER                */}
        {/* ======================================================== */}
        {!isAdmin && activeTab === 'queue' && (
          <div className="mb-6 bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-[#86868b] font-semibold">
                My Calling Workstation
              </span>
              <span className="text-xs text-[#0071e3] font-medium flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                Live Session
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] text-[#86868b] uppercase tracking-wider block">My Calls</span>
                <span className="text-xl font-bold text-[#1d1d1f]">{analyticsStats?.totalCalls || 0}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] text-[#86868b] uppercase tracking-wider block">Connected Leads</span>
                <span className="text-xl font-bold text-emerald-600">
                  {analyticsStats?.connectedCalls ?? (
                    Math.max(0, (analyticsStats?.totalCalls || 0) - (feedbackBreakdown['Busy / No Answer'] || 0) - (feedbackBreakdown['Wrong Number'] || 0))
                  )}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/50">
                <span className="text-[10px] text-emerald-800 uppercase tracking-wider block">Qualified</span>
                <span className="text-xl font-bold text-emerald-600">{analyticsStats?.totalQualified || 0}</span>
              </div>
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <span className="text-[10px] text-[#86868b] uppercase tracking-wider block">Conversion</span>
                <span className="text-xl font-bold text-[#0071e3]">{analyticsStats?.conversionRate || 0}%</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: ADMIN OVERVIEW & REP DRILL-DOWN                     */}
        {/* ======================================================== */}
        {isAdmin && activeTab === 'admin_overview' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-[#0071e3]" />
                  Sales Team Operations & Rep Drill-down
                </h2>
                <p className="text-xs text-[#86868b] mt-1">
                  Overall team calling telemetry with drill-down into individual sales rep metrics.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Date Filter Preset Selector */}
                <div className="relative">
                  <div className="flex items-center gap-1.5 bg-white border border-black/10 rounded-2xl px-3 py-2 text-xs text-[#1d1d1f] shadow-sm font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#0071e3]" />
                    <select
                      value={dateFilter}
                      onChange={(e) => {
                        const newDf = e.target.value as any;
                        setDateFilter(newDf);
                        if (newDf === 'custom') {
                          setShowCustomDatePicker(true);
                        } else {
                          setShowCustomDatePicker(false);
                          loadAnalytics(selectedRepFilter, newDf);
                        }
                      }}
                      aria-label="Filter analytics by date range"
                      className="bg-transparent text-xs text-[#1d1d1f] font-medium focus:outline-none cursor-pointer pr-1"
                    >
                      <option value="all">📅 All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="7d">Last 7 Days</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="month">This Month</option>
                      <option value="custom">Custom Range...</option>
                    </select>
                  </div>

                  {/* Custom Date Range Popover */}
                  {showCustomDatePicker && (
                    <div className="absolute right-0 top-full mt-2 z-40 bg-white rounded-2xl p-4 border border-black/10 shadow-2xl flex flex-col sm:flex-row items-center gap-3 min-w-[320px]">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-[11px] text-[#86868b] font-medium">From:</span>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                        />
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-[11px] text-[#86868b] font-medium">To:</span>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                        />
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomDatePicker(false);
                            loadAnalytics(selectedRepFilter, 'custom', customStartDate, customEndDate);
                          }}
                          className="py-1.5 px-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Apply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCustomDatePicker(false);
                            setDateFilter('all');
                            loadAnalytics(selectedRepFilter, 'all');
                          }}
                          className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Rep Filter Selector */}
                <div className="relative">
                  <select
                    value={selectedRepFilter}
                    onChange={(e) => {
                      const rep = e.target.value;
                      setSelectedRepFilter(rep);
                      loadAnalytics(rep, dateFilter);
                    }}
                    aria-label="Filter analytics by sales rep"
                    className="bg-white border border-black/10 rounded-2xl px-3.5 py-2 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3] shadow-sm font-medium"
                  >
                    <option value="all">Overall Team ({repLeaderboard.length} Reps)</option>
                    {repLeaderboard.map((r) => (
                      <option key={r.email} value={r.email}>
                        Rep: {r.email} ({r.totalCalls} calls)
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => loadAnalytics(selectedRepFilter, dateFilter)}
                  className="px-3 py-2 rounded-2xl bg-white border border-black/10 text-xs text-zinc-700 hover:bg-zinc-50 font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {(selectedRepFilter !== 'all' || dateFilter !== 'all') && (
              <div className="p-3.5 rounded-2xl bg-[#0071e3]/10 border border-[#0071e3]/20 flex flex-wrap items-center justify-between gap-2 text-xs text-[#0071e3]">
                <div className="flex items-center gap-3">
                  <Filter className="w-4 h-4 shrink-0" />
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedRepFilter !== 'all' && (
                      <span className="px-2.5 py-1 rounded-xl bg-white border border-[#0071e3]/20 font-medium">
                        Rep: <strong>{selectedRepFilter}</strong>
                      </span>
                    )}
                    {dateFilter !== 'all' && (
                      <span className="px-2.5 py-1 rounded-xl bg-white border border-[#0071e3]/20 font-medium">
                        Date: <strong>{dateFilter === 'custom' ? `${customStartDate || 'Start'} → ${customEndDate || 'End'}` : dateFilter.toUpperCase()}</strong>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedRepFilter('all');
                    setDateFilter('all');
                    setShowCustomDatePicker(false);
                    loadAnalytics('all', 'all');
                  }}
                  className="px-3 py-1 rounded-xl bg-white text-[#0071e3] font-semibold hover:bg-zinc-50 shadow-sm transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>{selectedRepFilter === 'all' ? 'Total Calls' : 'Rep Calls'}</span>
                  <PhoneCall className="w-4 h-4 text-[#0071e3]" />
                </div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {analyticsStats?.totalCalls || 0}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Outbound dials completed</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Total Talk Time</span>
                  <Clock className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight font-mono">
                  {formatSeconds(analyticsStats?.totalDurationSeconds || 0)}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Cumulative duration</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Avg Duration</span>
                  <BarChart3 className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight font-mono">
                  {formatSeconds(analyticsStats?.avgDurationSeconds || 0)}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Avg length per call</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Qualified Leads</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 tracking-tight">
                  {analyticsStats?.totalQualified || 0}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">
                  {analyticsStats?.conversionRate || 0}% conversion
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Sales Reps</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 tracking-tight">
                  {repLeaderboard.length}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Active team members</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
                    Sales Rep Performance & Integrity Leaderboard
                  </h3>
                  <p className="text-xs text-[#86868b]">Individual stats and fraud risk index per sales rep</p>
                </div>
                <span className="text-xs text-[#86868b] font-medium">{repLeaderboard.length} Reps Ranked</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-[#86868b] uppercase tracking-wider text-[10px] font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Sales Rep</th>
                      <th className="py-3 px-4">Calls Dialed</th>
                      <th className="py-3 px-4">Total Talk Time</th>
                      <th className="py-3 px-4">Avg Call</th>
                      <th className="py-3 px-4">Qualified</th>
                      <th className="py-3 px-4">Conversion</th>
                      <th className="py-3 px-4">Fraud Risk Score</th>
                      <th className="py-3 px-4">Integrity Status</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {repLeaderboard.map((rep) => {
                      const isSelected = selectedRepFilter.toLowerCase() === rep.email.toLowerCase();
                      return (
                        <tr
                          key={rep.email}
                          className={`hover:bg-zinc-50 transition-colors ${isSelected ? 'bg-[#0071e3]/5' : ''}`}
                        >
                          <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
                              <span>{rep.email}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#1d1d1f]">{rep.totalCalls}</td>
                          <td className="py-3.5 px-4 font-mono">{formatSeconds(rep.totalDurationSeconds)}</td>
                          <td className="py-3.5 px-4 font-mono">{formatSeconds(rep.avgDurationSeconds)}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600">{rep.qualifiedCount}</td>
                          <td className="py-3.5 px-4 font-semibold">{rep.conversionRate}%</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-zinc-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    rep.fraudScore >= 60
                                      ? 'bg-red-500'
                                      : rep.fraudScore >= 35
                                      ? 'bg-orange-500'
                                      : rep.fraudScore >= 15
                                      ? 'bg-amber-500'
                                      : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.max(5, rep.fraudScore)}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-mono text-[#86868b]">{rep.fraudScore}/100</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                rep.riskLevel === 'critical'
                                  ? 'bg-red-100 text-red-800 border-red-300'
                                  : rep.riskLevel === 'high'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : rep.riskLevel === 'moderate'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {rep.riskLevel.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => {
                                setSelectedRepFilter(rep.email);
                                loadAnalytics(rep.email);
                              }}
                              className="px-2.5 py-1 rounded-xl bg-zinc-100 hover:bg-[#0071e3] hover:text-white text-zinc-700 font-medium text-[11px] transition-all"
                            >
                              Drill Down
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {repLeaderboard.length === 0 && (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-zinc-400 text-xs">
                          No sales rep activity recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-4">
                Call Outcome Categorization
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(feedbackBreakdown).map(([status, count]) => (
                  <div
                    key={status}
                    className="px-3.5 py-2 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-2 text-xs"
                  >
                    <span className="text-zinc-700 font-medium">{status}:</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-bold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">Recent Outbound Calls</h3>
                <span className="text-xs text-[#86868b]">Showing latest activity</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-[#86868b] uppercase tracking-wider text-[10px] font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Sales Rep</th>
                      <th className="py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {recentCallLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#1d1d1f]">{log.lead_name}</td>
                        <td className="py-3 px-4 font-mono text-zinc-600">{log.phone}</td>
                        <td className="py-3 px-4 font-mono text-emerald-600 font-medium">
                          {log.duration_seconds && log.duration_seconds > 0 ? (
                            formatSeconds(log.duration_seconds)
                          ) : log.returned_at && log.redirected_at ? (
                            formatSeconds(Math.max(1, Math.round((new Date(log.returned_at).getTime() - new Date(log.redirected_at).getTime()) / 1000)))
                          ) : (
                            <span className="text-zinc-400 font-normal">00:00 (Incomplete)</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              log.is_qualified
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                            }`}
                          >
                            {log.feedback_status || 'Called'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#86868b]">{log.sales_email}</td>
                        <td className="py-3 px-4 max-w-xs truncate text-zinc-600">{log.feedback_notes || '—'}</td>
                      </tr>
                    ))}
                    {recentCallLogs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-zinc-400 text-xs">
                          No calls recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: ADMIN FRAUD & INTEGRITY AUDIT ENGINE                */}
        {/* ======================================================== */}
        {isAdmin && activeTab === 'admin_fraud' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                  Intelligent Sales Rep Fraud & Integrity Engine
                </h2>
                <p className="text-xs text-[#86868b] mt-1">
                  Automated heuristics detecting micro-calls, ghost dialing, instant lead spoofing, and repetitive scripts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-white border border-black/10 rounded-2xl px-3 py-2 text-xs text-[#1d1d1f] shadow-sm font-medium">
                  <Calendar className="w-3.5 h-3.5 text-red-600" />
                  <select
                    value={dateFilter}
                    onChange={(e) => {
                      const newDf = e.target.value as any;
                      setDateFilter(newDf);
                      loadAnalytics(selectedRepFilter, newDf);
                    }}
                    aria-label="Filter fraud analysis by date"
                    className="bg-transparent text-xs text-[#1d1d1f] font-medium focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="all">📅 All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <button
                  onClick={() => loadAnalytics(selectedRepFilter, dateFilter)}
                  className="px-3 py-2 rounded-2xl bg-white border border-black/10 text-xs text-zinc-700 hover:bg-zinc-50 font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
                  Re-analyze Logs
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm">
              <span className="text-xs uppercase tracking-wider text-[#86868b] font-semibold block mb-3">
                Active Algorithmic Fraud Heuristics
              </span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60">
                  <div className="flex items-center gap-2 font-bold text-amber-800 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Ghost Micro-Calls (≤ 3s)</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Calls immediately aborted in ≤ 3 seconds to artificially inflate dialed numbers count.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/60">
                  <div className="flex items-center gap-2 font-bold text-red-800 mb-1">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Instant Qualified Spoof (&lt; 12s)</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Leads marked as "Qualified Lead" with &lt; 12s duration, which is statistically impossible for genuine qualification.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/60">
                  <div className="flex items-center gap-2 font-bold text-purple-800 mb-1">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span>Rapid Burst Velocity</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    3 or more phone numbers clicked within 60 seconds with micro durations, indicating spoof clicking.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/60">
                  <div className="flex items-center gap-2 font-bold text-blue-800 mb-1">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Repetitive Notes</span>
                  </div>
                  <p className="text-zinc-600 text-[11px] leading-relaxed">
                    Exact verbatim notes pasted across multiple leads without real conversation notes.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>High-Risk Reps</span>
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 tracking-tight">
                  {fraudTelemetry?.highRiskRepsCount || 0}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Reps exceeding risk threshold</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Total Flagged Calls</span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-bold text-amber-600 tracking-tight">
                  {fraudTelemetry?.totalFlaggedCalls || 0}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Calls with integrity violations</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Ghost Micro-Calls</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {fraudTelemetry?.ghostCallsCount || 0}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Calls aborted in ≤ 3 seconds</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Instant Spoofs</span>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600 tracking-tight">
                  {fraudTelemetry?.instantSpoofsCount || 0}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Qualified in &lt; 12 seconds</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-zinc-200">
                <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
                  Rep Risk Indices & Fraud Scoreboard
                </h3>
                <p className="text-xs text-[#86868b]">
                  Calculated score (0 - 100) weighting instant qualified spoofs, ghost call ratios, and dialing bursts.
                </p>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {repLeaderboard.map((rep) => (
                  <div
                    key={rep.email}
                    className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-xs text-[#1d1d1f] truncate pr-2">{rep.email}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            rep.riskLevel === 'critical'
                              ? 'bg-red-100 text-red-800 border-red-300'
                              : rep.riskLevel === 'high'
                              ? 'bg-orange-100 text-orange-800 border-orange-300'
                              : rep.riskLevel === 'moderate'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {rep.riskLevel}
                        </span>
                      </div>

                      <div className="my-3">
                        <div className="flex items-center justify-between text-xs text-zinc-600 mb-1">
                          <span>Fraud Risk Score</span>
                          <span className="font-mono font-bold text-[#1d1d1f]">{rep.fraudScore} / 100</span>
                        </div>
                        <div className="w-full bg-zinc-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              rep.fraudScore >= 60
                                ? 'bg-red-500'
                                : rep.fraudScore >= 35
                                ? 'bg-orange-500'
                                : rep.fraudScore >= 15
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(5, rep.fraudScore)}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-[11px] mt-3 pt-3 border-t border-zinc-200">
                        <div>
                          <span className="text-[#86868b] block text-[10px]">Ghost Calls</span>
                          <span className="font-bold text-amber-700">{rep.ghostCalls}</span>
                        </div>
                        <div>
                          <span className="text-[#86868b] block text-[10px]">Instant Spoofs</span>
                          <span className="font-bold text-red-700">{rep.instantSpoofs}</span>
                        </div>
                        <div>
                          <span className="text-[#86868b] block text-[10px]">Total Calls</span>
                          <span className="font-bold text-[#1d1d1f]">{rep.totalCalls}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight">
                    Flagged Call Telemetry Ledger
                  </h3>
                  <p className="text-xs text-[#86868b]">Specific calls that triggered algorithmic integrity rules</p>
                </div>

                <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-2xl border border-black/5 text-xs">
                  <button
                    onClick={() => setFraudLedgerFilter('flagged')}
                    className={`px-3 py-1 rounded-xl transition-all ${
                      fraudLedgerFilter === 'flagged' ? 'bg-white font-semibold shadow-sm text-[#1d1d1f]' : 'text-zinc-600'
                    }`}
                  >
                    All Flagged
                  </button>
                  <button
                    onClick={() => setFraudLedgerFilter('spoof')}
                    className={`px-3 py-1 rounded-xl transition-all ${
                      fraudLedgerFilter === 'spoof' ? 'bg-white font-semibold shadow-sm text-red-600' : 'text-zinc-600'
                    }`}
                  >
                    Instant Spoofs
                  </button>
                  <button
                    onClick={() => setFraudLedgerFilter('ghost')}
                    className={`px-3 py-1 rounded-xl transition-all ${
                      fraudLedgerFilter === 'ghost' ? 'bg-white font-semibold shadow-sm text-amber-600' : 'text-zinc-600'
                    }`}
                  >
                    Ghost Calls
                  </button>
                  <button
                    onClick={() => setFraudLedgerFilter('all')}
                    className={`px-3 py-1 rounded-xl transition-all ${
                      fraudLedgerFilter === 'all' ? 'bg-white font-semibold shadow-sm text-[#1d1d1f]' : 'text-zinc-600'
                    }`}
                  >
                    All Calls
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-[#86868b] uppercase tracking-wider text-[10px] font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Sales Rep</th>
                      <th className="py-3 px-4">Lead</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Duration</th>
                      <th className="py-3 px-4">Outcome</th>
                      <th className="py-3 px-4">Detected Violations</th>
                      <th className="py-3 px-4">Notes</th>
                      <th className="py-3 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {filteredRecentCalls.map((log) => (
                      <tr
                        key={log.id}
                        className={`hover:bg-zinc-50 transition-colors ${
                          log.risk_severity === 'critical'
                            ? 'bg-red-50/40'
                            : log.risk_severity === 'high'
                            ? 'bg-orange-50/30'
                            : log.risk_severity === 'medium'
                            ? 'bg-amber-50/20'
                            : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">{log.sales_email}</td>
                        <td className="py-3.5 px-4 font-medium text-zinc-800">{log.lead_name}</td>
                        <td className="py-3.5 px-4 font-mono text-zinc-600">{log.phone}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                              log.duration_seconds <= 3
                                ? 'bg-red-100 text-red-700'
                                : log.duration_seconds < 12 && log.is_qualified
                                ? 'bg-red-100 text-red-700'
                                : 'text-emerald-700'
                            }`}
                          >
                            {formatSeconds(log.duration_seconds)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              log.is_qualified
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                            }`}
                          >
                            {log.feedback_status || 'Called'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {log.fraud_flags && log.fraud_flags.length > 0 ? (
                              log.fraud_flags.map((flag, idx) => (
                                <span
                                  key={idx}
                                  title={flag.description}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                    flag.severity === 'critical'
                                      ? 'bg-red-100 text-red-800 border-red-300'
                                      : flag.severity === 'high'
                                      ? 'bg-orange-100 text-orange-800 border-orange-300'
                                      : 'bg-amber-100 text-amber-800 border-amber-300'
                                  }`}
                                >
                                  {flag.label}
                                </span>
                              ))
                            ) : (
                              <span className="text-zinc-400 text-[11px]">Clean</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-zinc-600">{log.feedback_notes || '—'}</td>
                        <td className="py-3.5 px-4 text-[#86868b] text-[11px] whitespace-nowrap">
                          {log.created_at ? new Date(log.created_at).toLocaleTimeString() : '—'}
                        </td>
                      </tr>
                    ))}

                    {filteredRecentCalls.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-zinc-400 text-xs">
                          No calls match the selected filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: ADMIN SALES TEAM DATABASE DIRECTORY                 */}
        {/* ======================================================== */}
        {isAdmin && activeTab === 'admin_team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#0071e3]" />
                  Sales Team Database Directory
                </h2>
                <p className="text-xs text-[#86868b] mt-1">
                  Manage registered sales reps authorized to log in and access the autodialer.
                </p>
              </div>

              <button
                onClick={() => setShowAddSalesForm((prev) => !prev)}
                className="px-4 py-2 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#0071e3]/20"
              >
                {showAddSalesForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{showAddSalesForm ? 'Cancel' : 'Add Sales Email'}</span>
              </button>
            </div>

            {/* INLINE ADD SALES EMAIL CARD (NO SCREEN-BLURRING POPUP) */}
            {showAddSalesForm && (
              <div className="bg-white rounded-3xl p-6 border border-[#0071e3]/30 shadow-md">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1d1d1f]">Add Authorized Email to Database</h4>
                      <p className="text-[11px] text-[#86868b]">Authorized members can receive magic login links</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddSalesForm(false)}
                    className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <form onSubmit={handleAddSalesEmailToDb} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-1.5">
                        Member Email Address
                      </label>
                      <input
                        type="email"
                        required
                        autoFocus
                        value={newSalesEmail}
                        onChange={(e) => setNewSalesEmail(e.target.value)}
                        placeholder="e.g. rep@certifyied.com"
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-[#1d1d1f] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-1.5">
                        Assigned Portal Role
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setNewSalesRole('sales')}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            newSalesRole === 'sales'
                              ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                              : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                          }`}
                        >
                          Sales Rep
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewSalesRole('admin')}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                            newSalesRole === 'admin'
                              ? 'border-[#0071e3] bg-[#0071e3]/10 text-[#0071e3]'
                              : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>
                    <div className="sm:col-span-2 pt-1 pb-1">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none bg-blue-50/60 hover:bg-blue-50 p-2.5 rounded-2xl border border-[#0071e3]/20 transition-colors">
                        <input
                          type="checkbox"
                          checked={sendInviteOnAdd}
                          onChange={(e) => setSendInviteOnAdd(e.target.checked)}
                          className="w-4 h-4 rounded text-[#0071e3] focus:ring-[#0071e3] border-zinc-300"
                        />
                        <div className="flex items-center gap-1.5 text-xs text-[#1d1d1f] font-medium">
                          <Mail className="w-3.5 h-3.5 text-[#0071e3]" />
                          <span>Automatically dispatch magic login link to this member's email</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddSalesForm(false)}
                      className="py-2 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-700 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAddingSalesEmail}
                      className="py-2 px-5 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-xs font-semibold text-white transition-all flex items-center gap-1.5 shadow-md shadow-[#0071e3]/20"
                    >
                      {isAddingSalesEmail ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>{sendInviteOnAdd ? 'Add & Send Login Email' : 'Add to Database'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* LAST GENERATED INVITE BANNER WITH 1-CLICK COPY */}
            {lastGeneratedInvite && (
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 shadow-sm animate-in fade-in">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#1d1d1f]">Login Link Ready for {lastGeneratedInvite.email}</div>
                    <div className="text-emerald-800 text-[11px] mt-0.5">
                      Email has been triggered! You can also share the direct login link:
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(lastGeneratedInvite.link);
                      showToast('Login link copied to clipboard!');
                    }}
                    className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-semibold hover:bg-emerald-100 transition-all flex items-center gap-1.5 text-xs shadow-sm"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Direct Login URL</span>
                  </button>
                  <button
                    onClick={() => setLastGeneratedInvite(null)}
                    className="p-2 rounded-full hover:bg-emerald-100 text-emerald-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                  Registered Team Members ({salesTeamList.length})
                </span>
                <button
                  onClick={fetchSalesTeam}
                  className="text-xs text-[#0071e3] hover:underline flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingTeam ? 'animate-spin' : ''}`} />
                  Refresh Directory
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-[#86868b] uppercase tracking-wider text-[10px] font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Member Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Authorized Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {salesTeamList.map((m) => (
                      <tr key={m.id || m.email} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">{m.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                              m.role === 'admin' || m.role === 'global'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {m.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#86868b]">
                          {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Active Member'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Trigger / Resend Login Email */}
                            <button
                              onClick={() => handleSendMemberInvite(m.email)}
                              disabled={sendingInviteEmail === m.email}
                              className="px-2.5 py-1.5 rounded-xl bg-[#0071e3]/10 hover:bg-[#0071e3]/20 text-[#0071e3] transition-colors flex items-center gap-1 font-medium text-[11px]"
                              title={`Send instant login link email to ${m.email}`}
                            >
                              {sendingInviteEmail === m.email ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Mail className="w-3.5 h-3.5" />
                              )}
                              <span>Send Email</span>
                            </button>

                            {/* Copy Direct Magic Link */}
                            <button
                              onClick={() => handleCopyMemberInviteLink(m.email)}
                              className="p-1.5 rounded-xl hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-colors"
                              title="Generate and copy direct login link"
                            >
                              {copiedLinkEmail === m.email ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Revoke Access */}
                            {m.email !== currentUserEmail && (
                              <button
                                onClick={() => handleDeleteSalesMember(m.email)}
                                className="p-1.5 rounded-xl hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors"
                                title="Revoke database access"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {salesTeamList.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-zinc-400 text-xs">
                          No team members registered yet. Click "Add Sales Email" above to register reps.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: CALLING WORKSTATION / DIALER QUEUE                 */}
        {/* ======================================================== */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            {/* Campaign Selection Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-black/10 shadow-sm">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#0071e3]" />
                <div>
                  <div className="text-xs text-[#86868b] uppercase tracking-wider font-semibold">Active Campaign</div>
                  <div className="text-sm font-semibold text-[#1d1d1f]">
                    {activeCampaign ? activeCampaign.name : 'No Campaign Selected'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {campaigns.length > 1 && (
                  <select
                    value={activeCampaign?.id || ''}
                    onChange={(e) => {
                      const sel = campaigns.find((c) => c.id === e.target.value);
                      if (sel) {
                        setActiveCampaign(sel);
                        fetchCampaignLeads(sel.id);
                      }
                    }}
                    className="bg-zinc-50 border border-black/10 rounded-2xl px-3 py-1.5 text-xs text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.total_leads} leads)
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-3 py-1.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-xs text-zinc-800 font-medium flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload New CSV</span>
                </button>
              </div>
            </div>

            {/* CALLING STATES: GUARANTEED TERNARY SO SCREEN IS NEVER BLANK */}
            {callingState === 'dialing' ? (
              /* STATE 1: CALL IN PROGRESS */
              <div className="bg-white rounded-3xl p-8 border border-emerald-500/30 shadow-[0_20px_50px_rgba(16,185,129,0.1)] text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 mb-6 ring-8 ring-emerald-100">
                  <PhoneCall className="w-10 h-10 animate-bounce" />
                </div>

                <div className="text-xs uppercase tracking-widest text-emerald-600 font-semibold mb-1">
                  Active Call In Progress
                </div>
                <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {currentLead?.name || 'Contact'}
                </h2>
                <div className="text-lg text-zinc-600 font-mono mt-1">
                  {currentLead?.phone || ''}
                </div>

                {isAdmin ? (
                  <div className="my-8 flex items-center justify-center gap-3">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span className="text-4xl font-mono font-bold text-[#1d1d1f] tracking-wider">
                      {formatSeconds(callDuration)}
                    </span>
                  </div>
                ) : (
                  <div className="my-8 flex flex-col items-center justify-center gap-2">
                    <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold shadow-sm">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span>Live Call Session Active</span>
                    </div>
                    <p className="text-xs text-[#86868b] max-w-sm text-center mt-1">
                      Call is in progress with customer. Click below when finished to record notes.
                    </p>
                  </div>
                )}

                {isAdmin && (
                  <p className="text-xs text-[#86868b] max-w-md mx-auto mb-6">
                    Redirected to telephone dialer. Telemetry actively measured. Click below whenever the conversation ends to record call feedback.
                  </p>
                )}

                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleManualCutCall}
                    className="py-3.5 px-8 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white font-medium text-sm transition-all shadow-md shadow-red-600/30 inline-flex items-center gap-2"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Call & Record Feedback</span>
                  </button>
                </div>
              </div>
            ) : callingState === 'feedback' ? (
              /* STATE 2: CALL COMPLETED & FEEDBACK SHEET */
              <div className="bg-white rounded-3xl p-8 border border-black/10 shadow-2xl max-w-xl mx-auto text-[#1d1d1f]">
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-200">
                  <div>
                    <div className="text-xs text-[#86868b] uppercase tracking-wider font-semibold">Call Completed</div>
                    <h3 className="text-xl font-bold text-[#1d1d1f] tracking-tight">
                      {currentLead?.name || 'Contact'}
                    </h3>
                    <div className="text-xs text-[#86868b] font-mono">
                      {currentLead?.phone || ''}
                    </div>
                  </div>
                  <div className="text-right">
                    {isAdmin ? (
                      <>
                        <span className="text-xs text-[#86868b] block">Total Duration</span>
                        <span className="text-2xl font-mono font-bold text-emerald-600">{formatSeconds(callDuration)}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-[#86868b] block">Session Status</span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mt-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Call Logged
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-2.5">
                      Call Outcome / Status
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { label: 'Qualified Lead', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
                        { label: 'Interested', color: 'border-blue-300 bg-blue-50 text-blue-700' },
                        { label: 'Call Back', color: 'border-amber-300 bg-amber-50 text-amber-700' },
                        { label: 'Busy / No Answer', color: 'border-zinc-300 bg-zinc-100 text-zinc-800' },
                        { label: 'Not Interested', color: 'border-red-300 bg-red-50 text-red-700' },
                        { label: 'Wrong Number', color: 'border-zinc-300 bg-zinc-100 text-zinc-600' },
                      ].map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => setFeedbackStatus(opt.label as any)}
                          className={`py-2 px-3 rounded-2xl text-xs font-semibold border transition-all text-center ${
                            feedbackStatus === opt.label
                              ? opt.color + ' ring-2 ring-[#0071e3]'
                              : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {feedbackStatus === 'Call Back' && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-amber-600" />
                          <span>Scheduled Callback Time (Required)</span>
                        </label>
                        {!hasNotificationPermission && (
                          <button
                            type="button"
                            onClick={requestNotificationPermission}
                            className="text-[11px] text-[#0071e3] font-medium flex items-center gap-1 hover:underline"
                          >
                            <Bell className="w-3 h-3" />
                            Enable Browser Alerts
                          </button>
                        )}
                      </div>

                      {/* Quick Shortcut Buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {[
                          { label: '+30 Min', getMs: () => Date.now() + 30 * 60 * 1000 },
                          { label: '+1 Hour', getMs: () => Date.now() + 60 * 60 * 1000 },
                          {
                            label: 'Tomorrow 10 AM',
                            getMs: () => {
                              const d = new Date();
                              d.setDate(d.getDate() + 1);
                              d.setHours(10, 0, 0, 0);
                              return d.getTime();
                            },
                          },
                          {
                            label: 'Tomorrow 2 PM',
                            getMs: () => {
                              const d = new Date();
                              d.setDate(d.getDate() + 1);
                              d.setHours(14, 0, 0, 0);
                              return d.getTime();
                            },
                          },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              const target = new Date(preset.getMs() - new Date().getTimezoneOffset() * 60000);
                              setCallbackTime(target.toISOString().slice(0, 16));
                            }}
                            className="py-1.5 px-2 rounded-xl bg-white border border-amber-200 hover:bg-amber-100/60 text-[11px] font-semibold text-amber-900 transition-colors shadow-xs"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-600" />
                        <input
                          type="datetime-local"
                          required
                          value={callbackTime}
                          onChange={(e) => setCallbackTime(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white border border-amber-300 rounded-2xl text-xs text-[#1d1d1f] font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-amber-800">
                        <Bell className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Instant confirmation email will be sent to your inbox + browser reminder 15 mins prior.</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-1.5">
                      Call Notes & Customer Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={feedbackNotes}
                      onChange={(e) => setFeedbackNotes(e.target.value)}
                      placeholder="e.g., Interested in Google 360 virtual tour package. Requested email proposal..."
                      className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-[#1d1d1f] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartCall(currentLead || undefined)}
                      className="w-1/3 py-3.5 px-4 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Re-dial</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitFeedback}
                      disabled={isSubmittingFeedback}
                      className="w-2/3 py-3.5 px-6 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.98] text-white font-medium text-sm transition-all shadow-md shadow-[#0071e3]/20 flex items-center justify-center gap-2"
                    >
                      {isSubmittingFeedback ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Save Feedback & Next Lead</span>
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* STATE 3: IDLE QUEUE SPOTLIGHT (ALWAYS RENDERED) */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-black/10 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold">
                        Lead {currentLeadIndex + 1} of {leads.length || 0}
                      </span>
                      <span className="text-xs text-[#86868b]">
                        {pendingLeadsCount} leads pending
                      </span>
                    </div>

                    {currentLead ? (
                      <div className="my-6">
                        <div className="text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-1">
                          Next Contact to Dial
                        </div>
                        <h2 className="text-3xl font-bold text-[#1d1d1f] tracking-tight">{currentLead.name}</h2>
                        <div className="text-xl text-[#0071e3] font-mono mt-2 font-medium">
                          {currentLead.phone}
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-xs text-[#86868b]">
                          <span>Times Called: {currentLead.call_count || 0}</span>
                          <span>•</span>
                          <span className="capitalize text-zinc-700">Status: {currentLead.status || 'pending'}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="my-10 text-center py-6">
                        <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                          <Users className="w-6 h-6" />
                        </div>
                        <h4 className="text-base font-semibold text-[#1d1d1f]">No Leads in Queue</h4>
                        <p className="text-xs text-[#86868b] mt-1 max-w-xs mx-auto">
                          Upload a CSV lead sheet with names and phone numbers to start automated outbound dialing.
                        </p>
                        <button
                          onClick={() => setActiveTab('upload')}
                          className="mt-4 px-4 py-2 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium shadow-sm"
                        >
                          Upload CSV Now
                        </button>
                      </div>
                    )}
                  </div>

                  {currentLead && (
                    <div className="pt-6 border-t border-zinc-100">
                      <button
                        onClick={() => handleStartCall()}
                        className="w-full py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold text-base transition-all duration-200 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-3"
                      >
                        <Phone className="w-5 h-5 fill-current" />
                        <span>Start Dialing ({currentLead.name})</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Queue Summary / List Card */}
                <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm flex flex-col h-[460px]">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-100">
                    <h3 className="text-sm font-semibold text-[#1d1d1f] tracking-tight">Queue Contacts</h3>
                    <span className="text-xs text-[#86868b]">{leads.length} Total</span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {leads.map((l, index) => (
                      <div
                        key={l.id || index}
                        onClick={() => setCurrentLeadIndex(index)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          index === currentLeadIndex
                            ? 'bg-[#0071e3]/10 border-[#0071e3]/30 text-[#1d1d1f]'
                            : 'bg-zinc-50 border-zinc-200/80 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="text-xs font-semibold text-[#1d1d1f] truncate">{l.name}</div>
                          <div className="text-[11px] font-mono text-[#86868b] truncate">{l.phone}</div>
                        </div>
                        <div className="shrink-0 flex items-center gap-1.5">
                          {l.status === 'called' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Called" />
                          )}
                          {l.status === 'dialing' && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" title="Dialing" />
                          )}
                          {l.status === 'pending' && (
                            <span className="w-2 h-2 rounded-full bg-zinc-300" title="Pending" />
                          )}
                        </div>
                      </div>
                    ))}

                    {leads.length === 0 && (
                      <div className="text-center py-12 text-zinc-400 text-xs">
                        Queue is currently empty.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: CSV UPLOAD & TASK SCHEDULER                        */}
        {/* ======================================================== */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">Upload Outbound Contacts</h2>
              <p className="text-xs text-[#86868b] mt-1">
                Upload a CSV spreadsheet containing customer Name and Phone Number columns.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-black/10 shadow-sm">
              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-2">
                  Campaign / Task Title
                </label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="e.g., Outbound Leads Batch 1"
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm text-[#1d1d1f] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:bg-white"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-2">
                  Select CSV File
                </label>
                <label className="border-2 border-dashed border-zinc-300 hover:border-[#0071e3] rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer bg-zinc-50/70 hover:bg-zinc-100/70 transition-all">
                  <Upload className="w-10 h-10 text-[#0071e3] mb-3" />
                  <span className="text-sm font-semibold text-[#1d1d1f]">Click to browse or drop CSV</span>
                  <span className="text-xs text-[#86868b] mt-1">Columns required: Name, Phone</span>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCsvUpload}
                    className="hidden"
                  />
                </label>
                {csvFileName && (
                  <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0071e3]" />
                      <strong>{csvFileName}</strong>
                    </span>
                    <span className="text-emerald-600 font-semibold">
                      {parsedLeads.length} contacts identified
                    </span>
                  </div>
                )}
              </div>

              {parsedLeads.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#86868b]">
                      Preview (First 5 Rows)
                    </span>
                    <span className="text-xs text-[#86868b]">Total: {parsedLeads.length} leads</span>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden text-xs shadow-sm">
                    <div className="grid grid-cols-2 bg-zinc-100 p-2.5 font-semibold text-zinc-700 border-b border-zinc-200">
                      <span>Name</span>
                      <span>Phone Number</span>
                    </div>
                    {parsedLeads.slice(0, 5).map((lead, i) => (
                      <div key={i} className="grid grid-cols-2 p-2.5 border-b border-zinc-100 text-zinc-600">
                        <span className="text-[#1d1d1f] font-medium truncate">{lead.name}</span>
                        <span className="font-mono text-zinc-600 truncate">{lead.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleScheduleCampaign}
                disabled={isUploading || parsedLeads.length === 0}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 active:scale-[0.98] text-white font-medium text-sm transition-all shadow-md shadow-[#0071e3]/20 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Schedule Task & Start Dialing</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: QUALIFIED LEADS VAULT (SCOPED FOR REP, GLOBAL ADMIN)*/}
        {/* ======================================================== */}
        {activeTab === 'qualified' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  {isAdmin ? 'Global Qualified Leads Vault' : 'My Qualified Leads Vault'}
                </h2>
                <p className="text-xs text-[#86868b] mt-1">
                  {isAdmin
                    ? 'All high-converting prospects qualified by the sales team.'
                    : 'Your personal high-converting prospects qualified from your calls.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadQualifiedLeads}
                  className="px-3 py-1.5 rounded-2xl bg-white border border-black/10 hover:bg-zinc-50 text-xs text-zinc-700 font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
                <button
                  onClick={exportQualifiedLeadsCSV}
                  className="px-4 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export to CSV
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-[#86868b] uppercase tracking-wider text-[10px] font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Phone</th>
                      {isAdmin && <th className="py-3 px-4">Duration</th>}
                      <th className="py-3 px-4">Sales Rep</th>
                      <th className="py-3 px-4">Notes</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {qualifiedLeadsList.map((q) => (
                      <tr key={q.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">{q.name}</td>
                        <td className="py-3.5 px-4 font-mono text-zinc-600">{q.phone}</td>
                        {isAdmin && (
                          <td className="py-3.5 px-4 font-mono text-emerald-600 font-medium">
                            {formatSeconds(q.duration_seconds || 0)}
                          </td>
                        )}
                        <td className="py-3.5 px-4 text-[#86868b]">{q.sales_email}</td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-zinc-600">{q.notes || '—'}</td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => triggerPhoneDial(q.phone)}
                            className="px-2.5 py-1 rounded-xl bg-[#0071e3]/10 hover:bg-[#0071e3]/20 text-[#0071e3] font-medium flex items-center gap-1 text-[11px]"
                          >
                            <Phone className="w-3 h-3" />
                            Dial
                          </button>
                        </td>
                      </tr>
                    ))}

                    {qualifiedLeadsList.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 6 : 5} className="py-12 text-center text-zinc-400 text-xs">
                          No qualified leads recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: SCHEDULED CALLBACKS (APPOINTMENTS & REDIAL QUEUE)  */}
        {/* ======================================================== */}
        {activeTab === 'callbacks' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  {isAdmin ? 'Global Customer Callbacks' : 'My Scheduled Callbacks'}
                </h2>
                <p className="text-xs text-[#86868b] mt-1">
                  Scheduled prospect callbacks with automated email alerts and desktop reminders.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {!hasNotificationPermission && (
                  <button
                    onClick={requestNotificationPermission}
                    className="px-3.5 py-1.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs text-amber-800 font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    Enable Desktop Alerts
                  </button>
                )}
                <button
                  onClick={loadCallbacks}
                  className="px-3 py-1.5 rounded-2xl bg-white border border-black/10 hover:bg-zinc-50 text-xs text-zinc-700 font-medium flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCallbacks ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-[#86868b] uppercase tracking-wider text-[10px] font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Scheduled Date & Time</th>
                      <th className="py-3 px-4">Time Window</th>
                      {isAdmin && <th className="py-3 px-4">Sales Rep</th>}
                      <th className="py-3 px-4">Notes</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {callbacksList.map((cb) => {
                      const cbDate = new Date(cb.callback_time);
                      const isPast = cbDate.getTime() < Date.now();
                      const isToday = cbDate.toDateString() === new Date().toDateString();

                      return (
                        <tr key={cb.id} className="hover:bg-zinc-50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">{cb.lead_name}</td>
                          <td className="py-3.5 px-4 font-mono text-zinc-600">{cb.phone}</td>
                          <td className="py-3.5 px-4 font-medium text-[#1d1d1f]">
                            {cbDate.toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                isPast
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : isToday
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              {isPast ? 'Overdue' : isToday ? 'Today' : 'Upcoming'}
                            </span>
                          </td>
                          {isAdmin && <td className="py-3.5 px-4 text-[#86868b]">{cb.sales_email}</td>}
                          <td className="py-3.5 px-4 max-w-xs truncate text-zinc-600">{cb.notes || '—'}</td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleDialCallback(cb)}
                                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 text-[11px] shadow-sm transition-all"
                              >
                                <Phone className="w-3 h-3" />
                                Dial Now
                              </button>
                              <button
                                onClick={() => handleUpdateCallbackStatus(cb.id, 'completed')}
                                title="Mark as Completed"
                                className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              </button>
                              <button
                                onClick={() => handleUpdateCallbackStatus(cb.id, 'cancelled')}
                                title="Dismiss Callback"
                                className="p-1.5 rounded-xl bg-zinc-100 hover:bg-red-50 hover:text-red-600 text-zinc-500 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {callbacksList.length === 0 && (
                      <tr>
                        <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-zinc-400 text-xs">
                          {isLoadingCallbacks ? 'Loading callbacks...' : 'No pending scheduled callbacks in queue.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB: SALES REP PERSONAL PERFORMANCE (NON-ADMIN ONLY)     */}
        {/* ======================================================== */}
        {!isAdmin && activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">My Calling Performance</h2>
                <p className="text-xs text-[#86868b] mt-1">
                  Your individual dialer statistics, outreach outcomes, and qualified lead conversions.
                </p>
              </div>
              <button
                onClick={() => loadAnalytics()}
                className="px-3.5 py-1.5 rounded-2xl bg-white border border-black/10 text-xs text-zinc-700 hover:bg-zinc-50 font-medium flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAnalytics ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Total Calls</span>
                  <PhoneCall className="w-4 h-4 text-[#0071e3]" />
                </div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {analyticsStats?.totalCalls || 0}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Total numbers dialed</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Connected Leads</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 tracking-tight">
                  {analyticsStats?.connectedCalls ?? (
                    Math.max(0, (analyticsStats?.totalCalls || 0) - (feedbackBreakdown['Busy / No Answer'] || 0) - (feedbackBreakdown['Wrong Number'] || 0))
                  )}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Direct customer conversations</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Qualified Leads</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-3xl font-bold text-[#0071e3] tracking-tight">
                  {analyticsStats?.totalQualified || 0}
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Vaulted for deal closing</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-black/10 shadow-sm">
                <div className="flex items-center justify-between text-[#86868b] text-xs uppercase tracking-wider mb-2 font-semibold">
                  <span>Conversion Rate</span>
                  <Zap className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {analyticsStats?.conversionRate || 0}%
                </div>
                <div className="text-[11px] text-[#86868b] mt-1">Qualified to dialed ratio</div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-black/10 shadow-sm">
              <h3 className="text-xs uppercase tracking-wider text-[#86868b] font-semibold mb-4">
                Call Outcome Breakdown
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {Object.entries(feedbackBreakdown).map(([status, count]) => (
                  <div
                    key={status}
                    className="px-3.5 py-2 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-2 text-xs"
                  >
                    <span className="text-zinc-700 font-medium">{status}:</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#0071e3]/10 text-[#0071e3] font-bold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/10 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">My Recent Call History</h3>
                <span className="text-xs text-[#86868b]">Personal activity log</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-[#86868b] uppercase tracking-wider text-[10px] font-semibold border-b border-zinc-200">
                    <tr>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Call Time</th>
                      <th className="py-3 px-4">Outcome</th>
                      <th className="py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-700">
                    {recentCallLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-[#1d1d1f]">{log.lead_name}</td>
                        <td className="py-3 px-4 font-mono text-zinc-600">{log.phone}</td>
                        <td className="py-3 px-4 text-[#86868b]">
                          {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              log.is_qualified
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                            }`}
                          >
                            {log.feedback_status || 'Called'}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-zinc-600">{log.feedback_notes || '—'}</td>
                      </tr>
                    ))}
                    {recentCallLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-400 text-xs">
                          No calls recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
