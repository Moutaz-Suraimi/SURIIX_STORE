import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  schema?: object;
  noIndex?: boolean;
}

const siteUrl = "https://suriix.com";
const defaultOgImage = `${siteUrl}/favicon-192x192.png`;

// High-quality default localized meta tags for all static routes
const metaDefaults: Record<
  string,
  {
    title: { ar: string; en: string; zh: string };
    description: { ar: string; en: string; zh: string };
    keywords: { ar: string; en: string; zh: string };
  }
> = {
  "/": {
    title: {
      ar: "Suriix | سوريكس - تصميم مواقع ومتاجر إلكترونية احترافية",
      en: "Suriix | Professional Web Design & E-Commerce Solutions",
      zh: "Suriix | 专业网页设计与智能电商独立站开发",
    },
    description: {
      ar: "Suriix | سوريكس هي وكالة رقمية متخصصة في تصميم مواقع الإنترنت الاحترافية، وتطوير المتاجر الإلكترونية، وبناء الهوية البصرية، والحلول البرمجية المدعومة بالذكاء الاصطناعي.",
      en: "Suriix is a premier digital agency specializing in professional web design, customized e-commerce development, branding, and AI-driven business automation.",
      zh: "Suriix 是一家顶尖的数字化代理商，专注于高转化率网页设计、企业出海电商独立站开发、品牌视觉升级与人工智能系统定制服务。",
    },
    keywords: {
      ar: "تصميم مواقع, تصميم متاجر إلكترونية, برمجة مواقع, هوية بصرية, تسويق رقمي, وكالة رقمية, Suriix, سريكس, سوريكس, وكالة سوريكس",
      en: "web design, e-commerce development, website programming, visual identity, digital marketing, digital agency, Suriix, Suriix Agency",
      zh: "网页设计, 电商独立站, 网站开发, 品牌视觉, 数字营销, 数字化代理商, Suriix",
    },
  },
  "/about": {
    title: {
      ar: "من نحن | Suriix سوريكس",
      en: "About Us | Suriix",
      zh: "关于我们 | Suriix",
    },
    description: {
      ar: "تعرف على وكالة سوريكس الرقمية ورؤيتنا لتقديم حلول مبتكرة تسهم في نمو وانتشار أعمالك الرقمية.",
      en: "Learn about Suriix Digital Agency and our vision to deliver innovative solutions that drive growth for your business.",
      zh: "了解 Suriix 数字代理商以及我们为您的业务增长提供创新解决方案的愿景。",
    },
    keywords: {
      ar: "من نحن, رؤية سوريكس, وكالة رقمية, عن سوريكس",
      en: "about us, Suriix vision, digital agency, about Suriix",
      zh: "关于我们, Suriix愿景, 数字化代理商, 关于Suriix",
    },
  },
  "/solutions": {
    title: {
      ar: "حلولنا الرقمية | Suriix سوريكس",
      en: "Our Digital Solutions | Suriix",
      zh: "我们的数字解决方案 | Suriix",
    },
    description: {
      ar: "اكتشف حلولنا البرمجية المتكاملة، وتصميم المواقع، والمتاجر الإلكترونية، وأتمتة الذكاء الاصطناعي لتنمية أعمالك.",
      en: "Explore our integrated software solutions, web design, e-commerce development, and AI-driven automation.",
      zh: "探索我们的一站式软件解决方案、网页设计、电商独立站建设与人工智能系统定制服务。",
    },
    keywords: {
      ar: "حلول رقمية, أتمتة الذكاء الاصطناعي, تصميم مواقع, تجارة إلكترونية",
      en: "digital solutions, AI automation, web design, e-commerce",
      zh: "数字解决方案, AI自动化, 网页设计, 电子商务",
    },
  },
  "/packages": {
    title: {
      ar: "باقات الخدمات الرقمية | Suriix سوريكس",
      en: "Digital Service Packages | Suriix",
      zh: "数字服务套餐 | Suriix",
    },
    description: {
      ar: "شاهد باقات تصميم المواقع والمتاجر وإدارة الحملات الإعلانية والتسويق المتكاملة لدى سوريكس.",
      en: "Check out our website and store design packages, ad campaigns, and integrated digital marketing services.",
      zh: "查看我们的网站和电商独立站设计套餐、广告活动和整合数字营销服务。",
    },
    keywords: {
      ar: "باقات تصميم مواقع, أسعار المتاجر الإلكترونية, باقات التسويق الرقمي",
      en: "web design packages, e-commerce pricing, digital marketing packages",
      zh: "网站设计套餐, 电商独立站价格, 数字营销套餐",
    },
  },
  "/portfolio": {
    title: {
      ar: "معرض أعمالنا | Suriix سوريكس",
      en: "Our Portfolio | Suriix",
      zh: "我们的作品集 | Suriix",
    },
    description: {
      ar: "تصفح المشاريع والمواقع التي قمنا بتطويرها لعملائنا في مختلف القطاعات والمجالات.",
      en: "Browse the projects and websites we have developed for our clients across various industries.",
      zh: "浏览我们在各个行业为客户开发的项目和网站。",
    },
    keywords: {
      ar: "معرض الأعمال, مشاريع سوريكس, سابقة أعمالنا, تصميم مواقع العملاء",
      en: "portfolio, Suriix projects, our work, client website design",
      zh: "作品集, Suriix项目, 我们的作品, 客户网站设计",
    },
  },
  "/ready-websites": {
    title: {
      ar: "مواقع جاهزة للتسليم | Suriix سوريكس",
      en: "Ready-made Websites for Delivery | Suriix",
      zh: "现成网站交付 | Suriix",
    },
    description: {
      ar: "مجموعة مميزة من المواقع والمتاجر الجاهزة لتبدأ نشاطك التجاري على الفور وبأقل تكلفة.",
      en: "A collection of ready-made websites and stores to launch your business immediately with minimal cost.",
      zh: "精选现成网站和独立站，以最低的成本立即启动您的业务。",
    },
    keywords: {
      ar: "مواقع جاهزة, شراء موقع جاهز, متجر جاهز للتسليم, مواقع ويب سريعة",
      en: "ready-made websites, buy a website, ready e-commerce store, quick websites",
      zh: "现成网站, 购买网站, 现成电商独立站, 快速网站",
    },
  },
  "/faq": {
    title: {
      ar: "الأسئلة الشائعة | Suriix سوريكس",
      en: "Frequently Asked Questions | Suriix",
      zh: "常见问题 | Suriix",
    },
    description: {
      ar: "إجابات شاملة على الأسئلة الأكثر شيوعاً حول تصميم المواقع، المتاجر الإلكترونية، الدعم الفني، وخدمات SEO.",
      en: "Comprehensive answers to frequently asked questions about web design, e-commerce, support, and SEO services.",
      zh: "关于网页设计、电商独立站、技术支持和 SEO 服务的常见问题的全面解答。",
    },
    keywords: {
      ar: "الأسئلة الشائعة, استفسارات العملاء, أسئلة تصميم المواقع",
      en: "FAQ, customer inquiries, web design questions",
      zh: "常见问题, 客户咨询, 网页设计问题",
    },
  },
  "/testimonials": {
    title: {
      ar: "آراء وتجارب عملائنا | Suriix سوريكس",
      en: "Client Testimonials | Suriix",
      zh: "客户评价与体验 | Suriix",
    },
    description: {
      ar: "ماذا يقول شركاء نجاحنا عن تجربتهم مع خدمات سوريكس الرقمية وتأثيرها على نمو أعمالهم.",
      en: "What our success partners say about their experience with Suriix digital services and their impact on growth.",
      zh: "我们的合作伙伴对 Suriix 数字服务及其对业务增长影响的评价。",
    },
    keywords: {
      ar: "آراء العملاء, تجارب العملاء مع سوريكس, تقييمات العملاء",
      en: "client testimonials, Suriix customer reviews, customer ratings",
      zh: "客户评价, Suriix客户评价, 客户评级",
    },
  },
  "/blog": {
    title: {
      ar: "المدونة الرقمية | Suriix سوريكس",
      en: "Digital Blog | Suriix",
      zh: "数字博客 | Suriix",
    },
    description: {
      ar: "مقالات تثقيفية، نصائح برمجية، واستراتيجيات تسويقية لمساعدتك على النجاح في سوق العمل الرقمي.",
      en: "Educational articles, coding tips, and marketing strategies to help you succeed in the digital market.",
      zh: "教育性文章、编程技巧和营销策略，帮助您在数字市场中取得成功。",
    },
    keywords: {
      ar: "المدونة, مقالات تسويقية, نصائح برمجية, مدونة سوريكس",
      en: "blog, marketing articles, coding tips, Suriix blog",
      zh: "博客, 营销文章, 编程技巧, Suriix博客",
    },
  },
  "/contact": {
    title: {
      ar: "تواصل معنا | Suriix سوريكس",
      en: "Contact Us | Suriix",
      zh: "联系我们 | Suriix",
    },
    description: {
      ar: "تواصل معنا اليوم لمناقشة مشروعك الرقمي القادم وبدء تحقيق أهداف أعمالك.",
      en: "Get in touch with us today to discuss your next digital project and start achieving your business goals.",
      zh: "立即与我们联系，讨论您的下一个数字项目并开始实现您的业务目标。",
    },
    keywords: {
      ar: "تواصل معنا, رقم سوريكس, حجز مشروع, نموذج الاتصال",
      en: "contact us, Suriix number, book project, contact form",
      zh: "联系我们, Suriix电话, 预约项目, 联系表单",
    },
  },
  "/privacy": {
    title: {
      ar: "سياسة الخصوصية | Suriix سوريكس",
      en: "Privacy Policy | Suriix",
      zh: "隐私政策 | Suriix",
    },
    description: {
      ar: "تعرف على كيفية جمع واستخدام وحماية البيانات الشخصية لزوار وعملاء وكالة سوريكس.",
      en: "Learn how we collect, use, and protect the personal data of Suriix visitors and clients.",
      zh: "了解我们如何收集、使用和保护 Suriix 访问者和客户的个人数据。",
    },
    keywords: {
      ar: "سياسة الخصوصية, حماية البيانات, خصوصية العملاء",
      en: "privacy policy, data protection, client privacy",
      zh: "隐私政策, 数据保护, 客户隐私",
    },
  },
  "/terms": {
    title: {
      ar: "شروط الخدمة والاستخدام | Suriix سوريكس",
      en: "Terms of Service & Use | Suriix",
      zh: "服务条款与使用 | Suriix",
    },
    description: {
      ar: "القواعد والشروط القانونية التي تحكم استخدام خدمات وموقع وكالة سوريكس الرقمية.",
      en: "The legal terms and conditions governing the use of Suriix Digital Agency's services and website.",
      zh: "管理使用 Suriix 数字代理商服务和网站的法律条款和条件。",
    },
    keywords: {
      ar: "شروط الخدمة, شروط الاستخدام, القواعد القانونية",
      en: "terms of service, terms of use, legal terms",
      zh: "服务条款, 使用条款, 法律条款",
    },
  },
};

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = defaultOgImage,
  ogType = "website",
  schema,
  noIndex = false,
}) => {
  const { pathname } = useLocation();
  const { lang } = useLanguage();

  // Normalize path by stripping trailing slash
  const normPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");

  // Resolve localized text defaults or fall back to English
  const defaults = metaDefaults[normPath] || metaDefaults["/"];
  const pageTitle = title || defaults.title[lang] || defaults.title.en;
  const pageDescription =
    description || defaults.description[lang] || defaults.description.en;
  const pageKeywords = keywords || defaults.keywords[lang] || defaults.keywords.en;

  // Build absolute URLs for meta tags (handling fallback for index)
  const canonicalUrl = `${siteUrl}${normPath === "/" ? "" : normPath}`;

  // Localized alternate URL tags
  const alternateAr = canonicalUrl;
  const alternateEn = `${canonicalUrl}?lang=en`;
  const alternateZh = `${canonicalUrl}?lang=zh`;

  return (
    <Helmet>
      {/* Search Engine Robots Indexing */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Primary Metadata */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Multilingual Alternate Translations (Hreflang) */}
      <link rel="alternate" hrefLang="ar" href={alternateAr} />
      <link rel="alternate" hrefLang="en" href={alternateEn} />
      <link rel="alternate" hrefLang="zh" href={alternateZh} />
      <link rel="alternate" hrefLang="x-default" href={alternateAr} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={lang === "ar" ? "ar_YE" : lang === "zh" ? "zh_CN" : "en_US"} />
      <meta property="og:site_name" content="Suriix" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@Suriix" />

      {/* JSON-LD Structured Data Injection */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
