import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Eye, Target, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const WHATSAPP = "https://wa.me/967780930635";

const AboutSection = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const cards = [
    { icon: Eye, title: t("about.vision.title"), desc: t("about.vision.desc") },
    {
      icon: Target,
      title: t("about.mission.title"),
      desc: t("about.mission.desc"),
    },
    {
      icon: Heart,
      title: t("about.values.title"),
      desc: t("about.values.desc"),
    },
  ];

  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold text-center gradient-text mb-14">
            {t("about.title")}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <ScrollReveal
              key={i}
              delay={i * 0.15}
              direction={i === 0 ? "left" : i === 2 ? "right" : "up"}
            >
              <motion.div
                whileHover={{ y: -6 }}
                className="glass rounded-2xl p-8 neon-border h-full hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-xl gradient-purple flex items-center justify-center mb-6 neon-glow">
                  <card.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {card.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 gradient-purple text-primary-foreground rounded-xl neon-glow font-medium transition-all hover:scale-105"
            >
              {t("about.cta")}
            </a>
            <button
              onClick={() => { navigate("/about"); window.scrollTo(0, 0); }}
              className="px-6 py-3 glass rounded-xl neon-border text-foreground hover:text-primary hover:bg-primary/5 transition-all font-medium"
            >
              {lang === "ar" ? "قراءة المزيد عن قصتنا" : lang === "zh" ? "阅读更多关于我们的故事" : "Read more about our story"}
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
