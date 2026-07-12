import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  Globe,
  MapPin,
  ShoppingCart,
  Palette,
  Shield,
  Video,
  Bot,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const SolutionsSection = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const isDedicatedPage = location.pathname === "/solutions";

  const solutions = [
    { key: "sol.digital", icon: Globe },
    { key: "sol.local", icon: MapPin },
    { key: "sol.ecommerce", icon: ShoppingCart },
    { key: "sol.brand", icon: Palette },
    { key: "sol.trust", icon: Shield },
    { key: "sol.video", icon: Video },
    { key: "sol.ai", icon: Bot },
  ];

  return (
    <section id="solutions" className="section-padding relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal>
          {isDedicatedPage ? (
            <h1 className="text-3xl md:text-5xl font-bold text-center gradient-text mb-16">
              {t("solutions.title")}
            </h1>
          ) : (
            <h2 className="text-3xl md:text-5xl font-bold text-center gradient-text mb-16">
              {t("solutions.title")}
            </h2>
          )}
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {solutions.map((sol, i) => (
            <ScrollReveal key={sol.key} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6, scale: 1.05 }}
                className="glass rounded-2xl p-6 neon-border text-center card-3d"
              >
                <div className="w-12 h-12 mx-auto rounded-xl gradient-purple flex items-center justify-center mb-4 neon-glow">
                  <sol.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="font-semibold text-foreground text-sm">
                  {t(sol.key)}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
