import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

const FooterSection = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string, hash?: string) => {
    if (hash) {
      if (location.pathname !== "/") {
        navigate(`/${hash}`);
      } else {
        document.getElementById(hash.substring(1))?.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(path);
      window.scrollTo(0, 0);
    }
  };

  return (
    <footer className="border-t border-border/30 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.services")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li onClick={() => handleNav("/solutions")} className="hover:text-primary transition-colors cursor-pointer">{t("sol.digital")}</li>
              <li onClick={() => handleNav("/store")} className="hover:text-primary transition-colors cursor-pointer">{t("nav.store")}</li>
              <li onClick={() => handleNav("/solutions")} className="hover:text-primary transition-colors cursor-pointer">{t("sol.ecommerce")}</li>
              <li onClick={() => handleNav("/solutions")} className="hover:text-primary transition-colors cursor-pointer">{t("sol.brand")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li onClick={() => handleNav("/about")} className="hover:text-primary transition-colors cursor-pointer">{t("nav.about")}</li>
              <li onClick={() => handleNav("/careers")} className="hover:text-primary transition-colors cursor-pointer">وظائف</li>
              <li onClick={() => handleNav("/partners")} className="hover:text-primary transition-colors cursor-pointer">شركاؤنا تقنياً</li>
              <li onClick={() => handleNav("/updates")} className="hover:text-primary transition-colors cursor-pointer">التحديثات</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li onClick={() => handleNav("/help")} className="hover:text-primary transition-colors cursor-pointer">مركز المساعدة</li>
              <li onClick={() => handleNav("/faq")} className="hover:text-primary transition-colors cursor-pointer">{t("nav.faq")}</li>
              <li onClick={() => handleNav("/contact")} className="hover:text-primary transition-colors cursor-pointer">{t("nav.contact")}</li>
              <li onClick={() => handleNav("/getting-started")} className="hover:text-primary transition-colors cursor-pointer">دليل البدء</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t("footer.resources")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li onClick={() => handleNav("/blog")} className="hover:text-primary transition-colors cursor-pointer">{t("nav.blog")}</li>
              <li onClick={() => handleNav("/free-tools")} className="hover:text-primary transition-colors cursor-pointer">أدوات مجانية</li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">{lang === "ar" ? "شروط الاستخدام" : lang === "zh" ? "使用条款" : "Terms of Use"}</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/favicon-192x192.png"
              alt="Suriix Logo"
              className="w-14 h-14 rounded-full object-cover border border-primary/20 shadow-sm"
            />
            <div>
               <p className="font-bold text-2xl tracking-wide leading-tight gradient-text">Suriix</p>
               <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest hidden sm:block">Digital Agency</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="https://www.facebook.com/share/1HT2PRwNYJ/" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 border border-border/40 bg-white/5 backdrop-blur-sm social-icon-btn dark:bg-[#0f172a] dark:border-slate-800" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/sur_iix_?igsh=MWVxdjF4dGcyMjV6Nw==" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 border border-border/40 bg-white/5 backdrop-blur-sm social-icon-btn dark:bg-[#0f172a] dark:border-slate-800" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/967780930635" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 border border-border/40 bg-white/5 backdrop-blur-sm social-icon-btn dark:bg-[#0f172a] dark:border-slate-800" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            {/* Email */}
            <a href="mailto:info@suriix.com"
              className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/60 border border-border/40 bg-white/5 backdrop-blur-sm social-icon-btn dark:bg-[#0f172a] dark:border-slate-800" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
          </div>

          <p className="text-sm text-muted-foreground flex items-center justify-center">
            © {new Date().getFullYear()} Suriix. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
