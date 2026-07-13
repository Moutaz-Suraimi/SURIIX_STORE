import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, ShoppingBag, Layers, ShoppingCart, Users, Tag, Ticket, Menu,
  ImageIcon, Star, BarChart3, Palette, Settings, CreditCard,
  HelpCircle, Bell, Search, Plus, ExternalLink, Copy, Edit3, Share2,
  PackageCheck, Eye, BadgeCheck, TrendingUp, User, Clock, CheckCircle2, XCircle, Trash2, MessageSquare, Lock, Moon, Sun, Save, Mail,
  ArrowLeftRight, FileText, Activity, ShieldCheck, Calendar, ArrowDownToLine, ArrowUpFromLine, Zap, Headset, Facebook, Wallet, LogOut, Rocket, Crown, Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from "@/lib/supabase";
import { WalletTabV3 } from "../components/WalletTabV3";

import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useNotifications } from "@/hooks/useNotifications";
import { notification } from "@/lib/notifications";
import { toast } from "sonner";

// Data from image & user prompt
const quickActions = [
  { icon: Plus, label: "إضافة منتج جديد", color: "bg-purple-50 text-purple-600", action: "products" },
  { icon: Layers, label: "إضافة تصنيف", color: "bg-blue-50 text-blue-600", action: "categories" },
  { icon: ImageIcon, label: "رفع بانر", color: "bg-orange-50 text-orange-600", action: "banners" },
  { icon: Ticket, label: "إنشاء كوبون خصم", color: "bg-green-50 text-green-600", action: "coupons" },
  { icon: Edit3, label: "تعديل المتجر", color: "bg-primary/10 text-primary", action: "settings" },
  { icon: Share2, label: "مشاركة رابط المتجر", color: "bg-rose-50 text-rose-600", action: "share" },
];

