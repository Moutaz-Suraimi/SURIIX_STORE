import React, { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FooterSection from "@/components/FooterSection";
import ThemeToggle from "@/components/ThemeToggle";
import SuriixStoreSection from "@/components/SuriixStoreSection";
import SEO from "@/components/SEO";

const SuriixStore = () => {
  const { t, lang, setLang, langLabels, langOrder } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const title = lang === "ar" ? "متجر سوريكس - أنشئ متجرك الإلكتروني بسهولة" : lang === "zh" ? "Suriix 独立站 - 轻松开启您的在线商店" : "Suriix Store - Build Your Online Store Easily";
  const desc = lang === "ar" ? "حلول رقمية متكاملة لنمو أعمالك وإنشاء متجر إلكتروني فاخر ومميز." : lang === "zh" ? "助力您的独立站与跨境电商增长的一站式数字解决方案。" : "Integrated digital solutions for your business growth and e-commerce storefront.";

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <SEO title={title} description={desc} />
      
      {/* Navbar header */}
      <nav className="sticky top-0 z-50 glass-strong px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/")}>
          <img
            src="/favicon-192x192.png"
            alt="Suriix Logo"
            className="w-9 h-9 rounded-full object-cover border border-primary/20 shadow-sm"
          />
          <span className="font-bold text-xl gradient-text tracking-wide hidden sm:block">Suriix</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="flex bg-secondary/50 p-1 rounded-xl border border-border/50">
            {langOrder.map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  lang === code ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {langLabels[code]}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-8">
        
        {/* Back Link */}
        <div className="max-w-7xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t("privacy.back")}
          </Link>
        </div>

        {/* Full Store SaaS Section */}
        <SuriixStoreSection isHome={false} />
      </main>

      <FooterSection />
    </div>
  );
};

export default SuriixStore;
