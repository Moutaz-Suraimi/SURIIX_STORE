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
  Mail, Moon, Sun, Menu, X, ShieldCheck, CreditCard, ShoppingCart, ShoppingBag
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

        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 relative w-full pt-32 pb-12">
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
                <h1 className="text-[44px] md:text-5xl lg:text-[70px] font-extrabold text-slate-900 leading-[1.2] md:leading-[1.2] tracking-tight dark:text-white pb-3">
                  أنشئ متجرك الذكي
                  <br />
                  <span className="text-[#a855f7]">
                    في دقائق، وابدأ
                  </span>
                  <br />
                  <span className="text-[#a855f7]">
                    البيع
                  </span>
                  <br />
                  <span className="text-[#a855f7]">
                    باحترافية.
                  </span>
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

          {/* ===== DASHBOARD MOCKUP ===== */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="w-full max-w-[1200px] mx-auto h-[550px] mt-16 bg-white rounded-3xl border border-gray-100 flex flex-row overflow-hidden z-20 shadow-[0_40px_100px_rgba(139,92,246,0.15)] relative dark:bg-[#0f172a] dark:border-slate-800"
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
      <section id="features" className="py-24 bg-white dark:bg-[#15151c] relative transition-colors">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden lg:overflow-x-visible">
          
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-24 relative z-10">
            <span className="text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/20 px-5 py-2 rounded-full text-sm inline-block mb-6 border border-purple-100 dark:border-purple-800/40">لماذا Suriix ؟؟</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
               كل ما تحتاجه لبناء <br className="hidden md:block" />
               <span className="text-purple-600">متجر ناجح</span>
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium pb-4">
              من الأدوات الذكية إلى التصاميم الاحترافية، نوفر لك كل ما تحتاجه للتركيز على ما يهم حقاً: نمو متجرك.
            </p>
          </div>

          {/* Desktop Circular Layout (hidden on mobile, visible lg) */}
          <div className="relative hidden lg:flex h-[760px] mx-auto items-center justify-center mt-8 mb-16 pointer-events-none" style={{ width: '100%' }}>
             
             {/* Abstract Origin Point at absolute center */}
             <div className="absolute left-1/2 top-1/2 w-0 h-0 flex items-center justify-center">
             
                 {/* 1. The Dashed Ring (r = 180px -> w=360px) */}
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] rounded-full border-[1.5px] border-dashed border-purple-200 dark:border-white/10 -z-10" />

                 {/* 2. The Center Graphic */}
                 <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[11rem] h-[11rem] bg-gradient-to-br from-[#aa48f8] to-[#7f34f8] rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(155,77,255,0.6)] flex items-center justify-center text-white z-10 transform hover:scale-105 transition-transform duration-700 ease-out group pointer-events-auto">
                     <span className="font-display font-extrabold text-[5.5rem] opacity-95 drop-shadow-xl select-none" style={{ textShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>S</span>
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     <div className="absolute -top-3 -right-3 w-9 h-9 bg-gray-900 rounded-full border-4 border-white dark:border-[#15151c] shadow-lg flex items-center justify-center -z-10 group-hover:-translate-y-2 transition-transform duration-500">
                        <ShoppingBag className="w-4 h-4 text-white" />
                     </div>
                 </div>

                 {/* ========== CARD 01: TOP ========== */}
                 {/* Dot at y=-180px */}
                 <div className="absolute left-1/2 bottom-[180px] -translate-x-1/2 translate-y-1/2 w-3.5 h-3.5 rounded-full bg-purple-500 ring-[6px] ring-white dark:ring-[#15151c] z-10" />
                 {/* Connecting line UP to card (Length: 50px) */}
                 <div className="absolute left-1/2 bottom-[180px] -translate-x-1/2 w-[1.5px] h-[50px] border-l-[1.5px] border-dashed border-purple-200 dark:border-white/10" />
                 {/* The Card (Bottom edge touching y=-230px) */}
                 <div className="absolute bottom-[230px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
                     <div className="w-[310px] bg-white dark:bg-[#1a1a24] rounded-[2rem] p-4 flex flex-row items-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-purple-900/10 border border-gray-50 dark:border-white/5 relative group hover:-translate-y-2 transition-transform duration-500 ease-out text-right cursor-default">
                        <div className="absolute -top-3 right-8 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-3.5 py-1.5 rounded-full font-extrabold text-[11px] ring-4 ring-white dark:ring-[#1a1a24]">01</div>
                        <div className="flex-1 pr-4 pl-0">
                           <h3 className="font-extrabold text-[15px] text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">إنشاء سريع وسهل</h3>
                           <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold block">أنشئ متجرك في دقائق بدون أي تعقيد أو خبرة برمجية سابقة.</p>
                        </div>
                        <div className="w-[60px] h-[60px] rounded-[1.5rem] bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 ml-2">
                           <Zap className="w-7 h-7 fill-purple-600 dark:fill-purple-400" />
                        </div>
                     </div>
                 </div>

                 {/* ========== CARD 03: BOTTOM ========== */}
                 {/* Dot at y=180px */}
                 <div className="absolute left-1/2 top-[180px] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-500 ring-[6px] ring-white dark:ring-[#15151c] z-10" />
                 {/* Connecting line DOWN to card (Length: 50px) */}
                 <div className="absolute left-1/2 top-[180px] -translate-x-1/2 w-[1.5px] h-[50px] border-l-[1.5px] border-dashed border-blue-200 dark:border-white/10" />
                 {/* The Card (Top edge touching y=230px) */}
                 <div className="absolute top-[230px] left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
                     <div className="w-[310px] bg-white dark:bg-[#1a1a24] rounded-[2rem] p-4 flex flex-row items-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-blue-900/10 border border-gray-50 dark:border-white/5 relative group hover:translate-y-2 transition-transform duration-500 ease-out text-right cursor-default">
                        <div className="absolute -top-3 right-8 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-3.5 py-1.5 rounded-full font-extrabold text-[11px] ring-4 ring-white dark:ring-[#1a1a24]">03</div>
                        <div className="flex-1 pr-4 pl-0">
                           <h3 className="font-extrabold text-[15px] text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">إدارة ذكية</h3>
                           <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold block">لوحة تحكم متكاملة لإدارة المنتجات، الطلبات والعملاء بسهولة تامة.</p>
                        </div>
                        <div className="w-[60px] h-[60px] rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0 ml-2">
                           <LayoutDashboard className="w-7 h-7 fill-blue-500 dark:fill-blue-400" />
                        </div>
                     </div>
                 </div>

                 {/* ========== CARD 02: RIGHT ========== */}
                 <div className="absolute top-1/2 right-[-180px] -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-pink-500 ring-[6px] ring-white dark:ring-[#15151c] z-10" />
                 <div className="absolute top-1/2 right-[-180px] -translate-y-1/2 w-[60px] h-[1.5px] border-t-[1.5px] border-dashed border-pink-200 dark:border-white/10" />
                 <div className="absolute top-1/2 left-[240px] -translate-y-1/2 z-20 pointer-events-auto">
                     <div className="w-[310px] bg-white dark:bg-[#1a1a24] rounded-[2rem] p-4 flex flex-row items-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-pink-900/10 border border-gray-50 dark:border-white/5 relative group hover:translate-x-2 transition-transform duration-500 ease-out text-right cursor-default">
                        <div className="absolute -top-3 right-8 bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 px-3.5 py-1.5 rounded-full font-extrabold text-[11px] ring-4 ring-white dark:ring-[#1a1a24]">02</div>
                        <div className="flex-1 pr-4 pl-0">
                           <h3 className="font-extrabold text-[15px] text-gray-900 dark:text-white mb-2 group-hover:text-pink-600 transition-colors">تصاميم احترافية</h3>
                           <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold block">قوالب حديثة ومتجاوبة تعكس هوية علامتك التجارية بشكل مميز.</p>
                        </div>
                        <div className="w-[60px] h-[60px] rounded-[1.5rem] bg-pink-50 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400 flex items-center justify-center shrink-0 ml-2">
                           <Palette className="w-7 h-7 fill-pink-500 dark:fill-pink-400" />
                        </div>
                     </div>
                 </div>

                 {/* ========== CARD 04: LEFT ========== */}
                 <div className="absolute top-1/2 left-[-180px] -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-[6px] ring-white dark:ring-[#15151c] z-10" />
                 <div className="absolute top-1/2 left-[-180px] -translate-y-1/2 w-[60px] h-[1.5px] border-t-[1.5px] border-dashed border-emerald-200 dark:border-white/10 -translate-x-[100%]" />
                 <div className="absolute top-1/2 right-[240px] -translate-y-1/2 z-20 pointer-events-auto">
                     <div className="w-[310px] bg-white dark:bg-[#1a1a24] rounded-[2rem] p-4 flex flex-row items-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-emerald-900/10 border border-gray-50 dark:border-white/5 relative group hover:-translate-x-2 transition-transform duration-500 ease-out text-right cursor-default">
                        <div className="absolute -top-3 right-8 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-3.5 py-1.5 rounded-full font-extrabold text-[11px] ring-4 ring-white dark:ring-[#1a1a24]">04</div>
                        <div className="flex-1 pr-4 pl-0">
                           <h3 className="font-extrabold text-[15px] text-gray-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">تحليلات وتقارير</h3>
                           <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-bold block">تقارير دقيقة تساعدك على اتخاذ قرارات ذكية وتطوير متجرك.</p>
                        </div>
                        <div className="w-[60px] h-[60px] rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0 ml-2">
                           <BarChart4 className="w-7 h-7 fill-emerald-500 dark:fill-emerald-400" />
                        </div>
                     </div>
                 </div>

             </div>
          </div>

          {/* Mobile Linear Layout (visible only on mobile/tablet) */}
          <div className="lg:hidden flex flex-col gap-6 w-full max-w-md mx-auto z-20 relative px-4 mt-8">
             {/* Card 01 */}
             <div className="w-full bg-white dark:bg-[#1a1a24] rounded-[2rem] p-5 flex flex-row items-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-purple-900/10 border border-gray-50 dark:border-white/5 relative group transition-transform duration-300 text-right cursor-default">
                <div className="absolute -top-3 right-8 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 px-4 py-1.5 rounded-full font-extrabold text-[11px] ring-4 ring-white dark:ring-[#1a1a24]">01</div>
                <div className="flex-1 pr-4 pl-2">
                   <h3 className="font-extrabold text-[16px] text-gray-900 dark:text-white mb-2">إنشاء سريع وسهل</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold block">أنشئ متجرك في دقائق بدون أي تعقيد أو خبرة برمجية سابقة.</p>
                </div>
                <div className="w-[65px] h-[65px] rounded-[1.5rem] bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 ml-2">
                   <Zap className="w-8 h-8 fill-purple-600 dark:fill-purple-400" />
                </div>
             </div>

             {/* Card 02 */}
             <div className="w-full bg-white dark:bg-[#1a1a24] rounded-[2rem] p-5 flex flex-row items-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-pink-900/10 border border-gray-50 dark:border-white/5 relative group transition-transform duration-300 text-right cursor-default">
                <div className="absolute -top-3 right-8 bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300 px-4 py-1.5 rounded-full font-extrabold text-[11px] ring-4 ring-white dark:ring-[#1a1a24]">02</div>
                <div className="flex-1 pr-4 pl-2">
                   <h3 className="font-extrabold text-[16px] text-gray-900 dark:text-white mb-2">تصاميم احترافية</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold block">قوالب حديثة ومتجاوبة تعكس هوية علامتك التجارية بشكل مميز.</p>
                </div>
                <div className="w-[65px] h-[65px] rounded-[1.5rem] bg-pink-50 dark:bg-pink-900/30 text-pink-500 dark:text-pink-400 flex items-center justify-center shrink-0 ml-2">
                   <Palette className="w-8 h-8 fill-pink-500 dark:fill-pink-400" />
                </div>
             </div>

             {/* Card 03 */}
             <div className="w-full bg-white dark:bg-[#1a1a24] rounded-[2rem] p-5 flex flex-row items-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-blue-900/10 border border-gray-50 dark:border-white/5 relative group transition-transform duration-300 text-right cursor-default">
                <div className="absolute -top-3 right-8 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full font-extrabold text-[11px] ring-4 ring-white dark:ring-[#1a1a24]">03</div>
                <div className="flex-1 pr-4 pl-2">
                   <h3 className="font-extrabold text-[16px] text-gray-900 dark:text-white mb-2">إدارة ذكية</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold block">لوحة تحكم متكاملة لإدارة المنتجات، الطلبات والعملاء بسهولة تامة.</p>
                </div>
                <div className="w-[65px] h-[65px] rounded-[1.5rem] bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0 ml-2">
                   <LayoutDashboard className="w-8 h-8 fill-blue-500 dark:fill-blue-400" />
                </div>
             </div>

             {/* Card 04 */}
             <div className="w-full bg-white dark:bg-[#1a1a24] rounded-[2rem] p-5 flex flex-row items-center shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] dark:shadow-emerald-900/10 border border-gray-50 dark:border-white/5 relative group transition-transform duration-300 text-right cursor-default">
                <div className="absolute -top-3 right-8 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-4 py-1.5 rounded-full font-extrabold text-[11px] ring-4 ring-white dark:ring-[#1a1a24]">04</div>
                <div className="flex-1 pr-4 pl-2">
                   <h3 className="font-extrabold text-[16px] text-gray-900 dark:text-white mb-2">تحليلات وتقارير</h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-bold block">تقارير دقيقة تساعدك على اتخاذ قرارات ذكية وتطوير متجرك.</p>
                </div>
                <div className="w-[65px] h-[65px] rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0 ml-2">
                   <BarChart4 className="w-8 h-8 fill-emerald-500 dark:fill-emerald-400" />
                </div>
             </div>
          </div>

        </div>
      </section>


      {/* ===== STATISTICS SECTION ===== */}
      <section className="py-16 bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-x-reverse divide-white/20">
            {[
              { num: "99.9%", label: "وقت التشغيل" },
              { num: "+27", label: "عميل سعيد" },
              { num: "+480", label: "طلب تم تنفيذه" },
              { num: "+35", label: "متجر نشط" },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4">
                <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.num}</p>
                <p className="text-purple-100 font-medium text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ===== TEMPLATES SECTION ===== */}
      <section id="templates" className="py-24 bg-[#fafafc] dark:bg-[#0f0f13] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/20 px-4 py-1.5 rounded-full text-sm inline-block mb-4 border border-purple-100 dark:border-purple-800/40">قوالب احترافية</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">تصاميم جاهزة تناسب كل مجال</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">اختر من مجموعة واسعة من القوالب الاحترافية، وخصصها بهويتك.</p>
          </div>

          <div className="flex flex-col items-center justify-center bg-white dark:bg-[#1a1a24] rounded-3xl border border-dashed border-gray-300 dark:border-white/10 p-16 shadow-sm">
            <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-6">
              <Palette className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">قوالب سوريكس قريباً!</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-center">نعمل حالياً على تجهيز مكتبة ضخمة من القوالب الاحترافية التي ستساعدك على إطلاق متجرك بأبهى حُلة، انتظرونا قريباً.</p>
          </div>
        </div>
      </section>


      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="py-24 bg-white dark:bg-[#15151c] relative overflow-hidden transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-bold bg-purple-50 dark:bg-purple-900/20 px-4 py-1.5 rounded-full text-sm inline-block mb-4 border border-purple-100 dark:border-purple-800/40">آراء عملائنا</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">ماذا يقول عملاؤنا عن Suriix؟</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "أفضل منصة لإنشاء المتاجر الإلكترونية. سهلة الاستخدام والدعم سريع جداً.",
                name: "فاطمة العتيبي",
                store: "متجر عطور",
                img: "https://i.pravatar.cc/100?img=5"
              },
              {
                text: "تصميم المتجر احترافي، والمبيعات زادت بشكل ملحوظ بعد الانتقال إلى المنصة.",
                name: "أحمد السبيعي",
                store: "متجر إلكترونيات",
                img: "https://i.pravatar.cc/100?img=12"
              },
              {
                text: "كل الأدوات التي أحتاجها في مكان واحد. أنصح بها بشدة لأي صاحب متجر.",
                name: "سارة محمد",
                store: "متجر أزياء",
                img: "https://i.pravatar.cc/100?img=9"
              }
            ].map((t, i) => (
              <div key={i} className="bg-[#fafafc] dark:bg-[#1a1a24] p-8 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col justify-between">
                <div>
                  <div className="text-purple-400 text-6xl font-serif leading-none mb-4">"</div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">{t.text}</p>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-white/10 shadow-sm" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.store}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-10 space-x-2 space-x-reverse">
             <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
             <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-white/20"></div>
             <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-white/20"></div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-20 bg-[#fafafc] dark:bg-[#0f0f13] border-t border-b border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gray-50/50 dark:bg-[#1a1a24] border border-transparent dark:border-white/5 shadow-sm py-16 rounded-[2.5rem] relative overflow-hidden">
           <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
           <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none" />
           
           <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-6 relative z-10">جاهز لتبدأ رحلتك في التجارة الذكية؟</h2>
           <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 relative z-10">انضم إلى آلاف التجار وابدأ متجرك الآن مجاناً.</p>
           <Link to="/create-store" className="relative z-10 inline-flex items-center justify-center space-x-2 space-x-reverse bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-purple-500/30 transition-all hover:scale-105">
              <span>ابدأ الآن</span>
              <ArrowLeft className="w-5 h-5" />
           </Link>
        </div>
      </section>


      {/* ===== FOOTER ===== */}
      <footer className="bg-white dark:bg-[#15151c] pt-20 pb-10 border-t border-gray-100 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <div className="space-y-6">
              <div className="flex items-center space-x-2 space-x-reverse">
                <img src="/favicon.png" alt="Suriix Logo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-xl text-gray-900 dark:text-white">Suriix</span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                منصة متكاملة لإنشاء وإدارة المتاجر الإلكترونية بسهولة واحترافية.
              </p>
              <div className="flex space-x-4 space-x-reverse text-gray-400 dark:text-slate-300">
                <a href="#" className="hover:text-purple-600 transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#" className="hover:text-purple-600 transition"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">الشركة</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <li><Link to="/about" className="hover:text-purple-600 dark:hover:text-purple-400">من نحن</Link></li>
                <li><Link to="/blog" className="hover:text-purple-600 dark:hover:text-purple-400">المدونة</Link></li>
                <li><Link to="/careers" className="hover:text-purple-600 dark:hover:text-purple-400">وظائف</Link></li>
                <li><Link to="/contact" className="hover:text-purple-600 dark:hover:text-purple-400">تواصل معنا</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">الدعم</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <li><Link to="/help" className="hover:text-purple-600 dark:hover:text-purple-400">مركز المساعدة</Link></li>
                <li><Link to="/terms" className="hover:text-purple-600 dark:hover:text-purple-400">الشروط والأحكام</Link></li>
                <li><Link to="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">سياسة الخصوصية</Link></li>
                <li><Link to="/faq" className="hover:text-purple-600 dark:hover:text-purple-400">الأسئلة الشائعة</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-6">الموارد</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400 font-medium">
                <li><Link to="/guide" className="hover:text-purple-600 dark:hover:text-purple-400">دليل البدء</Link></li>
                <li><Link to="/tools" className="hover:text-purple-600 dark:hover:text-purple-400">أدوات مجانية</Link></li>
                <li><Link to="/partners" className="hover:text-purple-600 dark:hover:text-purple-400">شركاؤنا تقنياً</Link></li>
                <li><Link to="/updates" className="hover:text-purple-600 dark:hover:text-purple-400">التحديثات</Link></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <p>© 2024 Suriix جميع الحقوق محفوظة.</p>
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