const SidebarMenu = [
  { id: 'overview', label: 'الرئيسية', icon: Home },
  { id: 'products', label: 'المنتجات', icon: ShoppingBag },
  { id: 'categories', label: 'التصنيفات', icon: Layers },
  { id: 'orders', label: 'الطلبات', icon: ShoppingCart },
  { id: 'customers', label: 'العملاء', icon: Users },
  { id: 'offers', label: 'العروض والخصومات', icon: Tag },
  { id: 'coupons', label: 'الكوبونات', icon: Ticket },
  { id: 'banners', label: 'البانرات', icon: ImageIcon },
  { id: 'pages', label: 'صفحات المتجر', icon: FileText },
  { id: 'reviews', label: 'المراجعات', icon: Star },
  { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
  { id: 'appearance', label: 'المظهر', icon: Palette },
  { id: 'settings', label: 'إعدادات المتجر', icon: Settings },
  { id: 'domain', label: 'ربط نطاق خاص', icon: Globe },
  { id: 'payment', label: 'وسائل الدفع', icon: CreditCard },
  { id: 'subscription', label: 'الاشتراك', icon: BadgeCheck },
  { id: 'wallet', label: 'المحفظة الإلكترونية', icon: Wallet },
  { id: 'support', label: 'الدعم الفني', icon: HelpCircle },
];

const currentProducts: any[] = [];
const bestSellers: any[] = [];
const recentOrders: any[] = [];
const recentCustomers: any[] = [];

const statBoxClasses = "bg-white rounded-2xl p-6 shadow-sm border border-border/40 flex flex-col items-center justify-center min-h-[140px] dark:bg-[#0f172a] dark:border-slate-800";

// Static store pages definition — placed here so StoreDashboard can reference StorePagesTab
const STATIC_PAGES = [
  { key: 'about', title: 'من نحن', icon: '🏪', placeholder: 'اكتب هنا نبذة عن متجرك وقصتك...' },
  { key: 'privacy', title: 'سياسة الخصوصية', icon: '🔒', placeholder: 'اكتب هنا سياسة الخصوصية الخاصة بمتجرك...' },
  { key: 'terms', title: 'الشروط والأحكام', icon: '📜', placeholder: 'اكتب هنا الشروط والأحكام الخاصة بمتجرك...' },
  { key: 'returns', title: 'سياسة الاسترجاع والاستبدال', icon: '🔄', placeholder: 'اكتب هنا شروط الاستبدال والاسترجاع...' },
  { key: 'contact', title: 'تواصل معنا', icon: '📞', placeholder: 'اكتب بريدك الإلكتروني ورقم واتساب وأي معلومات تواصل أخرى...' },
  { key: 'faq', title: 'الأسئلة الشائعة', icon: '❓', placeholder: 'اكتب أكثر الأسئلة شيوعاً مع إجاباتها...' },
  { key: 'tracking', title: 'تتبع طلبك', icon: '📦', placeholder: 'اشرح هنا كيف يمكن للعميل تتبع طلبه...' },
  { key: 'howto', title: 'كيف أطلب؟', icon: '🛒', placeholder: 'اشرح هنا خطوات الطلب بشكل مفصل...' },
];


const StoreDashboard = () => {
  const [activeTab, setActiveTabState] = useState(() => localStorage.getItem('suriix_active_tab') || 'overview');
  const setActiveTab = (tab: string) => {
    localStorage.setItem('suriix_active_tab', tab);
    setActiveTabState(tab);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const isGuest = localStorage.getItem("suriix_guest_mode") === "true";
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [notifUserId, setNotifUserId] = useState<string | null>(null);
  const { notifications, unread, markAsRead, markAllAsRead } = useNotifications(notifUserId);
  const [showNotifications, setShowNotifications] = useState(false);

  React.useEffect(() => {
    const fetchPlans = async () => {
      const { data } = await supabase.from('subscription_plans').select('*').eq('is_active', true).order('price', { ascending: true });
      if (data) setSubscriptionPlans(data);
    };
    fetchPlans();
  }, []);

  // Listen for tab-switch events from child components (e.g. DomainTab upgrade button)
  React.useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent).detail;
      if (tab) setActiveTab(tab);
    };
    window.addEventListener('suriix_switch_tab', handler);
    return () => window.removeEventListener('suriix_switch_tab', handler);
  }, []);


  // Theme Toggle State
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('suriix_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('suriix_theme', 'dark');
      setIsDark(true);
    }
  };

  const [storeData, setStoreData] = React.useState<any>({
    id: '',
    name: '',
    url: '',
    initial: '',
    wallet: 0,
    wallet_yer: 0,
    wallet_sar: 0,
    wallet_usd: 0,
    package: '',
    products: [] as any[],
    banners: [] as any[],
    transactions: [] as any[],
    categories: [] as any[],
    coupons: [] as any[],
    orders: [] as any[],
    visitors: 0,
    owner_id: '',
    expiryWarningDays: 0,
    daysLeft: null as number | null,
    subscription_ends_at: null as string | null,
  });

  const [successModal, setSuccessModal] = React.useState<{ title: string, message: string } | null>(null);

  const updateGlobalStoreField = React.useCallback((field: string, val: any) => {
    setStoreData(prev => ({ ...prev, [field]: val }));
    try {
      const str = localStorage.getItem('suriix_added_stores');
      if (str) {
        const list = JSON.parse(str);
        if (list.length > 0) {
          list[0][field] = val;
          localStorage.setItem('suriix_added_stores', JSON.stringify(list));
          // إطلاق حدث storage يدوياً حتى تستقبله PublicStore في نفس التاب
          window.dispatchEvent(new StorageEvent('storage', { key: 'suriix_added_stores', newValue: JSON.stringify(list) }));
        }
      }
    } catch (e) { }
  }, []);

  React.useEffect(() => {
    const checkStoreStatus = () => {
      try {
        const existing = localStorage.getItem("suriix_added_stores");
        if (existing) {
          const list = JSON.parse(existing);
          if (list && list.length > 0) {
            const latestStore = list[0];
            const storeName = latestStore.name || 'المتجر الافتراضي';
            setStoreData(prev => ({
              ...prev,
              id: latestStore.id || '',
              name: storeName,
              url: latestStore.slug ? `${latestStore.slug}.suriix.store` : 'mubashyrah.com',
              initial: storeName.charAt(0),
              wallet: latestStore.wallet || 0,
              wallet_yer: latestStore.wallet_yer || latestStore.wallet || 0,
              package: latestStore.tier || '',
              products: latestStore.products || [],
              banners: latestStore.banners || [],
              categories: latestStore.categories || [],
              coupons: latestStore.coupons || []
            }));

            // Fix local stores being stuck on pending:
            if (latestStore.status === 'active' || latestStore.tier) {
              setIsPending(false);
            }

            // A Supabase UUID looks like: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            // A local ID is a number (Date.now()) — numeric string, no dashes
            const isSupabaseId = latestStore.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(latestStore.id));

            supabase.auth.getSession().then(({ data: authData }) => {
              if (isSupabaseId || authData.session?.user) {
                const uid = authData.session?.user?.id || latestStore.owner_id || latestStore.id;
                setNotifUserId(uid);

                // Fetch actual store data (name, URL) from Supabase stores table
                supabase.from('stores').select('store_name, store_url, custom_domain').eq('owner_id', uid).maybeSingle().then(({ data: storeRow }) => {
                  if (storeRow) {
                    setStoreData(prev => ({
                      ...prev,
                      name: storeRow.store_name || prev.name,
                      url: storeRow.custom_domain || (storeRow.store_url ? `${storeRow.store_url}.suriix.store` : prev.url),
                      slug: storeRow.store_url || '',
                      initial: (storeRow.store_name || prev.name).charAt(0),
                      custom_domain: storeRow.custom_domain || '',
                    }));
                    // Also sync to localStorage
                    try {
                      const ls = localStorage.getItem('suriix_added_stores');
                      if (ls) {
                        const list = JSON.parse(ls);
                        if (list.length > 0) {
                          list[0].name = storeRow.store_name || list[0].name;
                          list[0].slug = storeRow.store_url || list[0].slug;
                          localStorage.setItem('suriix_added_stores', JSON.stringify(list));
                        }
                      }
                    } catch { }
                  }
                });

                supabase.from('users').select('wallet_yer, status, package_id').eq('id', uid).limit(1).then(({ data, error }) => {
                  if (error) {
                    console.error('Error fetching user for wallet:', error);
                  }
                  if (data && data.length > 0) {
                    const userData = data[0];
                    // Fix flickering: use Math.max to prevent overriding local money with 0 from Supabase
                    const maxWalletYer = Math.max(userData.wallet_yer || 0, latestStore.wallet_yer || 0, latestStore.wallet || 0);
                    const totalWallet = maxWalletYer;

                    let isExpired = false;
                    const expiryTime = latestStore.subscription_ends_at; // fallback to local for now until subscription fetch is built
                    let calculatedDaysLeft = null;
                    if (expiryTime) {
                      const diffTime = new Date(expiryTime).getTime() - new Date().getTime();
                      calculatedDaysLeft = Math.ceil(diffTime / (1000 * 3600 * 24));
                      if (calculatedDaysLeft <= 0) {
                        isExpired = true;
                        userData.status = 'pending';
                        latestStore.status = 'pending';
                      }
                    }

                    setStoreData((prev: any) => ({
                      ...prev,
                      wallet: totalWallet,
                      package: userData.package_id ? "تم تفعيل باقة" : (latestStore.tier || ''),
                      wallet_yer: maxWalletYer,
                      wallet_sar: 0,
                      wallet_usd: 0,
                      subscription_ends_at: expiryTime,
                      expiryWarningDays: calculatedDaysLeft !== null && calculatedDaysLeft <= 3 && calculatedDaysLeft > 0 ? calculatedDaysLeft : null,
                      daysLeft: calculatedDaysLeft
                    }));

                    // KEY FIX: if localStorage already says 'active' (e.g. just subscribed),
                    // NEVER let a stale Supabase 'pending' status override it.
                    const localIsActive = latestStore.status === 'active' || latestStore.tier;
                    if ((userData.status === 'active' && !isExpired) || (localIsActive && !isExpired)) {
                      setIsPending(false);
                      setShowPendingModal(false);
                      // Sync back to localStorage
                      latestStore.status = 'active';
                      latestStore.wallet = totalWallet;
                      localStorage.setItem("suriix_added_stores", JSON.stringify(list));
                    } else if (userData.status === 'pending' && !localIsActive) {
                      // Only show pending if BOTH Supabase AND localStorage agree it's pending
                      setIsPending(true);
                      if (sessionStorage.getItem('suriix_guest_skip') !== 'true') {
                        setShowPendingModal(true);
                      }
                    }
                  } else {
                    // No user row in DB — trust localStorage status instead of blocking
                    if (latestStore.status === 'active' || latestStore.tier) {
                      setIsPending(false);
                      setShowPendingModal(false);
                    } else if (sessionStorage.getItem('suriix_guest_skip') !== 'true') {
                      setIsPending(true);
                      setShowPendingModal(true);
                    }
                  }
                });
              } else {
                // Local store — read status directly from localStorage
                if (latestStore.status === 'pending') {
                  setIsPending(true);
                  if (sessionStorage.getItem('suriix_guest_skip') !== 'true') {
                    setShowPendingModal(true);
                  }
                } else if (latestStore.status === 'active' || latestStore.status === 'نشط') {
                  setIsPending(false);
                  setShowPendingModal(false);
                }
              }
            });
          }
        }
      } catch (e) { }
    };

    checkStoreStatus();

    window.addEventListener('storage', checkStoreStatus);

    return () => {
      window.removeEventListener('storage', checkStoreStatus);
    };
  }, []);

  const isStarterTheme = storeData.package?.includes('الانطلاقة');
  const isEliteTheme = storeData.package?.includes('النخبة');
  const activeTabClass = isStarterTheme ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : isEliteTheme ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' : 'bg-primary text-white shadow-md shadow-primary/20';
  const headerIconClass = isStarterTheme ? 'bg-emerald-500 shadow-emerald-500/30' : isEliteTheme ? 'bg-purple-600 shadow-purple-600/30' : 'bg-primary shadow-primary/30';
  const themeTextColor = isStarterTheme ? 'text-emerald-500' : isEliteTheme ? 'text-purple-600' : 'text-primary';

  return (
    <div className="flex h-screen bg-[#F4F7FB] dark:bg-[#0f172a] text-slate-900 dark:text-white transition-colors overflow-hidden" dir="rtl">

      {/* PENDING OVERLAY */}
      {showPendingModal && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/70 dark:bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 rounded-[32px] shadow-2xl p-10 max-w-[420px] w-full mx-4 text-center border border-border/30 dark:border-white/10 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-t-[32px]" />

            <div className="w-20 h-20 mx-auto mb-6 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-100">
              <Lock className="w-10 h-10 text-amber-500" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">متجرك قيد المراجعة</h2>

            <p className="text-slate-600 dark:text-slate-300 font-bold leading-relaxed mb-4 text-sm px-2">
              تم استلام طلبك بنجاح! يقوم فريق Suriix الآن بمراجعة حسابك وتفعيله.
            </p>
            <p className="text-amber-600 font-bold mb-8 text-sm">
              ستتلقى إشعاراً فور تفعيل حسابك.
            </p>

            <div className="flex items-center gap-2 justify-center bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-700 font-bold mb-6">
              <span>متوسط وقت المراجعة: من دقائق إلى ساعة واحدة</span>
              <span className="text-lg">⏳</span>
            </div>

            <button
              onClick={async () => {
                // Recheck status from localStorage
                try {
                  const raw = localStorage.getItem('suriix_added_stores');
                  if (raw) {
                    const list = JSON.parse(raw);
                    if (list[0]?.status === 'active') {
                      setIsPending(false);
                      setShowPendingModal(false);
                    }
                  }
                } catch (_) { }
              }}
              className="w-full py-4 rounded-xl bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold text-sm transition flex items-center justify-center gap-2 mb-3 shadow-sm"
            >
              تحديث الحالة <span className="text-blue-500 bg-blue-100 p-1 rounded-md ml-1"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg></span>
            </button>

            <button onClick={() => {
              sessionStorage.setItem('suriix_guest_skip', 'true');
              setShowPendingModal(false);
            }} className="text-xs font-bold text-slate-400 hover:text-slate-600 transition underline decoration-slate-300 underline-offset-4 dark:text-slate-300">
              تخطي كضيف (معاينة فقط)
            </button>
          </div>
        </div>
      )}

      {/* SIDEBAR OVERLAY - mobile backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="sidebar-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-[2px]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative top-0 right-0 z-50
          w-[280px] md:w-[260px]
          bg-white dark:bg-slate-900
          border-l border-border/40 dark:border-white/5
          flex flex-col h-full shrink-0
          shadow-2xl md:shadow-sm
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 md:h-20 flex items-center gap-3 px-5 mt-0 md:mt-2 shrink-0 justify-between border-b border-border/30 dark:border-white/5 md:border-none">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 md:w-10 md:h-10 ${headerIconClass} rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg`}>
              {storeData.initial}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base md:text-lg text-foreground leading-tight truncate max-w-[130px]">{storeData.name}</span>
              <span className={`text-xs ${themeTextColor} font-semibold`}>لوحة التحكم</span>
            </div>
          </div>
          <button
            className="md:hidden p-2 rounded-xl hover:bg-muted/60 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <XCircle className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 custom-scrollbar">
          {SidebarMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 font-medium text-[15px]
                 ${activeTab === item.id
                  ? activeTabClass
                  : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-right">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="px-3 pb-6 shrink-0 border-t border-border/30 dark:border-white/5 pt-3">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              localStorage.removeItem('suriix_user_auth');
              localStorage.removeItem('suriix_user_role');
              localStorage.removeItem('suriix_added_stores');
              localStorage.removeItem('suriix_guest_mode');
              localStorage.removeItem('suriix_active_tab');
              window.location.href = '/create-store';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold text-[15px] transition-all duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="flex-1 text-right">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative w-full">

        {/* HEADER */}
        <header className="h-16 shrink-0 px-4 md:px-8 flex items-center justify-between bg-[#F4F7FB] dark:bg-[#0f172a] border-b border-border/20 dark:border-white/5">
          {/* Right side: Hamburger + Store Name */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Hamburger - mobile only */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-800 border border-border/40 dark:border-white/10 shadow-sm text-foreground hover:bg-muted transition-colors shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Store Avatar - mobile only */}
            <div className="flex md:hidden w-8 h-8 bg-white rounded-xl border border-border/50 shadow-sm items-center justify-center shrink-0 dark:bg-[#0f172a]">
              <span className={`font-bold ${themeTextColor} text-sm`}>{storeData.initial}</span>
            </div>

            {/* Store Name + Status */}
            <div className="min-w-0">
              <h1 className="font-bold text-base md:text-xl leading-tight truncate max-w-[140px] md:max-w-none">{storeData.name}</h1>
              {!isPending ? (
                <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-50 dark:bg-green-950/40 dark:text-green-400 px-1.5 py-0.5 rounded-md mt-0.5 w-fit">
                  نشط <BadgeCheck className="w-2.5 h-2.5" />
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.5 rounded-md mt-0.5 w-fit">
                  غير نشط <Lock className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            {/* Sub Info - desktop only */}
            <div className="mr-6 pr-6 border-r border-border/50 hidden md:flex flex-col text-sm text-muted-foreground min-w-[200px]">
              <div className="truncate">رابط المتجر: <a href={`/store/${storeData.url}`} target="_blank" className="font-bold text-primary hover:underline mx-1">{storeData.url}</a></div>
              <div className="flex items-center gap-2">الاشتراك: <span className="font-bold text-slate-800 dark:text-slate-200">{isPending || storeData.package === 'Starter' ? 'لا يوجد' : (storeData.package ? `باقة ${storeData.package}` : 'لا يوجد')}</span>
                {!isPending && storeData.daysLeft != null && storeData.daysLeft > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${storeData.daysLeft > 7 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      storeData.daysLeft > 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 font-black animate-pulse'
                    }`}>
                    {storeData.daysLeft} أيام
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Left side: Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-border/40 dark:border-white/10 cursor-pointer hover:bg-muted transition text-slate-700 dark:text-slate-300">
              {isDark ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <div onClick={() => setShowNotifications(!showNotifications)} className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-border/40 dark:border-white/10 relative cursor-pointer hover:bg-muted transition text-slate-700 dark:text-slate-300">
                <Bell className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
                {unread > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 text-[8px] font-black text-white flex items-center justify-center">{unread}</span>}
              </div>
              {showNotifications && (
                <div className="absolute top-12 left-0 w-72 md:w-80 bg-white dark:bg-slate-800 border border-border/40 dark:border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b border-border/40 dark:border-white/10 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">الإشعارات</h3>
                    {unread > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-primary font-bold hover:underline">تحديد الكل كمقروء</button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto custom-scrollbar">
                    {notifications.length > 0 ? notifications.map((n: any) => (
                      <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b border-border/40 dark:border-white/10 hover:bg-muted/50 cursor-pointer transition-colors ${!n.is_read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                      </div>
                    )) : (
                      <div className="p-6 text-center text-muted-foreground text-sm font-bold">لا توجد إشعارات</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold cursor-pointer shadow-sm text-sm md:text-base">
              {storeData.initial}
            </div>
          </div>
        </header>

        {/* SCROLLABLE VIEW */}

        {isPending && activeTab !== 'wallet' && activeTab !== 'subscription' && (
          <div className="absolute inset-x-0 inset-y-0 z-50 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-[3px] flex items-start justify-center p-4 pt-20">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[32px] shadow-2xl flex flex-col items-center max-w-[400px] w-full text-center border-2 border-amber-200 dark:border-amber-900/50 relative z-10">
              <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-5 border-[6px] border-amber-100 dark:border-amber-800/50"><Lock className="w-8 h-8 text-amber-500" /></div>
              <h3 className="font-black text-2xl mb-3 text-foreground tracking-tight">القسم مقفل للتعديل</h3>
              <p className="text-sm font-medium text-muted-foreground mb-8 leading-relaxed px-2">متجرك حالياً قيد المراجعة ولا يمكنك التعديل هنا. لتفعيل التعديلات الكاملة، يمكنك الشحن والاشتراك في إحدى الباقات لدعم متجرك.</p>
              <div className="flex w-full gap-3">
                <button onClick={() => setActiveTab('wallet')} className="flex-1 bg-white dark:bg-slate-700 border border-primary/20 text-primary dark:text-white font-bold py-3.5 rounded-2xl hover:bg-primary/5 dark:hover:bg-slate-600 transition shadow-sm text-sm">المحفظة</button>
                <button onClick={() => setActiveTab('subscription')} className="flex-[1.5] bg-primary text-white font-bold py-3.5 rounded-2xl hover:bg-primary/90 transition shadow-lg shadow-primary/20 hover:scale-[1.02] text-sm">باقات الاشتراك</button>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-12 custom-scrollbar relative">

          {isGuest && !isPending && (
            <div className="w-full mt-4 p-4 bg-primary/10 border border-indigo-200 text-indigo-700 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 z-40 font-bold text-sm shadow-sm relative">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 flex-shrink-0" />
                <span>أنت في وضع المعاينة (ضيف). يمكنك تصفح لوحة التحكم بحرية، ولكن لا يمكنك إجراء أي تعديلات.</span>
              </div>
              <button onClick={() => { localStorage.removeItem("suriix_guest_mode"); window.location.href = "/create-store"; }} className="bg-primary text-white px-6 py-2 rounded-xl text-xs hover:bg-indigo-700 transition flex-shrink-0 shadow-sm relative z-50">
                سجل الآن للحفظ
              </button>
            </div>
          )}

          {isPending && !showPendingModal && (
            <div className="w-full mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 z-40 font-bold text-sm shadow-sm relative">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 flex-shrink-0" />
                <span>متجرك غير مفعل. قم بشحن محفظتك وتجديد الاشتراك لتفعيل متجرك.</span>
              </div>
              <div className="flex items-center gap-2 relative z-50">
                <button onClick={() => { setActiveTab('wallet'); }} className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs hover:bg-amber-600 transition flex-shrink-0 shadow-sm">
                  اشحن رصيدك
                </button>
                <button onClick={() => { setActiveTab('subscription'); }} className="bg-white border border-amber-200 text-amber-700 px-4 py-2 rounded-xl text-xs hover:bg-amber-100 transition flex-shrink-0 shadow-sm dark:bg-[#0f172a]">
                  تجديد الباقة
                </button>
              </div>
            </div>
          )}

          {storeData.expiryWarningDays && storeData.expiryWarningDays > 0 && !isPending && (
            <div className="w-full mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex flex-col md:flex-row items-center justify-between gap-3 z-40 font-bold text-sm shadow-sm relative">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span>تحذير: باقتك ستنتهي في غضون {storeData.expiryWarningDays} يوم! يرجى تجديد الاشتراك لتجنب إيقاف المتجر.</span>
              </div>
              <button onClick={() => { setActiveTab('subscription'); }} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs hover:bg-red-600 transition flex-shrink-0 shadow-sm relative z-50">
                تجديد الاشتراك
              </button>
            </div>
          )}

          {/* INTERCEPT OVERLAY FOR PENDING ONLY (Overlays the content below the banner) */}
          {(isPending && !showPendingModal) && activeTab !== 'wallet' && activeTab !== 'subscription' && (
            <div className="absolute inset-0 top-[100px] z-[35] bg-transparent" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} />
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-2">

                {/* WELCOME BANNER */}
                <div className="w-full bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6] rounded-[20px] md:rounded-[24px] p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between text-white shadow-xl shadow-primary/10 relative overflow-hidden gap-5 md:gap-0">
                  {/* Background graphical elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 dark:bg-[#0f172a]"></div>
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                  <div className="z-10 text-right">
                    <h2 className="text-2xl md:text-4xl font-bold font-display mb-1 md:mb-2">مرحباً بك 👋<br /><span className="truncate block max-w-[220px] md:max-w-sm text-xl md:text-4xl">{storeData.name}</span></h2>
                    <p className="text-white/80 text-sm md:text-lg">متجرك جاهز، ابدأ بإضافة منتجاتك الآن</p>
                  </div>

                  <div className="z-10 flex items-center gap-2 md:gap-4 w-full md:w-auto">
                    <button onClick={() => window.open(`/store/${storeData.url}`, '_blank')} className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition font-bold flex items-center justify-center gap-2 text-sm md:text-base">
                      <ExternalLink className="w-4 h-4 md:w-5 md:h-5" /> زيارة المتجر
                    </button>
                    <button onClick={() => setActiveTab('products')} className="flex-1 md:flex-none px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-white text-primary hover:scale-105 shadow-lg transition font-bold flex items-center justify-center gap-2 text-sm md:text-base">
                      <Plus className="w-4 h-4 md:w-5 md:h-5" /> إضافة منتج
                    </button>
                  </div>
                </div>

                {/* TOP STAT CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={statBoxClasses}>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4"><PackageCheck className="w-6 h-6" /></div>
                    <span className="font-bold text-3xl text-foreground">{storeData?.products?.length || 0}</span>
                    <span className="text-sm text-muted-foreground mt-1 font-medium">إجمالي المنتجات</span>
                  </div>
                  <div className={statBoxClasses}>
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4"><ShoppingCart className="w-6 h-6" /></div>
                    <span className="font-bold text-3xl text-foreground">{storeData?.orders?.length || 0}</span>
                    <span className="text-sm text-muted-foreground mt-1 font-medium">الطلبات الواردة</span>
                  </div>
                  <div className={statBoxClasses}>
                    <div className="w-12 h-12 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4"><CreditCard className="w-6 h-6" /></div>
                    <span className="font-bold text-3xl text-foreground">{(storeData?.wallet_yer || storeData?.wallet || 0).toLocaleString()} <span className="text-lg">ر.ي</span></span>
                    <span className="text-sm text-muted-foreground mt-1 font-medium">إجمالي الأرباح</span>
                  </div>
                  <div className={statBoxClasses}>
                    <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-4"><Eye className="w-6 h-6" /></div>
                    <span className="font-bold text-3xl text-foreground">{storeData?.visitors || 0}</span>
                    <span className="text-sm text-muted-foreground mt-1 font-medium">زوار الموقع</span>
                  </div>
                </div>

                {/* MIDDLE SECTIONS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* QUICK ACTIONS */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-6 overflow-hidden h-full dark:border-slate-800">
                    <h3 className="font-bold text-lg mb-6 flex items-center justify-between">إجراءات سريعة</h3>
                    <div className="space-y-3">
                      {quickActions.map((action, idx) => (
                        <button key={idx} onClick={() => action.action === 'share' ? alert('تم نسخ رابط المتجر بنجاح!') : setActiveTab(action.action)} className="w-full flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border/60 bg-muted/30 hover:bg-white group transition dark:bg-[#0f172a]">
                          <span className="font-medium text-foreground group-hover:text-primary transition">{action.label}</span>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>
                            <action.icon className="w-4 h-4" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* CURRENT PRODUCTS / BEST SELLERS */}
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-6 lg:col-span-2 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">أفضل المنتجات مبيعاً</h3>
                        <p className="text-xs text-muted-foreground mt-1">عرض أكثر المنتجات طلباً هذا الشهر</p>
                      </div>
                      <button onClick={() => setActiveTab('products')} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">عرض الكل <ChevronLeft className="w-4 h-4" /></button>
                    </div>

                    <div className="space-y-4">
                      {(storeData.products && storeData.products.length > 0 ? storeData.products.slice(0, 3) : bestSellers).map((item: any, idx: number) => (
                        <div key={item.id || idx} className="flex items-center gap-4 bg-muted/20 p-3 rounded-2xl border border-transparent hover:border-border/50 transition">
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl overflow-hidden bg-white shrink-0 border border-border/40 shadow-sm dark:bg-[#0f172a] dark:border-slate-800">
                            {item.img && String(item.img).includes('http') ? <img src={item.img} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : <div className="animate-pulse">{item.img || '📦'}</div>}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-foreground">{item.name}</h4>
                            <span className="text-xs text-muted-foreground font-medium">{item.sales || Math.floor(Math.random() * 80) + 10} مبيعة</span>
                          </div>
                          <div className="text-left leading-tight">
                            <span className="block font-bold text-green-600 text-lg">{item.price ? `${Number(item.price).toLocaleString()} ر.ي` : item.rev}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTIONS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* LATEST ORDERS */}
                  <div className="bg-white rounded-2xl border border-border/40 shadow-sm p-6 dark:bg-[#0f172a] dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg">آخر الطلبات</h3>
                      <button onClick={() => setActiveTab('orders')} className="text-primary font-bold text-sm hover:underline">عرض الكل</button>
                    </div>
                    <div className="overflow-x-auto text-sm">
                      <table className="w-full text-right">
                        <thead>
                          <tr className="text-muted-foreground font-medium border-b border-border/50">
                            <th className="pb-3 px-2">الطلب</th>
                            <th className="pb-3">العميل</th>
                            <th className="pb-3">الحالة</th>
                            <th className="pb-3 text-left">الإجمالي</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {recentOrders.map(order => (
                            <tr key={order.id} className="hover:bg-muted/10">
                              <td className="py-4 px-2 font-bold font-mono">{order.id}</td>
                              <td className="py-4 font-medium">{order.name}</td>
                              <td className="py-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold
                                      ${order.status === 'مكتمل' ? 'bg-green-50 text-green-600' :
                                    order.status === 'قيد التنفيذ' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-4 text-left font-bold">{order.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* LATEST CUSTOMERS & STORE STATS GRAPHS BLOCK */}
                  <div className="space-y-6">

                    <div className="bg-white rounded-2xl border border-border/40 shadow-sm p-6 flex items-center justify-between group cursor-pointer hover:border-primary/50 transition dark:bg-[#0f172a] dark:border-slate-800">
                      <div>
                        <h3 className="font-bold text-lg mb-1 flex items-center gap-2">إحصائيات المتجر التفصيلية <TrendingUp className="w-5 h-5 text-primary" /></h3>
                        <p className="text-muted-foreground text-sm">شاهد الرسوم البيانية للمبيعات والزوار عبر لوحة التحليلات.</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
                        <BarChart3 className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-border/40 shadow-sm p-6 dark:bg-[#0f172a] dark:border-slate-800">
                      <h3 className="font-bold text-lg mb-4">أحدث العملاء</h3>
                      <div className="space-y-4">
                        {recentCustomers.map((cust, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border border-border/50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                {cust.avatar}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm dark:text-slate-200">{cust.name}</h4>
                                <p className="text-xs text-muted-foreground" dir="ltr">{cust.email}</p>
                              </div>
                            </div>
                            <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mt-3 sm:mt-0 w-fit">
                              {cust.orders} طلبات
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}


            {/* ACTIVE TAB RENDERER */}
            {activeTab === 'settings' && <SettingsTab storeData={storeData} onUpdateField={updateGlobalStoreField} />}
            {activeTab === 'products' && <ProductsTab storeData={storeData} products={storeData.products} onUpdate={(p: any[]) => updateGlobalStoreField('products', p)} />}
            {activeTab === 'categories' && <CategoriesTab categories={storeData.categories || []} products={storeData.products || []} onUpdate={(c) => updateGlobalStoreField('categories', c)} />}
            {activeTab === 'orders' && <OrdersTab storeData={storeData} />}
            {activeTab === 'customers' && <CustomersTab storeData={storeData} />}
            {activeTab === 'offers' && <OffersTab categories={storeData?.categories || []} products={storeData?.products || []} onUpdate={(o: any[]) => updateGlobalStoreField('offers', o)} />}
            {activeTab === 'coupons' && <CouponsTab coupons={storeData.coupons || []} categories={storeData.categories || []} onUpdate={(c) => updateGlobalStoreField('coupons', c)} />}
            {activeTab === 'banners' && <BannersTab storeData={storeData} banners={storeData.banners || []} categories={storeData.categories || []} onUpdate={(b) => updateGlobalStoreField('banners', b)} />}
            {activeTab === 'pages' && <StorePagesTab storeData={storeData} onUpdateField={updateGlobalStoreField} />}
            {activeTab === 'payment' && <PaymentTab storeData={storeData} onUpdateField={updateGlobalStoreField} />}
            {activeTab === 'subscription' && <SubscriptionTab subscriptionPlans={subscriptionPlans} storeData={storeData} onUpgrade={async (pkg, cost) => {
              const currentBalance = storeData.wallet_yer ?? storeData.wallet ?? 0;
              if (currentBalance >= cost) {
                const newWallet = currentBalance - cost;

                // Get the real authenticated user ID
                const { data: authData } = await supabase.auth.getSession();
                let uid = authData.session?.user?.id;

                if (!uid) {
                  try {
                    const localSess = JSON.parse(localStorage.getItem('suriix_auth_session') || '{}');
                    if (localSess && localSess.id) {
                      uid = localSess.id;
                    }
                  } catch (e) { }
                }

                // Fallback to store owner ID if auth session is missing but it's a real Supabase user
                if (!uid && storeData.id && !String(storeData.id).startsWith("local-")) {
                  const { data: stData } = await supabase.from('stores').select('owner_id').eq('id', storeData.id).maybeSingle();
                  uid = stData?.owner_id || storeData.owner_id || storeData.id;
                }

                // Subscription validity is 30 days
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);
                const expiryString = expiryDate.toISOString();

                if (uid) {
                  const { error } = await supabase.from('users').update({
                    wallet_yer: newWallet,
                    status: 'active',
                    subscription_ends_at: expiryString
                  }).eq('id', uid);
                  if (error) {
                    alert(`فشل تحديث الاشتراك: ${error.message}`);
                    return;
                  }
                }

                setStoreData(prev => ({ ...prev, wallet: newWallet, wallet_yer: newWallet, package: pkg, subscription_ends_at: expiryString, expiryWarningDays: null }));
                setIsPending(false);
                setShowPendingModal(false);
                try {
                  const existing = localStorage.getItem("suriix_added_stores");
                  if (existing) {
                    const list = JSON.parse(existing);
                    if (list && list.length > 0) {
                      list[0].status = 'active';
                      list[0].wallet = newWallet;
                      list[0].wallet_yer = newWallet;
                      list[0].tier = pkg;
                      list[0].subscription_name = pkg;
                      list[0].subscription_ends_at = expiryString;
                      // حفظ حد المنتجات بناءً على اسم الباقة للرجوع إليه لاحقاً
                      const limit = pkg.includes('المبتدئة') || pkg.includes('مبتدئة') ? 100
                        : pkg.includes('الأساسية') || pkg.includes('الاساسية') ? 500
                          : pkg.includes('الاحترافية') || pkg.includes('احترافية') || pkg.includes('VIP') ? 9999 : 20;
                      list[0].subscription_plan_limit = limit;
                      localStorage.setItem("suriix_added_stores", JSON.stringify(list));
                    }
                  }
                } catch (e) { }
                toast.success(`✅ تم الاشتراك بنجاح في خطة "${pkg}"! تم تفعيل حسابك.`);
              } else {
                toast.error('رصيدك غير كافٍ. يرجى شحن المحفظة أولاً أو التواصل مع الإدارة.');
              }
            }} />}
            {activeTab === 'wallet' && <WalletTabV3
              storeData={storeData}
              transactions={storeData.transactions || []}
              onTransfer={async (amount) => {
                const currentBal = parseFloat(String(storeData.wallet_yer || storeData.wallet || 0));
                const newWallet = currentBal - amount;
                if (storeData.id && !String(storeData.id).startsWith("local-")) {
                  const uid = (storeData as any).owner_id || storeData.id;
                  const { error: err1 } = await supabase.from('users').update({ wallet_yer: newWallet }).eq('id', uid);
                  const { error: err2 } = await supabase.from('withdrawal_requests').insert({
                    id: crypto.randomUUID ? crypto.randomUUID() : `wd_${Date.now()}`,
                    user_id: uid,
                    amount: amount,
                    status: 'pending'
                  });
                  if (err1 || err2) {
                    updateGlobalStoreField('wallet_yer', newWallet);
                    const txStr = localStorage.getItem('suriix_local_transactions') || '[]';
                    const ltx = JSON.parse(txStr);
                    ltx.push({ id: `wd_${Date.now()}`, user_id: uid, amount: amount, status: 'pending', created_at: new Date().toISOString(), users: { name: storeData.name, email: storeData.url } });
                    localStorage.setItem('suriix_local_transactions', JSON.stringify(ltx));
                    setStoreData(prev => ({ ...prev, wallet: newWallet, wallet_yer: newWallet }));
                    setSuccessModal({
                      title: "نجاح مبدئي",
                      message: `[قاعدة البيانات غير جاهزة] تم خصم ${amount.toLocaleString()} ر.ي وإرسال طلب السحب للإدارة محلياً بنجاح!`
                    });
                  } else {
                    setStoreData(prev => ({ ...prev, wallet: newWallet, wallet_yer: newWallet }));

                    // Notify Admin
                    await notification.send({
                      user_id: null,
                      role: 'admin',
                      type: 'wallet',
                      title: 'طلب تحويل رصيد (سحب)',
                      message: `يوجد طلب سحب/تحويل رصيد جديد بمبلغ ${amount} ر.ي من المتجر ${storeData.name}`,
                    });

                    setSuccessModal({
                      title: "تم إرسال الطلب بنجاح",
                      message: `تم إرسال طلب سحب وتحويل بمبلغ ${amount.toLocaleString()} ر.ي إلى إدارة النظام وهو قيد المراجعة حالياً.`
                    });
                  }
                } else {
                  const localRaw = localStorage.getItem('suriix_added_stores');
                  if (localRaw) {
                    const list = JSON.parse(localRaw);
                    const cleanId = String(storeData.id).replace('local-', '');
                    let didMatch = false;
                    const updated = list.map((s: any) => { if (String(s.id) === cleanId || s.owner === storeData.name) { didMatch = true; return { ...s, wallet: newWallet }; } return s; });
                    if (!didMatch && list.length > 0) updated[0].wallet = newWallet;
                    localStorage.setItem('suriix_added_stores', JSON.stringify(updated));
                    window.dispatchEvent(new StorageEvent('storage', { key: 'suriix_added_stores' }));
                  }
                  const txStr = localStorage.getItem('suriix_local_transactions') || '[]';
                  const ltx = JSON.parse(txStr);
                  ltx.push({ id: `tx_${Date.now()}`, sender_id: storeData.id, amount: -amount, type: 'transfer', description: 'تحويل رصيد للإدارة', created_at: new Date().toISOString(), users: { name: storeData.name, email: storeData.url } });
                  localStorage.setItem('suriix_local_transactions', JSON.stringify(ltx));
                  setStoreData(prev => ({ ...prev, wallet: newWallet }));
                  toast.success(`[ميزة تجريبية] تم خصم ${amount} ر.ي من محفظتك و تحويلها للإدارة بنجاح!`);
                }
              }}
              onRecharge={async (amount, currency) => {
                // Always use the real authenticated user UUID — never the store UUID
                const { data: authData } = await supabase.auth.getSession();
                let uid = authData.session?.user?.id;

                if (!uid) {
                  try {
                    const localSess = JSON.parse(localStorage.getItem('suriix_auth_session') || '{}');
                    if (localSess && localSess.id) uid = localSess.id;
                  } catch (e) { }
                }
                const isValidUUID = (v: any) => {
                  if (!v) return false;
                  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(v));
                };
                if (!isValidUUID(uid)) {
                  const ownerId = (storeData as any).owner_id;
                  if (isValidUUID(ownerId)) uid = ownerId;
                  else if (isValidUUID(storeData.id)) uid = storeData.id;
                }

                if (uid) {
                  try {
                    // Try direct insertion first, providing explicit ID in case the table lacks a default UUID generation rule
                    const genId = crypto.randomUUID ? crypto.randomUUID() : `req_${Date.now()}`;
                    const { error } = await supabase.from('recharge_requests').insert({
                      id: genId,
                      user_id: uid,
                      user_name: storeData.name || null,
                      user_email: storeData.url || null,
                      amount: amount,
                      status: 'pending'
                    });

                    if (error) {
                      // If RLS fails, fallback to edge function which skips RLS
                      if (error.message.includes("violates row-level security") || error.code === "42501") {
                        const { data: efData, error: efError } = await supabase.functions.invoke('create-recharge', {
                          body: { user_id: uid, amount: amount, user_name: storeData.name, user_email: storeData.url }
                        });
                        if (efError || efData?.error) {
                          throw new Error(efError?.message || efData?.error || error.message);
                        }
                      } else {
                        throw error;
                      }
                    }

                    // Notify Admin
                    await notification.send({
                      user_id: null,
                      role: 'admin',
                      type: 'wallet',
                      title: 'طلب شحن جديد',
                      message: `يوجد طلب شحن جديد بمبلغ ${amount} ر.ي من المتجر ${storeData.name}`,
                    });

                    setSuccessModal({
                      title: "تم إرسال طلب الشحن بنجاح",
                      message: `✅ تم إرسال طلب شحن بمبلغ ${amount.toLocaleString()} ر.ي إلى الإدارة، وهو قيد المراجعة حالياً.`
                    });
                  } catch (err: any) {
                    toast.error(`حدث خطأ أثناء إرسال الطلب: ${err.message}`);
                    console.error("Recharge insertion error:", err);
                  }
                } else {
                  // No authenticated user — guide to WhatsApp or show error
                  const waMsg = encodeURIComponent(`مرحباً، أود طلب شحن رصيد بمبلغ ${amount?.toLocaleString()} ر.ي لمتجر: ${storeData?.name || ''}`);
                  const waNumber = (storeData?.whatsapp || '').replace(/\D/g, '');
                  if (waNumber) {
                    window.open(`https://wa.me/${waNumber}?text=${waMsg}`, '_blank');
                    toast.success('تم فتح واتساب لإرسال طلب الشحن للدعم الفني.');
                  } else {
                    toast.error('يرجى تسجيل الدخول لإرسال طلب الشحن عبر النظام.');
                  }
                }
              }} />
            }
            {activeTab === 'support' && <SupportTab storeData={storeData} />}
            {activeTab === 'domain' && <DomainTab storeData={storeData} onUpdateField={updateGlobalStoreField} />}
            {activeTab === 'payment' && <PaymentTab storeData={storeData} onUpdateField={updateGlobalStoreField} />}


            {/* FALLBACK TABS */}
            {['overview', 'settings', 'products', 'categories', 'orders', 'customers', 'offers', 'coupons', 'banners', 'pages', 'wallet', 'subscription', 'support', 'payment', 'domain'].indexOf(activeTab) === -1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[500px] flex flex-col items-center justify-center text-center opacity-40">
                <Settings className="w-16 h-16 animate-spin-slow mb-4" />
                <h2 className="text-2xl font-bold mb-2">هذه الصفحة قيد التطوير</h2>
                <p className="text-muted-foreground">الصفحة الخاصة بـ {SidebarMenu.find(s => s.id === activeTab)?.label} لم يتم بناؤها بعد في إطار هذه المعاينة.</p>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>

      <AnimatePresence>
        {successModal && (
          <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
              dir="rtl"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

              <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full"></div>
                <CheckCircle2 className="w-12 h-12 relative z-10" />
              </div>

              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">
                {successModal.title}
              </h3>

              <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] leading-relaxed mb-8">
                {successModal.message}
              </p>

              <button
                onClick={() => setSuccessModal(null)}
                className="w-full py-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-900/10 active:scale-95"
              >
                حسناً، فهمت
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

const ActionModal = React.memo(({ title, isOpen, onClose, children }: { title: string, isOpen: boolean, onClose: () => void, children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl p-6 w-full max-w-md relative z-10 shadow-2xl border border-border/50 dark:bg-[#0f172a]" dir="rtl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full"><XCircle className="w-5 h-5 text-muted-foreground" /></button>
          </div>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
));



const ProductsTab = React.memo(({ storeData, products: initialProducts, onUpdate }: { storeData?: any, products: any[], onUpdate?: (p: any[]) => void }) => {
  const [localProducts, setLocalProducts] = useState(() => {
    // أولوية: جلب من localStorage مباشرة لضمان الثبات بعد إعادة التشغيل
    try {
      const s = localStorage.getItem('suriix_added_stores');
      if (s) {
        const list = JSON.parse(s);
        if (list && list.length > 0 && Array.isArray(list[0].products)) {
          return list[0].products;
        }
      }
    } catch { }
    return initialProducts || [];
  });

  // مزامنة: إذا تغيّرت البيانات الخارجية (مثل بعد load) نحدّث localProducts
  React.useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        const storeId = storeData?.id;
        if (storeId && !String(storeId).startsWith('local-')) {
          const { data, error } = await supabase.from('products').select('*').eq('store_id', storeId);
          if (data && !error && data.length > 0) {
            const mappedProducts = data.map((d: any) => ({ id: d.id, name: d.name, desc: d.description, price: d.price, discountPrice: d.discount_price, img: d.img, category: d.category_id, stock: d.stock, sales: d.sales_count, is_active: d.is_active, is_new: d.is_new, is_best_seller: d.is_best_seller }));
            setLocalProducts(mappedProducts);

            // also sync localstorage 
            const s = localStorage.getItem('suriix_added_stores');
            if (s) {
              const list = JSON.parse(s);
              if (list && list.length > 0) {
                list[0].products = mappedProducts;
                localStorage.setItem('suriix_added_stores', JSON.stringify(list));
              }
            }
            return;
          }
        }
      } catch (err) { }

      try {
        const s = localStorage.getItem('suriix_added_stores');
        if (s) {
          const list = JSON.parse(s);
          if (list && list.length > 0 && Array.isArray(list[0].products)) {
            setLocalProducts(list[0].products);
            return;
          }
        }
      } catch { }
      if (initialProducts && initialProducts.length > 0) {
        setLocalProducts(initialProducts);
      }
    };
    fetchRealProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialProducts), storeData?.id]);

  const maxProducts = React.useMemo(() => {
    // القراءة المباشرة من localStorage أكثر موثوقية من storeData.package
    // لأن storeData.package قد يُعاد ضبطه على "تم تفعيل باقة" من Supabase
    let pkgName = '';
    try {
      const store = JSON.parse(localStorage.getItem('suriix_added_stores') || '[]')[0];
      pkgName = store?.tier || store?.subscription_name || '';
      // إذا وجدنا حد مخزون مباشرة، نستخدمه
      if (store?.subscription_plan_limit) return parseInt(store.subscription_plan_limit);
    } catch { }

    if (!pkgName) pkgName = storeData?.package || '';

    // باقات قاعدة البيانات: المبتدئة = 100, الأساسية = 500, الاحترافية = غير محدود
    if (pkgName.includes('المبتدئة') || pkgName.includes('مبتدئة') || pkgName.toLowerCase().includes('starter')) return 100;
    if (pkgName.includes('الأساسية') || pkgName.includes('الاساسية') || pkgName.toLowerCase().includes('basic')) return 500;
    if (pkgName.includes('الاحترافية') || pkgName.includes('احترافية') || pkgName.includes('VIP') || pkgName.toLowerCase().includes('pro')) return 9999;

    // دعم الأسماء القديمة (legacy)
    if (pkgName.includes('شهر') && !pkgName.includes('شهرين') && !pkgName.includes('أشهر')) return 100;
    if (pkgName.includes('شهرين')) return 250;
    if (pkgName.includes('6 أشهر') || pkgName.includes('سنة')) return 9999;

    return 20; // الباقة الافتراضية/المجانية
  }, [storeData?.package]);

  const currentCount = localProducts.length;
  const progressPercent = Math.min((currentCount / maxProducts) * 100, 100);
  const isLimitReached = currentCount >= maxProducts;
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState<any>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const [category, setCategory] = useState('');
  const [section, setSection] = useState('');

  const openEdit = (product: any) => {
    setEditId(product.id);
    setName(product.name || '');
    setPrice(product.price || '');
    setDiscountPrice(product.discountPrice || '');
    setDesc(product.desc || '');
    setImg(product.img || '');
    setCategory(product.category || '');
    setSection(product.section || '');
    setIsOpen(true);
  };

  const resetForm = () => {
    setName(''); setPrice(''); setDiscountPrice(''); setDesc(''); setImg(''); setCategory(''); setSection(''); setEditId(null); setIsOpen(false);
  };

  // Load categories from store data in localStorage
  const storeCategories: any[] = (() => {
    try { const s = localStorage.getItem('suriix_added_stores'); return s ? (JSON.parse(s)[0]?.categories || []) : []; } catch { return []; }
  })();

  // تحميل الأقسام المخصصة ديناميكياً من storeData أو localStorage
  const [customSections, setCustomSections] = useState<any[]>(() => {
    try { const s = localStorage.getItem('suriix_added_stores'); return s ? (JSON.parse(s)[0]?.customSections || []) : []; } catch { return []; }
  });

  React.useEffect(() => {
    // إعادة تحميل الأقسام من storeData كلما تغيّرت
    const latest = storeData?.customSections;
    if (latest && Array.isArray(latest)) {
      setCustomSections(latest);
    } else {
      try {
        const s = localStorage.getItem('suriix_added_stores');
        const sections = s ? (JSON.parse(s)[0]?.customSections || []) : [];
        setCustomSections(sections);
      } catch { }
    }
  }, [storeData?.customSections]);

  const sync = async (updated: any[]) => {
    setLocalProducts(updated);
    try {
      const s = localStorage.getItem('suriix_added_stores');
      if (s) {
        const list = JSON.parse(s);
        if (list && list.length > 0) {
          list[0].products = updated;
          localStorage.setItem('suriix_added_stores', JSON.stringify(list));
        }
      }
    } catch { }
    if (onUpdate) onUpdate(updated);
  }

  const handleAdd = async () => {
    if (name && price) {
      let finalProds = [...localProducts];

      if (editId) {
        // update supabase first
        if (storeData?.id && !String(storeData.id).startsWith('local-')) {
          const mappedOut = { name, price: price ? parseFloat(price) : null, discount_price: discountPrice ? parseFloat(discountPrice) : null, description: desc, category_id: null, img: img || '📦', section: section || null };
          const { error } = await supabase.from('products').update(mappedOut).eq('id', editId);
          if (error) {
            console.error("Update error:", error);
            alert("فشل تحديث المنتج. تأكد من اتصالك.");
            return;
          }
        }

        finalProds = finalProds.map(p => p.id === editId ? { ...p, name, price, discountPrice, desc, category: category || 'عام', section: section || '', img: img || '📦' } : p);
        sync(finalProds);
      } else {
        const newId = storeData?.id && !String(storeData.id).startsWith('local-') ? crypto.randomUUID() : Date.now();
        const newProd = { id: newId, name, price, discountPrice, desc, category: category || 'عام', section: section || '', img: img || '📦', sales: 0 };

        // insert into supabase first
        if (storeData?.id && !String(storeData.id).startsWith('local-')) {
          const smappedIn = { id: newId, store_id: storeData.id, name, price: price ? parseFloat(price) : null, discount_price: discountPrice ? parseFloat(discountPrice) : null, description: desc, category_id: null, img: img || '📦', stock: 100, is_active: true, section: section || null };
          const { error } = await supabase.from('products').insert([smappedIn]);
          if (error) {
            console.error("Insert error:", error);
            alert("فشل إضافة المنتج. تحقق من أذونات قاعدة البيانات.");
            return;
          }
        }

        finalProds = [newProd, ...finalProds];
        sync(finalProds);
      }
      resetForm();
    }
  };

  const fileToDataUri = (file: File) => new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12">
      <ActionModal title={editId ? "تعديل المنتج" : "إضافة منتج جديد"} isOpen={isOpen} onClose={resetForm}>
        <div className="space-y-4 text-sm font-bold">
          <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="اسم المنتج (مثال: عطر مخلط)" className="w-full bg-muted/50 p-3.5 rounded-xl border border-border/50 focus:border-primary outline-none transition" />
          <div className="flex gap-4">
            <input value={price} onChange={e => setPrice(e.target.value)} type="number" placeholder="السعر الأساسي (ر.ي)" className="w-full bg-muted/50 p-3.5 rounded-xl border border-border/50 focus:border-primary outline-none transition" />
            <input value={discountPrice} onChange={e => setDiscountPrice(e.target.value)} type="number" placeholder="السعر بعد الخصم (ر.ي)" className="w-full bg-muted/50 p-3.5 rounded-xl border border-border/50 focus:border-primary outline-none transition text-primary" />
          </div>
          <div className="flex gap-4">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-1/2 bg-muted/50 p-3.5 rounded-xl border border-border/50 focus:border-primary outline-none transition"
            >
              <option value="">-- اختر التصنيف --</option>
              {storeCategories.length > 0 ? (
                storeCategories.map((c: any, i: number) => (
                  <option key={i} value={c.name || c.n}>{c.name || c.n}</option>
                ))
              ) : (
                <>
                  <option value="عام">عام</option>
                  <option value="عطور">عطور</option>
                  <option value="ملابس">ملابس</option>
                  <option value="إلكترونيات">إلكترونيات</option>
                  <option value="إكسسوارات">إكسسوارات</option>
                </>
              )}
            </select>
            <select
              value={section}
              onChange={e => setSection(e.target.value)}
              className="w-1/2 bg-muted/50 p-3.5 rounded-xl border border-border/50 focus:border-primary outline-none transition"
            >
              <option value="">-- بدون قسم ترويجي --</option>
              <option value="newarrivals">وصل حديثاً</option>
              <option value="bestsellers">الأكثر طلباً</option>
              <option value="offers">عروض لا تفوت</option>
              <option value="featured">المنتجات المميزة</option>
              {customSections.map((cs: any) => (
                <option key={cs.id} value={cs.id}>{cs.title}</option>
              ))}
            </select>
          </div>
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="وصف المنتج التفصيلي..." rows={3} className="w-full bg-muted/50 p-3.5 rounded-xl border border-border/50 focus:border-primary outline-none transition resize-none"></textarea>

          <label className="flex items-center gap-3 bg-muted/50 p-3.5 rounded-xl border border-border/50 cursor-pointer hover:bg-muted transition">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-border/50 overflow-hidden text-2xl dark:bg-[#0f172a]">{img && img.includes('data') ? <img src={img} className="w-full h-full object-cover" /> : img || '📦'}</div>
            <div className="flex-1 text-muted-foreground font-medium">أضف صورة للمنتج</div>
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => { if (e.target.files && e.target.files[0]) { setImg(await fileToDataUri(e.target.files[0])); } }} />
          </label>

          <button onClick={handleAdd} className="w-full bg-primary text-white p-3.5 rounded-xl font-bold hover:bg-[#4F46E5] transition mt-2 shadow-lg shadow-primary/20">{editId ? "حفظ التعديلات" : "نشر المنتج"}</button>
        </div>
      </ActionModal>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border/40 shadow-sm flex-wrap gap-4 dark:bg-[#0f172a] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-50 text-primary rounded-xl flex items-center justify-center"><ShoppingBag className="w-6 h-6" /></div>
          <div>
            <h2 className="text-xl font-bold">المنتجات</h2>
            <p className="text-sm text-muted-foreground mt-1">إدارة منتجاتك، أسعارها، والمخزون بصورة احترافية.</p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col gap-2 min-w-[200px]">
            <div className="flex justify-between text-xs font-bold font-mono">
              <span className={isLimitReached ? 'text-red-500' : 'text-primary'}>المتبقي {maxProducts - currentCount}</span>
              <span className="text-muted-foreground">الحد الكلي {maxProducts}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden flex flex-row-reverse">
              <div
                className={`h-full rounded-full transition-all duration-300 ${isLimitReached ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-primary shadow-[0_0_8px_rgba(79,70,229,0.5)]'}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={() => {
              if (isLimitReached) {
                alert(`لقد وصلت للحد الأقصى المسموح (${maxProducts} منتج) لبامتك الحالية. يرجى الترقية لإضافة المزيد.`);
                return;
              }
              resetForm(); setIsOpen(true);
            }}
            className={`px-5 py-2.5 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-lg ${isLimitReached ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-primary hover:opacity-90 shadow-primary/20'}`}
          >
            <Plus className="w-5 h-5" /> إضافة منتج جديد
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden dark:bg-[#0f172a] dark:border-slate-800">
        <table className="w-full text-right cursor-default">
          <thead className="bg-[#F4F7FB] border-b border-border/50">
            <tr className="text-muted-foreground font-medium text-sm">
              <th className="py-4 px-6">المنتج</th>
              <th className="py-4 px-6">التصنيف</th>
              <th className="py-4 px-6">القسم</th>
              <th className="py-4 px-6">السعر</th>
              <th className="py-4 px-6">المخزون</th>
              <th className="py-4 px-6 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {localProducts.map((p, i) => (
              <tr key={p.id || i} className="hover:bg-muted/10 transition group">
                <td className="py-4 px-6 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white border border-border/50 shadow-sm flex items-center justify-center text-xl overflow-hidden shrink-0 dark:bg-[#0f172a]">
                    {p.img && (String(p.img).includes('http') || String(p.img).includes('data')) ? <img src={p.img} loading="lazy" decoding="async" className="w-full h-full object-cover" /> : p.img || '📦'}
                  </div>
                  <span className="font-bold text-base line-clamp-1">{p.name}</span>
                </td>
                <td className="py-4 px-6 text-sm font-medium">{p.category || 'عام'}</td>
                <td className="py-4 px-6 text-xs font-medium">
                  {p.section ? (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg">
                      {customSections.find((cs: any) => cs.id === p.section)?.title ||
                        (p.section === 'featured' ? 'مميز' : p.section === 'bestsellers' ? 'الأكثر طلباً' : p.section === 'newarrivals' ? 'جديد' : p.section === 'offers' ? 'عروض' : p.section)}
                    </span>
                  ) : <span className="text-slate-300 text-xs">—</span>}
                </td>
                <td className="py-4 px-6 font-black text-primary">{p.discountPrice ? <span className="flex flex-col"><span>{Number(p.discountPrice).toLocaleString()} ر.ي</span><span className="text-xs text-muted-foreground line-through font-normal">{Number(p.price).toLocaleString()} ر.ي</span></span> : p.price ? `${Number(p.price).toLocaleString()} ر.ي` : 'N/A'}</td>
                <td className="py-4 px-6">
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold">متوفر</span>
                </td>
                <td className="py-4 px-6 flex justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  <button onClick={() => openEdit(p)} className="p-2 text-primary hover:bg-primary/10 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={async () => {
                    if (confirm('متأكد من حذف المنتج؟')) {
                      if (storeData?.id && !String(storeData.id).startsWith('local-') && p.id) {
                        const { error } = await supabase.from('products').delete().eq('id', p.id);
                        if (error) {
                          alert("فشل حذف المنتج من قاعدة البيانات.");
                          return;
                        }
                      }
                      sync(localProducts.filter((_, idx) => idx !== i));
                    }
                  }} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {localProducts.length === 0 && (
              <tr><td colSpan={5} className="text-center py-20 text-muted-foreground font-medium"><ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />لا توجد منتجات بعد. ابدأ بإضافة أول منتج لمتجرك حتى يظهر للعملاء.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
});

const CustomSectionsManager = React.memo(({ storeData, onUpdateField }: { storeData: any, onUpdateField: (f: string, v: any) => void }) => {
  const customSections: any[] = storeData.customSections || [];
  const [newTitle, setNewTitle] = useState('');

  const addSection = () => {
    if (!newTitle.trim()) return;
    const id = `custom_${Date.now()}`;
    const updated = [...customSections, { id, title: newTitle.trim() }];
    onUpdateField('customSections', updated);
    setNewTitle('');
  };

  const removeSection = (id: string) => {
    onUpdateField('customSections', customSections.filter((s: any) => s.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-border/40 shadow-sm space-y-4 mt-6 dark:bg-[#0f172a] dark:border-slate-800">
      <h3 className="font-bold text-lg flex items-center gap-2"><Plus className="w-5 h-5 text-primary" /> إضافة قسم ترويجي مخصص</h3>
      <p className="text-sm text-muted-foreground">أضف أقساماً جديدة تظهر في الواجهة الرئيسية للمتجر وخصص ما يظهر فيها من منتجات.</p>
      <div className="flex gap-3">
        <input
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSection()}
          type="text"
          placeholder="اسم القسم الجديد (مثال: أفضل منتجاتنا 🔥)"
          className="flex-1 bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-primary transition font-bold"
        />
        <button onClick={addSection} className="px-5 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition flex items-center gap-2 shrink-0">
          <Plus className="w-5 h-5" /> إضافة
        </button>
      </div>
      {customSections.length > 0 && (
        <div className="space-y-2 mt-2">
          {customSections.map((s: any) => (
            <div key={s.id} className="flex items-center justify-between bg-muted/30 p-3.5 rounded-xl border border-border/40 dark:border-slate-800">
              <span className="font-bold text-sm">{s.title}</span>
              <button onClick={() => removeSection(s.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const CategoriesTab = React.memo(({ categories, products, onUpdate }: { categories: any[], products?: any[], onUpdate: (c: any[]) => void }) => {
  const defaultCats = [
    { n: 'عطور', icon: '🌹', count: 0 },
    { n: 'ملابس', icon: '👕', count: 0 },
    { n: 'إلكترونيات', icon: '📱', count: 0 },
    { n: 'إكسسوارات', icon: '⌚', count: 0 },
    { n: 'أجهزة', icon: '🏠', count: 0 },
    { n: 'أخرى', icon: '📦', count: 0 }
  ];
  const cats = (categories && categories.length > 0) ? categories : defaultCats;
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [img, setImg] = useState('');

  const sync = (updated: any[]) => { onUpdate(updated); };

  const fileToDataUri = (file: File) => new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12">
      <ActionModal title="تصنيف جديد" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4 text-sm font-bold">
          <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="اسم التصنيف (مثال: عطور نسائية)" className="w-full bg-muted/50 p-3.5 rounded-xl border border-border/50 focus:border-blue-500 outline-none transition" />

          <label className="flex items-center gap-3 bg-muted/50 p-3.5 rounded-xl border border-border/50 cursor-pointer hover:bg-muted transition">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-border/50 overflow-hidden text-2xl dark:bg-[#0f172a]">{img && img.includes('data') ? <img src={img} className="w-full h-full object-cover" /> : img || '📦'}</div>
            <div className="flex-1 text-muted-foreground font-medium text-right">أضف رمزاً أو صورة (اختياري)</div>
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => { if (e.target.files && e.target.files[0]) { setImg(await fileToDataUri(e.target.files[0])); } }} />
          </label>

          <button onClick={() => { if (name) { sync([...cats, { n: name, img: img, icon: img ? '' : '📦', count: 0 }]); setName(''); setImg(''); setIsOpen(false); } }} className="w-full bg-blue-500 text-white p-3.5 rounded-xl font-bold hover:bg-blue-600 transition">حفظ التصنيف</button>
        </div>
      </ActionModal>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border/40 shadow-sm dark:bg-[#0f172a] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><Layers className="w-6 h-6" /></div>
          <div><h2 className="text-xl font-bold">التصنيفات</h2><p className="text-sm text-muted-foreground mt-1">نظم منتجاتك في أقسام ليسهل العثور عليها. التغييرات تظهر مباشرة في المتجر.</p></div>
        </div>
        <button onClick={() => setIsOpen(true)} className="px-5 py-2.5 bg-blue-500 text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition"><Plus className="w-5 h-5" /> تصنيف جديد</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cats.map((c, i) => {
          const categoryProductCount = products ? products.filter((p: any) => p.category === c.n).length : (c.count || 0);
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-border/40 flex items-center justify-between shadow-sm hover:border-primary/50 transition dark:bg-[#0f172a] dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl overflow-hidden shadow-sm border border-border/50">
                  {c.img && (typeof c.img === 'string' && c.img.includes('data')) ? <img src={c.img} className="w-full h-full object-cover" /> : c.icon || '📦'}
                </div>
                <div><h3 className="font-bold text-lg">{c.n}</h3><p className="text-sm text-muted-foreground mt-1">{categoryProductCount} منتجات</p></div>
              </div>
              <div onClick={() => { if (confirm('حذف هذا التصنيف؟')) sync(cats.filter((_, idx) => idx !== i)); }} className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition cursor-pointer"><Trash2 className="w-4 h-4" /></div>
            </div>
          )
        })}
      </div>
    </motion.div>
  );
});


const OrdersTab = React.memo(({ storeData }: { storeData?: any }) => {
  const [ords, setOrds] = useState<any[]>([]);

  React.useEffect(() => {
    const storeOrdersKey = `suriix_store_orders_${storeData?.id || (storeData as any)?.store_id}`;
    const savedOrders = JSON.parse(localStorage.getItem(storeOrdersKey) || '[]');
    if (savedOrders.length > 0) {
      setOrds(savedOrders);
    } else {
      setOrds([
        { id: "#1004", cus: "خالد محمد", sta: "مكتمل", val: "450 ر.ي", d: "الجمعة 10:30 ص" },
        { id: "#1003", cus: "سارة العلي", sta: "قيد التنفيذ", val: "1,200 ر.ي", d: "أمس 04:15 م" },
        { id: "#1002", cus: "عبدالله العتيبي", sta: "ملغي", val: "299 ر.ي", d: "05 أكتوبر" }
      ]);
    }
  }, [storeData?.id]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12">
      <ActionModal title={`تفاصيل الطلب ${selectedOrder?.id || ''}`} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4 text-sm font-medium">
          <p className="text-lg">اسم العميل : <span className="font-bold">{selectedOrder?.cus}</span></p>
          <p className="text-lg">الإجمالي : <span className="font-bold text-green-600">{selectedOrder?.val}</span></p>
          <p className="text-lg">الحالة: <span className="font-bold text-primary">{selectedOrder?.sta}</span></p>
          <button onClick={() => { alert('تم تحديث الطلب.'); setIsOpen(false); }} className="w-full bg-green-500 text-white p-3.5 rounded-xl font-bold mt-4">إتمام الطلب</button>
          <button onClick={() => { alert('تم إلغاء الطلب.'); setIsOpen(false); }} className="w-full bg-red-100 text-red-600 p-3.5 rounded-xl font-bold">إلغاء الطلب</button>
        </div>
      </ActionModal>
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border/40 shadow-sm dark:bg-[#0f172a] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center"><ShoppingCart className="w-6 h-6" /></div>
          <div><h2 className="text-xl font-bold">الطلبات</h2><p className="text-sm text-muted-foreground mt-1">تتبع ومعالجة طلبات العملاء.</p></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden dark:bg-[#0f172a] dark:border-slate-800">
        <table className="w-full text-right text-sm">
          <thead className="bg-[#F4F7FB] border-b border-border/50">
            <tr className="text-muted-foreground font-medium"><th className="py-4 px-6">رقم الطلب</th><th className="py-4 px-6">العميل</th><th className="py-4 px-6">التاريخ</th><th className="py-4 px-6">الإجمالي</th><th className="py-4 px-6">الحالة</th></tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {ords.map((o, i) => (
              <tr onClick={() => { setSelectedOrder(o); setIsOpen(true); }} key={i} className="hover:bg-muted/10 transition cursor-pointer">
                <td className="py-4 px-6 font-bold font-mono text-primary">{o.id}</td>
                <td className="py-4 px-6 font-bold">{o.cus}</td>
                <td className="py-4 px-6 text-muted-foreground">{o.d}</td>
                <td className="py-4 px-6 font-black">{o.val}</td>
                <td className="py-4 px-6"><span className={`px-3 py-1 rounded-md font-bold text-xs ${o.sta === 'مكتمل' ? 'bg-green-50 text-green-600' : o.sta === 'قيد التنفيذ' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{o.sta}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
});

const OffersTab = React.memo(({ categories, products, onUpdate }: { categories: any[], products: any[], onUpdate: (o: any[]) => void }) => {
  const storeId = (() => { try { const s = localStorage.getItem('suriix_added_stores'); return s ? JSON.parse(s)[0]?.id || 'default' : 'default'; } catch { return 'default'; } })();
  const allCategories = categories || [];
  const allProducts = products || [];

  const OFFERS_KEY = `suriix_offers_${storeId}`;
  const [offers, setOffers] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem(OFFERS_KEY) || '[]'); } catch { return []; }
  });

  const saveOffers = (next: any[]) => {
    setOffers(next);
    localStorage.setItem(OFFERS_KEY, JSON.stringify(next));
    if (onUpdate) onUpdate(next);
    // Also embed in store data so PublicStore can read it
    try {
      const str = localStorage.getItem('suriix_added_stores');
      if (str) { const list = JSON.parse(str); if (list.length > 0) { list[0].offers = next; localStorage.setItem('suriix_added_stores', JSON.stringify(list)); } }
    } catch { }
  };

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', discount: '' });
  const [formError, setFormError] = useState('');

  const handleCreate = () => {
    if (!form.name.trim()) { setFormError('أدخل اسم العرض'); return; }
    if (!form.category) { setFormError('اختر التصنيف'); return; }
    const newOffer = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      discount: Number(form.discount) || 0,
      productIds: allProducts.filter((p: any) => p.category === form.category || (p.cat && p.cat === form.category)).map((p: any) => String(p.id)),
    };
    saveOffers([...offers, newOffer]);
    setForm({ name: '', category: '', discount: '' });
    setFormError('');
    setIsOpen(false);
  };

  const toggleProduct = (offerId: number, productId: string) => {
    saveOffers(offers.map((o: any) => {
      if (o.id !== offerId) return o;
      const ids: string[] = o.productIds || [];
      return { ...o, productIds: ids.includes(productId) ? ids.filter((id: string) => id !== productId) : [...ids, productId] };
    }));
  };

  const deleteOffer = (offerId: number) => {
    if (!confirm('حذف هذا العرض؟')) return;
    saveOffers(offers.filter((o: any) => o.id !== offerId));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12">

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border/40 shadow-sm dark:bg-[#0f172a] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><Tag className="w-6 h-6" /></div>
          <div><h2 className="text-xl font-bold">العروض والخصومات</h2><p className="text-sm text-muted-foreground mt-1">عروض ترويجية على المنتجات والتصنيفات في المناسبات.</p></div>
        </div>
        <button onClick={() => setIsOpen(true)} className="px-5 py-2.5 bg-rose-500 text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition"><Plus className="w-5 h-5" /> عرض جديد</button>
      </div>

      {/* Create Offer Modal */}
      <ActionModal title="إنشاء عرض جديد" isOpen={isOpen} onClose={() => { setIsOpen(false); setFormError(''); }}>
        <div className="space-y-4 text-sm font-bold">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">اسم العرض</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="مثال: تصفيات الصيف 🌞"
              className="w-full bg-muted/50 p-3.5 rounded-xl border border-border/50 outline-none focus:border-rose-400 transition"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">التصنيف المرتبط</label>
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full bg-muted/50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-border/50 outline-none focus:border-rose-400 transition"
            >
              <option value="">-- اختر تصنيفاً --</option>
              {allCategories.length > 0 ? (
                allCategories.map((c: any, i: number) => <option key={i} value={c.name || c.n}>{c.name || c.n}</option>)
              ) : (
                <option disabled value="">لا توجد تصنيفات — أضف من قسم التصنيفات</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">نسبة الخصم (%)</label>
            <input
              type="number"
              value={form.discount}
              onChange={e => setForm(f => ({ ...f, discount: e.target.value }))}
              placeholder="مثال: 20"
              min={0} max={100}
              className="w-full bg-muted/50 p-3.5 rounded-xl border border-border/50 outline-none focus:border-rose-400 transition"
            />
          </div>
          {formError && <p className="text-rose-500 text-xs font-bold bg-rose-50 p-2 rounded-lg">{formError}</p>}
          <button onClick={handleCreate} className="w-full bg-rose-500 text-white p-3.5 rounded-xl font-bold hover:opacity-90 transition">حفظ العرض</button>
        </div>
      </ActionModal>

      {/* Empty State */}
      {offers.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-border/40 shadow-sm flex flex-col items-center dark:bg-[#0f172a] dark:border-slate-800">
          <div className="w-20 h-20 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mb-4"><Tag className="w-10 h-10" /></div>
          <h3 className="font-bold text-xl">لا توجد عروض نشطة</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">قم بإنشاء عروض ترويجية لزيادة مبيعاتك في المواسم والأعياد.</p>
        </div>
      )}

      {/* Offer Cards */}
      {offers.map((offer: any) => {
        const offerProducts = allProducts.filter((p: any) => p.category === offer.category || (p.cat && p.cat === offer.category) || (offer.productIds || []).includes(String(p.id)));
        const selectedIds: string[] = offer.productIds || [];
        return (
          <div key={offer.id} className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden dark:bg-[#0f172a] dark:border-slate-800">
            {/* Offer Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/30 bg-gradient-to-r from-rose-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center"><Tag className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-rose-700 text-base">{offer.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">التصنيف: {offer.category} · خصم: {offer.discount || 0}%</p>
                </div>
              </div>
              <button onClick={() => deleteOffer(offer.id)} className="w-9 h-9 flex items-center justify-center rounded-xl text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition"><Trash2 className="w-4 h-4" /></button>
            </div>

            {/* Products in this category */}
            <div className="p-5">
              <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wide">منتجات التصنيف — حدد المنتجات المشمولة في العرض:</p>
              {offerProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-4">لا توجد منتجات في هذا التصنيف بعد. أضف منتجات من قسم المنتجات.</p>
              ) : (
                <div className="space-y-2">
                  {offerProducts.map((product: any) => {
                    const pid = String(product.id);
                    const checked = selectedIds.includes(pid);
                    return (
                      <label key={pid} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition select-none ${checked ? 'border-rose-300 bg-rose-50' : 'border-border/40 hover:bg-muted/30 dark:border-slate-800'}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleProduct(offer.id, pid)}
                          className="w-4 h-4 accent-rose-500 rounded shrink-0"
                        />
                        {product.img && <img src={product.img} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-border/30 shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.price} ر.ي {checked && offer.discount > 0 && <span className="text-rose-500 font-bold">← {Math.round(product.price * (1 - offer.discount / 100))} ر.ي بعد الخصم</span>}</p>
                        </div>
                        {checked && <span className="text-xs font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shrink-0">مشمول</span>}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
});


const WalletTab = React.memo(({ storeData, onUpgrade }: { storeData: any, onUpgrade: (pkg: string, cost: number) => void }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto pt-4 pb-12">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 dark:bg-[#0f172a]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="z-10 text-center md:text-right mb-6 md:mb-0 max-w-sm">
          <h2 className="text-3xl font-black mb-2 flex items-center justify-center md:justify-start gap-2"><CreditCard className="w-8 h-8" /> المحفظة الإلكترونية</h2>
          <p className="text-white/90 font-medium leading-relaxed">يمكنك استخدام الرصيد الحالي لدفع رسوم الاشتراكات وتفعيل متجرك بشكل فوري.</p>
        </div>
        <div className="z-10 flex flex-col items-center bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:bg-[#0f172a]">
          <span className="text-5xl font-black mb-1 drop-shadow-md" dir="ltr">{Number(storeData?.wallet || 0).toLocaleString()} <span className="text-2xl font-bold">ر.ي</span></span>
          <span className="bg-white/20 px-4 py-1 text-sm font-bold rounded-full border border-white/30 backdrop-blur-sm mt-3 flex items-center gap-2 tracking-wide dark:bg-[#0f172a]">
            <CheckCircle2 className="w-4 h-4" /> الرصيد المتاح
          </span>
        </div>
      </div>

      {/* Subscription Plans Section */}
      <div className="mt-12">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-black text-slate-800 mb-3 dark:text-white">اختر الباقة المناسبة لمتجرك</h3>
          <p className="text-muted-foreground text-lg">باقات مرنة صُممت لتلبي احتياجات نمو أعمالك مهما كان حجمها.</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center max-w-6xl mx-auto">

          {/* 1. باقة الانطلاقة */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-[#0f172a] dark:border-slate-800">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Rocket className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2 dark:text-white">باقة الانطلاقة</h4>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px] dark:text-slate-300">مثالية للبدء في عالم التجارة الإلكترونية وتأسيس متجرك بكل سهولة.</p>
            <div className="mb-8 border-b border-slate-100 pb-8">
              <span className="text-4xl font-black text-slate-800 dark:text-white" dir="ltr">8,000</span>
              <span className="text-sm font-bold text-slate-400 mr-2 dark:text-slate-300">ر.ي / شهر</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-sm font-bold text-slate-700 dark:text-white">
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> حتى 100 منتج</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> دومين فرعي مجاني</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> إدارة الطلبات والعملاء</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> كوبونات وخصومات</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> تحليلات أساسية</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> دعم فني</li>
            </ul>
            <button
              onClick={() => { if (confirm('تأكيد اختيار باقة الانطلاقة بقيمة 8,000 ر.ي؟')) onUpgrade('الانطلاقة', 8000); }}
              className={`w-full py-4 rounded-xl font-black transition-all ${storeData.wallet >= 8000 ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:text-white dark:bg-[#0f172a]' : 'bg-slate-50 text-slate-400 cursor-not-allowed dark:bg-[#0f172a] dark:text-slate-300'}`}
              disabled={storeData.wallet < 8000}
            >
              {storeData.wallet >= 8000 ? 'اشترك الآن' : 'رصيد غير كافٍ'}
            </button>
          </div>

          {/* 2. باقة النمو (الأكثر اختياراً) */}
          <div className="bg-white rounded-[2rem] border-2 border-primary shadow-2xl shadow-primary/20 p-10 flex flex-col relative transition-all duration-300 hover:-translate-y-2 lg:-translate-y-4 z-10 dark:bg-[#0f172a]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-blue-500 text-white text-sm font-black px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
              🔥 الأكثر اختياراً
            </div>
            <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h4 className="text-2xl font-black text-slate-800 mb-2 dark:text-white">باقة النمو</h4>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px] dark:text-slate-300">الباقة المفضلة لزيادة مبيعاتك وتعزيز هويتك التجارية الاحترافية.</p>
            <div className="mb-8 border-b border-slate-100 pb-8">
              <span className="text-5xl font-black text-slate-800 dark:text-white" dir="ltr">15,000</span>
              <span className="text-sm font-bold text-slate-400 mr-2 dark:text-slate-300">ر.ي / شهر</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-[15px] font-bold text-slate-700 dark:text-white">
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> حتى 1000 منتج</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> دومين خاص</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> جميع مميزات باقة الانطلاقة</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> تحليلات متقدمة</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> إزالة شعار Suriix</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> أولوية في الدعم الفني</li>
            </ul>
            <button
              onClick={() => { if (confirm('تأكيد اختيار باقة النمو بقيمة 15,000 ر.ي؟')) onUpgrade('النمو', 15000); }}
              className={`w-full py-4 rounded-xl font-black transition-all shadow-lg ${storeData.wallet >= 15000 ? 'bg-primary text-white hover:bg-blue-700 hover:shadow-primary/30' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none dark:text-slate-300 dark:bg-[#0f172a]'}`}
              disabled={storeData.wallet < 15000}
            >
              {storeData.wallet >= 15000 ? 'اشترك الآن' : 'رصيد غير كافٍ'}
            </button>
          </div>

          {/* 3. باقة النخبة */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col relative transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:bg-[#0f172a] dark:border-slate-800">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Crown className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2 dark:text-white">باقة النخبة</h4>
            <p className="text-sm text-slate-500 mb-6 line-clamp-2 min-h-[40px] dark:text-slate-300">للأعمال الكبيرة والمؤسسات التي تحتاج لمرونة، أدوات بلا حدود.</p>
            <div className="mb-8 border-b border-slate-100 pb-8">
              <span className="text-4xl font-black text-slate-800 dark:text-white" dir="ltr">30,000</span>
              <span className="text-sm font-bold text-slate-400 mr-2 dark:text-slate-300">ر.ي / شهر</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1 text-sm font-bold text-slate-700 dark:text-white">
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /> منتجات غير محدودة</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /> جميع مميزات باقة النمو</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /> وسائل دفع غير محدودة</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /> حسابات فريق العمل</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /> تقارير احترافية</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" /> دعم فني مميز</li>
            </ul>
            <button
              onClick={() => { if (confirm('تأكيد اختيار باقة النخبة بقيمة 30,000 ر.ي؟')) onUpgrade('النخبة', 30000); }}
              className={`w-full py-4 rounded-xl font-black transition-all ${storeData.wallet >= 30000 ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20' : 'bg-slate-50 text-slate-400 cursor-not-allowed dark:bg-[#0f172a] dark:text-slate-300'}`}
              disabled={storeData.wallet < 30000}
            >
              {storeData.wallet >= 30000 ? 'اشترك الآن' : 'رصيد غير كافٍ'}
            </button>
          </div>

        </div>

        {/* Comparison Table */}
        <div className="mt-20 max-w-5xl mx-auto hidden md:block">
          <h3 className="text-2xl font-black text-center text-slate-800 mb-8 dark:text-white">مقارنة الباقات التفصيلية</h3>
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm dark:bg-[#0f172a] dark:border-slate-800">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 dark:bg-[#0f172a] dark:border-slate-800">
                  <th className="py-5 px-6 font-bold text-slate-600 w-1/4 dark:text-slate-300">الميزة</th>
                  <th className="py-5 px-6 font-black text-slate-800 text-center border-r border-slate-200 dark:text-white dark:border-slate-800">الانطلاقة</th>
                  <th className="py-5 px-6 font-black text-primary text-center border-r border-slate-200 bg-blue-50/50 dark:border-slate-800">النمو</th>
                  <th className="py-5 px-6 font-black text-purple-700 text-center border-r border-slate-200 dark:border-slate-800">النخبة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700 dark:text-white">
                <tr className="hover:bg-slate-50/50 transition dark:bg-[#0f172a]">
                  <td className="py-4 px-6 text-slate-800 dark:text-white">عدد المنتجات</td>
                  <td className="py-4 px-6 text-center border-r border-slate-100 font-mono text-base">100</td>
                  <td className="py-4 px-6 text-center border-r border-slate-100 font-mono text-base bg-blue-50/20">1000</td>
                  <td className="py-4 px-6 text-center border-r border-slate-100">غير محدود</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition dark:bg-[#0f172a]">
                  <td className="py-4 px-6 text-slate-800 dark:text-white">دومين خاص</td>
                  <td className="py-4 px-6 text-center text-slate-300 border-r border-slate-100 text-xl font-mono">✕</td>
                  <td className="py-4 px-6 text-center text-primary border-r border-slate-100 bg-blue-50/20 flex justify-center"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                  <td className="py-4 px-6 text-center text-purple-600 border-r border-slate-100 flex justify-center"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition dark:bg-[#0f172a]">
                  <td className="py-4 px-6 text-slate-800 dark:text-white">إزالة شعار Suriix</td>
                  <td className="py-4 px-6 text-center text-slate-300 border-r border-slate-100 text-xl font-mono">✕</td>
                  <td className="py-4 px-6 text-center text-primary border-r border-slate-100 bg-blue-50/20 flex justify-center"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                  <td className="py-4 px-6 text-center text-purple-600 border-r border-slate-100 flex justify-center"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition dark:bg-[#0f172a]">
                  <td className="py-4 px-6 text-slate-800 dark:text-white">فريق العمل</td>
                  <td className="py-4 px-6 text-center text-slate-300 border-r border-slate-100 text-xl font-mono">✕</td>
                  <td className="py-4 px-6 text-center text-slate-300 border-r border-slate-100 text-xl font-mono bg-blue-50/20">✕</td>
                  <td className="py-4 px-6 text-center text-purple-600 border-r border-slate-100 flex justify-center"><CheckCircle2 className="w-5 h-5 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition dark:bg-[#0f172a]">
                  <td className="py-4 px-6 text-slate-800 dark:text-white">الدعم الفني</td>
                  <td className="py-4 px-6 text-center border-r border-slate-100">عادي</td>
                  <td className="py-4 px-6 text-center text-primary border-r border-slate-100 bg-blue-50/20">أولوية</td>
                  <td className="py-4 px-6 text-center text-purple-700 border-r border-slate-100">مميز</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-border/60 shadow-sm mt-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><MessageSquare className="w-24 h-24 text-emerald-500" /></div>
        <h3 className="text-lg font-bold mb-2 relative z-10">تواصل مع الإدارة لشحن رصيدك</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto leading-relaxed font-medium relative z-10">
          إذا أردت شحن رصيدك لتفعيل متجرك، الرجاء التواصل معنا على الواتساب وتحديد المبلغ المطلوب.
        </p>
        <a href="https://wa.me/967777000000" target="_blank" rel="noreferrer" className="inline-flex px-6 py-3 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 rounded-xl font-bold items-center justify-center gap-2 transition-all cursor-pointer relative z-10 text-sm">
          تواصل عبر واتساب <MessageSquare className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
});

const SettingsTab = React.memo(({ storeData, onUpdateField }: { storeData: any, onUpdateField: (field: string, val: any) => void }) => {
  const featureAccess = useFeatureAccess(storeData.package);

  const [formData, setFormData] = useState<any>({
    name: storeData.name || '',
    desc: storeData.desc || '',
    whatsapp: storeData.whatsapp || '',
    email: storeData.email || '',
    instagram: storeData.instagram || '',
    facebook: storeData.facebook || '',
    maintenance: storeData.maintenance || false,
    taxIncluded: storeData.taxIncluded || false,
    customDomain: storeData.custom_domain || '',
    logo: storeData.logo || '',
    titleNewArrivals: storeData.sectionTitles?.newArrivals || 'وصل حديثاً',
    titleBestSellers: storeData.sectionTitles?.bestSellers || 'الأكثر طلباً',
    titleOffers: storeData.sectionTitles?.offers || 'عروض لا تفوت',
    titleFeatured: storeData.sectionTitles?.featured || 'المنتجات المميزة'
  });

  React.useEffect(() => {
    if (storeData.name && !formData.name) {
      setFormData({
        name: storeData.name || '',
        desc: storeData.desc || '',
        whatsapp: storeData.whatsapp || '',
        email: storeData.email || '',
        instagram: storeData.instagram || '',
        facebook: storeData.facebook || '',
        maintenance: storeData.maintenance || false,
        taxIncluded: storeData.taxIncluded || false,
        customDomain: storeData.custom_domain || '',
        logo: storeData.logo || '',
        titleNewArrivals: storeData.sectionTitles?.newArrivals || 'وصل حديثاً',
        titleBestSellers: storeData.sectionTitles?.bestSellers || 'الأكثر طلباً',
        titleOffers: storeData.sectionTitles?.offers || 'عروض لا تفوت',
        titleFeatured: storeData.sectionTitles?.featured || 'المنتجات المميزة'
      });
    }
  }, [storeData]);

  const [isSubmittingDomain, setIsSubmittingDomain] = useState(false);
  const [domainData, setDomainData] = useState<any>(null);
  const [domainError, setDomainError] = useState('');
  
  const handleLinkDomain = async () => {
    const cleanDomain = formData.customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
    if (!cleanDomain || cleanDomain.includes('/')) {
      setDomainError('الرجاء إدخال نطاق صالح ومسموح به (مثال: mystore.com)');
      return;
    }
    
    setIsSubmittingDomain(true);
    setDomainError('');
    setDomainData(null);
    
    try {
      // call Vercel via backend API
      const response = await fetch('/api/domain', { 
         method: 'POST', 
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ domain: cleanDomain }) 
      });
      
      const result = await response.json();
      
      if (!response.ok) {
         setDomainError(result.error?.message || result.error || 'فشل في ربط النطاق. تأكد من أن النطاق غير مرتبط مسبقاً.');
         setIsSubmittingDomain(false);
         return;
      }
      
      // Save domain locally / in supabase
      toast.success('تم إضافة النطاق بنجاح! قد تحتاج الآن إلى إعداد الـ DNS الخاص بك.');
      setDomainData(result);
      
      onUpdateField('custom_domain', cleanDomain);
      onUpdateField('url', cleanDomain);
      
      if (storeData.id && !String(storeData.id).startsWith("local-")) {
          const { error: dbError } = await supabase.from('stores').update({ custom_domain: cleanDomain }).eq('id', storeData.id);
          if (dbError) {
              console.error('Failed to sync domain to DB:', dbError);
          }
      }
    } catch (err: any) {
      setDomainError(err.message || 'حدث خطأ مجهول أثناء محاولة ربط النطاق');
    } finally {
      setIsSubmittingDomain(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    onUpdateField('name', formData.name);
    onUpdateField('desc', formData.desc);
    onUpdateField('whatsapp', formData.whatsapp);
    onUpdateField('email', formData.email);
    onUpdateField('instagram', formData.instagram);
    onUpdateField('facebook', formData.facebook);
    onUpdateField('maintenance', formData.maintenance);
    onUpdateField('taxIncluded', formData.taxIncluded);
    onUpdateField('sectionTitles', {
      newArrivals: formData.titleNewArrivals,
      bestSellers: formData.titleBestSellers,
      offers: formData.titleOffers,
      featured: formData.titleFeatured
    });

    if (featureAccess.hasFeature('customDomain')) {
      // if valid UUID, save to backend
      if (storeData.id && String(storeData.id).includes('-')) {
        await supabase.from('stores').update({ custom_domain: formData.customDomain }).eq('id', storeData.id);
      }
      onUpdateField('custom_domain', formData.customDomain);
    }

    alert('تم حفظ إعدادات المتجر بنجاح!');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto pt-4 pb-12">
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl border border-border/40 shadow-sm dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center"><Settings className="w-6 h-6" /></div>
          <div><h2 className="text-xl font-bold">إعدادات المتجر</h2><p className="text-sm text-muted-foreground mt-1">قم بضبط المعلومات الأساسية وبيانات التواصل لمتجرك.</p></div>
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition">
          حفظ التغييرات <Save className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-border/40 shadow-sm space-y-5 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Settings className="w-5 h-5 text-muted-foreground" /> المعلومات الأساسية</h3>

            <div>
              <label className="block font-bold text-sm mb-2 text-foreground">اسم المتجر</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-primary transition font-bold" placeholder="أدخل اسم المتجر" />
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-foreground">رابط المتجر (Slug)</label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center bg-muted/50 rounded-xl border border-border/50 overflow-hidden" dir="ltr">
                  <input
                    type="text"
                    value={storeData.slug || storeData.url?.replace('.suriix.store', '') || ''}
                    readOnly
                    className="flex-1 bg-transparent p-3.5 text-right outline-none font-bold text-muted-foreground"
                    placeholder="soon"
                  />
                  <span className="px-3 text-xs text-muted-foreground font-mono border-l border-border/50 py-3.5 shrink-0 bg-muted/80">.suriix.store</span>
                </div>
                
                <div className="p-4 border border-border/50 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 mt-2">
                  <label className="flex items-center justify-between font-bold text-sm mb-3 text-foreground">
                    <span className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-primary" /> إضافة دومين مخصص (Custom Domain)
                    </span>
                    {!featureAccess.hasFeature('customDomain') && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md">ترقية الاحترافية مطلوبة</span>
                    )}
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      name="customDomain"
                      value={formData.customDomain}
                      onChange={handleChange}
                      disabled={!featureAccess.hasFeature('customDomain')}
                      className="flex-1 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-border/50 outline-none focus:border-primary transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="مثال: mystore.com"
                      dir="ltr"
                    />
                    <button
                      onClick={handleLinkDomain}
                      disabled={!featureAccess.hasFeature('customDomain') || isSubmittingDomain || !formData.customDomain}
                      className="bg-primary text-white font-bold py-3.5 px-6 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      {isSubmittingDomain ? 'جاري التحقق...' : 'ربط النطاق'}
                    </button>
                  </div>
                  
                  {!featureAccess.hasFeature('customDomain') && (
                    <p className="text-xs text-amber-600 mt-3 font-medium">الرجاء ترقية الباقة لربط الدومين المخصص الخاص بك.</p>
                  )}
                  {domainError && <p className="text-rose-500 text-sm font-bold mt-3 bg-rose-50 dark:bg-rose-900/20 p-2.5 rounded-lg w-fit">{domainError}</p>}
                  
                  {domainData && (
                    <div className="mt-6 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/40 p-5 rounded-xl">
                      <h3 className="font-bold text-sm text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4" /> لإكمال الربط، أضف السجلات التالية (DNS):
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-800/50 p-3 rounded-lg flex items-center justify-between font-mono text-sm">
                          <div><span className="text-xs text-slate-500 block font-sans">Type</span>A</div>
                          <div><span className="text-xs text-slate-500 block font-sans">Name</span>@</div>
                          <div><span className="text-xs text-slate-500 block font-sans">Value</span>76.76.21.21</div>
                          <button onClick={() => { navigator.clipboard.writeText('76.76.21.21'); toast.success('تم النسخ'); }} className="text-blue-600"><Copy className="w-4 h-4"/></button>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-800/50 p-3 rounded-lg flex items-center justify-between font-mono text-sm">
                          <div><span className="text-xs text-slate-500 block font-sans">Type</span>CNAME</div>
                          <div><span className="text-xs text-slate-500 block font-sans">Name</span>www</div>
                          <div><span className="text-xs text-slate-500 block font-sans">Value</span>cname.vercel-dns.com</div>
                          <button onClick={() => { navigator.clipboard.writeText('cname.vercel-dns.com'); toast.success('تم النسخ'); }} className="text-blue-600"><Copy className="w-4 h-4"/></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-foreground">نبذة عن المتجر</label>
              <textarea name="desc" value={formData.desc} onChange={handleChange} rows={4} className="w-full bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-primary transition font-medium" placeholder="اكتب وصفاً موجزاً لمتجرك يظهر في صفحة من نحن..."></textarea>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-border/40 shadow-sm space-y-5 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">خيارات متقدمة</h3>
            
            <label className="flex flex-row-reverse items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/20 cursor-pointer transition">
              <input type="checkbox" name="maintenance" checked={formData.maintenance} onChange={handleChange} className="w-5 h-5 accent-primary cursor-pointer" />
              <div>
                <span className="block font-bold text-sm mb-1">وضع الصيانة (إغلاق المتجر)</span>
                <span className="block text-xs text-muted-foreground">عند التفعيل، لن يتمكن العملاء من تصفح المتجر أو إتمام الطلبات.</span>
              </div>
            </label>

            <label className="flex flex-row-reverse items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/20 cursor-pointer transition">
              <input type="checkbox" name="taxIncluded" checked={formData.taxIncluded} onChange={handleChange} className="w-5 h-5 accent-primary cursor-pointer" />
              <div>
                <span className="block font-bold text-sm mb-1">الأسعار شاملة الضريبة</span>
                <span className="block text-xs text-muted-foreground">سيتم عرض أسعار المنتجات شاملةً لضريبة القيمة المضافة.</span>
              </div>
            </label>
          </div>

          {/* Section Titles UI */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-border/40 shadow-sm space-y-5 mt-6 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">تخصيص عناوين الأقسام الرئيسية</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm mb-2 text-foreground">عنوان قسم المنتجات الجديدة</label>
                <input type="text" name="titleNewArrivals" value={formData.titleNewArrivals} onChange={handleChange} className="w-full bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-primary transition font-bold" placeholder="الافتراضي: وصل حديثاً" />
              </div>
              <div>
                <label className="block font-bold text-sm mb-2 text-foreground">عنوان قسم السلع الرائجة</label>
                <input type="text" name="titleBestSellers" value={formData.titleBestSellers} onChange={handleChange} className="w-full bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-primary transition font-bold" placeholder="الافتراضي: الأكثر طلباً" />
              </div>
              <div>
                <label className="block font-bold text-sm mb-2 text-foreground">عنوان قسم العروض</label>
                <input type="text" name="titleOffers" value={formData.titleOffers} onChange={handleChange} className="w-full bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-primary transition font-bold" placeholder="الافتراضي: عروض لا تفوت" />
              </div>
              <div>
                <label className="block font-bold text-sm mb-2 text-foreground">عنوان قسم التميز</label>
                <input type="text" name="titleFeatured" value={formData.titleFeatured} onChange={handleChange} className="w-full bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-primary transition font-bold" placeholder="الافتراضي: المنتجات المميزة" />
              </div>
            </div>
          </div>

          {/* Custom Sections Manager */}
          <CustomSectionsManager storeData={storeData} onUpdateField={onUpdateField} />
        </div>

        {/* Contact & Brand */}
        <div className="space-y-6">
          {/* Logo Upload */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-border/40 shadow-sm text-center dark:border-slate-800">
            <h3 className="font-bold text-lg mb-4 text-right">شعار المتجر</h3>
            <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-4xl mb-4 border-2 border-dashed border-primary/30 overflow-hidden">
              {(formData as any).logo ? <img src={(formData as any).logo} className="w-full h-full object-cover" /> : (formData.name ? formData.name.charAt(0) : 'S')}
            </div>
            <label className="cursor-pointer">
              <span className="inline-block text-sm font-bold bg-muted px-4 py-2 rounded-lg hover:bg-muted/80 transition w-full text-center">رفع شعار المتجر</span>
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const dataUri = ev.target?.result as string;
                    setFormData((prev: any) => ({ ...prev, logo: dataUri }));
                    onUpdateField('logo', dataUri);
                  };
                  reader.readAsDataURL(e.target.files[0]);
                }
              }} />
            </label>
            {(formData as any).logo && <button onClick={() => { setFormData((prev: any) => ({ ...prev, logo: '' })); onUpdateField('logo', ''); }} className="text-xs text-rose-400 hover:underline mt-2 block mx-auto">حذف الشعار</button>}
          </div>

          {/* Contact Details */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-border/40 shadow-sm space-y-5 dark:border-slate-800">
            <h3 className="font-bold text-lg mb-2">بيانات التواصل</h3>

            <div>
              <label className="block font-bold text-sm mb-2 text-foreground flex items-center gap-2"><CreditCard className="w-4 h-4 text-green-500" /> رقم الواتساب</label>
              <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-green-500 transition font-mono text-left" placeholder="+967 77X XXX XXX" dir="ltr" />
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-foreground flex items-center gap-2"><Mail className="w-4 h-4 text-rose-400" /> البريد الإلكتروني</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-rose-400 transition font-mono text-left" placeholder="store@example.com" dir="ltr" />
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-foreground flex items-center gap-2"><MessageSquare className="w-4 h-4 text-pink-500" /> حساب الانستغرام</label>
              <div className="flex items-center relative">
                <span className="absolute left-3.5 top-3.5 text-muted-foreground font-bold">@</span>
                <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-muted/30 py-3.5 pr-3.5 pl-8 rounded-xl border border-border/50 outline-none focus:border-pink-500 transition font-mono text-left" placeholder="username" dir="ltr" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-sm mb-2 text-foreground flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600" /> رابط الفيسبوك</label>
              <input type="url" name="facebook" value={formData.facebook || ''} onChange={handleChange} className="w-full bg-muted/30 p-3.5 rounded-xl border border-border/50 outline-none focus:border-blue-600 transition font-mono text-left" placeholder="https://facebook.com/store" dir="ltr" />
            </div>



          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Required wrapper component missing from lucide, custom implementation
const ChevronLeft = ({ className }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 18-6-6 6-6" /></svg>
);

// Export shifted to end of file
const WalletTabV2 = React.memo(({ storeData }: { storeData: any }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12 w-full px-4 md:px-0">
      {/* Wallet Banner */}
      <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-[24px] overflow-hidden relative text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 50%, transparent 20%, #ffffff 21%, #ffffff 34%, transparent 35%, transparent), radial-gradient(circle at 0% 50%, transparent 20%, #ffffff 21%, #ffffff 34%, transparent 35%, transparent)', backgroundSize: '60px 120px' }}></div>

        <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10 w-full">
          <div className="flex-1 text-center md:text-right w-full">
            <div className="flex flex-row-reverse items-center justify-center md:justify-start gap-4 mb-4 text-right pr-2">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 dark:bg-[#0f172a]">
                <CreditCard className="w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">المحفظة الإلكترونية</h2>
            </div>
            <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6 max-w-md mx-auto md:mx-0 pr-4">يمكنك استخدام الرصيد الحالي لدفع رسوم الاشتراكات وتفعيل متجرك بشكل فوري.</p>
            <div className="flex flex-row-reverse items-center justify-center md:justify-start gap-2 text-xs bg-white/10 px-4 py-2 rounded-full w-fit border border-white/20 mr-auto md:mr-0 pr-4 dark:bg-[#0f172a]">
              <ShieldCheck className="w-4 h-4" /> <span>معاملات آمنة 100% ومحمية بتقنيات التشفير</span>
            </div>
          </div>

          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] p-6 text-center md:text-right min-w-[300px] dark:bg-[#0f172a]">
            <div className="flex flex-row-reverse justify-between items-start mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center dark:bg-[#0f172a]">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h3 className="text-white/80 font-bold mb-2">الرصيد الحالي</h3>
                <div className="text-5xl font-black mb-1 leading-none text-right flex flex-row-reverse items-baseline justify-start gap-2"><span className="text-2xl font-bold">ر.س</span> <span>{Number(storeData?.wallet || 0).toLocaleString()}</span></div>
                <p className="text-xs text-white/70 flex flex-row-reverse items-center gap-1 justify-center md:justify-start mt-2"><CheckCircle2 className="w-3 h-3" /> رصيد متاح للاستخدام {storeData?.wallet || 0} ر.س</p>
              </div>
            </div>

            <div className="flex flex-row-reverse gap-3">
              <button className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center hover:bg-white/20 transition dark:bg-[#0f172a]">
                <ArrowLeftRight className="w-5 h-5" />
              </button>
              <button className="flex-1 bg-white text-primary font-bold py-3 rounded-xl flex flex-row-reverse items-center justify-center gap-2 hover:bg-white/90 transition shadow-sm border border-transparent shadow-white/30 dark:bg-[#0f172a]">
                <Plus className="w-5 h-5" /> إضافة رصيد
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" dir="rtl">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-6 text-center h-full dark:border-slate-800">
            <h3 className="font-bold text-lg mb-6 text-right w-full">إجراءات سريعة</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="border border-border/50 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition bg-muted/20 hover:bg-muted/40">
                <CreditCard className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold text-foreground">شحن الرصيد</span>
              </button>
              <button className="border border-border/50 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition bg-muted/20 hover:bg-muted/40">
                <ArrowLeftRight className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold text-foreground">تحويل الرصيد</span>
              </button>
              <button className="border border-border/50 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition bg-muted/20 hover:bg-muted/40">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold text-foreground">المعاملات</span>
              </button>
              <button className="border border-border/50 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition bg-muted/20 hover:bg-muted/40">
                <FileText className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold text-foreground">الفواتير</span>
              </button>
            </div>

            <div className="bg-[#eff0fe] rounded-xl p-4 border border-[#e0e2fa] text-right flex flex-col items-center text-center gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-50"><ShieldCheck className="w-16 h-16 text-primary" /></div>
              <div className="relative z-10 w-full text-center">
                <h4 className="font-bold text-primary text-sm mb-2 px-2 leading-tight">اشحن محفظتك الآن واستفد من جميع خدماتنا</h4>
                <p className="text-[10px] text-primary/80 leading-relaxed max-w-[90%] mx-auto font-medium">طريقة دفع آمنة وسريعة وموثوقة في جميع الخدمات</p>
              </div>
              <button className="bg-primary hover:bg-[#4F46E5] text-white text-xs font-bold px-8 py-2.5 rounded-lg shrink-0 mt-1 relative z-10 w-full mb-1">شحن الآن</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          {(() => {
            const storeId = storeData?.id ? String(storeData.id).replace('local-', '') : 'local';
            const slug = storeData?.url?.replace('.suriix.store', '') || storeId;
            let totalIn = 0, totalOut = 0, txCount = 0, lastTx = '-';
            try {
              const txList = JSON.parse(localStorage.getItem('suriix_local_transactions') || '[]');
              txList.forEach((t: any) => {
                txCount++;
                if (t.amount > 0) totalIn += t.amount;
                else totalOut += Math.abs(t.amount);
                if (!lastTx || lastTx === '-') lastTx = t.created_at ? new Date(t.created_at).toLocaleDateString('ar-SA') : '-';
              });
            } catch { }
            return (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-6 h-full dark:border-slate-800">
                <h3 className="font-bold text-lg mb-6 text-right border-b border-border/40 pb-4 dark:border-slate-800">ملخص المحفظة</h3>
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between py-3 border-b border-border/30 border-dashed">
                    <div className="flex flex-row items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500"><ArrowDownToLine className="w-4 h-4" /></div>
                      <span className="text-sm font-bold text-foreground">إجمالي الشحنات</span>
                    </div>
                    <span className="font-bold text-sm text-green-600">{totalIn > 0 ? `${totalIn.toLocaleString()} ر.ي` : '0 ر.ي'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border/30 border-dashed">
                    <div className="flex flex-row items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><ArrowUpFromLine className="w-4 h-4" /></div>
                      <span className="text-sm font-bold text-foreground">إجمالي المدفوعات</span>
                    </div>
                    <span className="font-bold text-sm text-blue-600">{totalOut > 0 ? `${totalOut.toLocaleString()} ر.ي` : '0 ر.ي'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border/30 border-dashed">
                    <div className="flex flex-row items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500"><Activity className="w-4 h-4" /></div>
                      <span className="text-sm font-bold text-foreground">عدد المعاملات</span>
                    </div>
                    <span className="font-bold text-sm">{txCount}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex flex-row items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500"><Calendar className="w-4 h-4" /></div>
                      <span className="text-sm font-bold text-foreground">آخر عملية</span>
                    </div>
                    <span className="font-bold text-sm">{lastTx}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="lg:col-span-5">
          {(() => {
            let txList: any[] = [];
            try { txList = JSON.parse(localStorage.getItem('suriix_local_transactions') || '[]'); } catch { }
            const rechargeList = (() => { try { return JSON.parse(localStorage.getItem('suriix_local_recharge_requests') || '[]'); } catch { return []; } })();
            const allTx = [
              ...txList.map((t: any) => ({ ...t, _type: 'tx' })),
              ...rechargeList.map((r: any) => ({ id: r.id, amount: r.amount, description: `طلب شحن ${r.amount?.toLocaleString()} ر.ي`, created_at: r.created_at, _type: 'recharge', status: r.status }))
            ].sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).slice(0, 8);
            return (
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-6 h-full flex flex-col dark:border-slate-800">
                <div className="flex justify-between items-center mb-4 w-full text-right">
                  <h3 className="font-bold text-lg truncate flex-1">آخر المعاملات (ريال يمني)</h3>
                </div>
                {allTx.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 bg-slate-50/50 rounded-xl p-8 border border-border/20 border-dashed dark:bg-[#0f172a]">
                    <div className="w-20 h-20 bg-[#f8f5ff] rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-8 h-8 text-[#d8c8fb]" />
                    </div>
                    <h4 className="font-bold text-foreground mb-1 text-sm">لا توجد معاملات حتى الآن</h4>
                    <p className="text-xs text-muted-foreground">ستظهر معاملاتك هنا بعد شحن أو اشتراك</p>
                  </div>
                ) : (
                  <div className="space-y-2 overflow-y-auto flex-1">
                    {allTx.map((t: any, i: number) => (
                      <div key={t.id || i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/30">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${t.amount > 0 ? 'bg-green-50 text-green-500' : 'bg-rose-50 text-rose-500'}`}>
                            {t._type === 'recharge' ? '📥' : t.amount > 0 ? '↓' : '↑'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">{t.description || (t.amount > 0 ? 'إيداع' : 'سحب')}</p>
                            <p className="text-[10px] text-muted-foreground">{t.created_at ? new Date(t.created_at).toLocaleDateString('ar-SA') : '-'}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          {t._type !== 'recharge' && <span className={`font-bold text-sm ${t.amount > 0 ? 'text-green-600' : 'text-rose-500'}`}>{t.amount > 0 ? '+' : ''}{t.amount?.toLocaleString()} ر.ي</span>}
                          {t._type === 'recharge' && <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${t.status === 'approved' ? 'bg-green-50 text-green-600' : t.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>{t.status === 'approved' ? 'مقبول' : t.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white dark:bg-slate-800 rounded-2xl border border-border/40 p-6 shadow-sm mt-6 w-full dark:border-slate-800" dir="rtl">
        <div className="flex flex-col items-center text-center py-2 h-full justify-center">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-primary shrink-0 mb-3"><Calendar className="w-5 h-5" /></div>
          <div>
            <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">تقارير وفواتير</h4>
            <p className="text-[10px] text-muted-foreground font-medium">تابع جميع عملياتك بسهولة</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center py-2 h-full justify-center border-t lg:border-t-0 lg:border-r border-border/40 pt-6 lg:pt-2 dark:border-slate-800">
          <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shrink-0 mb-3"><Zap className="w-5 h-5" /></div>
          <div>
            <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">دفع فوري</h4>
            <p className="text-[10px] text-muted-foreground font-medium">تفعيل الخدمات فوراً</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center py-2 h-full justify-center border-t border-border/40 pt-6 lg:pt-2 lg:border-t-0 lg:border-r dark:border-slate-800">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0 mb-3"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">أمان وحماية عالية</h4>
            <p className="text-[10px] text-muted-foreground font-medium">حماية بياناتك ومعاملاتك</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center py-2 h-full justify-center border-t lg:border-t-0 lg:border-r border-border/40 pt-6 lg:pt-2 dark:border-slate-800">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0 mb-3"><Headset className="w-5 h-5" /></div>
          <div>
            <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-slate-200">دعم فني 24/7</h4>
            <p className="text-[10px] text-muted-foreground font-medium">مساعدة في أي وقت</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const SubscriptionTab = React.memo(({ storeData, subscriptionPlans, onUpgrade }: { storeData: any, subscriptionPlans: any[], onUpgrade: (pkg: string, cost: number) => void }) => {
  const parseWallet = (val: any) => {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };
  const currentBalance = parseWallet(storeData?.wallet_yer) || parseWallet(storeData?.wallet) || 0;
  const subEndsAt = (() => { try { const s = localStorage.getItem('suriix_added_stores'); if (s) { const list = JSON.parse(s); return list[0]?.subscription_ends_at || list[0]?.subEndsAt || null; } } catch { }; return null; })();
  const daysLeft = subEndsAt ? Math.ceil((new Date(subEndsAt).getTime() - Date.now()) / 86400000) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto pt-4 pb-12 w-full px-4 md:px-0">
      {daysLeft !== null && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border font-bold text-sm ${daysLeft <= 3 ? 'bg-red-50 border-red-200 text-red-700' : daysLeft <= 7 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          <Clock className={`w-5 h-5 shrink-0 ${daysLeft <= 3 ? 'text-red-500' : daysLeft <= 7 ? 'text-amber-500' : 'text-green-500'}`} />
          {daysLeft > 0 ? (
            <span>باقتك النشطة تنتهي بعد <strong>{daysLeft}</strong> يوم — تاريخ الانتهاء: {new Date(subEndsAt).toLocaleDateString('ar-SA')}</span>
          ) : (
            <span>⚠️ انتهت صلاحية اشتراكك! يرجى تجديد الباقة لإعادة تفعيل متجرك.</span>
          )}
        </div>
      )}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">باقات الاشتراك والتفعيل</h3>
          <p className="text-sm text-muted-foreground mt-1">قم بتفعيل متجرك مباشرة عبر اختيار إحدى الباقات وسيتم استقطاع المبلغ من رصيدك.</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-xs font-bold text-primary">رصيدك الحالي: {Number(currentBalance).toLocaleString()} ر.ي</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {subscriptionPlans.length > 0 ? subscriptionPlans.map(plan => {
          const isAffordable = currentBalance >= Number(plan.price);
          const isHighest = plan.price == Math.max(...subscriptionPlans.map(p => p.price));
          return (
            <div key={plan.id} className={`${isHighest ? 'bg-gradient-to-b from-[#6b6eed] to-[#4b4ed6] text-white shadow-xl shadow-primary/20 transform scale-105 z-10 dark:from-primary dark:to-[#4143a3]' : 'bg-white text-foreground border border-border/60 shadow-sm transition dark:bg-slate-800 dark:border-slate-700'} rounded-[24px] p-6 flex flex-col items-center relative hover:-translate-y-1 hover:shadow-lg`}>
              {isHighest && <span className="absolute -top-3 bg-amber-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-sm">الأكثر طلباً ومبيعاً</span>}
              <span className={`text-sm font-bold mb-4 ${isHighest ? 'text-white/90 mt-2' : ''}`}>{plan.name}</span>
              <h4 className={`text-3xl font-black mb-6 ${isHighest ? 'text-white' : 'text-primary'}`} dir="ltr">{Number(plan.price).toLocaleString()} <span className={`text-base font-bold ${isHighest ? 'text-white/70' : 'text-muted-foreground'}`}>ر.ي</span></h4>
              <ul className={`text-xs space-y-3 mb-8 w-full text-right font-medium ${isHighest ? 'text-white/90' : 'text-muted-foreground'}`}>
                {Array.isArray(plan.features) && plan.features.map((feat: string, idx: number) => (
                  <li key={idx} className="flex gap-2 items-center">
                    <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isHighest ? 'text-white' : 'text-primary'}`} /> {feat}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => { if (confirm(`تأكيد اختيار ${plan.name} بقيمة ${Number(plan.price).toLocaleString()} ر.ي؟`)) onUpgrade(plan.name, Number(plan.price)); }}
                className={`w-full font-bold py-3.5 rounded-xl transition mt-auto ${isAffordable ? (isHighest ? 'bg-white text-primary hover:bg-gray-100 shadow-lg dark:bg-[#0f172a]' : 'bg-primary hover:bg-[#4b4ed6] text-white shadow-lg shadow-primary/20') : (isHighest ? 'bg-white/20 text-white/50 cursor-not-allowed dark:bg-[#0f172a]' : 'bg-muted text-muted-foreground cursor-not-allowed dark:bg-slate-700')}`}
                disabled={!isAffordable}
              >
                {isAffordable ? 'اشتراك الآن' : 'رصيد غير كافٍ'}
              </button>
            </div>
          );
        }) : (
          <div className="col-span-3 text-center py-20 text-muted-foreground font-bold font-display animate-pulse">جاري تحميل الباقات المتاحة...</div>
        )}
      </div>
    </motion.div>
  );
});

// ─── StorePagesTab ─────────────────────────────────────────────────────────
const StorePagesTab = React.memo(({ storeData, onUpdateField }: { storeData: any, onUpdateField: (f: string, v: any) => void }) => {
  const stored = storeData?.pages || {};
  const [pages, setPages] = useState<Record<string, string>>(stored);
  const [activeKey, setActiveKey] = useState(STATIC_PAGES[0].key);
  const [saved, setSaved] = useState(false);

  const activePage = STATIC_PAGES.find(p => p.key === activeKey)!;

  const handleSave = () => {
    onUpdateField('pages', pages);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl border border-border/40 shadow-sm flex-wrap gap-4 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">صفحات المتجر</h2>
            <p className="text-sm text-muted-foreground mt-1">تحرير محتوى الصفحات الثابتة التي تظهر في فوتر متجرك.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-lg transition ${saved ? 'bg-green-500 shadow-green-500/30' : 'bg-primary hover:bg-indigo-700 shadow-primary/20'}`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'تم الحفظ ✓' : 'حفظ التغييرات'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar list */}
        <div className="md:w-56 shrink-0 bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-3 flex flex-col gap-1 h-fit dark:border-slate-800">
          {STATIC_PAGES.map(p => (
            <button
              key={p.key}
              onClick={() => setActiveKey(p.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition text-right w-full ${activeKey === p.key ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-muted/80'}`}
            >
              <span className="text-base">{p.icon}</span>
              <span>{p.title}</span>
              {pages[p.key] && <span className={`mr-auto w-2 h-2 rounded-full shrink-0 ${activeKey === p.key ? 'bg-white/70 dark:bg-[#0f172a]' : 'bg-green-400'}`} />}
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-6 flex flex-col gap-4 dark:border-slate-800">
          <div className="flex items-center gap-3 border-b border-border/40 pb-4 dark:border-slate-800">
            <span className="text-2xl">{activePage.icon}</span>
            <div>
              <h3 className="font-bold text-lg">{activePage.title}</h3>
              <p className="text-xs text-muted-foreground">تظهر هذه الصفحة في فوتر متجرك عند الضغط على رابطها.</p>
            </div>
          </div>
          <textarea
            value={pages[activeKey] || ''}
            onChange={e => setPages(prev => ({ ...prev, [activeKey]: e.target.value }))}
            placeholder={activePage.placeholder}
            rows={16}
            className="w-full flex-1 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-border/50 focus:border-primary outline-none transition resize-none text-sm leading-loose font-medium"
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{(pages[activeKey] || '').length} حرف</span>
            <button onClick={() => setPages(prev => ({ ...prev, [activeKey]: '' }))} className="text-red-400 hover:text-red-600 font-bold transition">مسح المحتوى</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const BannersTab = React.memo(({ storeData, banners, categories, onUpdate }: { storeData?: any, banners: any[], categories: any[], onUpdate: (b: any[]) => void }) => {
  const [bns, setBns] = useState(banners || []);
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState<string>('hero');
  const [showButtons, setShowButtons] = useState(true);

  const sync = (updated: any[]) => { setBns(updated); onUpdate(updated); };

  const handleUpload = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUri = ev.target?.result as string;
        sync([...bns, { id: Date.now(), img: dataUri, placement, showButtons: placement === 'hero' ? showButtons : undefined }]);
        setIsOpen(false);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12 w-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border/40 shadow-sm dark:bg-[#0f172a] dark:border-slate-800">
        <div><h2 className="text-xl font-bold">إدارة البنرات</h2><p className="text-sm text-muted-foreground mt-1">تحكم بالصور المعروضة في الرئيسية وقسم العروض.</p></div>
        <button onClick={() => setIsOpen(true)} className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition"><Plus className="w-5 h-5" /> بنر جديد</button>
      </div>

      <ActionModal title="إضافة بنر جديد" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">مكان العرض</label>
            <select value={placement} onChange={e => setPlacement(e.target.value)} className="w-full bg-muted/50 p-3 rounded-xl border border-border/50 outline-none focus:border-primary">
              <option value="hero">📌 الرئيسية (أعلى المتجر)</option>
              <option value="offers">🎁 قسم العروض لا تفوت</option>
              <optgroup label="── الأقسام الترويجية ──">
                <option value={storeData?.sectionTitles?.featured || "المنتجات المميزة"}>⭐ {storeData?.sectionTitles?.featured || "المنتجات المميزة"}</option>
                <option value={storeData?.sectionTitles?.bestSellers || "الأكثر طلباً"}>🔥 {storeData?.sectionTitles?.bestSellers || "الأكثر طلباً"}</option>
                <option value={storeData?.sectionTitles?.newArrivals || "وصل حديثاً"}>🆕 {storeData?.sectionTitles?.newArrivals || "وصل حديثاً"}</option>
              </optgroup>
              {categories.length > 0 && (
                <optgroup label="── أقسام التصنيفات ──">
                  {categories.map((c: any, i: number) => (
                    <option key={i} value={c.n || c.name}>📂 قسم: {c.n || c.name}</option>
                  ))}
                </optgroup>
              )}
              {storeData?.customSections?.length > 0 && (
                <optgroup label="── الأقسام المخصصة ──">
                  {storeData.customSections.map((s: any) => (
                    <option key={s.id} value={s.id}>🗂️ {s.title}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          {placement === 'hero' && (
            <label className="flex items-center gap-2 text-sm font-bold mt-2 cursor-pointer bg-muted/50 p-3 rounded-xl border border-border/50">
              <input type="checkbox" checked={showButtons} onChange={e => setShowButtons(e.target.checked)} className="w-4 h-4 accent-primary" />
              <span>إظهار أزرار "تسوق الآن" و "مشاهدة العروض" على هذا البانر</span>
            </label>
          )}
          <label className="block w-full bg-primary/10 text-primary border-2 border-dashed border-primary/30 rounded-xl p-6 text-center cursor-pointer hover:bg-primary/20 transition">
            <span className="font-bold">اختر صورة للبنر</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </ActionModal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bns.map((b: any, i: number) => (
          <div key={i} className="bg-white rounded-2xl border border-border/40 overflow-hidden shadow-sm dark:bg-[#0f172a] dark:border-slate-800">
            <div className="aspect-video w-full relative group">
              <img src={b.img} className="w-full h-full object-cover" />
              <button onClick={() => { if (confirm('حذف هذا البنر؟')) sync(bns.filter((_: any, idx: number) => idx !== i)); }} className="absolute inset-0 bg-red-500/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm font-bold"><Trash2 className="w-8 h-8" /></button>
            </div>
            <div className="p-4 text-center font-bold text-sm text-muted-foreground">
              {b.placement === 'hero' ? 'الرئيسية' : b.placement === 'offers' ? 'قسم العروض' : `قسم: ${storeData?.customSections?.find((s: any) => s.id === b.placement)?.title || b.placement}`}
              {b.placement === 'hero' && <div className="text-xs text-primary mt-1">{b.showButtons !== false ? '(الأزرار مفعلة)' : '(بدون أزرار)'}</div>}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

const CouponsTab = React.memo(({ coupons, categories, onUpdate }: { coupons: any[], categories: any[], onUpdate: (c: any[]) => void }) => {
  const [cps, setCps] = useState(coupons || []);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ code: '', discount: '', target: 'all' });

  const sync = (updated: any[]) => { setCps(updated); onUpdate(updated); };

  const toggleStatus = (index: number) => {
    const updated = [...cps];
    updated[index].active = !updated[index].active;
    sync(updated);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12 w-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-border/40 shadow-sm dark:bg-[#0f172a] dark:border-slate-800">
        <div><h2 className="text-xl font-bold">كوبونات الخصم</h2><p className="text-sm text-muted-foreground mt-1">إنشاء وإدارة أكواد وتقييدها بتصنيفات محددة.</p></div>
        <button onClick={() => setIsOpen(true)} className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition"><Plus className="w-5 h-5" /> كوبون جديد</button>
      </div>

      <ActionModal title="إنشاء كوبون" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4 font-bold text-sm text-foreground">
          <input type="text" placeholder="كود الكوبون (مثال: KSA2026)" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} className="w-full bg-muted/50 p-3 rounded-xl border border-border/50 outline-none" />
          <input type="text" placeholder="قيمة الخصم بالريال اليمني" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className="w-full bg-muted/50 p-3 rounded-xl border border-border/50 outline-none" />
          <select value={form.target} onChange={e => setForm({ ...form, target: e.target.value })} className="w-full bg-muted/50 p-3 rounded-xl border border-border/50 outline-none">
            <option value="all">جميع المنتجات</option>
            {categories?.map((c: any, i: number) => <option key={i} value={c.n || c.name}>{c.n || c.name}</option>)}
          </select>
          <button onClick={() => { if (form.code) { sync([{ ...form, id: Date.now(), active: true }, ...cps]); setIsOpen(false); setForm({ code: '', discount: '', target: 'all' }) } }} className="w-full bg-primary text-white py-3 rounded-xl">حفظ</button>
        </div>
      </ActionModal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cps.map((c: any, i: number) => (
          <div key={i} className={`bg-white rounded-2xl border ${c.active ? 'border-primary/50 border-2' : 'border-border/40 opacity-70 dark:border-slate-800'} shadow-sm p-6 relative`}>
            <button onClick={() => { if (confirm('حذف؟')) sync(cps.filter((_: any, idx: number) => idx !== i)) }} className="absolute top-4 left-4 text-red-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
            <h3 className="text-3xl font-black text-primary mb-2" dir="ltr">{c.code}</h3>
            <p className="text-muted-foreground font-bold text-sm mb-4">خصم: {c.discount} ر.ي</p>
            <p className="text-xs bg-muted/50 py-1.5 px-3 rounded-full mb-4 w-fit inline-block">الاستهداف: {c.target === 'all' ? 'الكل' : c.target}</p>
            <button onClick={() => toggleStatus(i)} className={`w-full py-2 rounded-xl font-bold text-sm ${c.active ? 'bg-rose-50 text-rose-500' : 'bg-green-50 text-green-500'}`}>
              {c.active ? 'إيقاف الكوبون' : 'تنشيط الكوبون'}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

const SupportTab = React.memo(({ storeData }: { storeData: any }) => {
  const storageKey = `suriix_support_${storeData?.id || 'local'}`;
  const [messages, setMessages] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch { return []; }
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const saveMessages = (msgs: any[]) => {
    setMessages(msgs);
    localStorage.setItem(storageKey, JSON.stringify(msgs));
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), text: input, from: 'user', time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) };
    const updated = [...messages, userMsg];
    saveMessages(updated);
    setInput('');
    setIsTyping(true);
    // Simulate admin reply after 1.5s
    setTimeout(() => {
      setIsTyping(false);
      const replies = [
        'شكراً لتواصلك معنا، سنراجع طلبك ونرد عليك في أقرب وقت.',
        'تم استلام رسالتك. هل يمكنك توضيح أكثر؟',
        'نعمل على حل مشكلتك الآن. يرجى الانتظار قليلاً.',
        'مرحباً! كيف يمكنني مساعدتك اليوم؟',
        'فريق الدعم متاح من 9 صباحاً حتى 9 مساءً. سنرد عليك خلال ساعات.',
      ];
      const adminMsg = { id: Date.now() + 1, text: replies[Math.floor(Math.random() * replies.length)], from: 'admin', time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) };
      saveMessages([...updated, adminMsg]);
    }, 1500);
  };

  React.useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto pt-4 pb-12 w-full flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-border/40 shadow-sm mb-4 flex items-center gap-4 dark:bg-[#0f172a] dark:border-slate-800">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
          <Headset className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold">الدعم الفني</h2>
          <p className="text-sm text-muted-foreground">تحدث مع فريق دعم Suriix مباشرةً</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-600 text-xs font-bold px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          متصل
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden flex flex-col dark:bg-[#0f172a] dark:border-slate-800">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-50 py-12">
              <Headset className="w-16 h-16 text-primary mb-4" />
              <p className="font-bold text-lg">ابدأ محادثتك مع فريق الدعم</p>
              <p className="text-sm text-muted-foreground mt-2">نحن هنا لمساعدتك في أي وقت</p>
            </div>
          )}
          {messages.map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
              {msg.from === 'admin' && (
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">S</div>
              )}
              <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.from === 'user' ? 'bg-primary text-white rounded-bl-none' : 'bg-muted/60 text-foreground rounded-br-none'}`}>
                {msg.text}
                <span className={`block text-[10px] mt-1 ${msg.from === 'user' ? 'text-white/70 text-left' : 'text-muted-foreground text-right'}`}>{msg.time}</span>
              </div>
              {msg.from === 'user' && (
                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center font-bold text-sm shrink-0">{storeData?.initial || '؟'}</div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">S</div>
              <div className="bg-muted/60 px-4 py-3 rounded-2xl rounded-br-none">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/40 flex items-center gap-3 dark:border-slate-800">
          <button onClick={() => { if (confirm('هل تريد مسح جميع الرسائل؟')) saveMessages([]); }} className="p-2.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 rounded-xl transition" title="مسح المحادثة">
            <Trash2 className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-muted/40 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 text-sm font-medium transition"
          />
          <button onClick={sendMessage} disabled={!input.trim()} className="p-3 bg-primary text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
});

const PaymentTab = React.memo(({ storeData, onUpdateField }: { storeData: any, onUpdateField: (field: string, val: any) => void }) => {
  const [accounts, setAccounts] = useState<any[]>(storeData?.paymentMethods || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payType, setPayType] = useState<'bank' | 'jaib'>('bank');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [jaibNumber, setJaibNumber] = useState('');
  const [formError, setFormError] = useState('');

  const resetForm = () => {
    setBankName(''); setAccountName(''); setAccountNumber(''); setIban(''); setJaibNumber(''); setFormError(''); setPayType('bank');
  };

  const handleAddAccount = () => {
    setFormError('');
    if (payType === 'bank') {
      if (!bankName.trim()) { setFormError('يرجى إدخال اسم البنك'); return; }
      if (!accountNumber.trim()) { setFormError('يرجى إدخال رقم الحساب'); return; }
      if (accountNumber.replace(/\s/g, '').length < 10) { setFormError('رقم الحساب البنكي يجب أن يكون 10 أرقام على الأقل'); return; }
      const newAcc = { id: Date.now(), type: 'bank', bankName: bankName.trim(), accountName: accountName || 'غير محدد', accountNumber: accountNumber.trim(), iban: iban || 'غير محدد' };
      const newAccounts = [newAcc, ...accounts];
      setAccounts(newAccounts);
      onUpdateField('paymentMethods', newAccounts);
    } else {
      if (!jaibNumber.trim()) { setFormError('يرجى إدخال رقم محفظة جيب'); return; }
      const digits = jaibNumber.replace(/\D/g, '');
      if (digits.length !== 9 && digits.length !== 7) { setFormError('رقم محفظة جيب يجب أن يكون 9 أرقام (رقم الهاتف) أو 7 أرقام (الرقم البديل)'); return; }
      const newAcc = { id: Date.now(), type: 'jaib', jaibNumber: digits, accountName: accountName || 'غير محدد' };
      const newAccounts = [newAcc, ...accounts];
      setAccounts(newAccounts);
      onUpdateField('paymentMethods', newAccounts);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const removeAccount = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الحساب؟')) {
      const newAccounts = accounts.filter(a => a.id !== id);
      setAccounts(newAccounts);
      onUpdateField('paymentMethods', newAccounts);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto pt-6 pb-20 text-right" dir="rtl">

      <ActionModal title="إضافة وسيلة دفع جديدة" isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }}>
        <div className="space-y-4 text-sm font-bold text-right pt-2">
          {/* Type selector */}
          <div className="flex gap-3">
            <button onClick={() => { setPayType('bank'); setFormError(''); }} className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition ${payType === 'bank' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300'}`}>
              🏦 حساب بنكي
            </button>
            <button onClick={() => { setPayType('jaib'); setFormError(''); }} className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-sm transition ${payType === 'jaib' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-800 dark:text-slate-300'}`}>
              📱 محفظة جيب (JAIB)
            </button>
          </div>

          {payType === 'bank' ? (
            <>
              <div>
                <label className="block text-slate-600 mb-2 font-medium text-xs dark:text-slate-300">اسم البنك <span className="text-red-500">*</span></label>
                <input value={bankName} onChange={e => setBankName(e.target.value)} type="text" placeholder="مثال: بنك الكريمي" className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 focus:border-primary outline-none transition dark:bg-[#0f172a] dark:border-slate-800" />
              </div>
              <div>
                <label className="block text-slate-600 mb-2 font-medium text-xs dark:text-slate-300">اسم صاحب الحساب</label>
                <input value={accountName} onChange={e => setAccountName(e.target.value)} type="text" placeholder="الاسم كما هو في البنك" className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 focus:border-primary outline-none transition dark:bg-[#0f172a] dark:border-slate-800" />
              </div>
              <div>
                <label className="block text-slate-600 mb-2 font-medium text-xs dark:text-slate-300">رقم الحساب <span className="text-red-500">*</span> <span className="text-slate-400 font-normal dark:text-slate-300">(10 أرقام على الأقل)</span></label>
                <input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} type="text" dir="ltr" placeholder="1234567890" className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 focus:border-primary outline-none transition text-left tracking-wider font-mono dark:bg-[#0f172a] dark:border-slate-800" />
              </div>
              <div>
                <label className="block text-slate-600 mb-2 font-medium text-xs dark:text-slate-300">الآيبان (IBAN) — اختياري</label>
                <input value={iban} onChange={e => setIban(e.target.value)} type="text" dir="ltr" placeholder="YE00 0000 0000 0000 0000 0000" className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 focus:border-primary outline-none transition text-left tracking-wider font-mono uppercase dark:bg-[#0f172a] dark:border-slate-800" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-slate-600 mb-2 font-medium text-xs dark:text-slate-300">اسم صاحب المحفظة</label>
                <input value={accountName} onChange={e => setAccountName(e.target.value)} type="text" placeholder="الاسم كما هو في جيب" className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition dark:bg-[#0f172a] dark:border-slate-800" />
              </div>
              <div>
                <label className="block text-slate-600 mb-2 font-medium text-xs dark:text-slate-300">رقم محفظة جيب <span className="text-red-500">*</span></label>
                <input value={jaibNumber} onChange={e => setJaibNumber(e.target.value)} type="text" dir="ltr" placeholder="رقم الهاتف (9 أرقام) أو الرقم البديل (7 أرقام)" className="w-full bg-slate-50 p-3.5 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none transition text-left tracking-wider font-mono dark:bg-[#0f172a] dark:border-slate-800" />
                <p className="text-[11px] text-slate-400 mt-1.5 font-normal dark:text-slate-300">✔ رقم الهاتف: 9 أرقام — ✔ الرقم البديل: 7 أرقام</p>
              </div>
            </>
          )}

          {formError && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100">⚠️ {formError}</p>}

          <button onClick={handleAddAccount} className="w-full bg-primary text-white p-3.5 rounded-xl font-bold hover:bg-[#4F46E5] transition mt-2 shadow-lg shadow-primary/20">
            حفظ وسيلة الدفع
          </button>
        </div>
      </ActionModal>

      <div className="bg-white rounded-3xl border border-border/40 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6 dark:bg-[#0f172a] dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">وسائل الدفع</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium max-w-md leading-relaxed dark:text-slate-300">ربط حساباتك البنكية أو محفظة جيب (JAIB) ليتمكن عملاؤك من إجراء التحويلات بسهولة.</p>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white font-bold py-3 px-6 rounded-2xl hover:bg-[#4F46E5] shadow-xl shadow-primary/20 transition flex items-center justify-center gap-2 w-full md:w-auto shrink-0">
          <Plus className="w-5 h-5" /> إضافة وسيلة دفع
        </button>
      </div>

      <div className="space-y-4">
        {accounts.length === 0 ? (
          <div className="bg-white border border-border/40 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center dark:bg-[#0f172a] dark:border-slate-800">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 dark:bg-[#0f172a]">
              <ShieldCheck className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-700 dark:text-white">لم يتم إضافة وسائل دفع بعد</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed dark:text-slate-300">أضف حسابك البنكي أو محفظة جيب لإتاحة خيارات الدفع لعملائك.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-6 text-primary font-bold text-sm hover:underline cursor-pointer">اضغط هنا للإضافة</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map(acc => (
              <div key={acc.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-primary/30 transition-colors dark:bg-[#0f172a] dark:border-slate-800">
                <div className={`absolute top-0 right-0 w-2 h-full ${acc.type === 'jaib' ? 'bg-gradient-to-b from-emerald-400 to-teal-500' : 'bg-gradient-to-b from-primary to-purple-500'}`} />
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 text-lg ${acc.type === 'jaib' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-100 border-slate-200 dark:border-slate-800 dark:bg-[#0f172a]'}`}>
                      {acc.type === 'jaib' ? '📱' : '🏦'}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white">{acc.type === 'jaib' ? 'محفظة جيب (JAIB)' : acc.bankName}</h4>
                      <p className="text-xs text-slate-500 font-medium dark:text-slate-300">{acc.type === 'jaib' ? 'محفظة إلكترونية' : 'حساب تحويل بنكي'}</p>
                    </div>
                  </div>
                  <button onClick={() => removeAccount(acc.id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition opacity-0 group-hover:opacity-100 cursor-pointer dark:text-slate-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 dark:bg-[#0f172a]">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium dark:text-slate-300">المستفيد:</span>
                    <span className="font-bold text-slate-800 dark:text-white">{acc.accountName}</span>
                  </div>
                  {acc.type === 'bank' ? (
                    <>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium dark:text-slate-300">رقم الحساب:</span>
                        <span className="font-mono font-bold text-slate-800 tracking-wider bg-white px-2 py-0.5 rounded border border-slate-100 dark:text-white dark:bg-[#0f172a]">{acc.accountNumber}</span>
                      </div>
                      {acc.iban && acc.iban !== 'غير محدد' && (
                        <div className="flex justify-between items-center text-sm pt-3 mt-1 border-t border-slate-200 border-dashed dark:border-slate-800">
                          <span className="text-slate-500 font-medium dark:text-slate-300">الآيبان:</span>
                          <span className="font-mono text-[11px] font-bold text-slate-800 tracking-wider bg-white px-2 py-0.5 rounded border border-slate-100 dark:text-white dark:bg-[#0f172a]">{acc.iban}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium dark:text-slate-300">رقم جيب:</span>
                      <span className="font-mono font-bold text-emerald-700 tracking-wider bg-emerald-50 px-3 py-0.5 rounded-lg border border-emerald-100 text-base">{acc.jaibNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});

const CustomersTab = ({ storeData }: { storeData: any }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rechargeModal, setRechargeModal] = useState<{ isOpen: boolean; customer: any; amount: string }>({ isOpen: false, customer: null, amount: '' });

  React.useEffect(() => {
    const fetchCustomers = async () => {
      if (!storeData?.id || String(storeData.id).startsWith("local-")) {
        const storeId = String(storeData?.id || '').replace('local-', '');
        try {
          const stored = JSON.parse(localStorage.getItem(`suriix_store_customers_${storeId}`) || '[]');
          setCustomers(stored);
        } catch { setCustomers([]); }
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('store_customers')
          .select('*')
          .eq('store_id', storeData.id)
          .order('created_at', { ascending: false });

        if (data && !error) {
          setCustomers(data);
        }
      } catch (err) {
        console.error("Error fetching store customers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, [storeData]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12 w-full text-right" dir="rtl">
      <ActionModal title="شحن محفظة العميل" isOpen={rechargeModal.isOpen} onClose={() => setRechargeModal({ isOpen: false, customer: null, amount: '' })}>
        <div className="space-y-4 text-sm font-bold text-slate-800 dark:text-white">
          <p>أدخل المبلغ المطلوب شحنه للعميل <span className="text-primary">{rechargeModal.customer?.name}</span> بالريال اليمني:</p>
          <input
            type="number"
            placeholder="المبلغ (مثال: 5000)"
            value={rechargeModal.amount}
            onChange={e => setRechargeModal(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition text-left dark:bg-[#0f172a] dark:border-slate-800"
            dir="ltr"
          />
          <button onClick={async () => {
            const amount = parseFloat(rechargeModal.amount);
            if (isNaN(amount) || amount <= 0) {
              alert("الرجاء إدخال مبلغ صحيح أكبر من الصفر");
              return;
            }
            const currentWallet = storeData.wallet || storeData.wallet_yer || 0;
            if (currentWallet < amount) {
              alert(`رصيدك الحالي (${currentWallet} ر.ي) غير كافٍ لشحن محفظة العميل بهذا المبلغ.`);
              return;
            }

            const c = rechargeModal.customer;
            const newCustomerWallet = (c.wallet || 0) + amount;
            const newOwnerWallet = currentWallet - amount;

            setCustomers(prev => prev.map(cust => cust.id === c.id ? { ...cust, wallet: newCustomerWallet } : cust));

            const slug = storeData.slug || storeData.storeLink;

            // 1. Database/LocalStorage Transactions
            if (storeData.id && !String(storeData.id).startsWith("local-")) {
              await supabase.from('users').update({ wallet_yer: newOwnerWallet }).eq('id', storeData.id);
              await supabase.from('store_customers').update({ wallet: newCustomerWallet }).eq('id', c.id);
              await supabase.from('transactions').insert({
                type: 'transfer',
                amount: amount,
                sender_id: storeData.id,
                receiver_id: c.id,
                status: 'completed',
                currency: 'YER',
                description: `شحن محفظة العميل: ${c.name}`
              });
            } else {
              const localTx = JSON.parse(localStorage.getItem('suriix_local_transactions') || '[]');
              localTx.push({
                id: Date.now(),
                type: 'transfer',
                amount: amount,
                sender_id: `store_${storeData.id}`,
                receiver_id: `customer_${c.id}`,
                status: 'completed',
                currency: 'YER',
                description: `شحن محفظة العميل: ${c.name}`,
                created_at: new Date().toISOString()
              });
              localStorage.setItem('suriix_local_transactions', JSON.stringify(localTx));
            }

            // Update Store Owner Locally to trigger UI reload
            try {
              const str = localStorage.getItem('suriix_added_stores');
              if (str) {
                const list = JSON.parse(str);
                const cleanUserId = String(storeData.id).replace('local-', '');
                const updated = list.map((s: any) => String(s.id) === cleanUserId ? { ...s, wallet: newOwnerWallet, wallet_yer: newOwnerWallet } : s);
                localStorage.setItem('suriix_added_stores', JSON.stringify(updated));
                window.dispatchEvent(new StorageEvent('storage', { key: 'suriix_added_stores' }));
              }
            } catch (_) { }

            // 2. ADD to Customer Locally for instant PublicStore sync
            try {
              const strCust = localStorage.getItem(`suriix_customer_${slug}`);
              if (strCust) {
                const custObj = JSON.parse(strCust);
                // Since PublicStore relies on customer object, if they are the exact one, replace wallet
                if (String(custObj.id) === String(c.id) || custObj.email === c.email) {
                  localStorage.setItem(`suriix_customer_${slug}`, JSON.stringify({ ...custObj, wallet: newCustomerWallet }));
                }
              }
            } catch (_) { }

            alert(`تم شحن ${amount} ر.ي لمحفظة العميل بنجاح! رصيدك المتبقي: ${newOwnerWallet} ر.ي`);
            setRechargeModal({ isOpen: false, customer: null, amount: '' });
          }} className="w-full bg-primary text-white p-3.5 rounded-xl font-bold hover:bg-primary/90 transition shadow-lg shadow-primary/30">
            تأكيد الشحن
          </button>
        </div>
      </ActionModal>
      <div className="bg-white rounded-3xl border border-border/40 shadow-sm p-8 flex flex-col md:flex-row items-center justify-between gap-6 dark:bg-[#0f172a] dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">عملاء المتجر</h2>
            <p className="text-sm text-slate-500 mt-1 font-medium max-w-md dark:text-slate-300">إليك قائمة بجميع العملاء الذين قاموا بإنشاء حسابات مخصصة داخل متجرك.</p>
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex flex-col items-center justify-center min-w-[120px] dark:bg-[#0f172a]">
          <span className="text-2xl font-black text-slate-800 dark:text-white">{customers.length}</span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-300">حساب عميل</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border/40 shadow-sm overflow-hidden dark:bg-[#0f172a] dark:border-slate-800">
        {isLoading ? (
          <div className="p-12 flex justify-center items-center">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <Users className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="font-bold text-lg text-slate-700 mb-1 dark:text-white">لا يوجد عملاء حتى الآن</h3>
            <p className="text-sm text-slate-500 max-w-sm dark:text-slate-300">بمجرد أن يقوم أحد زوار متجرك بإنشاء حساب، سيظهرون في هذه القائمة مع كافة بياناتهم.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right align-middle">
              <thead className="bg-slate-50 border-b border-border/40 text-slate-500 font-bold dark:bg-[#0f172a] dark:text-slate-300 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">اسم العميل</th>
                  <th className="px-6 py-4">البريد الإلكتروني</th>
                  <th className="px-6 py-4">رقم الجوال</th>
                  <th className="px-6 py-4">تاريخ التسجيل</th>
                  <th className="px-6 py-4 text-center">رصيد المحفظة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition bg-white group dark:bg-[#0f172a]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-400 text-white flex items-center justify-center font-bold text-lg shrink-0">
                          {(c.name || 'ع').charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">{c.name || 'عميل مجهول'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 truncate max-w-[200px] dark:text-slate-300" dir="ltr">{c.email || '-'}</td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-600 dark:text-slate-300" dir="ltr">{c.phone || '-'}</td>
                    <td className="px-6 py-4 font-medium text-slate-500 dark:text-slate-300">{new Date(c.created_at).toLocaleDateString('ar-YE', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="px-6 py-4 font-black">
                      <div className="flex items-center justify-center gap-2">
                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg">{(c.wallet || 0).toLocaleString()} ر.ي</span>
                        <button onClick={() => setRechargeModal({ isOpen: true, customer: c, amount: '' })} className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition" title="شحن الرصيد">
                          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const DomainTab = React.memo(({ storeData, onUpdateField }: { storeData: any, onUpdateField: (field: string, val: any) => void }) => {
  const [domain, setDomain] = useState(() => storeData?.custom_domain || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domainData, setDomainData] = useState<any>(null);
  const [errorStr, setErrorStr] = useState('');

  // Check if user has Pro or Business plan (domain feature requires upgrade)
  const pkg: string = storeData?.package || storeData?.tier || storeData?.subscription_name || '';
  // Also read from localStorage for cases where the full plan name is stored there
  const localTier = (() => { try { const ls = localStorage.getItem('suriix_added_stores'); if (ls) { const list = JSON.parse(ls); return list[0]?.tier || list[0]?.subscription_name || ''; } } catch { } return ''; })();
  const effectivePkg = pkg || localTier;
  const hasDomainAccess = effectivePkg.includes('احترافي') || effectivePkg.includes('بيزنس') || effectivePkg.includes('Business') || effectivePkg.includes('Professional') || effectivePkg.includes('VIP');

  const handleLinkDomain = async () => {
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
    if (!cleanDomain || cleanDomain.includes('/')) {
      setErrorStr('الرجاء إدخال نطاق صالح ومسموح به (مثال: mystore.com)');
      return;
    }
    
    setIsSubmitting(true);
    setErrorStr('');
    setDomainData(null);
    
    try {
      // call Vercel via backend API
      const response = await fetch('/api/domain', { 
         method: 'POST', 
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ domain: cleanDomain }) 
      });
      
      const result = await response.json();
      
      if (!response.ok) {
         setErrorStr(result.error?.message || result.error || 'فشل في ربط النطاق. تأكد من أن النطاق غير مرتبط مسبقاً.');
         setIsSubmitting(false);
         return;
      }
      
      // Save domain locally / in supabase
      toast.success('تم إضافة النطاق بنجاح! قد تحتاج الآن إلى إعداد الـ DNS الخاص بك.');
      setDomainData(result);
      // Update both custom_domain AND the visible store URL
      onUpdateField('custom_domain', cleanDomain);
      onUpdateField('url', cleanDomain);
      
      if (storeData.id && !String(storeData.id).startsWith("local-")) {
          const { error: dbError } = await supabase.from('stores').update({ custom_domain: cleanDomain }).eq('id', storeData.id);
          if (dbError) {
              console.error('Failed to sync domain to DB:', dbError);
              toast.error('لم يتم مزامنة النطاق مع قاعدة البيانات بشكل صحيح');
          }
      }
    } catch (err: any) {
      setErrorStr(err.message || 'حدث خطأ مجهول أثناء محاولة ربط النطاق');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show upgrade gate if user doesn't have access
  if (!hasDomainAccess) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto pt-6 pb-20 text-right" dir="rtl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-border/40 shadow-sm dark:border-slate-800 text-right flex flex-col items-center justify-center text-center py-16">
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-6 border-4 border-amber-100 dark:border-amber-800/40">
            <Crown className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3">ترقية مطلوبة</h2>
          <p className="text-slate-500 dark:text-slate-300 text-sm max-w-sm leading-relaxed mb-8">ميزة ربط النطاق المخصص متاحة فقط لمشتركي الباقة الاحترافية وما فوق. قم بالترقية الآن للحصول على نطاقك الخاص.</p>
          <button
            onClick={() => { /* Navigate to subscription tab is handled outside */ window.dispatchEvent(new CustomEvent('suriix_switch_tab', { detail: 'subscription' })); }}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg shadow-amber-200 dark:shadow-amber-900/40 flex items-center gap-2"
          >
            <Crown className="w-5 h-5" /> الترقية للباقة الاحترافية
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto pt-6 pb-20 text-right" dir="rtl">
       <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-border/40 shadow-sm dark:border-slate-800 text-right">
           <div className="flex items-center gap-4 mb-6">
               <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
                  <Globe className="w-7 h-7" />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-slate-800 dark:text-white">تخصيص نطاق المتجر</h2>
                  <p className="text-sm text-slate-500 mt-1 font-medium max-w-md dark:text-slate-300">قم بربط النطاق الخاص بك (دومين) ليعكس هوية علامتك التجارية بشكل أكثر احترافية بدلاً من رابط المنصة الافتراضي.</p>
               </div>
           </div>
           
           <div className="space-y-4">
              <div>
                 <label className="block text-slate-600 dark:text-slate-300 mb-2 font-medium text-sm">اسم النطاق (Domain)</label>
                 <div className="flex flex-col md:flex-row gap-3">
                    <input 
                       value={domain}
                       onChange={e => { setDomain(e.target.value); setErrorStr(''); }}
                       type="text" 
                       dir="ltr"
                       placeholder="مثال: www.mystore.com" 
                       className="flex-1 bg-slate-50 dark:bg-[#0f172a] p-4 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-primary outline-none transition text-left tracking-wider font-mono shadow-inner" 
                    />
                    <button 
                       onClick={handleLinkDomain}
                       disabled={isSubmitting || !domain.trim()}
                       className="bg-primary text-white font-bold py-4 px-8 rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 shrink-0"
                    >
                       {isSubmitting ? 'جاري التحقق...' : 'ربط النطاق'}
                    </button>
                 </div>
                 {errorStr && <p className="text-rose-500 text-sm font-bold mt-2 bg-rose-50 dark:bg-rose-900/20 p-2.5 rounded-lg w-fit">{errorStr}</p>}
                 {storeData?.custom_domain && storeData.custom_domain === domain && !domainData && (
                     <div className="mt-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 font-bold text-xs px-3 py-2 rounded-lg w-fit flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> النطاق مرتبط ومحفوظ ({storeData.custom_domain})
                     </div>
                 )}
              </div>
              
              {domainData && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/40 p-6 rounded-2xl overflow-hidden">
                    <h3 className="font-bold text-lg text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                       <Zap className="w-5 h-5" /> خطوة أخيرة! قم بإعداد الـ DNS
                    </h3>
                    <p className="text-sm font-medium leading-relaxed text-blue-700/80 dark:text-blue-200/80 mb-6">
                       لقد تم إنشاء النطاق في جانبنا بنجاح. الآن لكي يبدأ النطاق بالعمل، يجب عليك الذهاب إلى لوحة تحكم مزود الخدمة الخاص بك (مثل GoDaddy، Namecheap) وإضافة السجلات التالية الموضحة أدناه ليتم توجيه المستخدمين لمتجرك:
                    </p>
                    
                    <div className="space-y-4">
                       <h4 className="font-bold text-blue-800 dark:text-blue-300 border-b border-blue-200/60 pb-2">سجلات A Record (للنطاقات الأساسية root domain)</h4>
                       <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-800/50 p-4 rounded-xl flex items-center justify-between text-left font-mono">
                          <div>
                             <p className="text-xs text-slate-500 mb-1 font-sans">Type</p>
                             <p className="font-bold">A</p>
                          </div>
                          <div>
                             <p className="text-xs text-slate-500 mb-1 font-sans">Name</p>
                             <p className="font-bold">@</p>
                          </div>
                          <div>
                             <p className="text-xs text-slate-500 mb-1 font-sans">Value</p>
                             <p className="font-bold">76.76.21.21</p>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText('76.76.21.21'); toast.success('تم نسخ الـ IP'); }} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"><Copy className="w-4 h-4" /></button>
                       </div>
                       
                       <h4 className="font-bold text-blue-800 dark:text-blue-300 border-b border-blue-200/60 pb-2 mt-4">سجل CNAME (للنطاقات الفرعية www أو غيره)</h4>
                       <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-800/50 p-4 rounded-xl flex items-center justify-between text-left font-mono">
                          <div>
                             <p className="text-xs text-slate-500 mb-1 font-sans">Type</p>
                             <p className="font-bold">CNAME</p>
                          </div>
                          <div>
                             <p className="text-xs text-slate-500 mb-1 font-sans">Name</p>
                             <p className="font-bold">www</p>
                          </div>
                          <div>
                             <p className="text-xs text-slate-500 mb-1 font-sans">Value</p>
                             <p className="font-bold">cname.vercel-dns.com</p>
                          </div>
                          <button onClick={() => { navigator.clipboard.writeText('cname.vercel-dns.com'); toast.success('تم النسخ'); }} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"><Copy className="w-4 h-4" /></button>
                       </div>
                    </div>
                    {domainData.verification && domainData.verification.length > 0 && (
                       <div className="mt-6 pt-4 border-t border-blue-200/50">
                          <p className="text-amber-600 dark:text-amber-400 font-bold text-sm">ملاحظة: لقد عثرنا على إعدادات تحقق إضافية (TXT Verification) من المحتمل أنك تحتاج لإضافتها أيضاً:</p>
                          <div className="space-y-2 mt-3">
                             {domainData.verification.map((vr: any, idx: number) => (
                                <div key={idx} className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30 flex justify-between font-mono text-xs items-center text-left">
                                   <span><strong className="font-sans mr-2 text-amber-700">Type:</strong> {vr.type}</span>
                                   <span><strong className="font-sans mr-2 text-amber-700">Name:</strong> {vr.domain}</span>
                                   <span><strong className="font-sans mr-2 text-amber-700">Value:</strong> {vr.value}</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </motion.div>
              )}
           </div>
       </div>
    </motion.div>
  );
});

export default StoreDashboard;
