import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home, Link as LinkIcon, BarChart2, Users, Wallet,
  Upload, Settings, LogOut, Copy, Bell, TrendingUp, HandCoins, User, X,
  CheckCircle, Clock, XCircle, AlertCircle, Send, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { useNotifications } from "@/hooks/useNotifications";

type Tab = "home" | "referral" | "stats" | "referrals" | "wallet" | "withdrawals" | "settings";

const MarketerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [marketer, setMarketer] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Withdrawal form
  const [wAmount, setWAmount] = useState("");
  const [wBank, setWBank] = useState("");
  const [wAccount, setWAccount] = useState("");
  const [wHolder, setWHolder] = useState("");
  const [wSubmitting, setWSubmitting] = useState(false);

  // Settings form
  const [sNameAr, setSNameAr] = useState("");
  const [sNameEn, setSNameEn] = useState("");
  const [sPhone, setSPhone] = useState("");
  const [sSaving, setSSaving] = useState(false);

  const { notifications, unread, markAsRead, markAllAsRead } = useNotifications(userId, 'marketer');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/marketer/login"); return; }
      setUserId(session.user.id);

      const { data: m } = await supabase
        .from("marketers").select("*").eq("id", session.user.id).maybeSingle();
      if (m) {
        setMarketer(m);
        setSNameAr(m.name_ar || "");
        setSNameEn(m.name_en || "");
        setSPhone(m.phone || "");
      }

      const { data: refs } = await supabase
        .from("marketer_referrals").select("*")
        .eq("marketer_id", session.user.id)
        .order("created_at", { ascending: false });
      setReferrals(refs || []);

      const { data: wds } = await supabase
        .from("marketer_withdrawals").select("*")
        .eq("marketer_id", session.user.id)
        .order("created_at", { ascending: false });
      setWithdrawals(wds || []);

      setIsLoading(false);
    };
    load();
  }, []);

  const handleCopy = () => {
    const nameEn = marketer?.name_en?.replace(/\s+/g, '-').toLowerCase() || "marketer";
    const code = marketer?.referral_code || "XXXX";
    const link = `https://suriix.store/ref/${nameEn}-${code}`;
    navigator.clipboard.writeText(link);
    toast.success("تم نسخ رابط الإحالة بنجاح");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/marketer/login");
  };

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketer || !userId) return;
    const amt = parseFloat(wAmount);
    if (isNaN(amt) || amt <= 0) { toast.error("أدخل مبلغاً صحيحاً"); return; }
    if (amt > (marketer.available_balance || 0)) {
      toast.error("المبلغ يتجاوز رصيدك المتاح"); return;
    }
    setWSubmitting(true);
    const { error } = await supabase.from("marketer_withdrawals").insert([{
      marketer_id: userId,
      amount: amt,
      bank_name: wBank,
      account_number: wAccount,
      account_holder: wHolder,
    }]);
    setWSubmitting(false);
    if (error) { toast.error("فشل إرسال الطلب: " + error.message); return; }
    toast.success("تم إرسال طلب السحب بنجاح! سيتم مراجعته خلال 24 ساعة");
    setWAmount(""); setWBank(""); setWAccount(""); setWHolder("");
    const { data: wds } = await supabase.from("marketer_withdrawals").select("*")
      .eq("marketer_id", userId).order("created_at", { ascending: false });
    setWithdrawals(wds || []);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSSaving(true);
    const { error } = await supabase.from("marketers").update({
      name_ar: sNameAr, name_en: sNameEn, phone: sPhone, updated_at: new Date().toISOString()
    }).eq("id", userId);
    setSSaving(false);
    if (error) { toast.error("فشل الحفظ: " + error.message); return; }
    setMarketer((prev: any) => ({ ...prev, name_ar: sNameAr, name_en: sNameEn, phone: sPhone }));
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  const displayName = marketer?.name_ar || marketer?.name_en || "مسوق";
  const nameEn = marketer?.name_en?.replace(/\s+/g, '-').toLowerCase() || "marketer";
  const referralLink = `https://suriix.store/ref/${nameEn}-${marketer?.referral_code || "..."}`;

  const navItems: { key: Tab; label: string; icon: any }[] = [
    { key: "home", label: "الرئيسية", icon: Home },
    { key: "referral", label: "رابط الإحالة", icon: LinkIcon },
    { key: "stats", label: "الإحصائيات", icon: BarChart2 },
    { key: "referrals", label: "الإحالات", icon: Users },
    { key: "wallet", label: "المحفظة", icon: Wallet },
    { key: "withdrawals", label: "طلبات السحب", icon: Upload },
    { key: "settings", label: "الإعدادات", icon: Settings },
  ];

  const statusBadge = (st: string) => {
    if (st === "approved") return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" />مكتمل</span>;
    if (st === "rejected") return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" />مرفوض</span>;
    return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-500 flex items-center gap-1"><Clock className="w-3 h-3" />قيد المراجعة</span>;
  };

  const handleNotificationClick = (n: any) => {
    markAsRead(n.id);
    setShowNotifications(false);
    if (n.type === 'referral' || n.type === 'commission' || n.title?.includes('إحالة') || n.title?.includes('عمولة')) setActiveTab('referrals');
    else if (n.type === 'withdrawal' || n.type === 'wallet' || n.title?.includes('سحب')) setActiveTab('withdrawals');
    else setActiveTab('home');
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
      <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f9fc] dark:bg-[#0a0a0f] font-cairo" dir="rtl">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:static top-0 right-0 h-full w-[280px] bg-white dark:bg-[#0f0f13] border-l border-gray-100 dark:border-white/5 flex flex-col flex-shrink-0 z-50 lg:z-auto transition-transform duration-300 shadow-2xl lg:shadow-none`}>
        <div className="p-6 pb-2 text-center border-b border-gray-50">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <HandCoins className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Suriix</h1>
          </div>
          <p className="text-xs text-gray-400 font-bold dark:text-slate-300">لوحة المسوقين</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto">
          {navItems.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-colors text-right ${activeTab === key ? 'bg-purple-50 text-purple-700' : 'text-gray-600 hover:bg-gray-50 dark:bg-[#0f172a] dark:text-slate-300'}`}
            >
              <Icon className={`w-5 h-5 ${activeTab === key ? 'text-purple-600' : 'text-gray-400 dark:text-slate-300'}`} />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 py-3 rounded-xl font-bold transition-colors dark:text-slate-300">
            <LogOut className="w-5 h-5" />تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 min-h-16 flex justify-between items-center dark:bg-[#0f172a]/90">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 dark:bg-[#1a1a24] dark:border dark:border-white/10 dark:text-slate-300 shrink-0">
              <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{navItems.find(n => n.key === activeTab)?.label}</h2>
              <p className="text-xs text-gray-400 font-medium hidden sm:block dark:text-slate-300">👋 مرحباً، {displayName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)}
                className="relative w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:text-purple-600 transition-colors dark:bg-[#0f172a] dark:text-slate-300">
                <Bell className="w-5 h-5" />
                {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{unread}</span>}
              </button>
              {showNotifications && (
                <div className="absolute top-14 left-0 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden dark:bg-[#0f172a]" style={{ right: 0, left: 'auto' }}>
                  <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 dark:text-white">الإشعارات</h3>
                      {unread > 0 && <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-0.5 rounded-full">{unread} جديد</span>}
                    </div>
                    <div className="flex gap-2">
                      {unread > 0 && <button onClick={markAllAsRead} className="text-xs text-purple-600 font-bold hover:underline">تحديد الكل</button>}
                      <button onClick={() => setShowNotifications(false)} className="text-gray-400 dark:text-slate-300"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length > 0 ? notifications.map((n: any) => (
                      <div key={n.id} onClick={() => handleNotificationClick(n)}
                        className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${!n.is_read ? 'bg-purple-50/60' : ''}`}>
                        <div className="flex gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.is_read ? 'bg-purple-500' : 'bg-gray-200'}`} />
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{n.title}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-300">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="py-10 text-center text-sm text-gray-400 font-bold dark:text-slate-300">لا توجد إشعارات</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 dark:bg-[#0f172a]">
              <span className="font-bold text-gray-800 text-sm hidden sm:block dark:text-white">{displayName}</span>
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-black">
                {displayName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-8">

          {/* ===== HOME TAB ===== */}
          {activeTab === "home" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "إجمالي الأرباح", value: `$${(marketer?.total_profits || 0).toFixed(2)}`, icon: TrendingUp, color: "purple" },
                  { label: "عدد الإحالات", value: referrals.length, icon: Users, color: "blue" },
                  { label: "الرصيد المتاح", value: `$${(marketer?.available_balance || 0).toFixed(2)}`, icon: HandCoins, color: "emerald" },
                  { label: "إجمالي السحوبات", value: `$${(marketer?.total_withdrawals || 0).toFixed(2)}`, icon: Upload, color: "fuchsia" },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-[#0f172a]">
                    <div className={`w-10 h-10 rounded-xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center mb-3`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-gray-400 font-bold mb-1 dark:text-slate-300">{s.label}</p>
                    <p className={`text-2xl font-black text-${s.color}-600`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent referrals */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-[#0f172a]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">أحدث الإحالات</h3>
                  <button onClick={() => setActiveTab("referrals")} className="text-sm font-bold text-purple-600 hover:underline">عرض الكل</button>
                </div>
                {referrals.length === 0 ? (
                  <div className="py-12 text-center">
                    <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold dark:text-slate-300">لا توجد إحالات بعد</p>
                    <p className="text-sm text-gray-400 mt-1 dark:text-slate-300">شارك رابطك لتبدأ بجني الأرباح</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                      <thead><tr className="text-gray-400 border-b border-gray-50 text-xs uppercase dark:text-slate-300">
                        <th className="py-3 font-semibold">العميل</th>
                        <th className="py-3 font-semibold text-center">الباقة</th>
                        <th className="py-3 font-semibold text-center">الحالة</th>
                        <th className="py-3 font-semibold text-left">العمولة</th>
                      </tr></thead>
                      <tbody className="divide-y divide-gray-50">
                        {referrals.slice(0, 5).map((r: any) => (
                          <tr key={r.id} className="hover:bg-gray-50/50 dark:bg-[#0f172a]">
                            <td className="py-3 font-bold text-gray-900 dark:text-white">{r.client_name}</td>
                            <td className="py-3 text-center text-gray-600 dark:text-slate-300">{r.package_name}</td>
                            <td className="py-3 text-center">{statusBadge(r.status)}</td>
                            <td className="py-3 text-left font-black text-emerald-600 font-mono">${(r.commission || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== REFERRAL LINK TAB ===== */}
          {activeTab === "referral" && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 dark:bg-[#0f172a]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
                    <LinkIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">رابط الإحالة الخاص بك</h3>
                    <p className="text-sm text-gray-400 dark:text-slate-300">شارك هذا الرابط لكسب عمولة من كل اشتراك</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-400 font-bold mb-2 dark:text-slate-300">رمز الإحالة</p>
                  <span className="font-mono bg-purple-50 text-purple-700 px-4 py-2 rounded-xl text-base font-black">{marketer?.referral_code || '...'}</span>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-400 font-bold mb-2 dark:text-slate-300">اسم المسوق (إنجليزي)</p>
                  <span className="font-mono bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold dark:text-white dark:bg-[#0f172a]">{marketer?.name_en || '...'}</span>
                </div>

                <div className="mb-6">
                  <p className="text-xs text-gray-400 font-bold mb-2 dark:text-slate-300">رابط الإحالة الكامل</p>
                  <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden dark:bg-[#0f172a] dark:border-slate-800">
                    <input type="text" value={referralLink} readOnly
                      className="flex-1 bg-transparent px-4 py-3 text-sm text-gray-600 font-mono outline-none dark:text-slate-300" dir="ltr" />
                    <button onClick={handleCopy}
                      className="bg-purple-600 text-white px-5 flex items-center gap-2 hover:bg-purple-700 transition shrink-0">
                      <Copy className="w-4 h-4" />
                      <span className="font-bold text-sm">نسخ</span>
                    </button>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-sm font-bold text-purple-700 text-center">🎁 شارك رابطك واحصل على عمولة من كل اشتراك!</p>
                </div>
              </div>

              {/* Share buttons */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-[#0f172a]">
                <h4 className="font-bold text-gray-900 mb-4 dark:text-white">مشاركة سريعة</h4>
                <div className="flex flex-wrap gap-3">
                  <a href={`https://wa.me/?text=${encodeURIComponent('انضم إلى Suriix عبر رابطي: ' + referralLink)}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition">
                    واتساب
                  </a>
                  <a href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition">
                    تيليغرام
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('انضم إلى Suriix: ' + referralLink)}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-800 transition">
                    X (تويتر)
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ===== STATS TAB ===== */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "إجمالي الأرباح", value: `$${(marketer?.total_profits || 0).toFixed(2)}`, color: "purple" },
                  { label: "الأرباح المعلقة", value: `$${(marketer?.pending_profits || 0).toFixed(2)}`, color: "orange" },
                  { label: "الرصيد المتاح", value: `$${(marketer?.available_balance || 0).toFixed(2)}`, color: "emerald" },
                  { label: "عدد الإحالات", value: referrals.length, color: "blue" },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 dark:bg-[#0f172a]">
                    <p className="text-xs text-gray-400 font-bold mb-2 dark:text-slate-300">{s.label}</p>
                    <p className={`text-2xl font-black text-${s.color}-600`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-[#0f172a]">
                <h3 className="font-extrabold text-gray-900 mb-6 dark:text-white">توزيع حالة الإحالات</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  {[
                    { label: "مدفوعة", count: referrals.filter(r => r.status === "approved").length, color: "emerald" },
                    { label: "قيد المراجعة", count: referrals.filter(r => r.status === "pending").length, color: "orange" },
                    { label: "مرفوضة", count: referrals.filter(r => r.status === "rejected").length, color: "red" },
                  ].map((s, i) => (
                    <div key={i} className={`flex-1 bg-${s.color}-50 rounded-xl p-4 text-center`}>
                      <p className={`text-3xl font-black text-${s.color}-600 mb-1`}>{s.count}</p>
                      <p className={`text-sm font-bold text-${s.color}-600`}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== REFERRALS TAB ===== */}
          {activeTab === "referrals" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-[#0f172a]">
              <h3 className="text-lg font-extrabold text-gray-900 mb-6 dark:text-white">جميع الإحالات ({referrals.length})</h3>
              {referrals.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-bold text-lg dark:text-slate-300">لا توجد إحالات بعد</p>
                  <p className="text-sm text-gray-400 mt-2 dark:text-slate-300">شارك رابط الإحالة لتبدأ</p>
                  <button onClick={() => setActiveTab("referral")}
                    className="mt-4 bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition">
                    رابط الإحالة
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-right">
                    <thead><tr className="text-gray-400 border-b border-gray-50 text-xs uppercase dark:text-slate-300">
                      <th className="py-3 font-semibold">العميل</th>
                      <th className="py-3 font-semibold text-center">الباقة</th>
                      <th className="py-3 font-semibold text-center">الحالة</th>
                      <th className="py-3 font-semibold text-center">التاريخ</th>
                      <th className="py-3 font-semibold text-left">العمولة</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {referrals.map((r: any) => (
                        <tr key={r.id} className="hover:bg-gray-50/50 dark:bg-[#0f172a]">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                                <User className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="font-bold text-gray-900 dark:text-white">{r.client_name}</span>
                            </div>
                          </td>
                          <td className="py-3 text-center text-gray-600 dark:text-slate-300">{r.package_name}</td>
                          <td className="py-3 text-center">{statusBadge(r.status)}</td>
                          <td className="py-3 text-center text-gray-400 text-xs dark:text-slate-300">
                            {new Date(r.created_at).toLocaleDateString('ar-SA')}
                          </td>
                          <td className="py-3 text-left font-black text-emerald-600 font-mono">${(r.commission || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ===== WALLET TAB ===== */}
          {activeTab === "wallet" && (
            <div className="max-w-xl space-y-6">
              <div className="bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg">
                <p className="text-sm font-bold opacity-80 mb-1">الرصيد المتاح للسحب</p>
                <p className="text-4xl font-black mb-4">${(marketer?.available_balance || 0).toFixed(2)}</p>
                <button onClick={() => setActiveTab("withdrawals")}
                  className="bg-white text-purple-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-50 transition dark:bg-[#0f172a]">
                  طلب سحب
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 dark:bg-[#0f172a]">
                {[
                  { label: "إجمالي الأرباح المكتسبة", value: `$${(marketer?.total_profits || 0).toFixed(2)}`, color: "text-gray-900 dark:text-white" },
                  { label: "الأرباح المعلقة", value: `$${(marketer?.pending_profits || 0).toFixed(2)}`, color: "text-orange-500" },
                  { label: "إجمالي ما تم سحبه", value: `-$${(marketer?.total_withdrawals || 0).toFixed(2)}`, color: "text-red-500" },
                  { label: "الرصيد المتاح", value: `$${(marketer?.available_balance || 0).toFixed(2)}`, color: "text-emerald-600" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-50 border-dashed last:border-0">
                    <span className="text-gray-500 font-medium text-sm dark:text-slate-300">{row.label}</span>
                    <span className={`font-black font-mono ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Latest withdrawals */}
              {withdrawals.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-[#0f172a]">
                  <h4 className="font-bold text-gray-900 mb-4 dark:text-white">آخر طلبات السحب</h4>
                  <div className="space-y-3">
                    {withdrawals.slice(0, 3).map((w: any) => (
                      <div key={w.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">${(w.amount).toFixed(2)}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-300">{new Date(w.created_at).toLocaleDateString('ar-SA')}</p>
                        </div>
                        {statusBadge(w.status)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== WITHDRAWALS TAB ===== */}
          {activeTab === "withdrawals" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-[#0f172a]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Send className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 dark:text-white">طلب سحب جديد</h3>
                    <p className="text-xs text-gray-400 dark:text-slate-300">الرصيد المتاح: <span className="font-bold text-emerald-600">${(marketer?.available_balance || 0).toFixed(2)}</span></p>
                  </div>
                </div>

                <form onSubmit={handleWithdrawal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 dark:text-white">المبلغ المطلوب ($)</label>
                    <input type="number" min="1" step="0.01" value={wAmount} onChange={e => setWAmount(e.target.value)} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1a1a24] outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-slate-800"
                      placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 dark:text-white">اسم البنك</label>
                    <input type="text" value={wBank} onChange={e => setWBank(e.target.value)} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1a1a24] outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-slate-800"
                      placeholder="مثال: البنك الأهلي" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 dark:text-white">رقم الحساب / IBAN</label>
                    <input type="text" value={wAccount} onChange={e => setWAccount(e.target.value)} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1a1a24] outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-slate-800"
                      placeholder="أدخل رقم الحساب" dir="ltr" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 dark:text-white">اسم صاحب الحساب</label>
                    <input type="text" value={wHolder} onChange={e => setWHolder(e.target.value)} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1a1a24] outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-slate-800"
                      placeholder="الاسم كما هو في البنك" />
                  </div>

                  <div className="bg-amber-50 rounded-xl p-3 flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 font-medium">سيتم مراجعة طلبك خلال 24-48 ساعة عمل</p>
                  </div>

                  <button type="submit" disabled={wSubmitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60">
                    {wSubmitting ? "جاري الإرسال..." : "إرسال طلب السحب"}
                  </button>
                </form>
              </div>

              {/* History */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-[#0f172a]">
                <h3 className="font-extrabold text-gray-900 mb-6 dark:text-white">سجل الطلبات ({withdrawals.length})</h3>
                {withdrawals.length === 0 ? (
                  <div className="py-16 text-center">
                    <Upload className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 font-bold dark:text-slate-300">لا توجد طلبات سابقة</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {withdrawals.map((w: any) => (
                      <div key={w.id} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-black text-gray-900 text-lg font-mono dark:text-white">${(w.amount).toFixed(2)}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-300">{w.bank_name} · {w.account_number}</p>
                          </div>
                          {statusBadge(w.status)}
                        </div>
                        <p className="text-xs text-gray-400 dark:text-slate-300">{new Date(w.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        {w.notes && <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg dark:bg-[#0f172a] dark:text-slate-300">ملاحظة: {w.notes}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== SETTINGS TAB ===== */}
          {activeTab === "settings" && (
            <div className="max-w-xl">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 dark:bg-[#0f172a]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white">إعدادات الحساب</h3>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 dark:text-white">الاسم بالعربي</label>
                    <input type="text" value={sNameAr} onChange={e => setSNameAr(e.target.value)} required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1a1a24] outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-slate-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 dark:text-white">الاسم بالإنجليزي (يُستخدم في رابط الإحالة)</label>
                    <input type="text" value={sNameEn} onChange={e => setSNameEn(e.target.value)} required dir="ltr"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1a1a24] outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-slate-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 dark:text-white">رقم الهاتف</label>
                    <input type="tel" value={sPhone} onChange={e => setSPhone(e.target.value)} dir="ltr"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 dark:text-white bg-white dark:bg-[#1a1a24] outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-slate-800" />
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-gray-400 mb-1 dark:text-slate-300">البريد الإلكتروني (لا يمكن تغييره)</p>
                    <p className="text-sm font-bold text-gray-600 bg-gray-50 px-4 py-3 rounded-xl dark:bg-[#0f172a] dark:text-slate-300" dir="ltr">{marketer?.email || '...'}</p>
                  </div>

                  <div className="pt-2">
                    <p className="text-xs text-gray-400 mb-1 dark:text-slate-300">رمز الإحالة</p>
                    <p className="text-sm font-mono font-black text-purple-700 bg-purple-50 px-4 py-3 rounded-xl">{marketer?.referral_code || '...'}</p>
                  </div>

                  <button type="submit" disabled={sSaving}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-60">
                    {sSaving ? "جاري الحفظ..." : "حفظ التغييرات"}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default MarketerDashboard;
