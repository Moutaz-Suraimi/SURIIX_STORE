import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Store,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  Paintbrush,
  Check,
  CheckCircle,
  MessageSquare,
  Mail,
  Instagram,
  Lock,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Wand2,
  Rocket,
  Facebook,
  Zap
} from "lucide-react";

const TEMPLATE_CARDS = [
  { id: "perfume", name: "قالب العطور الفاخر", category: "عطور ومستحضرات", desc: "تصميم كلاسيكي يركز على جاذبية زجاجة العطر وتجارب العملاء." },
  { id: "fashion", name: "قالب الأزياء الراقي", category: "أزياء وملابس", desc: "تصميم حد أدنى (Minimalist) يبرز تفاصيل الأقمشة والموديلات." },
];

export const checkPasswordStrength = (password: string) => {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength = 0;
  if (hasMinLength) strength += 1;
  if (hasUpperCase) strength += 1;
  if (hasLowerCase) strength += 1;
  if (hasNumber) strength += 1;
  if (hasSpecialChar) strength += 1;
  let label = "ضعيفة جداً (Very Weak)";
  if (strength >= 2) label = "ضعيفة (Weak)";
  if (strength >= 3) label = "متوسطة (Medium)";
  if (strength >= 4) label = "قوية (Strong)";
  if (strength === 5) label = "قوية جداً (Very Strong)";

  return {
    valid: strength === 5,
    label,
    checks: { hasMinLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar }
  };
};

const transliterateArabic = (text: string) => {
  const arToEnMap: Record<string, string> = {
    'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h',
    'خ': 'kh', 'د': 'd', 'ذ': 'th', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd',
    'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
    'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'h', 'ؤ': 'o', 'ئ': 'e',
    ' ': '-', '_': '-'
  };
  return text.split('').map(char => arToEnMap[char] || char).join('').replace(/[^a-zA-Z0-9-]/g, '').replace(/-+/g, '-').toLowerCase();
};

