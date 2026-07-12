import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WHATSAPP_NUMBER = "967780930635";

const ContactSection = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const isRtl = lang === "ar";

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  // Local translations
  const f = {
    ar: {
      nameLabel: "الاسم الكامل",
      namePlaceholder: "الاسم الكامل",
      emailLabel: "البريد الإلكتروني",
      emailPlaceholder: "البريد الإلكتروني",
      messageLabel: "الرسالة",
      messagePlaceholder: "الرسالة",
      send: "إرسال",
      sending: "جاري الإرسال...",
      nameRequired: "يرجى إدخال اسمك الكامل",
      emailRequired: "يرجى إدخال بريدك الإلكتروني",
      emailInvalid: "يرجى إدخال بريد إلكتروني صحيح",
      messageRequired: "يرجى كتابة رسالتك",
      waHello: "*طلب تواصل جديد من الموقع* 🚀",
      waName: "*الاسم الكامل:*",
      waEmail: "*البريد الإلكتروني:*",
      waMsg: "*الرسالة:*",
      subtitle: "تواصل معنا مباشرة عبر النموذج أو واتساب",
    },
    en: {
      nameLabel: "Full Name",
      namePlaceholder: "Full Name",
      emailLabel: "Email Address",
      emailPlaceholder: "Email Address",
      messageLabel: "Message",
      messagePlaceholder: "Message",
      send: "Send",
      sending: "Sending...",
      nameRequired: "Full name is required",
      emailRequired: "Email address is required",
      emailInvalid: "Please enter a valid email address",
      messageRequired: "Message content is required",
      waHello: "*New Contact Request* 🚀",
      waName: "*Full Name:*",
      waEmail: "*Email:*",
      waMsg: "*Message:*",
      subtitle: "Contact us directly via the form or WhatsApp",
    },
    zh: {
      nameLabel: "完整姓名",
      namePlaceholder: "完整姓名",
      emailLabel: "电子邮件",
      emailPlaceholder: "电子邮件",
      messageLabel: "留言",
      messagePlaceholder: "留言",
      send: "发送",
      sending: "发送中...",
      nameRequired: "请输入您的完整姓名",
      emailRequired: "请输入您的电子邮件",
      emailInvalid: "请输入有效的电子邮件地址",
      messageRequired: "请输入留言内容",
      waHello: "*来自网站的新联络请求* 🚀",
      waName: "*全名:*",
      waEmail: "*电子邮件:*",
      waMsg: "*留言:*",
      subtitle: "直接通过表单或 WhatsApp 与我们联系",
    }
  }[lang as "ar" | "en" | "zh"] || {
    nameLabel: "Full Name",
    namePlaceholder: "Full Name",
    emailLabel: "Email Address",
    emailPlaceholder: "Email Address",
    messageLabel: "Message",
    messagePlaceholder: "Message",
    send: "Send",
    sending: "Sending...",
    nameRequired: "Full name is required",
    emailRequired: "Email address is required",
    emailInvalid: "Please enter a valid email address",
    messageRequired: "Message content is required",
    waHello: "*New Contact Request* 🚀",
    waName: "*Full Name:*",
    waEmail: "*Email:*",
    waMsg: "*Message:*",
    subtitle: "Contact us directly via the form or WhatsApp",
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = f.nameRequired;
    
    if (!email.trim()) {
      errs.email = f.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = f.emailInvalid;
    }
    
    if (!message.trim()) errs.message = f.messageRequired;
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);

    // Format WhatsApp message
    const waText = [
      f.waHello,
      `${f.waName} ${name}`,
      `${f.waEmail} ${email}`,
      f.waMsg,
      message
    ].join("\n");

    setTimeout(() => {
      setSubmitted(true);
      setIsSending(false);
      window.open(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`,
        "_blank"
      );
    }, 1200);
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-primary/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/6 blur-[100px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold border border-primary/30 bg-primary/10 text-primary mb-4 uppercase tracking-widest">
            {t("contact.briefing.subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold gradient-text leading-tight mb-4">
            {t("contact.title")}
          </h2>
          <button
            onClick={() => { navigate("/contact"); window.scrollTo(0, 0); }}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            {isRtl ? "أو انتقل لصفحة التواصل الكاملة" : lang === "zh" ? "或前往完整联系页面" : "Or go to the full contact page"}
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              className="glass-strong rounded-3xl p-6 md:p-10 neon-border relative overflow-hidden space-y-6"
            >
              {/* Subtle inner glow */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, hsl(var(--neon-purple)/0.07) 0%, transparent 70%)",
                }}
              />

              {/* Full Name input */}
              <div className="space-y-2 text-start relative z-10">
                <label className="block text-sm font-bold text-foreground/90">
                  {f.nameLabel}
                </label>
                <div className="relative">
                  <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 ${isRtl ? "right-4" : "left-4"}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    placeholder={f.namePlaceholder}
                    dir={isRtl ? "rtl" : "ltr"}
                    className={`w-full py-4 rounded-2xl bg-secondary/40 border transition-all duration-300 text-foreground placeholder:text-muted-foreground/40 text-base
                      ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"}
                      ${
                        errors.name
                          ? "border-destructive/60 focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                          : "border-border/50 hover:border-primary/45 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_20px_hsl(var(--neon-purple)/0.15)]"
                      } focus:outline-none`}
                  />
                </div>
                {errors.name && (
                  <p className="text-destructive text-xs px-1">{errors.name}</p>
                )}
              </div>

              {/* Email input */}
              <div className="space-y-2 text-start relative z-10">
                <label className="block text-sm font-bold text-foreground/90">
                  {f.emailLabel}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60 ${isRtl ? "right-4" : "left-4"}`} />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder={f.emailPlaceholder}
                    dir="ltr"
                    className={`w-full py-4 rounded-2xl bg-secondary/40 border transition-all duration-300 text-foreground placeholder:text-muted-foreground/40 text-base text-start
                      ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"}
                      ${
                        errors.email
                          ? "border-destructive/60 focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                          : "border-border/50 hover:border-primary/45 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_20px_hsl(var(--neon-purple)/0.15)]"
                      } focus:outline-none`}
                  />
                </div>
                {errors.email && (
                  <p className="text-destructive text-xs px-1">{errors.email}</p>
                )}
              </div>

              {/* Message Input */}
              <div className="space-y-2 text-start relative z-10">
                <label className="block text-sm font-bold text-foreground/90">
                  {f.messageLabel}
                </label>
                <div className="relative">
                  <MessageSquare className={`absolute top-5 w-5 h-5 text-muted-foreground/60 ${isRtl ? "right-4" : "left-4"}`} />
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: "" }));
                    }}
                    placeholder={f.messagePlaceholder}
                    dir={isRtl ? "rtl" : "ltr"}
                    className={`w-full py-4 rounded-2xl bg-secondary/40 border transition-all duration-300 text-foreground placeholder:text-muted-foreground/40 text-base resize-none
                      ${isRtl ? "pr-12 pl-4" : "pl-12 pr-4"}
                      ${
                        errors.message
                          ? "border-destructive/60 focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                          : "border-border/50 hover:border-primary/45 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:shadow-[0_0_20px_hsl(var(--neon-purple)/0.15)]"
                      } focus:outline-none`}
                  />
                </div>
                {errors.message && (
                  <p className="text-destructive text-xs px-1">{errors.message}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 relative z-10">
                <motion.button
                  type="submit"
                  disabled={isSending}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 30px hsl(var(--neon-purple)/0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base gradient-purple text-primary-foreground neon-glow transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSending ? (
                    <span>{f.sending}</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{f.send}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          ) : (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.35 }}
              className="glass-strong rounded-3xl p-12 neon-border text-center relative overflow-hidden"
            >
              {/* Subtle inner glow */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, hsl(var(--neon-purple)/0.07) 0%, transparent 70%)",
                }}
              />
              <div className="relative w-24 h-24 mx-auto mb-8 relative z-10">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.15 }}
                  className="absolute inset-0 rounded-full gradient-purple neon-glow-strong flex items-center justify-center"
                >
                  <CheckCircle2 className="w-11 h-11 text-primary-foreground" />
                </motion.div>
                <motion.div
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-2 border-primary/60"
                />
              </div>

              <motion.h3
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold gradient-text mb-3 relative z-10"
              >
                {t("contact.success.title")}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="text-muted-foreground text-sm max-w-sm mx-auto relative z-10"
              >
                {t("contact.success.message")}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ContactSection;
