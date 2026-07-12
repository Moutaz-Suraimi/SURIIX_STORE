import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const WHATSAPP_NUMBER = "967780930635";
type LangKey = "ar" | "en" | "zh";

interface PackageData {
  id: string;
  category: "design" | "web" | "store";
  icon: string;
  name: { ar: string; en: string; zh: string };
  desc: { ar: string; en: string; zh: string };
  price: string;
  oldPrice?: string;
  currency: { ar: string; en: string; zh: string };
  badge?: { ar: string; en: string; zh: string };
  badgeType?: "popular" | "bestseller";
  features: { ar: string; en: string; zh: string }[];
  cardStyle: "advanced" | "proweb" | "storepro" | "default";
}

const packagesData: PackageData[] = [
  // ================= DESIGN PACKAGES =================
  {
    id: "design-single",
    category: "design",
    icon: "🎨",
    name: {
      ar: "باقة التصميم المفردة",
      en: "Single Design Package",
      zh: "单次设计套餐"
    },
    desc: {
      ar: "مثالية للمشاريع الشخصية واحتياجات الهوية البسيطة.",
      en: "Perfect for personal projects and simple branding needs.",
      zh: "非常适合个人项目和简单的品牌需求。"
    },
    price: "5,000",
    currency: { ar: "ريال يمني", en: "YER", zh: "YER" },
    features: [
      { ar: "1 تصميم احترافي", en: "1 Professional Design", zh: "1 个专业设计" },
      { ar: "كتابة محتوى مجانية", en: "Free Copywriting", zh: "免费文案写作" },
      { ar: "تعديلين مجانيين (2)", en: "2 Free Revisions", zh: "2 次免费修改" },
      { ar: "تسليم سريع ومميز", en: "Fast Delivery", zh: "快速交付" }
    ],
    cardStyle: "default"
  },
  {
    id: "design-double",
    category: "design",
    icon: "✨",
    name: {
      ar: "باقة التصميم المزدوجة",
      en: "Double Design Package",
      zh: "双重设计套餐"
    },
    desc: {
      ar: "تنوع أفضل للمحتوى لزيادة الحضور الاجتماعي المتنامي.",
      en: "Better content variety for growing social presence.",
      zh: "为不断增长的社交平台提供更丰富的内容多样性。"
    },
    price: "8,500",
    currency: { ar: "ريال يمني", en: "YER", zh: "YER" },
    features: [
      { ar: "2 تصاميم احترافية", en: "2 Professional Designs", zh: "2 个专业设计" },
      { ar: "محتوى تسويقي إبداعي", en: "Creative Marketing Content", zh: "创意营销内容" },
      { ar: "تعديلين مجانيين (2)", en: "2 Free Revisions", zh: "2 次免费修改" },
      { ar: "تسليم سريع ومميز", en: "Fast Delivery", zh: "快速交付" }
    ],
    cardStyle: "default"
  },
  {
    id: "design-basic",
    category: "design",
    icon: "💎",
    name: {
      ar: "الباقة الأساسية",
      en: "Basic Package",
      zh: "基础设计套餐"
    },
    desc: {
      ar: "حضور بصري قوي للعلامات التجارية والشركات.",
      en: "Strong visual presence for brands and businesses.",
      zh: "为品牌和企业打造强有力的视觉形象。"
    },
    price: "25,000",
    currency: { ar: "ريال يمني", en: "YER", zh: "YER" },
    features: [
      { ar: "6 تصاميم احترافية", en: "6 Professional Designs", zh: "6 个专业设计" },
      { ar: "كتابة محتوى مجانية", en: "Free Copywriting", zh: "免费文案写作" },
      { ar: "تعديلات مجانية مفتوحة", en: "Free Revisions", zh: "免费修改" },
      { ar: "ملحقات تصاميم شبكات التواصل", en: "Social Media Design Assets", zh: "社交媒体设计资产" }
    ],
    cardStyle: "default"
  },
  {
    id: "design-advanced",
    category: "design",
    icon: "🔥",
    name: {
      ar: "الباقة المتقدمة",
      en: "Advanced Package",
      zh: "高级设计套餐"
    },
    desc: {
      ar: "الباقة الأكثر طلباً لإنشاء محتوى متميز واحترافي.",
      en: "The most requested package for premium content creation.",
      zh: "最受欢迎的高级内容创作套餐。"
    },
    price: "45,000",
    oldPrice: "55,000",
    currency: { ar: "ريال يمني", en: "YER", zh: "YER" },
    badge: { ar: "الأكثر طلباً 🔥", en: "Most Popular 🔥", zh: "最受欢迎 🔥" },
    badgeType: "popular",
    features: [
      { ar: "12 تصميم + 1 تصميم مجاني", en: "12 Designs + 1 Free", zh: "12 个设计 + 1 个免费" },
      { ar: "كتابة محتوى تسويقي متكامل", en: "Full Marketing Content", zh: "完整营销内容" },
      { ar: "قالب قصص (Story Template)", en: "Story Template", zh: "快拍模板" },
      { ar: "تصميم غلاف للحسابات", en: "Cover Design", zh: "封面设计" },
      { ar: "3 تعديلات مجانية", en: "3 Free Revisions", zh: "3 次免费修改" },
      { ar: "تحسين المظهر البصري للهوية", en: "Brand Visual Improvement", zh: "品牌视觉形象提升" }
    ],
    cardStyle: "advanced"
  },
  {
    id: "design-ultimate",
    category: "design",
    icon: "👑",
    name: {
      ar: "الباقة النهائية (Ultimate)",
      en: "Ultimate Package",
      zh: "至尊设计套餐"
    },
    desc: {
      ar: "حل متكامل للهوية البصرية وإدارة المحتوى بالكامل.",
      en: "Complete visual identity and content management solution.",
      zh: "完整的视觉识别与内容管理解决方案。"
    },
    price: "85,000",
    oldPrice: "110,000",
    currency: { ar: "ريال يمني", en: "YER", zh: "YER" },
    features: [
      { ar: "24 تصميم + 2 مجاني", en: "24 Designs + 2 Free", zh: "24 个设计 + 2 个免费" },
      { ar: "خطة محتوى شهرية متكاملة", en: "Monthly Content Plan", zh: "月度内容规划" },
      { ar: "أيقونات هايلايت مخصصة", en: "Highlight Icons", zh: "精选图标" },
      { ar: "تصميم غلاف احترافي مميز", en: "Premium Cover Design", zh: "高级封面设计" },
      { ar: "قوالب قصص (Story Templates)", en: "Story Templates", zh: "快拍模板" },
      { ar: "تسليم منظم ومنسق أسبوعياً", en: "Weekly Organized Delivery", zh: "每周定期交付" },
      { ar: "دعم فني كامل لإدارة المحتوى", en: "Content Management Support", zh: "内容管理支持" }
    ],
    cardStyle: "default"
  },

  // ================= WEB PACKAGES =================
  {
    id: "web-start",
    category: "web",
    icon: "🚀",
    name: {
      ar: "انطلاقة الويب (Start)",
      en: "Start Web",
      zh: "Start Web"
    },
    desc: {
      ar: "مثالية للشركات الناشئة والمشاريع الصغيرة.",
      en: "Ideal for startups and small businesses.",
      zh: "初创公司和小微企业的理想之选。"
    },
    price: "149",
    currency: { ar: "$", en: "$", zh: "$" },
    features: [
      { ar: "صفحة هبوط احترافية (Landing Page)", en: "Professional Landing Page", zh: "专业落地页" },
      { ar: "ربط وتكامل مع واتساب", en: "WhatsApp Integration", zh: "整合 WhatsApp" },
      { ar: "نموذج اتصال للزوار", en: "Contact Form", zh: "联系表单" },
      { ar: "تصميم متجاوب بالكامل مع الهواتف", en: "Responsive Design", zh: "响应式设计" },
      { ar: "استضافة ودومين مجاني لمدة سنة كاملة", en: "1 Year Hosting + Domain", zh: "1 年免费主机 + 域名" },
      { ar: "حماية وأمان للموقع", en: "Basic Security", zh: "基础安全防护" },
      { ar: "تسليم سريع ومميز", en: "Fast Delivery", zh: "快速交付" }
    ],
    cardStyle: "default"
  },
  {
    id: "web-pro",
    category: "web",
    icon: "⚡",
    name: {
      ar: "الويب الاحترافي (Pro)",
      en: "Pro Web",
      zh: "Pro Web"
    },
    desc: {
      ar: "حل احترافي متوازن للشركات والمشاريع المتنامية.",
      en: "Balanced professional solution for companies and growing businesses.",
      zh: "针对公司 and 成长型企业的平衡专业解决方案。"
    },
    price: "249",
    currency: { ar: "$", en: "$", zh: "$" },
    badge: { ar: "الأكثر طلباً 🔥", en: "Most Popular 🔥", zh: "最受欢迎 🔥" },
    badgeType: "popular",
    features: [
      { ar: "جميع ميزات باقة انطلاقة الويب", en: "Everything in Start Web", zh: "包含 Web 基础版的所有内容" },
      { ar: "موقع متعدد الصفحات (حتى 5 صفحات)", en: "Multi-page Website", zh: "多页网站" },
      { ar: "تهيئة أساسية لمحركات البحث SEO", en: "Basic SEO Optimization", zh: "基础 SEO 优化" },
      { ar: "بريد إلكتروني رسمي للشركة", en: "Professional Email", zh: "专业企业邮箱" },
      { ar: "لوحة تحكم للمحتوى سهلة الإدارة", en: "Easy Admin Panel", zh: "易用管理后台" },
      { ar: "تحسين كامل لسرعة وأداء الموقع", en: "Performance Optimization", zh: "性能与加载速度优化" },
      { ar: "تنسيق وتصميم داخلي احترافي", en: "Professional Internal Layout", zh: "专业内部页面布局" },
      { ar: "ربط وتفعيل خرائط جوجل", en: "Google Maps Integration", zh: "集成谷歌地图" }
    ],
    cardStyle: "proweb"
  },
  {
    id: "web-elite",
    category: "web",
    icon: "👑",
    name: {
      ar: "الويب الممتاز (Elite)",
      en: "Elite Web",
      zh: "Elite Web"
    },
    desc: {
      ar: "تجربة ويب راقية للعلامات التجارية والشركات المتقدمة.",
      en: "Premium web experience for brands and advanced businesses.",
      zh: "为品牌和先进企业量身打造的顶级网页体验。"
    },
    price: "399",
    currency: { ar: "$", en: "$", zh: "$" },
    features: [
      { ar: "جميع ميزات باقة الويب الاحترافي", en: "Everything in Pro Web", zh: "包含 Web 专业版的所有内容" },
      { ar: "تصميم واجهات UI/UX احترافي ومبتكر", en: "Professional UI/UX", zh: "专业且深度的 UI/UX 设计" },
      { ar: "أمان متطور وحماية إضافية للبيانات", en: "Advanced Security", zh: "高级安全与防护系统" },
      { ar: "تهيئة متقدمة لمحركات البحث SEO", en: "Advanced SEO", zh: "高级 SEO 搜索引擎优化" },
      { ar: "تجربة مستخدم تفاعلية ومحسنة", en: "Enhanced User Experience", zh: "更佳的用户交互体验" },
      { ar: "دعم فني متميز ومباشر VIP", en: "VIP Support", zh: "VIP 专属技术支持" },
      { ar: "تحسين شامل لسرعة التحميل والأداء", en: "Full Performance Optimization", zh: "极致性能与速度优化" },
      { ar: "تأثيرات وحركات تفاعلية جذابة", en: "Interactive Animations", zh: "丰富高级的交互式动效" },
      { ar: "صفحات أعمال مخصصة ومصممة خصيصاً", en: "Custom Business Pages", zh: "根据业务需求定制开发页面" }
    ],
    cardStyle: "default"
  },

  // ================= STORE PACKAGES =================
  {
    id: "store-start",
    category: "store",
    icon: "🛍️",
    name: {
      ar: "انطلاقة المتجر (Start)",
      en: "Store Start",
      zh: "Store Start"
    },
    desc: {
      ar: "نقطة انطلاق مثالية لبدء التجارة الإلكترونية.",
      en: "Perfect starting point for eCommerce businesses.",
      zh: "开启电子商务的理想起点。"
    },
    price: "299",
    currency: { ar: "$", en: "$", zh: "$" },
    features: [
      { ar: "متجر إلكتروني متكامل", en: "Full Online Store", zh: "完整独立的电子商务网站" },
      { ar: "لوحة تحكم لإدارة المنتجات والطلبات", en: "Product Management", zh: "商品与品类轻松管理" },
      { ar: "ربط وتكامل بوابات الدفع الإلكتروني", en: "Payment Integration", zh: "对接在线支付网关" },
      { ar: "تصميم متجاوب وسلس على جميع الهواتف", en: "Responsive Design", zh: "完美兼容移动端响应式设计" },
      { ar: "صفحات السياسات والشروط القانونية", en: "Policies Page", zh: "政策与条款相关页面" },
      { ar: "استضافة ودومين مجاني لمدة سنة", en: "Hosting + Domain", zh: "包含主机与域名" },
      { ar: "لوحة تحكم إدارية مبسطة وسهلة", en: "Admin Dashboard", zh: "直观的管理后台面板" },
      { ar: "ربط أيقونة الواتساب للمبيعات المباشرة", en: "WhatsApp Integration", zh: "集成 WhatsApp 快捷联系" }
    ],
    cardStyle: "default"
  },
  {
    id: "store-pro",
    category: "store",
    icon: "⭐",
    name: {
      ar: "المتجر الاحترافي (Pro)",
      en: "Store Pro",
      zh: "Store Pro"
    },
    desc: {
      ar: "حل مثالي لتوسيع وزيادة مبيعات المتاجر الإلكترونية.",
      en: "Optimized solution for scaling online stores.",
      zh: "助力在线商店规模化增长的优化方案。"
    },
    price: "499",
    currency: { ar: "$", en: "$", zh: "$" },
    badge: { ar: "الأكثر مبيعاً ⭐", en: "Best Seller ⭐", zh: "畅销热卖 ⭐" },
    badgeType: "bestseller",
    features: [
      { ar: "جميع ميزات باقة انطلاقة المتجر", en: "Everything in Store Start", zh: "包含商城 Entry的所有功能" },
      { ar: "ربط شركات الشحن والتوصيل التلقائي", en: "Shipping Integration", zh: "对接主流物流配送服务" },
      { ar: "صفحات العروض الخاصة وكوبونات الخصم", en: "Offer & Discount Pages", zh: "专属优惠与促销活动页面" },
      { ar: "تحسين سرعة وأداء المتجر الإلكتروني", en: "Store Speed Optimization", zh: "独立站整站速度与性能优化" },
      { ar: "تحسين SEO لصفحات ومنتجات المتجر", en: "Product SEO", zh: "商品详情页 SEO 搜索引擎优化" },
      { ar: "تنسيق وتخطيط احترافي لعرض المنتجات", en: "Professional Product Layouts", zh: "专业级的商品展示排版" },
      { ar: "تقارير وتحليلات المبيعات والأرباح", en: "Basic Sales Reports", zh: "基础销售额与订单数据报表" },
      { ar: "تحسين تجربة السلة والدفع لزيادة المبيعات", en: "Improved Checkout Experience", zh: "优化结账流程以提升付款率" }
    ],
    cardStyle: "storepro"
  },
  {
    id: "store-elite",
    category: "store",
    icon: "💎",
    name: {
      ar: "المتجر الممتاز (Elite)",
      en: "Store Elite",
      zh: "Store Elite"
    },
    desc: {
      ar: "نظام تجاري متكامل ومتميز للعلامات التجارية الكبرى.",
      en: "Complete premium eCommerce ecosystem for brands.",
      zh: "为品牌打造的高级全渠道电商生态系统。"
    },
    price: "799",
    currency: { ar: "$", en: "$", zh: "$" },
    features: [
      { ar: "جميع ميزات باقة المتجر الاحترافي", en: "Everything in Store Pro", zh: "包含商城 Pro的所有功能" },
      { ar: "تصميم متجر إلكتروني راقي ومخصص بالكامل", en: "Premium Store Design", zh: "品牌定制的高端视觉独立站设计" },
      { ar: "نظام متطور لإدارة الكوبونات والخصومات", en: "Advanced Coupon System", zh: "高级优惠券及精细化促销系统" },
      { ar: "أتمتة الطلبات وإرسال الفواتير تلقائياً", en: "Order Automation", zh: "订单处理与通知流程自动化" },
      { ar: "أمان متطور لحماية بوابات الدفع والبيانات", en: "Advanced Security", zh: "全站高级安全加密与防欺诈系统" },
      { ar: "تحسين معدلات التحويل CRO لزيادة الأرباح", en: "Conversion Optimization", zh: "转化率优化（CRO）以最大化利润" },
      { ar: "صفحات هبوط ترويجية مخصصة للمنتجات", en: "Landing Pages", zh: "高转化单品特写推广落地页" },
      { ar: "دعم فني مباشر على مدار الساعة VIP", en: "VIP Support", zh: "VIP 级优先响应与运维支持" },
      { ar: "تحسين كامل وشامل لأداء وسرعة المتجر", en: "Full Store Optimization", zh: "整站全面诊断与极致性能调优" },
      { ar: "تجربة مستخدم راقية واستثنائية للشراء", en: "Premium User Experience", zh: "极致流畅尊贵的买家购物体验" }
    ],
    cardStyle: "default"
  }
];

