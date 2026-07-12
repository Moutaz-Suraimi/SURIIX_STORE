import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { useTheme } from "../hooks/useTheme";

const MarketerLogin = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        if (error.message.includes("Invalid login")) {
          toast.error("بيانات الدخول غير صحيحة");
        } else {
          toast.error("حدث خطأ أثناء تسجيل الدخول: " + error.message);
        }
        return;
      }

      if (data.session) {
        const { data: marketerData, error: marketerError } = await supabase
          .from('marketers')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (marketerError) {
           console.error("Marketer check error:", marketerError);
           toast.error(`خطأ في التحقق من الحساب: ${marketerError.message}`);
           return;
        }
          
        if (!marketerData) {
          await supabase.auth.signOut();
          toast.error("هذا الحساب غير مسجل كمسوق. يرجى إنشاء حساب مسوق أولاً.");
          return;
        }

        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/marketer/dashboard");
      }
    } catch (error: any) {
      toast.error("حدث خطأ غير متوقع");
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
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">تسجيل دخول المسوقين</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">مرحباً بك مجدداً في برنامج التسويق بالعمولة</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
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
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-gray-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">كلمة المرور</label>
                <a href="#" className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500">
                  نسيت كلمة المرور؟
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-gray-50 dark:bg-white/5 focus:bg-white dark:focus:bg-white/10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>
        <div className="px-8 py-5 bg-gray-50 dark:bg-white/3 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            ليس لديك حساب مسوق?{" "}
            <Link to="/marketer/signup" className="font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors">
              انضم إلينا الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketerLogin;
