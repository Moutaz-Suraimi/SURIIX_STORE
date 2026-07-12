import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Settings,
  Layout,
  Paintbrush,
  Search,
  Zap,
  Shirt,
  Sparkles,
  Headphones,
  Coffee,
  Grid,
  FileText,
  Wand2,
  Store,
  ArrowRight,
  ArrowLeft,
  Eye,
  LogIn,
  TrendingUp,
  ShoppingBag,
  Percent,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const WHATSAPP_LINK = "https://wa.me/967780930635";

// Localized Content
const CONTENT = {
  ar: {
    hero: {
      badge: "Suriix Store",
      title1: "كل ما تحتاجه",
      title2: "لإدارة متجرك",
      desc: "اشتراك شهري — حلول رقمية متكاملة لنمو أعمالك. أنشئ متجرك الإلكتروني بسهولة عبر تعبئة بياناتك فقط، ونحن نتكفل بالباقي، تصميم احترافي، تجربة سلسة، وأدوات متكاملة لإدارة متجرك وتنمية مبيعاتك.",
      btnStart: "ابدأ متجرك الآن",
      btnBrowse: "تسجيل الدخول",
      mockup: {
        newCollection: "مجموعة جديدة",
        shopNow: "تسوق الآن",
        thisMonthSales: "مبيعات هذا الشهر",
        growth: "نمو مستمر",
        todaySales: "مبيعات اليوم",
        products: {
          sunglasses: "نظارات شمسية",
          perfume: "عطر فاخر",
          watch: "ساعة كلاسيكية",
        }
      }
    },
    features: {
      tag: "لماذا Suriix؟",
      title: "كل ما تحتاجه في اشتراك واحد",
      desc: "نوفر لك جميع الأدوات والميزات التي تحتاجها لإدارة متجرك وتحقيق نمو مستدام.",
      items: [
        {
          title: "أمان وموثوقية",
          text: "حماية متقدمة لبياناتك ومتجرك مع وقت تشغيل 99.9%.",
          icon: Shield,
        },
        {
          title: "إدارة متكاملة",
          text: "لوحة تحكم متكاملة لإدارة المنتجات، الطلبات، العملاء والتقارير.",
          icon: Settings,
        },
        {
          title: "قوالب لكل قطاع",
          text: "تصاميم احترافية تناسب جميع القطاعات ومتوافقة مع الجوال.",
          icon: Layout,
        },
        {
          title: "تخصيص بدون كود",
          text: "خصص الألوان والخطوط والتصميم بسهولة تامة بدون أي برمجة.",
          icon: Paintbrush,
        },
        {
          title: "تحسين لمحركات البحث",
          text: "تحسين تلقائي لظهور متجرك في نتائج البحث وزيادة زياراتك.",
          icon: Search,
        },
        {
          title: "تجربة دفع مبسطة",
          text: "عملية شراء سلسة وآمنة لعملائك تزيد من التحويلات والمبيعات.",
          icon: Zap,
        },
      ]
    },
    categories: {
      title: "اختر نوع متجرك",
      desc: "ننشئ لك متجراً احترافياً مناسباً لنشاطك خلال دقائق",
      items: [
        { label: "أزياء وملابس", icon: Shirt },
        { label: "عطور ومستحضرات تجميل", icon: Sparkles },
        { label: "إلكترونيات", icon: Headphones },
        { label: "مطاعم وكافيهات", icon: Coffee },
        { label: "وغيرها الكثير", icon: Grid },
      ]
    },
    workflow: {
      title: "كيف تعمل الخدمة؟",
      steps: [
        {
          num: "1",
          title: "أدخل بيانات متجرك",
          desc: "أدخل معلومات متجرك، نوع النشاط، الألوان والشعار والمنتجات.",
          icon: FileText,
        },
        {
          num: "2",
          title: "نقوم بإنشاء متجرك",
          desc: "نقوم بإنشاء متجر احترافي مخصص لنشاطك بشكل تلقائي.",
          icon: Wand2,
        },
        {
          num: "3",
          title: "ابدأ البيع مباشرة",
          desc: "متجرك جاهز لاستقبال العملاء، وابدأ البيع فوراً.",
          icon: Store,
        },
      ]
    },
    cta: {
      title: "جاهز للانطلاق؟",
      desc: "ابدأ رحلتك الآن مع Suriix واحصل على متجر احترافي يدعم نمو أعمالك.",
      btn: "ابدأ متجرك الآن",
    }
  },
  en: {
    hero: {
      badge: "Suriix Store",
      title1: "Everything You Need",
      title2: "To Manage Your Store",
      desc: "Monthly subscription — integrated digital solutions for your business growth. Build your online store easily by just filling in your details, and we take care of the rest: professional design, smooth experience, and integrated tools to manage your store and grow your sales.",
      btnStart: "Start Your Store Now",
      btnBrowse: "Login",
      mockup: {
        newCollection: "New Collection",
        shopNow: "Shop Now",
        thisMonthSales: "Sales This Month",
        growth: "Steady Growth",
        todaySales: "Today's Sales",
        products: {
          sunglasses: "Sunglasses",
          perfume: "Luxury Perfume",
          watch: "Classic Watch",
        }
      }
    },
    features: {
      tag: "Why Suriix?",
      title: "Everything in One Subscription",
      desc: "We provide you with all the tools and features you need to manage your store and achieve sustainable growth.",
      items: [
        {
          title: "Security & Reliability",
          text: "Advanced protection for your data and store with 99.9% uptime guarantees.",
          icon: Shield,
        },
        {
          title: "Integrated Management",
          text: "A unified dashboard to manage products, orders, customers, and reports.",
          icon: Settings,
        },
        {
          title: "Templates for All Sectors",
          text: "Professional layouts designed for all niches, fully mobile responsive.",
          icon: Layout,
        },
        {
          title: "No-Code Customization",
          text: "Easily adjust colors, fonts, and structures without writing a line of code.",
          icon: Paintbrush,
        },
        {
          title: "SEO Optimization",
          text: "Automatic enhancements to boost your store in search results and drive organic visits.",
          icon: Search,
        },
        {
          title: "Simplified Checkout",
          text: "A frictionless payment process that maximizes customer conversions and sales.",
          icon: Zap,
        },
      ]
    },
    categories: {
      title: "Choose Your Store Type",
      desc: "We build a professional store tailored to your niche in minutes",
      items: [
        { label: "Fashion & Clothing", icon: Shirt },
        { label: "Perfumes & Cosmetics", icon: Sparkles },
        { label: "Electronics", icon: Headphones },
        { label: "Restaurants & Cafes", icon: Coffee },
        { label: "And Much More", icon: Grid },
      ]
    },
    workflow: {
      title: "How Does It Work?",
      steps: [
        {
          num: "1",
          title: "Enter Store Details",
          desc: "Fill in your basic store info, niche, colors, logo, and initial products.",
          icon: FileText,
        },
        {
          num: "2",
          title: "We Build Your Store",
          desc: "We automatically generate a fully customized professional store for your brand.",
          icon: Wand2,
        },
        {
          num: "3",
          title: "Start Selling Instantly",
          desc: "Your storefront is live and ready to take orders. Launch and generate sales.",
          icon: Store,
        },
      ]
    },
    cta: {
      title: "Ready to Launch?",
      desc: "Begin your digital storefront journey with Suriix and scale your business.",
      btn: "Start Store Now",
    }
  },
  zh: {
    hero: {
      badge: "Suriix Store",
      title1: "管理店铺",
      title2: "所需的一切",
      desc: "按月订阅 — 助力业务增长的一站式数字解决方案。只需填写信息即可轻松创建您的在线商店，其余的由我们搞定：专业设计、流畅体验以及管理店铺和提高销量的完整工具。",
      btnStart: "立即创建您的店铺",
      btnBrowse: "登录",
      mockup: {
        newCollection: "新品上市",
        shopNow: "立即购买",
        thisMonthSales: "本月销售额",
        growth: "持续增长",
        todaySales: "今日销量",
        products: {
          sunglasses: "时尚墨镜",
          perfume: "高端香水",
          watch: "经典腕表",
        }
      }
    },
    features: {
      tag: "为什么选择 Suriix？",
      title: "一次订阅，拥有所需一切",
      desc: "我们为您提供管理店铺和实现持续增长所需的所有工具和功能。",
      items: [
        {
          title: "安全与可靠",
          text: "先进的数据和店铺保护，保障 99.9% 稳定运行时间。",
          icon: Shield,
        },
        {
          title: "一体化管理",
          text: "集成式后台轻松管理商品、订单、客户以及各类数据分析报表。",
          icon: Settings,
        },
        {
          title: "各行业专享模板",
          text: "专为不同行业打造的专业界面，完美适配各类移动端设备。",
          icon: Layout,
        },
        {
          title: "零代码自定义",
          text: "无需任何编程基础，即可轻松自定义拖拽颜色、字体与页面结构。",
          icon: Paintbrush,
        },
        {
          title: "搜索引擎优化",
          text: "自动对商品与店铺进行 SEO 优化，获得更多免费搜索引擎流量。",
          icon: Search,
        },
        {
          title: "极简支付体验",
          text: "提供流畅、安全且 frictionless 的付款结算流程，大幅度提升购买率。",
          icon: Zap,
        },
      ]
    },
    categories: {
      title: "选择您的店铺类型",
      desc: "我们将在几分钟内为您量身定制符合您商业方向的专业店铺",
      items: [
        { label: "时尚女装与鞋服", icon: Shirt },
        { label: "美妆护肤与香水", icon: Sparkles },
        { label: "数码电子与配件", icon: Headphones },
        { label: "轻餐茶饮与咖啡", icon: Coffee },
        { label: "以及更多行业", icon: Grid },
      ]
    },
    workflow: {
      title: "服务流程如何运作？",
      steps: [
        {
          num: "1",
          title: "提交开店资料",
          desc: "填写店铺的基础描述、行业方向、主色调、Logo以及您的主推商品。",
          icon: FileText,
        },
        {
          num: "2",
          title: "自动为您生成建站",
          desc: "我们根据您的品牌形象，极速自动化搭建定制出一套精美的交易独立站。",
          icon: Wand2,
        },
        {
          num: "3",
          title: "正式开售接单",
          desc: "您的店面正式上线发布，可直接进行全球或本地在线收款与发货。",
          icon: Store,
        },
      ]
    },
    cta: {
      title: "准备好开启您的独立站了吗？",
      desc: "立即加入 Suriix 开启您的电商新起点，助力企业跨步跃升。",
      btn: "立即开店",
    }
  }
};

