import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, CheckCircle2, ArrowLeftRight, Plus, Clock, FileText, ArrowDownToLine, ArrowUpFromLine, Activity, Calendar, Zap, Headset, ChevronLeft, Wallet } from 'lucide-react';
import { WalletRechargeModal } from './WalletRechargeModal';
import { TransferModal, InvoiceModal } from './WalletTransactionModals';

export const WalletTabV3 = React.memo(({ storeData, transactions = [], onRecharge, onTransfer }: { storeData: any, transactions?: any[], onRecharge?: (amount: number, currency: string) => void, onTransfer?: (amount: number) => void }) => {
  const currency = 'YER';

  const currencies = {
    YER: { label: 'ر.ي', name: 'ريال يمني', field: 'wallet_yer' },
  } as const;

  const currentSettings = currencies[currency];
  const currentBalance = storeData?.[currentSettings.field] ?? storeData?.wallet ?? 0;

  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleAddBalance = () => {
    setShowRechargeModal(true);
  };

  return (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1,y:0}} className="space-y-6 max-w-6xl mx-auto pt-4 pb-12 w-full px-4 md:px-0">
      

      {/* Wallet Banner Redesign */}
      <div className="bg-gradient-to-br from-[#17054B] via-[#2D1173] to-[#471E97] rounded-[32px] overflow-hidden relative text-white shadow-xl shadow-indigo-500/10 mb-8 border border-white/5">
         {/* Background decorative circles */}
         <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-20 w-[400px] h-[400px] rounded-full border-[40px] border-white/5 blur-sm"></div>
            <div className="absolute top-20 right-40 w-60 h-60 rounded-full border-[20px] border-white/5 blur-sm"></div>
            <div className="absolute -bottom-20 right-80 w-80 h-80 rounded-full border-[30px] border-white/5 blur-sm"></div>
         </div>
         
         <div className="p-8 md:p-12 flex flex-col-reverse lg:flex-row justify-between items-center gap-10 relative z-10 w-full">
            
            {/* Left Glassmorphic Card */}
            <div className="w-full lg:w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 lg:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[280px] dark:bg-[#0f172a]">
               {/* Inner glow effect */}
               <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
               
               <div className="flex justify-between items-start mb-12 w-full relative z-10 text-right">
                  <div className="w-full">
                     <h2 className="font-black text-2xl md:text-3xl text-white mb-2 font-display">رصيد المحفظة</h2>
                     <p className="text-white/80 text-xs md:text-sm lg:text-base leading-relaxed">استخدم رصيدك لدفع الاشتراكات<br/>وشراء الخدمات الإضافية.</p>
                  </div>
               </div>
               
               <div className="relative z-10 flex flex-row-reverse justify-between items-center w-full gap-4 mb-8">
                 <div className="text-right flex-1">
                    <div className="text-5xl md:text-6xl font-black mb-1 leading-tight text-right flex flex-row-reverse items-baseline justify-end gap-3 drop-shadow-md">
                       <span className="text-xl md:text-2xl font-bold">{currentSettings.label}</span>
                       <span>{Number(currentBalance).toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] md:text-xs text-white/70 flex flex-row-reverse items-center gap-1.5 justify-end mt-2">
                       <CheckCircle2 className="w-4 h-4"/> رصيد متاح للاستخدام
                    </p>
                 </div>
                 <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner shrink-0 text-white dark:bg-[#0f172a]">
                   <Wallet className="w-6 h-6" />
                 </div>
               </div>
               
               <div className="relative z-10 w-full mt-auto">
                  <button onClick={handleAddBalance} className="w-full bg-white text-[#471E97] font-bold py-4 rounded-2xl flex flex-row-reverse items-center justify-center gap-2 hover:bg-white/90 transition shadow-lg hover:scale-[1.02] text-base md:text-lg dark:bg-[#0f172a]">
                     <Plus className="w-5 h-5"/> <span>إضافة رصيد</span>
                  </button>
               </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 text-center lg:text-right w-full lg:pr-6">

               
               <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 drop-shadow-md text-white">محفظتك الرقمية الذكية</h2>
               <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 lg:ml-auto">
                 يمكنك استخدام الرصيد الحالي لدفع رسوم الاشتراكات وتفعيل متجرك بشكل فوري. يتم الدفع باستخدام {currentSettings.name}.
               </p>
               
               <div className="flex flex-row-reverse items-center justify-center lg:justify-start gap-2 text-[10px] md:text-xs bg-white/5 backdrop-blur-sm px-4 md:px-5 py-2.5 rounded-full w-fit border border-white/10 lg:mr-auto lg:ml-0 shadow-inner dark:bg-[#0f172a]">
                  <ShieldCheck className="w-4 h-4 text-blue-300" /> 
                  <span className="text-white/90 font-medium">معاملات آمنة 100% وحماية بتقنيات التشفير</span>
               </div>
            </div>

         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full" dir="rtl">
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-6 text-center h-full dark:border-slate-800">
               <h3 className="font-bold text-lg mb-6 text-right w-full">إجراءات سريعة</h3>
               <div className="grid grid-cols-2 gap-3 mb-6">
                  <button onClick={handleAddBalance} className="border border-border/50 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition bg-muted/20 hover:bg-muted/40">
                     <CreditCard className="w-6 h-6 text-primary" />
                     <span className="text-xs font-bold text-foreground">شحن الرصيد</span>
                  </button>
                  <button onClick={() => setShowTransferModal(true)} className="border border-border/50 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition bg-muted/20 hover:bg-muted/40">
                     <ArrowLeftRight className="w-6 h-6 text-primary" />
                     <span className="text-xs font-bold text-foreground">تحويل الرصيد</span>
                  </button>
                  <button onClick={() => document.getElementById('recent-transactions-section')?.scrollIntoView({behavior: 'smooth'})} className="border border-border/50 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition bg-muted/20 hover:bg-muted/40">
                     <Clock className="w-6 h-6 text-primary" />
                     <span className="text-xs font-bold text-foreground">المعاملات</span>
                  </button>
                  <button onClick={() => setShowInvoiceModal(true)} className="border border-border/50 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary/50 transition bg-muted/20 hover:bg-muted/40">
                     <FileText className="w-6 h-6 text-primary" />
                     <span className="text-xs font-bold text-foreground">الفواتير</span>
                  </button>
               </div>
               
               <div className="bg-[#eff0fe] dark:bg-primary/20 rounded-xl p-4 border border-[#e0e2fa] dark:border-primary/30 text-right flex flex-col items-center text-center gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-50"><ShieldCheck className="w-16 h-16 text-primary"/></div>
                  <div className="relative z-10 w-full text-center">
                    <h4 className="font-bold text-primary text-sm mb-2 px-2 leading-tight">اشحن محفظتك الآن واستفد من جميع خدماتنا</h4>
                    <p className="text-[10px] text-primary/80 leading-relaxed max-w-[90%] mx-auto font-medium">طريقة دفع آمنة وسريعة وموثوقة في جميع الخدمات</p>
                  </div>
                  <button onClick={handleAddBalance} className="bg-primary hover:bg-[#4F46E5] text-white text-xs font-bold px-8 py-2.5 rounded-lg shrink-0 mt-1 relative z-10 w-full mb-1">شحن الآن</button>
               </div>
            </div>
         </div>

         <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-6 h-full dark:border-slate-800">
               <h3 className="font-bold text-lg mb-6 text-right border-b border-border/40 pb-4 dark:border-slate-800">ملخص المحفظة</h3>
               <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between py-3 border-b border-border/30 border-dashed">
                     <div className="flex flex-row items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-500"><ArrowDownToLine className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-foreground">إجمالي الشحنات</span>
                     </div>
                     <span className="font-bold text-sm">0 {currentSettings.label}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border/30 border-dashed">
                     <div className="flex flex-row items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><ArrowUpFromLine className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-foreground">إجمالي المدفوعات</span>
                     </div>
                     <span className="font-bold text-sm">0 {currentSettings.label}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-border/30 border-dashed">
                     <div className="flex flex-row items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500"><Activity className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-foreground">عدد المعاملات</span>
                     </div>
                     <span className="font-bold text-sm">0</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                     <div className="flex flex-row items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500"><Calendar className="w-4 h-4" /></div>
                        <span className="text-sm font-bold text-foreground">آخر عملية</span>
                     </div>
                     <span className="font-bold text-sm">-</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="lg:col-span-5" id="recent-transactions-section">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-border/40 shadow-sm p-6 h-full flex flex-col dark:border-slate-800">
               <div className="flex justify-between items-center mb-6 w-full text-right">
                  <h3 className="font-bold text-lg truncate flex-1">آخر المعاملات ({currentSettings.name})</h3>
                  <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline text-left">عرض الكل <ChevronLeft className="w-4 h-4"/></button>
               </div>
                {transactions && transactions.length > 0 ? (
                    <div className="flex-1 mt-4 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                       {transactions.slice(0, 5).map((t, i) => (
                           <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-primary/30 transition shadow-sm hover:shadow-md bg-white dark:bg-[#0f172a]">
                               <div className="flex items-center gap-3">
                                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'transfer' ? 'bg-amber-50 text-amber-500' : t.type === 'recharge' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'}`}>
                                       {t.type === 'transfer' ? <ArrowUpFromLine className="w-5 h-5"/> : t.type === 'recharge' ? <ArrowDownToLine className="w-5 h-5"/> : <Activity className="w-5 h-5"/>}
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-sm text-slate-800 dark:text-white">{t.description || (t.type === 'transfer' ? 'تحويل رصيد للإدارة' : t.type === 'recharge' ? 'شحن رصيد' : 'عملية')}</h4>
                                       <p className="text-[10px] text-muted-foreground">{new Date(t.created_at || Date.now()).toLocaleDateString('ar-YE')}</p>
                                   </div>
                               </div>
                               <div className={`font-bold text-sm text-left min-w-[70px] ${t.type === 'transfer' || t.amount < 0 ? 'text-red-500' : 'text-green-500'}`} dir="ltr">
                                   {t.type === 'transfer' || t.amount < 0 ? '-' : ''}{Math.abs(t.amount || 0).toLocaleString()} {currentSettings.label}
                               </div>
                           </div>
                       ))}
                    </div>
                ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 mt-6 md:mt-2 bg-slate-50/50 rounded-xl p-8 border border-border/20 border-dashed dark:bg-[#0f172a]">
                      <div className="w-24 h-24 bg-[#f8f5ff] rounded-full flex items-center justify-center mb-6">
                         <FileText className="w-10 h-10 text-[#d8c8fb]" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2">لا توجد معاملات حتى الآن</h4>
                      <p className="text-xs text-muted-foreground w-3/4">ستظهر معاملاتك هنا بعد تنفيذ أي عملية</p>
                   </div>
                )}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white rounded-2xl border border-border/40 p-6 shadow-sm mt-6 w-full dark:bg-[#0f172a] dark:border-slate-800" dir="rtl">
         <div className="flex flex-col items-center text-center py-2 h-full justify-center">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-primary shrink-0 mb-3"><Calendar className="w-5 h-5"/></div>
            <div>
               <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-white">تقارير وفواتير</h4>
               <p className="text-[10px] text-muted-foreground font-medium">تابع جميع عملياتك بسهولة</p>
            </div>
         </div>
         <div className="flex flex-col items-center text-center py-2 h-full justify-center border-t lg:border-t-0 lg:border-r border-border/40 pt-6 lg:pt-2 dark:border-slate-800">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 shrink-0 mb-3"><Zap className="w-5 h-5"/></div>
            <div>
               <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-white">دفع فوري</h4>
               <p className="text-[10px] text-muted-foreground font-medium">تفعيل الخدمات فوراً</p>
            </div>
         </div>
         <div className="flex flex-col items-center text-center py-2 h-full justify-center border-t border-border/40 pt-6 lg:pt-2 lg:border-t-0 lg:border-r dark:border-slate-800">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0 mb-3"><ShieldCheck className="w-5 h-5"/></div>
            <div>
               <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-white">أمان وحماية عالية</h4>
               <p className="text-[10px] text-muted-foreground font-medium">حماية بياناتك ومعاملاتك</p>
            </div>
         </div>
         <div className="flex flex-col items-center text-center py-2 h-full justify-center border-t lg:border-t-0 lg:border-r border-border/40 pt-6 lg:pt-2 dark:border-slate-800">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shrink-0 mb-3"><Headset className="w-5 h-5"/></div>
            <div>
               <h4 className="font-bold text-sm mb-1 text-slate-800 dark:text-white">دعم فني 24/7</h4>
               <p className="text-[10px] text-muted-foreground font-medium">مساعدة في أي وقت</p>
            </div>
         </div>
      </div>

      <WalletRechargeModal 
        isOpen={showRechargeModal} 
        onClose={() => setShowRechargeModal(false)}
        currentBalance={currentBalance}
        currentSettings={currentSettings}
        onRecharge={onRecharge}
      />

      <TransferModal 
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        currentBalance={currentBalance}
        currentSettings={currentSettings}
        onTransfer={onTransfer}
      />

      <InvoiceModal 
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        storeData={storeData}
        transactions={transactions}
        currentSettings={currentSettings}
      />
    </motion.div>
  );
});
