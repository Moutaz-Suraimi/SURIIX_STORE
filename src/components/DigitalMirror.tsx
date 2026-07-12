import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { EyeOff, Meh, Clock, TrendingDown } from "lucide-react";

const WHATSAPP_NUMBER = "967780930635";

const DigitalMirror = () => {
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState<string[]>([]);

  const options = [
    { key: "mirror.option1", desc: "mirror.option1.desc", icon: EyeOff },
    { key: "mirror.option2", desc: "mirror.option2.desc", icon: Meh },
    { key: "mirror.option3", desc: "mirror.option3.desc", icon: Clock },
    { key: "mirror.option4", desc: "mirror.option4.desc", icon: TrendingDown },
  ];

  const toggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const sendToWhatsApp = () => {
    const selectedLabels = selected.map((k) => t(k)).join("، ");
    const msg =
      lang === "ar"
        ? `مرحباً، هذا انعكاس مشروعي الرقمي:\n${selectedLabels}\n\nأرغب في تحسين حضوري الرقمي.`
        : `Hello, this is my digital project reflection:\n${selectedLabels}\n\nI'd like to improve my digital presence.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <section id="mirror" className="section-padding relative">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-center text-primary mb-4"
        >
          {t("mirror.title")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-lg text-muted-foreground mb-12"
        >
          {t("mirror.question")}
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {options.map((opt, i) => {
            const isSelected = selected.includes(opt.key);
            return (
              <motion.button
                key={opt.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(opt.key)}
                className={`p-6 rounded-2xl text-start transition-colors duration-300 hover:shadow-lg hover:shadow-primary/5 ${
                  isSelected
                    ? "glass-strong neon-glow-strong border-primary/50"
                    : "glass neon-border hover:border-primary/30"
                }`}
              >
                <opt.icon
                  className={`w-8 h-8 mb-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                />
                <h3
                  className={`text-lg font-semibold mb-1 ${isSelected ? "text-primary" : "text-foreground"}`}
                >
                  {t(opt.key)}
                </h3>
                <p className="text-sm text-muted-foreground">{t(opt.desc)}</p>
              </motion.button>
            );
          })}
        </div>

        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={sendToWhatsApp}
              className="px-8 py-4 rounded-2xl gradient-purple text-primary-foreground font-semibold neon-glow-strong hover:shadow-[0_0_40px_hsl(265_90%_60%/0.4)] transition-shadow"
            >
              {t("mirror.cta")}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DigitalMirror;