const CreateStore = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRtl = lang === "ar";
  const initialMode = searchParams.get("mode") === "login" ? "login" : "register";

  const [step, setStep] = useState<number>(1);

  // Referral (from /ref/:code redirect)
  const [referralMarketerName, setReferralMarketerName] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  React.useEffect(() => {
    const storedName = localStorage.getItem("suriix_referral_marketer_name");
    const storedCode = localStorage.getItem("suriix_referral_code");
    if (storedName) setReferralMarketerName(storedName);
    if (storedCode) setReferralCode(storedCode);
  }, []);

  // Auth (Step 1)
  const [authMode, setAuthMode] = useState<"register" | "login">(initialMode);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Store Info (Step 2)
  const [storeName, setStoreName] = useState("");
  const [storeLink, setStoreLink] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoName, setLogoName] = useState("");

  // Contact (Step 3)
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [instagram, setInstagram] = useState("");
  const [instagramEnabled, setInstagramEnabled] = useState(false);
  const [facebook, setFacebook] = useState("");
  const [facebookEnabled, setFacebookEnabled] = useState(false);
  const [tiktok, setTiktok] = useState("");
  const [tiktokEnabled, setTiktokEnabled] = useState(false);
  const [autoMessageEnabled, setAutoMessageEnabled] = useState(false);
  const [phoneCode, setPhoneCode] = useState("+967");
  const [whatsapp, setWhatsapp] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [autoMessage, setAutoMessage] = useState("مرحباً، أريد الاستفسار عن المنتجات المتوفرة");

  const [themeStyle, setThemeStyle] = useState("Dark");
  const [cardStyle, setCardStyle] = useState("Glassmorphism");
  const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(
    typeof window !== 'undefined' &&
    (window.location.hash.includes('access_token') || window.location.hash.includes('error') || !!localStorage.getItem('suriix_oauth_intent'))
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('suriix_added_stores');
    localStorage.removeItem('suriix_user_auth');
    localStorage.removeItem('suriix_user_role');
    setLoggedInEmail(null);
    setAuthEmail('');
    setAuthPassword('');
    setStep(1);
  };

  React.useEffect(() => {
    const handleSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        setAuthEmail(user.email || '');
        setMerchantName(user.user_metadata?.full_name || user.user_metadata?.name || '');
        const intent = localStorage.getItem('suriix_oauth_intent');
        localStorage.removeItem('suriix_oauth_intent');
        const isOAuthCallback = !!intent || window.location.hash.includes('access_token');
        const { data: userProfile } = await supabase.from('users').select('id, status, role').eq('id', user.id).maybeSingle();
        const { data: storeData } = await supabase.from('stores').select('id').eq('owner_id', user.id).maybeSingle();
        if (storeData) {
          if (storeData.id) {
            const { data: fullStore } = await supabase.from('stores').select('*').eq('id', storeData.id).single();
            if (fullStore) {
              const { data: products } = await supabase.from('products').select('*').eq('store_id', fullStore.id);
              const list = [{
                id: fullStore.id, owner_id: user.id, name: fullStore.store_name,
                slug: fullStore.store_url, url: fullStore.store_url,
                status: fullStore.is_active ? 'active' : 'pending', tier: 'Basic',
                products: products || [], theme: fullStore.theme_color, cardStyle: fullStore.template_id
              }];
              localStorage.setItem('suriix_added_stores', JSON.stringify(list));
              localStorage.setItem('suriix_user_auth', 'true');
              localStorage.setItem('suriix_user_role', 'vendor');
            }
          }
          window.location.replace('/dashboard');
          return;
        }
        if (isOAuthCallback) {
          try {
            await supabase.from('users').upsert({
              id: user.id, email: user.email,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'مستخدم',
              role: 'store_owner', status: 'pending', created_at: new Date().toISOString(),
            }, { onConflict: 'id' });
          } catch (e) { console.warn('Profile upsert error (non-fatal):', e); }
          setStep(2);
          setIsSessionLoading(false);
        } else {
          setLoggedInEmail(user.email || null);
          setIsSessionLoading(false);
        }
      } else {
        localStorage.removeItem('suriix_oauth_intent');
        setIsSessionLoading(false);
      }
    };
    handleSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && _event === 'SIGNED_IN') handleSession();
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoName(file.name);
      const reader = new FileReader();
      reader.onload = () => { if (reader.result) setLogoFile(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep1 = async () => {
    if (!storeName.trim() || !storeLink.trim() || !merchantName.trim()) {
      toast.error("الرجاء تعبئة جميع الحقول المطلوبة (اسم المتجر، الرابط، واسم التاجر)");
      return;
    }
    try {
      const { data: existingStore } = await supabase.from('stores').select('id').eq('store_url', storeLink).maybeSingle();
      if (existingStore) {
        toast.error("عذراً، رابط المتجر (Store URL) مستخدم من قبل، يرجى اختيار رابط آخر.");
        return;
      }
    } catch (err) { console.error("Domain check error:", err); }
    setStep(3);
  };

  const handleNextStep2 = () => {
    if (!whatsappEnabled && !emailEnabled && !instagramEnabled && !facebookEnabled && !tiktokEnabled) {
      toast.error("يجب تفعيل وسيلة تواصل واحدة على الأقل");
      return;
    }
    if (whatsappEnabled && !whatsapp.trim()) { toast.error("الرجاء إدخال رقم الواتساب"); return; }
    if (emailEnabled && !emailContact.trim()) { toast.error("الرجاء إدخال البريد الإلكتروني"); return; }
    if (instagramEnabled && !instagram.trim()) { toast.error("الرجاء إدخال حساب إنستجرام"); return; }
    if (facebookEnabled && !facebook.trim()) { toast.error("الرجاء إدخال حساب فيسبوك"); return; }
    if (tiktokEnabled && !tiktok.trim()) { toast.error("الرجاء إدخال حساب تيك توك"); return; }
    setStep(6);
  };

  const handleGeneratePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%^&*()_+~`|}{[]:;?><,./-="[Math.floor(Math.random() * 29)];
    for (let i = 0; i < 8; i++) { password += chars[Math.floor(Math.random() * chars.length)]; }
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    setAuthPassword(password);
    setAuthConfirmPassword(password);
    setShowCreatePassword(true);
    setShowCreateConfirm(true);
  };

  const handleAuthSubmit = async () => {
    if (authMode === "register") {
      const passwordProps = checkPasswordStrength(authPassword);
      if (!passwordProps.valid) { toast.error("كلمة المرور لا تستوفي كافة شروط الأمان. يرجى تصحيحها."); return; }
      if (authPassword !== authConfirmPassword) { toast.error("كلمة المرور غير متطابقة"); return; }
      const cleanEmail = authEmail.trim().toLowerCase();
      const SUPABASE_URL = "https://rajvyxdfibpamanmmkgf.supabase.co";
      const fnResponse = await fetch(`${SUPABASE_URL}/functions/v1/create-user`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password: authPassword }),
      });
      const fnResult = await fnResponse.json();
      if (fnResult.error) {
        const errorMsg = typeof fnResult.error === 'object' ? JSON.stringify(fnResult.error) : fnResult.error;
        toast.error("حدث خطأ أثناء التسجيل: " + errorMsg);
        return;
      }
      if (fnResult.session?.access_token) {
        await supabase.auth.setSession({ access_token: fnResult.session.access_token, refresh_token: fnResult.session.refresh_token });
        const userId = fnResult.session.user?.id;
        if (userId) {
          await supabase.from("users").upsert([{ id: userId, email: cleanEmail, role: "store_owner", status: "pending" }]);
          import("@/lib/notifications").then(({ notificationEvents, notification }) => {
            notification.send({ user_id: userId, role: 'store_owner', type: 'system', title: 'مرحباً بك في سريكس', message: 'تهانينا! تم إنشاء حسابك بنجاح. يمكنك الآن استكمال إعداد متجرك.' });
            notificationEvents.adminAlert(`تم تسجيل عضو جديد: ${authEmail}`);
          }).catch(console.error);
        }
        setStep(2);
        return;
      }
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: authPassword });
      if (signInError || !signInData?.user) {
        toast.error("تم إنشاء حسابك بنجاح ✅\nالآن قم بتسجيل الدخول بنفس البريد وكلمة المرور.");
        setAuthMode("login");
        return;
      }
      await supabase.from("users").upsert([{ id: signInData.user.id, email: cleanEmail, role: "store_owner", status: "pending" }]);
      import("@/lib/notifications").then(({ notificationEvents, notification }) => {
        notification.send({ user_id: signInData.user.id, role: 'store_owner', type: 'system', title: 'مرحباً بك في سريكس', message: 'تهانينا! تم إنشاء حسابك بنجاح. يمكنك الآن استكمال إعداد متجرك.' });
        notificationEvents.adminAlert(`تم تسجيل عضو جديد: ${authEmail}`);
      }).catch(console.error);
      setStep(2);
    } else {
      const cleanEmail = authEmail.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: authPassword });
      if (error) { toast.error("بيانات الدخول غير صحيحة"); return; }
      if (data?.user) {
        const { data: storeData } = await supabase.from('stores').select('id').eq('owner_id', data.user.id).single();
        if (storeData) {
          const { data: fullStore } = await supabase.from('stores').select('*').eq('id', storeData.id).single();
          if (fullStore) {
            const { data: products } = await supabase.from('products').select('*').eq('store_id', fullStore.id);
            const list = [{ id: fullStore.id, owner_id: data.user.id, name: fullStore.store_name, slug: fullStore.store_url, url: fullStore.store_url, status: fullStore.is_active ? 'active' : 'pending', tier: 'Basic', products: products || [], theme: fullStore.theme_color, cardStyle: fullStore.template_id }];
            localStorage.setItem('suriix_added_stores', JSON.stringify(list));
            localStorage.setItem('suriix_user_auth', 'true');
            localStorage.setItem('suriix_user_role', 'vendor');
          }
          window.location.href = '/dashboard';
          return;
        } else { setStep(2); return; }
      }
    }
    setStep(2);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    localStorage.setItem('suriix_oauth_intent', authMode);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/create-store`, skipBrowserRedirect: false, queryParams: { access_type: 'offline', prompt: 'select_account' } } });
    if (error) { setIsGoogleLoading(false); localStorage.removeItem('suriix_oauth_intent'); toast.error("حدث خطأ أثناء تسجيل الدخول باستخدام Google"); }
  };

  const handleGuestLogin = () => { localStorage.setItem("suriix_guest_mode", "true"); window.location.href = "/dashboard"; };

  const handleCompleteOnboarding = async () => {
    const storeSlug = storeLink || `store-${Date.now()}`;
    const cleanPhone = whatsapp ? `${phoneCode}${whatsapp}`.replace(/[\s-]/g, "") : null;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      const ownerEmail = authEmail.trim().toLowerCase() || session?.user?.email?.trim().toLowerCase() || `owner_${Date.now()}@example.com`;
      let realStoreId: string | null = null;
      if (userId) {
        const { data: userData, error: userError } = await supabase.from("users").upsert([{ id: userId, name: merchantName || "صاحب المتجر", email: ownerEmail, phone: cleanPhone, role: "store_owner", status: "pending" }], { onConflict: 'id' }).select().single();
        if (!userError && userData) {
          const { data: storeRow, error: storeError } = await supabase.from("stores").insert([{ owner_id: userData.id, store_name: storeName || "متجري الجديد", store_niche: "عام", store_url: storeSlug, theme_color: themeStyle, template_id: TEMPLATE_CARDS[0].name, is_active: false }]).select().single();
          if (storeRow) realStoreId = storeRow.id;
          if (storeError) console.error("Store error:", storeError);
        } else if (userError) { console.error("Error creating user:", userError); }
      } else {
        const SUPABASE_URL = "https://rajvyxdfibpamanmmkgf.supabase.co";
        const saveRes = await fetch(`${SUPABASE_URL}/functions/v1/save-store`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: ownerEmail, storeName: storeName || "متجري الجديد", storeSlug, merchantName: merchantName || "صاحب المتجر", phone: cleanPhone, themeStyle, templateId: TEMPLATE_CARDS[0].name }) });
        const saveResult = await saveRes.json();
        if (saveResult.storeId) realStoreId = saveResult.storeId;
        if (saveResult.error) console.error("save-store error:", saveResult.error);
      }

      // Record referral if a referral is present and a store was created
      if (referralCode && realStoreId) {
        const storedMarketerId = localStorage.getItem("suriix_referral_marketer_id");
        if (storedMarketerId) {
          try {
            await supabase.from("marketer_referrals").insert([{
              marketer_id: storedMarketerId,
              store_id: realStoreId,
              status: "pending",
              plan_name: "غير محدد",
              commission_amount: 0
            }]);
            console.log("Referral recorded successfully for marketer", storedMarketerId);
          } catch (refErr) {
            console.error("Failed to record referral", refErr);
          }
        }
      }

      const newStore = { id: realStoreId || userId || `local-${Date.now()}`, name: storeName || "متجري الجديد", slug: storeSlug, description: "متجر فاخر", phone: cleanPhone, niche: "عام", logo: logoFile, whatsapp, emailContact, instagram, facebook, tiktok, theme: themeStyle, cardStyle, template: TEMPLATE_CARDS[0].name, status: "pending", owner: merchantName || "مستخدم جديد", email: ownerEmail };
      const existing = localStorage.getItem("suriix_added_stores");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newStore);
      localStorage.setItem("suriix_added_stores", JSON.stringify(list));
      localStorage.setItem("suriix_user_auth", "true");
      localStorage.setItem("suriix_user_role", "vendor");
      setStep(7);
    } catch (error) {
      console.error(error);
      const storeSlugFallback = storeLink || `store-${Date.now()}`;
      const newStore = { id: Date.now(), name: storeName || "متجري الجديد", slug: storeSlugFallback, description: "متجر فاخر", phone: cleanPhone, niche: "عام", logo: logoFile, whatsapp, emailContact, instagram, facebook, tiktok, theme: themeStyle, cardStyle, template: TEMPLATE_CARDS[0].name, status: "pending", tier: "Basic", createdAt: new Date().toISOString().split("T")[0], owner: merchantName || "مستخدم جديد", email: authEmail || `owner_${Date.now()}@example.com` };
      const existing = localStorage.getItem("suriix_added_stores");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(newStore);
      localStorage.setItem("suriix_added_stores", JSON.stringify(list));
      localStorage.setItem("suriix_user_auth", "true");
      localStorage.setItem("suriix_user_role", "vendor");
      setStep(7);
    }
  };

  const handleSkipOnboarding = () => setStep(7);

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0d] flex flex-col items-center justify-center p-4">
        <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">جاري الدخول والتحقق من حسابك...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0d] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] font-sans relative overflow-hidden p-4 md:p-6 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center" dir="rtl">
      <SEO title="ابدأ متجرك الذكي | Suriix" description="أنشئ متجرك الإلكتروني الفاخر" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-20 dark:opacity-30 blur-[100px] -z-10 bg-primary/100/20" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 dark:opacity-25 blur-[100px] -z-10 bg-pink-500/20" />

      {/* Step 1: Auth */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/5 rounded-3xl p-8 md:p-10 max-w-[550px] mx-auto shadow-xl relative overflow-hidden flex flex-col items-center mt-12 md:mt-24 mb-12">
          {loggedInEmail && (
            <div className="w-full mb-6 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center justify-between gap-3 z-10">
              <div className="text-right"><p className="text-xs font-bold text-amber-800">أنت مسجل الدخول حالياً بـ:</p><p className="text-xs font-semibold text-amber-600 dir-ltr">{loggedInEmail}</p></div>
              <button onClick={handleLogout} className="shrink-0 bg-white border border-amber-200 hover:bg-amber-100 text-amber-700 font-bold text-xs px-3 py-1.5 rounded-lg transition dark:bg-[#0f172a]">تسجيل الخروج</button>
            </div>
          )}
          {/* Referral Banner */}
          {referralMarketerName && (
            <div className="w-full mb-4 bg-purple-50 border border-purple-200 rounded-2xl px-4 py-3 flex items-center gap-3 z-10">
              <span className="text-2xl">🎁</span>
              <div className="text-right flex-1">
                <p className="text-xs font-bold text-purple-800">تمت الإحالة بواسطة المسوق:</p>
                <p className="text-sm font-black text-purple-600">{referralMarketerName}</p>
              </div>
            </div>
          )}
          <div className="flex flex-col-reverse md:flex-row justify-between items-center w-full mb-8 z-10 gap-6 md:gap-4 md:items-start pl-2">
            <div className="text-center md:text-right flex-1 pt-4">
              <h2 className="text-[28px] leading-tight font-black text-slate-800 dark:text-white mb-2 tracking-tight">ابدأ متجرك خلال <span className="text-purple-600">دقائق</span></h2>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed max-w-[250px] mx-auto md:mx-0 dark:text-slate-300">كل الأدوات التي تحتاجها لإدارة متجرك في مكان واحد</p>
            </div>
            <div className="relative w-36 h-36 shrink-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 to-purple-50 rounded-full flex items-center justify-center overflow-hidden">
                <Rocket className="w-14 h-14 text-purple-600 fill-purple-500 transform -rotate-12" />
              </div>
              <div className="absolute top-4 right-1 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center border-2 border-white shadow-sm z-10"><UserPlus className="w-4 h-4 text-purple-600" /></div>
              <div className="absolute -top-1 left-7 w-8 h-8 bg-white rounded-lg flex items-center justify-center border-2 border-purple-50 shadow-sm z-10 dark:bg-[#0f172a]"><Lock className="w-4 h-4 text-purple-500" /></div>
              <div className="absolute bottom-2 -left-1 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center border-2 border-white shadow-sm z-10"><Store className="w-4 h-4 text-purple-600" /></div>
            </div>
          </div>

          <div className="flex w-full items-center mb-8 z-10 bg-white border border-slate-100 rounded-2xl py-4 shadow-sm dark:bg-[#1a1a24] dark:border-white/5">
            <div className="flex flex-col items-center justify-center text-center flex-1">
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2"><Lock className="w-4 h-4" /></div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">🔒 آمن وموثوق</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-300">حماية كاملة للبيانات</span>
            </div>
            <div className="w-px h-12 bg-slate-100 dark:bg-white/10" />
            <div className="flex flex-col items-center justify-center text-center flex-1">
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2"><Zap className="w-4 h-4" /></div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">⚡ إنشاء خلال دقائق</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-300">ابدأ بسرعة</span>
            </div>
            <div className="w-px h-12 bg-slate-100 dark:bg-white/10" />
            <div className="flex flex-col items-center justify-center text-center flex-1">
              <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-2"><Sparkles className="w-4 h-4" /></div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">دعم 24/7</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-300">نحن هنا لمساعدتك</span>
            </div>
          </div>

          <div className="flex w-full border-b border-slate-200 dark:border-white/10 mb-8 z-10">
            <button onClick={() => setAuthMode("register")} className={`flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-2 border-b-[3px] transition-all cursor-pointer ${authMode === 'register' ? 'border-purple-600 text-purple-700 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}><UserPlus className="w-4 h-4" /> إنشاء حساب جديد</button>
            <button onClick={() => setAuthMode("login")} className={`flex-1 pb-3 text-sm font-bold flex items-center justify-center gap-2 border-b-[3px] transition-all cursor-pointer flex-row-reverse ${authMode === 'login' ? 'border-purple-600 text-purple-700 dark:text-purple-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}>تسجيل الدخول <LogIn className="w-4 h-4" /></button>
          </div>

          <div className="w-full space-y-5 z-10">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2 text-start">البريد الإلكتروني</label>
              <div className="relative">
                <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} placeholder="example@email.com" className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-11 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 transition-all text-left" dir="ltr" />
                <Mail className="w-5 h-5 text-purple-600 absolute right-3.5 top-3.5" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2 text-start">كلمة المرور</label>
              <div className="relative">
                <input type={showCreatePassword ? 'text' : 'password'} value={authPassword} onChange={e => setAuthPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-20 pl-11 text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 tracking-widest transition-all text-left" dir="ltr" />
                <Lock className="w-5 h-5 text-purple-600 absolute right-3.5 top-3.5" />
                {authMode === "register" && (<button type="button" onClick={handleGeneratePassword} title="اقتراح كلمة مرور قوية" className="absolute right-11 top-3.5 text-[#5B5EE5] hover:text-[#4a4ec4] transition-colors" tabIndex={-1}><Wand2 className="w-5 h-5" /></button>)}
                <button type="button" onClick={() => setShowCreatePassword(v => !v)} className="absolute left-3.5 top-3.5 text-purple-400 hover:text-purple-700 dark:hover:text-white transition-colors" tabIndex={-1}>{showCreatePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              {authMode === "register" && (
                <div className="mt-4 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-black/20 rounded-xl p-4 border border-slate-100">
                  <p className="font-bold text-slate-900 dark:text-white mb-2.5 flex items-center justify-between">قوة كلمة المرور: <span className={`${checkPasswordStrength(authPassword).valid ? 'text-emerald-500' : 'text-rose-500'} font-extrabold text-xs`}>{checkPasswordStrength(authPassword).label}</span></p>
                  <ul className="space-y-2 pr-1 font-semibold flex flex-col items-start gap-0.5">
                    {[['hasMinLength', '8 أحرف على الأقل'], ['hasUpperCase', 'حرف كبير (Uppercase)'], ['hasLowerCase', 'حرف صغير (Lowercase)'], ['hasNumber', 'رقم واحد على الأقل'], ['hasSpecialChar', 'رمز خاص (!@#$%)']].map(([key, label]) => (
                      <li key={key} className={`flex items-center gap-2 ${(checkPasswordStrength(authPassword).checks as any)[key] ? "text-slate-400 dark:text-slate-300" : ""}`}>
                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${(checkPasswordStrength(authPassword).checks as any)[key] ? "bg-purple-600 border-purple-600 text-white" : "border-slate-300 dark:border-slate-800"}`}>{(checkPasswordStrength(authPassword).checks as any)[key] && <Check className="w-2.5 h-2.5" />}</div>
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {authMode === "register" && (
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-2 text-start">تأكيد كلمة المرور</label>
                <div className="relative">
                  <input type="password" value={authConfirmPassword} onChange={e => setAuthConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 pr-11 text-sm font-extrabold text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 tracking-widest transition-all text-left" dir="ltr" />
                  <Lock className="w-5 h-5 text-purple-600 absolute right-3.5 top-3.5" />
                </div>
              </div>
            )}
            <button onClick={handleAuthSubmit} className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-4 font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer mt-4 transition-all">
              {authMode === 'register' ? 'إنشاء حساب 🚀' : 'تسجيل الدخول'}
            </button>
          </div>

          <button onClick={handleGuestLogin} className="w-full bg-transparent hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl py-3 font-bold text-sm text-primary dark:text-indigo-400 mt-4 transition-colors cursor-pointer z-10 flex items-center justify-center gap-2 dark:bg-[#0f172a]"><UserPlus className="w-4 h-4" /> الدخول كضيف</button>
          <p className="mt-6 text-[10px] text-slate-400 text-center z-10 dark:text-slate-300">بإنشائك حساباً، فإنك توافق على <a href="#" className="text-primary hover:underline">شروط الاستخدام</a> و <a href="#" className="text-primary hover:underline">سياسة الخصوصية</a></p>
        </motion.div>
      )}

      {/* Main Wizard (Steps 2 to 6) */}
      {step >= 2 && step <= 6 && (
        <div className="w-full max-w-[64rem]">
          <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /><span className="font-black text-slate-900 dark:text-white text-lg">Suriix <span className="text-slate-400 text-sm font-medium dark:text-slate-300">STUDIO</span></span></div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />متصل: gravity</div>
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-full transition-colors cursor-pointer bg-white/50 dark:bg-transparent dark:text-white">إلغاء التجربة <span>×</span></button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-10 w-full px-4 overflow-x-auto pb-4 pt-2 gap-4 hide-scrollbar">
            {[{ stepVal: 2, num: 1, label: "الهوية والشعار" }, { stepVal: 3, num: 2, label: "بيانات التواصل" }, { stepVal: 6, num: 3, label: "المعاينة والنشر" }].map((s, i) => {
              const isCompleted = step > s.stepVal || step === 7;
              const isActive = s.stepVal === step;
              return (
                <React.Fragment key={s.num}>
                  <div className={`flex items-center gap-2.5 transition-all duration-300 shrink-0 ${isActive || isCompleted ? 'opacity-100' : 'opacity-60 grayscale-[50%]'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${isCompleted ? "border-emerald-500 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10" : isActive ? "border-primary bg-primary text-white shadow-md shadow-indigo-500/30 scale-110" : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#111116]"}`}>{isCompleted ? <Check className="w-5 h-5" /> : s.num}</div>
                    <span className={`text-[13px] md:text-sm font-black transition-colors duration-300 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>{s.label}</span>
                  </div>
                  {i < 2 && <div className={`flex-1 h-[2px] transition-colors duration-500 min-w-[20px] ${isCompleted ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-slate-200 dark:bg-slate-700/50'}`} />}
                </React.Fragment>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full flex gap-6 min-h-[500px]">
              {/* Wizard Step 1: الهوية والشعار */}
              {step === 2 && (
                <>
                  <div className="flex-1 bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/5 rounded-[24px] p-8 flex flex-col justify-between shadow-xl shadow-slate-200/20 dark:shadow-none">
                    <div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2"><Store className="w-5 h-5 text-primary" /> معلومات وهوية المتجر</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">ابدأ بضبط الاسم الذي سيعرض على واجهة متجرك الإلكتروني</p>
                      <div className="space-y-6">
                        <div>
                          <label className="text-xs font-bold text-slate-400 block mb-2 tracking-wide uppercase dark:text-slate-300">Store Name / اسم المتجر</label>
                          <div className="relative">
                            <input type="text" value={storeName} onChange={e => {
                              const val = e.target.value;
                              setStoreName(val);
                              setStoreLink(transliterateArabic(val));
                            }} placeholder="مثال: متجر النخبة الفاخر" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 pr-10" />
                            <Store className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 dark:text-slate-300" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 block mb-2 tracking-wide uppercase dark:text-slate-300">Store URL / رابط المتجر</label>
                          <div className="flex" dir="ltr">
                            <input type="text" value={storeLink} onChange={e => setStoreLink(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase())} placeholder="my-store" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-l-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 text-right pr-4" />
                            <div className="bg-slate-100 dark:bg-white/5 border border-l-0 border-slate-200 dark:border-white/10 rounded-r-xl px-4 py-3.5 text-sm font-bold text-slate-500 whitespace-nowrap flex items-center dark:text-slate-300">.suriix.com</div>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1.5 float-right w-full text-right dark:text-slate-300">باللغة الإنجليزية فقط ولا يقبل مسافات (مثال: my-store)</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 block mb-2 tracking-wide uppercase dark:text-slate-300">Merchant Name / اسم التاجر أو العميل</label>
                          <div className="relative">
                            <input type="text" value={merchantName} onChange={e => setMerchantName(e.target.value)} placeholder="مثال: خالد الراشد" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 pr-10" />
                            <UserPlus className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 dark:text-slate-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-12">
                      <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors dark:text-white"><ArrowRight className="w-4 h-4" /> السابق</button>
                      <button onClick={handleNextStep1} className="bg-primary hover:bg-primary/100 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer transition-all">متابعة <ArrowLeft className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {/* Logo Upload Box */}
                  <div className="flex-1 bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/5 rounded-[24px] p-8 shadow-xl shadow-slate-200/20 dark:shadow-none">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-primary" /> شعار العلامة التجارية
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">ارفع شعار متجرك لعرضه حياً داخل المعاينة السريعة</p>
                    <label className="border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-indigo-500 bg-slate-50 dark:bg-black/20 rounded-[24px] h-[240px] flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors relative">
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                      {logoFile ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-white/20 shadow-xl shadow-black/20 ring-2 ring-primary/30">
                            <img src={logoFile} alt="logo" className="w-full h-full object-cover" />
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">{logoName}</p>
                          <p className="text-[11px] text-primary dark:text-indigo-400 font-bold">✓ تم رفع الشعار بنجاح</p>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-full flex items-center justify-center text-slate-400 shadow-sm border border-slate-200 dark:border-white/10 dark:text-slate-300">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">اسحب وأفلت شعارك هنا</p>
                            <p className="text-xs text-slate-500 mt-1 dark:text-slate-300">(PNG, JPG) أو اضغط للتصفح من جهازك</p>
                          </div>
                        </>
                      )}
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-6 flex items-start gap-2">
                      <span className="text-amber-500">💡</span> في حال لم ترفع شعاراً، سنقوم بإنشاء شعار رمزي تلقائي لمتجرك باستخدام الحرف الأول من اسم متجرك بشكل مميز جداً.
                    </p>
                  </div>
                </>
              )}

              {/* Wizard Step 2: بيانات التواصل */}
              {
                (step as number) === 3 && (
                  <div className="w-full flex flex-col items-center pb-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">كيف يتواصل معك عملاؤك؟</h2>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400">أضف وسيلة تواصل واحدة على الأقل ليستطيع عملاؤك الطلب منك بسهولة</p>
                    </div>

                    <div className="w-full flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
                      {/* Left Column: Settings */}
                      <div className="flex-[1.8] flex flex-col relative w-full">
                        <div className="bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/5 rounded-[32px] p-8 shadow-xl shadow-slate-200/20 dark:shadow-none space-y-6">

                          {/* WhatsApp Toggle */}
                          <div className="pt-2">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                  <MessageSquare className="w-6 h-6 fill-emerald-500" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <h3 className="font-bold text-slate-900 dark:text-white text-md flex items-center gap-2">رقم واتساب <span className="text-[10px] bg-purple-100 text-primary px-2 py-0.5 rounded-full font-bold">إلزامي</span></h3>
                                  <p className="text-[11px] text-slate-500 font-medium dark:text-slate-300">سيظهر زر واتساب في متجرك ليتواصل معك العملاء مباشرة</p>
                                </div>
                              </div>
                              <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${whatsappEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`} onClick={() => setWhatsappEnabled(!whatsappEnabled)}>
                                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${whatsappEnabled ? 'translate-x-[-28px]' : 'translate-x-0'}`} />
                              </div>
                            </div>
                            {whatsappEnabled && (
                              <div className="mt-4">
                                <div className="relative flex" dir="ltr">
                                  <select value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 border-r-0 rounded-l-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none appearance-none cursor-pointer w-[120px] text-center z-10 transition-colors">
                                    <option value="+966">+966</option>
                                    <option value="+967">+967</option>
                                  </select>
                                  <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="مثال: 777 123 456" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-r-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none pr-6 text-right transition-colors" dir="rtl" />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1.5 font-bold dark:text-slate-300"><CheckCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-300" /> سيتم فتح محادثة واتساب تلقائياً عند الضغط على الزر</p>
                              </div>
                            )}
                          </div>

                          <div className="h-px bg-slate-100 dark:bg-white/5 w-full my-6" />

                          {/* Email Toggle */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-transparent text-slate-500 flex items-center justify-center dark:text-slate-300">
                                  <Mail className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <h3 className="font-bold text-slate-900 dark:text-white text-md">البريد الإلكتروني</h3>
                                  <p className="text-[11px] text-slate-500 font-medium dark:text-slate-300">سيظهر في متجرك ليتواصل معك العملاء عبر الإيميل</p>
                                </div>
                              </div>
                              <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${emailEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`} onClick={() => setEmailEnabled(!emailEnabled)}>
                                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${emailEnabled ? 'translate-x-[-28px]' : 'translate-x-0'}`} />
                              </div>
                            </div>
                            {emailEnabled && (
                              <div className="mt-4" dir="ltr">
                                <input type="email" value={emailContact} onChange={e => setEmailContact(e.target.value)} placeholder="مثال: store@brand.com" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none text-right transition-colors" dir="rtl" />
                              </div>
                            )}
                          </div>

                          <div className="h-px bg-slate-100 dark:bg-white/5 w-full my-6" />

                          {/* Instagram Toggle */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white flex items-center justify-center">
                                  <Instagram className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <h3 className="font-bold text-slate-900 dark:text-white text-md">حساب إنستجرام</h3>
                                  <p className="text-[11px] text-slate-500 font-medium dark:text-slate-300">أضف اسم المستخدم لربط حسابك بمتجرك</p>
                                </div>
                              </div>
                              <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${instagramEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`} onClick={() => setInstagramEnabled(!instagramEnabled)}>
                                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${instagramEnabled ? 'translate-x-[-28px]' : 'translate-x-0'}`} />
                              </div>
                            </div>
                            {instagramEnabled && (
                              <div className="mt-4" dir="ltr">
                                <input type="text" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="مثال: @yourstore" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none text-right transition-colors" dir="rtl" />
                              </div>
                            )}

                            <div className="h-px bg-slate-100 dark:bg-white/5 w-full my-6" />

                            {/* Facebook Toggle */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-[#1877F2] text-white flex items-center justify-center">
                                    <Facebook className="w-6 h-6" />
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-md">حساب فيسبوك</h3>
                                    <p className="text-[11px] text-slate-500 font-medium dark:text-slate-300">أضف رابط أو اسم صفحة الفيسبوك</p>
                                  </div>
                                </div>
                                <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${facebookEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`} onClick={() => setFacebookEnabled(!facebookEnabled)}>
                                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${facebookEnabled ? 'translate-x-[-28px]' : 'translate-x-0'}`} />
                                </div>
                              </div>
                              {facebookEnabled && (
                                <div className="mt-4" dir="ltr">
                                  <input type="text" value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="مثال: yourstore" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none text-right transition-colors" dir="rtl" />
                                </div>
                              )}
                            </div>

                            <div className="h-px bg-slate-100 dark:bg-white/5 w-full my-6" />

                            {/* TikTok Toggle */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-white/10 bg-black text-white flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-md">حساب تيك توك</h3>
                                    <p className="text-[11px] text-slate-500 font-medium dark:text-slate-300">أضف رابط أو اسم حساب تيك توك</p>
                                  </div>
                                </div>
                                <div className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors ${tiktokEnabled ? 'bg-emerald-500' : 'bg-slate-200'}`} onClick={() => setTiktokEnabled(!tiktokEnabled)}>
                                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${tiktokEnabled ? 'translate-x-[-28px]' : 'translate-x-0'}`} />
                                </div>
                              </div>
                              {tiktokEnabled && (
                                <div className="mt-4" dir="ltr">
                                  <input type="text" value={tiktok} onChange={e => setTiktok(e.target.value)} placeholder="مثال: @yourstore" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none text-right transition-colors" dir="rtl" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Auto Message Box */}
                          <div className="bg-primary/10 dark:bg-primary/100/5 rounded-[24px] p-6 border border-indigo-100 dark:border-indigo-500/10 mt-6 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                  <MessageSquare className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col gap-0.5 mt-1">
                                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">رسالة واتساب تلقائية <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold dark:text-slate-300">اختياري</span></h3>
                                  <p className="text-[11px] text-slate-500 font-medium dark:text-slate-300">اكتب رسالة جاهزة سيتم إرسالها عند تواصل العملاء معك</p>
                                </div>
                              </div>
                            </div>
                            <div className="relative">
                              <textarea value={autoMessage} onChange={e => setAutoMessage(e.target.value)} maxLength={100} className="w-full h-24 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:outline-none resize-none shadow-sm" />
                              <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-bold dark:text-slate-300">{autoMessage.length}/100</span>
                            </div>
                          </div>

                          <div className="flex bg-slate-50 dark:bg-white/5 rounded-2xl py-4 px-4 mt-6 items-center justify-center gap-2 text-xs font-bold text-slate-500 border border-slate-200 dark:border-white/5 dark:text-slate-300">
                            <Lock className="w-4 h-4" /> لن يتم نشر بياناتك، وستبقى آمنة وسرية
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-6 px-2">
                          <button onClick={() => setStep(2)} className="bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 px-6 py-3.5 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-sm text-sm">
                            <ArrowRight className="w-4 h-4" /> السابق
                          </button>
                          <button onClick={handleNextStep2} className="bg-primary hover:bg-primary/100 text-white px-10 py-3.5 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-indigo-500/20 cursor-pointer transition-all text-sm">
                            التالي <ArrowLeft className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Right Column: Live Preview & Tip */}
                      <div className="flex-[1.2] flex flex-col gap-6 w-full max-w-[340px]">
                        {/* Live Preview Card */}
                        <div className="bg-slate-50 dark:bg-[#111116] border border-slate-200 dark:border-white/5 rounded-[32px] p-6 shadow-xl shadow-slate-200/20 dark:shadow-none flex flex-col items-center">
                          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-400 font-extrabold text-sm mb-6 w-full justify-center">
                            <Eye className="w-4 h-4" /> معاينة ما سيراه عملاؤك
                          </div>

                          <div className="w-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 rounded-[32px] p-6 shadow-md relative pt-12 mt-4 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white absolute -top-8 border-[6px] border-white dark:border-[#111116] shadow-md overflow-hidden">
                              {logoFile ? <img src={logoFile} alt="logo" className="w-full h-full object-cover" /> : <Store className="w-7 h-7" />}
                            </div>

                            <h3 className="font-black text-lg text-slate-900 dark:text-white mt-2">{storeName || 'متجري'}</h3>
                            <p className="text-[11px] text-slate-500 font-bold mb-6 dark:text-slate-300">متجر إلكتروني</p>

                            <div className="w-full flex items-center gap-3 mb-6">
                              <div className="h-px bg-slate-100 dark:bg-white/10 flex-1" />
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-300">تواصل معنا</span>
                              <div className="h-px bg-slate-100 dark:bg-white/10 flex-1" />
                            </div>

                            <div className="w-full space-y-3">
                              {whatsappEnabled && (
                                <button className="w-full bg-emerald-500 text-white rounded-2xl py-3.5 text-sm font-bold flex items-center justify-between px-4 shadow-md shadow-emerald-500/20">
                                  <span>تواصل عبر واتساب</span>
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                              )}
                              {emailEnabled && (
                                <button className="w-full bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-2xl py-3.5 text-sm font-bold flex items-center justify-between px-4 shadow-sm">
                                  <span>راسلنا عبر البريد</span>
                                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-300" />
                                </button>
                              )}
                              {instagramEnabled && (
                                <button className="w-full bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-2xl py-3.5 text-sm font-bold flex items-center justify-between px-4 shadow-sm">
                                  <span>تابعنا على إنستجرام</span>
                                  <Instagram className="w-4 h-4 text-pink-500" />
                                </button>
                              )}
                              {facebookEnabled && (
                                <button className="w-full bg-[#1877F2]/10 dark:bg-[#1877F2]/20 border border-[#1877F2]/20 text-[#1877F2] rounded-2xl py-3.5 text-sm font-bold flex items-center justify-between px-4 shadow-sm">
                                  <span>تابعنا على فيسبوك</span>
                                  <Facebook className="w-4 h-4 text-[#1877F2]" />
                                </button>
                              )}
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-bold bg-slate-50 dark:bg-white/5 py-2 px-4 rounded-full dark:text-slate-300">
                              <Lock className="w-3 h-3" /> تجربتك آمنة ومشفرة
                            </div>
                          </div>
                        </div>

                        {/* Tip Card */}
                        <div className="bg-primary/10 dark:bg-primary/100/10 border border-indigo-100 dark:border-primary/20 rounded-[28px] p-6 text-center shadow-lg shadow-indigo-500/5">
                          <div className="inline-flex items-center gap-2 text-primary dark:text-indigo-400 font-black text-sm mb-3">
                            نصيحة <Sparkles className="w-4 h-4" />
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-bold">
                            كلما أضفت وسائل تواصل أكثر، زادت فرص تواصل العملاء معك وزيادة مبيعاتك
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                )
              }

              {/* Wizard Step 3 (hidden - skipped) */}
              {
                false && step === 4 && (
                  <>
                    <div className="flex-[1.2] bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/5 rounded-[24px] p-8 flex flex-col justify-between overflow-y-auto max-h-[550px] shadow-xl shadow-slate-200/20 dark:shadow-none">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                          <Paintbrush className="w-5 h-5 text-primary" /> تخصيص المظهر وتصميم الهيكل
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">اختر نمطاً جمالياً لمتجرك لتراه حياً ومطبقاً على المعاينة المباشرة</p>

                        <div className="mb-6">
                          <label className="text-[11px] font-black text-primary dark:text-indigo-400 block mb-3 uppercase tracking-wider">THEME STYLE / نمط المظهر العام</label>
                          <div className="space-y-3">
                            {[
                              { id: "Modern", name: "عصري / Modern", desc: "Elegant Indigo gradients & futuristic SaaS look", dot: "bg-indigo-400" },
                              { id: "Luxury", name: "فاخر / Luxury", desc: "Premium gold details, deep bronze mesh", dot: "bg-amber-400" },
                              { id: "Dark", name: "داكن / Dark", desc: "Charcoal, deep steel, high contrast shadows", dot: "bg-slate-300" },
                              { id: "Minimal", name: "بسيط / Minimal", desc: "Ultra-clean spacing, thin lines, sleek gray highlight", dot: "bg-slate-400 dark:bg-slate-500" },
                              { id: "Neon", name: "نيون / Neon", desc: "Electric cyan outlines, heavy ambient purple glow", dot: "bg-cyan-400" },
                            ].map(t => (
                              <button key={t.id} onClick={() => setThemeStyle(t.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${themeStyle === t.id ? 'bg-primary/10 dark:bg-primary/100/10 border-indigo-300 dark:border-indigo-500/50 shadow-inner' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30'}`}>
                                <div className="flex items-center gap-3 text-start">
                                  <div className={`w-3.5 h-3.5 rounded-full shadow-sm ${t.dot}`} />
                                  <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.desc}</p>
                                  </div>
                                </div>
                                {themeStyle === t.id && <div className="w-5 h-5 bg-primary/100 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-black text-primary dark:text-indigo-400 block mb-3 uppercase tracking-wider">CARD STYLE / شكل وهيكل البطاقات</label>
                          <div className="flex gap-3">
                            {["زجاجي زاهي Glassmorphism", "ناعم ثقيل Soft UI", "حواف مسطحة Modern flat"].map(c => {
                              const simpleName = c.split(" ")[0] + " " + c.split(" ")[1];
                              const subName = c.split(" ").slice(2).join(" ");
                              return (
                                <button key={c} onClick={() => setCardStyle(c)} className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${cardStyle === c ? 'bg-primary/10 dark:bg-primary/100/10 border-indigo-300 dark:border-indigo-500/50' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5'}`}>
                                  <span className="font-bold text-sm text-slate-900 dark:text-white mb-1">{simpleName}</span>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 text-center leading-tight">{subName}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                      <div className="flex justify-between items-center mt-8 border-t border-slate-200 dark:border-white/5 pt-6">
                        <button onClick={() => setStep(3)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors dark:text-white">
                          <ArrowRight className="w-4 h-4" /> السابق
                        </button>
                        <button onClick={() => setStep(6)} className="bg-primary hover:bg-primary/100 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 flex-1 max-w-[200px] justify-center shadow-lg shadow-indigo-500/20 cursor-pointer transition-all">
                          متابعة <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Right Color Preview */}
                    <div className="flex-[0.8] bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/5 rounded-[24px] p-8 flex flex-col shadow-xl shadow-slate-200/20 dark:shadow-none">
                      <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <Eye className="w-5 h-5 text-primary" /> معاينة اللون المختار
                      </h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-8">الشاشات والواجهات والأزرار ستتبنى نظام الألوان التالي تلقائياً:</p>

                      <div className={`flex-1 ${themeStyle === 'Dark' || themeStyle === 'Neon' ? 'bg-[#0a0a0d]' : 'bg-slate-100 dark:bg-[#0a0a0d]'} border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center gap-6 relative overflow-hidden p-6 mx-auto w-full max-w-[300px] transition-colors duration-500`}>
                        <div className="w-[300px] h-[300px] bg-white/5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none dark:bg-[#0f172a]" />

                        {/* Theme Dot Demo */}
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center p-2 mb-2 relative z-10 bg-black/5 dark:bg-black/20">
                            <div className={`w-full h-full rounded-full shadow-lg transition-colors duration-500 ${themeStyle === 'Modern' ? 'bg-primary/100' : themeStyle === 'Luxury' ? 'bg-amber-400' : themeStyle === 'Neon' ? 'bg-cyan-400 shadow-cyan-500/50' : 'bg-slate-800 dark:bg-slate-200'} ring-4 ring-white/10`} />
                          </div>
                        </div>

                        <div className="text-center z-10">
                          <h3 className={`font-extrabold text-lg mb-1 ${themeStyle === 'Dark' || themeStyle === 'Neon' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{themeStyle} Preview</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-300">Auto applied contrast shadows & structural UI.</p>
                        </div>

                        <div className="flex gap-2 z-10 mt-2">
                          <div className="w-6 h-6 rounded-full bg-slate-50 shadow-sm border border-slate-200 dark:border-transparent dark:bg-[#0f172a]" />
                          <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 dark:border-transparent" />
                          <div className="w-6 h-6 rounded-full bg-slate-400 border border-slate-500 dark:border-transparent" />
                          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 dark:border-transparent" />
                        </div>
                      </div>

                      <div className="mt-6 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl p-4 flex gap-3 text-xs text-slate-500 dark:text-slate-400 items-start">
                        <span className="text-primary dark:text-indigo-400 text-lg">💡</span>
                        <p className="leading-relaxed">ستتحكم بكافة الجوانب الجمالية والهيكلية للمتجر لضمان مطابقة توقعات هويتك البصرية قبل النشر.</p>
                      </div>
                    </div>
                  </>
                )
              }

              {/* Subscription logic is bypassed; step 5 is now skipped natively in handleNextStep3 */}

              {/* Wizard Step 5: المعاينة والنشر */}
              {
                (step as number) === 6 && (
                  <div className="w-full bg-white dark:bg-[#111116] border border-slate-200 dark:border-white/5 rounded-[24px] p-8 flex flex-col justify-between max-w-4xl mx-auto shadow-xl shadow-slate-200/20 dark:shadow-none text-center relative overflow-hidden">
                    <div className="max-w-md mx-auto my-auto py-12 flex flex-col items-center">
                      <div className="w-20 h-20 bg-primary/10 dark:bg-primary/100/10 rounded-full flex items-center justify-center mb-6 border border-indigo-200 dark:border-indigo-500/30 text-primary shadow-xl shadow-indigo-500/10">
                        <Rocket className="w-10 h-10" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">أنت جاهز للإنطلاق!</h2>
                      <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed text-sm">
                        لقد اكتملت جميع البيانات والمتطلبات الخاصة بمتجرك الذكي.
                        <br /> هل أنت مستعد لرؤية متجرك يعمل في ثوانٍ؟
                      </p>

                      <div className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 p-4 rounded-2xl w-full flex flex-col gap-3 mb-10 text-start">
                        <div className="flex justify-between items-center text-sm font-bold border-b border-slate-200 dark:border-white/5 pb-3">
                          <span className="text-slate-500 dark:text-slate-300">اسم المتجر</span>
                          <span className="text-slate-900 dark:text-white">{storeName || 'لم يحدد'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold border-b border-slate-200 dark:border-white/5 pb-3">
                          <span className="text-slate-500 dark:text-slate-300">لغة التصميم (Theme)</span>
                          <span className="text-primary dark:text-indigo-400 uppercase">{themeStyle}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                          <span className="text-slate-500 dark:text-slate-300">رقم الواتساب</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-mono" dir="ltr">{phoneCode} {whatsapp || '...'}</span>
                        </div>
                      </div>

                      <div className="flex w-full gap-4">
                        <button onClick={() => setStep(4)} className="px-6 py-4 rounded-xl text-slate-500 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 font-bold transition-colors cursor-pointer">
                          تعديل البيانات
                        </button>
                        <button onClick={handleCompleteOnboarding} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 hover:opacity-90 transition-opacity cursor-pointer">
                          نشر المتجر الآن 🚀
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Step 7: Success Screen */}
      {
        step === 7 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-white dark:bg-[#111116] rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-white/5 text-center p-8 z-10 relative"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />
            <div className="w-24 h-24 mx-auto bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100 dark:border-transparent">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">🚀 متجرك أصبح جاهزًا!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">تم إنشاء متجرك بنجاح وتأمينه سحابياً، يمكنك البدء الآن بإدارة منتجاتك.</p>
            <button onClick={() => navigate("/dashboard")} className="w-full py-4 rounded-xl bg-gradient-to-l from-emerald-500 to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-500/25 hover:opacity-95 transition-all cursor-pointer">
              الدخول إلى لوحة التحكم
            </button>
          </motion.div>
        )
      }

    </div>
  );
};

export default CreateStore;
