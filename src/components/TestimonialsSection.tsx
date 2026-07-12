import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { Link } from "react-router-dom";

interface Testimonial {
  name: { ar: string; en: string; zh: string };
  role: { ar: string; en: string; zh: string };
  text: { ar: string; en: string; zh: string };
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: { ar: "أحمد الصالح", en: "Ahmed Al-Saleh", zh: "艾哈迈德·萨利赫" },
    role: {
      ar: "مؤسس متجر إلكتروني",
      en: "E-Commerce Founder",
      zh: "电商创始人",
    },
    text: {
      ar: "فريق Suriix حوّل فكرتي إلى متجر إلكتروني ناجح. المبيعات تضاعفت خلال 3 أشهر!",
      en: "Suriix team turned my idea into a successful online store. Sales doubled in 3 months!",
      zh: "Suriix团队将我的想法变成了成功的在线商店。销售额在3个月内翻了一番！",
    },
    rating: 5,
  },
  {
    name: { ar: "سارة المنصور", en: "Sara Al-Mansour", zh: "萨拉·曼苏尔" },
    role: { ar: "مديرة تسويق", en: "Marketing Director", zh: "营销总监" },
    text: {
      ar: "احترافية عالية وتسليم في الوقت المحدد. الموقع الجديد رفع معدل التحويل بنسبة 200%",
      en: "Highly professional and on-time delivery. Our new website increased conversion rate by 200%",
      zh: "高度专业且按时交付。我们的新网站将转化率提高了200%",
    },
    rating: 5,
  },
  {
    name: { ar: "خالد العمري", en: "Khalid Al-Omari", zh: "哈立德·奥马里" },
    role: { ar: "صاحب مطعم", en: "Restaurant Owner", zh: "餐厅老板" },
    text: {
      ar: "نظام الطلبات الذي طوروه لنا غيّر طريقة عملنا بالكامل. أنصح بهم بشدة!",
      en: "The ordering system they built completely transformed our business. Highly recommend!",
      zh: "他们开发的订购系统彻底改变了我们的业务。强烈推荐！",
    },
    rating: 5,
  },
  {
    name: { ar: "فاطمة الزهراء", en: "Fatima Al-Zahra", zh: "法蒂玛·扎赫拉" },
    role: { ar: "مصممة أزياء", en: "Fashion Designer", zh: "时装设计师" },
    text: {
      ar: "الهوية البصرية التي صمموها تعكس رؤيتي بشكل مثالي. عمل إبداعي رائع!",
      en: "The brand identity they designed perfectly reflects my vision. Amazing creative work!",
      zh: "他们设计的品牌形象完美地反映了我的愿景。令人惊叹的创意作品！",
    },
    rating: 5,
  },
];

const TestimonialsSection = ({ isHome = false }: { isHome?: boolean }) => {
  const { t, lang } = useLanguage();
  const l = lang as "ar" | "en" | "zh";

  const displayTestimonials = isHome ? testimonials.slice(0, 3) : testimonials;

  return (
    <section
      id="testimonials"
      className="section-padding relative overflow-hidden"
    >
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-primary/5 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/3 w-60 h-60 rounded-full bg-accent/5 blur-[80px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold text-center gradient-text mb-4">
            {t("testimonials.title")}
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
            {t("testimonials.subtitle")}
          </p>
        </ScrollReveal>

        <div className={`grid gap-6 ${isHome ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
          {displayTestimonials.map((item, i) => (
            <ScrollReveal
              key={i}
              delay={i * 0.12}
              direction={i % 2 === 0 ? "left" : "right"}
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass rounded-2xl p-6 neon-border card-3d relative group h-full"
              >
                {/* Quote icon */}
                <Quote className="absolute top-4 end-4 w-8 h-8 text-primary/30 group-hover:text-primary/50 transition-colors" />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: item.rating }).map((_, s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 fill-primary text-primary drop-shadow-sm"
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-foreground/90 leading-relaxed mb-6 text-sm md:text-base">
                  "{item.text[l] || item.text.en}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center text-primary-foreground font-bold text-sm neon-glow">
                    {(item.name[l] || item.name.en).charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {item.name[l] || item.name.en}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.role[l] || item.role.en}
                    </p>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {isHome && (
          <ScrollReveal delay={0.2}>
            <div className="flex justify-center mt-12">
              <Link
                to="/testimonials"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-primary to-accent hover:shadow-[0_12px_24px_rgba(139,92,246,0.3)] hover:opacity-98 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg border border-white/10"
              >
                <span>
                  {lang === "ar" 
                    ? "عرض جميع آراء العملاء" 
                    : lang === "zh" 
                    ? "查看所有客户评价" 
                    : "View All Reviews"}
                </span>
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
