// Mock data for Admin Console
export interface StoreOwner {
  id: string;
  avatar: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  storeName: string;
  storeLink: string;
  storeLogo: string;
  storeDescription: string;
  productCount: number;
  orderCount: number;
  customerCount: number;
  salesTotal: number;
  profitsTotal: number;
  package: 'Starter' | 'Pro' | 'Enterprise';
  status: 'active' | 'pending' | 'banned';
  registrationDate: string;
  storeCreatedAt: string;
  subscriptionEndsAt: string;
}

export const mockStoreOwners: StoreOwner[] = [
  {
    id: "user-1",
    avatar: "https://i.pravatar.cc/150?u=1",
    fullName: "أحمد محمد",
    email: "ahmad@example.com",
    phone: "+966 50 123 4567",
    country: "السعودية",
    city: "الرياض",
    storeName: "متجر الأناقة",
    storeLink: "elegance-store",
    storeLogo: "https://i.pravatar.cc/100?u=10",
    storeDescription: "متجر متخصص في الأزياء العصرية للرجال والنساء.",
    productCount: 120,
    orderCount: 450,
    customerCount: 300,
    salesTotal: 45000,
    profitsTotal: 12000,
    package: "Pro",
    status: "active",
    registrationDate: "2025-01-15T10:00:00Z",
    storeCreatedAt: "2025-01-16T14:00:00Z",
    subscriptionEndsAt: "2026-01-15T10:00:00Z"
  },
  {
    id: "user-2",
    avatar: "https://i.pravatar.cc/150?u=2",
    fullName: "سارة عبدالله",
    email: "sara@example.com",
    phone: "+971 50 987 6543",
    country: "الإمارات",
    city: "دبي",
    storeName: "عطور سارة",
    storeLink: "sara-perfumes",
    storeLogo: "https://i.pravatar.cc/100?u=11",
    storeDescription: "أرقى العطور الفرنسية والشرقية الأصلية.",
    productCount: 45,
    orderCount: 1200,
    customerCount: 850,
    salesTotal: 150000,
    profitsTotal: 45000,
    package: "Enterprise",
    status: "active",
    registrationDate: "2024-11-20T08:30:00Z",
    storeCreatedAt: "2024-11-22T09:00:00Z",
    subscriptionEndsAt: "2025-11-20T08:30:00Z"
  },
  {
    id: "user-3",
    avatar: "https://i.pravatar.cc/150?u=3",
    fullName: "خالد سعيد",
    email: "khaled@example.com",
    phone: "+965 9000 1111",
    country: "الكويت",
    city: "مدينة الكويت",
    storeName: "تك هاب",
    storeLink: "tech-hub",
    storeLogo: "https://i.pravatar.cc/100?u=12",
    storeDescription: "أحدث الإلكترونيات والأجهزة الذكية.",
    productCount: 350,
    orderCount: 80,
    customerCount: 75,
    salesTotal: 98000,
    profitsTotal: 15000,
    package: "Starter",
    status: "pending",
    registrationDate: "2026-05-10T12:00:00Z",
    storeCreatedAt: "2026-05-15T10:00:00Z",
    subscriptionEndsAt: "2026-06-15T10:00:00Z"
  }
];
