// تمت إزالة المفاتيح المكررة من أعلى الملف
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ar" | "en" | "zh";

interface Translations {
  [key: string]: { ar: string; en: string; zh: string };
}

export const translations: Translations = {
  "privacy.title": {
    ar: "جميع السياسات القانونية",
    en: "All Legal Policies",
    zh: "所有法律政策",
  },
  "privacy.back": { ar: "العودة للرئيسية", en: "Back to Home", zh: "返回首页" },
  "privacy.lastUpdated": {
    ar: "آخر تحديث",
    en: "Last updated",
    zh: "最后更新",
  },
  // Legal Policies
  "legal.privacy.title": {
    ar: "سياسة الخصوصية",
    en: "Privacy Policy",
    zh: "隐私政策",
  },
  "legal.privacy.content": {
    ar: `نحن في Suriix نلتزم بحماية خصوصية عملائنا. نقوم بجمع البيانات الشخصية التالية فقط عند الحاجة: الاسم، رقم الهاتف، البريد الإلكتروني، الدولة، تفاصيل المشروع، وأي ملفات أو معلومات يرسلها العميل. تُستخدم هذه البيانات لتقديم الخدمات المطلوبة، والتواصل مع العميل، وتحسين جودة خدماتنا. لا نقوم ببيع أو مشاركة بيانات العملاء مع أي طرف ثالث، إلا إذا تطلب القانون ذلك أو بموافقة العميل الصريحة. نحرص على حماية بياناتك باستخدام إجراءات أمان مناسبة.`,
    en: `At Suriix, we are committed to protecting our clients' privacy. We only collect the following personal data when necessary: name, phone number, email, country, project details, and any files or information provided by the client. This data is used to deliver requested services, communicate with the client, and improve our service quality. We do not sell or share client data with any third party, except as required by law or with the client's explicit consent. We take appropriate security measures to protect your data.`,
    zh: `在Suriix，我们致力于保护客户隐私。我们仅在必要时收集以下个人数据：姓名、电话、电子邮件、国家、项目信息及客户提供的任何文件或资料。这些数据仅用于提供所需服务、与客户沟通及提升服务质量。我们不会向第三方出售或共享客户数据，除非法律要求或客户明确同意。我们采取适当的安全措施保护您的数据。`,
  },
  "legal.terms.title": {
    ar: "شروط الخدمة",
    en: "Terms of Service",
    zh: "服务条款",
  },
  "legal.terms.content": {
    ar: `تُقدَّم خدمات Suriix بناءً على المتطلبات المتفق عليها مع العميل. أي أعمال إضافية خارج نطاق الاتفاق الأصلي تتطلب تكلفة إضافية. تعتمد مدة تنفيذ الخدمات على نوع الخدمة وتعقيدها. لا تضمن الشركة تحقيق نتائج محددة من الإعلانات المدفوعة مثل المبيعات أو الوصول أو التحويلات. يتحمل العميل مسؤولية تقديم معلومات صحيحة وكاملة لضمان جودة الخدمة.`,
    en: `Suriix services are provided based on the requirements agreed upon with the client. Any additional work outside the original agreement requires extra cost. Service delivery timelines depend on the type and complexity of the service. The company does not guarantee specific results from paid ads such as sales, reach, or conversions. The client is responsible for providing accurate and complete information to ensure service quality.`,
    zh: `Suriix的服务根据与客户达成的要求提供。任何超出原协议范围的额外工作需另行收费。服务交付时间取决于服务类型和复杂性。公司不保证付费广告带来特定结果，如销售、覆盖或转化。客户有责任提供准确完整的信息以确保服务质量。`,
  },
  "legal.refund.title": {
    ar: "سياسة استرجاع الأموال",
    en: "Refund Policy",
    zh: "退款政策",
  },
  "legal.refund.content": {
    ar: `يحق للعميل استرداد المبلغ كاملاً فقط إذا تم إلغاء الطلب قبل بدء العمل. لا يمكن استرجاع أي مبالغ بعد بدء تنفيذ أي من الخدمات التالية: أعمال التصميم، إطلاق الحملات الإعلانية، تسليم المحتوى أو التصاميم أو الفيديوهات أو الهوية البصرية، أو بدء العمل على إدارة وسائل التواصل الاجتماعي أو تحسين محركات البحث. جميع خدماتنا رقمية ومخصصة لكل عميل، لذلك لا يمكن استرجاع المبالغ بعد البدء. في حال حدوث خطأ جسيم من طرفنا، سنقوم بإصلاحه دون أي تكلفة إضافية أو تقديم حل بديل مناسب بدلاً من الاسترجاع.`,
    en: `A full refund is only allowed if the client cancels before work begins. No refunds are possible after any of the following: design work has started, ad campaigns are launched, content/designs/videos/branding are delivered, or social media/SEO work has begun. All our services are digital and custom-made for each client, so refunds are not possible once work has started. In case of a serious mistake by our company, we will fix it at no extra cost or offer an alternative solution instead of a refund.`,
    zh: `仅在工作开始前取消订单时，客户可获得全额退款。以下任一情况发生后不予退款：设计工作已开始、广告活动已启动、内容/设计/视频/品牌已交付，或社交媒体/SEO工作已开始。我们的所有服务均为数字化并为每位客户定制，工作一旦开始，概不退款。如因我方严重失误，将免费修正或提供替代方案。`,
  },
  "legal.checkbox": {
    ar: "أوافق على سياسة الخصوصية وشروط الخدمة وسياسة استرجاع الأموال.",
    en: "I agree to the Privacy Policy, Terms of Service, and Refund Policy.",
    zh: "我同意隐私政策、服务条款和退款政策。",
  },
  // Nav
  "nav.home": { ar: "الرئيسية", en: "Home", zh: "首页" },
  "nav.store": { ar: "متجر سوريكس", en: "Suriix Store", zh: "Suriix Store" },
  "nav.about": { ar: "من نحن", en: "About", zh: "关于我们" },
  "nav.mirror": { ar: "المرآة الرقمية", en: "Digital Mirror", zh: "数字镜像" },
  "nav.solutions": { ar: "الحلول", en: "Solutions", zh: "解决方案" },
  "nav.packages": { ar: "الباقات", en: "Packages", zh: "套餐" },
  "nav.portfolio": { ar: "أعمالنا", en: "Portfolio", zh: "作品集" },
  "nav.testimonials": {
    ar: "آراء العملاء",
    en: "Testimonials",
    zh: "客户评价",
  },
  "nav.faq": { ar: "الأسئلة", en: "FAQ", zh: "常见问题" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact", zh: "联系我们" },
  "nav.blog": { ar: "المدونة", en: "Blog", zh: "博客" },
  "nav.admin": { ar: "لوحة التحكم", en: "Admin", zh: "控制台" },

  // Hero
  "hero.build": { ar: "ابنِ", en: "Build", zh: "建立" },
  "hero.sell": { ar: "بِع", en: "Sell", zh: "销售" },
  "hero.grow": { ar: "نمُو", en: "Grow", zh: "成长" },
  "hero.subtitle": {
    ar: "نحن لا نبيع خدمات — نحن نبني ونبيع وننمي الأعمال الرقمية",
    en: "We don't sell services — We build, sell & grow digital businesses",
    zh: "我们不只是卖服务——我们建立、销售并发展数字业务",
  },
  "hero.cta": {
    ar: "ابدأ مشروعك الآن",
    en: "Start Your Project",
    zh: "立即开始您的项目",
  },
  "hero.ai.message": {
    ar: "أنا الذكاء الرقمي لـ Suriix…\nأخبرني، ماذا تريد أن تفعل اليوم؟",
    en: "I am Suriix's digital intelligence…\nTell me, what do you want to do today?",
    zh: "我是Suriix的数字智能…\n告诉我，你今天想做什么？",
  },
  "hero.ai.build": {
    ar: "ممتاز! سأريك كيف نبني مشاريع رقمية مذهلة ←",
    en: "Excellent! Let me show you how we build stunning digital projects →",
    zh: "太棒了！让我展示我们如何建立惊人的数字项目 →",
  },
  "hero.ai.sell": {
    ar: "رائع! اكتشف باقاتنا التي تحقق المبيعات ←",
    en: "Great choice! Discover our packages that drive sales →",
    zh: "好选择！了解我们推动销售的套餐 →",
  },
  "hero.ai.grow": {
    ar: "ذكي! شاهد كيف ننمي الأعمال الرقمية ←",
    en: "Smart! See how we grow digital businesses →",
    zh: "聪明！看看我们如何发展数字业务 →",
  },

  "hero.badge": {
    ar: "حلول رقمية متكاملة لنمو أعمالك",
    en: "Integrated digital solutions for your business growth",
    zh: "助力业务增长的一站式数字解决方案",
  },
  "hero.title1": {
    ar: "Suriix | سوريكس - نصمم حلولاً رقمية",
    en: "Suriix | We design digital solutions",
    zh: "Suriix | 我们设计数字解决方案",
  },
  "hero.title2": {
    ar: "تصنع الفارق الحقيقي.",
    en: "that drive growth.",
    zh: "助力企业实现数字化增长。",
  },
  "hero.desc": {
    ar: "في Suriix | سوريكس نقدم لك مواقع إنترنت احترافية، هوية بصرية قوية، وأنظمة أتمتة ذكية تساعد عملك على النمو والانتشار بشكل أسرع.",
    en: "At Suriix, we provide professional websites, strong brand identities, and smart automation systems that help your business grow and scale faster.",
    zh: "在 Suriix，我们为您提供专业的网站、强大的品牌视觉形象和智能自动化系统，助力您的业务更快速地增长和扩张。",
  },
  "hero.btn.start": {
    ar: "ابدأ مشروعك الآن",
    en: "Start Your Project Now",
    zh: "立即开始您的项目",
  },
  "hero.btn.portfolio": {
    ar: "شاهد أعمالنا",
    en: "Watch Our Work",
    zh: "观看我们的作品",
  },
  "hero.stats.clients": { ar: "96+", en: "96+", zh: "96+" },
  "hero.stats.clients_lbl": { ar: "عميل سعيد", en: "Happy Clients", zh: "满意客户" },
  "hero.stats.projects": { ar: "128+", en: "128+", zh: "128+" },
  "hero.stats.projects_lbl": { ar: "مشروع مكتمل", en: "Completed Projects", zh: "完成项目" },
  "hero.stats.experience": { ar: "3+", en: "3+", zh: "3+" },
  "hero.stats.experience_lbl": { ar: "سنوات خبرة", en: "Years of Experience", zh: "行业经验" },
  "hero.stats.satisfaction": { ar: "98%", en: "98%", zh: "98%" },
  "hero.stats.satisfaction_lbl": { ar: "رضا العملاء", en: "Client Satisfaction", zh: "客户满意度" },
  "hero.scroll_down": { ar: "اسحب للأسفل", en: "Scroll down", zh: "向下滚动" },

  // Hero Dashboard Mockup
  "hero.dashboard.overview": { ar: "نظرة عامة", en: "Overview", zh: "概览" },
  "hero.dashboard.search": { ar: "بحث...", en: "Search...", zh: "搜索..." },
  "hero.dashboard.sidebar.home": { ar: "لوحة التحكم", en: "Dashboard", zh: "仪表盘" },
  "hero.dashboard.sidebar.projects": { ar: "المشاريع", en: "Projects", zh: "项目" },
  "hero.dashboard.sidebar.clients": { ar: "العملاء", en: "Clients", zh: "客户" },
  "hero.dashboard.sidebar.analytics": { ar: "التحليلات", en: "Analytics", zh: "分析" },
  "hero.dashboard.sidebar.reports": { ar: "التقارير", en: "Reports", zh: "报告" },
  "hero.dashboard.sidebar.settings": { ar: "الإعدادات", en: "Settings", zh: "设置" },
  "hero.dashboard.stats.projects": { ar: "إجمالي المشاريع", en: "Total Projects", zh: "项目总数" },
  "hero.dashboard.stats.active_clients": { ar: "العملاء النشطين", en: "Active Clients", zh: "活跃客户" },
  "hero.dashboard.stats.success_rate": { ar: "نسبة النجاح", en: "Success Rate", zh: "成功率" },
  "hero.dashboard.stats.response_rate": { ar: "معدل الاستجابة", en: "Response Rate", zh: "响应速度" },
  "hero.dashboard.stats.growth": { ar: "نمو الأداء", en: "Performance Growth", zh: "业绩增长" },
  "hero.dashboard.stats.distribution": { ar: "توزيع المشاريع", en: "Project Distribution", zh: "项目分布" },
  "hero.dashboard.stats.month": { ar: "هذا الشهر", en: "This Month", zh: "本月" },
  "hero.dashboard.stats.growth_title": { ar: "أداء متزايد", en: "Growing Performance", zh: "持续增长" },
  "hero.dashboard.stats.automation_title": { ar: "أتمتة ذكية", en: "Smart Automation", zh: "智能自动化" },
  "hero.dashboard.stats.automation_desc": { ar: "توفير الوقت وزيادة الإنتاجية", en: "Saving time & increasing productivity", zh: "节省时间并提高生产力" },

  // About
  "about.title": { ar: "من نحن", en: "About Us", zh: "关于我们" },
  "about.vision.title": { ar: "رؤيتنا", en: "Our Vision", zh: "我们的愿景" },
  "about.vision.desc": {
    ar: "نسعى لتحويل المنطقة العربية إلى مركز رقمي عالمي من خلال حلول مبتكرة",
    en: "We aim to transform the Arab region into a global digital hub through innovative solutions",
    zh: "我们致力于通过创新解决方案将阿拉伯地区打造为全球数字中心",
  },
  "about.mission.title": { ar: "مهمتنا", en: "Our Mission", zh: "我们的使命" },
  "about.mission.desc": {
    ar: "تمكين الشركات من بناء حضور رقمي قوي يحقق نتائج ملموسة",
    en: "Empowering businesses to build a powerful digital presence that delivers real results",
    zh: "赋能企业建立强大的数字化存在，实现实际成果",
  },
  "about.values.title": { ar: "قيمنا", en: "Our Values", zh: "我们的价值观" },
  "about.values.desc": {
    ar: "الابتكار، الجودة، الشفافية، والالتزام بنجاح عملائنا",
    en: "Innovation, Quality, Transparency, and commitment to our clients' success",
    zh: "创新、品质、透明以及对客户成功的承诺",
  },
  "about.cta": {
    ar: "تواصل معنا عبر واتساب",
    en: "Contact Us on WhatsApp",
    zh: "通过WhatsApp联系我们",
  },

  // Digital Mirror
  "mirror.title": {
    ar: "المرآة الرقمية",
    en: "Digital Mirror",
    zh: "数字镜像",
  },
  "mirror.question": {
    ar: "كيف يظهر مشروعك رقمياً اليوم؟",
    en: "How does your project appear digitally today?",
    zh: "您的项目在数字世界中的表现如何？",
  },
  "mirror.option1": { ar: "غير مرئي", en: "Invisible", zh: "不可见" },
  "mirror.option1.desc": {
    ar: "لا أحد يجدني على الإنترنت",
    en: "Nobody can find me online",
    zh: "没有人能在网上找到我",
  },
  "mirror.option2": { ar: "عادي", en: "Average", zh: "一般" },
  "mirror.option2.desc": {
    ar: "موجود لكن بدون تميز",
    en: "Present but nothing special",
    zh: "存在但毫无特色",
  },
  "mirror.option3": {
    ar: "احترافي لكنه بطيء",
    en: "Professional but slow",
    zh: "专业但缓慢",
  },
  "mirror.option3.desc": {
    ar: "جيد المظهر لكن الأداء ضعيف",
    en: "Looks good but poor performance",
    zh: "外观不错但性能差",
  },
  "mirror.option4": {
    ar: "قوي لكنه لا يبيع",
    en: "Strong but doesn't sell",
    zh: "强大但不卖货",
  },
  "mirror.option4.desc": {
    ar: "حضور قوي لكن بدون مبيعات",
    en: "Strong presence but no sales",
    zh: "存在感强但没有销售额",
  },
  "mirror.cta": {
    ar: "أرسل انعكاس مشروعي إلى واتساب",
    en: "Send my project reflection to WhatsApp",
    zh: "将我的项目分析发送到WhatsApp",
  },

  // Packages
  "packages.title": {
    ar: "الباقات",
    en: "Packages",
    zh: "套餐",
  },
  "packages.ecommerce": {
    ar: "باقات المتاجر",
    en: "E-Commerce Packages",
    zh: "电商套餐",
  },
  "packages.from": { ar: "تبدأ من", en: "Starting from", zh: "起价" },
  "packages.cta": {
    ar: "ابدأ هذه الباقة عبر واتساب",
    en: "Start this package via WhatsApp",
    zh: "通过WhatsApp开始此套餐",
  },
  "packages.popular": {
    ar: "الأكثر طلباً",
    en: "Most Popular",
    zh: "最受欢迎",
  },
  "packages.bestValue": { ar: "أفضل قيمة", en: "Best Value", zh: "最佳价值" },
  "packages.delivery": { ar: "أيام عمل", en: "business days", zh: "个工作日" },
  "packages.hub.subtitle": {
    ar: "اختر مسارك: ابنِ، بِع، أو نمُو",
    en: "Choose your path: Build, Sell, or Grow",
    zh: "选择你的路径：建立、销售或成长",
  },
  "packages.more": {
    ar: "المزيد من التفاصيل",
    en: "More details",
    zh: "更多详情",
  },
  "packages.less": { ar: "إخفاء التفاصيل", en: "Less details", zh: "收起详情" },

  // Solutions
  "solutions.title": {
    ar: "حلولنا",
    en: "Our Solutions",
    zh: "我们的解决方案",
  },
  "sol.digital": {
    ar: "الحضور الرقمي",
    en: "Digital Presence",
    zh: "数字存在",
  },
  "sol.local": { ar: "الحضور المحلي", en: "Local Presence", zh: "本地存在" },
  "sol.ecommerce": {
    ar: "التجارة الإلكترونية",
    en: "E-Commerce",
    zh: "电子商务",
  },
  "sol.brand": { ar: "هوية العلامة", en: "Brand Identity", zh: "品牌形象" },
  "sol.trust": { ar: "بناء الثقة", en: "Trust Building", zh: "信任建设" },
  "sol.video": { ar: "محتوى الفيديو", en: "Video Content", zh: "视频内容" },
  "sol.ai": {
    ar: "أتمتة الذكاء الاصطناعي",
    en: "AI Automation",
    zh: "AI自动化",
  },

  // Portfolio
  "portfolio.title": { ar: "أعمالنا", en: "Portfolio", zh: "作品集" },
  "portfolio.subtitle": {
    ar: "مشاريع حقيقية بنيناها لعملائنا",
    en: "Real projects we've built for our clients",
    zh: "我们为客户打造的真实项目",
  },
  "portfolio.cta": {
    ar: "أريد مشروع مشابه",
    en: "I want something similar",
    zh: "我想要类似的项目",
  },

  // Testimonials
  "testimonials.title": {
    ar: "آراء العملاء",
    en: "Testimonials",
    zh: "客户评价",
  },
  "testimonials.subtitle": {
    ar: "ماذا يقول عملاؤنا عن تجربتهم معنا",
    en: "What our clients say about their experience with us",
    zh: "客户对我们的评价",
  },

  // FAQ
  "faq.title": { ar: "الأسئلة الشائعة", en: "FAQ", zh: "常见问题" },
  "faq.q1": {
    ar: "ما هي المدة المطلوبة لـ تطوير مواقع الويب وإنشائها؟",
    en: "How long does it take for professional web development?",
    zh: "专业网站定制开发需要多长时间？",
  },
  "faq.a1": {
    ar: "تختلف المدة حسب تعقيد المشروع. يستغرق تصميم Landing Page بسيطة من 3 إلى 5 أيام، بينما يتطلب إنشاء متجر إلكتروني متكامل أو برمجة مواقع حديثة من 12 إلى 30 يوم عمل تشمل تصميم واجهات UI UX والتهيئة.",
    en: "It varies by project. Designing a simple Landing Page takes 3-5 days, while building a full e-commerce store or custom corporate web development takes 12-30 business days, including UI/UX design and setup.",
    zh: "时间因项目而异。设计简单的落地页（Landing Page）需3-5天，而建设完整的电商独立站或定制开发企业网站通常需要12-30个工作日，包含 UI/UX 交互设计与系统部署。",
  },
  "faq.q2": {
    ar: "هل تقدمون خدمات الدعم الفني وصيانة المواقع بعد التسليم؟",
    en: "Do you offer technical support and maintenance after website launch?",
    zh: "网站交付上线后，你们提供技术支持与日常维护吗？",
  },
  "faq.a2": {
    ar: "نعم، نوفر خدمات دعم فني متكاملة وحزم صيانة دورية للمواقع تشمل التحديثات الأمنية، إصلاح الأعطال، تحسين سرعة الأداء، لضمان عمل كافة خدماتنا الإلكترونية بكفاءة تامة.",
    en: "Yes, we provide comprehensive technical support and maintenance packages including security updates, bug fixes, and performance optimization to keep your digital services running flawlessly.",
    zh: "是的，我们提供全面的技术支持与包月维护服务，包括系统安全更新、故障修复和速度优化，以确保您的所有数字化服务及网站系统稳定高效运行。",
  },
  "faq.q3": {
    ar: "هل أحصل على تصميم واجهات UI UX مخصص بالكامل لمشروعي؟",
    en: "Do I get a fully custom UI/UX design for my project?",
    zh: "我会获得针对我品牌的完全定制化 UI/UX 交互设计吗？",
  },
  "faq.a3": {
    ar: "بالتأكيد! نحن لا نستخدم قوالب جاهزة مكررة. نقوم بابتكار تصميم واجهات UI UX مخصصة لعلامتك التجارية لتبسيط تصفح العملاء ورفع معدل التحويل والمبيعات.",
    en: "Absolutely! We do not use pre-made templates. We create custom UI/UX interface designs from scratch tailored to your brand to optimize user flow and maximize conversion rates.",
    zh: "当然！我们拒绝套用现成的模板。我们会从零开始为您的品牌量身打造独特的 UI/UX 交互设计，以优化用户访问路径并实现最大化的转化与销量。",
  },
  "faq.q4": {
    ar: "ما هي ميزات إنشاء متجر إلكتروني مع Suriix؟",
    en: "What are the core features when launching an e-commerce store with Suriix?",
    zh: "在 Suriix 建设电商独立站有哪些核心功能？",
  },
  "faq.a4": {
    ar: "يشمل إنشاء متجر إلكتروني لوحة تحكم مرنة لإدارة المنتجات، سلة تسوق ذكية، ربط بوابات الدفع الإلكتروني الآمنة، وتكامل مع شركات الشحن، مع تحسين SEO كامل للمنتجات وتجاوب مطلق مع الهواتف.",
    en: "E-commerce creation includes a flexible product management dashboard, smart shopping cart, secure payment gateway integrations, shipping tracking, full search engine SEO optimization, and mobile responsive layout.",
    zh: "电商独立站建设包括：灵活的商品管理后台、智能购物车、主流安全支付网关对接、物流查询追踪系统，以及完整的独立站搜索引擎 SEO 优化与极致的移动端响应式适配。",
  },
  "faq.q5": {
    ar: "هل تقدمون باقات تشمل تسويق رقمي وإدارة حسابات التواصل؟",
    en: "Do you offer packages that include digital marketing and social media management?",
    zh: "你们提供包含数字营销 and 社交媒体代运营的套餐吗？",
  },
  "faq.a5": {
    ar: "نعم، نحن نقدم حلول نمو رقمي شاملة تتضمن التخطيط لحملات تسويق رقمي إبداعية، وإدارة حسابات التواصل الاجتماعي بانتظام، وصناعة المحتوى، لجلب عملاء مستهدفين لمشروعك.",
    en: "Yes, we offer complete digital growth packages that include strategic digital marketing campaigns, regular social media management, ad management, and content creation to drive targeted traffic.",
    zh: "是的，我们提供全方位的数字营销与增长套餐，包括定制化的社交媒体代运营、日常内容策划、精准广告投放与数据分析，以为您的项目带来精准的意向客户群体。",
  },
  "faq.q6": {
    ar: "كيف يسهم تحسين SEO في تصدر موقعي لمحركات البحث؟",
    en: "How does SEO optimization help my website rank higher on Google?",
    zh: "搜索引擎 SEO 优化如何帮助我的网站在谷歌取得更高排名？",
  },
  "faq.a6": {
    ar: "يتضمن تحسين SEO تهيئة الأكواد والكلمات المفتاحية وسرعة الموقع. يساعد ذلك محركات البحث على فهم محتوى موقعك وأرشفته سريعاً، مما يضمن ظهورك للعملاء المهتمين بخدماتك مجاناً وبشكل مستمر.",
    en: "SEO optimization involves indexing code setups, keywords mapping, and speed optimization. This helps search engines understand your website and index it, delivering organic target visitors.",
    zh: "SEO 优化包含代码结构优化、核心关键词布局以及页面加载提速。这有助于搜索引擎理解您的网站内容并快速收录，从而源源不断地为您带来免费且精准的自然搜索流量。",
  },

  // Contact
  "contact.title": { ar: "تواصل معنا", en: "Contact Us", zh: "联系我们" },
  "contact.briefing.subtitle": {
    ar: "ابدأ مشروعك الرقمي معنا اليوم",
    en: "Start Your Digital Project With Us Today",
    zh: "今天就与我们开始您的数字项目",
  },
  "contact.name": { ar: "الاسم الكامل", en: "Full Name", zh: "全名" },
  "contact.name.placeholder": {
    ar: "أدخل اسمك الكامل...",
    en: "Enter your full name...",
    zh: "输入您的全名...",
  },
  "contact.country": { ar: "الدولة", en: "Country", zh: "国家" },
  "contact.country.placeholder": {
    ar: "دولتك...",
    en: "Your country...",
    zh: "您的国家...",
  },
  "contact.services": {
    ar: "نوع الخدمة (يمكن اختيار أكثر من خدمة)",
    en: "Service Type (multi-select)",
    zh: "服务类型（可多选）",
  },
  "contact.budget": {
    ar: "الميزانية التقديرية",
    en: "Estimated Budget",
    zh: "预算",
  },
  "contact.file": {
    ar: "رفع ملف (اختياري)",
    en: "Upload File (optional)",
    zh: "上传文件（可选）",
  },
  "contact.file.hint": {
    ar: "PDF، صورة، أو أي مرجع للمشروع",
    en: "PDF, image, or any project reference",
    zh: "PDF、图片或任何项目参考文件",
  },
  "contact.privacy": {
    ar: "أوافق على سياسة الخصوصية وشروط الخدمة وسياسة استرجاع الأموال.",
    en: "I agree to the Privacy Policy, Terms of Service, and Refund Policy.",
    zh: "我同意隐私政策、服务条款和退款政策。",
  },
  "contact.privacy.required": {
    ar: "يجب الموافقة على سياسة الخصوصية",
    en: "You must agree to the Privacy Policy",
    zh: "您必须同意隐私政策",
  },
  "contact.message": {
    ar: "أخبرنا عن رؤيتك...",
    en: "Tell us about your vision...",
    zh: "告诉我们您的愿景...",
  },
  "contact.send": { ar: "إرسال", en: "Send", zh: "发送" },
  "contact.whatsapp": {
    ar: "أو تواصل عبر واتساب",
    en: "Or contact via WhatsApp",
    zh: "或通过WhatsApp联系",
  },
  "contact.next": { ar: "التالي", en: "Next", zh: "下一步" },
  "contact.back": { ar: "رجوع", en: "Back", zh: "返回" },
  "contact.submit": {
    ar: "ابدأ مشروعي الآن",
    en: "Start My Project Now",
    zh: "立即开始项目",
  },
  "contact.success.title": {
    ar: "تم الإرسال بنجاح!",
    en: "Successfully Sent!",
    zh: "发送成功！",
  },
  "contact.success.message": {
    ar: "سيتم فتح واتساب لإرسال رسالتك...",
    en: "WhatsApp will open to send your message...",
    zh: "WhatsApp将打开以发送您的消息...",
  },
  "contact.select.services": {
    ar: "اختر الخدمات المطلوبة",
    en: "Select required services",
    zh: "选择所需服务",
  },
  "contact.required.services": {
    ar: "يرجى اختيار خدمة واحدة على الأقل",
    en: "Please select at least one service",
    zh: "请至少选择一项服务",
  },

  // Contact services
  "contact.service.web": {
    ar: "تصميم مواقع",
    en: "Website Design",
    zh: "网站设计",
  },
  "contact.service.dynamic": {
    ar: "مواقع ديناميكية",
    en: "Dynamic Websites",
    zh: "动态网站",
  },
  "contact.service.ecommerce": {
    ar: "متاجر إلكترونية",
    en: "E-Commerce Stores",
    zh: "电子商务",
  },
  "contact.service.ads": {
    ar: "إدارة الإعلانات المدفوعة",
    en: "Paid Ads Management",
    zh: "付费广告管理",
  },
  "contact.service.content": {
    ar: "تصميم المحتوى",
    en: "Content Design",
    zh: "内容设计",
  },
  "contact.service.branding": {
    ar: "هوية بصرية / براندينج",
    en: "Visual Identity / Branding",
    zh: "视觉识别 / 品牌设计",
  },
  "contact.service.social": {
    ar: "إدارة التواصل الاجتماعي",
    en: "Social Media Management",
    zh: "社交媒体管理",
  },
  "contact.service.seo": {
    ar: "تحسين محركات البحث (SEO)",
    en: "SEO",
    zh: "搜索引擎优化",
  },
  "contact.service.video": {
    ar: "محتوى فيديو / مونتاج",
    en: "Video Content / Editing",
    zh: "视频内容 / 剪辑",
  },
  "contact.service.mixed": {
    ar: "باقة مدمجة (تصميم + إعلانات)",
    en: "Mixed Package (Design + Ads)",
    zh: "混合套餐（设计 + 广告）",
  },

  // Contact budget options
  "contact.budget.under100": {
    ar: "أقل من 100$",
    en: "Under $100",
    zh: "低于$100",
  },
  "contact.budget.100_300": {
    ar: "100$ - 300$",
    en: "$100 - $300",
    zh: "$100 - $300",
  },
  "contact.budget.300_500": {
    ar: "300$ - 500$",
    en: "$300 - $500",
    zh: "$300 - $500",
  },
  "contact.budget.500_1000": {
    ar: "500$ - 1000$",
    en: "$500 - $1,000",
    zh: "$500 - $1,000",
  },
  "contact.budget.1000plus": {
    ar: "أكثر من 1000$",
    en: "$1,000+",
    zh: "$1,000+",
  },

  // Contact WhatsApp message
  "contact.wa.hello": {
    ar: "مرحباً، أنا",
    en: "Hello, I am",
    zh: "你好，我是",
  },
  "contact.wa.from": { ar: "من", en: "from", zh: "来自" },
  "contact.wa.interested": {
    ar: "أنا مهتم بالخدمات التالية:",
    en: "I am interested in the following services:",
    zh: "我对以下服务感兴趣：",
  },
  "contact.wa.budget": {
    ar: "الميزانية التقديرية:",
    en: "Estimated budget:",
    zh: "预估预算：",
  },
  "contact.wa.start": {
    ar: "أرجو التواصل لبدء مشروعي.",
    en: "Please contact me to start my project.",
    zh: "请联系我开始我的项目。",
  },
  "contact.wa.file": {
    ar: "ملف مرفق:",
    en: "Attached file:",
    zh: "附件文件：",
  },

  // Footer
  "footer.services": { ar: "الخدمات", en: "Services", zh: "服务" },
  "footer.company": { ar: "الشركة", en: "Company", zh: "公司" },
  "footer.packages": { ar: "الباقات", en: "Packages", zh: "套餐" },
  "footer.resources": { ar: "المصادر", en: "Resources", zh: "资源" },
  "footer.rights": {
    ar: "جميع الحقوق محفوظة",
    en: "All rights reserved",
    zh: "版权所有",
  },
  "footer.privacy": {
    ar: "سياسة الخصوصية",
    en: "Privacy Policy",
    zh: "隐私政策",
  },

  // Blog
  "blog.title": { ar: "المدونة", en: "Blog", zh: "博客" },
  "blog.subtitle": {
    ar: "مقالات ونصائح لتنمية أعمالك الرقمية",
    en: "Articles and tips to grow your digital business",
    zh: "助力数字业务增长的文章与技巧",
  },
  "blog.cat.strategy": { ar: "استراتيجية", en: "Strategy", zh: "策略" },
  "blog.cat.design": { ar: "تصميم", en: "Design", zh: "设计" },
  "blog.cat.tech": { ar: "تقنية", en: "Technology", zh: "技术" },
  "blog.cat.marketing": { ar: "تسويق", en: "Marketing", zh: "营销" },
  "blog.post1.title": {
    ar: "5 أسرار لتحويل موقعك إلى آلة مبيعات",
    en: "5 Secrets to Turn Your Website Into a Sales Machine",
    zh: "将网站变成销售机器的5个秘密",
  },
  "blog.post1.excerpt": {
    ar: "اكتشف كيف يمكن لتعديلات بسيطة أن تضاعف مبيعاتك",
    en: "Discover how simple tweaks can double your sales",
    zh: "了解简单调整如何使您的销售翻倍",
  },
  "blog.post1.content": {
    ar: "في عالم التجارة الرقمية، موقعك هو واجهة متجرك. إليك 5 أسرار مثبتة:\n\n1. سرعة التحميل: كل ثانية تأخير تقلل التحويلات بنسبة 7%\n2. تجربة المستخدم: اجعل رحلة الشراء بسيطة وسلسة\n3. الثقة البصرية: استخدم شهادات العملاء والضمانات\n4. الدعوة للعمل: أزرار واضحة ومقنعة في كل صفحة\n5. التخصيص: قدم تجربة مخصصة لكل زائر",
    en: "In the digital commerce world, your website is your storefront. Here are 5 proven secrets:\n\n1. Loading Speed: Every second of delay reduces conversions by 7%\n2. User Experience: Make the buying journey simple and smooth\n3. Visual Trust: Use testimonials and guarantees\n4. Call to Action: Clear, compelling buttons on every page\n5. Personalization: Deliver a tailored experience for each visitor",
    zh: "在数字商务世界中，您的网站就是您的店面。以下是5个经过验证的秘密：\n\n1. 加载速度：每延迟一秒，转化率降低7%\n2. 用户体验：使购买旅程简单流畅\n3. 视觉信任：使用客户评价和保证\n4. 行动号召：每页都有清晰引人注目的按钮\n5. 个性化：为每位访客提供定制体验",
  },
  "blog.post2.title": {
    ar: "اتجاهات تصميم المواقع في 2026",
    en: "Web Design Trends in 2026",
    zh: "2026年网页设计趋势",
  },
  "blog.post2.excerpt": {
    ar: "تعرف على أحدث اتجاهات التصميم التي تشكل مستقبل الويب",
    en: "Learn about the latest design trends shaping the future of the web",
    zh: "了解塑造网络未来的最新设计趋势",
  },
  "blog.post2.content": {
    ar: "التصميم الرقمي يتطور باستمرار. إليك أبرز اتجاهات 2026:\n\n• الزجاجية المورفية (Glassmorphism) مع تأثيرات ثلاثية الأبعاد\n• الأنيميشن التفاعلي المدعوم بالذكاء الاصطناعي\n• التصميم المظلم مع ألوان نيون حيوية\n• واجهات صوتية وحركية\n• تجارب غامرة مع الواقع المعزز في المتصفح",
    en: "Digital design is constantly evolving. Here are the top 2026 trends:\n\n• Glassmorphism with 3D effects\n• AI-powered interactive animations\n• Dark design with vibrant neon accents\n• Voice and gesture interfaces\n• Immersive browser-based AR experiences",
    zh: "数字设计在不断发展。以下是2026年的顶级趋势：\n\n• 玻璃拟态与3D效果\n• AI驱动的交互动画\n• 暗色设计配充满活力的霓虹色调\n• 语音和手势界面\n• 沉浸式浏览器AR体验",
  },
  "blog.post3.title": {
    ar: "كيف يغير الذكاء الاصطناعي قواعد اللعبة",
    en: "How AI Is Changing the Game",
    zh: "AI如何改变游戏规则",
  },
  "blog.post3.excerpt": {
    ar: "الذكاء الاصطناعي ليس المستقبل فحسب — إنه الحاضر",
    en: "AI isn't just the future — it's the present",
    zh: "AI不仅是未来——它就是现在",
  },
  "blog.post3.content": {
    ar: "الذكاء الاصطناعي يحول الأعمال الرقمية بطرق غير مسبوقة:\n\n• أتمتة خدمة العملاء بنسبة 80%\n• تحليل بيانات العملاء للتنبؤ بالسلوك\n• إنشاء محتوى مخصص تلقائياً\n• تحسين حملات التسويق في الوقت الفعلي\n• روبوتات محادثة ذكية تزيد المبيعات",
    en: "AI is transforming digital businesses in unprecedented ways:\n\n• Automating 80% of customer service\n• Analyzing customer data to predict behavior\n• Automatically creating personalized content\n• Optimizing marketing campaigns in real-time\n• Smart chatbots that increase sales",
    zh: "AI正在以前所未有的方式改变数字业务：\n\n• 自动化80%的客户服务\n• 分析客户数据预测行为\n• 自动创建个性化内容\n• 实时优化营销活动\n• 智能聊天机器人增加销售",
  },
  "blog.post4.title": {
    ar: "دليلك الشامل للتسويق الرقمي",
    en: "Your Complete Digital Marketing Guide",
    zh: "您的完整数字营销指南",
  },
  "blog.post4.excerpt": {
    ar: "كل ما تحتاج معرفته لتسويق مشروعك بنجاح",
    en: "Everything you need to know to market your business successfully",
    zh: "成功营销业务所需的一切",
  },
  "blog.post4.content": {
    ar: "التسويق الرقمي الفعال يتطلب استراتيجية متكاملة:\n\n1. حدد جمهورك المستهدف بدقة\n2. أنشئ محتوى قيم يحل مشاكل العملاء\n3. استثمر في تحسين محركات البحث (SEO)\n4. استخدم وسائل التواصل الاجتماعي بذكاء\n5. قس النتائج وحسّن باستمرار",
    en: "Effective digital marketing requires an integrated strategy:\n\n1. Define your target audience precisely\n2. Create valuable content that solves customer problems\n3. Invest in SEO\n4. Use social media strategically\n5. Measure results and continuously improve",
    zh: "有效的数字营销需要综合策略：\n\n1. 精确定义目标受众\n2. 创建解决客户问题的有价值内容\n3. 投资SEO\n4. 战略性地使用社交媒体\n5. 衡量结果并持续改进",
  },
  "blog.cta": {
    ar: "استشرنا عبر واتساب",
    en: "Consult us on WhatsApp",
    zh: "通过WhatsApp咨询我们",
  },
  "blog.cta.message": {
    ar: "مرحباً، قرأت مقالكم وأريد استشارة",
    en: "Hi, I read your article and want a consultation",
    zh: "你好，我读了你们的文章，想咨询一下",
  },

  // Privacy
  "privacy.section1.title": {
    ar: "جمع المعلومات",
    en: "Information Collection",
    zh: "信息收集",
  },
  "privacy.section1.content": {
    ar: "نجمع المعلومات التي تقدمها لنا طوعاً عند التواصل معنا عبر نموذج الاتصال أو واتساب، بما في ذلك اسمك وبريدك الإلكتروني ورسالتك.",
    en: "We collect information you voluntarily provide when contacting us via the contact form or WhatsApp, including your name, email, and message.",
    zh: "我们收集您通过联系表单或WhatsApp自愿提供的信息，包括您的姓名、电子邮件和消息。",
  },
  "privacy.section2.title": {
    ar: "استخدام المعلومات",
    en: "Use of Information",
    zh: "信息使用",
  },
  "privacy.section2.content": {
    ar: "نستخدم معلوماتك فقط للرد على استفساراتك وتقديم خدماتنا. لا نبيع أو نشارك بياناتك مع أطراف ثالثة.",
    en: "We use your information solely to respond to your inquiries and provide our services. We do not sell or share your data with third parties.",
    zh: "我们仅使用您的信息来回复您的查询和提供服务。我们不会向第三方出售或分享您的数据。",
  },
  "privacy.section3.title": {
    ar: "حماية البيانات",
    en: "Data Protection",
    zh: "数据保护",
  },
  "privacy.section3.content": {
    ar: "نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الإفشاء.",
    en: "We implement appropriate security measures to protect your information from unauthorized access, modification, or disclosure.",
    zh: "我们采取适当的安全措施保护您的信息免受未经授权的访问、修改或泄露。",
  },
  "privacy.section4.title": {
    ar: "ملفات تعريف الارتباط",
    en: "Cookies",
    zh: "Cookie政策",
  },
  "privacy.section4.content": {
    ar: "يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربتك. يمكنك تعطيلها من إعدادات متصفحك.",
    en: "Our website uses cookies to improve your experience. You can disable them in your browser settings.",
    zh: "我们的网站使用Cookie来改善您的体验。您可以在浏览器设置中禁用它们。",
  },
  "privacy.section5.title": {
    ar: "التواصل معنا",
    en: "Contact Us",
    zh: "联系我们",
  },
  "privacy.section5.content": {
    ar: "إذا كانت لديك أي أسئلة حول سياسة الخصوصية، يمكنك التواصل معنا عبر واتساب أو نموذج الاتصال في الموقع.",
    en: "If you have any questions about our privacy policy, you can contact us via WhatsApp or the contact form on our website.",
    zh: "如果您对我们的隐私政策有任何疑问，可以通过WhatsApp或网站上的联系表单与我们联系。",
  },

  // Packages v2 – tabs & labels
  "packages.tab.content": {
    ar: "تصميم المحتوى",
    en: "Content Design",
    zh: "内容设计",
  },
  "packages.tab.ads": {
    ar: "الإعلانات المدفوعة",
    en: "Paid Ads",
    zh: "付费广告",
  },
  "packages.hub.label": {
    ar: "مركز الباقات الرقمية",
    en: "Digital Packages Hub",
    zh: "数字套餐中心",
  },
  "packages.requested": {
    ar: "الأكثر طلباً",
    en: "Most Requested",
    zh: "最受欢迎",
  },
  "packages.yer": { ar: "ريال يمني", en: "YER", zh: "也门里亚尔" },
  "packages.note": {
    ar: "جميع الأسعار تبدأ من — تواصل معنا لباقة مخصصة لاحتياجاتك",
    en: "All prices are starting from — contact us for a package tailored to your needs",
    zh: "所有价格均为起价 — 联系我们获取定制套餐",
  },

  // Content Design package names
  "packages.content.basic.name": {
    ar: "الباقة الأساسية",
    en: "Basic Package",
    zh: "基础套餐",
  },
  "packages.content.standard.name": {
    ar: "الباقة القياسية",
    en: "Standard Package",
    zh: "标准套餐",
  },
  "packages.content.premium.name": {
    ar: "الباقة المميزة",
    en: "Premium Package",
    zh: "高级套餐",
  },

  // Content Design – expanded description
  "packages.content.basic.name.desc": {
    ar: "مثالي للعلامات التجارية الناشئة التي تحتاج إلى حضور مرئي متسق على السوشيال ميديا.",
    en: "Perfect for emerging brands needing consistent visual presence on social media.",
    zh: "适合需要在社交媒体上保持一致视觉呈现的新兴品牌。",
  },
  "packages.content.standard.name.desc": {
    ar: "يشمل تخطيط تقويم المحتوى ورسومات محسّنة لزيادة تفاعل الحملات.",
    en: "Includes content calendar planning and campaign-optimised graphics for higher engagement.",
    zh: "包含内容日历规划和活动优化图形，提升互动率。",
  },
  "packages.content.premium.name.desc": {
    ar: "مثالي للعلامات التي تحتاج إلى محتوى متحرك وقوالب حملات احترافية.",
    en: "Ideal for brands needing animated content and professional campaign templates.",
    zh: "适合需要动态内容和专业活动模板的品牌。",
  },

  // Paid Ads package names
  "packages.ads.starter.name": {
    ar: "باقة البداية",
    en: "Starter Package",
    zh: "入门套餐",
  },
  "packages.ads.growth.name": {
    ar: "باقة النمو",
    en: "Growth Package",
    zh: "成长套餐",
  },
  "packages.ads.pro.name": {
    ar: "الباقة الاحترافية",
    en: "Pro Package",
    zh: "专业套餐",
  },

  // Paid Ads – expanded description
  "packages.ads.starter.name.desc": {
    ar: "إعداد أساسي لحملات Meta وGoogle مع استهداف بسيط لبدء النتائج.",
    en: "Basic Meta/Google campaign setup with simple targeting to start generating results.",
    zh: "Meta/Google基础活动配置，简单定向开始产生效果。",
  },
  "packages.ads.growth.name.desc": {
    ar: "إدارة حملات احترافية مع اختبار A/B وتقارير شهرية مفصّلة.",
    en: "Professional campaign management with A/B testing and detailed monthly reports.",
    zh: "专业活动管理，A/B测试和详细月度报告。",
  },
  "packages.ads.pro.name.desc": {
    ar: "حملات متعددة المنصات مع تحليلات متقدمة وتعديل استراتيجي مستمر.",
    en: "Multi-platform campaigns with advanced analytics and continuous strategy refinement.",
    zh: "多平台活动，高级分析和持续策略调整。",
  },

  // E-Commerce package names
  "packages.eco.basic.name": {
    ar: "متجر أساسي",
    en: "Basic Store",
    zh: "基础商店",
  },
  "packages.eco.standard.name": {
    ar: "متجر قياسي",
    en: "Standard Store",
    zh: "标准商店",
  },
  "packages.eco.full.name": {
    ar: "نظام متجر متكامل",
    en: "Full E-Commerce System",
    zh: "完整电商系统",
  },

  // E-Commerce – expanded description
  "packages.eco.basic.name.desc": {
    ar: "إعداد متجر إلكتروني بسيط مع إدارة المنتجات.",
    en: "Simple online store setup with product management.",
    zh: "简单网店设置，含产品管理。",
  },
  "packages.eco.standard.name.desc": {
    ar: "متجر متكامل مع بوابة الدفع ونظام إدارة المحتوى.",
    en: "Full store with payment gateway integration and CMS.",
    zh: "完整商店，含支付网关集成和CMS。",
  },
  "packages.eco.full.name.desc": {
    ar: "متجر مخصص بالكامل مع تطبيقات وميزات متقدمة.",
    en: "Fully custom store with apps and advanced features.",
    zh: "完全定制商店，含应用程序和高级功能。",
  },

  // Mixed package names
  "packages.mix.starter.name": {
    ar: "مزيج البداية",
    en: "Starter Mix",
    zh: "入门组合",
  },
  "packages.mix.growth.name": {
    ar: "مزيج النمو",
    en: "Growth Mix",
    zh: "成长组合",
  },
  "packages.mix.pro.name": {
    ar: "المزيج الاحترافي",
    en: "Pro Mix",
    zh: "专业组合",
  },

  // Mixed – expanded description
  "packages.mix.starter.name.desc": {
    ar: "محتوى أساسي مدمج مع إعلانات بداية لانطلاقة قوية.",
    en: "Basic content combined with starter ads for a strong launch.",
    zh: "基础内容与入门广告结合，强势启动。",
  },
  "packages.mix.growth.name.desc": {
    ar: "محتوى قياسي مع إعلانات نمو للحصول على أعلى تأثير.",
    en: "Standard content with growth ads for maximum impact.",
    zh: "标准内容与成长广告组合，实现最大影响力。",
  },
  "packages.mix.pro.name.desc": {
    ar: "محتوى مميز مع إعلانات احترافية لهيمنة رقمية كاملة.",
    en: "Premium content with pro ads for full digital dominance.",
    zh: "高级内容与专业广告，实现全面数字主导。",
  },

  // WhatsApp pre-filled messages – Content Design
  "packages.wa.content.basic": {
    ar: "مرحباً، أنا مهتم بباقة المحتوى الأساسية بسعر 50$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Basic Content Design Package at $50. Please contact me to start my project.",
    zh: "您好，我对50美元的基础内容设计套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.content.standard": {
    ar: "مرحباً، أنا مهتم بباقة المحتوى القياسية بسعر 75$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Standard Content Design Package at $75. Please contact me to start my project.",
    zh: "您好，我对75美元的标准内容设计套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.content.premium": {
    ar: "مرحباً، أنا مهتم بباقة المحتوى المميزة بسعر 100$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Premium Content Design Package at $100. Please contact me to start my project.",
    zh: "您好，我对100美元的高级内容设计套餐感兴趣，请联系我开始项目。",
  },

  // WhatsApp pre-filled messages – Paid Ads
  "packages.wa.ads.starter": {
    ar: "مرحباً، أنا مهتم بباقة الإعلانات الأساسية بسعر 75$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Starter Ads Package at $75. Please contact me to start my project.",
    zh: "您好，我对75美元的入门广告套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.ads.growth": {
    ar: "مرحباً، أنا مهتم بباقة الإعلانات للنمو بسعر 150$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Growth Ads Package at $150. Please contact me to start my project.",
    zh: "您好，我对150美元的成长广告套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.ads.pro": {
    ar: "مرحباً، أنا مهتم بباقة الإعلانات الاحترافية بسعر 225$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Pro Ads Package at $225. Please contact me to start my project.",
    zh: "您好，我对225美元的专业广告套餐感兴趣，请联系我开始项目。",
  },

  // WhatsApp pre-filled messages – E-Commerce
  "packages.wa.eco.basic": {
    ar: "مرحباً، أنا مهتم بباقة المتجر الأساسية بسعر 150$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Basic Store Package at $150. Please contact me to start my project.",
    zh: "您好，我对150美元的基础商店套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.eco.standard": {
    ar: "مرحباً، أنا مهتم بباقة المتجر القياسية بسعر 225$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Standard Store Package at $225. Please contact me to start my project.",
    zh: "您好，我对225美元的标准商店套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.eco.full": {
    ar: "مرحباً، أنا مهتم بباقة المتجر المتكامل بسعر 300$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Full E-Commerce System at $300. Please contact me to start my project.",
    zh: "您好，我对300美元的完整电商系统感兴趣，请联系我开始项目。",
  },

  // WhatsApp pre-filled messages – Mixed
  "packages.wa.mix.starter": {
    ar: "مرحباً، أنا مهتم بباقة المزيج الأساسية بسعر 100$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Starter Mix Package at $100. Please contact me to start my project.",
    zh: "您好，我对100美元的入门组合套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.mix.growth": {
    ar: "مرحباً، أنا مهتم بباقة مزيج النمو بسعر 200$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Growth Mix Package at $200. Please contact me to start my project.",
    zh: "您好，我对200美元的成长组合套餐感兴趣，请联系我开始项目。",
  },
  "packages.wa.mix.pro": {
    ar: "مرحباً، أنا مهتم بالمزيج الاحترافي بسعر 300$. أرجو التواصل لبدء مشروعي.",
    en: "Hello, I am interested in the Pro Mix Package at $300. Please contact me to start my project.",
    zh: "您好，我对300美元的专业组合套餐感兴趣，请联系我开始项目。",
  },

  // Chatbot
  "chatbot.title": {
    ar: "مساعد صُرَيمي",
    en: "Suriix Assistant",
    zh: "Suriix助手",
  },
  "chatbot.online": { ar: "متصل الآن", en: "Online now", zh: "在线" },
  "chatbot.welcome": {
    ar: "مرحباً! كيف يمكنني مساعدتك اليوم؟ 💜",
    en: "Hello! How can I help you today? 💜",
    zh: "你好！今天我能帮你什么？💜",
  },
  "chatbot.placeholder": {
    ar: "اكتب رسالتك...",
    en: "Type your message...",
    zh: "输入您的消息...",
  },
  "chatbot.quick.pricing": {
    ar: "الأسعار والباقات",
    en: "Pricing & Packages",
    zh: "价格与套餐",
  },
  "chatbot.quick.portfolio": {
    ar: "أعمالكم السابقة",
    en: "Your Portfolio",
    zh: "你们的作品",
  },
  "chatbot.quick.contact": {
    ar: "أريد التواصل",
    en: "I want to connect",
    zh: "我想联系",
  },
  "chatbot.quick.services": {
    ar: "ما خدماتكم؟",
    en: "What services?",
    zh: "你们的服务？",
  },
  "chatbot.reply.packages": {
    ar: "ممتاز! سأنقلك لباقاتنا الآن ←",
    en: "Great! Let me take you to our packages →",
    zh: "好的！让我带你去我们的套餐 →",
  },
  "chatbot.reply.portfolio": {
    ar: "تعال شاهد أحدث أعمالنا ←",
    en: "Come see our latest work →",
    zh: "来看看我们最新的作品 →",
  },
  "chatbot.reply.contact": {
    ar: "بالتأكيد! سأنقلك لنموذج التواصل ←",
    en: "Sure! Let me take you to our contact form →",
    zh: "当然！让我带你去联系表单 →",
  },
  "chatbot.reply.solutions": {
    ar: "اكتشف حلولنا المتكاملة ←",
    en: "Discover our integrated solutions →",
    zh: "了解我们的综合解决方案 →",
  },
  "chatbot.redirect": {
    ar: "سأوصلك بفريقنا عبر واتساب الآن...",
    en: "I'll connect you with our team via WhatsApp now...",
    zh: "我现在将通过WhatsApp为您联系我们的团队...",
  },

  // Language
  "lang.switch": { ar: "EN", en: "عربي", zh: "EN" },
};

const langLabels: Record<Language, string> = {
  ar: "عربي",
  en: "English",
  zh: "中文",
};

const langOrder: Language[] = ["en", "ar", "zh"];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
  langLabels: Record<Language, string>;
  langOrder: Language[];
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<Language>(() => {
    try {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const urlLang = params.get("lang") as Language;
        if (urlLang && ["ar", "en", "zh"].includes(urlLang)) {
          return urlLang;
        }
      }
    } catch (e) {
      // Ignore URL parsing errors
    }

    try {
      // استخدمنا مفتاح جديد لتجاوز أي تخزين سابق في المتصفح 
      const savedLang = localStorage.getItem("suriix_lang_v2") as Language;
      if (savedLang && ["ar", "en", "zh"].includes(savedLang)) {
        return savedLang;
      }
    } catch (e) {
      // تجاهل الخطأ في حالة حظر التخزين المحلي والاعتماد على لغة المتصفح
    }
    
    // فحص لغة المتصفح
    const browserLang = navigator.language || "";
    // إذا أردت أن يكون الموقع بالعربية "دائماً" حتى لو كان متصفح الزائر بالإنجليزية، 
    // يمكننا حذف هذا السطر. حالياً سيتحول للإنجليزية إذا كان متصفحك بالإنجليزية.
    if (browserLang.startsWith("en")) return "en";
    if (browserLang.startsWith("zh")) return "zh";
    
    return "ar"; // العربية هي اللغة الافتراضية لأي لغات أخرى
  });

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    try {
      localStorage.setItem("suriix_lang_v2", lang);
    } catch (e) {
      // تجاهل أخطاء التخزين في بيئات التصفح المقيدة
    }
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const t = (key: string): string => {
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t, dir, langLabels, langOrder }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
