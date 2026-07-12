import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wallet, Copy, CheckCircle2, Building2, Smartphone, MessageCircle, AlertCircle } from 'lucide-react';

interface WalletRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  currentSettings: { label: string; name: string; field: string };
  onRecharge?: (amount: number, currency: string) => void;
}

export const WalletRechargeModal: React.FC<WalletRechargeModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  currentSettings,
  onRecharge
}) => {
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'card' | 'wallet'>('bank');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRecharge = () => {
    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      alert('يرجى إدخال مبلغ صحيح');
      return;
    }
    
    const message = encodeURIComponent(`مرحباً، أود إشعاركم بإجراء عملية تحويل لإضافة رصيد في منصة SURIIX.
المبلغ: ${amount} ${currentSettings.label}
طريقة الدفع: ${paymentMethod === 'bank' ? 'بنك الكريمي' : 'محفظة جيب'}

*لقد تأكدت من إرفاق صورة/لقطة شاشة للتحويل مع هذه الرسالة.*`);
    
    window.open(`https://wa.me/967780930635?text=${message}`, '_blank');

    if (onRecharge) {
       onRecharge(numAmount, currentSettings.field.split('_')[1].toUpperCase());
       onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" dir="rtl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-[#fafafa] dark:bg-[#0f172a] rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 bg-primary text-white flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 100% 50%, white 20%, transparent 21%)', backgroundSize: '20px 20px' }}></div>
            <div className="flex flex-row-reverse w-full items-center justify-between z-10">
               <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition text-white dark:bg-[#0f172a]">
                 <ArrowRight className="w-5 h-5 rotate-180" />
               </button>
               <h2 className="text-xl font-bold">إضافة الرصيد إلى المحفظة</h2>
               <div className="w-10 h-10 bg-white/20 rounded-[14px] flex items-center justify-center border border-white/10 dark:bg-[#0f172a]">
                 <Wallet className="w-5 h-5 text-white" />
               </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-[20px] p-6 text-center relative overflow-hidden shadow-md">
               <div className="absolute top-1/2 left-4 -translate-y-1/2 opacity-20 pointer-events-none">
                 <Wallet className="w-24 h-24" />
               </div>
               <div className="relative z-10 text-right pr-2">
                  <p className="text-white/80 text-sm font-medium mb-2">الرصيد الحالي</p>
                  <div className="text-4xl font-bold flex flex-row-reverse items-center justify-end gap-2">
                    <span className="text-lg font-bold">{currentSettings.label}</span>
                    <span>{Number(currentBalance).toLocaleString()}</span>
                  </div>
               </div>
            </div>

            {/* Amount Section */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 mb-3 text-right dark:text-white">المبلغ</h3>
              <div className="relative mb-3 flex flex-row-reverse">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="أدخل المبلغ"
                  className="w-full bg-white border border-slate-200 rounded-[14px] px-4 pl-16 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-lg font-bold text-right dark:bg-[#0f172a] dark:border-slate-800"
                  dir="ltr"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-500 dark:text-slate-300 font-bold bg-slate-50 dark:bg-[#1a1a2e] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  {currentSettings.label}
                </div>
              </div>
              <div className="grid grid-cols-3 flex-row-reverse gap-2" dir="ltr">
                 {[8000, 16000, 43000].map(val => (
                   <button 
                     key={val} 
                     onClick={() => setAmount(val.toString())}
                     className="bg-white dark:bg-[#1a1a2e] border text-primary border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 font-bold py-2 rounded-xl transition text-[15px]"
                   >
                     {val.toLocaleString()}
                   </button>
                 ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-[15px] font-bold text-slate-800 mb-3 text-right dark:text-white">طريقة الدفع</h3>
              <div className="space-y-3">
                
                {/* Bank Transfer */}
                <div 
                  onClick={() => setPaymentMethod('bank')}
                  className={`cursor-pointer rounded-[16px] border-2 transition-all p-4 ${paymentMethod === 'bank' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200 dark:bg-[#0f172a] dark:border-slate-800'}`}
                >
                  <div className="flex flex-row-reverse items-center justify-between">
                    <div className="flex flex-row-reverse items-center gap-3">
                      <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold text-slate-800 text-[15px] dark:text-white">بنك الكريمي</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 dark:text-slate-300">التحويل عبر فروع أو تطبيق الكريمي جوال</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bank' ? 'border-primary' : 'border-slate-300 dark:border-slate-800'}`}>
                      {paymentMethod === 'bank' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                    </div>
                  </div>

                  {paymentMethod === 'bank' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mt-4 border-t border-slate-100 pt-4 cursor-default" onClick={e=>e.stopPropagation()}>
                       <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-3 mb-4 text-center text-[13px] font-bold text-slate-700 dark:text-amber-300 border border-amber-100 dark:border-amber-800/40">
                          ملاحظة باسم: م/ معتز وائل نبيل الصريمي
                       </div>
                       <p className="text-[13px] font-bold text-primary mb-3 text-right">أرقام الحسابات:</p>
                       <div className="space-y-2.5">
                         {[
                           { label: 'ريال يمني', num: '3156288518' },
                         ].map(acc => (
                           <div key={acc.num} className="flex flex-row-reverse items-center justify-between bg-white border border-slate-100 shadow-sm rounded-xl p-2.5 hover:border-primary/20 transition dark:bg-[#0f172a]">
                             <div className="flex flex-row-reverse items-center gap-3">
                               <span className="text-[13px] font-bold w-20 text-slate-500 text-right dark:text-slate-300">{acc.label}</span>
                               <span className="font-bold tracking-wider text-slate-800 text-[15px] dark:text-white" dir="ltr">{acc.num}</span>
                             </div>
                             <button onClick={(e) => { e.stopPropagation(); handleCopy(acc.num); }} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition" title="نسخ الرقم">
                                {copiedText === acc.num ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
                             </button>
                           </div>
                         ))}
                       </div>
                    </motion.div>
                  )}
                </div>


                {/* E-Wallet */}
                <div 
                  onClick={() => setPaymentMethod('wallet')}
                  className={`cursor-pointer rounded-[16px] border-2 transition-all p-4 ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200 dark:bg-[#0f172a] dark:border-slate-800'}`}
                >
                  <div className="flex flex-row-reverse items-center justify-between">
                    <div className="flex flex-row-reverse items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold text-slate-800 text-[15px] dark:text-white">محفظة جيب (JAIB)</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 dark:text-slate-300">التحويل عبر تطبيق محفظة جيب الإلكترونية (JAIB)</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-primary' : 'border-slate-300 dark:border-slate-800'}`}>
                      {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                    </div>
                  </div>

                  {paymentMethod === 'wallet' && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="mt-4 border-t border-slate-100 pt-4 cursor-default text-right" onClick={e=>e.stopPropagation()}>
                       <div className="bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl p-3 mb-4 text-center text-[13px] font-bold text-slate-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/40">
                          ملاحظة باسم: م/ معتز وائل نبيل الصريمي
                       </div>
                       <p className="text-[13px] font-bold text-primary mb-3">رقم المحفظة:</p>
                       <div className="flex flex-row-reverse items-center justify-between bg-white border border-slate-100 shadow-sm rounded-xl p-2.5 hover:border-primary/20 transition dark:bg-[#0f172a]">
                         <div className="flex flex-row-reverse items-center gap-3">
                           <span className="text-[13px] font-bold w-12 text-slate-500 text-right dark:text-slate-300">الرقم</span>
                           <span className="font-bold tracking-wider text-slate-800 text-[15px] dark:text-white" dir="ltr">4666692</span>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); handleCopy('4666692'); }} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition" title="نسخ الرقم">
                            {copiedText === '4666692' ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4"/>}
                         </button>
                       </div>
                    </motion.div>
                  )}
                </div>

              </div>
            </div>

          </div>

          <div className="p-4 bg-white dark:bg-[#0c0c14] border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 flex flex-row-reverse items-start gap-2 text-right">
               <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
               <p className="text-xs font-bold text-amber-800 leading-relaxed">يرجى الانتباه: يجب تصوير عملية الدفع (التحويل البنكي أو المحفظة) وإرسال الصورة عبر الواتساب لتأكيد العملية وإضافة الرصيد.</p>
            </div>
            <button 
              onClick={handleRecharge}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-[14px] flex flex-row-reverse items-center justify-center gap-2 transition shadow-sm shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5" />
              <span>تأكيد الشحن وإرسال الإيصال عبر الواتساب</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
