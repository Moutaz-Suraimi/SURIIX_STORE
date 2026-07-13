import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, ShieldAlert, Eye, EyeOff, Moon, Sun } from "lucide-react";
import SEO from "@/components/SEO";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/hooks/useTheme";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    
    const cleanEmail = email.trim().toLowerCase();

    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      alert(`فشل تسجيل الدخول: ${error.message}`);
      setLoading(false);
      return;
    }

    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin' || profile?.role === 'SUPER_ADMIN' || email === 'admin@suriix.store' || email === 'wmoutaz84@gmail.com') {
        localStorage.setItem("suriix_admin_auth", "true");
        localStorage.setItem("suriix_user_role", "SUPER_ADMIN");
        window.location.href = "/admin/dashboard";
      } else {
        alert("عذراً، هذا الحساب ليس حساب مسؤول (Admin)");
        await supabase.auth.signOut();
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] font-sans flex items-center justify-center p-4">
      <SEO title="تسجيل دخول الإدارة | Suriix" />
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 left-4 w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20 transition-colors z-50 dark:bg-[#0f172a]"
        title="تغيير المظهر"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-pink-500" />
        
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center dark:bg-[#0f172a]">
            <ShieldAlert className="w-8 h-8 text-primary shadow-lg" />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-white mb-2">تسجيل دخول المسؤول</h1>
          <p className="text-sm text-slate-400 font-bold dark:text-slate-300">لوحة تحكم إدارة منصة Suriix</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" dir="rtl">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 pr-11 text-sm font-bold text-white focus:outline-none focus:border-primary transition-colors focus:bg-slate-900"
                placeholder="admin@suriix.store"
                dir="ltr"
              />
              <Mail className="w-5 h-5 text-slate-500 absolute right-4 top-3.5 dark:text-slate-300" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3.5 pr-11 pl-11 text-sm font-extrabold tracking-widest text-white focus:outline-none focus:border-primary transition-colors focus:bg-slate-900"
                placeholder="••••••••"
                dir="ltr"
              />
              <Lock className="w-5 h-5 text-slate-500 absolute right-4 top-3.5 dark:text-slate-300" />
              <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute left-4 top-3.5 text-slate-500 hover:text-white transition-colors dark:text-slate-300" tabIndex={-1}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-xl py-4 font-bold text-sm shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "جاري الدخول..." : "دخول للوحة التحكم"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={() => navigate('/')} className="text-xs text-slate-500 hover:text-white transition-colors font-bold dark:text-slate-300">
            العودة للصفحة الرئيسية
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
