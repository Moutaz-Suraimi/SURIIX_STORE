import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Zap, 
  Palette, 
  LayoutDashboard, 
  BarChart4, 
  ArrowLeft,
  CheckCircle2,
  Home, Package, BarChart3, Users, Settings, LogOut, ArrowUpRight, 
  ChevronDown, Headphones, Watch, Briefcase, Sparkles, Clock, Code2, Headset,
  Mail, Moon, Sun, Menu, X, ShieldCheck, CreditCard, ShoppingCart, ShoppingBag,
  Smile, FileText, Store, PenTool, Smartphone, RefreshCcw, LayoutGrid, Star, MessageCircle, Quote, Rocket
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const Index = () => {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('suriix_theme');
    if (savedTheme === 'dark' || (!savedTheme && document.documentElement.classList.contains('dark'))) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('suriix_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('suriix_theme', 'light');
    }
  };
  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#0f0f13] transition-colors duration-300 font-cairo overflow-x-hidden selection:bg-purple-200" dir="rtl">
      
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#15151c]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center space-x-2 space-x-reverse">
              <img src="/favicon.png" alt="Suriix Logo" className="w-9 h-9 object-contain" />
              <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white bg-clip-text">Suriix</span>
            </div>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex space-x-8 space-x-reverse items-center justify-center flex-1">
              <a href="#" className="relative text-purple-700 dark:text-purple-400 font-black hover:text-purple-800 dark:hover:text-purple-300 transition">
                الرئيسية
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-purple-600 dark:bg-purple-500 rounded-full" />
              </a>
              <a href="#features" className="text-gray-600 dark:text-gray-300 font-bold hover:text-purple-600 dark:hover:text-purple-400 transition">المميزات</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 font-bold hover:text-purple-600 dark:hover:text-purple-400 transition">الأسعار</a>
              <a href="#templates" className="text-gray-600 dark:text-gray-300 font-bold hover:text-purple-600 dark:hover:text-purple-400 transition">قوالب المتاجر</a>
              <div className="relative group">
                <button className="text-gray-600 dark:text-gray-300 font-bold hover:text-purple-600 dark:hover:text-purple-400 transition flex items-center gap-1.5 pt-1">
                  المسوقين <ChevronDown className="w-4 h-4"/>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#1a1a24] border border-gray-100 dark:border-white/5 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <Link to="/marketer/login" className="block px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-white/5 hover:text-purple-700 dark:hover:text-purple-400 border-b border-gray-50 dark:border-white/5 dark:bg-[#0f172a]">
                    تسجيل الدخول
                  </Link>
                  <Link to="/marketer/signup" className="block px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-white/5 hover:text-purple-700 dark:hover:text-purple-400 dark:bg-[#0f172a]">
                    إنشاء حساب
                  </Link>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" title="تغيير المظهر">
                {isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
              </button>
              <Link to="/create-store?mode=login" className="hidden sm:inline-flex text-gray-700 dark:text-gray-200 font-extrabold border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition px-6 py-2.5 rounded-xl text-sm dark:bg-[#0f172a]">
                تسجيل الدخول
              </Link>
              <Link to="/create-store" className="hidden sm:inline-flex bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                ابدأ الآن
              </Link>
              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 dark:border-white/5 py-4 space-y-1">
              <a href="#" className="block px-4 py-3 text-sm font-bold text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-white/5 rounded-xl">الرئيسية</a>
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl">المميزات</a>
              <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl">الأسعار</a>
              <a href="#templates" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl">قوالب المتاجر</a>
              <div className="pt-2 pb-1 border-t border-gray-100 dark:border-white/5 mt-2">
                <p className="px-4 py-1 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">نظام المسوقين</p>
                <Link to="/marketer/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl">تسجيل الدخول كمسوق</Link>
                <Link to="/marketer/signup" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl">إنشاء حساب مسوق</Link>
              </div>
              <div className="border-t border-gray-100 dark:border-white/5 pt-3 mt-3 flex flex-col gap-2 px-4">
                <Link to="/create-store?mode=login" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 font-bold text-sm border border-gray-200 dark:border-white/10 rounded-xl text-gray-700 dark:text-gray-200">تسجيل الدخول</Link>
                <Link to="/create-store" onClick={() => setIsMobileMenuOpen(false)} className="w-full text-center py-3 font-bold text-sm bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white rounded-xl">ابدأ الآن</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-screen flex items-center bg-[#fafafa] dark:bg-[#0f0f13]">
        {/* Background Gradients */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[140px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-fuchsia-200/30 rounded-full blur-[100px] -z-10" />
        <div className="absolute left-0 top-0 h-full w-1/3 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEgMWgxOGQxIDEgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlN2U1ZTQiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-30 -z-20 pointer-events-none fade-out-right"></div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEgMWgxOGQxIDEgMCAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlN2U1ZTQiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-30 -z-20 pointer-events-none fade-out-left"></div>

        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 relative w-full pt-24 sm:pt-32 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* ===== LEFT SIDE: Hero Image ===== */}
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative hidden lg:flex items-center justify-center order-2 w-full"
            >
              <div className="relative w-full max-w-[480px] aspect-[4/4.5] rounded-[3rem] p-3 bg-white/40 dark:bg-white/5 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(168,85,247,0.4)] border border-white/60 dark:border-white/10 animate-[float_6s_ease-in-out_infinite] group">
                {/* Glow behind */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-fuchsia-500/20 rounded-[3rem] -z-10 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Main Image Container */}
                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#15151c] shadow-inner border border-gray-50 dark:border-white/5">
                   {/* MacOS Window Dots */}
                   <div className="absolute top-5 left-5 flex gap-1.5 z-10 opacity-90">
                      <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                      <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                   </div>
                   
                   <img
                     src="/hero-image.png"
                     alt="Suriix Platform Preview"
                     className="w-full h-full object-cover transform scale-[1.03] group-hover:scale-100 transition-transform duration-700 ease-out pt-6"
                   />
                </div>

                {/* Floating Badge Overlay */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-[#1a1a24] p-4 rounded-2xl shadow-2xl shadow-purple-900/20 border border-gray-100 dark:border-white/5 flex items-center gap-4 z-20 animate-[float_5s_ease-in-out_infinite_1.5s]">
                   <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 rounded-2xl flex justify-center items-center shrink-0">
                     <CheckCircle2 className="w-6 h-6" />
                   </div>
                   <div className="text-right">
                     <p className="font-extrabold text-gray-900 dark:text-white text-sm">متجرك جاهز</p>
                     <p className="text-xs font-bold text-gray-500 dark:text-gray-400">في أقل من 5 دقائق</p>
                   </div>
                </div>

                {/* Second Floating Badge */}
                <div className="absolute top-12 -right-8 bg-white dark:bg-[#1a1a24] py-3 px-5 rounded-full shadow-xl shadow-fuchsia-900/10 border border-gray-100 dark:border-white/5 flex items-center justify-between gap-3 z-20 animate-[float_4s_ease-in-out_infinite_0.5s]">
                   <span className="font-extrabold text-gray-900 dark:text-white text-sm">إدارة احترافية</span>
                   <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-full flex justify-center items-center">
                     <Sparkles className="w-3 h-3" />
                   </div>
                </div>
              </div>
            </motion.div>

            {/* ===== RIGHT SIDE: Text Content ===== */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-right space-y-7 order-1 flex flex-col items-end w-full"
            >
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 bg-[#f6f2fe] text-purple-700 px-5 py-2.5 rounded-full text-xs font-bold font-display tracking-tight"
              >
                <span>الجيل الجديد للتجارة الذكية</span>
                <Sparkles className="w-4 h-4 fill-purple-600 text-purple-600" />
              </div>

              {/* Heading */}
              <div className="w-full text-right">
                <h1 className="text-[32px] sm:text-[44px] md:text-5xl lg:text-[70px] font-extrabold text-slate-900 leading-[1.25] tracking-tight dark:text-white pb-3">
                  أنشئ متجرك الذكي
                  <br />
                  <span className="text-[#a855f7]">في دقائق، وابدأ</span>
                  {" "}<span className="text-[#a855f7]">البيع باحترافية.</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-[1.8] max-w-xl text-right">
                <span className="font-bold text-gray-800 dark:text-white">Suriix</span> تمنحك كل ما تحتاجه لإطلاق متجرك الإلكتروني بتصميم احترافي، وإدارة سهلة، وتجربة عملاء استثنائية.
              </p>

              {/* CTA Buttons Layout */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6" style={{ direction: 'rtl' }}>
                <a
                  href="#features"
                  className="w-full sm:w-auto flex justify-center items-center gap-2 bg-white dark:bg-[#1a1a24] text-purple-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 px-8 py-4 rounded-xl font-bold text-lg shadow-sm hover:shadow-md transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>استعراض المميزات</span>
                </a>
                <Link
                  to="/create-store"
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-[0_10px_30px_rgba(217,70,239,0.35)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(217,70,239,0.45)] hover:-translate-y-1"
                  style={{ background: 'linear-gradient(90deg, #b04bf6, #bf5afe)' }}
                >
                  <span>ابدأ تجربتك مجاناً الآن</span>
                  <ArrowLeft className="w-5 h-5 mx-1" />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* ===== DASHBOARD MOCKUP - Desktop Only ===== */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="hidden md:flex w-full max-w-[1200px] mx-auto h-[550px] mt-16 bg-white rounded-3xl border border-gray-100 flex-row overflow-hidden z-20 shadow-[0_40px_100px_rgba(139,92,246,0.15)] relative dark:bg-[#0f172a] dark:border-slate-800"
          >
            {/* Sidebar (Left edge) */}
            <div className="w-[180px] border-r-0 border-l border-gray-100 bg-white flex flex-col py-6 gap-2 z-10 shrink-0 relative dark:bg-[#0f172a] dark:border-slate-800">
              <div className="flex items-center gap-2 px-6 mb-8 justify-end">
                <span className="font-bold text-xl text-gray-900 dark:text-white">Suriix</span>
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                   <div className="font-bold text-lg text-purple-600">S</div>
                </div>
              </div>
              
              <div className="px-3">
                <div className="flex items-center gap-3 justify-end w-full px-4 py-3 rounded-xl bg-purple-50 text-purple-600 font-bold text-sm relative dark:bg-purple-900/30 dark:text-purple-400">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-600 rounded-l-full" />
                  <span>الرئيسية</span>
                  <Home className="w-4 h-4" />
                </div>
                {[
                  { title: "الطلبات", icon: <ShoppingCart className="w-4 h-4" /> },
                  { title: "المنتجات", icon: <Package className="w-4 h-4" /> },
                  { title: "العملاء", icon: <Users className="w-4 h-4" /> },
                  { title: "التقارير", icon: <BarChart4 className="w-4 h-4" /> },
                  { title: "التسويق", icon: <Mail className="w-4 h-4" /> },
                  { title: "التطبيقات", icon: <LayoutDashboard className="w-4 h-4" /> },
                  { title: "الإعدادات", icon: <Settings className="w-4 h-4" /> },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 justify-end w-full px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 font-medium text-sm transition-colors cursor-pointer dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-gray-200">
                    <span>{item.title}</span>
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 bg-[#fafafc] dark:bg-[#0f0f13] overflow-hidden flex flex-col gap-6">
               <div className="flex flex-row-reverse gap-6 h-full">
                  
                  {/* Right Column (Avatar + Purple Card) */}
                  <div className="w-[30%] min-w-[280px] flex flex-col gap-6">
                      <div className="flex items-center justify-start gap-3 flex-row-reverse">
                         <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-purple-100">
                            <img src="https://i.pravatar.cc/150?img=11" alt="avatar" className="w-full h-full object-cover" />
                         </div>
                         <div className="text-right">
                            <p className="font-extrabold text-gray-900 text-[15px] dark:text-white">مرحباً بك، 👋 أحمد</p>
                            <p className="text-[11px] text-gray-400 font-medium">إليك ملخص متجرك اليوم</p>
                         </div>
                      </div>

                      <div className="flex-1 bg-gradient-to-b from-purple-600 to-[#5B5EE5] rounded-3xl p-6 flex flex-col text-white shadow-xl relative overflow-hidden" style={{ direction: 'rtl' }}>
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="flex justify-between items-center mb-6 z-10">
                          <h3 className="font-extrabold text-lg flex items-center gap-2">
                             أداء متجرك <Sparkles className="w-5 h-5 text-purple-200" /> 
                          </h3>
                        </div>

                        <div className="bg-white/10 border border-white/20 backdrop-blur-md self-start px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 mb-8 z-10">
                          آخر 30 يوم <ChevronDown className="w-3 h-3" />
                        </div>

                        {/* Main Purple Chart Line */}
                        <div className="flex-1 w-full relative z-10 opacity-100 mt-2">
                           <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                             <path d="M0,80 L30,60 L60,80 L90,40 L120,60 L150,20 L200,30" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-lg"/>
                             <circle cx="30" cy="60" r="3" fill="white" stroke="#a855f7" strokeWidth="2" />
                             <circle cx="60" cy="80" r="3" fill="white" stroke="#a855f7" strokeWidth="2" />
                             <circle cx="90" cy="40" r="3" fill="white" stroke="#a855f7" strokeWidth="2" />
                             <circle cx="120" cy="60" r="3" fill="white" stroke="#a855f7" strokeWidth="2" />
                             <circle cx="150" cy="20" r="3" fill="white" stroke="#a855f7" strokeWidth="2" />
                             <circle cx="200" cy="30" r="4" fill="#a855f7" stroke="#fbbf24" strokeWidth="2" />
                           </svg>
                        </div>

                        {/* Footer Totals */}
                        <div className="mt-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 flex justify-between items-center z-10">
                          <div>
                            <p className="text-2xl font-black">15,230 ريال</p>
                            <p className="text-[10px] text-purple-200">إجمالي المبيعات</p>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <span className="text-amber-400 font-bold text-xs">⭐</span>
                          </div>
                        </div>
                      </div>
                  </div>

                  {/* Left Column (Stats + Bottom Charts) */}
                  <div className="flex-1 flex flex-col gap-6">
                      {/* Top 4 Stats Cards */}
                      <div className="grid grid-cols-4 gap-4 flex-row" style={{ direction: 'ltr' }}>
                          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex flex-col h-[140px] dark:bg-[#0f172a] dark:border-slate-800 text-right">
                             <div className="flex justify-between items-start mb-2">
                                <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                                   <BarChart3 className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500">معدل التحويل</span>
                             </div>
                             <p className="font-extrabold text-gray-900 text-xl tracking-tight mb-2">2.45%</p>
                             <div className="mt-auto flex justify-between items-end">
                                <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3 rotate-90"/> -2.1%</span>
                                <svg width="40" height="20" viewBox="0 0 40 20" className="overflow-visible"><path d="M0,15 L10,5 L20,10 L30,0 L40,10" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                             </div>
                          </div>

                          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex flex-col h-[140px] dark:bg-[#0f172a] dark:border-slate-800 text-right">
                             <div className="flex justify-between items-start mb-2">
                                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                   <ShoppingBag className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500">إجمالي المبيعات</span>
                             </div>
                             <p className="font-extrabold text-gray-900 text-xl tracking-tight mb-2">45,231</p>
                             <div className="mt-auto flex justify-between items-end">
                                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/> +13.3%</span>
                                <svg width="40" height="20" viewBox="0 0 40 20" className="overflow-visible"><path d="M0,15 L10,10 L20,15 L30,5 L40,0" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                             </div>
                          </div>

                          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex flex-col h-[140px] dark:bg-[#0f172a] dark:border-slate-800 text-right">
                             <div className="flex justify-between items-start mb-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                   <ShoppingCart className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500">إجمالي الطلبات</span>
                             </div>
                             <p className="font-extrabold text-gray-900 text-xl tracking-tight mb-2">320</p>
                             <div className="mt-auto flex justify-between items-end">
                                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/> +8.2%</span>
                                <svg width="40" height="20" viewBox="0 0 40 20" className="overflow-visible"><path d="M0,20 L10,10 L20,15 L30,5 L40,10" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                             </div>
                          </div>

                          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm flex flex-col h-[140px] dark:bg-[#0f172a] dark:border-slate-800 text-right">
                             <div className="flex justify-between items-start mb-2">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                   <Users className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-bold text-gray-500">إجمالي العملاء</span>
                             </div>
                             <p className="font-extrabold text-gray-900 text-xl tracking-tight mb-2">12,456</p>
                             <div className="mt-auto flex justify-between items-end">
                                <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"><ArrowUpRight className="w-3 h-3"/> +15.3%</span>
                                <svg width="40" height="20" viewBox="0 0 40 20" className="overflow-visible"><path d="M0,15 L10,5 L20,10 L30,0 L40,10" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                             </div>
                          </div>
                      </div>

                      {/* Bottom Row */}
                      <div className="flex gap-4 h-full flex-row" style={{ direction: 'rtl' }}>
                          <div className="flex-1 bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex flex-col dark:bg-[#0f172a] dark:border-slate-800">
                             <div className="flex justify-between items-center mb-6">
                                <h4 className="text-sm font-extrabold text-gray-800">أحدث الطلبات</h4>
                                <span className="text-[10px] font-bold text-purple-600">عرض الكل</span>
                             </div>
                             <div className="flex flex-col gap-4 flex-1">
                                <div className="flex flex-row-reverse justify-between items-center py-1">
                                  <div className="flex flex-row-reverse items-center gap-6 w-full text-xs font-bold font-mono justify-between px-2">
                                     <span className="text-gray-400">#1258</span>
                                     <span className="text-gray-900">محمد السليمي</span>
                                     <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-500">مكتمل</span>
                                     <span className="text-gray-900">450 ريال</span>
                                  </div>
                                </div>
                                <div className="flex flex-row-reverse justify-between items-center py-1">
                                  <div className="flex flex-row-reverse items-center gap-6 w-full text-xs font-bold font-mono justify-between px-2">
                                     <span className="text-gray-400">#1257</span>
                                     <span className="text-gray-900">سارة العتيبي</span>
                                     <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-500">قيد الشحن</span>
                                     <span className="text-gray-900">230 ريال</span>
                                  </div>
                                </div>
                                <div className="flex flex-row-reverse justify-between items-center py-1">
                                  <div className="flex flex-row-reverse items-center gap-6 w-full text-xs font-bold font-mono justify-between px-2">
                                     <span className="text-gray-400">#1256</span>
                                     <span className="text-gray-900">خالد الحربي</span>
                                     <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-500">ملغى</span>
                                     <span className="text-gray-900">150 ريال</span>
                                  </div>
                                </div>
                             </div>
                          </div>

                          <div className="w-[50%] bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex flex-col relative dark:bg-[#0f172a] dark:border-slate-800">
                             <div className="flex justify-between items-center mb-4">
                               <h4 className="text-sm font-extrabold text-gray-800">أداء المبيعات</h4>
                               <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1 border rounded-md px-2 py-1">آخر 30 يوم <ChevronDown className="w-3 h-3"/></span>
                             </div>
                             <div className="flex-1 relative w-full mt-4">
                                {/* SVG Line chart matching bottom left */}
                                <svg viewBox="0 0 200 80" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                 <defs>
                                   <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2"/>
                                     <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                                   </linearGradient>
                                 </defs>
                                 <path d="M0,70 L40,50 L80,70 L120,30 L160,50 L200,20 L200,80 L0,80 Z" fill="url(#grad2)"/>
                                 <path d="M0,70 L40,50 L80,70 L120,30 L160,50 L200,20" fill="none" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                 <circle cx="120" cy="30" r="3" fill="#8b5cf6" stroke="white" strokeWidth="1.5" />
                                 <rect x="100" y="5" width="40" height="15" rx="3" fill="#8b5cf6" />
                                 <text x="120" y="15" fontSize="6" fill="white" fontWeight="bold" textAnchor="middle">ريال 15,230</text>
                               </svg>
                               <div className="absolute bottom-[-10px] left-0 w-full flex justify-between text-[8px] text-gray-400 font-bold">
                                  <span>29 مايو</span>
                                  <span>8 مايو</span>
                                  <span>15 مايو</span>
                                  <span>22 مايو</span>
                                  <span>1 مايو</span>
                               </div>
                               <div className="absolute top-0 right-[-15px] h-full flex flex-col justify-between text-[8px] text-gray-400 font-bold items-end">
                                  <span>20K</span>
                                  <span>15K</span>
                                  <span>10K</span>
                                  <span>5K</span>
                                  <span>0</span>
                               </div>
                             </div>
                          </div>
                      </div>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* ===== FEATURES BADGES (Bottom of Hero) ===== */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mt-12 mb-8">
            <div className="flex flex-col items-center justify-center gap-3 text-center bg-white dark:bg-[#1a1a24] p-6 rounded-2xl border border-gray-100 hover:border-purple-200 dark:border-white/5 dark:hover:border-purple-800/40 shadow-sm transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center dark:bg-purple-900/30 dark:text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="font-bold text-gray-900 text-sm dark:text-white">يومان تجربة مجانية</p>
              <p className="text-xs text-gray-500 font-medium dark:text-gray-400">جرب المنصة بدون مخاطر</p>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-3 text-center bg-white dark:bg-[#1a1a24] p-6 rounded-2xl border border-gray-100 hover:border-purple-200 dark:border-white/5 dark:hover:border-purple-800/40 shadow-sm transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-50 text-fuchsia-600 flex items-center justify-center dark:bg-fuchsia-900/30 dark:text-fuchsia-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <p className="font-bold text-gray-900 text-sm dark:text-white">لا تحتاج بطاقة ائتمانية</p>
              <p className="text-xs text-gray-500 font-medium dark:text-gray-400">ابدأ مجاناً بدون أي رسوم</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 text-center bg-white dark:bg-[#1a1a24] p-6 rounded-2xl border border-gray-100 hover:border-purple-200 dark:border-white/5 dark:hover:border-purple-800/40 shadow-sm transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center dark:bg-emerald-900/30 dark:text-emerald-400">
                <Code2 className="w-6 h-6" />
              </div>
              <p className="font-bold text-gray-900 text-sm dark:text-white">بدون خبرة برمجية</p>
              <p className="text-xs text-gray-500 font-medium dark:text-gray-400">سهولة ومرونة في الاستخدام</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 text-center bg-white dark:bg-[#1a1a24] p-6 rounded-2xl border border-gray-100 hover:border-purple-200 dark:border-white/5 dark:hover:border-purple-800/40 shadow-sm transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-blue-900/30 dark:text-blue-400">
                <Headset className="w-6 h-6" />
              </div>
              <p className="font-bold text-gray-900 text-sm dark:text-white">دعم فني 24/7</p>
              <p className="text-xs text-gray-500 font-medium dark:text-gray-400">نحن هنا دائماً لمساعدتك</p>
            </div>
          </div>
        </div>
      </section>


      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-20 bg-[#f4f0ff] dark:bg-[#15151c] relative transition-colors overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-200/50 dark:bg-purple-900/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-purple-200/40 dark:bg-purple-900/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          {/* Heading */}
          <div className="text-center mb-8">
            <span className="text-purple-600 font-bold bg-white/80 dark:bg-purple-900/30 px-5 py-2 rounded-full text-sm inline-block mb-5 border border-purple-200 dark:border-purple-800/40 shadow-sm">لماذا Suriix ؟؟</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
              كل ما تحتاجه لبناء<br />
              <span className="text-purple-600">متجر ناجح</span>
            </h2>
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto leading-relaxed">
              من الأدوات الذكية إلى التصاميم الاحترافية، نوفر لك كل ما تحتاجه للتركيز على ما يهم حقاً: نمو متجرك.
            </p>
          </div>

          {/* ====== MOBILE: Feature Cards Grid ====== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden mt-8 mb-8">
            {[
              { icon: <Zap className="w-6 h-6" />, color: "purple", title: "سرعة فائقة", desc: "متجرك يعمل بأعلى سرعة تحميل لضمان تجربة رائعة" },
              { icon: <Palette className="w-6 h-6" />, color: "pink", title: "تصاميم احترافية", desc: "قوالب جاهزة بتصاميم عصرية وقابلة للتخصيص" },
              { icon: <BarChart4 className="w-6 h-6" />, color: "violet", title: "تحليلات ذكية", desc: "تقارير مفصّلة عن أداء متجرك ومبيعاتك" },
              { icon: <ShieldCheck className="w-6 h-6" />, color: "emerald", title: "أمان تام", desc: "حماية كاملة لبيانات متجرك وعملائك" },
              { icon: <Smartphone className="w-6 h-6" />, color: "blue", title: "متوافق مع الجوال", desc: "متجرك يبدو رائعاً على جميع الأجهزة" },
              { icon: <Headphones className="w-6 h-6" />, color: "orange", title: "دعم 24/7", desc: "فريق دعم متخصص لمساعدتك في أي وقت" },
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1a24] rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm flex items-start gap-4 text-right">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  f.color === 'purple' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/30' :
                  f.color === 'pink' ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/30' :
                  f.color === 'violet' ? 'bg-violet-50 text-violet-600 dark:bg-violet-900/30' :
                  f.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' :
                  f.color === 'blue' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30' :
                  'bg-orange-50 text-orange-600 dark:bg-orange-900/30'
                }`}>{f.icon}</div>
                <div>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-[15px] mb-1">{f.title}</h3>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ====== DESKTOP: Circular wheel ====== */}
          <div className="relative hidden lg:block mx-auto mt-8 mb-24" style={{ width: 900, height: 720 }}>

              {/* Outer dashed ring */}
              <div className="absolute rounded-full border-[2.5px] border-dashed border-purple-200 dark:border-purple-800/60"
                style={{ width: 440, height: 440, left: 230, top: 140 }} />

              {/* Inner soft ring */}
              <div className="absolute rounded-full border border-purple-200/40 dark:border-purple-800/30"
                style={{ width: 280, height: 280, left: 310, top: 220 }} />

              {/* Connecting dots on the ring: Top, Right, Bottom, Left */}
              <div className="absolute w-[16px] h-[16px] rounded-full bg-purple-500 ring-4 ring-white dark:ring-[#111118] shadow-sm z-10"
                style={{ left: 442, top: 132 }} />
              <div className="absolute w-[16px] h-[16px] rounded-full bg-pink-500 ring-4 ring-white dark:ring-[#111118] shadow-sm z-10"
                style={{ left: 662, top: 352 }} />
              <div className="absolute w-[16px] h-[16px] rounded-full bg-violet-500 ring-4 ring-white dark:ring-[#111118] shadow-sm z-10"
                style={{ left: 442, top: 572 }} />
              <div className="absolute w-[16px] h-[16px] rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#111118] shadow-sm z-10"
                style={{ left: 222, top: 352 }} />

              {/* CENTER: Suriix Logo */}
              <div className="absolute flex items-center justify-center z-20 group cursor-pointer"
                style={{ width: 140, height: 140, left: 380, top: 290 }}>
                {/* Glowing Aura */}
                <div className="absolute inset-0 rounded-full bg-purple-500/20 dark:bg-purple-900/40 blur-2xl group-hover:bg-purple-500/30 transition-all duration-500" />
                {/* Center Circle */}
                <div className="w-[110px] h-[110px] bg-white dark:bg-[#1a1a24] rounded-full shadow-[0_15px_30px_rgba(147,51,234,0.15)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-purple-100 dark:border-purple-800/40 flex items-center justify-center relative group-hover:scale-105 transition-transform duration-500">
                    <img src="/favicon.png" alt="Suriix Logo" className="w-[55px] h-[55px] object-contain drop-shadow-md group-hover:drop-shadow-lg transition-all duration-500" />
                </div>
              </div>

              {/* FEATURE 01: TOP */}
              <div className="absolute z-30 flex flex-col items-center text-center"
                style={{ width: 240, left: 330, top: -10 }}>
                <div className="w-14 h-14 rounded-[1.2rem] bg-purple-50 flex items-center justify-center mb-3">
                  <Zap className="w-7 h-7 text-purple-600" fill="currentColor" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-purple-600 font-extrabold text-[11px] font-mono bg-purple-100 px-2.5 py-0.5 rounded-full ring-2 ring-white dark:ring-[#111118]">01</span>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-[16px]">إنشاء سريع وسهل</h3>
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-bold block" style={{ maxWidth: 200 }}>
                  أنشئ متجرك في دقائق بدون أي تعقيد أو خبرة برمجية سابقة.
                </p>
              </div>

              {/* FEATURE 02: RIGHT */}
              <div className="absolute z-30 flex flex-col items-end text-right"
                style={{ width: 240, left: 690, top: 285 }}>
                <div className="w-14 h-14 rounded-[1.2rem] bg-pink-50 flex items-center justify-center mb-3">
                  <Palette className="w-7 h-7 text-pink-500" fill="currentColor" />
                </div>
                <div className="flex items-center justify-end gap-2 mb-2 w-full">
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-[16px]">تصاميم احترافية</h3>
                  <span className="text-pink-600 font-extrabold text-[11px] font-mono bg-pink-100 px-2.5 py-0.5 rounded-full ring-2 ring-white dark:ring-[#111118]">02</span>
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-bold block" style={{ maxWidth: 220 }}>
                  قوالب حديثة ومتجاوبة تعكس هوية علامتك التجارية بشكل مميز.
                </p>
              </div>

              {/* FEATURE 03: BOTTOM */}
              <div className="absolute z-30 flex flex-col items-center text-center"
                style={{ width: 240, left: 330, top: 600 }}>
                <div className="w-14 h-14 rounded-[1.2rem] bg-violet-50 flex items-center justify-center mb-3">
                  <LayoutDashboard className="w-7 h-7 text-violet-600" fill="currentColor" />
                </div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-violet-600 font-extrabold text-[11px] font-mono bg-violet-100 px-2.5 py-0.5 rounded-full ring-2 ring-white dark:ring-[#111118]">03</span>
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-[16px]">إدارة ذكية</h3>
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-bold block" style={{ maxWidth: 220 }}>
                  لوحة تحكم متكاملة لإدارة المنتجات، الطلبات والعملاء بسهولة تامة.
                </p>
              </div>

              {/* FEATURE 04: LEFT */}
              <div className="absolute z-30 flex flex-col items-start text-right"
                style={{ width: 210, left: 0, top: 285 }}>
                <div className="w-14 h-14 rounded-[1.2rem] bg-emerald-50 flex items-center justify-center mb-3">
                  <BarChart4 className="w-7 h-7 text-emerald-500" fill="currentColor" />
                </div>
                <div className="flex items-center gap-2 mb-2 w-full justify-start">
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-[16px] text-right">تحليلات وتقارير</h3>
                  <span className="text-emerald-600 font-extrabold text-[11px] font-mono bg-emerald-100 px-2.5 py-0.5 rounded-full ring-2 ring-white dark:ring-[#111118]">04</span>
                </div>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 font-bold block text-right" style={{ maxWidth: 210 }}>
                  تقارير دقيقة تساعدك على اتخاذ قرارات ذكية وتطوير متجرك.
                </p>
              </div>

          </div>

          {/* ====== MOBILE ====== */}
          <div className="lg:hidden flex flex-col gap-8 max-w-md mx-auto pt-8 pb-4 px-2">
            {[
              { num: '01', icon: <Zap className="w-6 h-6 text-purple-600" style={{ fill: 'currentColor' }} />, border: 'border-purple-100 dark:border-purple-900', title: 'إنشاء سريع وسهل', desc: 'أنشئ متجرك في دقائق بدون أي تعقيد أو خبرة برمجية سابقة.' },
              { num: '02', icon: <Palette className="w-6 h-6 text-pink-500" style={{ fill: 'currentColor' }} />, border: 'border-pink-100 dark:border-pink-900', title: 'تصاميم احترافية', desc: 'قوالب حديثة ومتجاوبة تعكس هوية علامتك التجارية بشكل مميز.' },
              { num: '03', icon: <LayoutDashboard className="w-6 h-6 text-violet-600" style={{ fill: 'currentColor' }} />, border: 'border-violet-100 dark:border-violet-900', title: 'إدارة ذكية', desc: 'لوحة تحكم متكاملة لإدارة المنتجات، الطلبات والعملاء بسهولة تامة.' },
              { num: '04', icon: <BarChart4 className="w-6 h-6 text-emerald-500" style={{ fill: 'currentColor' }} />, border: 'border-emerald-100 dark:border-emerald-900', title: 'تحليلات وتقارير', desc: 'تقارير دقيقة تساعدك على اتخاذ قرارات ذكية وتطوير متجرك.' },
            ].map((f, i) => (
              <div key={i} className="flex flex-row-reverse items-center gap-4 text-right">
                <div className={`w-14 h-14 rounded-full bg-white dark:bg-[#1d1d2a] border-2 ${f.border} shadow-md flex items-center justify-center shrink-0`}>
                  {f.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">{f.title}</h3>
                    <span className="text-gray-400 font-bold text-xs font-mono">{f.num}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>



      {/* ===== STATISTICS SECTION ===== */}
      <section className="relative z-20 -mb-10 lg:-mb-16 mt-16 px-4">
        <div className="max-w-6xl mx-auto rounded-[2.5rem] p-[3px] bg-gradient-to-r from-purple-100 to-white dark:from-purple-900/40 dark:to-white/5 relative shadow-xl shadow-purple-500/10">
          <div className="bg-gradient-to-l from-[#a855f7] via-[#c026d3] to-[#e879f9] rounded-[2.3rem] py-8 sm:py-10 px-4 sm:px-6 md:px-12 relative overflow-hidden h-full w-full shadow-inner">
             {/* Background Decals */}
             <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
             
             {/* Dotted pattern overlay */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
             
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-10 lg:gap-8 items-center relative z-10 w-full" dir="rtl">
                 
                 {/* Stat 1: Uptime */}
                 <div className="flex flex-col items-center justify-center text-center text-white space-y-3 relative lg:after:content-[''] lg:after:absolute lg:after:left-0 lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:w-px lg:after:h-16 lg:after:bg-white/20">
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1 shadow-lg border border-white/20 hover:scale-110 transition-transform duration-300">
                      <Zap className="w-7 h-7 text-white" />
                   </div>
                   <div className="flex items-center justify-center gap-1 font-mono">
                      <div className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">99.9</div>
                      <span className="text-2xl md:text-3xl font-extrabold">%</span>
                   </div>
                   <div className="text-white/90 font-bold text-sm md:text-base opacity-95 tracking-wide">وقت التشغيل</div>
                 </div>

                 {/* Stat 2: Happy Clients */}
                 <div className="flex flex-col items-center justify-center text-center text-white space-y-3 relative lg:after:content-[''] lg:after:absolute lg:after:left-0 lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:w-px lg:after:h-16 lg:after:bg-white/20">
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1 shadow-lg border border-white/20 hover:scale-110 transition-transform duration-300">
                      <Smile className="w-7 h-7 text-white" />
                   </div>
                   <div className="flex items-center justify-center gap-1 font-mono">
                      <div className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">27</div>
                      <span className="text-3xl md:text-4xl font-extrabold">+</span>
                   </div>
                   <div className="text-white/90 font-bold text-sm md:text-base opacity-95 tracking-wide">عميل سعيد</div>
                 </div>

                 {/* Stat 3: Orders Completed */}
                 <div className="flex flex-col items-center justify-center text-center text-white space-y-3 relative lg:after:content-[''] lg:after:absolute lg:after:left-0 lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:w-px lg:after:h-16 lg:after:bg-white/20">
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1 shadow-lg border border-white/20 hover:scale-110 transition-transform duration-300">
                      <FileText className="w-7 h-7 text-white" />
                   </div>
                   <div className="flex items-center justify-center gap-1 font-mono">
                      <div className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">480</div>
                      <span className="text-3xl md:text-4xl font-extrabold">+</span>
                   </div>
                   <div className="text-white/90 font-bold text-sm md:text-base opacity-95 tracking-wide">طلب تم تنفيذه</div>
                 </div>

                 {/* Stat 4: Active Stores */}
                 <div className="flex flex-col items-center justify-center text-center text-white space-y-3 relative">
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-1 shadow-lg border border-white/20 hover:scale-110 transition-transform duration-300">
                      <Store className="w-7 h-7 text-white" />
                   </div>
                   <div className="flex items-center justify-center gap-1 font-mono">
                      <div className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">35</div>
                      <span className="text-3xl md:text-4xl font-extrabold">+</span>
                   </div>
                   <div className="text-white/90 font-bold text-sm md:text-base opacity-95 tracking-wide">متجر نشط</div>
                 </div>

             </div>
          </div>
        </div>
      </section>

      {/* ===== TEMPLATES SECTION ===== */}
      <section id="templates" className="pt-32 pb-24 bg-[#f8f9fc] dark:bg-[#0f0f13] transition-colors relative overflow-hidden text-center z-10 w-full">
        
        {/* Background Decorative Graphic Elements */}
        {/* 1. Dotted grid on top left */}
        <div className="absolute top-[20%] left-[-2%] opacity-[0.03] dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #5b21b6 2px, transparent 2px)', backgroundSize: '16px 16px', width: '300px', height: '200px' }}></div>
        
        {/* 2. Concentric circle pattern on right */}
        <div className="absolute right-[5%] top-1/3 -translate-y-1/2 flex items-center justify-center pointer-events-none opacity-40 dark:opacity-20">
           <div className="w-[400px] h-[400px] border border-purple-200 dark:border-white/5 rounded-full absolute" />
           <div className="w-[300px] h-[300px] border border-purple-200 dark:border-white/5 rounded-full absolute" />
           <div className="w-[200px] h-[200px] border border-purple-200 dark:border-white/5 rounded-full absolute" />
           {/* Pink dot center */}
           <div className="w-4 h-4 bg-fuchsia-400 rounded-full shadow-[0_0_15px_rgba(232,121,249,0.8)] absolute z-10" />
        </div>
        
        {/* 3. Floating 3D Palette left side */}
        <div className="hidden lg:flex absolute left-[12%] top-[15%] transform -rotate-12 pointer-events-none animate-bounce" style={{ animationDuration: '4s' }}>
           <div className="w-[84px] h-[84px] bg-gradient-to-tr from-purple-500 to-purple-400 rounded-[1.5rem] shadow-[0_20px_35px_-10px_rgba(168,85,247,0.5)] border-b-4 border-r-4 border-purple-700 flex items-center justify-center hover:-rotate-6 transition-transform">
              <Palette className="w-10 h-10 text-white drop-shadow-sm" />
           </div>
        </div>

        {/* 4. Bottom-right soft purple blob overlay */}
        <div className="absolute -bottom-1/4 -right-1/4 w-[1000px] h-[600px] bg-gradient-to-tl from-purple-100/50 to-transparent dark:from-purple-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          
          <div className="mb-12">
            <span className="text-purple-700 dark:text-purple-300 font-extrabold bg-white dark:bg-purple-900/30 px-5 py-2 rounded-full text-sm inline-flex items-center justify-center gap-2 mb-6 border border-purple-100 dark:border-purple-800/40 shadow-sm relative">
               قوالب احترافية
               <Palette className="w-4 h-4 fill-purple-600" />
               <div className="absolute inset-0 bg-purple-600 opacity-5 rounded-full" />
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#111] dark:text-white mb-6 tracking-tight relative z-10">
              تصاميم جاهزة <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-purple-500 relative inline-block z-10">تناسب<div className="absolute -bottom-1 right-0 w-full h-[15px] bg-gradient-to-r from-purple-200 to-transparent rounded-full opacity-60 dark:opacity-30 -z-10"></div></span> كل مجال
            </h2>
            <p className="text-base font-bold md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              اختر من مجموعة واسعة من القوالب الاحترافية، وخصصها بهويتك،<br className="hidden md:block"/> وانطلق بمشروعك بثقة وسرعة.
            </p>
          </div>

          {/* Features Bar */}
          <div className="max-w-5xl mx-auto bg-white/90 dark:bg-[#1a1a24]/90 backdrop-blur-xl rounded-3xl md:rounded-full p-2 lg:p-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-15px_rgba(168,85,247,0.1)] border border-gray-100 dark:border-white/5 mb-16 relative overflow-hidden" dir="rtl">
             
             <div className="flex flex-col md:flex-row items-center justify-between divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-100 dark:divide-white/10 w-full">
                
                {/* Item 1 */}
                <div className="flex items-center justify-center md:justify-start gap-4 px-4 py-4 w-full group">
                   <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-800/20 group-hover:bg-purple-100 transition-colors">
                      <LayoutGrid className="w-5 h-5 text-purple-600" />
                   </div>
                   <span className="font-extrabold text-[#333] dark:text-white text-[15px]">تصاميم حديثة وجذابة</span>
                </div>
                
                {/* Item 2 */}
                <div className="flex items-center justify-center md:justify-start gap-4 px-4 py-4 w-full group">
                   <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 border border-green-100 dark:border-green-800/20 group-hover:bg-green-100 transition-colors">
                      <PenTool className="w-5 h-5 text-green-600" />
                   </div>
                   <span className="font-extrabold text-[#333] dark:text-white text-[15px]">قابلة للتخصيص بسهولة</span>
                </div>

                {/* Item 3 */}
                <div className="flex items-center justify-center md:justify-start gap-4 px-4 py-4 w-full group">
                   <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-800/20 group-hover:bg-orange-100 transition-colors">
                      <Smartphone className="w-5 h-5 text-orange-500" />
                   </div>
                   <span className="font-extrabold text-[#333] dark:text-white text-[15px]">متجاوبة مع جميع الأجهزة</span>
                </div>

                {/* Item 4 */}
                <div className="flex items-center justify-center md:justify-start gap-4 px-4 py-4 w-full group">
                   <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/20 group-hover:bg-blue-100 transition-colors">
                      <RefreshCcw className="w-5 h-5 text-blue-500" />
                   </div>
                   <span className="font-extrabold text-[#333] dark:text-white text-[15px]">تحديثات مستمرة</span>
                </div>

             </div>
          </div>

          {/* Templates Section - Coming Soon Minimal Decoration */}
          <div className="flex items-center justify-center gap-4 mt-20 mb-8 max-w-sm mx-auto">
             <div className="flex-1 h-px border-t border-dashed border-gray-300 dark:border-white/20 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-purple-600" />
             </div>
             <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white mt-1 px-2 whitespace-nowrap">قوالب قريباً</h3>
             <div className="flex-1 h-px border-t border-dashed border-gray-300 dark:border-white/20 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 bg-purple-600" />
             </div>
          </div>

        </div>
      </section>


      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-24 bg-[#fafafc] dark:bg-[#15151c] relative overflow-hidden transition-colors">
        {/* Background Decorative Blur Orbs */}
        <div className="absolute left-[-10%] bottom-[-10%] w-[500px] h-[500px] bg-purple-200/50 dark:bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute right-[-5%] top-[10%] w-[300px] h-[300px] bg-blue-100/50 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute right-[5%] top-[5%] grid grid-cols-4 gap-2 opacity-[0.15] dark:opacity-10 pointer-events-none">
          {[...Array(16)].map((_, i) => <div key={i} className="w-[5px] h-[5px] rounded-full bg-purple-600" />)}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 text-purple-600 font-extrabold bg-purple-100 dark:bg-purple-900/40 px-4 py-1.5 rounded-full text-sm mb-4">
              <span>آراء عملائنا</span>
              <MessageCircle className="w-4 h-4" fill="currentColor" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a1a24] dark:text-white mb-4">
              ماذا يقول عملاؤنا عن <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-fuchsia-500">Suriix</span>؟
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">نفخر بثقة عملائنا وتجاربهم الناجحة مع منصتنا.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* CARD 1 (Blue) - Fatima */}
            <div className="bg-white dark:bg-[#1a1a24] rounded-[2rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] dark:shadow-none border-[1.5px] border-transparent hover:border-blue-100 dark:border-white/5 relative flex flex-col justify-between overflow-hidden group transition-all duration-300">
               {/* Top subtle gradient */}
               <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-br-[100px] z-0 transition-transform duration-500 group-hover:scale-110" />
               {/* Bottom Border Gradient */}
               <div className="absolute bottom-0 right-0 w-full h-[5px] bg-gradient-to-r from-blue-400 to-sky-400 opacity-90" />

               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-8 flex-row-reverse">
                   <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-800/40">
                      <Star className="w-7 h-7" />
                   </div>
                   <div className="text-blue-500/80 dark:text-blue-400/80">
                      <Quote className="w-12 h-12 rotate-180" fill="currentColor" />
                   </div>
                 </div>
                 
                 <p className="text-[#3a3a4c] dark:text-gray-300 text-[15px] font-extrabold leading-[1.8] text-right mb-8">
                   أفضل منصة لإنشاء المتاجر الإلكترونية. سهولة الاستخدام والدعم السريع جداً.
                 </p>
               </div>
               
               <div className="relative z-10 flex flex-col mt-auto">
                 <div className="h-px w-16 bg-blue-200 dark:bg-blue-900/40 mx-auto mb-6" />
                 
                 <div className="flex items-center justify-center gap-4">
                   <img src="https://i.pravatar.cc/150?img=5" alt="فاطمة العتيبي" className="w-14 h-14 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900/30 shadow-sm" />
                   <div className="text-right">
                     <h4 className="font-extrabold text-[#1a1a24] dark:text-white mb-0.5 text-lg">فاطمة العتيبي</h4>
                     <p className="text-[13px] text-gray-500 font-bold">متجر عطور</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* CARD 2 (Purple) - Ahmed */}
            <div className="bg-white dark:bg-[#1a1a24] rounded-[2rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] dark:shadow-none border-[1.5px] border-transparent hover:border-purple-100 dark:border-white/5 relative flex flex-col justify-between overflow-hidden group transition-all duration-300">
               <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent rounded-br-[100px] z-0 transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute bottom-0 right-0 w-full h-[5px] bg-gradient-to-r from-purple-500 to-fuchsia-400 opacity-90" />

               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-8 flex-row-reverse">
                   <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 border border-purple-100 dark:border-purple-800/40">
                      <BarChart4 className="w-7 h-7" />
                   </div>
                   <div className="text-purple-500/80 dark:text-purple-400/80">
                      <Quote className="w-12 h-12 rotate-180" fill="currentColor" />
                   </div>
                 </div>
                 
                 <p className="text-[#3a3a4c] dark:text-gray-300 text-[15px] font-extrabold leading-[1.8] text-right mb-8">
                   تصميم المتجر احترافي، والمبيعات زادت بشكل ملحوظ بعد الانتقال إلى المنصة.
                 </p>
               </div>
               
               <div className="relative z-10 flex flex-col mt-auto">
                 <div className="h-px w-16 bg-purple-200 dark:bg-purple-900/40 mx-auto mb-6" />
                 
                 <div className="flex items-center justify-center gap-4">
                   <img src="https://i.pravatar.cc/150?img=12" alt="أحمد السبيعي" className="w-14 h-14 rounded-full object-cover border-2 border-purple-100 dark:border-purple-900/30 shadow-sm" />
                   <div className="text-right">
                     <h4 className="font-extrabold text-[#1a1a24] dark:text-white mb-0.5 text-lg">أحمد السبيعي</h4>
                     <p className="text-[13px] text-gray-500 font-bold">متجر إلكترونيات</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* CARD 3 (Orange) - Sara */}
            <div className="bg-white dark:bg-[#1a1a24] rounded-[2rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] dark:shadow-none border-[1.5px] border-transparent hover:border-orange-100 dark:border-white/5 relative flex flex-col justify-between overflow-hidden group transition-all duration-300">
               <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-transparent dark:from-orange-900/20 dark:to-transparent rounded-br-[100px] z-0 transition-transform duration-500 group-hover:scale-110" />
               <div className="absolute bottom-0 right-0 w-full h-[5px] bg-gradient-to-r from-orange-400 to-pink-500 opacity-90" />

               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-8 flex-row-reverse">
                   <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 border border-orange-100 dark:border-orange-800/40">
                      <ShoppingBag className="w-7 h-7" />
                   </div>
                   <div className="text-orange-500/80 dark:text-orange-400/80">
                      <Quote className="w-12 h-12 rotate-180" fill="currentColor" />
                   </div>
                 </div>
                 
                 <p className="text-[#3a3a4c] dark:text-gray-300 text-[15px] font-extrabold leading-[1.8] text-right mb-8">
                   كل الأدوات التي أحتاجها في مكان واحد. أنصح بها بشدة لأي صاحب متجر.
                 </p>
               </div>
               
               <div className="relative z-10 flex flex-col mt-auto">
                 <div className="h-px w-16 bg-orange-200 dark:bg-orange-900/40 mx-auto mb-6" />
                 
                 <div className="flex items-center justify-center gap-4">
                   <img src="https://i.pravatar.cc/150?img=9" alt="سارة محمد" className="w-14 h-14 rounded-full object-cover border-2 border-orange-100 dark:border-orange-900/30 shadow-sm" />
                   <div className="text-right">
                     <h4 className="font-extrabold text-[#1a1a24] dark:text-white mb-0.5 text-lg">سارة محمد</h4>
                     <p className="text-[13px] text-gray-500 font-bold">متجر أزياء</p>
                   </div>
                 </div>
               </div>
            </div>

          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-12 gap-2">
             <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-white/10 transition-colors hover:bg-gray-300 cursor-pointer" />
             <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-white/10 transition-colors hover:bg-gray-300 cursor-pointer" />
             <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-colors cursor-pointer" />
          </div>
          
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 bg-white dark:bg-[#15151c] relative overflow-hidden transition-colors">
        
        {/* Floating spheres in background outside the card */}
        <div className="absolute top-10 left-[10%] w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-600 blur-[2px] opacity-60 dark:opacity-40" style={{ filter: 'drop-shadow(0 10px 15px rgba(168,85,247,0.4))' }} />
        <div className="absolute bottom-10 right-[15%] w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-600 blur-[2px] opacity-60 dark:opacity-40" style={{ filter: 'drop-shadow(0 15px 25px rgba(168,85,247,0.5))' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           
           <div className="bg-[#fcfcff] dark:bg-[#1a1a24] rounded-[2.5rem] shadow-[0_15px_60px_rgba(168,85,247,0.06)] dark:shadow-none border-[1.5px] border-purple-50 dark:border-white/5 relative overflow-hidden h-auto min-h-[400px] flex flex-col items-center justify-center py-16 px-6">
              
              {/* === BACKGROUND DECORATIONS === */}
              {/* Right decorative wave/blob */}
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-purple-200/60 to-purple-50/0 dark:from-purple-900/40 dark:to-transparent rounded-tl-[200px] pointer-events-none" />
              {/* Left decorative wave/blob */}
              <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-gradient-to-br from-purple-100/50 to-transparent dark:from-purple-900/30 rounded-br-[150px] pointer-events-none" />

              {/* Top-left dot grid */}
              <div className="absolute top-10 left-10 grid grid-cols-4 gap-2 opacity-20 pointer-events-none">
                {[...Array(16)].map((_, i) => <div key={i} className="w-[4px] h-[4px] rounded-full bg-gray-500 dark:bg-gray-400" />)}
              </div>
              
              {/* Bottom scattered dots left/right */}
              <div className="absolute bottom-20 left-[30%] grid grid-cols-4 gap-2 opacity-20 pointer-events-none">
                {[...Array(8)].map((_, i) => <div key={i} className="w-[3px] h-[3px] rounded-full bg-purple-500" />)}
              </div>
              <div className="absolute bottom-20 right-[30%] grid grid-cols-4 gap-2 opacity-20 pointer-events-none">
                {[...Array(8)].map((_, i) => <div key={i} className="w-[3px] h-[3px] rounded-full bg-purple-500" />)}
              </div>

              {/* LEFT FLOATING ELEMENTS (Simulating the 3D icons) */}
              <div className="absolute left-[5%] xl:left-[10%] top-1/2 -translate-y-1/2 w-[200px] h-[200px] pointer-events-none hidden md:block">
                 {/* Floating Sparkle/Star */}
                 <div className="absolute top-0 left-10 text-purple-400 rotate-12 drop-shadow-lg opacity-80">
                    <Sparkles className="w-8 h-8" fill="currentColor" />
                 </div>
                 {/* Floating Chart Card */}
                 <div className="absolute top-6 right-0 bg-white/80 dark:bg-[#252532]/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white dark:border-white/10 -rotate-12 transition-transform duration-500 hover:rotate-0">
                    <BarChart4 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                 </div>
                 {/* Floating Cart Card */}
                 <div className="absolute bottom-10 right-4 bg-white/80 dark:bg-[#252532]/80 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white dark:border-white/10 rotate-12 transition-transform duration-500 hover:rotate-0">
                    <ShoppingCart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                 </div>
                 
                 {/* Fake 3D Brain/Pedestal (using concentric glowing ellipses) */}
                 <div className="absolute bottom-0 left-4 w-32 h-10 bg-purple-200/50 dark:bg-purple-900/50 rounded-[100%] shadow-[inset_0_-5px_15px_rgba(168,85,247,0.2)] flex items-center justify-center">
                    <div className="w-24 h-6 bg-purple-300/60 dark:bg-purple-800/60 rounded-[100%] shadow-[inset_0_-2px_5px_rgba(168,85,247,0.3)] flex items-center justify-center">
                       <div className="w-16 h-4 bg-white/50 dark:bg-white/10 rounded-[100%]" />
                    </div>
                    {/* Placeholder for Brain */}
                    <div className="absolute bottom-6 w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-fuchsia-600 blur-[2px] opacity-40 mix-blend-multiply dark:mix-blend-screen" />
                    <Star className="absolute bottom-10 w-16 h-16 text-purple-500/80 fill-current drop-shadow-2xl" />
                 </div>
              </div>


              {/* === MAIN CONTENT === */}
              <div className="relative z-20 flex flex-col items-center text-center max-w-2xl mx-auto">
                 
                 {/* Rocket Badge */}
                 <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-400" />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 p-[2px] shadow-[0_10px_25px_rgba(168,85,247,0.4)]">
                       <div className="w-full h-full rounded-full bg-white dark:bg-[#1a1a24] flex items-center justify-center overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-fuchsia-600/20" />
                         <Rocket className="w-8 h-8 text-purple-600 dark:text-purple-400 fill-current -translate-y-0.5 translate-x-0.5" />
                       </div>
                    </div>
                    <div className="w-8 h-px bg-gradient-to-l from-transparent to-purple-400" />
                 </div>

                 {/* Headings */}
                 <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                    جاهز لتبدأ رحلتك في <span className="text-purple-600 dark:text-purple-400">التجارة الذكية؟</span>
                 </h2>
                 <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 font-bold">
                    انضم إلى آلاف التجار وابدأ متجرك الآن <span className="text-purple-600 dark:text-purple-400">مجاناً.</span>
                 </p>
                 
                 {/* CTA Button */}
                 <Link to="/create-store" className="relative z-10 inline-flex items-center justify-center space-x-3 space-x-reverse bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-10 py-4 rounded-full font-bold text-[17px] shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.6)] transition-all hover:scale-[1.03] group">
                    <span>ابدأ الآن</span>
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                 </Link>

              </div>
           </div>
        </div>
      </section>


      {/* ===== FOOTER ===== */}
      <footer className="py-24 bg-white dark:bg-[#15151c] relative overflow-hidden transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="bg-[#fcfcff] dark:bg-[#1a1a24] rounded-[3rem] shadow-[0_15px_60px_rgba(168,85,247,0.06)] dark:shadow-none border-[1.5px] border-purple-50 dark:border-white/5 relative overflow-hidden h-auto flex flex-col pt-20 px-6 lg:px-20 pb-8">
              
              {/* Background Decorations */}
              <div className="absolute top-10 left-10 grid grid-cols-4 gap-2 opacity-20 pointer-events-none">
                {[...Array(16)].map((_, i) => <div key={i} className="w-[4px] h-[4px] rounded-full bg-gray-400" />)}
              </div>
              <div className="absolute bottom-0 right-[-100px] w-[500px] h-[300px] bg-gradient-to-tl from-purple-200/40 to-transparent dark:from-purple-900/20 rounded-tl-[200px] pointer-events-none" />
              {/* Overlay waves for right side */}
              <svg className="absolute bottom-0 right-0 w-[500px] h-[300px] pointer-events-none opacity-[0.03] dark:opacity-[0.02]" viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M500 300C350 300 200 250 100 150C0 50 0 0 0 0" stroke="currentColor" strokeWidth="2" />
                 <path d="M500 250C380 250 250 200 150 100C50 0 0 0 0 0" stroke="currentColor" strokeWidth="2" />
                 <path d="M500 200C400 200 280 150 180 50C80 -50 0 0 0 0" stroke="currentColor" strokeWidth="2" />
              </svg>

              {/* Links and Logo Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16 relative z-10">
                 
                 {/* COL 1: Logo & Socials */}
                 <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-6">
                    <div className="flex items-center space-x-2 space-x-reverse justify-center md:justify-end cursor-pointer">
                      <span className="font-extrabold text-3xl text-gray-900 dark:text-white mt-1 relative">
                        Suriix
                      </span>
                      <img src="/favicon.png" alt="Suriix Logo" className="w-10 h-10 object-contain drop-shadow-md" />
                    </div>
                    <p className="text-[#3a3a4c] dark:text-gray-400 text-[15px] font-bold leading-[1.8] max-w-[220px]">
                      منصة متكاملة لإدارة متجرك الإلكتروني بسهولة واحترافية
                    </p>
                    <div className="flex items-center justify-center md:justify-end gap-3 pt-2">
                       {/* Facebook */}
                       <a href="https://www.facebook.com/profile.php?id=61591929566379" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all hover:scale-110">
                         <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>
                       </a>
                       {/* Instagram */}
                       <a href="https://www.instagram.com/lure_aco/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all hover:scale-110">
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                       </a>
                       {/* WhatsApp */}
                       <a href="https://wa.me/967780930635" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all hover:scale-110">
                         <svg className="w-[22px] h-[22px]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                       </a>
                    </div>
                 </div>
                 
                 {/* COL 2: Company */}
                 <div className="flex flex-col items-center md:items-end text-center md:text-right">
                    <div className="inline-flex flex-col items-end mb-8 relative">
                       <h4 className="font-extrabold text-[#1a1a24] dark:text-white text-xl">الشركة</h4>
                       <div className="absolute -bottom-3 right-0 w-8 h-[2.5px] bg-purple-500 rounded-full" />
                    </div>
                    <ul className="space-y-4 text-[15px] text-gray-500 dark:text-gray-400 font-bold w-full flex flex-col items-center md:items-end">
                      <li>
                        <Link to="/about" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>عن المنصة</span>
                           <Smile className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                      <li>
                        <Link to="/blog" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>المدونة</span>
                           <PenTool className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                      <li>
                        <Link to="/careers" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>وظائف</span>
                           <Briefcase className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                      <li>
                        <Link to="/contact" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>تواصل معنا</span>
                           <Mail className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                    </ul>
                 </div>

                 {/* COL 3: Support */}
                 <div className="flex flex-col items-center md:items-end text-center md:text-right">
                    <div className="inline-flex flex-col items-end mb-8 relative">
                       <h4 className="font-extrabold text-[#1a1a24] dark:text-white text-xl">الدعم</h4>
                       <div className="absolute -bottom-3 right-0 w-8 h-[2.5px] bg-purple-500 rounded-full" />
                    </div>
                    <ul className="space-y-4 text-[15px] text-gray-500 dark:text-gray-400 font-bold w-full flex flex-col items-center md:items-end">
                      <li>
                        <Link to="/help" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>مركز المساعدة</span>
                           <svg className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        </Link>
                      </li>
                      <li>
                        <Link to="/faq" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>الأسئلة الشائعة</span>
                           <MessageCircle className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                      <li>
                        <Link to="/privacy" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>سياسة الخصوصية</span>
                           <ShieldCheck className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                      <li>
                        <Link to="/terms" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>الشروط والأحكام</span>
                           <FileText className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                    </ul>
                 </div>

                 {/* COL 4: Resources */}
                 <div className="flex flex-col items-center md:items-end text-center md:text-right">
                    <div className="inline-flex flex-col items-end mb-8 relative">
                       <h4 className="font-extrabold text-[#1a1a24] dark:text-white text-xl">الموارد</h4>
                       <div className="absolute -bottom-3 right-0 w-8 h-[2.5px] bg-purple-500 rounded-full" />
                    </div>
                    <ul className="space-y-4 text-[15px] text-gray-500 dark:text-gray-400 font-bold w-full flex flex-col items-center md:items-end">
                      <li>
                        <Link to="/guide" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>دليل البدء</span>
                           <Rocket className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                      <li>
                        <Link to="/videos" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>فيديوهات تعليمية</span>
                           <svg className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
                        </Link>
                      </li>
                      <li>
                        <Link to="/partners" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>شركاء النجاح</span>
                           <Users className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                      <li>
                        <Link to="/community" className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-end gap-3 w-full group">
                           <span>المجتمع</span>
                           <Users className="w-[18px] h-[18px] text-purple-600 transition-transform group-hover:scale-110" />
                        </Link>
                      </li>
                    </ul>
                 </div>

              </div>
              
              {/* Divider & Copyright */}
              <div className="relative border-t border-purple-100 dark:border-purple-900/40 pt-8 mt-4 flex justify-center text-[13px] text-gray-500 dark:text-gray-400 font-bold w-full mx-auto max-w-4xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fcfcff] dark:bg-[#1a1a24] p-3">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-[0_5px_15px_rgba(168,85,247,0.4)]">
                      <ShieldCheck className="w-4 h-4 text-white" />
                   </div>
                </div>
                <p>جميع الحقوق محفوظة. 2024 Suriix ©</p>
              </div>

           </div>
        </div>
      </footer>

    </div>
  );
};

// ===== SVG Icon Components =====
const ShoppingCartIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const HeartIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const TshirtIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
  </svg>
);

const ShoeIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"/>
    <path d="M10 10 2 15"/>
    <path d="M10 10h4"/>
    <path d="M14 10c0-2.8 2.2-5 5-5h1v5h-6z"/>
  </svg>
);

const BagIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <path d="M3 6h18"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const CreditCardIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="14" x="2" y="5" rx="2"/>
    <line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);

const ShoppingBagIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
    <path d="M3 6h18"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const BarchartIcon = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

export default Index;
