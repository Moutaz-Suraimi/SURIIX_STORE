import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Heart, Search, User, Menu, Star, ChevronLeft, ChevronRight, 
  ShoppingBag, ShieldCheck, Truck, Headphones, BadgeDollarSign, Copy, CheckCircle2, QrCode, X, MessageSquare,
  LogIn, LogOut, Package, Wallet, Palette, Tag, BadgeCheck, Home, MapPin, Bell, Settings, Lock, Plus, Send, Banknote, Phone, Trash2, Eye, EyeOff, Mail
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/lib/supabase";
import { useNotifications } from "@/hooks/useNotifications";
import { notificationEvents } from "@/lib/notifications";

const mockProducts = [
  { id: 101, name: "عطر ليبر إنتنس الأصلي", price: 650, discountPrice: 420, rating: 4.8, reviews: 154, img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=400&h=400&fit=crop", isNew: true },
  { id: 102, name: "نظارات شمسية كلاسيكية", price: 299, discountPrice: null, rating: 4.2, reviews: 32, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&h=400&fit=crop" },
  { id: 103, name: "ساعة ذكية بشاشة أموليد", price: 899, discountPrice: 750, rating: 4.9, reviews: 890, img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=400&h=400&fit=crop", isBestSeller: true },
  { id: 104, name: "حقيبة جلدية فاخرة", price: 450, discountPrice: 380, rating: 4.5, reviews: 112, img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400&h=400&fit=crop" },
];

const categories = [
  { name: 'أجهزة منزلية', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=200&h=200&fit=crop' },
  { name: 'إكسسوارات', img: 'https://images.unsplash.com/photo-1512201078372-9c6b2a0d528b?w=200&h=200&fit=crop' },
  { name: 'عطور', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&h=200&fit=crop' },
  { name: 'ملابس', img: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=200&h=200&fit=crop' },
  { name: 'ألعاب', img: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=200&h=200&fit=crop' },
  { name: 'إلكترونيات', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop' },
];

const mostRequested = [
  { id: 201, name: "سماعة لاسلكية", price: 169, rating: 5.0, reviews: 300, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", rank: 1 },
  { id: 202, name: "ساعة ذكية", price: 209, rating: 4.8, reviews: 120, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", rank: 2 },
  { id: 203, name: "هاتف ذكي", price: 2399, rating: 4.9, reviews: 104, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop", rank: 3 },
  { id: 204, name: "عطر فاخر", price: 345, rating: 4.7, reviews: 88, img: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop", rank: 4 },
];

const newArrivals = [
  { id: 301, name: "سماعة بلوتوث احترافية", price: 199, rating: 4.6, reviews: 25, img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop" },
  { id: 302, name: "كاميرا رقمية 4K", price: 1299, rating: 4.9, reviews: 10, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop" },
  { id: 303, name: "حقيبة ظهر ضد الماء", price: 159, rating: 4.5, reviews: 40, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop" },
  { id: 304, name: "لابتوب حديث الأداء", price: 3199, rating: 5.0, reviews: 55, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop" },
];

// Reusable components
const SectionHeader = ({ title, showAll = true, onShowAll }: { title: string, showAll?: boolean, onShowAll?: () => void }) => (
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-2xl font-bold font-display text-slate-800 dark:text-white relative pb-2">
      {title}
      <span className="absolute bottom-0 right-0 w-12 h-1 bg-[#5B5EE5] rounded-full"></span>
    </h2>
    {showAll && (
      <button onClick={onShowAll} className="flex items-center gap-1 text-sm font-semibold text-[#5B5EE5] hover:underline">
        <ChevronRight className="w-4 h-4" /> عرض الكل 
      </button>
    )}
  </div>
);

const ProductCardItem = ({ product, rank, isNew, taxIncluded, onAddToCart, onClick }: { product: any, rank?: number, isNew?: boolean, taxIncluded?: boolean, onAddToCart: (p:any)=>void, onClick: ()=>void }) => (
  <div className="bg-white border flex flex-col border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group relative p-3 dark:bg-[#0f172a]">
    {rank && (
      <div className="absolute top-2 right-2 w-8 h-8 bg-amber-400 text-white rounded-xl shadow-md flex items-center justify-center font-black z-10">
        {rank}
      </div>
    )}
    {isNew && (
      <div className="absolute top-2 left-2 bg-[#5B5EE5] text-white px-3 py-1 rounded-lg text-xs font-bold z-10 tracking-widest shadow-md">
        NEW
      </div>
    )}
    
    <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden relative mb-4 cursor-pointer dark:bg-[#0f172a]" onClick={onClick}>
      <img src={product.img} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500 MixBlendMode-multiply" />
      <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <button className="bg-white/90 p-2 rounded-full text-slate-400 hover:text-red-500 shadow-sm dark:bg-[#0f172a] dark:text-slate-300"><Heart className="w-4 h-4" /></button>
      </div>
    </div>
    
    <div className="px-2 text-center pb-2">
       <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 dark:text-white">{product.name}</h3>
       <div className="flex justify-center items-center gap-1 mb-2">
          {Array(5).fill(0).map((_,i) => <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
          <span className="text-[10px] text-slate-400 mr-1 dark:text-slate-300">({product.reviews})</span>
       </div>
       {taxIncluded && <span className="text-[10px] bg-[#5B5EE5]/10 text-[#5B5EE5] px-2 py-0.5 rounded-full font-bold inline-block mb-1">الأسعار شاملة الضريبة</span>}
       <div className="font-black text-[#5B5EE5] text-lg mb-4">{product.price} <span className="text-xs">ر.ي</span></div>
       
       <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="w-full py-2.5 rounded-xl border border-[#5B5EE5] text-[#5B5EE5] font-bold text-sm hover:bg-[#5B5EE5] hover:text-white transition flex items-center justify-center gap-2">
         <ShoppingCart className="w-4 h-4" /> أضف للسلة
       </button>
    </div>
  </div>
);

const CustomerDashboardUi = ({ customer, storeData, cart, navigate, slug, activeProducts, customerOrders, setActivePage, onOpenCart, onLogout }: any) => {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false);
  const [addressForm, setAddressForm] = React.useState({ fullName: '', phone: '', city: '', area: '', details: '', notes: '', isDefault: false });
  const [addressErrors, setAddressErrors] = React.useState<any>({});

  // Real notifications from Supabase
  const notifUserId = customer?.supabase_id || customer?.auth_id || null;
  const { notifications: realNotifs, unread: unreadCount, markAsRead, markAllAsRead, remove: removeNotif } = useNotifications(notifUserId);

  const handleSaveAddress = () => {
    const errors: any = {};
    if (!addressForm.fullName) errors.fullName = 'الاسم الكامل مطلوب';
    if (!addressForm.phone) errors.phone = 'رقم الهاتف مطلوب';
    if (!addressForm.city) errors.city = 'المدينة / المحافظة مطلوبة';
    if (!addressForm.area) errors.area = 'الحي / المنطقة مطلوبة';
    if (!addressForm.details) errors.details = 'العنوان التفصيلي مطلوب';
    
    if (Object.keys(errors).length > 0) {
       setAddressErrors(errors);
       return;
    }
    setAddressErrors({});
    alert('تم حفظ العنوان بنجاح');
    setIsAddressModalOpen(false);
    setAddressForm({ fullName: '', phone: '', city: '', area: '', details: '', notes: '', isDefault: false });
  };

  const menuItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'orders', label: 'الطلبات', icon: Package },
    { id: 'track', label: 'تتبع الطلبات', icon: Truck },
    { id: 'wallet', label: 'المحفظة', icon: Wallet },
    { id: 'addresses', label: 'الشحن والعناوين', icon: MapPin },
    { id: 'favorites', label: 'المفضلة', icon: Heart },
    { id: 'coupons', label: 'الكوبونات والعروض', icon: Tag },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'settings', label: 'إعدادات الحساب', icon: Settings },
    { id: 'password', label: 'تغيير كلمة المرور', icon: Lock },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <aside className="w-[280px] bg-[#1a1c29] text-white flex flex-col h-full shrink-0 overflow-y-auto">
        <div className="p-8 flex justify-center">
            {storeData?.logo ? <img src={storeData.logo} className="h-10 object-contain" /> : <div className="text-2xl font-black tracking-widest uppercase">SURIIX</div>}
        </div>
        
        <div className="flex-1 px-4 space-y-1 mt-4">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-6 py-3.5 rounded-xl font-bold transition ${activeTab === item.id ? 'bg-[#5B5EE5] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5 dark:bg-[#0f172a] dark:text-slate-300'}`}>
               <item.icon className="w-5 h-5" />
               <span className="text-sm">{item.label}</span>
            </button>
          ))}
          
          <button onClick={onLogout} className="w-full flex items-center gap-4 px-6 py-3.5 rounded-xl font-bold text-rose-400 hover:bg-rose-500/10 transition mt-4">
             <LogOut className="w-5 h-5" />
             <span className="text-sm">تسجيل الخروج</span>
          </button>
        </div>

        <div className="p-6">
           <div className="bg-white/5 border border-white/10 p-5 rounded-2xl text-center dark:bg-[#0f172a]">
              <h4 className="font-bold text-sm mb-1">تحتاج مساعدة؟</h4>
              <p className="text-xs text-slate-400 mb-4 dark:text-slate-300">فريق الدعم متاح 24/4</p>
              <button className="w-full bg-[#5B5EE5] hover:bg-[#4a4ec4] py-2 rounded-lg font-bold text-xs flex justify-center items-center gap-2 transition">
                 <MessageSquare className="w-4 h-4"/> تواصل معنا
              </button>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar p-6 lg:p-10">
         <header className="flex justify-between items-center mb-10">
            <div className="relative w-full max-w-md hidden md:block">
               <input type="text" placeholder="ابحث عن منتج..." className="w-full bg-white border border-slate-200 rounded-full h-12 pr-12 pl-4 text-sm outline-none focus:border-[#5B5EE5] shadow-sm dark:bg-[#0f172a] dark:border-slate-800"/>
               <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 dark:text-slate-300" />
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <button onClick={onOpenCart} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 relative hover:text-[#5B5EE5] dark:bg-[#0f172a] dark:text-slate-300">
                     <ShoppingCart className="w-5 h-5"/>
                     {cart?.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">{cart.length}</span>}
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-600 shadow-sm border border-slate-100 relative hover:text-[#5B5EE5] dark:bg-[#0f172a] dark:text-slate-300">
                     <Bell className="w-5 h-5"/>
                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5B5EE5] text-white rounded-full text-[10px] flex items-center justify-center font-bold">3</span>
                  </button>
               </div>
               
               <div className="flex items-center gap-3 border-l border-slate-200 pl-6 dark:border-slate-800">
                 <div className="text-left">
                   <h3 className="font-bold text-slate-800 text-sm flex justify-end items-center gap-1 dark:text-white">مرحباً، {customer?.name?.split(' ')[0]} <span className="text-lg">👋</span></h3>
                   <span className="text-xs text-slate-500 dark:text-slate-300">مرحباً بك في حسابك الشخصي</span>
                 </div>
                 <div className="w-12 h-12 bg-[#5B5EE5] text-white rounded-full flex items-center justify-center font-black text-xl shadow-sm">
                   {customer?.name?.charAt(0)}
                 </div>
               </div>
            </div>
         </header>

         {activeTab === 'dashboard' && (
           <div className="space-y-8">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center dark:bg-[#0f172a]">
                    <div className="flex-1">
                       <h4 className="text-slate-500 text-sm font-bold mb-1 dark:text-slate-300">المحفظة</h4>
                       <div className="text-2xl font-black text-slate-800 dark:text-white">${customer?.wallet || '0.00'}</div>
                       <button className="text-[#5B5EE5] text-xs font-bold mt-2">عرض المحفظة</button>
                    </div>
                    <div className="w-14 h-14 bg-[#5B5EE5]/10 text-[#5B5EE5] rounded-full flex items-center justify-center">
                       <Wallet className="w-6 h-6"/>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center dark:bg-[#0f172a]">
                    <div className="flex-1">
                       <h4 className="text-slate-500 text-sm font-bold mb-1 dark:text-slate-300">الطلبات</h4>
                       <div className="text-2xl font-black text-slate-800 dark:text-white">{customerOrders?.length || 0}</div>
                       <button className="text-[#3b82f6] text-xs font-bold mt-2">عرض الطلبات</button>
                    </div>
                    <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                       <Package className="w-6 h-6"/>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center dark:bg-[#0f172a]">
                    <div className="flex-1">
                       <h4 className="text-slate-500 text-sm font-bold mb-1 dark:text-slate-300">المفضلة</h4>
                       <div className="text-2xl font-black text-slate-800 dark:text-white">0</div>
                       <button className="text-rose-500 text-xs font-bold mt-2">عرض المفضلة</button>
                    </div>
                    <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
                       <Heart className="w-6 h-6"/>
                    </div>
                 </div>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center dark:bg-[#0f172a]">
                    <div className="flex-1">
                       <h4 className="text-slate-500 text-sm font-bold mb-1 dark:text-slate-300">الكوبونات</h4>
                       <div className="text-2xl font-black text-slate-800 dark:text-white">3</div>
                       <button className="text-emerald-500 text-xs font-bold mt-2">عرض الكوبونات</button>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                       <Tag className="w-6 h-6"/>
                    </div>
                 </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:bg-[#0f172a]">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="font-black text-lg text-slate-800 dark:text-white">آخر الطلبات</h3>
                      <button className="text-[#5B5EE5] text-sm font-bold hover:underline flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> عرض جميع الطلبات</button>
                   </div>
                   
                   <div className="space-y-4">
                     {customerOrders?.slice(0,4).map((o:any, i:number) => (
                       <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-xl transition px-2 dark:bg-[#0f172a]">
                          <img src={o.img || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1">
                             <div className="font-bold text-sm text-slate-800 line-clamp-1 dark:text-white">{o.id} - {o.product}</div>
                             <div className="text-xs text-slate-400 mt-1 dark:text-slate-300">{o.date}</div>
                          </div>
                          <div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${o.status==='تم التسليم'||o.status==='تم' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>{o.status}</span>
                          </div>
                          <div className="text-left w-20">
                             <div className="font-black text-slate-800 text-sm dark:text-white">{o.price} ر.ي</div>
                             <div className="text-[10px] text-slate-400 mt-0.5 dark:text-slate-300">المجموع</div>
                          </div>
                       </div>
                     ))}
                     {(!customerOrders || customerOrders.length === 0) && (
                        <div className="text-center py-6 text-slate-400 text-sm dark:text-slate-300">لا توجد طلبات سابقة.</div>
                     )}
                   </div>
                   
                   <button className="w-full mt-6 py-4 rounded-xl border border-slate-200 text-[#5B5EE5] font-bold text-sm flex justify-center items-center gap-2 hover:bg-[#5B5EE5] hover:text-white hover:border-transparent transition dark:border-slate-800">
                      <Package className="w-4 h-4"/> تتبع جميع الطلبات
                   </button>
                </div>

                <div className="space-y-6">
                   <div className="bg-gradient-to-br from-[#5B5EE5] to-[#4043b3] rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
                      <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl dark:bg-[#0f172a]"></div>
                      <div className="flex justify-between items-center mb-8 relative z-10">
                         <span className="font-bold text-sm text-white/80">رصيد المحفظة</span>
                         <Wallet className="w-5 h-5 text-white/80" />
                      </div>
                      <div className="text-center relative z-10 mb-8">
                         <div className="text-4xl font-black">${customer?.wallet || '0.00'}</div>
                         <div className="text-xs text-white/70 mt-2">الرصيد الحالي</div>
                      </div>
                      <div className="flex gap-3 relative z-10">
                         <button className="flex-1 bg-white text-[#5B5EE5] py-3 rounded-xl font-bold flex justify-center items-center gap-2 text-sm hover:bg-slate-50 transition shadow-sm dark:bg-[#0f172a]">
                            <Plus className="w-4 h-4"/> شحن رصيد
                         </button>
                         <button className="flex-1 bg-white/20 border border-white/30 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 text-sm hover:bg-white/30 transition dark:bg-[#0f172a]">
                            <Send className="w-4 h-4"/> تحويل رصيد
                         </button>
                      </div>
                      <button className="w-full text-center text-xs text-white/80 font-bold mt-6 hover:text-white flex justify-center items-center gap-1"><ChevronLeft className="w-3 h-3"/> عرض جميع العمليات</button>
                   </div>

                   <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex items-center justify-between shadow-sm">
                      <div>
                         <h4 className="font-bold text-emerald-800 mb-1">لديك 3 كوبونات نشطة</h4>
                         <p className="text-xs text-emerald-600 mb-3">استخدمها الآن ووفر أكثر!</p>
                         <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition">عرض الكوبونات</button>
                      </div>
                      <div className="w-16 h-16 text-emerald-600 opacity-20 transform -rotate-12">
                         <Tag className="w-full h-full" />
                      </div>
                   </div>
                </div>
             </div>

             <div>
                <h3 className="font-black text-lg text-slate-800 mb-4 dark:text-white">تصفح سريع</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer dark:bg-[#0f172a]">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center"><Package className="w-6 h-6"/></div>
                      <span className="text-xs font-bold text-slate-700 dark:text-white">المرتجعات والاستبدالات</span>
                   </div>
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer dark:bg-[#0f172a]">
                      <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center"><Star className="w-6 h-6 fill-amber-500"/></div>
                      <span className="text-xs font-bold text-slate-700 dark:text-white">تقييماتي</span>
                   </div>
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer dark:bg-[#0f172a]">
                      <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center"><Headphones className="w-6 h-6"/></div>
                      <span className="text-xs font-bold text-slate-700 dark:text-white">الدعم الفني</span>
                   </div>
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer dark:bg-[#0f172a]">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center"><Banknote className="w-6 h-6"/></div>
                      <span className="text-xs font-bold text-slate-700 dark:text-white">طرق الدفع</span>
                   </div>
                   <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer dark:bg-[#0f172a]">
                      <div className="w-12 h-12 bg-[#5B5EE5]/10 text-[#5B5EE5] rounded-full flex items-center justify-center"><MapPin className="w-6 h-6"/></div>
                      <span className="text-xs font-bold text-slate-700 dark:text-white">عناويني</span>
                   </div>
                </div>
             </div>

             <div>
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-black text-lg text-slate-800 dark:text-white">منتجات قد تعجبك</h3>
                   <button onClick={() => { setActivePage('products'); navigate(`/store/${slug}`); }} className="text-[#5B5EE5] text-sm font-bold hover:underline py-1 px-3 flex items-center gap-1"><ChevronLeft className="w-4 h-4"/> عرض المزيد</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                   {activeProducts?.slice(0,4).map((p:any, i:number) => (
                     <div key={i} className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm hover:shadow-lg transition relative group dark:bg-[#0f172a]">
                        <button className="absolute top-4 left-4 text-slate-400 hover:text-rose-500 z-10 bg-white/80 p-2 rounded-full dark:bg-[#0f172a] dark:text-slate-300"><Heart className="w-4 h-4"/></button>
                        <div className="w-full h-40 bg-slate-50 rounded-2xl overflow-hidden mb-4 cursor-pointer dark:bg-[#0f172a]" onClick={() => navigate(`/store/${slug}/p/${p.id}`)}>
                           <img src={p.img} className="w-full h-full object-cover MixBlendMode-multiply group-hover:scale-110 transition duration-500" />
                        </div>
                        <div className="text-center">
                           <h4 className="font-bold text-sm text-slate-800 mb-1 dark:text-white">{p.name}</h4>
                           <span className="text-[10px] text-slate-400 block mb-2 dark:text-slate-300">{p.category || 'عام'}</span>
                           <div className="flex justify-center items-center gap-2 mb-4">
                              <span className="font-black text-[#5B5EE5] text-sm">${p.discountPrice || p.price}</span>
                              {p.discountPrice && <span className="text-xs text-slate-400 line-through dark:text-slate-300">${p.price}</span>}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-3xl border border-slate-100 mt-8 shadow-sm dark:bg-[#0f172a]">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center"><ShieldCheck className="w-5 h-5"/></div>
                   <div><h5 className="font-bold text-sm text-slate-800 dark:text-white">ضمان الجودة</h5><p className="text-[10px] text-slate-500 dark:text-slate-300">جودة مضمونة على المنتجات</p></div>
                </div>
                <div className="flex items-center gap-3 border-r border-slate-100 pr-4">
                   <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center"><Headphones className="w-5 h-5"/></div>
                   <div><h5 className="font-bold text-sm text-slate-800 dark:text-white">دعم 24/7</h5><p className="text-[10px] text-slate-500 dark:text-slate-300">دعم متاح على مدار الساعة</p></div>
                </div>
                <div className="flex items-center gap-3 border-r border-slate-100 pr-4">
                   <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center"><Truck className="w-5 h-5"/></div>
                   <div><h5 className="font-bold text-sm text-slate-800 dark:text-white">شحن سريع</h5><p className="text-[10px] text-slate-500 dark:text-slate-300">توصيل لجميع الطلبات</p></div>
                </div>
                <div className="flex items-center gap-3 border-r border-slate-100 pr-4">
                   <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center"><ShieldCheck className="w-5 h-5"/></div>
                   <div><h5 className="font-bold text-sm text-slate-800 dark:text-white">دفع آمن 100%</h5><p className="text-[10px] text-slate-500 dark:text-slate-300">عمليات الدفع مؤمنة</p></div>
                </div>
             </div>

           </div>
         )}
         
         {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:bg-[#0f172a]">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 dark:text-white"><Package className="w-6 h-6 text-[#5B5EE5]"/> طلباتي</h3>
              {(!customerOrders || customerOrders.length === 0) ? (
                 <div className="text-center py-12 text-slate-400 dark:text-slate-300">
                   <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                   <p className="font-bold">لا توجد طلبات بعد.</p>
                   <button onClick={() => { setActivePage('products'); navigate(`/store/${slug}`); }} className="mt-4 text-[#5B5EE5] font-bold hover:underline">تصفح المنتجات</button>
                 </div>
              ) : (
                 <div className="space-y-4">
                   {customerOrders.map((o:any, i:number) => (
                     <div key={i} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition dark:bg-[#0f172a]">
                       {o.img && <img src={o.img} alt={o.product} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" />}
                       <div className="flex-1">
                          <h4 className="font-bold text-slate-800 line-clamp-1 dark:text-white">{o.id} - {o.product}</h4>
                          <div className="text-sm text-slate-500 mt-1 dark:text-slate-300">{o.date}</div>
                       </div>
                       <div className="text-left w-24 shrink-0">
                          <span className={`block text-xs font-bold px-3 py-1 rounded-full text-center mb-2 ${o.status==='تم التسليم'||o.status==='تم' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>{o.status}</span>
                          <span className="font-black text-[#5B5EE5]">{o.price} ر.ي</span>
                       </div>
                     </div>
                   ))}
                 </div>
              )}
            </div>
         )}
         
         {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#5B5EE5] to-[#4043b3] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 dark:bg-[#0f172a]"></div>
                 <h3 className="text-xl font-bold mb-8 relative z-10 flex items-center gap-2"><Wallet className="w-6 h-6"/> محفظتي</h3>
                 <div className="text-center relative z-10 mb-8">
                    <div className="text-5xl font-black">${customer?.wallet || '0.00'}</div>
                    <div className="text-sm font-medium text-white/80 mt-2">رصيد متاح للاستخدام في المتجر</div>
                 </div>
                 <div className="flex gap-4 relative z-10">
                    <button onClick={() => {
                        window.open(`https://wa.me/${storeData?.whatsapp?.replace('+','')}?text=${encodeURIComponent(`مرحباً، أنا العميل ${customer?.name}\nبريدي: ${customer?.email}\nأريد شحن رصيد محفظتي في المتجر.`)}`, '_blank');
                    }} className="flex-1 bg-white text-[#5B5EE5] py-3.5 rounded-xl font-black flex justify-center items-center gap-2 shadow-lg hover:scale-[1.02] transition dark:bg-[#0f172a]">
                       <Plus className="w-5 h-5"/> طلب شحن رصيد
                    </button>
                    <button className="flex-1 bg-white/20 border border-white/30 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-white/30 transition dark:bg-[#0f172a]">
                       <Send className="w-5 h-5"/> تحويل رصيد (قريباً)
                    </button>
                 </div>
              </div>
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:bg-[#0f172a]">
                 <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 dark:text-white"><BadgeDollarSign className="w-5 h-5 text-slate-400 dark:text-slate-300"/> سجل العمليات</h3>
                 <div className="text-center py-10 text-slate-400 dark:text-slate-300">
                    <BadgeDollarSign className="w-12 h-12 mx-auto mb-3 opacity-20"/>
                    <p className="font-bold text-sm">لا توجد عمليات سابقة</p>
                 </div>
              </div>
            </div>
         )}
         
         {activeTab === 'addresses' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:bg-[#0f172a]">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 dark:text-white"><MapPin className="w-6 h-6 text-[#5B5EE5]"/> عناويني</h3>
                 <button onClick={() => setIsAddressModalOpen(true)} className="bg-[#5B5EE5]/10 text-[#5B5EE5] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 hover:bg-[#5B5EE5]/20 transition"><Plus className="w-4 h-4"/> إضافة عنوان</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="border-2 border-[#5B5EE5] p-5 rounded-2xl relative bg-blue-50/50">
                    <span className="absolute top-4 left-4 bg-[#5B5EE5] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg">الافتراضي</span>
                    <h4 className="font-bold text-slate-800 mb-2 dark:text-white">المنزل</h4>
                    <p className="text-sm text-slate-600 mb-4 dark:text-slate-300">{customer?.address || 'يرجى إضافة تفاصيل العنوان واسم الشارع والمدينة لمعالجة طلباتكم بشكل أسرع.'}</p>
                    <div className="flex gap-2">
                       <button className="text-xs font-bold text-[#5B5EE5]">تعديل</button>
                       <span className="text-slate-300">|</span>
                       <button className="text-xs font-bold text-rose-500">حذف</button>
                    </div>
                 </div>
              </div>
            </div>
         )}
         
         {activeTab === 'favorites' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:bg-[#0f172a]">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 dark:text-white"><Heart className="w-6 h-6 text-rose-500 fill-rose-500"/> المفضلة</h3>
              <div className="text-center py-20 text-slate-400 dark:text-slate-300">
                 <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                 <p className="font-bold">لا توجد منتجات في المفضلة.</p>
                 <button onClick={() => { setActivePage('products'); navigate(`/store/${slug}`); }} className="mt-4 text-[#5B5EE5] font-bold hover:underline">تصفح المنتجات وأضف للمفضلة</button>
              </div>
            </div>
         )}
         
         {activeTab === 'coupons' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:bg-[#0f172a]">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 dark:text-white"><Tag className="w-6 h-6 text-emerald-500"/> الكوبونات والعروض</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="border border-dashed border-emerald-300 bg-emerald-50 rounded-2xl p-5 flex items-center">
                    <div className="flex-1">
                       <h4 className="font-bold text-emerald-800 text-lg">خصم 15%</h4>
                       <p className="text-xs text-emerald-600 mt-1">صالح حتى نهاية الشهر</p>
                    </div>
                    <div className="text-left">
                       <span className="block font-black text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-100 mb-2 dark:bg-[#0f172a]">WELCOME15</span>
                       <button onClick={()=>{navigator.clipboard.writeText('WELCOME15'); alert('تم النسخ');}} className="text-[10px] font-bold text-emerald-600 underline">نسخ الكود</button>
                    </div>
                 </div>
              </div>
            </div>
         )}
         
         {activeTab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:bg-[#0f172a]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 dark:text-white">
                  <Bell className="w-6 h-6 text-amber-500"/> الإشعارات
                  {unreadCount > 0 && <span className="w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">{unreadCount}</span>}
                </h3>
                {realNotifs.length > 0 && (
                  <button onClick={markAllAsRead} className="text-xs font-bold text-[#5B5EE5] hover:underline flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5"/> تحديد الكل كمقروء
                  </button>
                )}
              </div>
              {realNotifs.length === 0 ? (
                <div className="text-center py-16 text-slate-400 dark:text-slate-300">
                  <Bell className="w-14 h-14 mx-auto mb-4 opacity-20" />
                  <p className="font-bold">لا توجد إشعارات حتى الآن</p>
                  <p className="text-xs mt-1">ستصلك الإشعارات عند إتمام طلباتك وعمليات المحفظة</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {realNotifs.map((n: any) => {
                    const iconMap: Record<string, any> = {
                      order: { bg: 'bg-blue-100', text: 'text-blue-600', icon: Package },
                      payment: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: CheckCircle2 },
                      wallet: { bg: 'bg-purple-100', text: 'text-purple-600', icon: Wallet },
                      coupon: { bg: 'bg-amber-100', text: 'text-amber-600', icon: Tag },
                      system: { bg: 'bg-slate-100 dark:bg-[#0f172a]', text: 'text-slate-600 dark:text-slate-300', icon: Bell },
                    };
                    const style = iconMap[n.type] || iconMap.system;
                    const IconEl = style.icon;
                    return (
                      <div key={n.id} onClick={() => markAsRead(n.id)} className={`flex gap-4 p-4 rounded-2xl border cursor-pointer transition group ${n.is_read ? 'bg-white border-slate-100 dark:bg-[#0f172a]' : 'bg-blue-50/40 border-blue-100'}`}>
                        <div className={`w-10 h-10 ${style.bg} ${style.text} rounded-full flex items-center justify-center shrink-0`}>
                          <IconEl className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 dark:text-white">
                            {n.title}
                            {!n.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></span>}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 dark:text-slate-300">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block dark:text-slate-300">
                            {new Date(n.created_at).toLocaleString('ar-SA', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeNotif(n.id); }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition shrink-0 self-start mt-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
         )}
         
         {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:bg-[#0f172a]">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 dark:text-white"><Settings className="w-6 h-6 text-slate-600 dark:text-slate-300"/> إعدادات الحساب</h3>
              <div className="max-w-xl space-y-5">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-white">الاسم الكامل</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#5B5EE5] outline-none transition dark:bg-[#0f172a] dark:border-slate-800" defaultValue={customer?.name || ''}/>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-white">البريد الإلكتروني</label>
                    <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 outline-none dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300" defaultValue={customer?.email || ''} readOnly/>
                    <p className="text-[10px] text-slate-400 mt-1 dark:text-slate-300">لا يمكن تغيير البريد الإلكتروني.</p>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-white">رقم الهاتف</label>
                    <input type="tel" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#5B5EE5] outline-none transition dark:bg-[#0f172a] dark:border-slate-800" defaultValue={customer?.phone || ''}/>
                 </div>
                 <button onClick={()=>alert('تم حفظ الإعدادات')} className="bg-[#5B5EE5] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#4a4ec4] transition shadow-md">حفظ التعديلات</button>
              </div>
            </div>
         )}
         
         {activeTab === 'password' && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:bg-[#0f172a]">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 dark:text-white"><Lock className="w-6 h-6 text-slate-600 dark:text-slate-300"/> تغيير كلمة المرور</h3>
              <div className="max-w-xl space-y-5">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-white">كلمة المرور الحالية</label>
                    <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#5B5EE5] outline-none transition dark:bg-[#0f172a] dark:border-slate-800" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-white">كلمة المرور الجديدة</label>
                    <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#5B5EE5] outline-none transition dark:bg-[#0f172a] dark:border-slate-800" />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-white">تأكيد كلمة المرور الجديدة</label>
                    <input type="password" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#5B5EE5] outline-none transition dark:bg-[#0f172a] dark:border-slate-800" />
                 </div>
                 <button onClick={()=>alert('تم تحديث كلمة المرور')} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition shadow-sm">تحديث كلمة المرور</button>
              </div>
            </div>
         )}
         
         {['track'].includes(activeTab) && (
           <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm p-12 mt-4 min-h-[400px] dark:bg-[#0f172a] dark:text-slate-300">
              <Settings className="w-16 h-16 opacity-20 mb-4 animate-[spin_4s_linear_infinite]" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">عذراً، هذا القسم تحت الإنشاء</h3>
              <p className="text-sm mt-2 text-center max-w-md">نعمل باستمرار على إضافة ميزة {menuItems.find((m:any) => m.id === activeTab)?.label} إلى حسابك.</p>
           </div>
         )}
      </main>

      <AnimatePresence>
        {isAddressModalOpen && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.95, opacity:0}} className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] dark:bg-[#0f172a]">
              {/* Header */}
              <div className="w-full bg-gradient-to-r from-slate-50 to-white px-6 py-5 flex items-center justify-between border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2 dark:text-white"><MapPin className="w-5 h-5 text-[#5B5EE5]" /> إضافة عنوان جديد</h3>
                <button onClick={() => setIsAddressModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition shadow-sm dark:text-slate-300 dark:bg-[#0f172a]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Form Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 dark:text-white">الاسم الكامل <span className="text-rose-500">*</span></label>
                    <div className="relative">
                       <User className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300" />
                       <input value={addressForm.fullName} onChange={e=>setAddressForm(f=>({...f, fullName:e.target.value}))} type="text" placeholder="الاسم كما تفضل أن يتم الاتصال بك به" className={`w-full bg-slate-50/50 border ${addressErrors.fullName ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-[#5B5EE5] dark:border-slate-800'} rounded-xl px-4 py-3 pr-11 text-sm outline-none transition shadow-sm hover:bg-white focus:bg-white dark:bg-[#0f172a]`} />
                    </div>
                    {addressErrors.fullName && <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-500"></span>{addressErrors.fullName}</p>}
                 </div>
                 
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 dark:text-white">رقم الهاتف <span className="text-rose-500">*</span></label>
                    <div className="relative">
                       <Phone className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-300" />
                       <input value={addressForm.phone} onChange={e=>setAddressForm(f=>({...f, phone:e.target.value}))} type="tel" placeholder="رقم للتواصل السريع أثناء التوصيل" className={`w-full bg-slate-50/50 border ${addressErrors.phone ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-[#5B5EE5] dark:border-slate-800'} rounded-xl px-4 py-3 pr-11 text-sm font-sans outline-none transition shadow-sm hover:bg-white focus:bg-white text-right dark:bg-[#0f172a]`} dir="ltr" />
                    </div>
                    {addressErrors.phone && <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-500"></span>{addressErrors.phone}</p>}
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 dark:text-white">المدينة / المحافظة <span className="text-rose-500">*</span></label>
                      <input value={addressForm.city} onChange={e=>setAddressForm(f=>({...f, city:e.target.value}))} type="text" placeholder="مثال: الرياض" className={`w-full bg-slate-50/50 border ${addressErrors.city ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-[#5B5EE5] dark:border-slate-800'} rounded-xl px-4 py-3 text-sm outline-none transition shadow-sm hover:bg-white focus:bg-white dark:bg-[#0f172a]`} />
                      {addressErrors.city && <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-500"></span>{addressErrors.city}</p>}
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 dark:text-white">الحي / المنطقة <span className="text-rose-500">*</span></label>
                      <input value={addressForm.area} onChange={e=>setAddressForm(f=>({...f, area:e.target.value}))} type="text" placeholder="مثال: الياسمين" className={`w-full bg-slate-50/50 border ${addressErrors.area ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-[#5B5EE5] dark:border-slate-800'} rounded-xl px-4 py-3 text-sm outline-none transition shadow-sm hover:bg-white focus:bg-white dark:bg-[#0f172a]`} />
                      {addressErrors.area && <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-500"></span>{addressErrors.area}</p>}
                   </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 dark:text-white">العنوان التفصيلي <span className="text-rose-500">*</span></label>
                    <textarea value={addressForm.details} onChange={e=>setAddressForm(f=>({...f, details:e.target.value}))} placeholder="اسم الشارع، رقم المبنى، الطابق، رقم الشقة..." rows={3} className={`w-full bg-slate-50/50 border ${addressErrors.details ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-[#5B5EE5] dark:border-slate-800'} rounded-xl px-4 py-3 text-sm outline-none transition shadow-sm hover:bg-white focus:bg-white resize-none dark:bg-[#0f172a]`} />
                    {addressErrors.details && <p className="text-[10px] text-rose-500 font-bold mt-1.5 ml-2 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-500"></span>{addressErrors.details}</p>}
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 dark:text-white">ملاحظات إضافية (اختياري)</label>
                    <input value={addressForm.notes} onChange={e=>setAddressForm(f=>({...f, notes:e.target.value}))} type="text" placeholder="أقرب مَعلَم، أوقات التوصيل المفضلة..." className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-[#5B5EE5] outline-none transition shadow-sm hover:bg-white focus:bg-white dark:bg-[#0f172a] dark:border-slate-800" />
                 </div>

                 <label className="flex items-center gap-3 cursor-pointer group mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition dark:bg-[#0f172a] dark:border-slate-800">
                   <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition ${addressForm.isDefault ? 'bg-[#5B5EE5] border-[#5B5EE5]' : 'border-slate-300 group-hover:border-[#5B5EE5] dark:border-slate-800'}`}>
                     {addressForm.isDefault && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                   </div>
                   <input type="checkbox" className="hidden" checked={addressForm.isDefault} onChange={(e) => setAddressForm(f => ({...f, isDefault: e.target.checked}))} />
                   <span className="text-sm font-bold text-slate-700 select-none dark:text-white">اجعل هذا العنوان الافتراضي</span>
                 </label>
              </div>
              
              {/* Footer */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-3 dark:bg-[#0f172a]">
                 <button onClick={() => setIsAddressModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-xl hover:bg-slate-100 transition shadow-sm text-sm dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300">
                   إلغاء
                 </button>
                 <button onClick={handleSaveAddress} className="flex-1 bg-[#5B5EE5] text-white font-bold py-3.5 rounded-xl hover:bg-[#4a4ec4] hover:shadow-lg hover:-translate-y-0.5 transition shadow-sm shadow-[#5B5EE5]/20 text-sm flex justify-center items-center gap-2">
                   حفظ العنوان <CheckCircle2 className="w-4 h-4" />
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PublicStore = () => {
  const { slug, productId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [storeData, setStoreData] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [cartCouponCode, setCartCouponCode] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [cartDiscount, setCartDiscount] = useState<number | null>(null);
  const [openStaticPage, setOpenStaticPage] = useState<{key:string, title:string} | null>(null);

  React.useEffect(() => {
    setAppliedCoupon(null);
  }, [productId]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  React.useEffect(() => {
    const checkGoogleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const email = session.user.email;
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || email.split('@')[0];
        
        let existing: any = null;
        try { existing = JSON.parse(localStorage.getItem(`suriix_customer_${slug}`) || 'null'); } catch {}
        
        if (existing && existing.email === email) {
           setCustomer(existing);
        } else {
           const newCustomer = { name, email, phone: '', wallet: 0, joinDate: new Date().toLocaleDateString('ar-SA') };
           localStorage.setItem(`suriix_customer_${slug}`, JSON.stringify(newCustomer));
           setCustomer(newCustomer);
           
           // Background insert to DB
           try {
             let realStoreId: string | null = null;
             const isUUID = (val: any) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(val));
             const st = JSON.parse(localStorage.getItem('suriix_added_stores') || '[]').find((s:any)=>s.slug===slug || s.url===slug);
             if (st?.id && isUUID(st.id)) realStoreId = st.id;
             if (!realStoreId && slug) {
                const { data: storeRow } = await supabase.from('stores').select('id').eq('store_url', slug).single();
                if (storeRow?.id) realStoreId = storeRow.id;
             }
             if (realStoreId) {
               await supabase.from('store_customers').insert({ store_id: realStoreId, name, email, phone: '' });
             }
           } catch(e) {}
        }
      }
    };
    checkGoogleAuth();
  }, [slug]);

  // Customer Account State
  const [customer, setCustomer] = useState<any>(() => {
    try { return JSON.parse(localStorage.getItem(`suriix_customer_${slug}`) || 'null'); } catch { return null; }
  });
  const [customerOrders, setCustomerOrders] = useState<any[]>(() => {
    try { return JSON.parse(localStorage.getItem(`suriix_orders_${slug}`) || '[]'); } catch { return []; }
  });
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [authError, setAuthError] = useState('');

  // Reviews State
  const [productReviews, setProductReviews] = useState<any[]>(() => {
    if (!productId) return [];
    try { return JSON.parse(localStorage.getItem(`suriix_reviews_${productId}`) || '[]'); } catch { return []; }
  });
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState('');

  // Update reviews when product changes
  React.useEffect(() => {
    if (productId) {
      try {
         const existing = JSON.parse(localStorage.getItem(`suriix_reviews_${productId}`) || '[]');
         setProductReviews(existing);
      } catch { setProductReviews([]); }
    }
  }, [productId]);

  const saveCustomer = (c: any) => {
    localStorage.setItem(`suriix_customer_${slug}`, JSON.stringify(c));
    setCustomer(c);
  };

  const handleRegister = async () => {
    if (!authForm.name || !authForm.email || !authForm.password || !authForm.phone) { setAuthError('يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، رقم الهاتف، وكلمة المرور)'); return; }
    // Save locally and navigate immediately — never block on Supabase
    const newCustomer = { name: authForm.name, email: authForm.email, phone: authForm.phone, wallet: 0, joinDate: new Date().toLocaleDateString('ar-SA') };
    saveCustomer(newCustomer);
    setActivePage('profile');
    setAuthError('');

    // Background sync — fetch/create store_customers row and save its id for notifications
    ;(async () => {
      try {
        const isUUID = (val: any) => val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(val));
        let realStoreId: string | null = isUUID(storeData?.id) ? String(storeData.id) : null;
        if (!realStoreId && slug) {
          const { data: storeRow } = await supabase.from('stores').select('id').eq('store_url', slug).single();
          if (storeRow?.id) realStoreId = storeRow.id;
        }
        if (realStoreId) {
          // Check if customer already exists
          const { data: existingCust } = await supabase
            .from('store_customers')
            .select('id')
            .eq('store_id', realStoreId)
            .eq('email', authForm.email)
            .maybeSingle();

          let customerId: string | null = existingCust?.id ?? null;

          if (!customerId) {
            const { data: inserted, error } = await supabase
              .from('store_customers')
              .insert({ store_id: realStoreId, name: authForm.name, email: authForm.email, phone: authForm.phone || '' })
              .select('id')
              .single();
            if (error) { console.warn('store_customers insert:', error.message); }
            else customerId = inserted?.id ?? null;
          }

          // Save the customer's supabase row id so notifications work
          if (customerId) {
            const updated = { ...newCustomer, supabase_id: customerId };
            localStorage.setItem(`suriix_customer_${slug}`, JSON.stringify(updated));
            setCustomer(updated);

            // Send welcome notification
            try {
              await import('@/lib/notifications').then(({ notification }) =>
                notification.send({
                  user_id: customerId!,
                  type: 'system',
                  title: 'مرحباً بك! 🎉',
                  message: `أهلاً ${authForm.name}، تم إنشاء حسابك بنجاح في ${storeData?.name || 'المتجر'}. استمتع بأفضل تجربة تسوق!`,
                })
              );
            } catch { /* non-critical */ }

            try { await notificationEvents.adminAlert(`عميل جديد: ${authForm.name} سجّل في ${storeData?.name || 'المتجر'}`); } catch { /* non-critical */ }
          }
        }
      } catch (e) { console.warn('سينك الخلفية فشل (غير حرج):', e); }
    })();
  };

  const handleLogin = async () => {
    if (!authForm.email || !authForm.password) { setAuthError('يرجى إدخال البيانات'); return; }
    const existing: any = JSON.parse(localStorage.getItem(`suriix_customer_${slug}`) || 'null');
    if (existing && existing.email === authForm.email) {
      // If supabase_id is missing, fetch it from store_customers
      if (!existing.supabase_id) {
        try {
          const isUUID = (val: any) => val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(val));
          let realStoreId: string | null = isUUID(storeData?.id) ? String(storeData.id) : null;
          if (!realStoreId && slug) {
            const { data: storeRow } = await supabase.from('stores').select('id').eq('store_url', slug).single();
            if (storeRow?.id) realStoreId = storeRow.id;
          }
          if (realStoreId) {
            const { data: custRow } = await supabase
              .from('store_customers')
              .select('id')
              .eq('store_id', realStoreId)
              .eq('email', authForm.email)
              .maybeSingle();
            if (custRow?.id) {
              const updated = { ...existing, supabase_id: custRow.id };
              localStorage.setItem(`suriix_customer_${slug}`, JSON.stringify(updated));
              setCustomer(updated);
              setActivePage('profile');
              setAuthError('');
              return;
            }
          }
        } catch { /* non-critical */ }
      }
      setCustomer(existing); setActivePage('profile'); setAuthError('');
    } else {
      setAuthError('لا يوجد حساب بهذا البريد. سجّل حسابك أولاً.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + `/store/${slug}`
        }
      });
      if (error) throw error;
    } catch (e) {
      setAuthError('تعذر تسجيل الدخول بواسطة جوجل.');
    }
  };

  const placeOrder = (product: any) => {
    if (!customer) return;
    const order = { id: `#ORD-${Date.now().toString().slice(-5)}`, product: product.name, price: product.discountPrice || product.price, status: 'قيد المعالجة', date: new Date().toLocaleDateString('ar-SA'), img: product.img };
    const updated = [order, ...customerOrders];
    setCustomerOrders(updated);
    localStorage.setItem(`suriix_orders_${slug}`, JSON.stringify(updated));
  };


  const addToCart = (product: any, overridePrice?: number) => {
    setCart([...cart, { ...product, activePrice: overridePrice || product.discountPrice || product.price }]);
  };
  
  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const applyCartCoupon = () => {
    const coup = storeData?.coupons?.find((c:any) => c.code === cartCouponCode && c.active);
    if (coup) {
      setCartDiscount(coup.discount);
      alert('تم تطبيق الكوبون بنجاح!');
    } else {
      setCartDiscount(null);
      alert('كوبون غير صالح أو منتهي.');
    }
  };

  const baseCartTotal = cart.reduce((acc, item) => {
    const p = parseFloat(item.activePrice || item.discountPrice || item.price) || 0;
    return acc + p;
  }, 0);
  const cartTotal = cartDiscount ? Math.round(baseCartTotal * (1 - cartDiscount / 100)) : baseCartTotal;

  const loadStoreData = React.useCallback(() => {
    try {
      const str = localStorage.getItem('suriix_added_stores');
      if(str) {
         const list = JSON.parse(str);
         const st = slug ? list.find((s:any) => s.slug === slug) : list[0];
         setStoreData(st || list[0]);
      }
    } catch(e) {}
  }, [slug]);

  React.useEffect(() => {
    loadStoreData();
  }, [slug, loadStoreData]);

  // \u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0639\u0646\u062f \u062a\u063a\u064a\u064a\u0631 localStorage (\u0645\u0646 \u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645)
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'suriix_added_stores') {
        loadStoreData();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [loadStoreData]);

  const activeProducts = React.useMemo(() => {
    return storeData?.products?.length > 0 ? storeData.products : mockProducts;
  }, [storeData]);

  // Load offers from store data or localStorage
  const storeOffers = React.useMemo(() => {
    if (storeData?.offers && storeData.offers.length > 0) return storeData.offers;
    try {
      const key = `suriix_offers_${storeData?.id || 'default'}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch { return []; }
  }, [storeData]);

  const selectedProduct = React.useMemo(() => {
    if (!productId) return null;
    return [...activeProducts, ...mostRequested, ...newArrivals].find((p:any) => String(p.id) === String(productId)) || null;
  }, [productId, activeProducts]);

  const displayBestSellers = React.useMemo(() => {
    if (!storeData?.products || storeData.products.length === 0) return mostRequested;
    const tagged = storeData.products.filter((p: any) => p.section === 'bestsellers');
    return tagged.length > 0 ? tagged : storeData.products.slice(0, 4);
  }, [storeData]);

  const displayNewArrivals = React.useMemo(() => {
    if (!storeData?.products || storeData.products.length === 0) return newArrivals;
    const tagged = storeData.products.filter((p: any) => p.section === 'newarrivals');
    return tagged.length > 0 ? tagged : [...storeData.products].reverse().slice(0, 4);
  }, [storeData]);

  const displayFeatured = React.useMemo(() => {
    if (!storeData?.products || storeData.products.length === 0) return activeProducts.slice(0, 4);
    const tagged = storeData.products.filter((p: any) => p.section === 'featured');
    return tagged.length > 0 ? tagged : storeData.products.slice(0,4);
  }, [storeData, activeProducts]);

  const copyCode = () => {
    navigator.clipboard.writeText('SILVER15');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- Maintenance Mode Check ---
  if (storeData?.maintenance) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center" dir="rtl">
        <div className="text-center max-w-md mx-4">
          <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-5xl">🔧</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-4 dark:text-white">المتجر تحت الصيانة</h1>
          <p className="text-slate-500 font-medium text-lg mb-2 dark:text-slate-300">{storeData.name || 'متجرنا'}</p>
          <p className="text-slate-400 dark:text-slate-300">نعمل حالياً على تحسينات لتجربة تسوق أفضل لك. سنعود قريباً.</p>
          {storeData.whatsapp && (
            <a href={`https://wa.me/${storeData.whatsapp.replace('+','')}`} target="_blank" className="inline-flex items-center gap-2 mt-6 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">
              <MessageSquare className="w-5 h-5" /> تواصل عبر واتساب
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-[#fafafa]" 
      dir="rtl"
      style={{
        '--primary-color': storeData?.theme_color || '#5B5EE5',
        fontFamily: storeData?.font_family ? `"${storeData.font_family}", sans-serif` : undefined,
      } as React.CSSProperties}
    >
      <style>{`
        .bg-\\[\\#5B5EE5\\] { background-color: var(--primary-color) !important; }
        .text-\\[\\#5B5EE5\\] { color: var(--primary-color) !important; }
        .border-\\[\\#5B5EE5\\] { border-color: var(--primary-color) !important; }
        .shadow-\\[\\#5B5EE5\\]\\/30 { box-shadow: 0 20px 25px -5px color-mix(in srgb, var(--primary-color) 30%, transparent) !important; }
        .shadow-\\[\\#5B5EE5\\]\\/20 { box-shadow: 0 20px 25px -5px color-mix(in srgb, var(--primary-color) 20%, transparent) !important; }
        .hover\\:bg-\\[\\#5B5EE5\\]:hover { background-color: var(--primary-color) !important; }
        .hover\\:text-\\[\\#5B5EE5\\]:hover { color: var(--primary-color) !important; }
        .hover\\:border-\\[\\#5B5EE5\\]:hover { border-color: var(--primary-color) !important; }
        .from-\\[\\#3e42c2\\] { --tw-gradient-from: color-mix(in srgb, var(--primary-color) 80%, black) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;  }
        .via-\\[\\#5B5EE5\\] { --tw-gradient-via: var(--primary-color) !important; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-via), var(--tw-gradient-to) !important;  }
        .to-\\[\\#7f82eb\\] { --tw-gradient-to: color-mix(in srgb, var(--primary-color) 80%, white) !important;  }
      `}</style>
      
      {activePage === 'profile' && customer ? (
         <CustomerDashboardUi 
            customer={customer} 
            storeData={storeData} 
            cart={cart}
            navigate={navigate}
            slug={slug}
            activeProducts={activeProducts}
            customerOrders={customerOrders}
            setActivePage={setActivePage}
            onOpenCart={() => setIsCartOpen(true)}
            onLogout={() => { setCustomer(null); localStorage.removeItem(`suriix_customer_${slug}`); setActivePage('home'); }}
         />
      ) : (
         <>
         {/* Top Header / Navbar */}
         <header className="bg-white sticky top-0 z-50 shadow-sm dark:bg-[#0f172a]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-[#5B5EE5] rounded-xl flex items-center justify-center text-white font-bold text-xl uppercase overflow-hidden">
              {storeData?.logo ? <img src={storeData.logo} alt="Store Logo" className="w-full h-full object-cover"/> : (storeData?.name ? storeData.name.charAt(0) : <ShoppingBag className="w-6 h-6" />)}
            </div>
            <span className="font-black text-xl text-slate-800 dark:text-white">{storeData?.name || 'متجر'}</span>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 font-bold text-sm text-slate-600 cursor-pointer dark:text-slate-300">
            <a onClick={() => { setActivePage('home'); navigate(`/store/${slug}`); }} className={`transition ${activePage === 'home' || !!productId ? 'text-[#5B5EE5] border-b-2 border-[#5B5EE5] pb-1' : 'hover:text-[#5B5EE5]'}`}>الرئيسية</a>
            <a onClick={() => { setActivePage('categories'); navigate(`/store/${slug}`); }} className={`transition ${activePage === 'categories' && !productId ? 'text-[#5B5EE5] border-b-2 border-[#5B5EE5] pb-1' : 'hover:text-[#5B5EE5]'}`}>التصنيفات</a>
            <a onClick={() => { setActivePage('products'); navigate(`/store/${slug}`); }} className={`transition ${activePage === 'products' && !productId ? 'text-[#5B5EE5] border-b-2 border-[#5B5EE5] pb-1' : 'hover:text-[#5B5EE5]'}`}>المنتجات</a>
            <a onClick={() => { setActivePage('offers'); navigate(`/store/${slug}`); }} className={`transition ${activePage === 'offers' && !productId ? 'text-[#5B5EE5] border-b-2 border-[#5B5EE5] pb-1' : 'hover:text-[#5B5EE5]'}`}>العروض</a>
            {/* <a onClick={() => { setActivePage('track'); navigate(`/store/${slug}`); }} className={`transition ${activePage === 'track' && !productId ? 'text-[#5B5EE5] border-b-2 border-[#5B5EE5] pb-1' : 'hover:text-[#5B5EE5]'}`}>تتبع الطلب</a> */}
            <a onClick={() => { setActivePage('contact'); navigate(`/store/${slug}`); }} className={`transition ${activePage === 'contact' && !productId ? 'text-[#5B5EE5] border-b-2 border-[#5B5EE5] pb-1' : 'hover:text-[#5B5EE5]'}`}>تواصل معنا</a>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="ابحث عن المنتجات..." 
              className="w-full bg-slate-100 rounded-full h-11 pr-12 pl-4 outline-none focus:ring-2 focus:ring-[#5B5EE5]/30 text-sm font-medium transition dark:bg-[#0f172a]"
            />
            <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 dark:text-slate-300" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => { setActivePage(customer ? 'profile' : 'login'); navigate(`/store/${slug}`); }}
              title={customer ? customer.name : 'تسجيل الدخول'}
              className={`w-10 h-10 flex items-center justify-center rounded-full font-black transition border ${ (activePage === 'profile' || activePage === 'login' || activePage === 'register') ? 'bg-[#5B5EE5] text-white border-[#5B5EE5]' : 'text-slate-600 border-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300'}`}
            >
              {customer ? <span className="text-base">{customer.name.charAt(0)}</span> : <User className="w-5 h-5"/>}
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-[#5B5EE5] dark:text-slate-300"><Heart className="w-5 h-5"/></button>
            <button onClick={() => setIsCartOpen(true)} className="w-10 h-10 flex items-center justify-center text-[#5B5EE5] bg-[#5B5EE5]/10 rounded-full relative">
              <ShoppingCart className="w-5 h-5"/>
              {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">{cart.length}</span>}
            </button>
            <button className="lg:hidden p-2"><Menu className="w-6 h-6"/></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 space-y-16">
        
        {selectedProduct ? (
          <>
           <div className="bg-white rounded-[40px] p-6 lg:p-12 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row gap-10 lg:gap-16 dark:bg-[#0f172a]">
               <div className="flex-1 flex flex-col bg-[#fbfcfd] rounded-[32px] overflow-hidden border border-slate-100 p-8 relative">
                  <div className="flex-1 w-full flex items-center justify-center relative min-h-[300px]">
                    <img src={selectedProduct.img || "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&h=600&fit=crop"} className="w-full h-full max-h-[400px] object-contain drop-shadow-xl hover:scale-105 transition duration-700" alt={selectedProduct.name} />
                  </div>
                  
                  {/* Features below image */}
                  <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                    <div className="flex flex-col items-center text-center gap-2">
                       <ShieldCheck className="w-6 h-6 text-emerald-500" />
                       <div><h5 className="font-bold text-xs text-slate-800 dark:text-white">ضمان شامل</h5><p className="text-[10px] text-slate-500 dark:text-slate-300">راحة بالك مضمونة</p></div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                       <Truck className="w-6 h-6 text-emerald-500" />
                       <div><h5 className="font-bold text-xs text-slate-800 dark:text-white">توصيل سريع</h5><p className="text-[10px] text-slate-500 dark:text-slate-300">لباب منزلك</p></div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                       <Palette className="w-6 h-6 text-emerald-500" />
                       <div><h5 className="font-bold text-xs text-slate-800 dark:text-white">تصميم عصري</h5><p className="text-[10px] text-slate-500 dark:text-slate-300">يواكب تطلعاتك</p></div>
                    </div>
                    <div className="flex flex-col items-center text-center gap-2">
                       <BadgeCheck className="w-6 h-6 text-emerald-500" />
                       <div><h5 className="font-bold text-xs text-slate-800 dark:text-white">جودة عالية</h5><p className="text-[10px] text-slate-500 dark:text-slate-300">أفضل الخامات</p></div>
                    </div>
                  </div>

                  <button onClick={() => navigate(`/store/${slug}`)} className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 hover:text-[#5B5EE5] hover:scale-110 transition border border-slate-100 dark:bg-[#0f172a] dark:text-slate-300">
                     <ChevronRight className="w-5 h-5" />
                  </button>
               </div>
               
               <div className="flex-[1.2] flex flex-col justify-center text-right space-y-6 py-2">
                  <div>
                     <span className="text-xs font-black text-[#5B5EE5] bg-[#5B5EE5]/10 px-4 py-2 rounded-full mb-6 inline-block">تفاصيل المنتج</span>
                     <h1 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight mb-4 dark:text-white">{selectedProduct.name}</h1>
                     <div className="flex items-center gap-3 mb-6">
                       <div className="flex gap-1">
                         {Array(5).fill(0).map((_,i) => <Star key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                       </div>
                       <span className="text-sm text-slate-400 font-bold dark:text-slate-300">({selectedProduct.reviews || 0} تقييمات)</span>
                     </div>
                  </div>
                  
                  <p className="text-slate-500 text-lg leading-relaxed font-medium dark:text-slate-300">{selectedProduct.description || "استمتع بتجربة تسوق فريدة مع هذا المنتج الرائع الذي يقدم جودة استثنائية وقيمة لا تضاهى. مصمم خصيصاً ليناسب احتياجاتك بأفضل الخامات العالمية وبتصميم عصري يواكب تطلعاتك."}</p>
                  
                  <div className="text-4xl font-black text-[#5B5EE5] flex items-end gap-3 pt-2">
                     {appliedCoupon ? Math.round((selectedProduct.discountPrice || selectedProduct.price) * (1 - appliedCoupon.discount / 100)) : (selectedProduct.discountPrice || selectedProduct.price)} <span className="text-xl pb-1">ر.ي</span>
                     {((selectedProduct.discountPrice && !appliedCoupon) || appliedCoupon) && <span className="text-2xl text-slate-400 font-medium line-through pb-1 dark:text-slate-300">{selectedProduct.price}</span>}
                  </div>

                  {storeData?.coupons?.filter((c:any) => c.active && (c.target === 'all' || c.target === selectedProduct.category)).length > 0 && (
                     <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 relative mt-4">
                       {storeData.coupons.filter((c:any) => c.active && (c.target === 'all' || c.target === selectedProduct.category)).slice(0, 1).map((coup:any, idx:number) => (
                         <div key={idx} className="flex flex-col md:flex-row gap-6 items-center justify-between">
                           
                           {/* Right section (Text) */}
                           <div className="flex-1 text-right w-full">
                             <div className="flex items-center gap-2 justify-end mb-2">
                               <h4 className="text-emerald-600 font-black text-xl">كوبون الخصم</h4>
                               <Tag className="w-6 h-6 text-emerald-500" />
                             </div>
                             <p className="text-slate-500 font-medium dark:text-slate-300">استخدم الكوبون للحصول على خصم إضافي</p>
                             <div className="bg-emerald-100/80 text-emerald-700 text-sm font-black px-4 py-2.5 rounded-xl inline-block mt-4">
                               خصم {coup.discount}% على طلبك
                             </div>
                           </div>

                           {/* Left section (Code) */}
                           <div className="flex flex-col items-center gap-3 w-full md:w-auto">
                             <div className="border-2 border-dashed border-emerald-400 bg-white text-emerald-600 font-black text-3xl px-8 py-4 rounded-2xl text-center w-full min-w-[180px] tracking-widest uppercase shadow-sm dark:bg-[#0f172a]">
                               {coup.code}
                             </div>
                             <div className="flex w-full gap-2 mt-1">
                               <button onClick={() => { setAppliedCoupon(coup); }} className={`flex-1 ${appliedCoupon?.code === coup.code ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'} font-bold py-2 px-3 rounded-xl text-xs transition`}>
                                 {appliedCoupon?.code === coup.code ? 'تم تطبيق الخصم' : 'تطبيق'}
                               </button>
                               <button onClick={() => { navigator.clipboard.writeText(coup.code); }} className="flex-1 bg-white border border-slate-200 text-slate-500 hover:text-emerald-600 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1 transition shadow-sm dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300">
                                <Copy className="w-4 h-4" /> نسخ
                               </button>
                             </div>
                           </div>

                         </div>
                       ))}
                     </div>
                  )}

                  <div className="flex flex-col md:flex-row gap-4 mt-6 pt-4 border-t border-slate-100">
                    <a href={`https://wa.me/${storeData?.whatsapp?.replace('+','')}?text=${encodeURIComponent(`مرحباً، أرغب بشراء هذا المنتج مباشرة:\n\n*${selectedProduct.name}*\nالسعر: ${appliedCoupon ? Math.round((selectedProduct.discountPrice || selectedProduct.price) * (1 - appliedCoupon.discount / 100)) : (selectedProduct.discountPrice || selectedProduct.price)} ر.ي\nالكمية: 1`)}`} target="_blank" className="flex-1 bg-[#25D366] text-white px-6 py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#25D366]/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#25D366]/30 transition duration-300 flex justify-center items-center gap-3">
                       <MessageSquare className="w-6 h-6" /> الطلب عبر واتساب
                    </a>
                    <button onClick={() => addToCart(selectedProduct, appliedCoupon ? Math.round((selectedProduct.discountPrice || selectedProduct.price) * (1 - appliedCoupon.discount / 100)) : undefined)} className="flex-1 bg-[#5B5EE5] text-white px-6 py-4 rounded-2xl font-black text-lg shadow-xl shadow-[#5B5EE5]/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#5B5EE5]/30 transition duration-300 flex justify-center items-center gap-3">
                       <ShoppingCart className="w-6 h-6" /> إضافة للسلة
                    </button>
                  </div>
               </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-[40px] p-6 lg:p-12 border border-slate-100 shadow-xl mt-8 dark:bg-[#0f172a]">
              <h3 className="text-2xl font-bold font-display text-slate-800 mb-8 flex items-center gap-2 dark:text-white">
                 التقييمات والآراء
                 <span className="bg-slate-100 text-slate-500 text-sm px-3 py-1 rounded-full dark:text-slate-300 dark:bg-[#0f172a]">{productReviews.length}</span>
              </h3>
              
              <div className="flex flex-col lg:flex-row gap-12">
                 {/* Rating Form */}
                 <div className="flex-1 bg-slate-50 p-6 rounded-3xl border border-slate-200 dark:bg-[#0f172a] dark:border-slate-800">
                    <h4 className="font-bold text-lg mb-4">أضف تقييمك</h4>
                    <div className="flex items-center gap-2 mb-4">
                       {[1, 2, 3, 4, 5].map(star => (
                         <button key={star} onClick={() => setReviewRating(star)} className="focus:outline-none">
                            <Star className={`w-8 h-8 transition-colors ${reviewRating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300 hover:text-amber-300'}`} />
                         </button>
                       ))}
                    </div>
                    <textarea 
                       value={reviewComment}
                       onChange={e => setReviewComment(e.target.value)}
                       placeholder="اكتب تجربتك مع المنتج هنا..."
                       className="w-full bg-white border border-slate-200 p-4 rounded-xl min-h-[120px] mb-4 text-sm resize-none focus:outline-none focus:border-[#5B5EE5] focus:ring-1 focus:ring-[#5B5EE5] dark:bg-[#0f172a] dark:border-slate-800"
                    />
                    <button onClick={() => {
                        if (reviewRating === 0 || !reviewComment.trim()) { alert("يرجى اختيار التقييم وكتابة تعليق"); return; }
                        const newReview = { id: Date.now(), rating: reviewRating, comment: reviewComment, date: new Date().toLocaleDateString('ar-SA'), customerName: customer?.name || 'مستخدم ضيف' };
                        const updated = [newReview, ...productReviews];
                        setProductReviews(updated);
                        localStorage.setItem(`suriix_reviews_${selectedProduct.id}`, JSON.stringify(updated));
                        setReviewRating(0);
                        setReviewComment('');
                    }} className="bg-[#5B5EE5] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5B5EE5]/90 w-full transition shadow-sm">إرسال التقييم</button>
                    {!customer && <p className="text-xs text-slate-400 mt-3 text-center dark:text-slate-300">أنت غير مسجل الدخول، سيظهر تقييمك كـ مستخدم ضيف.</p>}
                 </div>

                 {/* Reviews List */}
                 <div className="flex-[1.5] space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {productReviews.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3 py-10 dark:text-slate-300">
                          <MessageSquare className="w-12 h-12 opacity-20" />
                          <p>لا توجد تقييمات حتى الآن. كن أول من يقيّم هذا المنتج!</p>
                       </div>
                    ) : (
                       productReviews.map((rev:any, i:number) => (
                         <div key={i} className="flex gap-4 border-b border-slate-100 pb-6 last:border-0">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold shrink-0 dark:text-slate-300 dark:bg-[#0f172a]">
                               {rev.customerName.charAt(0)}
                            </div>
                            <div>
                               <div className="flex items-center justify-between mb-1">
                                  <h5 className="font-bold text-slate-800 dark:text-white">{rev.customerName}</h5>
                                  <span className="text-xs text-slate-400 dark:text-slate-300">{rev.date}</span>
                               </div>
                               <div className="flex items-center gap-1 mb-2">
                                  {Array(5).fill(0).map((_, idx) => <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />)}
                               </div>
                               <p className="text-slate-600 text-sm leading-relaxed dark:text-slate-300">{rev.comment}</p>
                            </div>
                         </div>
                       ))
                    )}
                 </div>
              </div>
            </div>

            <div className="mt-16 w-full">
              <SectionHeader title="منتجات أخرى قد تعجبك" showAll={false} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {activeProducts.filter((p:any) => String(p.id) !== String(selectedProduct.id)).slice(0, 4).map((p:any, i:number) => (
                  <ProductCardItem key={i} product={p} taxIncluded={storeData?.taxIncluded} onAddToCart={addToCart} onClick={() => { navigate(`/store/${slug}/p/${p.id}`); window.scrollTo({top:0, behavior:'smooth'}); }} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
        {activePage === 'home' && (
          <>
        {/* HERO SECTION */}
        <section id="hero" className="relative w-full rounded-[40px] overflow-hidden shadow-2xl min-h-[400px] md:min-h-[500px] flex items-center bg-gradient-to-r from-[#3e42c2] via-[#5B5EE5] to-[#7f82eb]">
          {/* Background Layer: Custom banners OR default styles */}
          {storeData?.banners?.filter((b:any)=>b.placement==='hero').length > 0 ? (
            <div className="absolute inset-0 z-0 after:content-[''] after:absolute after:inset-0 after:bg-black/30">
               {storeData.banners.filter((b:any)=>b.placement==='hero').map((banner:any, idx:number) => (
                  <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === 0 ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={banner.img} className="w-full h-full object-cover" />
                  </div>
               ))}
            </div>
          ) : (
            <>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent z-0"></div>
              {/* Default Mockup images */}
              <div className="absolute left-0 top-0 bottom-0 w-1/2 hidden md:flex items-center justify-center z-0">
                 <div className="w-80 h-80 bg-white/10 rounded-full blur-3xl absolute dark:bg-[#0f172a]"></div>
                 <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop&bg=transparent" className="w-[300px] rounded-3xl rotate-12 shadow-2xl relative z-10 MixBlendMode-multiply" alt="Products" />
              </div>
            </>
          )}

          {/* Foreground Layer (Text & Buttons) */}
          <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between p-8 md:p-16 pointer-events-none">
            <div className="flex-1 text-right text-white space-y-6 md:pr-12 pointer-events-auto">
               {(storeData?.banners?.filter((b:any)=>b.placement==='hero')?.[0]?.showButtons !== false) && (
                 <>
                   <h2 className="text-xl md:text-2xl font-bold opacity-90 drop-shadow-md">اكتشف أحدث المنتجات</h2>
                   <h1 className="text-5xl md:text-7xl font-display font-black leading-tight flex flex-col drop-shadow-lg">
                     خصومات تصل إلى <span className="text-amber-300 text-6xl md:text-8xl mt-2 drop-shadow-xl">50%</span>
                   </h1>
                   <ul className="flex items-center gap-4 text-sm font-bold opacity-90 mt-2 mb-8 drop-shadow-md">
                     <li className="flex items-center gap-1.5"><ChevronLeft className="w-4 h-4"/> جودة عالية</li>
                     <li className="flex items-center gap-1.5"><ChevronLeft className="w-4 h-4"/> شحن سريع</li>
                   </ul>

                   <div className="flex gap-4 pt-4">
                     <button onClick={() => { setActivePage('products'); window.scrollTo({top:0, behavior:'smooth'}); }} className="bg-white text-[#5B5EE5] px-8 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition pointer-events-auto dark:bg-[#0f172a]">تسوق الآن</button>
                     <button onClick={() => { setActivePage('offers'); window.scrollTo({top:0, behavior:'smooth'}); }} className="bg-white/20 px-8 py-4 rounded-2xl border border-white/30 font-bold hover:bg-white/30 transition backdrop-blur-md text-white pointer-events-auto dark:bg-[#0f172a]">مشاهدة العروض</button>
                   </div>
                 </>
               )}
            </div>
            
            <div className="flex-1"></div> {/* Spacer for right side layout */}
          </div>
        </section>

        {/* Features Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm text-center -mt-8 relative z-20 mx-4 md:mx-12 dark:bg-[#0f172a]">
          <div className="flex flex-col items-center justify-center gap-3">
             <div className="w-12 h-12 bg-[#5B5EE5]/10 text-[#5B5EE5] rounded-full flex items-center justify-center"><Truck className="w-6 h-6"/></div>
             <div><h3 className="font-bold text-slate-800 text-sm dark:text-white">شحن سريع</h3><p className="text-xs text-slate-500 dark:text-slate-300">توصيل خلال 1-3 أيام</p></div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 border-r border-slate-100">
             <div className="w-12 h-12 bg-[#5B5EE5]/10 text-[#5B5EE5] rounded-full flex items-center justify-center"><ShieldCheck className="w-6 h-6"/></div>
             <div><h3 className="font-bold text-slate-800 text-sm dark:text-white">دفع آمن</h3><p className="text-xs text-slate-500 dark:text-slate-300">100% آمن</p></div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 border-r border-slate-100">
             <div className="w-12 h-12 bg-[#5B5EE5]/10 text-[#5B5EE5] rounded-full flex items-center justify-center"><BadgeDollarSign className="w-6 h-6"/></div>
             <div><h3 className="font-bold text-slate-800 text-sm dark:text-white">ضمان استرجاع</h3><p className="text-xs text-slate-500 dark:text-slate-300">استرجاع خلال 14 يوم</p></div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 border-r border-slate-100">
             <div className="w-12 h-12 bg-[#5B5EE5]/10 text-[#5B5EE5] rounded-full flex items-center justify-center"><Headphones className="w-6 h-6"/></div>
             <div><h3 className="font-bold text-slate-800 text-sm dark:text-white">دعم العملاء 24/7</h3><p className="text-xs text-slate-500 dark:text-slate-300">نحن هنا لمساعدتك</p></div>
          </div>
        </div>
        </>
        )}

        {/* Categories Section */}
        {(activePage === 'home' || activePage === 'categories') && (
        <section id="categories">
          <SectionHeader title="التصنيفات" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {(storeData?.categories?.length > 0 ? storeData.categories : [
              { n: 'عطور', icon: '🌹' }, { n: 'ملابس', icon: '👕' }, { n: 'إلكترونيات', icon: '📱' },
              { n: 'إكسسوارات', icon: '⌚' }, { n: 'أجهزة', icon: '🏠' }, { n: 'أخرى', icon: '📦' }
            ]).map((c: any, i: number) => {
               const catName = c.n || c.name || '';
               const linkedOffer = storeOffers.find((o: any) => o.category === catName);
               return (
                 <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer relative" onClick={() => { setSelectedCategory(catName); setActivePage('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md bg-white overflow-hidden flex items-center justify-center group-hover:border-[#5B5EE5] transition-all duration-300 text-4xl dark:bg-[#0f172a]">
                     {c.img && typeof c.img === 'string' && (c.img.includes('data') || c.img.includes('http')) 
                       ? <img src={c.img} alt={catName} className="w-full h-full object-cover rounded-full" /> 
                       : (c.icon || '📦')}
                   </div>
                   <span className="font-bold text-slate-700 text-sm dark:text-white">{catName}</span>
                   {linkedOffer && (
                     <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
                       {linkedOffer.discount}% خصم
                     </span>
                   )}
                 </div>
               );
            })}
          </div>
        </section>
        )}

        {/* Offers Section — dynamic offer cards with products */}
        {(activePage === 'home' || activePage === 'offers') && (() => {
          const offerBanners = storeData?.banners?.filter((b:any) => b.placement === 'offers') || [];
          return (
            <section id="offers" className="space-y-10">
              <SectionHeader title={storeData?.sectionTitles?.offers || "عروض لا تفوت"} showAll={false} />

              {/* Offer Banners (if any) */}
              {offerBanners.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {offerBanners.map((banner:any, idx:number) => (
                    <div key={idx} className="rounded-3xl overflow-hidden h-[240px] shadow-lg hover:scale-[1.02] transition duration-300">
                      <img src={banner.img} className="w-full h-full object-cover" alt={`offer-banner-${idx}`} />
                    </div>
                  ))}
                </div>
              )}

              {/* Active named offers with their products */}
              {storeOffers.length > 0 ? (
                storeOffers.map((offer: any) => {
                  const offerProductIds: string[] = offer.productIds || [];
                  const offerProducts = activeProducts.filter((p: any) => offerProductIds.includes(String(p.id)));
                  if (offerProducts.length === 0) return null;
                  return (
                    <div key={offer.id}>
                      {/* Offer heading */}
                      <div className="flex items-center gap-4 mb-5">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2 rounded-2xl shadow-md">
                          <span className="text-lg font-black">{offer.name}</span>
                          {offer.discount > 0 && <span className="bg-white/20 border border-white/30 text-xs font-black px-2.5 py-1 rounded-full dark:bg-[#0f172a]">خصم {offer.discount}%</span>}
                        </div>
                        <div className="flex-1 h-px bg-slate-200" />
                      </div>
                      {/* Offer products grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {offerProducts.map((p: any, idx: number) => {
                          const discountedPrice = offer.discount > 0 ? Math.round(p.price * (1 - offer.discount / 100)) : null;
                          return (
                            <div key={idx} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group relative p-3 dark:bg-[#0f172a]">
                              <span className="absolute top-2 left-2 bg-rose-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-black z-10">{offer.discount}% خصم</span>
                              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-3 cursor-pointer dark:bg-[#0f172a]" onClick={() => navigate(`/store/${slug}/p/${p.id}`)}>  
                                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                              </div>
                              <div className="px-1 text-center pb-1">
                                <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1 dark:text-white">{p.name}</h3>
                                <div className="flex justify-center items-center gap-2 mb-2">
                                  {discountedPrice && <span className="font-black text-rose-500 text-base">{discountedPrice} <span className="text-xs">ر.ي</span></span>}
                                  <span className={`font-bold text-slate-400 text-sm ${discountedPrice ? 'line-through' : 'text-[#5B5EE5] text-lg'}`}>{p.price} ر.ي</span>
                                </div>
                                <button onClick={() => addToCart({ ...p, discountPrice: discountedPrice })} className="w-full py-2 rounded-xl border border-[#5B5EE5] text-[#5B5EE5] font-bold text-xs hover:bg-[#5B5EE5] hover:text-white transition flex items-center justify-center gap-1">
                                  أضف للسلة
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Default placeholder banners when no offers exist */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-purple-700 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden h-[240px] flex items-center shadow-lg hover:scale-[1.02] transition duration-300 cursor-pointer">
                    <div className="relative z-10 max-w-[50%]">
                      <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-xs font-black mb-3 inline-block shadow-sm dark:bg-[#0f172a]">خصم حتى 70%</span>
                      <h3 className="text-3xl font-display font-black leading-tight mb-4">على الإلكترونيات</h3>
                      <button className="bg-white/20 border border-white/40 px-6 py-2 rounded-xl text-sm font-bold backdrop-blur-md dark:bg-[#0f172a]">استفد من العرض</button>
                    </div>
                    <img src="https://images.unsplash.com/photo-1546435770-a3e426fa99f5?w=300&h=300&fit=crop" className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-64 opacity-80" alt="Headphones" />
                  </div>
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden h-[240px] flex items-center shadow-lg hover:scale-[1.02] transition duration-300 cursor-pointer">
                    <div className="relative z-10 max-w-[60%]">
                      <h3 className="text-3xl font-display font-black leading-tight mb-2">اشتر 2 واحصل على 1 مجاناً</h3>
                      <button className="text-white hover:underline text-sm font-bold mt-4">تسوق المجموعة</button>
                    </div>
                    <img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?w=300&h=300&fit=crop" className="absolute left-0 bottom-0 w-56 opacity-90" alt="Perfume" />
                  </div>
                </div>
              )}
            </section>
          );
        })()}

        {/* Featured Products */}
        {(activePage === 'home') && (
        <section>
          <SectionHeader title={storeData?.sectionTitles?.featured || "المنتجات المميزة"} onShowAll={() => { setActivePage('featured_all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          {/* Banner for this section */}
          {storeData?.banners?.filter((b:any)=>b.placement===(storeData?.sectionTitles?.featured || "المنتجات المميزة")).map((banner:any, idx:number) => (
             <div key={idx} className="w-full h-[150px] md:h-[200px] rounded-3xl overflow-hidden mb-6 shadow-md hover:scale-[1.01] transition duration-300">
               <img src={banner.img} className="w-full h-full object-cover" />
             </div>
          ))}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {displayFeatured.map((p: any, i: number) => (
                <ProductCardItem key={i} product={p} taxIncluded={storeData?.taxIncluded} onAddToCart={addToCart} onClick={() => navigate(`/store/${slug}/p/${p.id}`)} />
             ))}
          </div>
        </section>
        )}

        {/* Most Requested */}
        {(activePage === 'home') && (
        <section>
          <SectionHeader title={storeData?.sectionTitles?.bestSellers || "الأكثر طلباً"} onShowAll={() => { setActivePage('bestsellers_all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          {/* Banner for this section */}
          {storeData?.banners?.filter((b:any)=>b.placement===(storeData?.sectionTitles?.bestSellers || "الأكثر طلباً")).map((banner:any, idx:number) => (
             <div key={idx} className="w-full h-[150px] md:h-[200px] rounded-3xl overflow-hidden mb-6 shadow-md hover:scale-[1.01] transition duration-300">
               <img src={banner.img} className="w-full h-full object-cover" />
             </div>
          ))}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {displayBestSellers.map((p: any, i: number) => (
                <ProductCardItem key={i} product={p} rank={p.rank} onAddToCart={addToCart} onClick={() => navigate(`/store/${slug}/p/${p.id}`)} />
             ))}
          </div>
        </section>
        )}

        {/* New Arrivals */}
        {(activePage === 'home') && (
        <section>
          <SectionHeader title={storeData?.sectionTitles?.newArrivals || "وصل حديثاً"} onShowAll={() => { setActivePage('newarrivals_all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          {/* Banner for this section */}
          {storeData?.banners?.filter((b:any)=>b.placement===(storeData?.sectionTitles?.newArrivals || "وصل حديثاً")).map((banner:any, idx:number) => (
             <div key={idx} className="w-full h-[150px] md:h-[200px] rounded-3xl overflow-hidden mb-6 shadow-md hover:scale-[1.01] transition duration-300">
               <img src={banner.img} className="w-full h-full object-cover" />
             </div>
          ))}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
             {displayNewArrivals.map((p: any, i: number) => (
                <ProductCardItem key={i} product={p} isNew={true} onAddToCart={addToCart} onClick={() => navigate(`/store/${slug}/p/${p.id}`)} />
             ))}
          </div>
        </section>
        )}

        {/* Custom Sections */}
        {(activePage === 'home') && (storeData?.customSections || []).map((cs: any) => {
          const tagged = (storeData?.products || []).filter((p: any) => p.section === cs.id);
          return (
            <section key={cs.id}>
              <SectionHeader title={cs.title} showAll={false} />
              {/* Banner for custom section (matching by section ID) */}
              {storeData?.banners?.filter((b:any)=>b.placement===cs.id).map((banner:any, idx:number) => (
                 <div key={idx} className="w-full h-[150px] md:h-[200px] rounded-3xl overflow-hidden mb-6 shadow-md hover:scale-[1.01] transition duration-300">
                   <img src={banner.img} className="w-full h-full object-cover" />
                 </div>
              ))}
              {tagged.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {tagged.map((p: any, i: number) => (
                    <ProductCardItem key={i} product={p} taxIncluded={storeData?.taxIncluded} onAddToCart={addToCart} onClick={() => navigate(`/store/${slug}/p/${p.id}`)} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 dark:bg-[#0f172a] dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-300">لا توجد منتجات مضافة لهذا القسم حتى الآن.</p>
                </div>
              )}
            </section>
          );
        })}

        {/* Categories Sections */}
        {(activePage === 'home') && (storeData?.categories || []).map((c: any, i: number) => {
           const catName = c.n || c.name;
           const catBanner = storeData?.banners?.find((b:any) => b.placement === catName);
           const taggedProducts = activeProducts.filter((p: any) => p.category === catName);
           
           return (
             <section key={`cat-sec-${i}`}>
                <SectionHeader title={`قسم ${catName}`} onShowAll={() => { setSelectedCategory(catName); setActivePage('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                {catBanner && (
                  <div className="w-full h-[150px] md:h-[200px] rounded-3xl overflow-hidden mb-6 shadow-md hover:scale-[1.01] transition duration-300">
                     <img src={catBanner.img} className="w-full h-full object-cover" />
                  </div>
                )}
                {taggedProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                     {taggedProducts.slice(0, 4).map((p: any, idx: number) => (
                        <ProductCardItem key={idx} product={p} taxIncluded={storeData?.taxIncluded} onAddToCart={addToCart} onClick={() => navigate(`/store/${slug}/p/${p.id}`)} />
                     ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 dark:bg-[#0f172a] dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-400 dark:text-slate-300">لا توجد منتجات مضافة لهذا القسم حتى الآن.</p>
                  </div>
                )}
             </section>
           );
        })}

        {/* All Products filtered by category */}
        {activePage === 'products' && (
          <section className="mt-4 min-h-[500px]">
            <SectionHeader title={selectedCategory ? `منتجات: ${selectedCategory}` : "جميع المنتجات"} showAll={false} />
            
            {/* Category Filter Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-4 custom-scrollbar">
              <button 
                onClick={() => setSelectedCategory(null)} 
                className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-bold transition shadow-sm border ${!selectedCategory ? 'bg-[#5B5EE5] text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300'}`}>
                الكل
              </button>
              {(storeData?.categories || []).map((c: any, i: number) => {
                const catName = c.name || c.n || '';
                return (
                  <button 
                    key={i}
                    onClick={() => setSelectedCategory(catName)} 
                    className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-bold transition shadow-sm flex items-center gap-2 border ${selectedCategory === catName ? 'bg-[#5B5EE5] text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300'}`}>
                    {c.img && typeof c.img === 'string' && c.img.includes('data') ? (
                      <img src={c.img} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <span className="text-lg">{c.icon || '📦'}</span>
                    )}
                    <span>{catName}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {(selectedCategory ? activeProducts.filter((p: any) => p.category === selectedCategory) : activeProducts).map((p:any, i:number) => (
                  <ProductCardItem key={i} product={p} taxIncluded={storeData?.taxIncluded} onAddToCart={addToCart} onClick={() => navigate(`/store/${slug}/p/${p.id}`)} />
               ))}
            </div>
            
            {(selectedCategory ? activeProducts.filter((p: any) => p.category === selectedCategory) : activeProducts).length === 0 && (
               <div className="col-span-full py-20 text-center flex flex-col items-center justify-center opacity-60">
                  <ShoppingBag className="w-16 h-16 text-slate-400 mb-4 opacity-40 dark:text-slate-300" />
                  <p className="text-xl font-bold text-slate-600 dark:text-slate-300">لا توجد منتجات مطابقة في هذا التصنيف حالياً</p>
               </div>
            )}
          </section>
        )}

        {/* View All Sections (Featured, Best Sellers, New Arrivals) */}
        {['featured_all', 'bestsellers_all', 'newarrivals_all'].includes(activePage) && (() => {
           let title = "";
           let itemsToDisplay: any[] = [];
           if (activePage === 'featured_all') {
              title = storeData?.sectionTitles?.featured || "المنتجات المميزة";
              const tagged = storeData?.products?.filter((p:any) => p.section === 'featured') || [];
              itemsToDisplay = storeData?.products?.length > 0 ? (tagged.length > 0 ? tagged : storeData.products) : activeProducts;
           } else if (activePage === 'bestsellers_all') {
              title = storeData?.sectionTitles?.bestSellers || "الأكثر طلباً";
              const tagged = storeData?.products?.filter((p:any) => p.section === 'bestsellers') || [];
              itemsToDisplay = storeData?.products?.length > 0 ? (tagged.length > 0 ? tagged : storeData.products) : mostRequested;
           } else if (activePage === 'newarrivals_all') {
              title = storeData?.sectionTitles?.newArrivals || "وصل حديثاً";
              const tagged = storeData?.products?.filter((p:any) => p.section === 'newarrivals') || [];
              itemsToDisplay = storeData?.products?.length > 0 ? (tagged.length > 0 ? tagged : [...storeData.products].reverse()) : newArrivals;
           }

           return (
             <section className="mt-4 min-h-[500px]">
               <SectionHeader title={title} showAll={false} />
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {itemsToDisplay.map((p:any, i:number) => (
                     <ProductCardItem key={i} product={p} taxIncluded={storeData?.taxIncluded} onAddToCart={addToCart} onClick={() => navigate(`/store/${slug}/p/${p.id}`)} />
                  ))}
               </div>
             </section>
           );
        })()}


        {/* Store Stats */}
        {activePage === 'home' && (
        <section className="border-t border-b border-slate-200 py-12 dark:border-slate-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
               <div className="font-display font-black text-4xl text-[#5B5EE5] mb-2">98%</div>
               <span className="font-bold text-slate-800 dark:text-white">رضا العملاء</span>
            </div>
            <div className="flex flex-col items-center text-center border-r border-slate-200 dark:border-slate-800">
               <div className="font-display font-black text-4xl text-[#5B5EE5] mb-2">500+</div>
               <span className="font-bold text-slate-800 dark:text-white">طلب يومياً</span>
            </div>
            <div className="flex flex-col items-center text-center border-r border-slate-200 dark:border-slate-800">
               <div className="font-display font-black text-4xl text-[#5B5EE5] mb-2">10,000+</div>
               <span className="font-bold text-slate-800 dark:text-white">منتج متنوع</span>
            </div>
            <div className="flex flex-col items-center text-center border-r border-slate-200 dark:border-slate-800">
               <div className="font-display font-black text-4xl text-[#5B5EE5] mb-2">50,000+</div>
               <span className="font-bold text-slate-800 dark:text-white">عميل سعيد</span>
            </div>
          </div>
        </section>
        )}

        {/* Testimonials */}
        {activePage === 'home' && (
        <section>
          <SectionHeader title="آراء العملاء" showAll={false} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition text-center relative flex flex-col items-center dark:bg-[#0f172a]">
               <div className="flex justify-center mb-4">
                 {Array(5).fill(0).map((_,i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
               </div>
               <p className="text-slate-600 font-medium leading-relaxed italic mb-6 dark:text-slate-300">"تجربة تسوق سهلة ومريحة. أنصح الجميع بالتعامل معهم، سرعة في التوصيل ومنتجات مطابقة للوصف."</p>
               <div className="flex items-center gap-3">
                 <img src="https://i.pravatar.cc/100?img=11" className="w-10 h-10 rounded-full border-2 border-slate-100" />
                 <div className="text-start">
                   <h4 className="font-bold text-sm text-slate-800 dark:text-white">محمد خالد</h4>
                   <span className="text-xs text-slate-400 dark:text-slate-300">الدمام</span>
                 </div>
               </div>
             </div>
             <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition text-center relative flex flex-col items-center dark:bg-[#0f172a]">
               <div className="flex justify-center mb-4">
                 {Array(5).fill(0).map((_,i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
               </div>
               <p className="text-slate-600 font-medium leading-relaxed italic mb-6 dark:text-slate-300">"أفضل متجر تعاملت معه، خدمة العملاء سريعة ورائعة والمنتجات أصلية 100%."</p>
               <div className="flex items-center gap-3">
                 <img src="https://i.pravatar.cc/100?img=5" className="w-10 h-10 rounded-full border-2 border-slate-100" />
                 <div className="text-start">
                   <h4 className="font-bold text-sm text-slate-800 dark:text-white">سارة علي</h4>
                   <span className="text-xs text-slate-400 dark:text-slate-300">جدة</span>
                 </div>
               </div>
             </div>
          </div>
        </section>
        )}

        {activePage === 'track' && (
          <section className="bg-white rounded-3xl p-12 text-center min-h-[500px] flex flex-col items-center justify-center border border-slate-100 shadow-sm relative overflow-hidden dark:bg-[#0f172a]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5B5EE5]/5 to-purple-500/5 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#5B5EE5]/10 rounded-3xl flex items-center justify-center mb-6 animate-bounce">
                <Truck className="w-12 h-12 text-[#5B5EE5]" />
              </div>
              <span className="bg-amber-100 text-amber-600 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">قريباً</span>
              <h2 className="text-4xl font-black text-slate-800 mb-4 dark:text-white">تتبع طلبك</h2>
              <p className="text-slate-500 mb-8 max-w-md text-lg leading-relaxed dark:text-slate-300">
                ميزة تتبع الطلبات قادمة قريباً! ستتمكن من معرفة حالة طلبك ومكانه بدقة في الوقت الفعلي.
                نعمل على تفعيل هذه الميزة في أقرب وقت
              </p>
              {storeData?.whatsapp && (
                <a href={`https://wa.me/${storeData.whatsapp.replace('+','')}?text=${encodeURIComponent('مرحباً، أريد الاستفسار عن حالة طلبي.')}`} target="_blank" className="mt-6 bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition">
                  <MessageSquare className="w-5 h-5" /> استفسر عن طلبك عبر واتساب
                </a>
              )}
            </div>
          </section>
        )}

        {activePage === 'contact' && (
          <section className="bg-white rounded-3xl p-12 text-center min-h-[400px] flex flex-col items-center justify-center border border-slate-100 shadow-sm dark:bg-[#0f172a]">
            <Headphones className="w-16 h-16 text-[#5B5EE5] mb-6 opacity-80" />
            <h2 className="text-3xl font-black text-slate-800 mb-4 dark:text-white">تواصل معنا</h2>
            <p className="text-slate-500 mb-8 max-w-md dark:text-slate-300">نحن هنا لمساعدتك والإجابة على جميع استفساراتك. لا تتردد في الاتصال بنا.</p>
            <div className="flex justify-center gap-4">
              <a href={`https://wa.me/${storeData?.whatsapp?.replace('+','')}`} target="_blank" className="bg-[#25D366] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition"><MessageSquare className="w-5 h-5"/> واتساب</a>
              <a href={`mailto:${storeData?.email || 'support@suriix.com'}`} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition dark:text-white dark:bg-[#0f172a]">البريد الإلكتروني</a>
            </div>
          </section>
        )}

        {activePage === 'login' && (
          <section className="max-w-md mx-auto">
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 dark:bg-[#0f172a]">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-[#5B5EE5]/10 text-[#5B5EE5] rounded-2xl flex items-center justify-center">
                  <LogIn className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-800 text-center mb-2 dark:text-white">{authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}</h2>
              <p className="text-slate-500 text-center text-sm mb-8 dark:text-slate-300">{authMode === 'login' ? 'أدخل بياناتك للوصول إلى حسابك' : 'سجّل حسابك واستمتع بمستوى تسوق فريد'}</p>
              <div className="space-y-4">
                {authMode === 'register' && <input type="text" placeholder="اسمك الكامل" value={authForm.name} onChange={e => setAuthForm(f => ({...f, name: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5B5EE5] transition dark:bg-[#0f172a] dark:border-slate-800" />}
                <input type="email" placeholder="البريد الإلكتروني" value={authForm.email} onChange={e => setAuthForm(f => ({...f, email: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5B5EE5] transition dark:bg-[#0f172a] dark:border-slate-800" />
                {authMode === 'register' && <input type="tel" placeholder="رقم الهاتف" value={authForm.phone} onChange={e => setAuthForm(f => ({...f, phone: e.target.value}))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#5B5EE5] transition dark:bg-[#0f172a] dark:border-slate-800" />}
                <PasswordField value={authForm.password} onChange={e => setAuthForm(f => ({...f, password: e.target.value}))} />
                {authError && <p className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-xl">{authError}</p>}
                <button onClick={authMode === 'login' ? handleLogin : handleRegister} className="w-full bg-[#5B5EE5] text-white py-4 rounded-xl font-black text-lg hover:bg-[#4a4ec4] transition shadow-lg shadow-[#5B5EE5]/30">
                  {authMode === 'login' ? 'دخول' : 'إنشاء حساب'}
                </button>
                <div className="pt-2 border-t border-slate-100 flex flex-col items-center">
                  <span className="text-xs text-slate-400 mb-4 bg-white px-3 -mt-5 dark:bg-[#0f172a] dark:text-slate-300">أو</span>
                  <button onClick={handleGoogleAuth} className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition shadow-sm dark:text-white dark:bg-[#0f172a] dark:border-slate-800">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                     المتابعة باستخدام جوجل
                  </button>
                </div>
                <p className="text-center text-sm text-slate-500 dark:text-slate-300">
                  {authMode === 'login' ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
                  <button onClick={() => { setAuthMode(m => m === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-[#5B5EE5] font-bold hover:underline">
                    {authMode === 'login' ? 'سجّل حسابك' : 'سجّل الدخول'}
                  </button>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Navigation fallback for routing logic above */}
          </>
        )}
      </main>
      </>
      )}

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
           <>
             <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]" onClick={()=>setIsCartOpen(false)} />
             <motion.div initial={{x:'-100%'}} animate={{x:0}} exit={{x:'-100%'}} transition={{type:"spring", bounce:0, duration:0.4}} className="fixed top-0 left-0 bottom-0 w-[400px] max-w-full bg-white z-[101] shadow-2xl flex flex-col p-6 rounded-r-3xl dark:bg-[#0f172a]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2 dark:text-white"><ShoppingCart className="w-6 h-6 text-[#5B5EE5]"/> سلة المشتريات</h2>
                  <button onClick={()=>setIsCartOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 border border-slate-100 transition dark:bg-[#0f172a] dark:text-slate-300"><X className="w-5 h-5"/></button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                   {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4 opacity-70 dark:text-slate-300">
                         <ShoppingBag className="w-20 h-20 opacity-30" />
                         <p className="font-bold text-lg">السلة فارغة حالياً</p>
                      </div>
                   ) : cart.map((item, i) => (
                      <div key={i} className="flex gap-4 p-3 bg-white border border-slate-200 shadow-sm rounded-2xl items-center relative group dark:bg-[#0f172a] dark:border-slate-800">
                         <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0 dark:bg-[#0f172a]">
                            <img src={item.img} className="w-full h-full object-cover MixBlendMode-multiply" alt={item.name} />
                         </div>
                         <div className="flex flex-col flex-1 pl-6 text-right">
                            <h4 className="font-bold text-sm text-slate-800 line-clamp-2 dark:text-white">{item.name}</h4>
                            <span className="text-xs text-[#5B5EE5] font-black mt-1">{item.discountPrice || item.price} ر.ي</span>
                         </div>
                         <button onClick={()=>removeFromCart(i)} className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-white hover:bg-rose-500 hover:border-transparent flex items-center justify-center shadow-sm absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition dark:bg-[#0f172a] dark:border-slate-800 dark:text-slate-300"><X className="w-3.5 h-3.5"/></button>
                      </div>
                   ))}
                </div>

                {cart.length > 0 && (
                    <div className="pt-6 border-t border-slate-100 mt-6 space-y-4">
                      {checkoutStep === 1 ? (
                        <>
                          <div className="flex gap-2">
                            <input value={cartCouponCode} onChange={e => setCartCouponCode(e.target.value)} type="text" placeholder="أدخل كود الخصم (إن وجد)" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold outline-none focus:border-[#5B5EE5] transition dark:bg-[#0f172a] dark:border-slate-800" />
                            <button onClick={applyCartCoupon} className="bg-slate-800 text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-slate-700 transition">تطبيق</button>
                          </div>

                          <div className="flex items-center justify-between font-black text-xl text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100 dark:text-white dark:bg-[#0f172a]">
                             <div className="flex flex-col">
                               <span>الإجمالي:</span>
                               {cartDiscount && <span className="text-xs text-rose-500 font-bold mt-1">شامل خصم {cartDiscount}%</span>}
                             </div>
                             <div className="flex flex-col items-end">
                               <span className="text-[#5B5EE5]">{cartTotal} ر.ي</span>
                               {cartDiscount && <span className="text-sm text-slate-400 line-through font-bold mt-0.5 dark:text-slate-300">{baseCartTotal} ر.ي</span>}
                             </div>
                          </div>
                          
                          <button onClick={() => setCheckoutStep(2)} className="w-full bg-[#5B5EE5] hover:bg-[#4a4ec4] text-white py-4 rounded-2xl font-black text-center flex items-center justify-center gap-2 shadow-lg shadow-[#5B5EE5]/30 transition mt-3">
                            متابعة الدفع
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-4">
                             <button onClick={() => setCheckoutStep(1)} className="text-slate-500 hover:text-slate-800 transition dark:text-white"><ChevronLeft className="w-5 h-5"/></button>
                             <h3 className="font-bold text-lg">اختر طريقة الدفع</h3>
                          </div>
                          <div className="space-y-3 pb-4">
                             {(() => {
                               const customMethods = storeData?.paymentMethods || [];
                               const systemMethods = [
                                 { id: 'wallet', name: 'الدفع من المحفظة', enabled: true, type: 'system' },
                                 { id: 'whatsapp', name: 'الدفع عبر واتساب', enabled: true, type: 'system' }
                               ];
                               const allMethods = [...systemMethods, ...customMethods];
                               return allMethods.filter((pm: any) => pm.enabled !== false).map((pm: any) => (
                                 <label key={pm.id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${selectedPayment?.id === pm.id ? 'border-[#5B5EE5] bg-[#5B5EE5]/5' : 'border-slate-100 bg-slate-50 hover:bg-slate-100 dark:bg-[#0f172a]'}`}>
                                    <input type="radio" className="hidden" checked={selectedPayment?.id === pm.id} onChange={() => setSelectedPayment(pm)} />
                                    <div className={`w-5 h-5 rounded-full border-2 ml-3 flex items-center justify-center ${selectedPayment?.id === pm.id ? 'border-[#5B5EE5]' : 'border-slate-300 dark:border-slate-800'}`}>
                                       {selectedPayment?.id === pm.id && <div className="w-2.5 h-2.5 rounded-full bg-[#5B5EE5]" />}
                                    </div>
                                    <div>
                                       <div className="font-bold text-slate-800 text-sm flex items-center gap-2 dark:text-white">
                                         {pm.type === 'jaib' ? '📱' : pm.type === 'bank' ? '🏦' : pm.id === 'wallet' ? <Wallet className="w-4 h-4 text-purple-500" /> : <MessageSquare className="w-4 h-4 text-[#25D366]" />} 
                                         {pm.name || (pm.type === 'bank' ? `تحويل بنكي - ${pm.bankName}` : 'تحويل محفظة جيب')}
                                       </div>
                                       {pm.type === 'bank' && <div className="text-[10px] text-slate-500 mt-1 dark:text-slate-300">حساب مستفيد: {pm.accountName} | رقم: {pm.accountNumber}</div>}
                                       {pm.type === 'jaib' && <div className="text-[10px] text-slate-500 mt-1 dark:text-slate-300">مستفيد: {pm.accountName} | رقم: {pm.jaibNumber}</div>}
                                    </div>
                                 </label>
                               ));
                             })()}
                          </div>
                          
                          <button 
                             disabled={!selectedPayment}
                             onClick={() => {
                                if (selectedPayment?.id === 'wallet') {
                                   if (!customer) { setActivePage('login'); setIsCartOpen(false); return; }
                                   if ((customer.wallet || 0) < cartTotal) { alert('رصيد المحفظة غير كافٍ. يرجى شحن رصيدك.'); return; }
                                   
                                   const newWallet = (customer.wallet || 0) - cartTotal;
                                   const newCustomer = { ...customer, wallet: newWallet };
                                   setCustomer(newCustomer);
                                   localStorage.setItem(`suriix_customer_${slug}`, JSON.stringify(newCustomer));
                                   
                                   const newOrders = cart.map((item:any) => ({
                                      id: `#ORD-${Date.now().toString().slice(-4)}${Math.floor(Math.random()*10)}`,
                                      product: item.name,
                                      price: item.activePrice || item.discountPrice || item.price,
                                      status: 'قيد المعالجة',
                                      date: new Date().toLocaleDateString('ar-SA'),
                                      img: item.img,
                                      val: `${item.activePrice || item.discountPrice || item.price} ر.ي`,
                                      cus: customer.name,
                                      d: new Date().toLocaleString('ar-SA', { weekday: 'long', hour: '2-digit', minute: '2-digit' })
                                   }));
                                   
                                   const updatedCustOrders = [...newOrders, ...customerOrders];
                                   setCustomerOrders(updatedCustOrders);
                                   localStorage.setItem(`suriix_orders_${slug}`, JSON.stringify(updatedCustOrders));
                                   
                                   const storeOrdersKey = `suriix_store_orders_${storeData?.id || (storeData as any)?.store_id}`;
                                   const storeOrders = JSON.parse(localStorage.getItem(storeOrdersKey) || '[]');
                                   const updatedStoreOrders = [...newOrders, ...storeOrders];
                                   localStorage.setItem(storeOrdersKey, JSON.stringify(updatedStoreOrders));

                                   const storeStr = localStorage.getItem('suriix_added_stores');
                                   if (storeStr) {
                                      const list = JSON.parse(storeStr);
                                      const stIndex = slug ? list.findIndex((s:any) => s.slug === slug) : 0;
                                      if (stIndex !== -1) {
                                        list[stIndex].wallet = (list[stIndex].wallet || 0) + cartTotal;
                                        list[stIndex].wallet_yer = (list[stIndex].wallet_yer || 0) + cartTotal;
                                        localStorage.setItem('suriix_added_stores', JSON.stringify(list));
                                        window.dispatchEvent(new StorageEvent('storage', { key: 'suriix_added_stores' }));
                                      }
                                   }

                                   setCart([]);
                                   setIsCartOpen(false);
                                   setCheckoutStep(1);
                                   alert('تم إتمام طلب الشراء بنجاح وخصم المبلغ من محفظتك!');
                                } else {
                                   let confirmText = `مرحباً، أود إتمام الطلب التالي من متجركم:\n\n${cart.map((c:any)=>`🔹 ${c.name} - ${c.activePrice || c.discountPrice || c.price} ر.ي`).join('\n')}`;
                                   confirmText += cartDiscount ? `\n\nكود الخصم المستخدم: ${cartCouponCode}\nالإجمالي قبل الخصم: ${baseCartTotal} ر.ي\nالإجمالي بعد الخصم: ${cartTotal} ر.ي` : `\n\nالإجمالي: ${cartTotal} ر.ي`;
                                   confirmText += `\n\nطريقة الدفع المحددة: ${selectedPayment.name}`;
                                   if (selectedPayment.type === 'bank') confirmText += `\n(أرغب بالدفع إلى حساب: ${selectedPayment.bankName} - ${selectedPayment.accountNumber})`;
                                   if (selectedPayment.type === 'jaib') confirmText += `\n(أرغب بالتحويل عبر جيب للرقم: ${selectedPayment.jaibNumber})`;
                                   confirmText += `\n\nيرجى تأكيد الطلب، وشكراً!`;
                                   
                                   window.open(`https://wa.me/${storeData?.whatsapp?.replace('+','')}?text=${encodeURIComponent(confirmText)}`, '_blank');
                                   setCart([]);
                                   setIsCartOpen(false);
                                   setCheckoutStep(1);
                                }
                             }}
                             className="w-full bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black text-center disabled:opacity-50 transition shadow-lg shadow-slate-900/30"
                          >
                            تأكيد وإتمام الطلب <CheckCircle2 className="w-5 h-5 inline-block mr-1"/>
                          </button>
                        </>
                      )}
                   </div>
                )}
             </motion.div>
           </>
        )}
      </AnimatePresence>


      {/* Footer */}
      <footer id="footer" className="bg-[#111116] text-slate-300 py-16">
         <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
               <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-[#5B5EE5] rounded-xl flex items-center justify-center text-white font-bold uppercase">{storeData?.name ? storeData.name.charAt(0) : <ShoppingBag className="w-5 h-5"/>}</div>
                 <span className="font-black text-white text-xl">{storeData?.name || 'متجر الفضة'}</span>
               </div>
               <p className="text-sm leading-relaxed text-slate-400 text-justify overflow-hidden text-ellipsis line-clamp-3 dark:text-slate-300">{(storeData?.pages?.about) ? storeData.pages.about : 'متجر إلكتروني متميز يقدم أفضل المنتجات بأفضل الأسعار. جودة عالية وخدمة موثوقة.'}</p>
            </div>
            <div>
               <h3 className="text-white font-bold mb-6">روابط هامة</h3>
               <ul className="space-y-4 text-sm text-slate-400 dark:text-slate-300">
                 {[
                   { key: 'about', label: 'من نحن' },
                   { key: 'privacy', label: 'سياسة الخصوصية' },
                   { key: 'terms', label: 'الشروط والأحكام' },
                   { key: 'returns', label: 'سياسة الاسترجاع والاستبدال' },
                 ].map(pg => (
                   <li key={pg.key}>
                     <button
                       onClick={() => setOpenStaticPage({ key: pg.key, title: pg.label })}
                       className="hover:text-white transition w-full text-right"
                     >{pg.label}</button>
                   </li>
                 ))}
               </ul>
            </div>
            <div>
               <h3 className="text-white font-bold mb-6">خدمة العملاء</h3>
               <ul className="space-y-4 text-sm text-slate-400 dark:text-slate-300">
                 {[
                   { key: 'contact', label: 'تواصل معنا' },
                   { key: 'faq', label: 'الأسئلة الشائعة' },
                   { key: 'tracking', label: 'تتبع طلبك' },
                   { key: 'howto', label: 'كيف أطلب؟' },
                 ].map(pg => (
                   <li key={pg.key}>
                     <button
                       onClick={() => setOpenStaticPage({ key: pg.key, title: pg.label })}
                       className="hover:text-white transition w-full text-right"
                     >{pg.label}</button>
                   </li>
                 ))}
               </ul>
            </div>
            <div>
               <h3 className="text-white font-bold mb-6">النشرة البريدية</h3>
               <p className="text-sm text-slate-400 mb-4 dark:text-slate-300">اشترك في نشرتنا البريدية لتصلك أحدث العروض والخصومات.</p>
               <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 dark:bg-[#0f172a]">
                 <input type="email" placeholder="أدخل بريدك الإلكتروني" className="w-full bg-transparent outline-none px-4 text-sm text-white" />
                 <button className="bg-[#5B5EE5] text-white px-4 py-2 rounded-lg font-bold text-sm shrink-0">اشتراك</button>
               </div>
            </div>
         </div>
         <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 mt-12 border-t border-white/10 text-center text-sm text-slate-500 dark:text-slate-300">
            صنع بكل حب باستخدام تقنية S U R I I X © 2026. جميع الحقوق محفوظة لمتجر {storeData?.name || 'الفضة'}.
         </div>
      </footer>

      {/* Static Page Modal */}
      <AnimatePresence>
        {openStaticPage && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4" dir="rtl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenStaticPage(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="bg-white rounded-3xl p-6 w-full max-w-2xl relative z-10 shadow-2xl max-h-[80vh] flex flex-col dark:bg-[#0f172a]">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-800 dark:text-white">{openStaticPage.title}</h3>
                <button onClick={() => setOpenStaticPage(null)} className="p-2 hover:bg-slate-100 rounded-full transition mr-auto dark:bg-[#0f172a]"><X className="w-5 h-5 text-slate-500 dark:text-slate-300"/></button>
              </div>
              <div className="overflow-y-auto flex-1 custom-scrollbar pr-2">
                {openStaticPage.key === 'contact' ? (
                  <div className="flex flex-col gap-6 pt-2 pb-6">
                     <p className="text-sm text-slate-500 mb-2 dark:text-slate-300">يمكنك التواصل معنا عبر الطرق التالية:</p>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {storeData?.whatsapp && (
                         <a href={`https://wa.me/${storeData.whatsapp.replace('+', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl hover:bg-emerald-100 transition">
                           <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0">
                             <Phone className="w-6 h-6" />
                           </div>
                           <div>
                             <p className="text-xs text-emerald-600 font-bold mb-1">واتساب</p>
                             <p className="text-sm font-bold text-slate-900 dark:text-white" dir="ltr">{storeData.whatsapp}</p>
                           </div>
                         </a>
                       )}
                       {storeData?.emailContact && (
                         <a href={`mailto:${storeData.emailContact}`} className="flex items-center gap-4 bg-blue-50 dark:bg-blue-500/10 p-4 rounded-2xl hover:bg-blue-100 transition">
                           <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center shrink-0">
                             <Mail className="w-6 h-6" />
                           </div>
                           <div>
                             <p className="text-xs text-blue-600 font-bold mb-1">البريد الإلكتروني</p>
                             <p className="text-sm font-bold text-slate-900 text-left dark:text-white">{storeData.emailContact}</p>
                           </div>
                         </a>
                       )}
                       {storeData?.instagram && (
                         <a href={`https://${storeData.instagram.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-pink-50 dark:bg-pink-500/10 p-4 rounded-2xl hover:bg-pink-100 transition">
                           <div className="w-12 h-12 bg-[#E1306C] text-white rounded-xl flex items-center justify-center shrink-0">
                             <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                           </div>
                           <div>
                             <p className="text-xs text-pink-600 font-bold mb-1">إنستجرام</p>
                             <p className="text-sm font-bold text-slate-900 text-left dark:text-white">{storeData.instagram}</p>
                           </div>
                         </a>
                       )}
                       {storeData?.facebook && (
                         <a href={`https://${storeData.facebook.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-500/10 p-4 rounded-2xl hover:bg-indigo-100 transition">
                           <div className="w-12 h-12 bg-[#1877F2] text-white rounded-xl flex items-center justify-center shrink-0">
                             <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                           </div>
                           <div>
                             <p className="text-xs text-indigo-600 font-bold mb-1">فيسبوك</p>
                             <p className="text-sm font-bold text-slate-900 text-left dark:text-white">{storeData.facebook}</p>
                           </div>
                         </a>
                       )}
                       {storeData?.tiktok && (
                         <a href={`https://${storeData.tiktok.replace(/^https?:\/\//, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-4 rounded-2xl hover:bg-slate-200 transition">
                           <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shrink-0">
                             <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                           </div>
                           <div>
                             <p className="text-xs text-slate-600 font-bold mb-1 dark:text-slate-300">تيك توك</p>
                             <p className="text-sm font-bold text-slate-900 text-left dark:text-white" dir="ltr">{storeData.tiktok}</p>
                           </div>
                         </a>
                       )}
                     </div>
                  </div>
                ) : storeData?.pages?.[openStaticPage.key] ? (
                  <p className="text-sm text-slate-700 leading-loose whitespace-pre-wrap font-medium dark:text-white">{storeData.pages[openStaticPage.key]}</p>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <span className="text-4xl mb-4">📄</span>
                    <p className="text-slate-400 font-bold dark:text-slate-300">لم يتم إضافة محتوى لهذه الصفحة بعد.</p>
                    <p className="text-xs text-slate-400 mt-2 dark:text-slate-300">يمكن لصاحب المتجر إضافة المحتوى من لوحة التحكم &larr; صفحات المتجر.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
const PasswordField = ({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        placeholder="كلمة المرور"
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 outline-none focus:border-[#5B5EE5] transition dark:bg-[#0f172a] dark:border-slate-800"
      />
      <button
        type="button"
        onClick={() => setShow(v => !v)}
        className="absolute left-3 top-3 text-slate-400 hover:text-slate-700 transition-colors dark:text-white"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default PublicStore;
