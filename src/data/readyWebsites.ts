export interface ReadyWebsite {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  price: number;
  image: string;
  status: "Available" | "Sold" | "Limited";
  statusAr: string;
  features: string[];
  featuresAr: string[];
  description: string;
  descriptionAr: string;
  demoUrl?: string;
}

export const readyWebsitesData: ReadyWebsite[] = [
  {
    id: "photo-01",
    title: "Yemen Lens",
    titleAr: "عدسة اليمن",
    category: "Photography Portfolio",
    categoryAr: "معرض أعمال تصوير",
    price: 99,
    image: "/ready-projects/%D8%B9%D8%AF%D8%B3%D8%A9%20%D8%A7%D9%84%D9%8A%D9%85%D9%86/assets/hero.webp",
    status: "Available",
    statusAr: "متاح",
    features: ["Masonry Gallery", "Responsive Design", "Service Pricing", "Dark Theme"],
    featuresAr: ["معرض صور أنيق", "تصميم متجاوب", "تسعير الخدمات", "وضع داكن"],
    description: "A stunning portfolio website for photographers and videographers to showcase their creative work, featuring a beautiful masonry gallery, service pricing, and a modern dark theme aesthetic.",
    descriptionAr: "موقع معرض أعمال مذهل للمصورين وصناع الفيديو لعرض أعمالهم الإبداعية، يتميز بمعرض صور أنيق، وتسعير الخدمات، وتصميم عصري جذاب بالوضع الداكن.",
    demoUrl: "/ready-projects/%D8%B9%D8%AF%D8%B3%D8%A9%20%D8%A7%D9%84%D9%8A%D9%85%D9%86/index.html",
  },
  // {
  //   id: "saas-01",
  //   title: "Nexus SaaS Landing",
  //   titleAr: "نكسس صفحة هبوط SaaS",
  //   category: "Landing Page",
  //   categoryAr: "صفحة هبوط",
  //   price: 149,
  //   image: "/mockups/landing.png",
  //   status: "Limited",
  //   statusAr: "محدود",
  //   features: ["High Conversion", "Dark & Light Mode", "Interactive Animations", "Lead Generation"],
  //   featuresAr: ["معدل تحويل عالي", "الوضع الليلي والنهاري", "حركات تفاعلية", "تجميع بيانات العملاء"],
  //   description: "A high-converting landing page optimized for SaaS products and digital startups. Includes dynamic pricing tables, feature showcases, testimonials, and beautiful glassmorphic effects.",
  //   descriptionAr: "صفحة هبوط عالية التحويل محسّنة لمنتجات البرمجيات كخدمة (SaaS) والشركات الرقمية الناشئة. تتضمن جداول تسعير ديناميكية، وعرض للميزات، وشهادات، وتأثيرات زجاجية جميلة.",
  // },
  {
    id: "clinic-01",
    title: "YemenSmile Clinic",
    titleAr: "عيادة ابتسامتك",
    category: "Medical & Clinic",
    categoryAr: "عيادة طبية",
    price: 120,
    image: "/ready-projects/%D8%A7%D8%A8%D8%AA%D8%B3%D8%A7%D9%85%D8%AA%D9%83/assets/hero-clinic.webp",
    status: "Available",
    statusAr: "متاح",
    features: ["Online Booking System", "Services Showcase", "Testimonials", "WhatsApp Integration"],
    featuresAr: ["نظام حجز إلكتروني", "عرض الخدمات", "آراء العملاء", "ربط مباشر بالواتساب"],
    description: "A modern, high-conversion website for dental and medical clinics. Features a 24/7 online booking system, comprehensive service pages, and built-in WhatsApp integration.",
    descriptionAr: "موقع حديث وعالي التحويل للعيادات الطبية وعيادات الأسنان. يتميز بنظام حجز إلكتروني على مدار الساعة، وصفحات خدمات شاملة، وربط مباشر للحجز عبر الواتساب.",
    demoUrl: "/ready-projects/%D8%A7%D8%A8%D8%AA%D8%B3%D8%A7%D9%85%D8%AA%D9%83/index.html",
  }
];
