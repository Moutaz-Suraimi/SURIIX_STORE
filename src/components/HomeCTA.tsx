import React, { memo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const WHATSAPP_URL = "https://wa.me/967780930635";

const HomeCTA = memo(() => {
  const { lang } = useLanguage();
  const isAr = lang === "ar";
  
  return (
    <section className="py-14 md:py-24 px-6 relative overflow-hidden bg-transparent">
      <div className="max-w-4xl mx-auto text-center glass-strong rounded-[2rem] p-8 md:p-12 shadow-xl neon-border relative overflow-hidden">
        {/* Glow ambient background effect */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />
        
        <h2 className="text-2xl md:text-4xl font-extrabold gradient-text mb-4 tracking-tight leading-tight">
          {isAr ? "هل أنت جاهز لتغيير واقعك الرقمي؟" : "Ready to Transform Your Digital Reality?"}
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-sm md:text-base font-semibold leading-relaxed">
          {isAr 
            ? "تواصل مع خبراء Suriix الآن للحصول على استشارة برمجية مجانية متكاملة وبدء رحلتك الرقمية معنا لبناء منصة استثنائية." 
            : "Connect with Suriix experts today for a free technical consultation and start your digital growth journey with us."}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary to-accent hover:opacity-95 shadow-lg shadow-purple-500/20 cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-4.5 h-4.5 fill-current" />
            <span>{isAr ? "تواصل عبر واتساب" : "Chat on WhatsApp"}</span>
          </a>
          <Link 
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm border border-border/80 bg-secondary/50 text-foreground hover:bg-secondary/80 transition-all hover:-translate-y-0.5"
          >
            <Phone className="w-4 h-4" />
            <span>{isAr ? "صفحة الاتصال بنا" : "Contact Us Page"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
});

HomeCTA.displayName = "HomeCTA";

export default HomeCTA;
