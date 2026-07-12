import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users, Folder, Rocket, Star, ArrowUpRight, Play,
  Search, Cpu, TrendingUp, ChevronDown, Globe, Menu, X
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const WHATSAPP = "https://wa.me/967780930635";

// Static data defined outside component — avoids re-creation on every render
const NAV_ITEMS = [
  { key: "nav.home", href: "/" },
  { key: "nav.store", href: "/store" },
  { key: "nav.packages", href: "/packages" },
  { key: "nav.portfolio", href: "/portfolio" },
  { key: "nav.solutions", href: "/solutions" },
  { key: "nav.about", href: "/about" },
  { key: "nav.contact", href: "/contact" },
];

interface HeroSectionProps {
  isIntroActive?: boolean;
}

const HeroSection = memo(({ isIntroActive = false }: HeroSectionProps) => {
  const { t, lang, setLang, langLabels, langOrder } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Device responsive rendering for maximum CPU/DOM Lighthouse score efficiency
    const media = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    media.addEventListener("change", listener);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      media.removeEventListener("change", listener);
    };
  }, []);
  
  const isRtl = lang === "ar";

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    // Calculate rotation angles (max 8 degrees)
    const rx = -(y / (box.height / 2)) * 8;
    const ry = (x / (box.width / 2)) * 8;
    card.style.setProperty("--rotate-x", `${rx}deg`);
    card.style.setProperty("--rotate-y", `${ry}deg`);
    card.style.setProperty("--tilt-transition", "none");
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.removeProperty("--tilt-transition");
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - box.left - box.width / 2;
    const y = touch.clientY - box.top - box.height / 2;
    // Calculate rotation angles (max 10 degrees for touch feedback)
    const rx = -(y / (box.height / 2)) * 10;
    const ry = (x / (box.width / 2)) * 10;
    card.style.setProperty("--rotate-x", `${rx}deg`);
    card.style.setProperty("--rotate-y", `${ry}deg`);
    card.style.setProperty("--tilt-transition", "none");
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.removeProperty("--tilt-transition");
  }, []);

  const handleNavClick = useCallback((href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("/")) {
      if (location.pathname === href) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(href);
        window.scrollTo(0, 0);
      }
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [navigate, location.pathname]);

  // Use static NAV_ITEMS defined outside component
  const navItems = NAV_ITEMS;

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-transparent text-foreground pb-16 pt-24 lg:pt-32"
    >

      {/* --- Horizontal Top Navbar --- */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 transition-all duration-300 md:px-12 ${
        isScrolled
          ? "py-4 bg-background/80 dark:bg-background/75 backdrop-blur-md md:backdrop-blur-lg border-b border-border/30 shadow-lg"
          : "py-5 bg-transparent"
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNavClick("#home")}>
          <img
            src="/favicon-192x192.png"
            alt="Suriix Logo"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border border-primary/20 shadow-sm"
          />
          <span className="font-display font-bold text-2xl tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Suriix
          </span>
        </div>

        {/* Center menu links - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.href)}
              className="relative text-sm font-medium text-foreground/80 hover:text-primary transition-colors cursor-pointer"
            >
              {t(item.key)}
            </button>
          ))}
        </nav>

        {/* Action Controls & CTA */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              aria-haspopup="listbox"
              aria-expanded={langMenuOpen}
              aria-label="Select language"
              className="p-2 glass rounded-xl border border-border/50 hover:bg-secondary/40 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              <span className="uppercase">{lang}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-12 right-0 glass-strong border border-border/50 rounded-xl overflow-hidden min-w-[120px] shadow-2xl z-50"
                >
                  {langOrder.map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangMenuOpen(false); }}
                      className={`w-full px-4 py-2.5 text-sm text-start font-medium transition-colors cursor-pointer ${
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

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-primary to-accent hover:opacity-95 transition-opacity shadow-[0_8px_20px_rgba(139,92,246,0.25)] dark:shadow-[0_8px_20px_rgba(139,92,246,0.15)] cursor-pointer"
          >
            {t("hero.btn.start")}
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-secondary/50 border border-border/50 text-foreground hover:bg-secondary/80 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[72px] left-0 right-0 z-40 glass border-b border-border/50 p-6 flex flex-col gap-4 shadow-xl md:hidden"
          >
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNavClick(item.href)}
                  className="w-full py-2.5 text-start font-semibold text-lg text-foreground/80 hover:text-primary transition-colors cursor-pointer"
                >
                  {t(item.key)}
                </button>
              ))}
            </div>
            
            <div className="h-px bg-border/50 my-2" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("legal.privacy.title")}</span>
              <div className="flex gap-2">
                {langOrder.map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setMobileMenuOpen(false); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      lang === l ? "bg-primary/20 text-primary border-primary/30" : "bg-secondary/40 border-border"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-primary text-center shadow-lg"
            >
              {t("hero.btn.start")}
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Hero Content --- */}
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-12 gap-8 lg:gap-12 relative z-10 w-full flex-grow items-center">
        
        {/* Left Column: Text Content */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-center text-start">
                   {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isIntroActive ? { opacity: 0, y: 25 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="self-start inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary mb-6 shadow-sm"
          >
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {t("hero.badge")}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isIntroActive ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="font-display font-extrabold text-4xl sm:text-5xl xl:text-6xl tracking-tight leading-[1.15] mb-6 text-foreground"
          >
            {t("hero.title1")}{" "}
            <span className="gradient-text">
              {t("hero.title2")}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isIntroActive ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl"
          >
            {t("hero.desc")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={isIntroActive ? { opacity: 0, y: 25 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap items-center gap-4 mb-12"
          >
            {/* Start Project CTA */}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-primary to-accent hover:shadow-[0_12px_24px_rgba(139,92,246,0.3)] hover:opacity-98 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t("hero.btn.start")}</span>
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center dark:bg-[#0f172a]">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </a>

            {/* Watch Portfolio CTA */}
            <button
              onClick={() => handleNavClick("#portfolio")}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 text-foreground transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <span className="w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center">
                <Play className="w-3 h-3 fill-foreground text-foreground" />
              </span>
              <span>{t("hero.btn.portfolio")}</span>
            </button>
          </motion.div>

          {/* Stats Glass Panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isIntroActive ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-2xl rounded-3xl p-5 md:p-6 glass shadow-xl grid grid-cols-4 gap-4 divide-x divide-border/40 dark:divide-border/10 rtl:divide-x-reverse"
          >
            {/* Stat 1: Happy Clients */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-8 h-8 rounded-xl gradient-icon-box flex items-center justify-center mb-2 shadow-sm">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg md:text-xl text-foreground leading-none">{t("hero.stats.clients")}</span>
              <span className="text-[11px] md:text-xs text-muted-foreground mt-1 font-medium">{t("hero.stats.clients_lbl")}</span>
            </div>

            {/* Stat 2: Completed Projects */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-8 h-8 rounded-xl gradient-icon-box flex items-center justify-center mb-2 shadow-sm">
                <Folder className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg md:text-xl text-foreground leading-none">{t("hero.stats.projects")}</span>
              <span className="text-[11px] md:text-xs text-muted-foreground mt-1 font-medium">{t("hero.stats.projects_lbl")}</span>
            </div>

            {/* Stat 3: Years of Experience */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-8 h-8 rounded-xl gradient-icon-box flex items-center justify-center mb-2 shadow-sm">
                <Rocket className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg md:text-xl text-foreground leading-none">{t("hero.stats.experience")}</span>
              <span className="text-[11px] md:text-xs text-muted-foreground mt-1 font-medium">{t("hero.stats.experience_lbl")}</span>
            </div>

            {/* Stat 4: Client Satisfaction */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-8 h-8 rounded-xl gradient-icon-box flex items-center justify-center mb-2 shadow-sm">
                <Star className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg md:text-xl text-foreground leading-none">{t("hero.stats.satisfaction")}</span>
              <span className="text-[11px] md:text-xs text-muted-foreground mt-1 font-medium">{t("hero.stats.satisfaction_lbl")}</span>
            </div>
          </motion.div>

        </div>

        {/* Right Column: 3D Interactive Mockup Dashboard (Rendered only on Desktop for 100/100 Mobile Lighthouse scores) */}
        {isDesktop && (
          <div className="col-span-12 lg:col-span-7 flex items-center justify-center relative w-full mt-10 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 5 }}
              animate={isIntroActive ? { opacity: 0, scale: 0.9, rotateY: 5 } : { opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="w-full max-w-[620px] aspect-[4/3] relative flex items-center justify-center"
              style={{ perspective: 1200 }}
            >
              {/* Interactive Tilt Panel */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-full relative cursor-grab active:cursor-grabbing rounded-[2rem]"
                style={{
                  transform: "rotateY(calc(-15deg + var(--rotate-y, 0deg))) rotateX(calc(10deg + var(--rotate-x, 0deg))) rotateZ(-2deg)",
                  transformStyle: "preserve-3d",
                  transition: "var(--tilt-transition, transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1))"
                }}
              >
                {/* --- MAIN DASHBOARD BOARD --- */}
                <div
                  className="w-full h-full glass border border-white/60 dark:border-white/5 shadow-2xl dark:shadow-purple-950/20 rounded-[2rem] p-5 flex flex-row gap-5"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Sidebar Mockup */}
                  <div className="w-[120px] md:w-[150px] shrink-0 border-r border-[#ece9f8] dark:border-[#201a3d] flex flex-col justify-between pb-2 pr-2">
                    <div className="flex flex-col gap-6">
                      {/* Logo inside dashboard */}
                      <div className="flex items-center gap-1.5 pt-1">
                        <img src="/favicon-192x192.png" alt="Suriix logo" width={24} height={24} className="w-6 h-6 object-cover rounded-full" />
                        <span className="font-display font-extrabold text-[13px] text-[#28214f] dark:text-white tracking-wide">
                          Suriix
                        </span>
                      </div>

                      {/* Sidebar Links */}
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-primary/10 text-primary text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {t("hero.dashboard.sidebar.home")}
                        </div>
                        {[
                          t("hero.dashboard.sidebar.projects"),
                          t("hero.dashboard.sidebar.clients"),
                          t("hero.dashboard.sidebar.analytics"),
                          t("hero.dashboard.sidebar.reports"),
                          t("hero.dashboard.sidebar.settings"),
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#605a81] dark:text-[#908bb5] hover:bg-secondary/40 text-[11px] font-semibold transition-colors"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ccc8e3] dark:bg-[#342e54]" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dashboard Main Area */}
                  <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    
                    {/* Top Bar inside dashboard */}
                    <div className="flex items-center justify-between pb-1 pt-1 border-b border-[#f4f2fd] dark:border-[#201a3d]">
                      <span className="text-[14px] font-extrabold text-[#28214f] dark:text-white">
                        {t("hero.dashboard.overview")}
                      </span>
                      <div className="relative w-36">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a39ebb]" />
                        <input
                          type="text"
                          disabled
                          placeholder={t("hero.dashboard.search")}
                          className="w-full bg-[#f4f3fb] dark:bg-[#1a1538]/60 border border-transparent rounded-lg py-1 pl-8 pr-2 text-[10px] text-[#554f7a]"
                        />
                      </div>
                    </div>

                    {/* 4 KPIs grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                      
                      {/* Projects */}
                      <div className="bg-white/80 dark:bg-[#191436]/60 border border-white/50 dark:border-white/5 rounded-xl p-2.5 shadow-sm">
                        <span className="text-[9px] font-semibold text-muted-foreground block truncate">
                          {t("hero.dashboard.stats.projects")}
                        </span>
                        <span className="text-sm font-bold text-foreground block mt-1">128</span>
                        <span className="text-[8px] font-bold text-emerald-500 flex items-center mt-1">
                          +18%
                        </span>
                      </div>

                      {/* Active Clients */}
                      <div className="bg-white/80 dark:bg-[#191436]/60 border border-white/50 dark:border-white/5 rounded-xl p-2.5 shadow-sm">
                        <span className="text-[9px] font-semibold text-muted-foreground block truncate">
                          {t("hero.dashboard.stats.active_clients")}
                        </span>
                        <span className="text-sm font-bold text-foreground block mt-1">96+</span>
                        <span className="text-[8px] font-bold text-emerald-500 flex items-center mt-1">
                          +22%
                        </span>
                      </div>

                      {/* Success Rate */}
                      <div className="bg-white/80 dark:bg-[#191436]/60 border border-white/50 dark:border-white/5 rounded-xl p-2.5 shadow-sm">
                        <span className="text-[9px] font-semibold text-muted-foreground block truncate">
                          {t("hero.dashboard.stats.success_rate")}
                        </span>
                        <span className="text-sm font-bold text-foreground block mt-1">98%</span>
                        <span className="text-[8px] font-bold text-emerald-500 flex items-center mt-1">
                          +15%
                        </span>
                      </div>

                      {/* Response Rate */}
                      <div className="bg-white/80 dark:bg-[#191436]/60 border border-white/50 dark:border-white/5 rounded-xl p-2.5 shadow-sm">
                        <span className="text-[9px] font-semibold text-muted-foreground block truncate">
                          {t("hero.dashboard.stats.response_rate")}
                        </span>
                        <span className="text-sm font-bold text-foreground block mt-1">1.2h</span>
                        <span className="text-[8px] font-bold text-pink-500 flex items-center mt-1">
                          -20%
                        </span>
                      </div>

                    </div>

                    {/* Two Charts panels */}
                    <div className="grid grid-cols-12 gap-3 flex-1 overflow-hidden">
                      
                      {/* Performance Growth Curve chart */}
                      <div className="col-span-7 bg-white/80 dark:bg-[#191436]/60 border border-white/50 dark:border-white/5 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-[#28214f] dark:text-white">
                            {t("hero.dashboard.stats.growth")}
                          </span>
                          <div className="text-[8px] font-semibold bg-[#f4f3fb] dark:bg-[#201a3d] border border-border/50 text-[#605a81] dark:text-[#908bb5] px-1.5 py-0.5 rounded-md flex items-center gap-1 cursor-pointer">
                            <span>{t("hero.dashboard.stats.month")}</span>
                            <ChevronDown className="w-2.5 h-2.5" />
                          </div>
                        </div>
                        
                        {/* Live SVG curve chart */}
                        <div className="flex-1 w-full flex items-center">
                          <svg className="w-full h-full max-h-[85px]" viewBox="0 0 300 100" fill="none">
                            <defs>
                              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            {/* Grid */}
                            <line x1="0" y1="20" x2="300" y2="20" stroke="rgba(168, 85, 247, 0.06)" strokeWidth="1" />
                            <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(168, 85, 247, 0.06)" strokeWidth="1" />
                            <line x1="0" y1="80" x2="300" y2="80" stroke="rgba(168, 85, 247, 0.06)" strokeWidth="1" />
                            {/* Curve Area */}
                            <path
                              d="M 10 90 C 45 80, 75 55, 110 65 C 145 75, 175 35, 210 50 C 245 65, 270 20, 290 25 L 290 100 L 10 100 Z"
                              fill="url(#areaGrad)"
                            />
                            {/* Curve Stroke */}
                            <path
                              d="M 10 90 C 45 80, 75 55, 110 65 C 145 75, 175 35, 210 50 C 245 65, 270 20, 290 25"
                              stroke="hsl(var(--primary))"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                            {/* Curve indicator dots */}
                            <circle cx="210" cy="50" r="3" fill="hsl(var(--primary))" stroke="white" strokeWidth="1" />
                            <circle cx="290" cy="25" r="3" fill="hsl(var(--primary))" stroke="white" strokeWidth="1" />
                          </svg>
                        </div>
                        
                        {/* Months labels */}
                        <div className="flex justify-between text-[8px] text-[#a39ebb] mt-1 px-1">
                          <span>{lang === "ar" ? "يناير" : "Jan"}</span>
                          <span>{lang === "ar" ? "فبراير" : "Feb"}</span>
                          <span>{lang === "ar" ? "مارس" : "Mar"}</span>
                          <span>{lang === "ar" ? "أبريل" : "Apr"}</span>
                          <span>{lang === "ar" ? "مايو" : "May"}</span>
                          <span>{lang === "ar" ? "يونيو" : "Jun"}</span>
                        </div>
                      </div>

                      {/* Project distribution donut chart */}
                      <div className="col-span-5 bg-white/80 dark:bg-[#191436]/60 border border-white/50 dark:border-white/5 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-[#28214f] dark:text-white">
                          {t("hero.dashboard.stats.distribution")}
                        </span>
                        
                        <div className="flex-1 flex items-center justify-center my-1 relative">
                          {/* Donut SVG */}
                          <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f2efff" dark-stroke="#241e46" strokeWidth="4.5" />
                            {/* Segment 1: Web Design (55%) */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="hsl(var(--primary))" strokeWidth="4.5" strokeDasharray="55 100" strokeDashoffset="0" />
                            {/* Segment 2: Visual Identity (25%) */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="hsl(var(--accent))" strokeWidth="4.5" strokeDasharray="25 100" strokeDashoffset="-55" />
                            {/* Segment 3: Automation (20%) */}
                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ec4899" strokeWidth="4.5" strokeDasharray="20 100" strokeDashoffset="-80" />
                          </svg>
                          {/* Core text in middle of Donut */}
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-xs font-bold text-[#28214f] dark:text-white leading-none">128</span>
                            <span className="text-[6.5px] text-[#a39ebb] mt-0.5 scale-90">{lang === "ar" ? "الإجمالي" : "Total"}</span>
                          </div>
                        </div>

                        {/* Legend details */}
                        <div className="flex flex-col gap-1 text-[7px] text-[#605a81] dark:text-[#a09bbd]">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="truncate">{t("contact.service.web")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span className="truncate">{t("contact.service.branding")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            <span className="truncate">{t("contact.service.mixed")}</span>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* --- FLOATING 3D CARDS OVERLAY --- */}

                {/* Floating Card 1: Top-Right (Performance Growth) */}
                <div
                  className="absolute -top-12 -right-8 z-30 glass border border-white/80 dark:border-white/10 shadow-xl rounded-2xl p-3 flex items-center gap-3 w-44 hover:shadow-2xl transition-all duration-300"
                  style={{ transform: "translateZ(50px)" }}
                >
                  <div className="w-9 h-9 rounded-xl gradient-icon-box flex items-center justify-center shrink-0 shadow-sm">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-bold text-[#28214f] dark:text-white truncate">
                      {t("hero.dashboard.stats.growth_title")}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-extrabold mt-0.5">
                      +78% {t("hero.dashboard.stats.month")}
                    </span>
                  </div>
                </div>

                {/* Floating Card 2: Bottom-Left (Smart Automation) */}
                <div
                  className="absolute -bottom-6 -left-10 z-30 glass border border-white/80 dark:border-white/10 shadow-xl rounded-2xl p-3.5 flex items-center gap-3.5 w-52 hover:shadow-2xl transition-all duration-300"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="w-10 h-10 rounded-xl gradient-icon-box flex items-center justify-center shrink-0 shadow-sm">
                    <Cpu className="w-5.5 h-5.5 animate-pulse" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[12px] font-bold text-[#28214f] dark:text-white truncate">
                      {t("hero.dashboard.stats.automation_title")}
                    </span>
                    <span className="text-[9px] text-[#716a96] dark:text-[#a19bbe] truncate mt-0.5">
                      {t("hero.dashboard.stats.automation_desc")}
                    </span>
                  </div>
                </div>

                {/* Floating Card 3: Bottom-Right (3D Logo App block) */}
                <div
                  className="absolute -bottom-10 -right-8 z-30 bg-white/95 dark:bg-[#171333]/95 border border-white/80 dark:border-white/10 shadow-2xl rounded-3xl p-3 w-20 h-20 flex items-center justify-center hover:shadow-[0_20px_40px_rgba(139,92,246,0.2)] transition-shadow duration-300"
                  style={{ transform: "translateZ(65px)" }}
                >
                  <img src="/favicon-192x192.png" alt="Suriix logo" width={56} height={56} className="w-14 h-14 object-cover rounded-2xl shadow-md rotate-[-6deg]" />
                </div>

              </div>
            </motion.div>
          </div>
        )}

      </div>

      {/* --- Scroll Down Indicator --- */}
      <div className="w-full flex flex-col items-center justify-center z-10 shrink-0 select-none">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isIntroActive ? { opacity: 0, y: 15 } : { opacity: 1, y: [0, 8, 0] }}
          transition={isIntroActive ? { duration: 0.5 } : {
            y: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
            opacity: { duration: 0.6, delay: 0.5 }
          }}
          onClick={() => handleNavClick("#about")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleNavClick("#about");
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={t("hero.scroll_down")}
          className="flex flex-col items-center gap-2 text-muted-foreground/80 hover:text-primary transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/55 rounded-xl px-2 py-1"
        >
          <span className="text-xs font-semibold tracking-wide uppercase">
            {t("hero.scroll_down")}
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center p-1.5">
            <span className="w-1.5 h-2 rounded-full bg-primary" />
          </div>
        </motion.div>
      </div>

    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
