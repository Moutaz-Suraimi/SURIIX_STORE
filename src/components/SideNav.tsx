import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Users, Layers, Package, Lightbulb,
  HelpCircle, MessageSquare, Menu, X, Globe, Briefcase, Star, BookOpen, Store, ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { key: "nav.home", icon: Home, href: "#home" },
  { key: "nav.store", icon: Store, href: "/store" },
  { key: "nav.about", icon: Users, href: "/about" },
  { key: "nav.mirror", icon: Layers, href: "#mirror" },
  { key: "nav.solutions", icon: Lightbulb, href: "#solutions" },
  { key: "nav.packages", icon: Package, href: "#packages" },
  { key: "nav.portfolio", icon: Briefcase, href: "#portfolio" },
  { key: "nav.testimonials", icon: Star, href: "#testimonials" },
  { key: "nav.faq", icon: HelpCircle, href: "#faq" },
  { key: "nav.blog", icon: BookOpen, href: "#blog" },
  { key: "nav.contact", icon: MessageSquare, href: "/contact" },
  { key: "nav.admin", icon: ShieldCheck, href: "/admin" },
];

const SideNav = () => {
  const { t, lang, setLang, langLabels, langOrder } = useLanguage();
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  const navigate = useNavigate();

  const handleClick = (href: string) => {
    setActive(href);
    setMobileOpen(false);
    if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo(0, 0);
    } else {
      if (window.location.pathname !== "/") {
        navigate("/" + href);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isRtl = lang === "ar";

  const cycleLang = () => {
    setLangMenuOpen(!langMenuOpen);
  };

  // Scroll visibility threshold (show floating nav when user scrolls past 300px)
  useEffect(() => {
    const handleScrollVisibility = () => {
      if (window.scrollY > 300) {
        setShowNavbar(true);
      } else {
        setShowNavbar(false);
      }
    };
    window.addEventListener("scroll", handleScrollVisibility, { passive: true });
    // Check initial position
    handleScrollVisibility();
    return () => {
      window.removeEventListener("scroll", handleScrollVisibility);
    };
  }, []);

  // ScrollSpy to update active state
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    
    const handleScroll = () => {
      if (timeout) return;
      
      timeout = setTimeout(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        let currentActive = active;
        for (const item of navItems) {
          const element = document.getElementById(item.href.substring(1));
          if (element) {
            const { top, bottom } = element.getBoundingClientRect();
            const elementTop = top + window.scrollY;
            const elementBottom = bottom + window.scrollY;
            
            if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
              currentActive = item.href;
            }
          }
        }
        
        if (currentActive !== active) {
          setActive(currentActive);
        }
        timeout = null;
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [active]);

  return (
    <>
      {/* Unified Mobile Top Navbar */}
      <AnimatePresence>
        {showNavbar && (
          <motion.div
            initial={{ opacity: 0, y: -42 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -42 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 h-[42px] z-50 md:hidden glass-strong border-b border-border/40 flex items-center px-3 shadow-sm dark:border-slate-800"
          >
            {/* Toggle Button */}
            <div className="flex-1 flex justify-start">
              <button 
                onClick={() => setMobileOpen(!mobileOpen)} 
                className="p-1.5 rounded-lg bg-secondary/50 hover:bg-primary/20 transition-colors border border-border/50"
              >
                 {mobileOpen ? <X className="w-4 h-4 text-foreground" /> : <Menu className="w-4 h-4 text-foreground" />}
              </button>
            </div>

            {/* Center Logo */}
            <div className="flex items-center gap-1.5 shrink-0 pointer-events-none">
              <div className="w-6 h-6 rounded-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md flex items-center justify-center">
                <span className="font-display font-black text-xs bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent leading-none">S</span>
              </div>
              <span className="font-bold text-base gradient-text tracking-wide">Suriix</span>
            </div>

            {/* Language & Theme Controls */}
            <div className="flex-1 flex justify-end items-center gap-1.5">
              <ThemeToggle />
              <div className="relative">
                <button 
                  onClick={cycleLang} 
                  className="p-1.5 rounded-full bg-secondary/50 border border-border/50 hover:bg-primary/20 text-xs font-semibold flex items-center gap-1 transition-colors h-8 w-8 justify-center"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {/* Hide text on mobile to save space completely as requested */}
                  <span className="hidden leading-none">{lang}</span>
                </button>
                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      className="absolute top-14 end-0 glass-strong border border-border/50 rounded-xl overflow-hidden min-w-[120px] shadow-xl z-50"
                    >
                      {langOrder.map((l) => (
                        <button
                          key={l}
                          onClick={() => { setLang(l); setLangMenuOpen(false); }}
                          className={`w-full px-4 py-3 text-sm text-start font-medium transition-colors ${
                            lang === l ? "text-primary bg-primary/10" : "text-foreground hover:bg-secondary/50"
                          }`}
                        >
                          {langLabels[l]}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Language switcher - top corner */}
      <AnimatePresence>
        {showNavbar && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 z-50 hidden md:flex items-center gap-2"
            style={{ [isRtl ? "left" : "right"]: "1rem" }}
          >
            <ThemeToggle />
            <button
              onClick={cycleLang}
              className="p-3 glass rounded-lg neon-border flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <Globe className="w-4 h-4" />
              {langLabels[lang]}
            </button>
            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-14 end-0 glass-strong rounded-xl neon-border overflow-hidden min-w-[120px]"
                >
                  {langOrder.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangMenuOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-start transition-colors ${
                        lang === l ? "text-primary bg-primary/10" : "text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      {langLabels[l]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ opacity: 0, x: isRtl ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? 100 : -100 }}
            transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2 p-3 glass-strong rounded-3xl neon-border shadow-2xl backdrop-blur-xl bg-background/40"
            style={{ [isRtl ? "right" : "left"]: "1.5rem" }}
          >
            <div className="flex flex-col items-center justify-center mb-6 p-2 mt-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md flex items-center justify-center shadow-sm">
                <span className="font-display font-black text-2xl bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent leading-none">S</span>
              </div>
            </div>
            {navItems.map((item) => (
              <div
                key={item.key}
                className="relative"
                onMouseEnter={() => setHovered(item.key)}
                onMouseLeave={() => setHovered(null)}
              >
                <button
                  onClick={() => handleClick(item.href)}
                  className={`p-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center relative ${
                    active === item.href
                      ? "bg-primary/15 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)] border border-primary/20 scale-105"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:scale-105"
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0 relative z-10" />
                  {active === item.href && (
                    <motion.div 
                      layoutId="activeNavBg"
                      className="absolute inset-0 rounded-2xl bg-primary/10 border border-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <AnimatePresence>
                    {hovered === item.key && (
                      <motion.div
                        initial={{ opacity: 0, x: isRtl ? 10 : -10, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: isRtl ? 5 : -5, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-[calc(100%+12px)]' : 'left-[calc(100%+12px)]'} px-4 py-2 glass-strong rounded-xl text-sm font-medium whitespace-nowrap shadow-xl border border-border/50 flex items-center gap-2`}
                      >
                        {active === item.href && <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                        {t(item.key)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
             initial={{ opacity: 0, x: isRtl ? 100 : -100 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: isRtl ? 100 : -100 }}
             className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col items-center md:hidden pt-[80px]"
          >
            <div className="flex flex-col items-center gap-2 mb-4 mt-2 shrink-0">
              <img src="/favicon-192x192.png" alt="Suriix Logo" className="w-20 h-20 object-cover rounded-full" />
              <p className="text-[#26163c] dark:text-white font-bold text-3xl tracking-wide mt-2">Suriix</p>
            </div>
            
            <div className="w-full flex-1 overflow-y-auto px-4 pb-4 pt-1 flex flex-col gap-1.5 custom-scrollbar items-center">
              <div className="w-full max-w-[280px] flex flex-col gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleClick(item.href)}
                    className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl text-base font-medium transition-all duration-300 border ${
                      active === item.href
                        ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border-transparent"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {t(item.key)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SideNav;
