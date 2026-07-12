import React, { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { useNotifications } from '@/hooks/useNotifications';
import { notification } from '@/lib/notifications';
import { toast } from 'sonner';
import {
  LayoutDashboard, Store, CreditCard, Users, LayoutTemplate,
  Settings, LogOut, Bell, Sun, Moon, Search, ChevronLeft, Hexagon,
  Eye, Edit, Trash2, Plus, CheckCircle2, XCircle, MoreVertical,
  Filter, AlertTriangle, Download, Wallet, ArrowUpFromLine, Gift,
  Clock, FileText, Check, ChevronRight, Lock, TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Data States
  const [usersList, setUsersList] = useState<any[]>([]);
  const [storesList, setStoresList] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [rechargeRequests, setRechargeRequests] = useState<any[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [couponsList, setCouponsList] = useState<any[]>([]);
  const [marketersList, setMarketersList] = useState<any[]>([]);
  const [templatesList, setTemplatesList] = useState<any[]>([
    { id: "perfume", name: "قالب العطور الفاخر", category: "عطور ومستحضرات", installs: 142 },
    { id: "fashion", name: "قالب الأزياء الراقي", category: "أزياء وملابس", installs: 85 },
  ]);
  const [stats, setStats] = useState({ totalPending: 0, totalApproved: 0, totalAmount: 0, allCount: 0 });
  const [adminWalletBalance, setAdminWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const { notifications, unread, markAsRead, markAllAsRead } = useNotifications(adminUserId, 'admin');
  const [showNotifications, setShowNotifications] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals States
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserViewOpen, setIsUserViewOpen] = useState(false);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);

  const [selectedMarketer, setSelectedMarketer] = useState<any>(null);
  const [isMarketerViewOpen, setIsMarketerViewOpen] = useState(false);
  const [isMarketerEditOpen, setIsMarketerEditOpen] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPlanEditOpen, setIsPlanEditOpen] = useState(false);

  // Stores Management States
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [isStoreViewOpen, setIsStoreViewOpen] = useState(false);
  const [isStoreEditOpen, setIsStoreEditOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [storeSearch, setStoreSearch] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        localStorage.removeItem('suriix_admin_auth');
        window.location.href = '/admin';
        return;
      }
      setAdminUserId(session.user.id);
      fetchAllData();
    };
    checkAuth();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchUsers(),
      fetchStores(),
      fetchSubscriptionPlans(),
      fetchRechargeRequests(),
      fetchWithdrawalRequests(),
      fetchCoupons(),
      fetchMarketers(),
    ]);
    setIsLoading(false);
  };

  // Lazy-reload when switching sections
  useEffect(() => {
    if (activeSection === 'recharge') fetchRechargeRequests();
    if (activeSection === 'withdrawals') fetchWithdrawalRequests();
    if (activeSection === 'stores') fetchStores();
    if (activeSection === 'subscriptions') fetchSubscriptionPlans();
    if (activeSection === 'marketing') fetchCoupons();
    if (activeSection === 'users') fetchUsers();
    if (activeSection === 'marketers') fetchMarketers();
  }, [activeSection]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, status, created_at, wallet_yer')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AdminDashboard] fetchUsers error:', error.message);
    }
    if (data) {
      console.log('[AdminDashboard] fetchUsers data:', data.map(u => ({ email: u.email, status: u.status })));
      setUsersList(data);
    }
  };

  const fetchSubscriptionPlans = async () => {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .order('price', { ascending: true });

    if (data) {
      setSubscriptionPlans(data);
    }
  };

  const fetchStores = async () => {
    const { data: storesData, error } = await supabase
      .from('stores')
      .select('*, users(name, email, phone)')
      .order('created_at', { ascending: false });
      
    if (storesData) {
      const storeIds = storesData.map(s => s.id);
      let mergedStores = storesData;
      if (storeIds.length > 0) {
        const { data: refData } = await supabase
          .from('marketer_referrals')
          .select('store_id, marketers(name_ar, name_en)')
          .in('store_id', storeIds);
          
        mergedStores = storesData.map(st => {
          const ref = refData?.find(r => r.store_id === st.id);
          // @ts-ignore
          const marketerNode = ref?.marketers;
          // Support arrays if supabase returns an array for one-to-one or use object directly
          const marketer = Array.isArray(marketerNode) ? marketerNode[0] : marketerNode;
          return {
            ...st,
            marketer_name: marketer?.name_ar || marketer?.name_en || null
          };
        });
      }
      setStoresList(mergedStores);
    }
  };

  const fetchWithdrawalRequests = async () => {
    const { data, error } = await supabase
      .from('withdrawal_requests')
      .select('*, users!withdrawal_requests_user_id_fkey(name, email)')
      .order('created_at', { ascending: false });
    if (data) {
      setWithdrawalRequests(data);
      let balance = 0;
      data.forEach(r => {
        if (r.status === 'approved') balance += Number(r.amount) || 0;
      });
      setAdminWalletBalance(balance);
    }
  };

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*, stores(store_name)')
      .order('created_at', { ascending: false });
    if (data) setCouponsList(data);
  };

  const fetchMarketers = async () => {
    const { data, error } = await supabase
      .from('marketers')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setMarketersList(data);
    if (error) console.error('[Admin] fetchMarketers error:', error.message);
  };

  const fetchRechargeRequests = async () => {
    const { data, error } = await supabase
      .from('recharge_requests')
      .select('*, users!recharge_requests_user_id_fkey(name, email)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Recharge fetch error:', error.message);
      return;
    }

    if (data) {
      setRechargeRequests(data);
      let pending = 0, approved = 0, amount = 0;
      data.forEach(r => {
        if (r.status === 'pending') pending++;
        if (r.status === 'approved') {
          approved++;
          amount += Number(r.amount) || 0;
        }
      });
      setStats({
        allCount: data.length,
        totalPending: pending,
        totalApproved: approved,
        totalAmount: amount
      });
    }
  };

  const handleApproveRecharge = async (requestId: string, userId: string, amount: number) => {
    try {
      // 1. Update request status to 'approved'
      const { error: reqError } = await supabase
        .from('recharge_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (reqError) throw reqError;

      // 2. Fetch current user wallet
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('wallet_yer')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const currentWallet = userData.wallet_yer || 0;
      const newWallet = currentWallet + Number(amount);

      // 3. Update user wallet
      const { error: updateError } = await supabase
        .from('users')
        .update({ wallet_yer: newWallet })
        .eq('id', userId);

      if (updateError) throw updateError;

      // 4. Send Notification
      await notification.send({
        user_id: userId,
        role: 'store_owner',
        type: 'wallet',
        title: 'تم شحن رصيدك',
        message: `تم شحن رصيدك بمبلغ ${Number(amount).toLocaleString()} ر.ي بنجاح.`,
      });

      // Refresh list
      fetchRechargeRequests();

    } catch (e: any) {
      console.error('Approve failed:', e.message);
      toast.error('حدث خطأ أثناء الموافقة: ' + e.message);
    }
  };

  const handleRejectRecharge = async (requestId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('recharge_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      await notification.send({
        user_id: userId,
        role: 'store_owner',
        type: 'wallet',
        title: 'تم رفض طلب الشحن',
        message: 'تم رفض طلب شحن الرصيد الخاص بك. يرجى التواصل مع الدعم الفني.',
      });

      fetchRechargeRequests();
    } catch (e: any) {
      console.error('Reject failed:', e.message);
      toast.error('حدث خطأ أثناء الرفض: ' + e.message);
    }
  };

  const handleApproveWithdrawal = async (requestId: string, userId: string, amount: number) => {
    try {
      // Update request status to 'approved'
      const { error: reqError } = await supabase
        .from('withdrawal_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);

      if (reqError) throw reqError;

      // Send Notification to Store Owner
      await notification.send({
        user_id: userId,
        role: 'store_owner',
        type: 'wallet',
        title: 'تم الموافقة على طلب تحويل الرصيد',
        message: `تم الموافقة على تحويل أو سحب مبلغ ${Number(amount).toLocaleString()} ر.ي بنجاح.`,
      });

      // Refresh list
      fetchWithdrawalRequests();

    } catch (e: any) {
      console.error('Approve failed:', e.message);
      toast.error('حدث خطأ أثناء الموافقة: ' + e.message);
    }
  };

  const handleRejectWithdrawal = async (requestId: string, userId: string, amount: number) => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      // Refund the wallet amount to the user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('wallet_yer')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const newWallet = (userData.wallet_yer || 0) + Number(amount);

      const { error: updateError } = await supabase
        .from('users')
        .update({ wallet_yer: newWallet })
        .eq('id', userId);

      if (updateError) throw updateError;

      await notification.send({
        user_id: userId,
        role: 'store_owner',
        type: 'wallet',
        title: 'تم رفض طلب تحويل الرصيد',
        message: `تم رفض طلب التحويل وتمت إعادة مبلغ ${Number(amount).toLocaleString()} ر.ي إلى محفظتك. يرجى التواصل مع الدعم الفني.`,
      });

      fetchWithdrawalRequests();
    } catch (e: any) {
      console.error('Reject failed:', e.message);
      toast.error('حدث خطأ أثناء الرفض: ' + e.message);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'banned' : 'active';
      const { error } = await supabase.from('users').update({ status: newStatus }).eq('id', userId);
      if (error) throw error;
      
      // Update store status if it's a store owner
      const storeIsActive = newStatus === 'active';
      await supabase.from('stores').update({ is_active: storeIsActive }).eq('user_id', userId);

      fetchUsers();
      fetchStores();
      toast.success(newStatus === 'banned' ? 'تم حظر المستخدم وإيقاف متجره بنجاح' : 'تم استرجاع المستخدم وتفعيل متجره بنجاح');
    } catch (e: any) {
      toast.error('حدث خطأ: ' + e.message);
    }
  };

  const handleToggleStoreStatus = async (storeId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('stores').update({ is_active: !currentStatus }).eq('id', storeId);
      if (error) throw error;
      fetchStores();
      toast.success(!currentStatus ? 'تم تفعيل المتجر بنجاح' : 'تم إيقاف المتجر بنجاح');
    } catch (e: any) {
      toast.error('حدث خطأ: ' + e.message);
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المتجر نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        const { error } = await supabase.from('stores').delete().eq('id', storeId);
        if (error) throw error;
        toast.success('تم حذف المتجر بنجاح');
        fetchStores();
      } catch (e: any) {
        toast.error('حدث خطأ أثناء حذف المتجر: ' + e.message);
      }
    }
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) return;
    try {
      const { error } = await supabase
        .from('stores')
        .update({
          store_name: selectedStore.store_name,
          slug: selectedStore.slug,
          is_active: selectedStore.is_active,
          tier: selectedStore.tier
        })
        .eq('id', selectedStore.id);
      
      if (error) throw error;
      toast.success('تم تحديث بيانات المتجر بنجاح');
      setIsStoreEditOpen(false);
      fetchStores();
    } catch (e: any) {
      toast.error('حدث خطأ أثناء تحديث المتجر: ' + e.message);
    }
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore?.user_id || !selectedStore?.store_name || !selectedStore?.slug) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }
    try {
      const { error } = await supabase.from('stores').insert({
        user_id: selectedStore.user_id,
        store_name: selectedStore.store_name,
        slug: selectedStore.slug,
        is_active: false,
        tier: 'free'
      });
      if (error) throw error;
      
      // Update user role to store_owner
      await supabase.from('users').update({ role: 'store_owner' }).eq('id', selectedStore.user_id);
      
      toast.success('تم إنشاء المتجر بنجاح');
      setIsAddStoreOpen(false);
      setSelectedStore(null);
      fetchStores();
      fetchUsers();
    } catch (e: any) {
      toast.error('حدث خطأ أثناء إنشاء المتجر: ' + e.message);
    }
  };

  const handleDeleteMarketer = async (marketerId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المسوق؟ سيتم إزالة جميع بياناته بشكل نهائي.')) {
      try {
        const { error } = await supabase.from('marketers').delete().eq('id', marketerId);
        if (error) throw error;
        fetchMarketers();
        toast.success('تم حذف المسوق بنجاح');
      } catch (e: any) {
        toast.error('حدث خطأ أثناء الحذف: ' + e.message);
      }
    }
  };

  const handleTogglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('subscription_plans').update({ is_active: !currentStatus }).eq('id', planId);
      if (error) throw error;
      fetchSubscriptionPlans();
      toast.success(!currentStatus ? 'تم تفعيل الباقة بنجاح' : 'تم إيقاف الباقة بنجاح');
    } catch (e: any) {
      toast.error('حدث خطأ: ' + e.message);
    }
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('suriix_theme', newIsDark ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('suriix_admin_auth');
    localStorage.removeItem('suriix_user_role');
    window.location.href = '/admin-login';
  };

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'stores', label: 'إدارة المتاجر', icon: Store },
    { id: 'subscriptions', label: 'الاشتراكات', icon: CreditCard },
    { id: 'recharge', label: 'طلبات الشحن', icon: Wallet },
    { id: 'withdrawals', label: 'طلبات السحب', icon: ArrowUpFromLine },
    { id: 'admin_wallet', label: 'محفظة الإدارة', icon: Wallet },
    { id: 'marketing', label: 'إدارة التسويق', icon: Gift },
    { id: 'marketers', label: 'المسوقون', icon: Users },
    { id: 'users', label: 'المستخدمون', icon: Users },
    { id: 'templates', label: 'القوالب', icon: LayoutTemplate },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'approved': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'rejected': return 'bg-red-50 text-red-600 border border-red-200';
      case 'canceled': return 'bg-gray-50 text-gray-600 border border-gray-200 dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300';
      default: return 'bg-gray-100 text-gray-600 border border-gray-200 dark:border-slate-800 dark:text-slate-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'معلق';
      case 'approved': return 'موافق عليه';
      case 'rejected': return 'مرفوض';
      case 'canceled': return 'ملغي';
      default: return status;
    }
  };

  const formatDate = (ds: string) => {
    if (!ds) return { d: '', t: '' };
    const date = new Date(ds);
    return {
      d: date.toISOString().split('T')[0],
      t: date.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredRequests = rechargeRequests.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    return true;
  });

  const activeStoresCount = storesList.filter(s => s.is_active).length;
  const pendingStoresCount = storesList.filter(s => !s.is_active).length;
  const filteredStores = storesList.filter(s => {
    if (!storeSearch) return true;
    const term = storeSearch.toLowerCase();
    return s.store_name?.toLowerCase().includes(term) || 
           s.users?.name?.toLowerCase().includes(term) || 
           s.slug?.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-[#F9F9FC] dark:bg-[#111116] flex font-sans text-gray-800 dark:text-gray-200" dir="rtl">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white dark:bg-[#1A1A24] border-l border-gray-100 dark:border-white/5 flex flex-col transition-all h-screen sticky top-0 shrink-0 shadow-sm z-10">

        {/* LOGO */}
        <div className="h-20 flex items-center justify-center border-b border-gray-50 dark:border-white/5 mx-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <Hexagon className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[20px] tracking-tight text-gray-900 dark:text-white leading-none mb-0.5">Suriix Store</span>
              <span className="text-[9px] font-bold text-gray-400 tracking-[0.2em] uppercase dark:text-slate-300">ADMIN CONSOLE</span>
            </div>
          </div>
        </div>

        {/* NAV ITEMS */}
        <div className="flex-1 overflow-y-auto py-4 pl-0 space-y-1">
          {menuItems.map(item => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3.5 px-6 py-3.5 transition-all font-bold text-sm
                ${active
                    ? 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border-r-4 border-purple-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-white/5 dark:hover:text-white border-r-4 border-transparent dark:text-white dark:bg-[#0f172a]'}`}
              >
                <item.icon className="w-5 h-5 opacity-90" strokeWidth={active ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* PROFILE WIDGET */}
        <div className="p-6 border-t border-gray-50 dark:border-white/5 bg-white dark:bg-[#1A1A24]">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                MS
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm text-gray-900 dark:text-white">معتز الصريمي </span>
              <span className="text-[11px] text-purple-600 font-bold flex items-center gap-1">المدير العام <div className="w-1 h-1 bg-purple-600 rounded-full"></div></span>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-purple-50 text-purple-600 font-bold text-xs hover:bg-purple-100 transition-colors">
              <Lock className="w-3.5 h-3.5" />
              تغيير كلمة المرور
            </button>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-50 text-red-500 font-bold text-xs hover:bg-red-100 transition-colors border border-red-50">
              <LogOut className="w-3.5 h-3.5" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="h-20 bg-white dark:bg-[#1A1A24] border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-bold text-gray-800 dark:text-gray-200">
            <span className="font-black text-[15px]">المدير العام Console</span>
            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden lg:flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute right-4 dark:text-slate-300" />
              <input
                type="text"
                placeholder="بحث سريع في المنصة..."
                className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full h-10 pr-10 pl-20 w-[340px] text-sm outline-none focus:border-purple-200 transition-colors font-medium text-gray-600 dark:text-slate-300"
              />
              <div className="absolute left-3 flex items-center gap-1 text-[10px] text-gray-400 font-bold bg-white dark:bg-black/20 px-2 py-1 rounded shadow-sm border border-gray-100 dark:text-slate-300">
                <span>Ctrl + K</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="w-10 h-10 relative rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-gray-100 dark:bg-[#0f172a] dark:text-slate-300">
                  <Bell className="w-4 h-4" />
                  {unread > 0 && <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 border-[1.5px] border-white text-white rounded-full text-[8px] font-black flex items-center justify-center">{unread}</span>}
                </button>
                {showNotifications && (
                  <div className="absolute top-12 left-0 w-80 bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900 dark:text-white">الإشعارات</h3>
                      {unread > 0 && (
                        <button onClick={markAllAsRead} className="text-xs text-purple-600 font-bold hover:underline">تحديد الكل كمقروء</button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map((n: any) => (
                        <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-4 border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors ${!n.is_read ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}>
                          <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{n.title}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-300">{n.message}</p>
                        </div>
                      )) : (
                        <div className="p-6 text-center text-gray-400 text-sm font-bold dark:text-slate-300">لا توجد إشعارات</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={toggleTheme} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-gray-100 dark:bg-[#0f172a] dark:text-slate-300">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 p-6 lg:p-10">

          {activeSection === 'recharge' && (
            <div className="max-w-[1400px] mx-auto space-y-6">

              {/* PAGE TITLE */}
              <div>
                <h1 className="text-[28px] font-black text-gray-900 dark:text-white mb-2">طلبات الشحن المحفوظة</h1>
                <p className="text-gray-500 text-sm font-medium dark:text-slate-300">مراجعة طلبات الشحن المقدمة من أصحاب المتاجر والموافقة عليها</p>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-bold mb-2 dark:text-slate-300">إجمالي المبالغ</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">$ {(stats.totalAmount / 530).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-xs font-bold text-green-500 flex items-center gap-1"><ArrowUpFromLine className="w-3 h-3" /> 12.5% هذا الشهر</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 flex items-center justify-center">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-bold mb-2 dark:text-slate-300">معلق</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">{stats.totalPending}</p>
                    <p className="text-xs font-bold text-gray-400 dark:text-slate-300">بانتظار المراجعة</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-500/10 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-bold mb-2 dark:text-slate-300">موافق عليه</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">{stats.totalApproved}</p>
                    <p className="text-xs font-bold text-gray-400 dark:text-slate-300">تمت الموافقة</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 dark:bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm font-bold mb-2 dark:text-slate-300">إجمالي الطلبات</p>
                    <p className="text-2xl font-black text-gray-900 dark:text-white mb-2">{stats.allCount}</p>
                    <p className="text-xs font-bold text-gray-400 dark:text-slate-300">كل الطلبات</p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-500/10 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* FILTERS & TABS BLOCK */}
              <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl p-4 shadow-sm space-y-4">

                {/* Filters Row */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
                      <Download className="w-4 h-4" />
                      تصدير
                    </button>
                    <button className="flex items-center gap-2 border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300">
                      <Filter className="w-4 h-4" />
                      تصفية
                    </button>

                    <div className="flex gap-2">
                      <select className="bg-transparent border border-gray-200 text-gray-600 rounded-xl px-4 py-2.5 text-sm font-bold min-w-[120px] outline-none dark:border-slate-800 dark:text-slate-300">
                        <option>الكل (الحالة)</option>
                      </select>
                      <select className="bg-transparent border border-gray-200 text-gray-600 rounded-xl px-4 py-2.5 text-sm font-bold min-w-[120px] outline-none dark:border-slate-800 dark:text-slate-300">
                        <option>الكل (الشحن)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center text-sm">
                      <span className="text-gray-400 text-xs ml-2 dark:text-slate-300">تاريخ الطلب</span>
                      <input type="date" className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none dark:border-slate-800 dark:text-slate-300" />
                      <span className="mx-2 text-gray-400 dark:text-slate-300">-</span>
                      <input type="date" className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none dark:border-slate-800 dark:text-slate-300" />
                    </div>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute right-3 top-3 text-gray-400 dark:text-slate-300" />
                      <input
                        type="text"
                        placeholder="بحث..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-200 rounded-xl px-3 pl-3 pr-9 py-2.5 text-sm w-48 outline-none focus:border-purple-300 dark:border-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Tags Row */}
                <div className="flex items-center justify-end gap-3 flex-wrap">
                  {[
                    { id: 'all', label: 'الكل', count: stats.allCount, color: 'purple' },
                    { id: 'pending', label: 'معلق', count: stats.totalPending, color: 'amber' },
                    { id: 'approved', label: 'موافق عليه', count: stats.totalApproved, color: 'emerald' },
                    { id: 'rejected', label: 'مرفوض', count: 3, color: 'red' },
                    { id: 'canceled', label: 'ملغي', count: 2, color: 'gray' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all
                        ${statusFilter === tab.id
                          ? tab.color === 'purple' ? 'border-purple-500 text-purple-600 bg-purple-50' : `border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50`
                          : 'border-transparent text-gray-500 hover:bg-gray-50 dark:bg-[#0f172a] dark:text-slate-300'}`}
                    >
                      <span>{tab.label}</span>
                      <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] 
                         ${statusFilter === tab.id ? `bg-${tab.color}-100` : 'bg-gray-100 text-gray-400 dark:text-slate-300'}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

              </div>

              {/* TABLE */}
              <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden">
                <table className="w-full text-right">
                  <thead className="bg-[#FCFDFE] dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-gray-500 text-xs font-bold dark:text-slate-300">
                    <tr>
                      <th className="py-5 px-6">المستخدم</th>
                      <th className="py-5 px-6">المبلغ</th>
                      <th className="py-5 px-6">تاريخ الطلب</th>
                      <th className="py-5 px-6">الحالة</th>
                      <th className="py-5 px-6 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {filteredRequests.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-bold dark:text-slate-300">لا يوجد طلبات شحن لعرضها</td></tr>
                    ) : filteredRequests.map((req) => {
                      const dt = formatDate(req.created_at);
                      const userName = req.user_name || req.users?.name || 'مستخدم';
                      const userEmail = req.user_email || req.users?.email || '';
                      const userInitial = userName.charAt(0);
                      return (
                        <tr key={req.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors dark:bg-[#0f172a]">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm shrink-0">
                                {userInitial}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm dark:text-white">{userName}</p>
                                <p className="text-xs text-gray-400 font-medium dark:text-slate-300" dir="ltr">{userEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-black text-gray-900 text-sm dark:text-white">
                              {Number(req.amount).toLocaleString()} <span className="text-xs font-bold text-gray-400 dark:text-slate-300">ر.ي</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500 font-medium dark:text-slate-300">
                            {dt.d} <br /> <span className="text-xs text-gray-400 dark:text-slate-300">{dt.t}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(req.status)}`}>
                              {getStatusLabel(req.status)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              {req.status === 'pending' && (
                                <>
                                  <button onClick={() => handleApproveRecharge(req.id, req.user_id, req.amount)} className="w-8 h-8 rounded-full border border-emerald-200 bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors" title="موافقة">
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleRejectRecharge(req.id, req.user_id)} className="w-8 h-8 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors" title="رفض">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-purple-500 hover:bg-purple-50 transition-colors dark:border-slate-800">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                  </tbody>
                </table>

                {/* Pagination footer */}
                <div className="py-4 px-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-sm text-gray-500 font-medium dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span>عرض</span>
                    <select className="border border-gray-200 rounded-md px-2 py-1 outline-none text-gray-700 dark:text-white dark:border-slate-800">
                      <option>10</option>
                    </select>
                    <span>من 1 إلى 10 من 40 طلب</span>
                  </div>

                  <div className="flex items-center gap-2 select-none">
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg flex items-center gap-1 hover:bg-gray-50 text-gray-600 dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300">
                      <ChevronRight className="w-4 h-4" /> السابق
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center">1</button>
                    <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-bold flex items-center justify-center dark:text-slate-300">2</button>
                    <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-bold flex items-center justify-center dark:text-slate-300">3</button>
                    <span>...</span>
                    <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 font-bold flex items-center justify-center dark:text-slate-300">8</button>
                    <button className="px-3 py-1.5 border border-gray-200 rounded-lg flex items-center gap-1 hover:bg-gray-50 text-gray-600 dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300">
                      التالي <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeSection === 'marketers' && (
            <div className="max-w-[1400px] mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">إدارة المسوقين</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">عرض وإدارة جميع حسابات المسوقين المسجلة في المنصة</p>
                </div>
                <div className="flex gap-3">
                  <button className="h-10 px-4 bg-white dark:bg-[#1A1A24] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm">
                    <Download className="w-4 h-4" /> تصدير CSV
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: 'إجمالي المسوقين', val: marketersList.length, icon: Users, color: 'purple' },
                  { label: 'انضموا هذا الشهر', val: marketersList.filter(m => new Date(m.created_at).getMonth() === new Date().getMonth()).length, icon: TrendingUp, color: 'emerald' },
                  { label: 'رموز الإحالة النشطة', val: marketersList.filter(m => m.referral_code).length, icon: Gift, color: 'fuchsia' },
                ].map((s, i) => (
                  <div key={i} className="bg-white dark:bg-[#1A1A24] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-full bg-${s.color}-50 dark:bg-${s.color}-900/10 flex items-center justify-center text-${s.color}-600 shrink-0`}>
                      <s.icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold mb-1 text-xs dark:text-slate-300">{s.label}</p>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white">{s.val}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="bg-white dark:bg-[#1A1A24] rounded-2xl p-4 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 dark:text-slate-300" />
                  <input
                    type="text"
                    placeholder="ابحث عن مسوق بالاسم، الإيميل، أو رقم الهاتف..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl h-12 pr-12 pl-4 text-sm font-medium outline-none focus:border-purple-300 transition-all text-gray-700 dark:text-white"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl shadow-sm overflow-hidden">
                <table className="w-full text-right">
                  <thead className="bg-[#FCFDFE] dark:bg-white/5 border-b border-gray-100 dark:border-white/5 text-gray-500 text-xs font-bold dark:text-slate-300">
                    <tr>
                      <th className="py-5 px-6">المسوق</th>
                      <th className="py-5 px-6">البريد الإلكتروني</th>
                      <th className="py-5 px-6">رقم الهاتف</th>
                      <th className="py-5 px-6">رمز الإحالة</th>
                      <th className="py-5 px-6">تاريخ التسجيل</th>
                      <th className="py-5 px-6 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {marketersList.length === 0 ? (
                      <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm font-bold dark:text-slate-300">لا يوجد مسوقون مسجلون بعد</td></tr>
                    ) : marketersList
                      .filter(m => {
                        const q = searchQuery.toLowerCase();
                        return !q || (m.name_ar || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q) || (m.phone || '').includes(q);
                      })
                      .map((m) => {
                        const dt = formatDate(m.created_at);
                        const initial = (m.name_ar || m.name_en || 'م').charAt(0);
                        return (
                          <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors dark:bg-[#0f172a]">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-fuchsia-100 text-fuchsia-600 flex items-center justify-center font-black text-sm shrink-0">{initial}</div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm dark:text-white">{m.name_ar || '—'}</p>
                                  <p className="text-xs text-gray-400 dark:text-slate-300">{m.name_en || ''}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-600 font-medium dark:text-slate-300" dir="ltr">{m.email || '—'}</td>
                            <td className="py-4 px-6 text-sm text-gray-600 font-medium dark:text-slate-300" dir="ltr">{m.phone || '—'}</td>
                            <td className="py-4 px-6">
                              <span className="font-mono bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 px-3 py-1 rounded-lg text-xs font-bold">{m.referral_code || '—'}</span>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-500 font-medium dark:text-slate-300">{dt.d}<br /><span className="text-xs text-gray-400 dark:text-slate-300">{dt.t}</span></td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-center gap-2">
                                <button onClick={() => { setSelectedMarketer(m); setIsMarketerViewOpen(true); }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300" title="عرض التفاصيل">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setSelectedMarketer(m); setIsMarketerEditOpen(true); }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors dark:border-slate-800" title="تعديل البيانات">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteMarketer(m.id)} className="w-8 h-8 rounded-full border border-red-200 bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors" title="حذف">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="max-w-[1400px] mx-auto space-y-6">

              {/* PAGE HEADER */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">إدارة المستخدمين</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">التحكم الكامل بجميع حسابات المنصة وصلاحياتها</p>
                </div>

                <div className="flex gap-3">
                  <button className="h-10 px-4 bg-white dark:bg-[#1A1A24] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm">
                    <Download className="w-4 h-4" /> تصدير CSV
                  </button>
                  <button className="h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20">
                    <Plus className="w-4 h-4" /> إضافة مستخدم
                  </button>
                </div>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  {
                    label: 'إجمالي المستخدمين',
                    val: usersList.length,
                    icon: Users,
                    color: 'blue'
                  },
                  {
                    label: 'أصحاب المتاجر',
                    val: usersList.filter(u => u.role === 'store_owner').length,
                    icon: Store,
                    color: 'indigo'
                  },
                  {
                    label: 'مدراء النظام',
                    val: usersList.filter(u => u.role === 'admin').length,
                    icon: Lock,
                    color: 'purple'
                  },
                  {
                    label: 'محظورون / قيد المراجعة',
                    val: usersList.filter(u => u.status === 'banned').length || 0,
                    icon: AlertTriangle,
                    color: 'red'
                  }
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-[#1A1A24] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-5 hover:shadow-lg transition-shadow">
                    <div className={`w-14 h-14 rounded-full bg-${stat.color}-50 dark:bg-${stat.color}-900/10 flex items-center justify-center text-${stat.color}-600 shrink-0`}>
                      <stat.icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold mb-1 text-xs dark:text-slate-300">{stat.label}</p>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{stat.val}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* FILTERS & SEARCH */}
              <div className="bg-white dark:bg-[#1A1A24] rounded-2xl p-4 border border-gray-100 dark:border-white/5 flex flex-wrap lg:flex-nowrap items-center gap-4 shadow-sm">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 dark:text-slate-300" />
                  <input
                    type="text"
                    placeholder="ابحث عن مستخدم بالاسم، الإيميل..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl h-12 pr-12 pl-4 text-sm font-medium outline-none focus:border-purple-300 focus:bg-white dark:focus:bg-black/20 transition-all text-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="h-12 bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-xl flex p-1">
                    {['الكل', 'مدراء', 'أصحاب متاجر'].map(f => (
                      <button key={f} className={`px-4 h-full rounded-lg text-xs font-bold transition-all ${f === 'الكل' ? 'bg-white shadow-sm text-gray-900 border border-gray-100 dark:text-white dark:bg-[#0f172a]' : 'text-gray-500 hover:text-gray-700 dark:text-white'}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                  <button className="h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300">
                    <Filter className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* USERS TABLE */}
              <div className="bg-white dark:bg-[#1A1A24] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-[11px] font-black text-gray-400 uppercase tracking-wider dark:text-slate-300">
                      <th className="py-4 px-6 rounded-tr-2xl">المستخدم</th>
                      <th className="py-4 px-6">الصلاحية</th>
                      <th className="py-4 px-6">الحالة</th>
                      <th className="py-4 px-6">المحفظة</th>
                      <th className="py-4 px-6">تاريخ الانضمام</th>
                      <th className="py-4 px-6 rounded-tl-2xl text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {usersList.length > 0 ? usersList.map((user) => {
                      const initial = user.name?.charAt(0) || 'م';
                      const isStoreOwner = user.role === 'store_owner';
                      const isAdmin = user.role === 'admin';
                      return (
                        <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors dark:bg-[#0f172a]">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${isAdmin ? 'bg-purple-100 text-purple-600' : isStoreOwner ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600 dark:text-slate-300'}`}>
                                {initial}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm dark:text-white">{user.name || 'مستخدم'}</p>
                                <p className="text-xs text-gray-400 font-medium dark:text-slate-300">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5">
                              {isAdmin ? <Lock className="w-3.5 h-3.5 text-purple-500" /> : isStoreOwner ? <Store className="w-3.5 h-3.5 text-indigo-500" /> : <Users className="w-3.5 h-3.5 text-gray-400 dark:text-slate-300" />}
                              <span className={`text-xs font-bold ${isAdmin ? 'text-purple-600' : isStoreOwner ? 'text-indigo-600' : 'text-gray-500 dark:text-slate-300'}`}>
                                {isAdmin ? 'إدارة عليا' : isStoreOwner ? 'صاحب متجر' : 'عميل'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${user.status === 'banned' ? 'bg-red-50 text-red-600' :
                                user.status === 'active' ? 'bg-green-50 text-green-600' :
                                  'bg-orange-50 text-orange-600'
                              }`}>
                              {user.status === 'banned' ? 'محظور' : user.status === 'active' ? 'نشط' : 'بانتظار التفعيل'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-gray-900 text-sm dark:text-white">{(user.wallet_yer || 0).toLocaleString()} ر.ي</span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500 font-medium dark:text-slate-300">
                            {new Date(user.created_at).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="py-4 px-6 flex items-center justify-center gap-2">
                            <button onClick={() => { setSelectedUser(user); setIsUserViewOpen(true); }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors dark:border-slate-800" title="عرض التفاصيل"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => { setSelectedUser(user); setIsUserEditOpen(true); }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300" title="تعديل"><Edit className="w-4 h-4" /></button>
                            {user.status !== 'banned' ? (
                              <button onClick={() => handleToggleUserStatus(user.id, user.status)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors dark:border-slate-800" title="حظر الحساب"><XCircle className="w-4 h-4" /></button>
                            ) : (
                              <button onClick={() => handleToggleUserStatus(user.id, user.status)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-green-500 hover:bg-green-50 transition-colors dark:border-slate-800" title="استرجاع الحساب"><CheckCircle2 className="w-4 h-4" /></button>
                            )}
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400 text-sm font-bold dark:text-slate-300">لا يوجد مستخدمين لعرضهم</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeSection === 'marketing' && (
            <div className="max-w-[1400px] mx-auto space-y-6">

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">إدارة التسويق</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">التحكم في العروض، الكوبونات وحملات المنصة الترويجية</p>
                </div>
                <div className="flex gap-3">
                  <button className="h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20">
                    <Plus className="w-4 h-4" /> حملة جديدة
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* كوبونات الخصم العامة */}
                <div className="bg-white dark:bg-[#1A1A24] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <Gift className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">أكواد الخصم الترويجية</h3>
                    </div>
                    <button className="text-indigo-600 text-sm font-bold hover:underline">عرض الكل</button>
                  </div>

                  <div className="space-y-3">
                    {couponsList.length > 0 ? couponsList.map((c) => (
                      <div key={c.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5">
                        <div>
                          <p className="font-black text-gray-900 dark:text-white tracking-wider font-mono text-lg">{c.code}</p>
                          <p className="text-xs text-gray-500 font-bold mt-1 dark:text-slate-300">خصم: {c.discount_type === 'percent' ? c.discount_value + '%' : c.discount_value + ' ر.ي'} • مرات الاستخدام: {c.used_count}/{c.max_uses}</p>
                        </div>
                        <div className="mt-3 sm:mt-0 flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${c.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500 dark:text-slate-300'}`}>
                            {c.is_active ? 'نشط' : 'منتهي'}
                          </span>
                          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300"><Edit className="w-4 h-4" /></button>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-6 text-gray-400 text-sm font-bold dark:text-slate-300">لا توجد كوبونات مسجلة</div>
                    )}
                  </div>
                </div>

                {/* إعلانات المنصة */}
                <div className="bg-white dark:bg-[#1A1A24] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">إشعارات المنصة للمتاجر</h3>
                    </div>
                    <button className="text-orange-600 text-sm font-bold hover:underline">إرسال إشعار</button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'تم إطلاق باقة الأعمال الجديدة!', target: 'الكل', date: 'منذ ساعتين' },
                      { title: 'تذكير: تحديث سياسة المنصة', target: 'أصحاب المتاجر', date: 'امس' },
                      { title: 'صيانة مجدولة للنظام', target: 'الكل', date: 'قبل 3 أيام' }
                    ].map((n, i) => (
                      <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-50 dark:border-white/5 last:border-0">
                        <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm leading-snug">{n.title}</p>
                          <p className="text-xs text-gray-400 mt-1 dark:text-slate-300">الاستهداف: {n.target} • {n.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeSection === 'admin_wallet' && (
            <div className="max-w-[1400px] mx-auto space-y-6">

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">محفظة الإدارة</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">متابعة إيرادات المنصة من الاشتراكات والعمولات</p>
                </div>
                <div className="flex gap-3">
                  <button className="h-10 px-5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-sm dark:text-white dark:bg-[#0f172a] dark:border-slate-800">
                    <Download className="w-4 h-4" /> كشف الحساب
                  </button>
                  <button className="h-10 px-5 bg-green-600 hover:bg-green-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-green-600/20">
                    <ArrowUpFromLine className="w-4 h-4" /> سحب الأرباح
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* الإيرادات الكلية */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg shadow-green-500/20">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 dark:bg-[#0f172a]"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-3xl -ml-10 -mb-10"></div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm dark:bg-[#0f172a]"><Wallet className="w-6 h-6 text-white" /></div>
                      <div>
                        <p className="text-white/80 text-sm font-bold">الرصيد المتاح للرسوم</p>
                        <p className="text-white/60 text-xs text-left w-full" dir="ltr">Suriix System</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-5xl font-black mb-2" dir="ltr">{adminWalletBalance.toLocaleString()} <span className="text-2xl text-white/70">YER</span></p>
                      <p className="text-white/80 text-sm font-medium">آخر تحديث قبل 5 دقائق</p>
                    </div>
                  </div>
                </div>

                {/* الحركات الأخيرة */}
                <div className="lg:col-span-2 bg-white dark:bg-[#1A1A24] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6 flex flex-col min-h-[300px]">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6">أرباح الاشتراكات والعمولات</h3>
                  <div className="space-y-1 flex-1 overflow-y-auto pr-2">
                    {[
                      { title: 'اشتراك باقة الأعمال', store: 'متجر عالم التقنية', amount: '+43,000 ر.ي', date: 'منذ ساعتين', type: 'in' },
                      { title: 'عمولة مبيعات (5%)', store: 'متجر الأناقة', amount: '+2,500 ر.ي', date: 'منذ 5 ساعات', type: 'in' },
                      { title: 'اشتراك الباقة الأساسية', store: 'متجر زهرة', amount: '+8,000 ر.ي', date: 'امس', type: 'in' },
                      { title: 'سحب أرباح للإدارة', store: 'تحويل بنكي', amount: '-500,000 ر.ي', date: 'قبل يومين', type: 'out' },
                    ].map((tx, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors border border-transparent hover:border-gray-100 dark:bg-[#0f172a]">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'in' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                            {tx.type === 'in' ? <CreditCard className="w-5 h-5" /> : <ArrowUpFromLine className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm dark:text-white">{tx.title}</p>
                            <p className="text-xs text-gray-400 mt-1 dark:text-slate-300">{tx.store} • {tx.date}</p>
                          </div>
                        </div>
                        <span className={`font-black tracking-tight ${tx.type === 'in' ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeSection === 'withdrawals' && (
            <div className="max-w-[1400px] mx-auto space-y-6">

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">طلبات السحب</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">مراجعة ومعالجة طلبات تحويل الأرصدة للمتاجر</p>
                </div>
                <div className="flex gap-3">
                  <button className="h-10 px-5 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-sm dark:text-white dark:bg-[#0f172a] dark:border-slate-800">
                    <Download className="w-4 h-4" /> تصدير السجل
                  </button>
                </div>
              </div>

              {/* STATS OVERVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: 'إجمالي المبالغ قيد المراجعة', val: '450,000 ر.ي', icon: Clock, color: 'orange' },
                  { label: 'إجمالي المبالغ المحولة', val: '1,200,000 ر.ي', icon: CheckCircle2, color: 'green' },
                  { label: 'طلبات جديدة', val: '5 طلبات', icon: ArrowUpFromLine, color: 'blue' }
                ].map((s, i) => (
                  <div key={i} className="bg-white dark:bg-[#1A1A24] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-xl bg-${s.color}-50 dark:bg-${s.color}-900/10 flex items-center justify-center text-${s.color}-600 shrink-0`}>
                      <s.icon className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold mb-1 text-xs dark:text-slate-300">{s.label}</p>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{s.val}</h3>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-[#1A1A24] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-[11px] font-black text-gray-400 uppercase tracking-wider dark:text-slate-300">
                      <th className="py-4 px-6">رقم الطلب</th>
                      <th className="py-4 px-6">المتجر / المستخدم</th>
                      <th className="py-4 px-6">المبلغ</th>
                      <th className="py-4 px-6">طريقة الدفع</th>
                      <th className="py-4 px-6">الحالة</th>
                      <th className="py-4 px-6 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {withdrawalRequests.length > 0 ? withdrawalRequests.map((wd) => (
                      <tr key={wd.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors dark:bg-[#0f172a]">
                        <td className="py-4 px-6 font-mono font-bold text-gray-900 text-sm dark:text-white">{wd.id.slice(0, 8).toUpperCase()}</td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-900 text-sm dark:text-white">{wd.users?.name || 'غير معروف'}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-300">{new Date(wd.created_at).toLocaleDateString('ar-EG')}</p>
                        </td>
                        <td className="py-4 px-6 font-black text-purple-600">{Number(wd.amount).toLocaleString()} ر.ي</td>
                        <td className="py-4 px-6 text-sm text-gray-600 font-bold dark:text-slate-300">{wd.bank_name || 'حساب بنكي'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${wd.status === 'pending' ? 'bg-orange-50 text-orange-600' : wd.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {wd.status === 'pending' ? 'قيد المراجعة' : wd.status === 'approved' ? 'مكتمل' : 'مرفوض'}
                          </span>
                        </td>
                        <td className="py-4 px-6 flex items-center justify-center gap-2">
                          {wd.status === 'pending' && (
                            <>
                              <button onClick={() => handleApproveWithdrawal(wd.id, wd.user_id, wd.amount)} className="w-8 h-8 rounded-full border border-green-200 flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors" title="قبول وتحويل"><CheckCircle2 className="w-4 h-4" /></button>
                              <button onClick={() => handleRejectWithdrawal(wd.id, wd.user_id, wd.amount)} className="w-8 h-8 rounded-full border border-red-200 flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors" title="رفض"><XCircle className="w-4 h-4" /></button>
                            </>
                          )}
                          <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300" title="التفاصيل"><Eye className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400 text-sm font-bold dark:text-slate-300">لا توجد طلبات سحب حالياً</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'stores' && (
            <div className="max-w-[1400px] mx-auto space-y-6">

              {/* PAGE TITLE */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">إدارة المتاجر</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">مراقبة محتويات المتاجر والتحكم بحالاتها</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setIsAddStoreOpen(true)} className="h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20">
                    <Plus className="w-4 h-4" /> متجر جديد
                  </button>
                </div>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">إجمالي المتاجر</p>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{storesList.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Store className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">المتاجر النشطة</p>
                    <p className="text-3xl font-black text-green-600 dark:text-green-400">{activeStoresCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white dark:bg-[#1A1A24] border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">بانتظار الدفع أو موقوفة</p>
                    <p className="text-3xl font-black text-red-600 dark:text-red-400">{pendingStoresCount}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    placeholder="ابحث عن متجر بالاسم، المالك، رابط المتجر..."
                    className="w-full bg-white dark:bg-[#1A1A24] border border-gray-200 dark:border-white/10 rounded-xl h-12 pr-12 pl-4 text-sm font-bold focus:border-purple-600 dark:text-white outline-none transition-colors"
                  />
                </div>
              </div>

              {/* TABLE */}
              <div className="bg-white dark:bg-[#1A1A24] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-[11px] font-black text-gray-400 uppercase tracking-wider dark:text-slate-300">
                      <th className="py-4 px-6 rounded-tr-2xl">اسم المتجر</th>
                      <th className="py-4 px-6">الرابط</th>
                      <th className="py-4 px-6">المالك</th>
                      <th className="py-4 px-6">المسوق (الإحالة)</th>
                      <th className="py-4 px-6">التاريخ</th>
                      <th className="py-4 px-6">الحالة</th>
                      <th className="py-4 px-6 rounded-tl-2xl text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {filteredStores.length > 0 ? filteredStores.map((store) => {
                      return (
                        <tr key={store.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors dark:bg-[#0f172a]">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-sm shrink-0">
                                {store.store_name?.charAt(0) || 'م'}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 text-sm dark:text-white">{store.store_name || 'متجر'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <a href={`https://${store.slug}.suriix.com`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline font-bold" dir="ltr">{store.slug}.suriix.com</a>
                          </td>
                          <td className="py-4 px-6 text-sm">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 dark:text-white">{store.users?.name || 'غير معروف'}</span>
                              <span className="text-xs text-gray-500 lg:hidden">{store.users?.phone || ''}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm">
                            {store.marketer_name ? (
                              <span className="font-bold text-purple-700 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-300 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap border border-purple-100 dark:border-purple-800/30">
                                🎁 {store.marketer_name}
                              </span>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-600 text-xs font-bold">—</span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-500 font-medium dark:text-slate-300">
                            {new Date(store.created_at).toLocaleDateString('ar-EG')}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${store.is_active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {store.is_active ? 'نشط' : 'بانتظار الدفع'}
                            </span>
                          </td>
                          <td className="py-4 px-6 flex items-center justify-center gap-2">
                            <button onClick={() => { setSelectedStore(store); setIsStoreViewOpen(true); }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300" title="تفاصيل المتجر"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => { setSelectedStore(store); setIsStoreEditOpen(true); }} className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors dark:border-blue-900/40" title="تعديل بيانات المتجر"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteStore(store.id)} className="w-8 h-8 rounded-full border border-red-200 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors dark:border-red-900/40" title="حذف المتجر"><Trash2 className="w-4 h-4" /></button>
                            <button onClick={() => handleToggleStoreStatus(store.id, store.is_active)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-orange-500 hover:bg-orange-50 transition-colors dark:border-slate-800" title={store.is_active ? 'إيقاف المتجر' : 'تفعيل المتجر'}>
                              {store.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400 text-sm font-bold dark:text-slate-300">لا يوجد متاجر لعرضها</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'subscriptions' && (
            <div className="max-w-[1400px] mx-auto space-y-6">

              {/* PAGE HEADER */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">إدارة الاشتراكات والباقات</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">التحكم بأسعار وخصائص باقات أصحاب المتاجر</p>
                </div>

                <button className="h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20">
                  <Plus className="w-4 h-4" /> إضافة باقة جديدة
                </button>
              </div>

              {/* PLANS GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {subscriptionPlans.map(plan => (
                  <div key={plan.id} className="bg-white dark:bg-[#1A1A24] rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col relative overflow-hidden shadow-sm hover:shadow-lg transition-shadow">

                    {!plan.is_active && (
                      <div className="absolute top-4 left-4 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">غير نشطة</div>
                    )}

                    <div className="p-6 border-b border-gray-100 dark:border-white/5">
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                        <CreditCard className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                      <div className="flex items-end gap-1 mb-2">
                        <span className="text-3xl font-black text-purple-600">{Number(plan.price).toLocaleString()}</span>
                        <span className="text-gray-500 font-bold mb-1 dark:text-slate-300">ر.ي / شهرياً</span>
                      </div>
                      <p className="text-sm font-bold text-gray-500 bg-gray-50 w-max px-3 py-1 rounded-lg dark:bg-[#0f172a] dark:text-slate-300">الحد الأقصى للمنتجات: {plan.product_limit}</p>
                    </div>

                    <div className="p-6 flex-1 bg-gray-50/50 dark:bg-white/[0.02]">
                      <h4 className="text-sm font-black text-gray-900 dark:text-white mb-4">المميزات:</h4>
                      <ul className="space-y-3 mb-6">
                        {Array.isArray(plan.features) ? plan.features.map((feat: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 font-medium dark:text-slate-300">
                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                            <span>{feat}</span>
                          </li>
                        )) : null}
                      </ul>
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#1A1A24] flex gap-2">
                      <button onClick={() => { setSelectedPlan(plan); setIsPlanEditOpen(true); }} className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-colors border border-gray-200 dark:text-white dark:bg-[#0f172a] dark:border-slate-800">
                        تعديل الباقة
                      </button>
                      <button onClick={() => handleTogglePlanStatus(plan.id, plan.is_active)} className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-colors ${plan.is_active ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-green-200 text-green-500 hover:bg-green-50'}`} title={plan.is_active ? 'إيقاف الباقة' : 'تفعيل الباقة'}>
                        {plan.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    </div>

                  </div>
                ))}

                {subscriptionPlans.length === 0 && (
                  <div className="col-span-3 text-center py-20 text-gray-400 font-bold dark:text-slate-300">جاري تحميل الباقات...</div>
                )}
              </div>
            </div>
          )}

          {activeSection === 'overview' && (
            <div className="max-w-[1400px] mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">نظرة عامة على المنصة</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">أداء المبيعات، نمو المتاجر، والتنبيهات المباشرة</p>
                </div>
                <button className="h-10 px-5 bg-white dark:bg-[#1A1A24] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-sm rounded-xl hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                  <Download className="w-4 h-4" /> تحميل تقرير الأداء
                </button>
              </div>

              {/* STATS OVERVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { label: 'إجمالي المتاجر النشطة', val: storesList.filter(s => s.is_active).length, icon: Store, trend: '+0%', color: 'blue' },
                  { label: 'إيرادات المنصة', val: `${stats.totalAmount.toLocaleString()} ر.ي`, icon: CreditCard, trend: '+0%', color: 'green' },
                  { label: 'إجمالي المستخدمين', val: usersList.length, icon: Users, trend: '+0%', color: 'purple' },
                  { label: 'طلبات قيد المراجعة', val: stats.totalPending, icon: Clock, trend: '', color: 'orange', isNegative: true }
                ].map((s, i) => (
                  <div key={i} className="bg-white dark:bg-[#1A1A24] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-${s.color}-50 dark:bg-${s.color}-900/10 flex items-center justify-center text-${s.color}-600`}>
                        <s.icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <span className={`text-xs font-black px-2 py-1 rounded-md ${s.isNegative ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{s.trend}</span>
                    </div>
                    <div>
                      <p className="text-gray-500 font-bold mb-1 text-xs dark:text-slate-300">{s.label}</p>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{s.val}</h3>
                    </div>
                  </div>
                ))}
              </div>

              {/* CHARTS & NOTIFICATIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-[#1A1A24] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-lg text-gray-900 dark:text-white">أداء الاشتراكات الشهري</h3>
                    <select className="bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-lg px-3 py-1 text-xs font-bold text-gray-600 outline-none dark:text-slate-300">
                      <option>آخر 7 أيام</option>
                      <option>هذا الشهر</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end gap-2 px-2">
                    {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end group h-full">
                        <div className="w-full bg-purple-50 dark:bg-purple-900/10 rounded-t-xl overflow-hidden relative h-[85%] flex items-end">
                          <div className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-xl transition-all duration-500 group-hover:opacity-80" style={{ height: `${h}%` }}></div>

                          {/* Tooltip */}
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded pointer-events-none whitespace-nowrap">
                            {h * 1250} ر.ي
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 mt-3 font-bold uppercase tracking-wider dark:text-slate-300">يوم {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1A1A24] rounded-2xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
                  <h3 className="font-black text-lg text-gray-900 dark:text-white mb-6">أحدث التنبيهات وإشعارات النظام</h3>
                  <div className="space-y-5">

                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:bg-[#0f172a]">
                      <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                        <ArrowUpFromLine className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">طلب سحب جديد</p>
                        <p className="text-[11px] text-gray-500 mt-1 dark:text-slate-300">متجر الأناقة يطلب سحب 500$</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold dark:text-slate-300">منذ 5 د</span>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:bg-[#0f172a]">
                      <div className="w-9 h-9 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">اشتراك متجر جديد</p>
                        <p className="text-[11px] text-gray-500 mt-1 dark:text-slate-300">قام متجر عالم التقنية بالاشتراك بباقة الأعمال</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold dark:text-slate-300">منذ ساعة</span>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer border border-transparent hover:border-gray-100 dark:bg-[#0f172a]">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] font-bold text-gray-900 dark:text-white leading-tight">تأخر في معالجة الشحن</p>
                        <p className="text-[11px] text-gray-500 mt-1 dark:text-slate-300">يوجد 3 طلبات شحن متأخرة عن 24 ساعة</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold dark:text-slate-300">منذ 3 س</span>
                    </div>

                  </div>
                  <button className="w-full py-2.5 mt-4 text-[13px] font-bold text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/10 rounded-lg transition-colors">
                    عرض كل التنبيهات
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeSection === 'templates' && (
            <div className="max-w-[1400px] mx-auto space-y-6">

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">إدارة القوالب</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">إدارة قوالب المتاجر وإضافة تصاميم جديدة للعملاء</p>
                </div>
                <div className="flex gap-3">
                  <button className="h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20">
                    <Plus className="w-4 h-4" /> قالب جديد
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'قالب الأناقة', category: 'أزياء وموضة', type: 'مجاني', users: 142, active: true },
                  { name: 'القالب التقني', category: 'إلكترونيات', type: 'مدفوع (VIP)', users: 89, active: true },
                  { name: 'الحديث البسيط', category: 'عام', type: 'مجاني', users: 430, active: true },
                  { name: 'قالب المطاعم', category: 'مأكولات', type: 'مدفوع', users: 12, active: false }
                ].map((tpl, i) => (
                  <div key={i} className="bg-white dark:bg-[#1A1A24] rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                    <div className="h-40 bg-gray-100 dark:bg-white/5 relative overflow-hidden flex items-center justify-center">
                      <LayoutTemplate className="w-12 h-12 text-gray-300 dark:text-white/10 group-hover:scale-110 transition-transform" />
                      {!tpl.active && (
                        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-bold">غير متاح</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white">{tpl.name}</h3>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${tpl.type.includes('مدفوع') ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                          {tpl.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-bold mb-4 dark:text-slate-300">{tpl.category}</p>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-50 dark:border-white/5 pt-4">
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-slate-300">
                          <Users className="w-4 h-4" />
                          <span className="text-xs font-bold">{tpl.users} متجر يستخدمه</span>
                        </div>
                        <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors tooltip dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300" title="تعديل القالب"><Edit className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="max-w-[1400px] mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight mb-1">إدارة المستخدمين</h1>
                  <p className="text-gray-500 text-sm font-medium dark:text-slate-300">عرض جميع المسجلين في منصة سريكس</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1A1A24] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden min-h-[500px]">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-[11px] font-black text-gray-400 uppercase tracking-wider dark:text-slate-300">
                      <th className="py-4 px-6">الاسم</th>
                      <th className="py-4 px-6">البريد الإلكتروني</th>
                      <th className="py-4 px-6">الحالة</th>
                      <th className="py-4 px-6">تاريخ الانضمام</th>
                      <th className="py-4 px-6">الصلاحية</th>
                      <th className="py-4 px-6 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                    {usersList.length > 0 ? usersList.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors dark:bg-[#0f172a]">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                              {user.name ? user.name.charAt(0) : 'U'}
                            </div>
                            <p className="font-bold text-gray-900 text-sm dark:text-white">{user.name || 'مستخدم جديد'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 font-bold dark:text-slate-300" dir="ltr">{user.email}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {user.status === 'active' ? 'نشط' : 'بانتظار التفعيل'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 dark:text-slate-300">
                          {new Date(user.created_at).toLocaleDateString('ar-EG')}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600 dark:text-slate-300'}`}>
                            {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                          </span>
                        </td>
                        <td className="py-4 px-6 flex items-center justify-center gap-2">
                          <button onClick={() => { setSelectedUser(user); setIsUserViewOpen(true); }} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors" title="تفاصيل"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => { setSelectedUser(user); setIsUserEditOpen(true); }} className="w-8 h-8 rounded-full border border-blue-200 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors" title="تعديل"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleToggleUserStatus(user.id, user.status)} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${user.status === 'active' ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-green-200 text-green-500 hover:bg-green-50'}`} title={user.status === 'active' ? 'حظر المستخدم وتعليق المتجر' : 'تفعيل المستخدم والمتجر'}>
                            {user.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400 text-sm font-bold dark:text-slate-300">لا يوجد مستخدمين لعرضهم</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection !== 'recharge' && activeSection !== 'users' && activeSection !== 'subscriptions' && activeSection !== 'overview' && activeSection !== 'stores' && activeSection !== 'withdrawals' && activeSection !== 'admin_wallet' && activeSection !== 'marketing' && activeSection !== 'templates' && (
            <div className="flex flex-col items-center justify-center py-32 text-gray-400 dark:text-slate-300">
              <Hexagon className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-xl font-bold text-gray-800 dark:text-white">قيد الإنشاء</p>
              <p className="text-sm">هذا القسم قيد التطوير وسيتم استعادة تصميمه قريباً.</p>
            </div>
          )}

        </div>
      </main>

      {/* ALL MODALS */}

      {/* Stores Modals */}
      {isStoreViewOpen && selectedStore && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#1A1A24] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-right">
            <button onClick={() => setIsStoreViewOpen(false)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 dark:text-white"><XCircle className="w-6 h-6"/></button>
            <h2 className="text-xl font-black mb-4">تفاصيل المتجر</h2>
            <div className="space-y-3 font-medium text-sm text-gray-700 dark:text-gray-300">
              <p><strong>اسم المتجر:</strong> {selectedStore.store_name || 'غير معروف'}</p>
              <p><strong>رابط المتجر:</strong> <a href={`https://${selectedStore.slug}.suriix.com`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{selectedStore.slug}.suriix.com</a></p>
              <p><strong>المالك:</strong> {selectedStore.users?.name || 'غير معروف'} ({selectedStore.users?.email})</p>
              <p><strong>حالة المتجر:</strong> <span className={selectedStore.is_active ? 'text-green-500' : 'text-red-500'}>{selectedStore.is_active ? 'نشط' : 'بانتظار الدفع أو موقوف'}</span></p>
              <p><strong>الباقة:</strong> {selectedStore.tier || 'غير محدد'}</p>
              <p><strong>المسوق:</strong> {selectedStore.marketer_name || 'لا يوجد'}</p>
              <p><strong>تاريخ الإنشاء:</strong> <span dir="ltr">{new Date(selectedStore.created_at).toLocaleDateString('ar-EG')}</span></p>
            </div>
            <button onClick={() => setIsStoreViewOpen(false)} className="w-full mt-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 rounded-xl font-black transition-colors text-gray-700 dark:text-gray-300">إغلاق</button>
          </div>
        </div>
      )}

      {isStoreEditOpen && selectedStore && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1A24] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-right mt-12 mb-12">
            <button onClick={() => setIsStoreEditOpen(false)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 dark:text-white"><XCircle className="w-6 h-6"/></button>
            <h2 className="text-xl font-black mb-6">تعديل بيانات المتجر</h2>
            <form onSubmit={handleSaveStore} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">اسم المتجر</label>
                <input type="text" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-medium" value={selectedStore.store_name} onChange={e => setSelectedStore({...selectedStore, store_name: e.target.value})} required/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">رابط المتجر (slug)</label>
                <div className="flex bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden h-11">
                  <input type="text" className="flex-1 bg-transparent px-3 outline-none focus:bg-white dark:focus:bg-[#1A1A24] text-sm font-medium transition-colors" value={selectedStore.slug} onChange={e => setSelectedStore({...selectedStore, slug: e.target.value})} dir="ltr" required/>
                  <span className="flex items-center px-3 bg-gray-100 dark:bg-white/5 border-r border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500" dir="ltr">.suriix.com</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">الباقة</label>
                <select className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-medium" value={selectedStore.tier} onChange={e => setSelectedStore({...selectedStore, tier: e.target.value})}>
                  <option value="free">مجانية (تأسيس)</option>
                  <option value="basic">الأساسية</option>
                  <option value="pro">الاحترافية</option>
                  <option value="business">للأعمال</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="store-active" checked={selectedStore.is_active} onChange={e => setSelectedStore({...selectedStore, is_active: e.target.checked})} className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"/>
                <label htmlFor="store-active" className="text-sm font-bold text-gray-700 dark:text-slate-300">متجر نشط (تم الدفع)</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black transition-colors flex items-center justify-center gap-2">حفظ التغييرات</button>
                <button type="button" onClick={() => setIsStoreEditOpen(false)} className="flex-1 h-11 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white rounded-xl font-black transition-colors">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddStoreOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1A24] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-right mt-12 mb-12">
            <button onClick={() => { setIsAddStoreOpen(false); setSelectedStore(null); }} className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 dark:text-white"><XCircle className="w-6 h-6"/></button>
            <h2 className="text-xl font-black mb-6">إضافة متجر جديد</h2>
            <form onSubmit={handleAddStore} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">مالك المتجر (مستخدم موجود)</label>
                <select 
                  className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-medium" 
                  value={selectedStore?.user_id || ''} 
                  onChange={e => setSelectedStore({...selectedStore, user_id: e.target.value})}
                  required
                >
                  <option value="">اختر المستخدم...</option>
                  {usersList.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name || u.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">اسم المتجر</label>
                <input 
                  type="text" 
                  className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-medium" 
                  value={selectedStore?.store_name || ''} 
                  onChange={e => {
                    const val = e.target.value;
                    const autoSlug = val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                    setSelectedStore({...selectedStore, store_name: val, slug: selectedStore?.slug ? selectedStore.slug : autoSlug});
                  }} 
                  placeholder="مثال: متجر الأناقة"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">رابط المتجر (slug)</label>
                <div className="flex bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden h-11">
                  <input type="text" className="flex-1 bg-transparent px-3 outline-none focus:bg-white dark:focus:bg-[#1A1A24] text-sm font-medium transition-colors" value={selectedStore?.slug || ''} onChange={e => setSelectedStore({...selectedStore, slug: e.target.value})} dir="ltr" placeholder="my-store" required/>
                  <span className="flex items-center px-3 bg-gray-100 dark:bg-white/5 border-r border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500" dir="ltr">.suriix.com</span>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 h-11 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black transition-colors flex items-center justify-center gap-2">إنشاء المتجر</button>
                <button type="button" onClick={() => { setIsAddStoreOpen(false); setSelectedStore(null); }} className="flex-1 h-11 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white rounded-xl font-black transition-colors">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isUserViewOpen && selectedUser && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#1A1A24] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-right">
            <button onClick={() => setIsUserViewOpen(false)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 dark:text-white"><XCircle className="w-6 h-6"/></button>
            <h2 className="text-xl font-black mb-4">تفاصيل المستخدم</h2>
            <div className="space-y-3 font-medium text-sm text-gray-700 dark:text-gray-300">
              <p><strong>اسم المستخدم:</strong> {selectedUser.name || 'غير معروف'}</p>
              <p><strong>البريد الإلكتروني:</strong> {selectedUser.email}</p>
              <p><strong>الصلاحية (Role):</strong> {selectedUser.role === 'admin' ? 'مدير' : selectedUser.role === 'store_owner' ? 'صاحب متجر' : 'عميل'}</p>
              <p><strong>حالة الحساب:</strong> <span className={selectedUser.status === 'banned' ? 'text-red-500' : 'text-green-500'}>{selectedUser.status === 'active' ? 'نشط' : selectedUser.status === 'banned' ? 'محظور' : 'بانتظار التفعيل'}</span></p>
              <p><strong>تاريخ الانضمام:</strong> <span dir="ltr">{new Date(selectedUser.created_at).toLocaleDateString('ar-EG')}</span></p>
              <p><strong>رصيد المحفظة:</strong> {(selectedUser.wallet_yer || 0).toLocaleString()} ر.ي</p>
            </div>
            <button onClick={() => setIsUserViewOpen(false)} className="w-full mt-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 rounded-xl font-black transition-colors text-gray-700 dark:text-gray-300">إغلاق</button>
          </div>
        </div>
      )}

      {isUserEditOpen && selectedUser && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1A24] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-right mt-12 mb-12">
            <button onClick={() => setIsUserEditOpen(false)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 dark:text-white"><XCircle className="w-6 h-6"/></button>
            <h2 className="text-xl font-black mb-6">تعديل بيانات المستخدم</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">اسم المستخدم</label>
                <input type="text" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-medium" defaultValue={selectedUser.name} id="edit-user-name"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">البريد الإلكتروني</label>
                <input type="email" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm dir-ltr text-left font-medium" defaultValue={selectedUser.email} id="edit-user-email"/>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">الصلاحية (الرتبة)</label>
                <select className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-medium" defaultValue={selectedUser.role} id="edit-user-role">
                  <option value="user">مستخدم عادي</option>
                  <option value="store_owner">صاحب متجر</option>
                  <option value="admin">مدير نظام</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">رصيد المحفظة (ر.ي)</label>
                <input type="number" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-bold" defaultValue={selectedUser.wallet_yer || 0} id="edit-user-wallet"/>
              </div>
              {selectedUser.role === 'store_owner' && (() => {
                const userStore = storesList.find(s => s.user_id === selectedUser.id);
                return (
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">اسم المتجر</label>
                    <input
                      type="text"
                      className="w-full h-11 border border-indigo-200 dark:border-indigo-500/30 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-indigo-500 text-sm font-medium bg-indigo-50/30"
                      defaultValue={userStore?.store_name || ''}
                      id="edit-user-store-name"
                      placeholder="لا يوجد متجر مرتبط"
                    />
                    {!userStore && (
                      <p className="text-xs text-amber-500 mt-1 font-bold">⚠ لا يوجد متجر مرتبط بهذا المستخدم بعد</p>
                    )}
                  </div>
                );
              })()}
            </div>
            <button onClick={async () => {
              const name = (document.getElementById('edit-user-name') as HTMLInputElement).value;
              const email = (document.getElementById('edit-user-email') as HTMLInputElement).value;
              const role = (document.getElementById('edit-user-role') as HTMLSelectElement).value;
              const wallet_yer = parseInt((document.getElementById('edit-user-wallet') as HTMLInputElement).value) || 0;
              
              const { error } = await supabase.from('users').update({ name, email, role, wallet_yer }).eq('id', selectedUser.id);
              if (error) { toast.error('وقع خطأ أثناء تحديث المستخدم: ' + error.message); return; }

              // Update store name if the user is a store_owner
              const storeNameInput = document.getElementById('edit-user-store-name') as HTMLInputElement | null;
              if (storeNameInput && role === 'store_owner') {
                const store_name = storeNameInput.value.trim();
                if (store_name) {
                  const userStore = storesList.find(s => s.user_id === selectedUser.id);
                  if (userStore) {
                    const { error: storeError } = await supabase.from('stores').update({ store_name }).eq('id', userStore.id);
                    if (storeError) { toast.error('تم تحديث المستخدم لكن وقع خطأ في تحديث المتجر: ' + storeError.message); fetchUsers(); fetchStores(); setIsUserEditOpen(false); return; }
                  }
                }
              }

              toast.success('تم تحديث البيانات بنجاح!');
              fetchUsers();
              fetchStores();
              setIsUserEditOpen(false);
            }} className="w-full mt-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black transition-colors shadow-lg shadow-purple-600/20">حفظ التعديلات الشاملة</button>
          </div>
        </div>
      )}

      {isMarketerViewOpen && selectedMarketer && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-[#1A1A24] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-right">
            <button onClick={() => setIsMarketerViewOpen(false)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 dark:text-white"><XCircle className="w-6 h-6"/></button>
            <h2 className="text-xl font-black mb-4">تفاصيل المسوق بالكامل</h2>
            <div className="space-y-3 font-medium text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-100 dark:border-white/5">
              <p><strong>اسم المسوق كامل (عربي):</strong> {selectedMarketer.name_ar || '—'}</p>
              <p><strong>الاسم (إنجليزي):</strong> {selectedMarketer.name_en || '—'}</p>
              <p><strong>البريد الإلكتروني:</strong> <span dir="ltr">{selectedMarketer.email || '—'}</span></p>
              <p><strong>رقم الجوال:</strong> <span dir="ltr">{selectedMarketer.phone || '—'}</span></p>
              <p><strong>كود الإحالة:</strong> <span className="font-mono bg-purple-100 text-purple-700 px-2 rounded">{selectedMarketer.referral_code}</span></p>
              <p><strong>الرصيد المتاح للسحب:</strong> <span className="text-green-600 font-bold">{(selectedMarketer.available_balance || 0).toLocaleString()} ر.ي</span></p>
              <p><strong>إجمالي الأرباح التاريخية:</strong> <span className="text-purple-600 font-bold">{(selectedMarketer.total_profits || 0).toLocaleString()} ر.ي</span></p>
            </div>
            <button onClick={() => setIsMarketerViewOpen(false)} className="w-full mt-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 rounded-xl font-black transition-colors text-gray-700 dark:text-gray-300">إغلاق وتخطي</button>
          </div>
        </div>
      )}

      {isMarketerEditOpen && selectedMarketer && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1A24] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-right mt-12 mb-12">
            <button onClick={() => setIsMarketerEditOpen(false)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 dark:text-white"><XCircle className="w-6 h-6"/></button>
            <h2 className="text-xl font-black mb-6">تعديل بيانات المسوق الشاملة</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">الاسم (عربي)</label>
                  <input type="text" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-medium" defaultValue={selectedMarketer.name_ar} id="edit-marketer-name-ar"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">الاسم (إنجليزي)</label>
                  <input type="text" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-medium" defaultValue={selectedMarketer.name_en} id="edit-marketer-name-en"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">البريد الإلكتروني</label>
                <input type="email" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm dir-ltr text-left font-medium" defaultValue={selectedMarketer.email} id="edit-marketer-email"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">رقم الجوال</label>
                  <input type="text" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm dir-ltr text-left font-medium" defaultValue={selectedMarketer.phone} id="edit-marketer-phone"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">كود الإحالة</label>
                  <input type="text" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-mono text-purple-600 font-bold" defaultValue={selectedMarketer.referral_code} id="edit-marketer-code"/>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">الرصيد المتاح (ر.ي)</label>
                  <input type="number" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-bold text-green-600" defaultValue={selectedMarketer.available_balance || 0} id="edit-marketer-available"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">إجمالي الأرباح (ر.ي)</label>
                  <input type="number" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-bold text-purple-600" defaultValue={selectedMarketer.total_profits || 0} id="edit-marketer-total"/>
                </div>
              </div>
            </div>
            <button onClick={async () => {
              const name_ar = (document.getElementById('edit-marketer-name-ar') as HTMLInputElement).value;
              const name_en = (document.getElementById('edit-marketer-name-en') as HTMLInputElement).value;
              const email = (document.getElementById('edit-marketer-email') as HTMLInputElement).value;
              const phone = (document.getElementById('edit-marketer-phone') as HTMLInputElement).value;
              const referral_code = (document.getElementById('edit-marketer-code') as HTMLInputElement).value;
              const available_balance = parseInt((document.getElementById('edit-marketer-available') as HTMLInputElement).value) || 0;
              const total_profits = parseInt((document.getElementById('edit-marketer-total') as HTMLInputElement).value) || 0;
              
              const { error } = await supabase.from('marketers').update({ 
                name_ar, name_en, email, phone, referral_code, available_balance, total_profits 
              }).eq('id', selectedMarketer.id);
              
              if (error) toast.error('وقع خطأ أثناء التحديث: ' + error.message);
              else { toast.success('تم تحديث بيانات المسوق بنجاح!'); fetchMarketers(); setIsMarketerEditOpen(false); }
            }} className="w-full mt-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black transition-colors shadow-lg shadow-purple-600/20">حفظ جميع البيانات</button>
          </div>
        </div>
      )}

      {isPlanEditOpen && selectedPlan && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1A1A24] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative text-right mt-12 mb-12">
            <button onClick={() => setIsPlanEditOpen(false)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-900 dark:text-white"><XCircle className="w-6 h-6"/></button>
            <h2 className="text-xl font-black mb-6">تعديل باقة ({selectedPlan.name})</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">اسم الباقة الإعلاني</label>
                <input type="text" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-medium" defaultValue={selectedPlan.name} id="edit-plan-name"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">السعر الشهري (ر.ي)</label>
                  <input type="number" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-bold" defaultValue={selectedPlan.monthly_price} id="edit-plan-monthly"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1 dark:text-slate-300">السعر السنوي (ر.ي)</label>
                  <input type="number" className="w-full h-11 border border-gray-200 dark:border-white/10 dark:bg-black/20 rounded-lg px-3 outline-none focus:border-purple-500 text-sm font-bold" defaultValue={selectedPlan.yearly_price} id="edit-plan-yearly"/>
                </div>
              </div>
            </div>
            <button onClick={async () => {
              const name = (document.getElementById('edit-plan-name') as HTMLInputElement).value;
              const monthly = parseInt((document.getElementById('edit-plan-monthly') as HTMLInputElement).value) || 0;
              const yearly = parseInt((document.getElementById('edit-plan-yearly') as HTMLInputElement).value) || 0;
              const { error } = await supabase.from('subscription_plans').update({ name, monthly_price: monthly, yearly_price: yearly }).eq('id', selectedPlan.id);
              if (error) toast.error('وقع خطأ أثناء التحديث: ' + error.message);
              else { toast.success('تم تحديث الباقة بنجاح!'); fetchSubscriptionPlans(); setIsPlanEditOpen(false); }
            }} className="w-full mt-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-black transition-colors shadow-lg shadow-purple-600/20">حفظ تحديث الباقة</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
