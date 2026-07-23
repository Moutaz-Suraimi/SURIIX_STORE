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

    // التحقق من عدم تكرار رقم الهاتف أو الإيميل
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
    } catch (_) {}

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailClean,
        password: password
      });

      if (error) {
        const errorMsg = error.message;
        // إذا كان المستخدم موجوداً في auth لكن بدون سجل مسوق، نحاول تسجيل الدخول
        if (errorMsg.includes("already registered") || errorMsg.includes("User already exists")) {
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: emailClean,
            password: password
          });
          if (signInError || !signInData.session) {
            toast.error("هذا البريد الإلكتروني مسجل بكلمة مرور مختلفة. يرجى تسجيل الدخول.");
            setIsLoading(false);
            return;
          }
          // تابع تسجيل بيانات المسوق بعد تسجيل الدخول الناجح
          const existingUserId = signInData.session.user.id;
          const referralCodeFallback = Math.random().toString(36).substring(2, 10).toUpperCase();
          const { error: mErr } = await supabase.from('marketers').upsert({
            id: existingUserId,
            email: emailClean,
            name_ar: nameAr.trim(),
            name_en: nameEn.trim(),
            phone: phoneClean,
            referral_code: referralCodeFallback,
          });
          if (mErr) {
            console.error("Marketer save error:", mErr);
            toast.error("حدث خطأ أثناء حفظ بيانات المسوق: " + mErr.message);
            setIsLoading(false);
            return;
          }
          toast.success("تم إنشاء حسابك كمسوق بنجاح! 🎉", { duration: 5000 });
          navigate("/marketer/dashboard");
          return;
        } else {
          toast.error("حدث خطأ أثناء إنشاء الحساب: " + errorMsg);
        }
        setIsLoading(false);
        return;
      }

      const userId = data.user?.id || data.session?.user?.id;
      if (!userId) {
        toast.error("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
        setIsLoading(false);
        return;
      }

      const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const { error: marketerError } = await supabase.from('marketers').upsert({
        id: userId,
        email: emailClean,
        name_ar: nameAr.trim(),
        name_en: nameEn.trim(),
        phone: phoneClean,
        referral_code: referralCode,
      });

      if (marketerError) {
        console.error("Marketer save error:", marketerError);
        toast.error("حدث خطأ أثناء حفظ بيانات المسوق: " + marketerError.message);
        setIsLoading(false);
        return;
      }

      toast.success("تم إنشاء حسابك كمسوق بنجاح! 🎉", { duration: 5000 });
      navigate("/marketer/dashboard");
    } catch (error: any) {
      console.error("Signup Error:", error);
      toast.error("حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.");
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
