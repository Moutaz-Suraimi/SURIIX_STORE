import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, User, Phone, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { useTheme } from "../hooks/useTheme";

const MarketerSignup = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // التحقق من اكتمال جميع الحقول
    if (!nameAr.trim() || !nameEn.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      toast.error("يرجى تعبئة جميع الحقول قبل المتابعة");
      return;
    }

    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    const phoneClean = phone.trim();
    const emailClean = email.trim().toLowerCase();

    // التحقق من عدم تكرار رقم الهاتف أو الإيميل محلياً قبل الإرسال
    try {
      const [{ data: existingPhone }, { data: existingEmail }] = await Promise.all([
        supabase.from('marketers').select('id').eq('phone', phoneClean).maybeSingle(),
        supabase.from('marketers').select('id').eq('email', emailClean).maybeSingle(),
      ]);
      if (existingPhone) {
        toast.error("رقم الهاتف مسجل بالفعل لحساب مسوق آخر");
        return;
      }
      if (existingEmail) {
        toast.error("البريد الإلكتروني مسجل بالفعل لحساب مسوق آخر");
        return;
      }
    } catch (_) { /* ignored - the edge function will still validate */ }

    setIsLoading(true);
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://rajvyxdfibpamanmmkgf.supabase.co";
      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const fnResponse = await fetch(`${SUPABASE_URL}/functions/v1/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailClean,
          password: password,
          marketerData: {
            name_ar: nameAr.trim(),
            name_en: nameEn.trim(),
            phone: phoneClean,
            referral_code: referralCode,
          }
        }),
      });

      if (!fnResponse.ok && fnResponse.status !== 200) {
        // محاولة قراءة الخطأ من Response
        let errMsg = "حدث خطأ في الخادم. يرجى المحاولة لاحقاً.";
        try {
          const errData = await fnResponse.json();
          if (errData?.error) errMsg = String(errData.error);
        } catch (_) {}
        throw new Error(errMsg);
      }

      const fnResult = await fnResponse.json();

      if (fnResult.error) {
        const errorMsg = String(fnResult.error);
        // معالجة أخطاء محددة بشكل واضح
        if (errorMsg.includes("already registered") || errorMsg.includes("User already exists") || errorMsg.includes("مسجل بالفعل")) {
          toast.error(errorMsg.includes("مسوق") ? errorMsg : "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد آخر أو تسجيل الدخول.");
          return;
        }
        if (errorMsg.includes("متجر") || errorMsg.includes("store")) {
          toast.error("هذا البريد الإلكتروني مستخدم لحساب متجر. يرجى استخدام بريد إلكتروني مختلف.");
          return;
        }
        throw new Error(errorMsg);
      }

      if (fnResult.marketerError) {
        const mErr = String(fnResult.marketerError);
        if (mErr.includes("duplicate") || mErr.includes("unique")) {
          toast.error("البريد الإلكتروني أو رقم الهاتف مسجل بالفعل.");
          return;
        }
        throw new Error("خطأ في حفظ بيانات المسوق: " + mErr);
      }

      // تفعيل الجلسة المُعادة من الـ Edge Function
      if (fnResult.session?.access_token) {
        await supabase.auth.setSession({
          access_token: fnResult.session.access_token,
          refresh_token: fnResult.session.refresh_token
        });
      } else {
        // إذا لم تُعد الجلسة، نُحاول تسجيل الدخول مباشرة
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email: emailClean,
          password: password
        });
        if (signInErr) throw new Error("تعذر تسجيل الدخول: " + signInErr.message);
        if (signInData?.session) {
          await supabase.auth.setSession({
            access_token: signInData.session.access_token,
            refresh_token: signInData.session.refresh_token
          });
        }
      }

      toast.success("تم إنشاء حسابك كمسوق بنجاح! 🎉 جاري توجيهك إلى لوحة التحكم...", { duration: 5000 });
      navigate("/marketer/dashboard");
    } catch (error: any) {
      console.error("Signup Error:", error);
      const msg = typeof error?.message === 'string' ? error.message : '';
      if (msg.includes("25 seconds") || msg.includes("security purposes")) {
        toast.error("تم رفض الطلب بسبب المحاولات المتكررة. انتظر 30 ثانية ثم حاول مرة أخرى.", { duration: 6000 });
      } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        toast.error("تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.");
      } else {
        toast.error(msg || "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f13] flex items-center justify-center p-4 font-cairo transition-colors duration-300" dir="rtl">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors shadow-sm z-50"
        title="تغيير المظهر"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="max-w-md w-full bg-white dark:bg-[#1a1a24] rounded-3xl shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden transition-colors">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 mx-auto flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg shadow-purple-500/30">
              S
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">إنشاء حساب مسوق</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">ابدأ بجني الأرباح عبر التسويق بالعمولة</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">الاسم بالعربية</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={nameAr}
                      onChange={(e) => setNameAr(e.target.value)}
                      className="block w-full pl-3 pr-10 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 transition-all"
                      placeholder="محمد أحمد"
                      required
                    />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">الاسم بالإنجليزية</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      value={nameEn}
                      onChange={(e) => setNameEn(e.target.value)}
                      className="block w-full pl-3 pr-10 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 transition-all"
                      placeholder="Mohammed Ahmed"
                      dir="ltr"
                      required
                    />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 transition-all"
                  placeholder="name@example.com"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">رقم الهاتف</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 transition-all"
                  placeholder="+966 50 000 0000"
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10 transition-all"
                  placeholder="••••••••  (6 أحرف على الأقل)"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  إنشاء الحساب
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>
        <div className="px-8 py-5 bg-gray-50 dark:bg-white/3 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            لديك حساب بالفعل?{" "}
            <Link to="/marketer/login" className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketerSignup;