interface SuriixStoreSectionProps {
  isHome?: boolean;
}

const SuriixStoreSection = ({ isHome = false }: SuriixStoreSectionProps) => {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const current = CONTENT[lang as keyof typeof CONTENT] || CONTENT.ar;
  const isRtl = lang === "ar";

  const handleStartStore = () => {
    navigate("/create-store");
  };

  const handleBrowseStore = () => {
    navigate("/create-store?mode=login");
  };

  return (
    <section id="suriix-store" className="pt-16 pb-0 md:py-32 px-4 sm:px-6 md:px-12 relative overflow-hidden w-full max-w-[100vw] bg-slate-50/40 dark:bg-transparent mx-auto text-center lg:text-start">
      {/* Decorative Orbs */}
      <div
        className="absolute top-1/4 start-0 w-64 h-64 md:w-[500px] md:h-[500px] rounded-full pointer-events-none opacity-20 dark:opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          filter: "blur(60px)"
        }}
      />
      <div
        className="absolute bottom-1/4 end-0 w-64 h-64 md:w-[400px] md:h-[400px] rounded-full pointer-events-none opacity-20 dark:opacity-10"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)",
          filter: "blur(60px)"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10 w-[92%] sm:w-full flex shrink-0 flex-col justify-center">
        
        {/* ================= HERO INTRO BLOCK ================= */}
        <div className="flex flex-col items-center mb-16 lg:mb-28 justify-center max-w-4xl mx-auto pt-8">
          
          {/* Texts & CTAs */}
          <div className="w-full flex flex-col text-center items-center justify-center">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase font-display">
                {current.hero.badge}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-[700] text-[30px] sm:text-3xl lg:text-5.5xl leading-[1.3] mb-4 text-foreground tracking-tight w-full break-words text-balance"
            >
              {current.hero.title1}{" "}
              <span className="gradient-text break-words">
                {current.hero.title2}
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-[15px] sm:text-lg text-slate-500 dark:text-muted-foreground/80 leading-[1.8] mb-8 font-medium"
            >
              {current.hero.desc}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-[12px] w-full sm:w-auto"
            >
              <button
                onClick={handleStartStore}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 rounded-full font-bold text-[17px] text-white bg-gradient-to-r from-primary to-accent hover:shadow-[0_12px_24px_rgba(139,92,246,0.3)] hover:opacity-98 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center h-[54px]"
              >
                <span>{current.hero.btnStart}</span>
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

              <button
                onClick={handleBrowseStore}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 rounded-full font-bold text-[17px] bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:bg-slate-100/80 dark:hover:bg-white/10 text-foreground transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm backdrop-blur-md text-center h-[54px]"
              >
                <LogIn className="w-5 h-5 text-muted-foreground shrink-0" />
                <span>{current.hero.btnBrowse}</span>
              </button>
            </motion.div>

          </div>

        </div>
        {isHome && (
          <ScrollReveal delay={0.3}>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate("/store")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary font-bold text-sm transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>
                  {lang === "ar"
                    ? "استكشف كافة ميزات وقدرات متجر سوريكس بالكامل"
                    : lang === "zh"
                    ? "探索 Suriix Store 的完整功能与特性"
                    : "Explore all features and capabilities of Suriix Store"}
                </span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </ScrollReveal>
        )}

        {!isHome && (
          <>
            {/* ================= FEATURES SECTION ================= */}
            <div className="mb-28 text-center">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-bold text-primary mb-5">
                  {current.features.tag}
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
                  {current.features.title}
                </h2>
                <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed mb-16">
                  {current.features.desc}
                </p>
              </ScrollReveal>

              {/* Grid list of feature cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {current.features.items.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <ScrollReveal key={idx} delay={idx * 0.05}>
                      <motion.div
                        whileHover={{ y: -6, scale: 1.015 }}
                        className="glass border border-slate-200/50 dark:border-white/5 bg-white/70 dark:bg-card/40 rounded-[2rem] p-6 text-start card-3d relative overflow-hidden group shadow-lg hover:shadow-[0_15px_30px_rgba(139,92,246,0.06)]"
                      >
                        {/* Icon Container with Gradient Border */}
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-800/80 flex items-center justify-center mb-6 group-hover:border-primary/45 transition-colors duration-300">
                          <IconComp className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                        </div>

                        <h3 className="text-lg font-bold text-foreground mb-3 font-display">
                          {item.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                          {item.text}
                        </p>
                      </motion.div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>

            {/* ================= CATEGORIES SECTION ================= */}
            <div className="mb-28 text-center">
              <ScrollReveal>
                <h2 className="text-3xl font-extrabold text-foreground mb-3 tracking-tight">
                  {current.categories.title}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed mb-12">
                  {current.categories.desc}
                </p>
              </ScrollReveal>

              {/* Row of Category Pill Buttons */}
              <div className="w-full overflow-x-auto scrollbar-none py-4">
                <div className="flex justify-start md:justify-center items-center gap-4 min-w-max px-4">
                  {current.categories.items.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <ScrollReveal key={idx} delay={idx * 0.05}>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 text-sm font-bold text-foreground/80 hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:border-transparent transition-all shadow-md cursor-pointer hover:shadow-[0_8px_20px_rgba(139,92,246,0.2)]"
                        >
                          <IconComp className="w-5 h-5" />
                          <span>{item.label}</span>
                        </motion.button>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ================= WORKFLOW SECTION ================= */}
            <div className="mb-28 text-center relative">
              
              <ScrollReveal>
                <h2 className="text-3xl md:text-4.5xl font-extrabold text-foreground mb-16 tracking-tight">
                  {current.workflow.title}
                </h2>
              </ScrollReveal>

              {/* Connected Step Cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch relative">
                {current.workflow.steps.map((step, idx) => {
                  const IconComp = step.icon;
                  const isLast = idx === current.workflow.steps.length - 1;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-between relative group">
                      
                      {/* Step Card */}
                      <ScrollReveal delay={idx * 0.08} className="w-full h-full">
                        <motion.div
                          whileHover={{ y: -4 }}
                          className="bg-white/80 dark:bg-card/30 border border-slate-200/60 dark:border-white/5 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-lg hover:shadow-[0_15px_30px_rgba(0,0,0,0.03)] h-full relative"
                        >
                          {/* Step Number Badge */}
                          <span className="absolute top-4 start-4 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {step.num}
                          </span>

                          {/* Icon */}
                          <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-center mb-6">
                            <IconComp className="w-6 h-6 text-primary" />
                          </div>

                          <h3 className="text-lg font-bold text-foreground mb-3 font-display">
                            {step.title}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            {step.desc}
                          </p>

                        </motion.div>
                      </ScrollReveal>

                      {/* Flow Arrow (RTL direction arrows) */}
                      {!isLast && (
                        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8 pointer-events-none transform -translate-x-1/2 md:start-[100%]">
                          {isRtl ? (
                            <ArrowLeft className="w-8 h-8 text-primary/30 stroke-[1.5] animate-pulse" />
                          ) : (
                            <ArrowRight className="w-8 h-8 text-primary/30 stroke-[1.5] animate-pulse" />
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>

            {/* ================= BOTTOM CTA BANNER ================= */}
            <ScrollReveal>
              <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(99,102,241,0.25)]">
                
                {/* Background design elements */}
                <div className="absolute inset-0 bg-grid-bg opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] pointer-events-none dark:bg-[#0f172a]" />

                {/* Right Side (Arabic) / Left Side (English): Text */}
                <div className="flex flex-col text-start items-start justify-center max-w-xl relative z-10 text-white order-2 md:order-1">
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-display leading-tight">
                    {current.cta.title}
                  </h2>
                  <p className="text-white/80 text-sm md:text-base font-semibold leading-relaxed mb-8 max-w-md">
                    {current.cta.desc}
                  </p>
                  
                  {/* Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartStore}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-indigo-700 font-bold text-base shadow-lg transition-all cursor-pointer dark:bg-[#0f172a]"
                  >
                    <span>{current.cta.btn}</span>
                    {isRtl ? <ArrowLeft className="w-5 h-5 text-indigo-700" /> : <ArrowRight className="w-5 h-5 text-indigo-700" />}
                  </motion.button>
                </div>

                {/* Left Side (Arabic) / Right Side (English): Graphic */}
                <div className="relative w-44 h-44 md:w-56 md:h-56 flex items-center justify-center order-1 md:order-2">
                  
                  {/* Shopping Bag representation */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-32 h-36 md:w-36 md:h-44 relative bg-white/10 border border-white/20 rounded-2xl flex flex-col items-center justify-center shadow-xl backdrop-blur-md dark:bg-[#0f172a]"
                  >
                    {/* Bag handles */}
                    <div className="absolute -top-7 w-12 h-10 border-4 border-white/25 rounded-t-full" />
                    
                    {/* Brand Logo printed on bag */}
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white flex items-center justify-center shadow-md dark:bg-[#0f172a]">
                      <ShoppingBag className="w-7 h-7 md:w-8 md:h-8 text-indigo-600" />
                    </div>
                  </motion.div>

                  {/* Floating elements around bag */}
                  {/* Floating percent element */}
                  <motion.div
                    animate={{ y: [0, 8, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    className="absolute -top-2 left-2 w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-[10px] font-bold shadow-md backdrop-blur-sm dark:bg-[#0f172a]"
                  >
                    <Percent className="w-4 h-4 text-white" />
                  </motion.div>

                  {/* Floating analytics element */}
                  <motion.div
                    animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute bottom-4 -right-2 w-10 h-10 rounded-full bg-white/25 border border-white/35 flex items-center justify-center text-white shadow-lg backdrop-blur-sm dark:bg-[#0f172a]"
                  >
                    <TrendingUp className="w-5 h-5 text-white" />
                  </motion.div>

                </div>

              </div>
            </ScrollReveal>
          </>
        )}

      </div>
    </section>
  );
};

export default SuriixStoreSection;