// ================= SUB-COMPONENTS =================

// 1. Badge Component
const Badge = ({ text, type }: { text: string; type?: "popular" | "bestseller" }) => {
  const gradientClass = type === "bestseller" 
    ? "bg-gradient-to-r from-amber-500 to-orange-500" 
    : "gradient-purple";

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${gradientClass} border border-white/10`}
    >
      <Star className="w-3.5 h-3.5 fill-current text-white text-2xs" />
      <span>{text}</span>
    </motion.span>
  );
};

// 2. FeatureList Component
const FeatureList = ({ features, lang }: { features: { ar: string; en: string; zh: string }[]; lang: LangKey }) => {
  return (
    <ul className="space-y-3 my-5 flex-1">
      {features.map((feature, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 text-sm text-foreground/80 dark:text-foreground/90 font-medium"
        >
          <div className="rounded-full p-0.5 bg-primary/10 dark:bg-primary/20 shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="leading-tight text-start">{feature[lang]}</span>
        </li>
      ))}
    </ul>
  );
};

// 3. PricingHeader Component
const PricingHeader = ({ lang, isDedicatedPage }: { lang: LangKey; isDedicatedPage: boolean }) => {
  const title = lang === "ar" ? "باقاتنا والأسعار" : lang === "zh" ? "我们的套餐与价格" : "Our Packages & Pricing";
  const subtitle = lang === "ar" 
    ? "حلول رقمية احترافية مصممة لتنمية علامتك التجارية وأعمالك." 
    : lang === "zh" 
    ? "专为您的品牌和业务增长而设计的专业数字解决方案。" 
    : "Professional digital solutions designed to grow your brand and business.";
  
  const badgeLabel = lang === "ar" ? "خطط الأسعار" : lang === "zh" ? "价格方案" : "Pricing Plans";

  return (
    <ScrollReveal>
      <div className="text-center mb-12 relative px-4">
        <div className="absolute left-1/2 -top-12 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[90px] rounded-full pointer-events-none" />

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-xs font-bold text-primary mb-5"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          {badgeLabel}
        </motion.span>

        {isDedicatedPage ? (
          <h1 className="text-2xl md:text-5.5xl font-black gradient-text mb-4 leading-tight tracking-tight">
            {title}
          </h1>
        ) : (
          <h2 className="text-2xl md:text-5.5xl font-black gradient-text mb-4 leading-tight tracking-tight">
            {title}
          </h2>
        )}
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>
    </ScrollReveal>
  );
};

// 4. FilterTabs Component
const FilterTabs = ({
  activeTab,
  setActiveTab,
  lang,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: LangKey;
}) => {
  const tabs = [
    { id: "all", label: { ar: "الكل", en: "All", zh: "全部" } },
    { id: "design", label: { ar: "باقات التصميم", en: "Design Packages", zh: "设计套餐" } },
    { id: "web", label: { ar: "باقات الويب", en: "Web Packages", zh: "网页套餐" } },
    { id: "store", label: { ar: "باقات المتاجر", en: "Store Packages", zh: "电商套餐" } },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-none mb-12 px-4">
      <div className="flex justify-start md:justify-center items-center gap-2 p-1 py-1.5 min-w-max md:min-w-0 md:max-w-max mx-auto rounded-2xl glass border border-border/40 dark:border-slate-800">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors duration-300 whitespace-nowrap shrink-0 ${
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-xl gradient-purple shadow-[0_0_20px_hsl(var(--neon-purple)/0.35)]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <span className="relative z-10">{tab.label[lang]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 5. PackageCard Component
const PackageCard = ({ pkg, lang }: { pkg: PackageData; lang: LangKey }) => {

  const sendWhatsApp = () => {
    const currencyName = pkg.currency[lang];
    const messageTemplate = {
      ar: `مرحباً Suriix، أنا مهتم بـ "${pkg.name.ar}" (بسعر ${pkg.price} ${currencyName}) وأريد معرفة التفاصيل والبدء بالمشروع.`,
      en: `Hello Suriix, I'm interested in the "${pkg.name.en}" (priced at ${pkg.price} ${currencyName}) and would like to get more details to start.`,
      zh: `您好 Suriix，我对您的“${pkg.name.zh}”（价格：${pkg.price} ${currencyName}）套餐非常感兴趣，希望能了解详情并开始项目合作。`
    };
    const msg = messageTemplate[lang] || messageTemplate.en;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const ctaLabel = lang === "ar" ? "اطلب هذه الباقة الآن" : lang === "zh" ? "立即订购此套餐" : "Order This Package Now";

  const isAdvanced = pkg.cardStyle === "advanced";
  const isProWeb = pkg.cardStyle === "proweb";
  const isStorePro = pkg.cardStyle === "storepro";
  const isFeatured = isAdvanced || isProWeb || isStorePro;

  // Outer container border classes for uniform layout matching
  let borderBgClass = "bg-border/30 dark:bg-border/20";
  if (isAdvanced) {
    borderBgClass = "bg-transparent";
  } else if (isProWeb) {
    borderBgClass = "bg-gradient-to-b from-primary/50 via-accent/30 to-transparent";
  } else if (isStorePro) {
    borderBgClass = "bg-gradient-to-b from-accent/50 via-primary/30 to-transparent";
  }

  // Inner background styles
  let innerBgClass = "bg-card/75 dark:bg-card/45";
  if (isFeatured) {
    innerBgClass = "bg-card/90 dark:bg-[#070b1a]/90 backdrop-blur-xl shadow-lg";
  }

  // Pure CSS pulsing neon glow for Store Pro to prevent state re-renders
  const glowShadow = isStorePro
    ? "shadow-[0_0_30px_hsl(var(--neon-purple)/0.25)] border border-primary/40"
    : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        scale: isAdvanced ? 1.03 : 1.02,
        y: isFeatured ? -12 : -6,
        boxShadow: isFeatured
          ? "0 20px 40px rgba(168, 85, 247, 0.25)"
          : "0 10px 25px rgba(0, 0, 0, 0.2)",
      }}
      className={`relative rounded-2xl flex flex-col justify-between overflow-hidden cursor-default transition-all duration-300 p-[1.5px] h-full ${
        isAdvanced ? "lg:scale-[1.03] z-10" : ""
      } ${borderBgClass} ${glowShadow}`}
    >
      {/* 1. Rotating Conic border gradient animation for Advanced Design Package */}
      {isAdvanced && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-[-120%] bg-[conic-gradient(from_0deg,transparent_30%,hsl(var(--primary))_50%,hsl(var(--accent))_70%,transparent_100%)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Actual inner card content container */}
      <div className={`relative z-10 rounded-[15px] p-5 md:p-6 h-full w-full flex flex-col justify-between transition-colors duration-300 ${innerBgClass}`}>
        
        {/* Floating wrapper for Pro Web. Separating continuous y-axis float from hover lifts prevents animation fight lag */}
        <motion.div
          className="flex-1 flex flex-col justify-between"
          animate={isProWeb ? { y: [0, -6, 0] } : {}}
          transition={isProWeb ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : {}}
        >
          <div>
            {/* Top Row: Icon and Badge */}
            <div className="flex justify-between items-start mb-5">
              <div className="text-4xl bg-primary/10 rounded-xl w-14 h-14 flex items-center justify-center border border-primary/20">
                {pkg.icon}
              </div>
              {pkg.badge && (
                <Badge text={pkg.badge[lang]} type={pkg.badgeType} />
              )}
            </div>

            {/* Name & Description */}
            <h3 className="text-xl md:text-2xl font-black text-foreground mb-2 text-start">
              {pkg.name[lang]}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mb-6 text-start leading-relaxed h-12 line-clamp-2">
              {pkg.desc[lang]}
            </p>

            {/* Price Container */}
            <div className="pt-5 border-t border-border/30 mb-6 flex flex-col items-start">
              {pkg.oldPrice && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs md:text-sm line-through text-muted-foreground/60 decoration-destructive/70 decoration-2">
                    {pkg.oldPrice} {pkg.currency[lang]}
                  </span>
                  <span className="text-2xs font-bold text-destructive px-1.5 py-0.5 rounded bg-destructive/10">
                    {lang === "ar" ? "خصم" : lang === "zh" ? "特惠" : "SAVE"}
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl md:text-4.5xl font-black text-foreground tracking-tight">
                  {pkg.price}
                </span>
                <span className="text-xs md:text-sm font-bold text-primary">
                  {pkg.currency[lang]}
                </span>
              </div>
            </div>

            {/* Features Header */}
            <div className="text-2xs font-bold uppercase tracking-wider text-muted-foreground/80 mb-3 text-start">
              {lang === "ar" ? "ماذا تشمل هذه الباقة؟" : lang === "zh" ? "套餐包含内容" : "What's included"}
            </div>

            {/* Features List */}
            <FeatureList features={pkg.features} lang={lang} />
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-5 border-t border-border/30">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={sendWhatsApp}
              className="w-full py-3 md:py-3.5 rounded-xl gradient-purple text-primary-foreground font-bold flex items-center justify-center gap-2.5 neon-glow hover:shadow-[0_0_35px_hsl(var(--neon-purple)/0.45)] transition-all duration-300 text-sm border border-white/10"
            >
              <MessageCircle className="w-4.5 h-4.5 fill-current" />
              <span>{ctaLabel}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </motion.button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

// ================= MAIN COMPONENT =================

interface PackagesSectionProps {
  isHome?: boolean;
}

const PackagesSection = ({ isHome = false }: PackagesSectionProps) => {
  const { lang } = useLanguage();
  const location = useLocation();
  const isDedicatedPage = location.pathname === "/packages" || !isHome;
  const [activeTab, setActiveTab] = useState("all");

  // On home page, we only show 2 high-converting featured packages to optimize load times and DOM size.
  const featuredIds = ["web-pro", "store-pro"];
  const displayPackages = isHome 
    ? packagesData.filter((pkg) => featuredIds.includes(pkg.id))
    : packagesData.filter((pkg) => {
        if (activeTab === "all") return true;
        return pkg.category === activeTab;
      });

  const noteText = lang === "ar"
    ? "جميع الباقات قابلة للتخصيص بالكامل حسب متطلبات مشروعك. تواصل معنا لنصمم لك الحل الأمثل."
    : lang === "zh"
    ? "所有套餐均可根据您的项目需求进行完全定制。联系我们为您设计最完美的解决方案。"
    : "All packages are fully customizable according to your project requirements. Contact us to design the perfect solution for you.";

  return (
    <section id="packages" className="py-14 md:py-32 px-4 sm:px-6 md:px-12 relative overflow-hidden bg-transparent">
      {/* Decorative Particle Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      {/* Decorative Glow Orbs (Static radial-gradient for zero paint overhead) */}
      <div 
        className="absolute top-1/4 start-0 w-[450px] h-[450px] rounded-full pointer-events-none" 
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute bottom-1/4 end-0 w-[350px] h-[350px] rounded-full pointer-events-none" 
        style={{
          background: "radial-gradient(circle, hsl(var(--accent) / 0.05) 0%, transparent 70%)"
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <PricingHeader lang={lang as LangKey} isDedicatedPage={isDedicatedPage} />

        {!isHome && (
          <FilterTabs activeTab={activeTab} setActiveTab={setActiveTab} lang={lang as LangKey} />
        )}

        {/* Dynamic Grid list of package cards with items-stretch to align card heights */}
        <motion.div 
          layout
          className={`grid gap-6 md:gap-8 items-stretch ${
            isHome 
              ? "grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto" 
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {displayPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} lang={lang as LangKey} />
            ))}
          </AnimatePresence>
        </motion.div>

        {isHome && (
          <ScrollReveal delay={0.1}>
            <div className="flex justify-center mt-12">
              <Link
                to="/packages"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-primary to-accent hover:shadow-[0_12px_24px_rgba(139,92,246,0.3)] hover:opacity-98 transition-all scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-lg border border-white/10"
              >
                <span>
                  {lang === "ar" 
                    ? "عرض جميع الباقات والأسعار" 
                    : lang === "zh" 
                    ? "查看所有套餐与价格" 
                    : "View All Packages & Pricing"}
                </span>
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </Link>
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.2}>
          <p className="text-center text-xs md:text-sm font-semibold text-foreground/80 mt-14 max-w-2xl mx-auto p-4 md:p-5 rounded-2xl glass border border-primary/25 shadow-md">
            ✨ {noteText}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PackagesSection;
